// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  userId: string;
  developerMode: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// Room Types
export interface Room {
  id: number;
  name: string;
  description?: string;
  roomCode: string;
  roomUrl: string;
  roomImage?: string;
  isActive: boolean;
  maxMembers: number;
  allowBots: boolean;
  createdAt: string;
  creator: CreatorInfo;
  linkExpirationDays?: number;
  permanentLink?: boolean;
  linkCreatedAt?: string;
  linkExpiresAt?: string;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  maxMembers?: number;
  allowBots?: boolean;
  linkExpirationDays?: number;
  permanentLink?: boolean;
}

export interface RoomLinkSettings {
  linkExpirationDays?: number;
  permanentLink?: boolean;
}

export interface UpdateRoomRequest {
  name?: string;
  description?: string;
  maxMembers?: number;
  allowBots?: boolean;
}

export interface CreatorInfo {
  id: number;
  username: string;
  fullName?: string;
}

// Bot Types
export interface Bot {
  id: number;
  name: string;
  description?: string;
  botToken: string;
  isActive: boolean;
  aiModel: string;
  personality?: string;
  createdAt: string;
  owner: OwnerInfo;
  room?: RoomInfo;

  // Bot capability restrictions (hardcoded rules)
  canMonitorRoom: boolean;
  canCreateRoles: boolean;
  canCreateModerators: boolean;
  canSearchUsers: boolean;
  canFetchUserData: boolean;
  canDDoS: boolean;
  canReverseConnect: boolean;
  canAccessUserSystems: boolean;
}

export interface CreateBotRequest {
  name: string;
  description?: string;
  aiModel?: string;
  personality?: string;
  roomId?: number;
}

export interface UpdateBotRequest {
  name?: string;
  description?: string;
  aiModel?: string;
  personality?: string;
  isActive?: boolean;
}

export interface OwnerInfo {
  id: number;
  username: string;
  fullName?: string;
}

export interface RoomInfo {
  id: number;
  name: string;
  roomCode: string;
}

// AI Types
export interface LinkGenerationRequest {
  length?: number;
}

export interface LinkGenerationResponse {
  roomUrl: string;
  roomCode: string;
}

export interface AIAnalysisRequest {
  text: string;
  analysisType?: string;
}

export interface AIAnalysisResponse {
  result: Record<string, any>;
  confidence: number;
}

// Chat Types
export interface ChatMessage {
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'BOT';
  content: string;
  sender: string;
  timestamp: string;
  roomCode?: string;
}

// Form Types
export interface FormErrors {
  [key: string]: string;
}

// Subscription Types
export interface Subscription {
  id: number;
  tier: 'FREE' | 'BOOST_PLUS_TIER_2' | 'BOOST_PLUS_TIER_3' | 'BOOST_PLUS_TIER_4' | 'BOOST_PLUS_TIER_5';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING';
  price: number;
  currency: string;
  startDate: string;
  endDate?: string;
  features: string;
  btcWalletAddress: string;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface TierInfo {
  tier: string;
  price: number;
  features: string;
  name: string;
}

export interface PaymentMethodInfo {
  name: string;
  description: string;
  note?: string;
  wallet?: string;
}

export interface CreateSubscriptionRequest {
  tier: 'BOOST_PLUS_TIER_2' | 'BOOST_PLUS_TIER_3' | 'BOOST_PLUS_TIER_4' | 'BOOST_PLUS_TIER_5';
  paymentMethod: 'BTC' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL';
  paymentDetails?: string;
}

// Electron API Types
export interface ElectronAPI {
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

  // IPC event listeners
  onUpdateStatus: (callback: (status: string) => void) => void;
  onUpdateError: (callback: (error: string) => void) => void;
  onUpdateProgress: (callback: (progress: any) => void) => void;
  onUpdateDownloaded: (callback: (info: any) => void) => void;

  // Update actions
  checkForUpdates: () => Promise<any>;
  downloadUpdate: () => Promise<any>;
  quitAndInstall: () => Promise<void>;

  // HWID and Auto-start actions
  getHWID: () => Promise<string>;
  enableAutoStart: () => Promise<boolean>;
  disableAutoStart: () => Promise<boolean>;
  isAutoStartEnabled: () => Promise<boolean>;
  lockHWIDToAccount: (accountData: { username: string; userId: string }) => Promise<{ success: boolean; error?: string }>;
  unlockAccount: () => Promise<{ success: boolean; error?: string }>;

  // Auto-login listener
  onAutoLogin: (callback: (account: { username: string; userId: string }) => void) => void;

  // Menu actions
  onMenuAction: (callback: (action: string) => void) => void;

  // Window events
  onWindowFocus: (callback: (focused: boolean) => void) => void;

  // App quit request
  onAppQuitRequest: (callback: () => void) => void;

  // Room URL handling
  onOpenRoomUrl: (callback: (roomCode: string) => void) => void;

  // Remove event listeners
  removeAllListeners: (channel: string) => void;

  // External link opening (safe way)
  openExternal: (url: string) => Promise<void>;

  // Platform detection helpers
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;

  // Environment detection
  isDev: boolean;

  // Streaming capabilities
  getStreamingCapabilities: () => Promise<{
    maxResolution: string;
    maxFPS: number;
    canStream4K: boolean;
    canStreamUltrawide: boolean;
    nvidiaGPU: boolean;
    error?: string;
  }>;

  // GPU detection
  detectGPU: () => Promise<{
    hasNvidiaGPU: boolean;
    gpuName: string;
    driverVersion: string;
    memory: number;
    supportedResolutions: string[];
    error?: string;
  }>;

  // Screen sharing
  requestScreenShare: () => Promise<{
    success: boolean;
    sources: Array<{
      id: string;
      name: string;
      thumbnail: string;
    }>;
    error?: string;
  }>;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

// Store Types (for state management)
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  isLoading: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
}

export interface SubscriptionState {
  subscriptions: Subscription[];
  availableTiers: Record<string, TierInfo>;
  isLoading: boolean;
  error: string | null;
}
