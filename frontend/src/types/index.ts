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
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  maxMembers?: number;
  allowBots?: boolean;
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
