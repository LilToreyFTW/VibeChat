// VibeChat Desktop Application Types
export interface VibeChatConfig {
  version: string;
  buildDate: string;
  environment: 'development' | 'production';
  features: {
    authentication: boolean;
    boostTiers: boolean;
    streaming: boolean;
    chat: boolean;
    autoUpdate: boolean;
  };
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isVerified: boolean;
  subscriptionTier: 'FREE' | 'BOOST_PLUS_TIER_2' | 'BOOST_PLUS_TIER_3' | 'BOOST_PLUS_TIER_4' | 'BOOST_PLUS_TIER_5';
  createdAt: string;
  lastLogin: string;
}

export interface BoostTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  streamingQuality: string;
  maxUsers: number;
  isActive: boolean;
}

export interface ServiceStatus {
  backend: boolean;
  python: boolean;
  chatRooms: boolean;
  httpServer: boolean;
  lastCheck: string;
}

export interface AppState {
  isAuthenticated: boolean;
  user: UserAccount | null;
  currentTier: BoostTier | null;
  services: ServiceStatus;
  isLoading: boolean;
  error: string | null;
}

export interface UpdateInfo {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  changelog: string[];
  isMandatory: boolean;
}

export interface StreamingConfig {
  quality: '720p' | '1080p' | '1440p' | '4K' | 'ultrawide';
  fps: number;
  bitrate: number;
  codec: string;
  hardwareAcceleration: boolean;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isSystem: boolean;
  roomId: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  code: string;
  isPrivate: boolean;
  maxUsers: number;
  currentUsers: number;
  owner: string;
  createdAt: string;
}
