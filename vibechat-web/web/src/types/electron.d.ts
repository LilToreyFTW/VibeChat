interface ElectronAPI {
  // App information
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;

  // Window controls
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;

  // Notifications
  showNotification: (options: { title: string; body: string; silent?: boolean }) => Promise<boolean>;

  // App lifecycle
  quitApp: () => Promise<void>;

  // Update system
  checkForUpdates: () => Promise<any>;
  downloadUpdate: () => Promise<{ success: boolean }>;
  quitAndInstall: () => Promise<void>;

  // HWID and Auto-start
  getHWID: () => Promise<string>;
  enableAutoStart: () => Promise<boolean>;
  disableAutoStart: () => Promise<boolean>;
  isAutoStartEnabled: () => Promise<boolean>;
  lockHWIDToAccount: (accountData: { username: string; userId: string }) => Promise<{ success: boolean }>;
  unlockAccount: () => Promise<{ success: boolean }>;

  // Streaming and GPU
  detectGPU: () => Promise<{
    hasNvidiaGPU: boolean;
    gpuName: string;
    driverVersion: string;
    memory: number;
    supportedResolutions: string[];
    error?: string;
  }>;
  requestScreenShare: () => Promise<{
    success: boolean;
    sources: Array<{
      id: string;
      name: string;
      thumbnail: string;
    }>;
    error?: string;
  }>;
  getStreamingCapabilities: () => Promise<{
    maxResolution: string;
    maxFPS: number;
    canStream4K: boolean;
    canStreamUltrawide: boolean;
    nvidiaGPU: boolean;
    error?: string;
  }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
