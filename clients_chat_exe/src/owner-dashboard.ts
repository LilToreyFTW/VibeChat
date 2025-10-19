// VibeChat Owner Dashboard
import { OwnerManager, OwnerProfile, UserProfile, OwnerControlData } from './owner-manager';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  newUsersToday: number;
  totalRevenue: number;
  systemUptime: string;
  serverStatus: {
    backend: boolean;
    frontend: boolean;
    aiService: boolean;
    roomServer: boolean;
  };
}

export interface UserManagementData {
  users: UserProfile[];
  searchQuery: string;
  filterRole: string;
  filterStatus: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class OwnerDashboard {
  private ownerManager: OwnerManager;
  private currentOwner: OwnerProfile | null = null;

  constructor() {
    this.ownerManager = new OwnerManager();
  }

  public async authenticateOwner(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.ownerManager.authenticateOwner(username, password);
      if (result.success && result.owner) {
        this.currentOwner = result.owner;
        return { success: true };
      }
      return { success: false, error: result.error || 'Authentication failed' };
    } catch (error) {
      console.error('Owner authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  public async getDashboardStats(): Promise<DashboardStats> {
    try {
      const systemStats = await this.ownerManager.getSystemStats();
      const users = await this.ownerManager.getAllUsers();
      
      // Calculate additional stats
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = users.filter(user => 
        user.createdAt.split('T')[0] === today
      ).length;

      return {
        totalUsers: systemStats?.totalUsers || 0,
        activeUsers: systemStats?.activeUsers || 0,
        bannedUsers: systemStats?.bannedUsers || 0,
        newUsersToday,
        totalRevenue: systemStats?.totalRevenue || 0,
        systemUptime: systemStats?.systemUptime || new Date().toISOString(),
        serverStatus: {
          backend: true, // This would be checked against actual services
          frontend: true,
          aiService: true,
          roomServer: true
        }
      };
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        bannedUsers: 0,
        newUsersToday: 0,
        totalRevenue: 0,
        systemUptime: new Date().toISOString(),
        serverStatus: {
          backend: false,
          frontend: false,
          aiService: false,
          roomServer: false
        }
      };
    }
  }

  public async getUserManagementData(filters: {
    searchQuery?: string;
    filterRole?: string;
    filterStatus?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<UserManagementData> {
    try {
      let users = await this.ownerManager.getAllUsers();

      // Apply search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        users = users.filter(user => 
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.fullName.toLowerCase().includes(query) ||
          user.id.includes(query)
        );
      }

      // Apply role filter
      if (filters.filterRole && filters.filterRole !== 'ALL') {
        users = users.filter(user => user.role === filters.filterRole);
      }

      // Apply status filter
      if (filters.filterStatus && filters.filterStatus !== 'ALL') {
        switch (filters.filterStatus) {
          case 'ACTIVE':
            users = users.filter(user => user.isActive && !user.isBanned);
            break;
          case 'BANNED':
            users = users.filter(user => user.isBanned);
            break;
          case 'INACTIVE':
            users = users.filter(user => !user.isActive);
            break;
        }
      }

      // Apply sorting
      if (filters.sortBy) {
        users.sort((a, b) => {
          let aValue: any = a[filters.sortBy as keyof UserProfile];
          let bValue: any = b[filters.sortBy as keyof UserProfile];

          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          } else {
            return aValue > bValue ? 1 : -1;
          }
        });
      }

      return {
        users,
        searchQuery: filters.searchQuery || '',
        filterRole: filters.filterRole || 'ALL',
        filterStatus: filters.filterStatus || 'ALL',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc'
      };
    } catch (error) {
      console.error('Failed to get user management data:', error);
      return {
        users: [],
        searchQuery: '',
        filterRole: 'ALL',
        filterStatus: 'ALL',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
    }
  }

  public async banUser(userId: string, reason: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentOwner) {
        return { success: false, error: 'Not authenticated as owner' };
      }

      const result = await this.ownerManager.banUser(userId, reason);
      return result;
    } catch (error) {
      console.error('Failed to ban user:', error);
      return { success: false, error: 'Failed to ban user' };
    }
  }

  public async unbanUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentOwner) {
        return { success: false, error: 'Not authenticated as owner' };
      }

      const result = await this.ownerManager.unbanUser(userId);
      return result;
    } catch (error) {
      console.error('Failed to unban user:', error);
      return { success: false, error: 'Failed to unban user' };
    }
  }

  public async updateUserRole(userId: string, newRole: 'USER' | 'ADMIN' | 'MODERATOR'): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentOwner) {
        return { success: false, error: 'Not authenticated as owner' };
      }

      const result = await this.ownerManager.updateUser(userId, { role: newRole });
      return result;
    } catch (error) {
      console.error('Failed to update user role:', error);
      return { success: false, error: 'Failed to update user role' };
    }
  }

  public async updateUserSubscription(userId: string, newTier: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentOwner) {
        return { success: false, error: 'Not authenticated as owner' };
      }

      const result = await this.ownerManager.updateUser(userId, { subscriptionTier: newTier });
      return result;
    } catch (error) {
      console.error('Failed to update user subscription:', error);
      return { success: false, error: 'Failed to update user subscription' };
    }
  }

  public async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      return await this.ownerManager.getUserById(userId);
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      return null;
    }
  }

  public async exportUserData(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.currentOwner) {
        return { success: false, error: 'Not authenticated as owner' };
      }

      const users = await this.ownerManager.getAllUsers();
      const stats = await this.ownerManager.getSystemStats();
      
      const exportData = {
        exportDate: new Date().toISOString(),
        exportedBy: this.currentOwner.username,
        totalUsers: users.length,
        users: users,
        systemStats: stats
      };

      return { success: true, data: exportData };
    } catch (error) {
      console.error('Failed to export user data:', error);
      return { success: false, error: 'Failed to export user data' };
    }
  }

  public async getSystemLogs(): Promise<{ success: boolean; logs?: string[]; error?: string }> {
    try {
      if (!this.currentOwner) {
        return { success: false, error: 'Not authenticated as owner' };
      }

      // This would integrate with actual logging system
      const mockLogs = [
        `[${new Date().toISOString()}] System started successfully`,
        `[${new Date().toISOString()}] Owner ${this.currentOwner.username} logged in`,
        `[${new Date().toISOString()}] User database updated`,
        `[${new Date().toISOString()}] System health check passed`
      ];

      return { success: true, logs: mockLogs };
    } catch (error) {
      console.error('Failed to get system logs:', error);
      return { success: false, error: 'Failed to get system logs' };
    }
  }

  public isOwnerAuthenticated(): boolean {
    return this.currentOwner !== null;
  }

  public getCurrentOwner(): OwnerProfile | null {
    return this.currentOwner;
  }

  public logout(): void {
    this.currentOwner = null;
  }
}
