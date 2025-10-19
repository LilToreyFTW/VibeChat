// VibeChat Authentication Manager
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { UserAccount, BoostTier } from '../types/vibechat';
import { OwnerManager } from './owner-manager';
// Import will be handled at runtime since this is Electron main process

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface OwnerRegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResult {
  success: boolean;
  user?: UserAccount;
  error?: string;
  message?: string;
}

export class AuthManager {
  private authFilePath: string;
  private lockFilePath: string;
  private ownerManager: OwnerManager;

  constructor() {
    const appDataPath = this.getAppDataPath();
    this.authFilePath = path.join(appDataPath, 'auth.json');
    this.lockFilePath = path.join(appDataPath, 'account-lock.json');
    this.ownerManager = new OwnerManager();
  }

  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Validate credentials
      if (!credentials.username || !credentials.password) {
        return { success: false, error: 'Username and password are required' };
      }

      // Check for owner login first
      const ownerAuth = await this.ownerManager.authenticateOwner(credentials.username, credentials.password);
      if (ownerAuth.success && ownerAuth.owner) {
        const ownerUser: UserAccount = {
          id: ownerAuth.owner.id,
          username: ownerAuth.owner.username,
          email: ownerAuth.owner.email,
          fullName: ownerAuth.owner.fullName,
          isVerified: true,
          subscriptionTier: 'BOOST_PLUS_TIER_5',
          createdAt: ownerAuth.owner.createdAt,
          lastLogin: ownerAuth.owner.lastLogin
        };

        await this.saveAccountLock(ownerUser);
        return { success: true, user: ownerUser };
      }

      // Check for existing user data
      const userData = await this.loadUserData();
      if (userData && userData.username === credentials.username) {
        // Create user account with unique ID
        const user: UserAccount = {
          id: userData.id || await this.ownerManager.generateUniqueUserId(),
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          isVerified: true,
          subscriptionTier: userData.subscriptionTier || 'FREE',
          createdAt: userData.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        // Save authentication lock
        await this.saveAccountLock(user);

        return { success: true, user };
      }

      // Default admin login
      if (credentials.username === 'AdminT' && credentials.password === 'Torey991200@##@@##') {
        const adminUser: UserAccount = {
          id: await this.ownerManager.generateUniqueUserId(),
          username: 'AdminT',
          email: 'admin@vibechat.com',
          fullName: 'VibeChat Administrator',
          isVerified: true,
          subscriptionTier: 'BOOST_PLUS_TIER_5',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        await this.saveAccountLock(adminUser);
        return { success: true, user: adminUser };
      }

      return { success: false, error: 'Invalid credentials' };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  public async register(userData: RegisterData): Promise<AuthResult> {
    try {
      // Validate user data
      if (!userData.username || !userData.email || !userData.password || !userData.fullName) {
        return { success: false, error: 'All fields are required' };
      }

      // Check if user already exists
      const existingData = await this.loadUserData();
      if (existingData && existingData.username === userData.username) {
        return { success: false, error: 'Username already exists' };
      }

      // Create user through owner manager for unique ID generation
      const createResult = await this.ownerManager.createUser({
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        password: userData.password
      });

      if (!createResult.success) {
        return { success: false, error: createResult.error || 'Registration failed' };
      }

      // Convert to UserAccount format
      const newUser: UserAccount = {
        id: createResult.user!.id,
        username: createResult.user!.username,
        email: createResult.user!.email,
        fullName: createResult.user!.fullName,
        isVerified: true,
        subscriptionTier: createResult.user!.subscriptionTier as 'FREE' | 'BOOST_PLUS_TIER_2' | 'BOOST_PLUS_TIER_3' | 'BOOST_PLUS_TIER_4' | 'BOOST_PLUS_TIER_5',
        createdAt: createResult.user!.createdAt,
        lastLogin: createResult.user!.lastLogin
      };

      // Save user data locally
      await this.saveUserData(newUser);

      return { success: true, user: newUser };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  public async registerOwner(ownerData: OwnerRegisterData): Promise<AuthResult> {
    try {
      // Validate owner data
      if (!ownerData.username || !ownerData.email || !ownerData.password || !ownerData.fullName) {
        return { success: false, error: 'All fields are required' };
      }

      // Special owner registration - bypass normal user creation
      // Create owner user directly with all subscription tiers
      const ownerUser: UserAccount = {
        id: 'owner-' + Date.now(),
        username: ownerData.username,
        email: ownerData.email,
        fullName: ownerData.fullName,
        isVerified: false, // Will be verified via email
        subscriptionTier: 'BOOST_PLUS_TIER_5', // Highest tier for owner
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save owner data locally
      await this.saveUserData(ownerUser);

      // Store password separately for login
      await this.saveAccountLock(ownerUser);

      // Trigger email verification through backend API
      try {
        // Generate a simple verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Store verification token temporarily (in a real app, this would be in the backend)
        const verificationData = {
          email: ownerData.email,
          username: ownerData.username,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        // In a real implementation, this would be sent to the backend
        // For now, we'll simulate the email sending and log the token
        console.log('🔐 Owner Verification Token:', verificationToken);
        console.log('📧 Verification Email would be sent to:', ownerData.email);
        console.log('⏰ Token expires:', verificationData.expiresAt);

        // For testing purposes, we'll log the verification info for manual testing
        console.log('🔗 Verification URL would be: /verify-email?token=' + verificationToken);
        console.log('📋 To verify manually, use this token:', verificationToken);
      } catch (emailError) {
        console.warn('Email verification setup failed:', emailError);
      }

      return {
        success: true,
        user: ownerUser,
        message: 'Owner registration initiated. Please check your email for verification code.'
      };

    } catch (error) {
      console.error('Owner registration error:', error);
      return { success: false, error: 'Owner registration failed' };
    }
  }

  public async logout(): Promise<AuthResult> {
    try {
      // Remove account lock
      await this.removeAccountLock();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  public async checkAuth(): Promise<AuthResult> {
    try {
      const lockData = await this.loadAccountLock();
      if (lockData && lockData.user) {
        return { success: true, user: lockData.user };
      }
      return { success: false };
    } catch (error) {
      console.error('Auth check error:', error);
      return { success: false };
    }
  }

  public async cleanup(): Promise<void> {
    try {
      // Clean up any temporary files
      // This method can be extended for cleanup tasks
    } catch (error) {
      console.error('Auth cleanup error:', error);
    }
  }

  // Owner registration method - call this to register as owner
  public async registerAsOwner(): Promise<AuthResult> {
    const ownerData: OwnerRegisterData = {
      username: 'LilTorey',
      email: 'gtagod2020torey@gmail.com',
      password: 'Torey991200@##@@##',
      fullName: 'Torey Hancock'
    };

    console.log('🚀 Initiating owner registration for:', ownerData.username);
    return await this.registerOwner(ownerData);
  }

  private async loadUserData(): Promise<any> {
    try {
      if (fs.existsSync(this.authFilePath)) {
        const data = fs.readFileSync(this.authFilePath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  }

  private async saveUserData(user: UserAccount): Promise<void> {
    try {
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        subscriptionTier: user.subscriptionTier,
        createdAt: user.createdAt
      };
      
      fs.writeFileSync(this.authFilePath, JSON.stringify(userData, null, 2));
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw error;
    }
  }

  private async loadAccountLock(): Promise<any> {
    try {
      if (fs.existsSync(this.lockFilePath)) {
        const data = fs.readFileSync(this.lockFilePath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Failed to load account lock:', error);
      return null;
    }
  }

  private async saveAccountLock(user: UserAccount): Promise<void> {
    try {
      const lockData = {
        hwid: await this.getHardwareId(),
        autoLogin: true,
        username: user.username,
        userId: user.id,
        user: user,
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(this.lockFilePath, JSON.stringify(lockData, null, 2));
    } catch (error) {
      console.error('Failed to save account lock:', error);
      throw error;
    }
  }

  private async removeAccountLock(): Promise<void> {
    try {
      if (fs.existsSync(this.lockFilePath)) {
        fs.unlinkSync(this.lockFilePath);
      }
    } catch (error) {
      console.error('Failed to remove account lock:', error);
      throw error;
    }
  }

  private async getHardwareId(): Promise<string> {
    try {
      const os = require('os');
      const networkInterfaces = os.networkInterfaces();
      let macAddress = 'default';
      
      for (const interfaces of Object.values(networkInterfaces)) {
        for (const iface of interfaces as any[]) {
          if (!iface.internal && iface.mac && iface.mac !== '00:00:00:00:00:00') {
            macAddress = iface.mac;
            break;
          }
        }
        if (macAddress !== 'default') break;
      }
      
      return crypto.createHash('sha256').update(macAddress).digest('hex').substring(0, 16);
    } catch (error) {
      return crypto.createHash('sha256').update('default').digest('hex').substring(0, 16);
    }
  }

  private generateId(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  private getAppDataPath(): string {
    const os = require('os');
    const appDataPath = path.join(os.homedir(), 'AppData', 'Local', 'VibeChat');
    
    if (!fs.existsSync(appDataPath)) {
      fs.mkdirSync(appDataPath, { recursive: true });
    }
    
    return appDataPath;
  }
}
