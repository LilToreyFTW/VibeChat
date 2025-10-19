const { contextBridge, ipcRenderer, shell } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // Notifications
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),

  // App lifecycle
  quitApp: () => ipcRenderer.invoke('quit-app'),

  // IPC event listeners
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', callback),
  onUpdateError: (callback) => ipcRenderer.on('update-error', callback),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),

  // Update actions
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),

  // HWID and Auto-start actions
  getHWID: () => ipcRenderer.invoke('get-hwid'),
  enableAutoStart: () => ipcRenderer.invoke('enable-auto-start'),
  disableAutoStart: () => ipcRenderer.invoke('disable-auto-start'),
  isAutoStartEnabled: () => ipcRenderer.invoke('is-auto-start-enabled'),
  lockHWIDToAccount: (accountData) => ipcRenderer.invoke('lock-hwid-to-account', accountData),
  unlockAccount: () => ipcRenderer.invoke('unlock-account'),

  // Auto-login listener
  onAutoLogin: (callback) => ipcRenderer.on('auto-login', callback),

  // Menu actions
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),

  // Window events
  onWindowFocus: (callback) => ipcRenderer.on('window-focus', callback),

  // App quit request
  onAppQuitRequest: (callback) => ipcRenderer.on('app-quit-request', callback),

  // Room URL handling
  onOpenRoomUrl: (callback) => ipcRenderer.on('open-room-url', callback),

  // Remove event listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // External link opening (safe way)
  openExternal: (url) => shell.openExternal(url),

  // Platform detection helpers
  isMac: process.platform === 'darwin',
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'linux',

  // Environment detection
  isDev: process.env.NODE_ENV === 'development',

  // Owner control APIs
  ownerAuthenticate: (credentials) => ipcRenderer.invoke('owner-authenticate', credentials),
  ownerDashboardStats: () => ipcRenderer.invoke('owner-dashboard-stats'),
  ownerUserManagement: (filters) => ipcRenderer.invoke('owner-user-management', filters),
  ownerBanUser: (userId, reason) => ipcRenderer.invoke('owner-ban-user', userId, reason),
  ownerUnbanUser: (userId) => ipcRenderer.invoke('owner-unban-user', userId),
  ownerUpdateUserRole: (userId, newRole) => ipcRenderer.invoke('owner-update-user-role', userId, newRole),
  ownerUpdateUserSubscription: (userId, newTier) => ipcRenderer.invoke('owner-update-user-subscription', userId, newTier),
  ownerGetUserById: (userId) => ipcRenderer.invoke('owner-get-user-by-id', userId),
  ownerExportData: () => ipcRenderer.invoke('owner-export-data'),
  ownerSystemLogs: () => ipcRenderer.invoke('owner-system-logs'),
  ownerIsAuthenticated: () => ipcRenderer.invoke('owner-is-authenticated'),
  ownerGetCurrent: () => ipcRenderer.invoke('owner-get-current'),
  ownerLogout: () => ipcRenderer.invoke('owner-logout'),
});

// Also expose a simple API for basic Electron functionality
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: process.versions,
});

// Security: Prevent renderer process from accessing Node.js APIs directly
// This is handled by contextIsolation: true in main.js, but this preload script
// provides the bridge for secure communication
