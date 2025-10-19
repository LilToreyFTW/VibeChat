// VibeChat Update Manager
import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';
import { UpdateInfo } from '../types/vibechat';

export class UpdateManager {
  private updateInfo: UpdateInfo | null = null;
  private isCheckingForUpdates = false;

  constructor() {
    this.setupAutoUpdater();
  }

  private setupAutoUpdater(): void {
    // Configure auto-updater
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;

    // Set update server (if available)
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: 'http://localhost:3001/updates/',
      channel: 'latest'
    });

    // Event handlers
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info);
      this.updateInfo = {
        version: info.version,
        releaseDate: info.releaseDate,
        downloadUrl: '',
        changelog: Array.isArray(info.releaseNotes) ? info.releaseNotes.map(note => typeof note === 'string' ? note : note.toString()) : [info.releaseNotes || ''],
        isMandatory: false
      };
    });

    autoUpdater.on('update-not-available', () => {
      console.log('No updates available');
      this.updateInfo = null;
    });

    autoUpdater.on('error', (error) => {
      console.error('Update error:', error);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      console.log('Download progress:', progressObj);
    });

    autoUpdater.on('update-downloaded', () => {
      console.log('Update downloaded');
    });
  }

  public async checkForUpdates(): Promise<UpdateInfo | null> {
    if (this.isCheckingForUpdates) {
      return this.updateInfo;
    }

    try {
      this.isCheckingForUpdates = true;
      
      // Check for updates
      const result = await autoUpdater.checkForUpdates();
      
      if (result && result.updateInfo) {
        this.updateInfo = {
          version: result.updateInfo.version,
          releaseDate: result.updateInfo.releaseDate,
          downloadUrl: '',
          changelog: Array.isArray(result.updateInfo.releaseNotes) ? result.updateInfo.releaseNotes.map(note => typeof note === 'string' ? note : note.toString()) : [result.updateInfo.releaseNotes || ''],
          isMandatory: false
        };
      }

      return this.updateInfo;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return null;
    } finally {
      this.isCheckingForUpdates = false;
    }
  }

  public async downloadUpdate(): Promise<boolean> {
    try {
      if (!this.updateInfo) {
        throw new Error('No update available');
      }

      await autoUpdater.downloadUpdate();
      return true;
    } catch (error) {
      console.error('Failed to download update:', error);
      return false;
    }
  }

  public async installUpdate(): Promise<boolean> {
    try {
      if (!this.updateInfo) {
        throw new Error('No update available');
      }

      // Show confirmation dialog
      const result = await dialog.showMessageBox({
        type: 'question',
        buttons: ['Install Now', 'Later'],
        defaultId: 0,
        title: 'Update Available',
        message: `VibeChat ${this.updateInfo.version} is ready to install.`,
        detail: 'The application will restart to complete the update.'
      });

      if (result.response === 0) {
        autoUpdater.quitAndInstall();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to install update:', error);
      return false;
    }
  }

  public getUpdateInfo(): UpdateInfo | null {
    return this.updateInfo;
  }

  public isUpdateAvailable(): boolean {
    return this.updateInfo !== null;
  }

  public async showUpdateDialog(): Promise<void> {
    if (!this.updateInfo) {
      return;
    }

    const result = await dialog.showMessageBox({
      type: 'info',
      buttons: ['Download', 'Later'],
      defaultId: 0,
      title: 'Update Available',
      message: `VibeChat ${this.updateInfo.version} is available.`,
      detail: `Release Date: ${this.updateInfo.releaseDate}\n\nChangelog:\n${this.updateInfo.changelog.join('\n')}`
    });

    if (result.response === 0) {
      await this.downloadUpdate();
    }
  }
}
