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
});

// Also expose a simple API for basic Electron functionality
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: process.versions,
});

// Security: Prevent renderer process from accessing Node.js APIs directly
// This is handled by contextIsolation: true in main.js, but this preload script
// provides the bridge for secure communication
