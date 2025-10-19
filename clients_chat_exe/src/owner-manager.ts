// VibeChat Owner Control Manager
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { UserAccount } from '../types/vibechat';

export interface OwnerProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'OWNER';
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  permissions: string[];
  subscriptionTier: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
}

export interface OwnerControlData {
  owner: OwnerProfile;
  users: UserProfile[];
  systemStats: {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    totalRevenue: number;
    systemUptime: string;
  };
}

export class OwnerManager {
  private ownerFilePath: string;
  private usersFilePath: string;
  private systemStatsPath: string;

  constructor() {
    const appDataPath = this.getAppDataPath();
    this.ownerFilePath = path.join(appDataPath, 'owner-profile.json');
    this.usersFilePath = path.join(appDataPath, 'users-database.json');
    this.systemStatsPath = path.join(appDataPath, 'system-stats.json');
    this.initializeOwnerSystem();
  }

  private async initializeOwnerSystem(): Promise<void> {
    try {
      // Create owner profile with your custom ID
      const ownerProfile: OwnerProfile = {
        id: '92391959678',
        username: 'VibeChatOwner',
        email: 'owner@vibechat.com',
        fullName: 'VibeChat System Owner',
        role: 'OWNER',
        permissions: [
          'FULL_SYSTEM_ACCESS',
          'USER_MANAGEMENT',
          'SYSTEM_CONFIGURATION',
          'REVENUE_MANAGEMENT',
          'SECURITY_CONTROL',
          'BACKUP_RESTORE',
          'ANALYTICS_ACCESS',
          'UPDATE_CONTROL'
        ],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save owner profile
      await this.saveOwnerProfile(ownerProfile);

      // Initialize users database
      await this.initializeUsersDatabase();

      // Initialize system stats
      await this.initializeSystemStats();

      console.log('✅ Owner control system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize owner system:', error);
    }
  }

  public async authenticateOwner(username: string, password: string): Promise<{ success: boolean; owner?: OwnerProfile; error?: string }> {
    try {
      const ownerProfile = await this.loadOwnerProfile();
      
      if (!ownerProfile) {
        return { success: false, error: 'Owner profile not found' };
      }

      // Check owner credentials
      if (username === 'VibeChatOwner' && password === 'Owner92391959678!') {
        // Update last login
        ownerProfile.lastLogin = new Date().toISOString();
        await this.saveOwnerProfile(ownerProfile);
        
        return { success: true, owner: ownerProfile };
      }

      return { success: false, error: 'Invalid owner credentials' };
    } catch (error) {
      console.error('Owner authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  public async generateUniqueUserId(): Promise<string> {
    try {
      // Generate a unique 11-digit ID similar to your owner ID
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      const uniqueId = timestamp + random;
      
      // Ensure it's unique by checking existing users
      const users = await this.loadUsersDatabase();
      let finalId = uniqueId;
      let counter = 1;
      
      while (users.some(user => user.id === finalId)) {
        finalId = (parseInt(uniqueId) + counter).toString();
        counter++;
      }
      
      return finalId;
    } catch (error) {
      console.error('Failed to generate unique user ID:', error);
      return crypto.randomBytes(6).toString('hex');
    }
  }

  public async createUser(userData: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const users = await this.loadUsersDatabase();
      
      // Check if username already exists
      if (users.some(user => user.username === userData.username)) {
        return { success: false, error: 'Username already exists' };
      }

      // Check if email already exists
      if (users.some(user => user.email === userData.email)) {
        return { success: false, error: 'Email already exists' };
      }

      // Generate unique user ID
      const userId = await this.generateUniqueUserId();

      // Create new user profile
      const newUser: UserProfile = {
        id: userId,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: 'USER',
        permissions: ['BASIC_CHAT', 'ROOM_ACCESS'],
        subscriptionTier: 'FREE',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        isBanned: false
      };

      // Add to users database
      users.push(newUser);
      await this.saveUsersDatabase(users);

      // Update system stats
      await this.updateSystemStats();

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Failed to create user:', error);
      return { success: false, error: 'User creation failed' };
    }
  }

  public async getAllUsers(): Promise<UserProfile[]> {
    try {
      return await this.loadUsersDatabase();
    } catch (error) {
      console.error('Failed to load users:', error);
      return [];
    }
  }

  public async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const users = await this.loadUsersDatabase();
      return users.find(user => user.id === userId) || null;
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      return null;
    }
  }

  public async updateUser(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const users = await this.loadUsersDatabase();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      // Update user data
      users[userIndex] = { ...users[userIndex], ...updates };
      await this.saveUsersDatabase(users);

      return { success: true, user: users[userIndex] };
    } catch (error) {
      console.error('Failed to update user:', error);
      return { success: false, error: 'Update failed' };
    }
  }

  public async banUser(userId: string, reason: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.updateUser(userId, {
        isBanned: true,
        banReason: reason,
        isActive: false
      });

      if (result.success) {
        await this.updateSystemStats();
      }

      return result;
    } catch (error) {
      console.error('Failed to ban user:', error);
      return { success: false, error: 'Ban failed' };
    }
  }

  public async unbanUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.updateUser(userId, {
        isBanned: false,
        banReason: undefined,
        isActive: true
      });

      if (result.success) {
        await this.updateSystemStats();
      }

      return result;
    } catch (error) {
      console.error('Failed to unban user:', error);
      return { success: false, error: 'Unban failed' };
    }
  }

  public async getSystemStats(): Promise<any> {
    try {
      return await this.loadSystemStats();
    } catch (error) {
      console.error('Failed to load system stats:', error);
      return null;
    }
  }

  public async updateSystemStats(): Promise<void> {
    try {
      const users = await this.loadUsersDatabase();
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(user => user.isActive && !user.isBanned).length,
        bannedUsers: users.filter(user => user.isBanned).length,
        totalRevenue: 0, // This would be calculated from subscription data
        systemUptime: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      await this.saveSystemStats(stats);
    } catch (error) {
      console.error('Failed to update system stats:', error);
    }
  }

  private async saveOwnerProfile(owner: OwnerProfile): Promise<void> {
    try {
      fs.writeFileSync(this.ownerFilePath, JSON.stringify(owner, null, 2));
    } catch (error) {
      console.error('Failed to save owner profile:', error);
      throw error;
    }
  }

  private async loadOwnerProfile(): Promise<OwnerProfile | null> {
    try {
      if (fs.existsSync(this.ownerFilePath)) {
        const data = fs.readFileSync(this.ownerFilePath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Failed to load owner profile:', error);
      return null;
    }
  }

  private async saveUsersDatabase(users: UserProfile[]): Promise<void> {
    try {
      fs.writeFileSync(this.usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Failed to save users database:', error);
      throw error;
    }
  }

  private async loadUsersDatabase(): Promise<UserProfile[]> {
    try {
      if (fs.existsSync(this.usersFilePath)) {
        const data = fs.readFileSync(this.usersFilePath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Failed to load users database:', error);
      return [];
    }
  }

  private async saveSystemStats(stats: any): Promise<void> {
    try {
      fs.writeFileSync(this.systemStatsPath, JSON.stringify(stats, null, 2));
    } catch (error) {
      console.error('Failed to save system stats:', error);
      throw error;
    }
  }

  private async loadSystemStats(): Promise<any> {
    try {
      if (fs.existsSync(this.systemStatsPath)) {
        const data = fs.readFileSync(this.systemStatsPath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Failed to load system stats:', error);
      return null;
    }
  }

  private async initializeUsersDatabase(): Promise<void> {
    try {
      if (!fs.existsSync(this.usersFilePath)) {
        await this.saveUsersDatabase([]);
      }
    } catch (error) {
      console.error('Failed to initialize users database:', error);
    }
  }

  private async initializeSystemStats(): Promise<void> {
    try {
      if (!fs.existsSync(this.systemStatsPath)) {
        const initialStats = {
          totalUsers: 0,
          activeUsers: 0,
          bannedUsers: 0,
          totalRevenue: 0,
          systemUptime: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        await this.saveSystemStats(initialStats);
      }
    } catch (error) {
      console.error('Failed to initialize system stats:', error);
    }
  }

  private getAppDataPath(): string {
    const os = require('os');
    const appDataPath = path.join(os.homedir(), 'AppData', 'Local', 'VibeChat', 'OwnerControl');
    
    if (!fs.existsSync(appDataPath)) {
      fs.mkdirSync(appDataPath, { recursive: true });
    }
    
    return appDataPath;
  }
}
