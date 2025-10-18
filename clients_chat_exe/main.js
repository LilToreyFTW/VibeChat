const { app, BrowserWindow, Menu, ipcMain, shell, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const express = require('express');
const { exec, spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

// Service Manager for running backend services invisibly
class ServiceManager {
    constructor() {
        this.services = new Map();
        this.isWindows = process.platform === 'win32';
        this.serviceStatus = 'stopped';
    }

    async startAllServices() {
        logDebug('Starting all backend services...');

        try {
            // Start services in order of dependencies
            await this.startJavaBackend();
            await this.startChatRooms();
            await this.startPythonService();
            await this.startHttpServer();

            this.serviceStatus = 'running';
            logDebug('All backend services started successfully');
        } catch (error) {
            logError('Failed to start backend services: ' + error.message, error.stack);

            // Show user-friendly error message
            if (mainWindow) {
                mainWindow.webContents.send('service-startup-error', {
                    message: 'Some backend services failed to start. The app will continue with limited functionality.',
                    details: error.message
                });
            }

            // Don't throw error, let the app continue without all services
            logDebug('Continuing app startup despite service failures...');
        }
    }

    async startJavaBackend() {
        return new Promise((resolve, reject) => {
            // In development, look relative to the exe file location
            // In production, the backend will be in the same directory as the exe
            let backendPath;
            if (isDev) {
                backendPath = path.join(__dirname, '..', 'backend');
            } else {
                // In production, backend is in the same directory as the app
                backendPath = path.join(path.dirname(app.getPath('exe')), 'backend');
            }

            const jarPath = path.join(backendPath, 'target', 'vibechat-backend-1.0.0.jar');

            if (!require('fs').existsSync(jarPath)) {
                logDebug(`Java backend JAR not found at ${jarPath}, skipping...`);
                logDebug('This is normal if Java backend is not needed or not built yet.');
                resolve();
                return;
            }

            logDebug(`Starting Java backend service from ${jarPath}...`);

            // Check if Java is available
            const javaProcess = spawn('java', ['-version'], {
                stdio: 'pipe'
            });

            javaProcess.on('error', (error) => {
                logError('Java runtime not found. Please install Java 17 or later.', error.message);
                logDebug('Java backend will be skipped. App will work without Java services.');

                // Show user-friendly error message in the app
                if (mainWindow) {
                    mainWindow.webContents.send('service-error', {
                        service: 'Java Backend',
                        message: 'Java runtime not found. The app will work without Java services, but some features may be limited.',
                        suggestion: 'Please install Java 17 or later from https://adoptium.net/'
                    });
                }

                resolve();
            });

            javaProcess.on('exit', (code) => {
                if (code === 0) {
                    // Java is available, start the backend
                    const backendProcess = spawn('java', ['-jar', jarPath], {
                        cwd: backendPath,
                        detached: true,
                        stdio: 'ignore',
                        windowsHide: true
                    });

                    backendProcess.unref();

                    this.services.set('java-backend', {
                        process: backendProcess,
                        port: 8080,
                        url: 'http://localhost:8080'
                    });

                    // Wait for service to be ready
                    setTimeout(() => {
                        this.checkServiceHealth('http://localhost:8080/actuator/health', resolve, reject);
                    }, 5000);
                } else {
                    logError('Java runtime check failed. Java backend will be skipped.');
                    resolve();
                }
            });
        });
    }

    async startChatRooms() {
        return new Promise((resolve, reject) => {
            let chatRoomsPath;
            if (isDev) {
                chatRoomsPath = path.join(__dirname, '..', 'chat-rooms');
            } else {
                chatRoomsPath = path.join(path.dirname(app.getPath('exe')), 'chat-rooms');
            }

            if (!require('fs').existsSync(path.join(chatRoomsPath, 'room-server.js'))) {
                logDebug('Chat rooms server not found, skipping...');
                resolve();
                return;
            }

            logDebug('Starting chat rooms service...');

            const nodeProcess = spawn('node', ['room-server.js'], {
                cwd: chatRoomsPath,
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            });

            nodeProcess.unref();

            this.services.set('chat-rooms', {
                process: nodeProcess,
                port: 3001,
                url: 'http://localhost:3001'
            });

            // Wait for service to be ready
            setTimeout(() => {
                this.checkServiceHealth('http://localhost:3001/health', resolve, reject);
            }, 2000);
        });
    }

    async startPythonService() {
        return new Promise((resolve, reject) => {
            let pythonServicePath;
            if (isDev) {
                pythonServicePath = path.join(__dirname, '..', 'python-service');
            } else {
                pythonServicePath = path.join(path.dirname(app.getPath('exe')), 'python-service');
            }

            if (!require('fs').existsSync(path.join(pythonServicePath, 'app', 'main.py'))) {
                logDebug('Python service not found, skipping...');
                resolve();
                return;
            }

            logDebug('Starting Python AI service...');

            // Try to run the Python service directly first
            const pythonProcess = spawn('python', ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000'], {
                cwd: pythonServicePath,
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            });

            pythonProcess.unref();

            this.services.set('python-service', {
                process: pythonProcess,
                port: 8000,
                url: 'http://localhost:8000'
            });

            // Wait for service to be ready
            setTimeout(() => {
                this.checkServiceHealth('http://localhost:8000/docs', resolve, reject);
            }, 5000);
        });
    }

    async startHttpServer() {
        return new Promise((resolve, reject) => {
            let httpServerPath;
            if (isDev) {
                httpServerPath = path.join(__dirname, '..', 'http_server_files');
            } else {
                httpServerPath = path.join(path.dirname(app.getPath('exe')), 'http_server_files');
            }

            if (!require('fs').existsSync(path.join(httpServerPath, 'server.js'))) {
                logDebug('HTTP server not found, skipping...');
                resolve();
                return;
            }

            logDebug('Starting HTTP server...');

            const nodeProcess = spawn('node', ['server.js'], {
                cwd: httpServerPath,
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            });

            nodeProcess.unref();

            this.services.set('http-server', {
                process: nodeProcess,
                port: 8081,
                url: 'http://localhost:8081'
            });

            // Wait for service to be ready
            setTimeout(() => {
                this.checkServiceHealth('http://localhost:8081/', resolve, reject);
            }, 2000);
        });
    }

    checkServiceHealth(url, resolve, reject) {
        const http = url.startsWith('https') ? require('https') : require('http');

        const req = http.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                logDebug(`Service health check passed for ${url}`);
                resolve();
            } else {
                reject(new Error(`Service health check failed: ${res.statusCode}`));
            }
        });

        req.on('error', (err) => {
            logDebug(`Service health check error for ${url}: ${err.message}`);
            // Don't reject here, just resolve - service might still be starting
            resolve();
        });

        req.setTimeout(5000, () => {
            req.destroy();
            resolve(); // Timeout, but don't fail the startup
        });
    }

    async stopAllServices() {
        logDebug('Stopping all backend services...');

        for (const [name, service] of this.services) {
            try {
                if (service.process && !service.process.killed) {
                    if (this.isWindows) {
                        // On Windows, kill the process tree
                        exec(`taskkill /pid ${service.process.pid} /T /F`, (error) => {
                            if (error) {
                                logDebug(`Failed to kill ${name}: ${error.message}`);
                            } else {
                                logDebug(`Killed ${name} service`);
                            }
                        });
                    } else {
                        service.process.kill('SIGTERM');
                    }
                }
            } catch (error) {
                logDebug(`Error stopping ${name}: ${error.message}`);
            }
        }

        this.services.clear();
        this.serviceStatus = 'stopped';
    }

    getServiceStatus() {
        return {
            status: this.serviceStatus,
            services: Array.from(this.services.entries()).map(([name, service]) => ({
                name,
                port: service.port,
                url: service.url,
                running: service.process && !service.process.killed
            }))
        };
    }
}

// Express server for serving the React app
let expressApp;
let expressServer;

function setupExpressServer() {
  expressApp = express();

  // Serve static files from the build directory
  const buildPath = path.join(__dirname, 'build');
  expressApp.use(express.static(buildPath));

  // API proxy routes for Electron environment
  expressApp.use('/api', (req, res) => {
    // Proxy API requests to the Java backend
    const targetUrl = `http://localhost:8080${req.path}`;
    logDebug(`Proxying API request: ${req.method} ${req.path} -> ${targetUrl}`);

    // For now, return mock responses for development
    if (req.path.includes('/auth/login')) {
      res.json({
        success: true,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user'
        },
        token: 'mock-jwt-token'
      });
    } else if (req.path.includes('/rooms')) {
      res.json({
        success: true,
        rooms: [
          {
            id: '1',
            name: 'General Chat',
            description: 'General discussion room',
            category: 'general',
            activeUsers: 5,
            maxUsers: 100
          }
        ]
      });
    } else {
      res.json({ success: true, message: 'Mock API response' });
    }
  });

  // Handle client-side routing - serve index.html for all non-API routes
  expressApp.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });

  // Start the server on a different port than the backend services
  const PORT = 3002;
  expressServer = expressApp.listen(PORT, () => {
    logDebug(`Express server running on http://localhost:${PORT}`);
  });
}

// Global service manager instance
const serviceManager = new ServiceManager();

// AI Updater System
class AIUpdater {
    constructor() {
        this.updateInterval = 30000; // Check every 30 seconds
        this.autoUpdateEnabled = !isDev;
        this.lastUpdateCheck = 0;
        this.updateInProgress = false;
        this.debugLogs = [];
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp}: ${message}`;
        this.debugLogs.push(logEntry);

        // Keep only last 1000 logs
        if (this.debugLogs.length > 1000) {
            this.debugLogs = this.debugLogs.slice(-1000);
        }

        console.log(`[AI Updater] ${message}`);

        // Send log to renderer if window exists
        if (mainWindow) {
            mainWindow.webContents.send('ai-updater-log', logEntry);
        }
    }

    async checkForUpdates() {
        if (!this.autoUpdateEnabled) {
            this.log('Auto-update disabled in development mode');
            return;
        }

        const now = Date.now();
        if (now - this.lastUpdateCheck < this.updateInterval) {
            return; // Don't check too frequently
        }

        this.lastUpdateCheck = now;
        this.log('Checking for updates...');

        try {
            // Check multiple update sources
            const updateSources = [
                'https://api.github.com/repos/your-org/vibechat/releases/latest',
                'http://localhost:3001/updates/latest.json'
            ];

            for (const source of updateSources) {
                try {
                    const update = await this.fetchUpdateInfo(source);
                    if (update && this.shouldUpdate(update)) {
                        await this.performUpdate(update);
                        break;
                    }
                } catch (error) {
                    this.log(`Failed to check ${source}: ${error.message}`);
                }
            }
        } catch (error) {
            this.log(`Update check failed: ${error.message}`);
        }
    }

    async fetchUpdateInfo(source) {
        return new Promise((resolve, reject) => {
            const protocol = source.startsWith('https:') ? https : http;

            const req = protocol.request(source, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const update = JSON.parse(data);
                        resolve(update);
                    } catch (error) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            });

            req.on('error', reject);
            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            req.end();
        });
    }

    shouldUpdate(update) {
        if (!update.version) return false;

        const currentVersion = app.getVersion();
        const updateVersion = update.version;

        this.log(`Current version: ${currentVersion}, Update version: ${updateVersion}`);

        // Simple version comparison (could be enhanced)
        return updateVersion !== currentVersion;
    }

    async performUpdate(update) {
        if (this.updateInProgress) {
            this.log('Update already in progress');
            return;
        }

        this.updateInProgress = true;
        this.log(`Starting update to version ${update.version}`);

        try {
            // Download update files
            if (update.downloadUrl) {
                await this.downloadUpdate(update.downloadUrl, update.checksum);
            }

            // Apply update
            if (mainWindow) {
                mainWindow.webContents.send('update-downloaded', update);

                // Show notification
                const notification = new Notification({
                    title: 'VibeChat Update Ready',
                    body: `Version ${update.version} has been downloaded and will be installed on next restart.`,
                    icon: path.join(__dirname, 'assets', 'icon.png')
                });

                notification.show();
            }

        } catch (error) {
            this.log(`Update failed: ${error.message}`);
        } finally {
            this.updateInProgress = false;
        }
    }

    async downloadUpdate(downloadUrl, checksum) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(path.join(os.tmpdir(), 'vibechat-update.zip'));

            const protocol = downloadUrl.startsWith('https:') ? https : http;

            const req = protocol.get(downloadUrl, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Download failed with status ${res.statusCode}`));
                    return;
                }

                res.pipe(file);

                file.on('finish', () => {
                    file.close();
                    this.log('Update downloaded successfully');
                    resolve();
                });
            });

            req.on('error', reject);
            req.setTimeout(30000, () => {
                req.destroy();
                reject(new Error('Download timeout'));
            });
        });
    }

    start() {
        if (this.autoUpdateEnabled) {
            setInterval(() => this.checkForUpdates(), this.updateInterval);
            this.log('AI Updater started');
        }
    }

    getLogs() {
        return this.debugLogs;
    }
}

// Auto-updater - handle gracefully if not available in packaged app
let autoUpdater;
try {
  const updaterModule = require('electron-updater');
  autoUpdater = updaterModule.autoUpdater;
  console.log('✅ electron-updater loaded successfully');
} catch (error) {
  console.log('⚠️ electron-updater not available, using custom updater only');
  autoUpdater = null;
}

// Global variables
let mainWindow;
let isQuitting = false;
let aiUpdater = new AIUpdater();
let debugLogs = [];
let errorLogs = [];

// Enhanced error handling
process.on('uncaughtException', (error) => {
    logError('Uncaught Exception: ' + error.message, error.stack);
    if (mainWindow) {
        mainWindow.webContents.send('app-error', {
            type: 'uncaughtException',
            message: error.message,
            stack: error.stack
        });
    }
});

process.on('unhandledRejection', (reason, promise) => {
    logError('Unhandled Rejection: ' + reason.message || reason, reason.stack);
    if (mainWindow) {
        mainWindow.webContents.send('app-error', {
            type: 'unhandledRejection',
            message: reason.message || reason,
            stack: reason.stack
        });
    }
});

// Enhanced logging functions
function logDebug(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${message}`;
    debugLogs.push(logEntry);

    // Keep only last 1000 debug logs
    if (debugLogs.length > 1000) {
        debugLogs = debugLogs.slice(-1000);
    }

    console.log(`[VibeChat Debug] ${message}`);

    // Send to renderer if window exists
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('debug-log', logEntry);
    }
}

function logError(message, stack) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ERROR - ${message}`;
    errorLogs.push(logEntry);

    // Keep only last 500 error logs
    if (errorLogs.length > 500) {
        errorLogs = errorLogs.slice(-500);
    }

    console.error(`[VibeChat Error] ${message}`, stack);

    // Send to renderer if window exists
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send('error-log', { message, stack, timestamp });
    }
}

// Auto-save functionality
class AutoSaveManager {
    constructor() {
        this.autoSaveInterval = 30000; // 30 seconds
        this.lastSaveTime = 0;
        this.isEnabled = true;
        this.userData = {};
    }

    updateUserData(key, value) {
        this.userData[key] = value;
        this.scheduleSave();
    }

    scheduleSave() {
        if (!this.isEnabled) return;

        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
            this.performSave();
        }, 5000); // Save after 5 seconds of inactivity
    }

    async performSave() {
        if (Object.keys(this.userData).length === 0) return;

        try {
            const savePath = path.join(APP_DATA_PATH, 'autosave.json');
            await fs.writeFile(savePath, JSON.stringify({
                userData: this.userData,
                timestamp: new Date().toISOString(),
                version: app.getVersion()
            }, null, 2));

            logDebug('Auto-save completed successfully');
        } catch (error) {
            logError('Auto-save failed: ' + error.message, error.stack);
        }
    }

    async loadSavedData() {
        try {
            const savePath = path.join(APP_DATA_PATH, 'autosave.json');
            const data = await fs.readFile(savePath, 'utf8');
            const saved = JSON.parse(data);

            if (saved.userData) {
                this.userData = saved.userData;
                logDebug('Auto-saved data loaded successfully');
                return saved.userData;
            }
        } catch (error) {
            logDebug('No auto-saved data found or failed to load');
        }
        return {};
    }

    start() {
        this.loadSavedData();
        setInterval(() => this.performSave(), this.autoSaveInterval);
        logDebug('Auto-save manager started');
    }
}

// Application data paths
const APP_DATA_PATH = path.join(os.homedir(), '.vibechat');
const HWID_FILE = path.join(APP_DATA_PATH, 'hwid.json');
const AUTO_START_FILE = path.join(APP_DATA_PATH, 'autostart');

// Initialize managers
let autoSaveManager = new AutoSaveManager();

// Generate unique hardware ID
function generateHWID() {
  const networkInterfaces = os.networkInterfaces();
  const cpus = os.cpus();
  const platform = os.platform();
  const hostname = os.hostname();

  // Collect unique identifiers
  const identifiers = [
    platform,
    hostname,
    cpus.length.toString(),
    Object.keys(networkInterfaces).join(',')
  ];

  // Create hash
  const hash = crypto.createHash('sha256');
  hash.update(identifiers.join('|'));
  return hash.digest('hex').substring(0, 32);
}

// Get or create HWID
async function getOrCreateHWID() {
  try {
    // Ensure directory exists
    await fs.mkdir(APP_DATA_PATH, { recursive: true });

    // Check if HWID file exists
    try {
      const data = await fs.readFile(HWID_FILE, 'utf8');
      const hwidData = JSON.parse(data);
      return hwidData.hwid;
    } catch (error) {
      // File doesn't exist or is corrupted, create new HWID
      const hwid = generateHWID();
      const hwidData = { hwid, createdAt: new Date().toISOString() };
      await fs.writeFile(HWID_FILE, JSON.stringify(hwidData, null, 2));
      return hwid;
    }
  } catch (error) {
    console.error('Error managing HWID:', error);
    return generateHWID(); // Fallback to generated HWID
  }
}

// Enable auto-start on system boot
async function enableAutoStart() {
  try {
    await fs.mkdir(APP_DATA_PATH, { recursive: true });
    await fs.writeFile(AUTO_START_FILE, JSON.stringify({
      enabled: true,
      timestamp: new Date().toISOString()
    }));
    console.log('✅ Auto-start enabled');
  } catch (error) {
    console.error('❌ Failed to enable auto-start:', error);
  }
}

// Disable auto-start
async function disableAutoStart() {
  try {
    await fs.unlink(AUTO_START_FILE).catch(() => {});
    console.log('✅ Auto-start disabled');
  } catch (error) {
    console.error('❌ Failed to disable auto-start:', error);
  }
}

// Check if auto-start is enabled
async function isAutoStartEnabled() {
  try {
    await fs.access(AUTO_START_FILE);
    return true;
  } catch {
    return false;
  }
}

// Set up auto-start for Windows
function setupWindowsAutoStart(enabled) {
  if (process.platform !== 'win32') return;

  try {
    const AutoLaunch = require('auto-launch');
    const autoLauncher = new AutoLaunch({
      name: 'VibeChat Desktop',
      path: app.getPath('exe'),
    });

    if (enabled) {
      autoLauncher.enable();
    } else {
      autoLauncher.disable();
    }
  } catch (error) {
    console.error('Failed to setup Windows auto-start:', error);
  }
}

// Helper function for checking account lock (accessible from main process)
async function checkAccountLock() {
  try {
    const lockFile = path.join(APP_DATA_PATH, 'account-lock.json');
    const lockData = JSON.parse(await fs.readFile(lockFile, 'utf8'));

    const currentHwid = await getOrCreateHWID();

    if (lockData.hwid === currentHwid && lockData.autoLogin) {
      return {
        success: true,
        account: {
          username: lockData.username,
          userId: lockData.userId
        }
      };
    }

    return { success: false };
  } catch (error) {
    return { success: false };
  }
}

function createWindow() {
  logDebug('Creating main window');

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      additionalArguments: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false, // Don't show until ready-to-show
  });

  logDebug('Main window created, loading content');

  // Load the app with error handling
  try {
    if (isDev) {
      logDebug('Loading development URL');
      mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();
    } else {
      logDebug('Loading production React app');
      // In production, load the React app served by Express
      mainWindow.loadURL('http://localhost:3002');
    }
  } catch (error) {
    logError('Failed to load application content: ' + error.message, error.stack);
    // Show error dialog
    dialog.showErrorBox('Loading Error',
      'Failed to load VibeChat application. Please restart the application.\n\nError: ' + error.message);
    app.quit();
    return;
  }

  // Check for auto-login account using the handler directly
  setTimeout(async () => {
    try {
      // Use the handler function directly
      const accountLock = await checkAccountLock();
      if (accountLock.success && global.autoLoginAccount) {
        console.log('🔐 Auto-login account found:', global.autoLoginAccount.username);
        mainWindow.webContents.send('auto-login', global.autoLoginAccount);
      }
    } catch (error) {
      console.error('Error checking account lock:', error);
    }
  }, 2000);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Focus on window creation for macOS
    if (process.platform === 'darwin') {
      app.dock.show();
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle new window creation
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Handle app becoming active (for notifications)
  mainWindow.on('focus', () => {
    mainWindow.webContents.send('window-focus', true);
  });

  mainWindow.on('blur', () => {
    mainWindow.webContents.send('window-focus', false);
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle app quit
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.webContents.send('app-quit-request');
    }
  });

  // Setup application menu
  setupApplicationMenu();

  // Setup auto-updater in production (if available)
  if (!isDev) {
    setupAutoUpdater();
  }
}

function setupApplicationMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Room',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-room');
          }
        },
        {
          label: 'Join Room',
          accelerator: 'CmdOrCtrl+J',
          click: () => {
            mainWindow.webContents.send('menu-action', 'join-room');
          }
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('menu-action', 'settings');
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
        ...(process.platform === 'darwin' ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'restore' }
        ])
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About VibeChat',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About VibeChat Desktop',
              message: 'VibeChat Desktop v1.0.0',
              detail: 'A modern chat application for real-time communication.\n\nBuilt with Electron, React, and TypeScript.'
            });
          }
        },
        {
          label: 'Check for Updates',
          click: () => {
            if (!isDev && autoUpdater) {
              autoUpdater.checkForUpdatesAndNotify();
            } else {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                message: 'Development Mode',
                detail: 'Update checking is disabled in development mode.'
              });
            }
          }
        },
        { type: 'separator' },
        {
          label: 'VibeChat Website',
          click: () => {
            shell.openExternal('https://vibechat.com');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/vibechat/desktop/issues');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function setupAutoUpdater() {
  // Configure auto-updater for local server if available
  if (!isDev && autoUpdater) {
    try {
      autoUpdater.setFeedURL({
        provider: 'generic',
        url: 'http://localhost:3001/updates/',
        channel: 'latest',
        useMultipleRangeRequest: false
      });

      // Set up request headers for the generic provider
      autoUpdater.requestHeaders = {
        'User-Agent': 'VibeChat-Desktop/' + app.getVersion()
      };

      console.log('✅ Auto-updater configured successfully');
    } catch (error) {
      console.error('❌ Failed to configure auto-updater:', error);
      autoUpdater = null;
    }
  }

  // Auto-updater event listeners (only if autoUpdater is available)
  if (autoUpdater) {
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...');
      if (mainWindow) {
        mainWindow.webContents.send('update-status', 'Checking for updates...');
      }
    });

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version);
      if (mainWindow) {
        mainWindow.webContents.send('update-status', `Update available: v${info.version}`);
      }
    });

    autoUpdater.on('update-not-available', () => {
      console.log('No updates available');
      if (mainWindow) {
        mainWindow.webContents.send('update-status', 'No updates available');
      }
    });

    autoUpdater.on('error', (err) => {
      console.error('Update error:', err);
      if (mainWindow) {
        mainWindow.webContents.send('update-error', err.message);
      }
    });

    autoUpdater.on('download-progress', (progressObj) => {
      console.log('Download progress:', progressObj.percent);
      if (mainWindow) {
        mainWindow.webContents.send('update-progress', progressObj);
      }
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded:', info.version);
      if (mainWindow) {
        mainWindow.webContents.send('update-downloaded', info);

        // Show notification about update
        const notification = new Notification({
          title: 'VibeChat Update Ready',
          body: `Version ${info.version} has been downloaded. Restart to apply.`,
          icon: path.join(__dirname, 'assets', 'icon.png')
        });

        notification.on('click', () => {
          autoUpdater.quitAndInstall();
        });

        notification.show();
      }
    });

    // Check for updates on startup (after a delay)
    if (!isDev) {
      setTimeout(() => {
        console.log('Checking for updates...');
        autoUpdater.checkForUpdates().catch(err => {
          console.error('Failed to check for updates:', err);
        });
      }, 5000);
    }
  }
}

// IPC handlers for communication with renderer process
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});

ipcMain.handle('get-hwid', async () => {
  return await getOrCreateHWID();
});

ipcMain.handle('enable-auto-start', async () => {
  await enableAutoStart();
  setupWindowsAutoStart(true);
  return true;
});

ipcMain.handle('disable-auto-start', async () => {
  await disableAutoStart();
  setupWindowsAutoStart(false);
  return true;
});

ipcMain.handle('is-auto-start-enabled', async () => {
  return await isAutoStartEnabled();
});

ipcMain.handle('lock-hwid-to-account', async (event, accountData) => {
  try {
    const hwid = await getOrCreateHWID();
    const lockFile = path.join(APP_DATA_PATH, 'account-lock.json');

    const lockData = {
      hwid: hwid,
      username: accountData.username,
      userId: accountData.userId,
      lockedAt: new Date().toISOString(),
      autoLogin: true
    };

    await fs.writeFile(lockFile, JSON.stringify(lockData, null, 2));
    console.log('✅ HWID locked to account:', accountData.username);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to lock HWID:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('check-account-lock', async () => {
  try {
    const lockFile = path.join(APP_DATA_PATH, 'account-lock.json');
    const lockData = JSON.parse(await fs.readFile(lockFile, 'utf8'));

    const currentHwid = await getOrCreateHWID();

    if (lockData.hwid === currentHwid && lockData.autoLogin) {
      return {
        success: true,
        account: {
          username: lockData.username,
          userId: lockData.userId
        }
      };
    }

    return { success: false };
  } catch (error) {
    return { success: false };
  }
});

ipcMain.handle('unlock-account', async () => {
  try {
    const lockFile = path.join(APP_DATA_PATH, 'account-lock.json');
    await fs.unlink(lockFile).catch(() => {});
    console.log('✅ Account unlocked');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to unlock account:', error);
    return { success: false, error: error.message };
  }
});

// GPU Detection
ipcMain.handle('detect-gpu', async () => {
  try {
    const si = require('systeminformation');

    const graphics = await si.graphics();
    const gpuInfo = {
      hasNvidiaGPU: false,
      gpuName: 'Unknown',
      driverVersion: 'Unknown',
      memory: 0,
      supportedResolutions: []
    };

    // Check for NVIDIA GPUs
    for (const controller of graphics.controllers) {
      if (controller.vendor.toLowerCase().includes('nvidia') ||
          controller.model.toLowerCase().includes('geforce') ||
          controller.model.toLowerCase().includes('rtx')) {

        gpuInfo.hasNvidiaGPU = true;
        gpuInfo.gpuName = controller.model;
        gpuInfo.driverVersion = controller.driverVersion || 'Unknown';
        gpuInfo.memory = controller.memoryTotal || 0;

        // Check for RTX 30/40/50 series
        const modelLower = controller.model.toLowerCase();
        if (modelLower.includes('rtx 30') || modelLower.includes('rtx 40') || modelLower.includes('rtx 50')) {
          gpuInfo.supportedResolutions = [
            '1920x1080',
            '2560x1440',
            '3840x2160',
            '3860x1440' // Ultrawide
          ];
        } else {
          gpuInfo.supportedResolutions = [
            '1920x1080',
            '2560x1440',
            '3840x2160'
          ];
        }
        break;
      }
    }

    return gpuInfo;
  } catch (error) {
    console.error('❌ Failed to detect GPU:', error);
    return {
      hasNvidiaGPU: false,
      gpuName: 'Detection Failed',
      driverVersion: 'Unknown',
      memory: 0,
      supportedResolutions: ['1920x1080', '2560x1440', '3840x2160'],
      error: error.message
    };
  }
});

// Screen sharing permissions
ipcMain.handle('request-screen-share', async () => {
  try {
    const { desktopCapturer } = require('electron');
    const sources = await desktopCapturer.getSources({
      types: ['window', 'screen']
    });

    return {
      success: true,
      sources: sources.map(source => ({
        id: source.id,
        name: source.name,
        thumbnail: source.thumbnail.toDataURL()
      }))
    };
  } catch (error) {
    console.error('❌ Failed to get screen sources:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// Check subscription tier for streaming features
ipcMain.handle('get-streaming-capabilities', async () => {
  try {
    // This would normally check the user's subscription from the backend
    // For now, return basic capabilities
    const capabilities = {
      maxResolution: '1920x1080',
      maxFPS: 30,
      canStream4K: false,
      canStreamUltrawide: false,
      nvidiaGPU: false
    };

    // Check if user has subscription (would check backend in real implementation)
    const lockFile = path.join(APP_DATA_PATH, 'account-lock.json');
    try {
      const lockData = JSON.parse(await fs.readFile(lockFile, 'utf8'));
      // For demo purposes, assume they have tier 5 if logged in
      capabilities.maxResolution = '3860x1440';
      capabilities.maxFPS = 60;
      capabilities.canStream4K = true;
      capabilities.canStreamUltrawide = true;
      capabilities.nvidiaGPU = true;
    } catch (error) {
      // No lock file, basic capabilities
    }

    return capabilities;
  } catch (error) {
    console.error('❌ Failed to get streaming capabilities:', error);
    return {
      maxResolution: '1920x1080',
      maxFPS: 30,
      canStream4K: false,
      canStreamUltrawide: false,
      nvidiaGPU: false,
      error: error.message
    };
  }
});

ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('show-notification', (event, { title, body, silent = false }) => {
  const notification = new Notification({
    title,
    body,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    silent
  });

  notification.show();
  return true;
});

ipcMain.handle('quit-app', () => {
  isQuitting = true;
  app.quit();
});

// Update handlers
ipcMain.handle('check-for-updates', async () => {
  if (!isDev && autoUpdater) {
    try {
      return await autoUpdater.checkForUpdates();
    } catch (error) {
      console.error('Failed to check for updates:', error);
      throw error;
    }
  }
  return { updateInfo: null };
});

ipcMain.handle('download-update', async () => {
  if (!isDev && autoUpdater) {
    try {
      await autoUpdater.downloadUpdate();
      return { success: true };
    } catch (error) {
      console.error('Failed to download update:', error);
      throw error;
    }
  }
  return { success: false };
});

ipcMain.handle('quit-and-install', () => {
  if (!isDev && autoUpdater) {
    autoUpdater.quitAndInstall();
  }
});

// AI Updater IPC handlers
ipcMain.handle('get-ai-updater-logs', () => {
  return aiUpdater.getLogs();
});

ipcMain.handle('check-updates-manually', async () => {
  try {
    await aiUpdater.checkForUpdates();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-debug-logs', () => {
  return debugLogs;
});

ipcMain.handle('get-error-logs', () => {
  return errorLogs;
});

ipcMain.handle('clear-logs', () => {
  debugLogs = [];
  errorLogs = [];
  aiUpdater.debugLogs = [];
  return { success: true };
});

// Auto-save IPC handlers
ipcMain.handle('get-autosave-data', async () => {
  return await autoSaveManager.loadSavedData();
});

ipcMain.handle('save-user-data', async (event, key, value) => {
  autoSaveManager.updateUserData(key, value);
  return { success: true };
});

ipcMain.handle('enable-autosave', () => {
  autoSaveManager.isEnabled = true;
  return { success: true };
});

ipcMain.handle('disable-autosave', () => {
  autoSaveManager.isEnabled = false;
  return { success: true };
});

// App event listeners
app.whenReady().then(async () => {
  logDebug('Application starting up');

  try {
    // Initialize AI updater
    aiUpdater.start();

    // Initialize auto-save manager
    autoSaveManager.start();

    // Start Express server for React app
    setupExpressServer();

    // Start all backend services invisibly
    logDebug('Initializing backend services...');
    await serviceManager.startAllServices();

    // Create main window
    createWindow();

    logDebug('Application initialized successfully');

  } catch (error) {
    logError('Application initialization failed: ' + error.message, error.stack);

    // Show user-friendly error but don't quit - let them try to use the app anyway
    if (mainWindow) {
      mainWindow.webContents.send('service-startup-error', error.message);
    }

    // Still create the window so users can use the app even if services fail to start
    createWindow();
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window even after all windows have been closed
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep the app running even after all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  isQuitting = true;

  // Stop all backend services before quitting
  try {
    await serviceManager.stopAllServices();
    logDebug('All backend services stopped successfully');
  } catch (error) {
    logError('Error stopping services during shutdown: ' + error.message);
  }
});

// Handle app being launched with a room URL (macOS)
app.on('open-url', (event, url) => {
  event.preventDefault();

  if (mainWindow) {
    // Parse room code from URL
    const roomCodeMatch = url.match(/\/room\/([A-Z0-9]{8})$/);
    if (roomCodeMatch) {
      const roomCode = roomCodeMatch[1];
      mainWindow.webContents.send('open-room-url', roomCode);
    }
  }
});

// Security: Prevent new window creation from renderer
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Service Manager IPC handlers
ipcMain.handle('get-service-status', () => {
  return serviceManager.getServiceStatus();
});

ipcMain.handle('restart-services', async () => {
  try {
    await serviceManager.stopAllServices();
    await serviceManager.startAllServices();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-service-logs', () => {
  // Return recent service-related logs
  const serviceLogs = debugLogs.filter(log =>
    log.includes('service') ||
    log.includes('backend') ||
    log.includes('Starting') ||
    log.includes('Stopping')
  ).slice(-50); // Last 50 service-related logs

  return serviceLogs;
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // In production, you might want to log this to a file
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to log this to a file
});
