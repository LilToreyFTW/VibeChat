import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  User,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  Room,
  CreateRoomRequest,
  UpdateRoomRequest,
  Bot,
  CreateBotRequest,
  UpdateBotRequest,
  LinkGenerationRequest,
  LinkGenerationResponse,
  AIAnalysisRequest,
  AIAnalysisResponse,
  Subscription,
  CreateSubscriptionRequest
} from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Detect if running in Electron
    const isElectron = typeof window !== 'undefined' && window.electron;

    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || (isElectron ? 'http://localhost:8082/api' : 'http://localhost:8082/api'),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        const username = localStorage.getItem('username');
        if (username) {
          config.headers['X-User-Username'] = username;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken');
          localStorage.removeItem('username');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.client.post('/auth/login', data);
    return response.data;
  }

  async validateToken(): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.post('/auth/validate');
    return response.data;
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.post('/auth/verify-email', null, {
      params: { token }
    });
    return response.data;
  }

  async checkEmailVerification(email: string, token: string): Promise<ApiResponse<{ verified: boolean }>> {
    const response: AxiosResponse<ApiResponse<{ verified: boolean }>> = await this.client.post('/auth/check-email-verification', null, {
      params: { email, token }
    });
    return response.data;
  }

  async resendVerification(email: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.post('/auth/resend-verification', null, {
      params: { email }
    });
    return response.data;
  }

  // Room endpoints
  async createRoom(data: CreateRoomRequest): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.client.post('/rooms', data);
    return response.data;
  }

  async getMyRooms(): Promise<ApiResponse<Room[]>> {
    const response: AxiosResponse<ApiResponse<Room[]>> = await this.client.get('/rooms/my-rooms');
    return response.data;
  }

  async getRoomByCode(roomCode: string): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.client.get(`/rooms/${roomCode}`);
    return response.data;
  }

  async updateRoom(roomId: number, data: UpdateRoomRequest): Promise<ApiResponse<Room>> {
    const response: AxiosResponse<ApiResponse<Room>> = await this.client.put(`/rooms/${roomId}`, data);
    return response.data;
  }

  async deleteRoom(roomId: number): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.delete(`/rooms/${roomId}`);
    return response.data;
  }

  // Bot endpoints
  async createBot(data: CreateBotRequest): Promise<ApiResponse<Bot>> {
    const response: AxiosResponse<ApiResponse<Bot>> = await this.client.post('/bots', data);
    return response.data;
  }

  async getMyBots(): Promise<ApiResponse<Bot[]>> {
    const response: AxiosResponse<ApiResponse<Bot[]>> = await this.client.get('/bots/my-bots');
    return response.data;
  }

  async getRoomBots(roomId: number): Promise<ApiResponse<Bot[]>> {
    const response: AxiosResponse<ApiResponse<Bot[]>> = await this.client.get(`/bots/room/${roomId}`);
    return response.data;
  }

  async updateBot(botId: number, data: UpdateBotRequest): Promise<ApiResponse<Bot>> {
    const response: AxiosResponse<ApiResponse<Bot>> = await this.client.put(`/bots/${botId}`, data);
    return response.data;
  }

  async deleteBot(botId: number): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await this.client.delete(`/bots/${botId}`);
    return response.data;
  }

  // AI endpoints
  async generateRoomLink(data?: LinkGenerationRequest): Promise<ApiResponse<LinkGenerationResponse>> {
    const response: AxiosResponse<ApiResponse<LinkGenerationResponse>> = await this.client.post('/ai/generate-room-link', data || {});
    return response.data;
  }

  async generateUserId(): Promise<ApiResponse<{ user_id: string; message: string }>> {
    const response: AxiosResponse<ApiResponse<{ user_id: string; message: string }>> = await this.client.post('/ai/generate-user-id');
    return response.data;
  }

  async generateApiToken(): Promise<ApiResponse<{ api_token: string; message: string }>> {
    const response: AxiosResponse<ApiResponse<{ api_token: string; message: string }>> = await this.client.post('/ai/generate-api-token');
    return response.data;
  }

  async analyzeText(data: AIAnalysisRequest): Promise<ApiResponse<AIAnalysisResponse>> {
    const response: AxiosResponse<ApiResponse<AIAnalysisResponse>> = await this.client.post('/ai/analyze-text', data);
    return response.data;
  }

  // Subscription endpoints
  async getAvailableTiers(): Promise<ApiResponse<Record<string, any>>> {
    const response: AxiosResponse<ApiResponse<Record<string, any>>> = await this.client.get('/subscriptions/tiers');
    return response.data;
  }

  async getMySubscriptions(): Promise<ApiResponse<Subscription[]>> {
    const response: AxiosResponse<ApiResponse<Subscription[]>> = await this.client.get('/subscriptions/my');
    return response.data;
  }

  async purchaseSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.post('/subscriptions/purchase', data);
    return response.data;
  }

  async cancelSubscription(subscriptionId: number): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.post(`/subscriptions/cancel/${subscriptionId}`);
    return response.data;
  }

  async getSubscriptionStats(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.get('/subscriptions/stats');
    return response.data;
  }

  // Payment methods endpoints
  async getPaymentMethods(): Promise<ApiResponse<Record<string, any>>> {
    const response: AxiosResponse<ApiResponse<Record<string, any>>> = await this.client.get('/subscriptions/payment-methods');
    return response.data;
  }

  async getBTCWallet(): Promise<ApiResponse<{ btcWallet: string }>> {
    const response: AxiosResponse<ApiResponse<{ btcWallet: string }>> = await this.client.get('/subscriptions/btc-wallet');
    return response.data;
  }
}

// Create and export a single instance
export const apiService = new ApiService();
export default apiService;
