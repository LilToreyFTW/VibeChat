// VibeChat Streaming Manager
import { StreamingConfig, BoostTier } from '../types/vibechat';

export class StreamingManager {
  private currentConfig: StreamingConfig;
  private userTier: BoostTier | null = null;

  constructor() {
    this.currentConfig = this.getDefaultConfig();
  }

  private getDefaultConfig(): StreamingConfig {
    return {
      quality: '720p',
      fps: 30,
      bitrate: 1000,
      codec: 'h264',
      hardwareAcceleration: false
    };
  }

  public setUserTier(tier: BoostTier | null): void {
    this.userTier = tier;
    this.updateConfigForTier();
  }

  private updateConfigForTier(): void {
    if (!this.userTier) {
      this.currentConfig = this.getDefaultConfig();
      return;
    }

    switch (this.userTier.id) {
      case 'FREE':
        this.currentConfig = {
          quality: '720p',
          fps: 30,
          bitrate: 1000,
          codec: 'h264',
          hardwareAcceleration: false
        };
        break;

      case 'BOOST_PLUS_TIER_2':
        this.currentConfig = {
          quality: '1080p',
          fps: 60,
          bitrate: 2500,
          codec: 'h264',
          hardwareAcceleration: false
        };
        break;

      case 'BOOST_PLUS_TIER_3':
        this.currentConfig = {
          quality: '1440p',
          fps: 60,
          bitrate: 4000,
          codec: 'h264',
          hardwareAcceleration: true
        };
        break;

      case 'BOOST_PLUS_TIER_4':
        this.currentConfig = {
          quality: '4K',
          fps: 60,
          bitrate: 8000,
          codec: 'h265',
          hardwareAcceleration: true
        };
        break;

      case 'BOOST_PLUS_TIER_5':
        this.currentConfig = {
          quality: 'ultrawide',
          fps: 60,
          bitrate: 12000,
          codec: 'h265',
          hardwareAcceleration: true
        };
        break;

      default:
        this.currentConfig = this.getDefaultConfig();
    }
  }

  public getCurrentConfig(): StreamingConfig {
    return { ...this.currentConfig };
  }

  public getAvailableQualities(): string[] {
    if (!this.userTier) {
      return ['720p'];
    }

    const qualities = ['720p'];
    
    if (this.userTier.id !== 'FREE') {
      qualities.push('1080p');
    }
    
    if (['BOOST_PLUS_TIER_3', 'BOOST_PLUS_TIER_4', 'BOOST_PLUS_TIER_5'].includes(this.userTier.id)) {
      qualities.push('1440p');
    }
    
    if (['BOOST_PLUS_TIER_4', 'BOOST_PLUS_TIER_5'].includes(this.userTier.id)) {
      qualities.push('4K');
    }
    
    if (this.userTier.id === 'BOOST_PLUS_TIER_5') {
      qualities.push('ultrawide');
    }

    return qualities;
  }

  public getMaxFPS(): number {
    if (!this.userTier) {
      return 30;
    }

    return this.userTier.id === 'FREE' ? 30 : 60;
  }

  public getMaxBitrate(): number {
    if (!this.userTier) {
      return 1000;
    }

    switch (this.userTier.id) {
      case 'BOOST_PLUS_TIER_2':
        return 2500;
      case 'BOOST_PLUS_TIER_3':
        return 4000;
      case 'BOOST_PLUS_TIER_4':
        return 8000;
      case 'BOOST_PLUS_TIER_5':
        return 12000;
      default:
        return 1000;
    }
  }

  public canUseHardwareAcceleration(): boolean {
    if (!this.userTier) {
      return false;
    }

    return ['BOOST_PLUS_TIER_3', 'BOOST_PLUS_TIER_4', 'BOOST_PLUS_TIER_5'].includes(this.userTier.id);
  }

  public getRecommendedSettings(): StreamingConfig {
    return this.getCurrentConfig();
  }

  public validateSettings(settings: Partial<StreamingConfig>): boolean {
    if (!this.userTier) {
      return settings.quality === '720p' && settings.fps === 30;
    }

    const availableQualities = this.getAvailableQualities();
    const maxFPS = this.getMaxFPS();
    const maxBitrate = this.getMaxBitrate();

    if (settings.quality && !availableQualities.includes(settings.quality)) {
      return false;
    }

    if (settings.fps && settings.fps > maxFPS) {
      return false;
    }

    if (settings.bitrate && settings.bitrate > maxBitrate) {
      return false;
    }

    if (settings.hardwareAcceleration && !this.canUseHardwareAcceleration()) {
      return false;
    }

    return true;
  }

  public getStreamingCapabilities(): {
    maxResolution: string;
    maxFPS: number;
    maxBitrate: number;
    hardwareAcceleration: boolean;
    codec: string;
  } {
    if (!this.userTier) {
      return {
        maxResolution: '720p',
        maxFPS: 30,
        maxBitrate: 1000,
        hardwareAcceleration: false,
        codec: 'h264'
      };
    }

    const capabilities = {
      maxResolution: '720p',
      maxFPS: 30,
      maxBitrate: 1000,
      hardwareAcceleration: false,
      codec: 'h264'
    };

    switch (this.userTier.id) {
      case 'BOOST_PLUS_TIER_2':
        capabilities.maxResolution = '1080p';
        capabilities.maxFPS = 60;
        capabilities.maxBitrate = 2500;
        break;

      case 'BOOST_PLUS_TIER_3':
        capabilities.maxResolution = '1440p';
        capabilities.maxFPS = 60;
        capabilities.maxBitrate = 4000;
        capabilities.hardwareAcceleration = true;
        break;

      case 'BOOST_PLUS_TIER_4':
        capabilities.maxResolution = '4K';
        capabilities.maxFPS = 60;
        capabilities.maxBitrate = 8000;
        capabilities.hardwareAcceleration = true;
        capabilities.codec = 'h265';
        break;

      case 'BOOST_PLUS_TIER_5':
        capabilities.maxResolution = 'ultrawide';
        capabilities.maxFPS = 60;
        capabilities.maxBitrate = 12000;
        capabilities.hardwareAcceleration = true;
        capabilities.codec = 'h265';
        break;
    }

    return capabilities;
  }

  public getTierLimitations(): string[] {
    if (!this.userTier) {
      return [
        'Limited to 720p streaming',
        '30 FPS maximum',
        'Basic quality settings',
        'No hardware acceleration'
      ];
    }

    const limitations = [];

    if (this.userTier.id === 'FREE') {
      limitations.push('Limited to 720p streaming');
      limitations.push('30 FPS maximum');
      limitations.push('Basic quality settings');
      limitations.push('No hardware acceleration');
    } else if (this.userTier.id === 'BOOST_PLUS_TIER_2') {
      limitations.push('Maximum 1080p streaming');
      limitations.push('No 4K support');
    } else if (this.userTier.id === 'BOOST_PLUS_TIER_3') {
      limitations.push('Maximum 1440p streaming');
      limitations.push('No 4K support');
    } else if (this.userTier.id === 'BOOST_PLUS_TIER_4') {
      limitations.push('No ultra-wide support');
    }

    return limitations;
  }
}
