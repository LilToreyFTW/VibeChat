// VibeChat Desktop Main Entry Point
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { AppManager } from './app-manager';
import { BoostManager } from './boost-manager';
import { StreamingManager } from './streaming-manager';

// Global app manager instance
let appManager: AppManager;
let boostManager: BoostManager;
let streamingManager: StreamingManager;

// Initialize the application
async function initializeApp(): Promise<void> {
  try {
    // Create managers
    appManager = new AppManager();
    boostManager = new BoostManager();
    streamingManager = new StreamingManager();

    // Setup IPC handlers for boost tiers
    setupBoostHandlers();
    
    // Setup IPC handlers for streaming
    setupStreamingHandlers();

    console.log('VibeChat Desktop initialized successfully');
  } catch (error) {
    console.error('Failed to initialize VibeChat Desktop:', error);
    app.quit();
  }
}

function setupBoostHandlers(): void {
  // Get all boost tiers
  ipcMain.handle('boost-get-tiers', () => {
    return boostManager.getAllTiers();
  });

  // Get tier by ID
  ipcMain.handle('boost-get-tier', (event, tierId: string) => {
    return boostManager.getTierById(tierId);
  });

  // Get tier features
  ipcMain.handle('boost-get-features', (event, tierId: string) => {
    return boostManager.getTierFeatures(tierId);
  });

  // Get tier price
  ipcMain.handle('boost-get-price', (event, tierId: string) => {
    return boostManager.getTierPrice(tierId);
  });

  // Get tier comparison
  ipcMain.handle('boost-get-comparison', () => {
    return boostManager.getTierComparison();
  });

  // Get recommended tier
  ipcMain.handle('boost-get-recommended', (event, userNeeds: any) => {
    return boostManager.getRecommendedTier(userNeeds);
  });

  // Validate tier upgrade
  ipcMain.handle('boost-validate-upgrade', (event, currentTierId: string, targetTierId: string) => {
    return boostManager.validateTierUpgrade(currentTierId, targetTierId);
  });

  // Get tier benefits
  ipcMain.handle('boost-get-benefits', (event, tierId: string) => {
    return boostManager.getTierBenefits(tierId);
  });
}

function setupStreamingHandlers(): void {
  // Get current streaming config
  ipcMain.handle('streaming-get-config', () => {
    return streamingManager.getCurrentConfig();
  });

  // Get available qualities
  ipcMain.handle('streaming-get-qualities', () => {
    return streamingManager.getAvailableQualities();
  });

  // Get max FPS
  ipcMain.handle('streaming-get-max-fps', () => {
    return streamingManager.getMaxFPS();
  });

  // Get max bitrate
  ipcMain.handle('streaming-get-max-bitrate', () => {
    return streamingManager.getMaxBitrate();
  });

  // Check hardware acceleration
  ipcMain.handle('streaming-can-use-hw-accel', () => {
    return streamingManager.canUseHardwareAcceleration();
  });

  // Get recommended settings
  ipcMain.handle('streaming-get-recommended', () => {
    return streamingManager.getRecommendedSettings();
  });

  // Validate settings
  ipcMain.handle('streaming-validate-settings', (event, settings: any) => {
    return streamingManager.validateSettings(settings);
  });

  // Get streaming capabilities
  ipcMain.handle('streaming-get-capabilities', () => {
    return streamingManager.getStreamingCapabilities();
  });

  // Get tier limitations
  ipcMain.handle('streaming-get-limitations', () => {
    return streamingManager.getTierLimitations();
  });

  // Set user tier for streaming
  ipcMain.handle('streaming-set-tier', (event, tier: any) => {
    streamingManager.setUserTier(tier);
    return true;
  });
}

// Handle app events
app.whenReady().then(async () => {
  await initializeApp();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // Recreate window if needed
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export for testing
export { appManager, boostManager, streamingManager };
