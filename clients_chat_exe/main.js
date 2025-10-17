const { app, BrowserWindow, Menu, ipcMain, shell, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

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

// Auto-updater
const { autoUpdater } = require('electron-updater');

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
      logDebug('Loading production file');
      // In production, load the index.html file
      mainWindow.loadFile(path.join(__dirname, 'index.html'));
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

  // Setup auto-updater in production
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
            if (!isDev) {
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
  // Configure auto-updater for local server
  if (!isDev) {
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
  }

  // Auto-updater event listeners
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
  if (!isDev) {
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
  if (!isDev) {
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
  if (!isDev) {
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

    // Create main window
    createWindow();

    logDebug('Application initialized successfully');

  } catch (error) {
    logError('Application initialization failed: ' + error.message, error.stack);
    dialog.showErrorBox('Initialization Error',
      'Failed to initialize VibeChat. Please restart the application.\n\nError: ' + error.message);
    app.quit();
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

app.on('before-quit', () => {
  isQuitting = true;
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

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // In production, you might want to log this to a file
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to log this to a file
});
