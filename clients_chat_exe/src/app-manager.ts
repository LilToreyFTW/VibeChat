// VibeChat Desktop Application Manager
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { ServiceManager } from './service-manager';
import { AuthManager } from './auth-manager';
import { UpdateManager } from './update-manager';
import { OwnerDashboard } from './owner-dashboard';
import { VibeChatConfig, AppState, UserAccount, BoostTier } from '../types/vibechat';

export class AppManager {
  private mainWindow: BrowserWindow | null = null;
  private serviceManager: ServiceManager;
  private authManager: AuthManager;
  private updateManager: UpdateManager;
  private ownerDashboard: OwnerDashboard;
  private appState: AppState;
  private config: VibeChatConfig;

  constructor() {
    this.config = this.loadConfig();
    this.appState = this.initializeAppState();
    this.serviceManager = new ServiceManager();
    this.authManager = new AuthManager();
    this.updateManager = new UpdateManager();
    this.ownerDashboard = new OwnerDashboard();
    
    this.setupEventHandlers();
    this.setupIpcHandlers();
  }

  private loadConfig(): VibeChatConfig {
    return {
      version: '1.0.0',
      buildDate: new Date().toISOString(),
      environment: process.env.NODE_ENV === 'development' ? 'development' : 'production',
      features: {
        authentication: true,
        boostTiers: true,
        streaming: true,
        chat: true,
        autoUpdate: true
      }
    };
  }

  private initializeAppState(): AppState {
    return {
      isAuthenticated: false,
      user: null,
      currentTier: null,
      services: {
        backend: false,
        python: false,
        chatRooms: false,
        httpServer: false,
        lastCheck: new Date().toISOString()
      },
      isLoading: false,
      error: null
    };
  }

  private setupEventHandlers(): void {
    app.whenReady().then(() => {
      this.initializeApp();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    app.on('before-quit', async () => {
      await this.cleanup();
    });
  }

  private setupIpcHandlers(): void {
    // Authentication handlers
    ipcMain.handle('auth-login', async (event, credentials) => {
      return await this.authManager.login(credentials);
    });

    ipcMain.handle('auth-register', async (event, userData) => {
      return await this.authManager.register(userData);
    });

    ipcMain.handle('auth-logout', async () => {
      return await this.authManager.logout();
    });

    ipcMain.handle('auth-check', async () => {
      return await this.authManager.checkAuth();
    });

    // Service handlers
    ipcMain.handle('services-status', () => {
      return this.serviceManager.getStatus();
    });

    ipcMain.handle('services-start', async () => {
      return await this.serviceManager.startAll();
    });

    ipcMain.handle('services-stop', async () => {
      return await this.serviceManager.stopAll();
    });

    // App state handlers
    ipcMain.handle('app-state', () => {
      return this.appState;
    });

    ipcMain.handle('app-config', () => {
      return this.config;
    });

    // Update handlers
    ipcMain.handle('update-check', async () => {
      return await this.updateManager.checkForUpdates();
    });

    ipcMain.handle('update-download', async () => {
      return await this.updateManager.downloadUpdate();
    });

    ipcMain.handle('update-install', async () => {
      return await this.updateManager.installUpdate();
    });

    // Owner control handlers
    ipcMain.handle('owner-authenticate', async (event, credentials) => {
      return await this.ownerDashboard.authenticateOwner(credentials.username, credentials.password);
    });

    ipcMain.handle('owner-dashboard-stats', async () => {
      return await this.ownerDashboard.getDashboardStats();
    });

    ipcMain.handle('owner-user-management', async (event, filters) => {
      return await this.ownerDashboard.getUserManagementData(filters);
    });

    ipcMain.handle('owner-ban-user', async (event, userId, reason) => {
      return await this.ownerDashboard.banUser(userId, reason);
    });

    ipcMain.handle('owner-unban-user', async (event, userId) => {
      return await this.ownerDashboard.unbanUser(userId);
    });

    ipcMain.handle('owner-update-user-role', async (event, userId, newRole) => {
      return await this.ownerDashboard.updateUserRole(userId, newRole);
    });

    ipcMain.handle('owner-update-user-subscription', async (event, userId, newTier) => {
      return await this.ownerDashboard.updateUserSubscription(userId, newTier);
    });

    ipcMain.handle('owner-get-user-by-id', async (event, userId) => {
      return await this.ownerDashboard.getUserById(userId);
    });

    ipcMain.handle('owner-export-data', async () => {
      return await this.ownerDashboard.exportUserData();
    });

    ipcMain.handle('owner-system-logs', async () => {
      return await this.ownerDashboard.getSystemLogs();
    });

    ipcMain.handle('owner-is-authenticated', () => {
      return this.ownerDashboard.isOwnerAuthenticated();
    });

    ipcMain.handle('owner-get-current', () => {
      return this.ownerDashboard.getCurrentOwner();
    });

    ipcMain.handle('owner-logout', () => {
      this.ownerDashboard.logout();
      return { success: true };
    });
  }

  private async initializeApp(): Promise<void> {
    try {
      this.appState.isLoading = true;
      
      // Start all backend services
      await this.serviceManager.startAll();
      
      // Check for updates
      if (this.config.features.autoUpdate) {
        await this.updateManager.checkForUpdates();
      }
      
      // Create main window
      this.createMainWindow();
      
      // Check authentication
      const authResult = await this.authManager.checkAuth();
      this.appState.isAuthenticated = authResult.success;
      this.appState.user = authResult.user || null;
      
      this.appState.isLoading = false;
      
    } catch (error) {
      this.appState.error = error instanceof Error ? error.message : 'Unknown error';
      this.appState.isLoading = false;
      console.error('App initialization failed:', error);
    }
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js'),
        webSecurity: true,
        allowRunningInsecureContent: false
      },
      icon: path.join(__dirname, '../assets/icon.png'),
      titleBarStyle: 'default',
      show: false
    });

    // Load the React app
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadURL('http://localhost:3002');
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private async cleanup(): Promise<void> {
    try {
      await this.serviceManager.stopAll();
      await this.authManager.cleanup();
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  public getAppState(): AppState {
    return this.appState;
  }

  public getConfig(): VibeChatConfig {
    return this.config;
  }
}
