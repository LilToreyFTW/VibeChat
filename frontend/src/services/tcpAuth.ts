export class TcpAuthService {
  private socket: WebSocket | null = null;
  private isConnected = false;

  constructor() {
    // Auto-detect Electron environment for TCP connections
    if (typeof window !== 'undefined' && window.electron) {
      console.log('TCP Auth Service: Running in Electron, using TCP connections');
    } else {
      console.log('TCP Auth Service: Running in browser, falling back to HTTP');
    }
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isConnected) {
        resolve(true);
        return;
      }

      try {
        // Try TCP connection first (for Electron)
        if (typeof window !== 'undefined' && window.electron) {
          this.socket = new WebSocket('ws://localhost:8083');
        } else {
          // Fallback to HTTP for web version
          resolve(true);
          return;
        }

        this.socket.onopen = () => {
          console.log('TCP Auth Service: Connected to backend');
          this.isConnected = true;
          resolve(true);
        };

        this.socket.onerror = (error) => {
          console.error('TCP Auth Service: Connection error', error);
          // Fallback to HTTP
          resolve(true);
        };

        this.socket.onclose = () => {
          console.log('TCP Auth Service: Connection closed');
          this.isConnected = false;
        };

      } catch (error) {
        console.error('TCP Auth Service: Failed to create connection', error);
        resolve(true); // Fallback to HTTP
      }
    });
  }

  async login(username: string, password: string): Promise<any> {
    // Try TCP first, fallback to HTTP
    if (this.isConnected && this.socket) {
      try {
        const request = {
          action: 'LOGIN',
          username,
          password
        };

        const response = await this.sendTcpMessage(request);
        return response;
      } catch (error) {
        console.error('TCP login failed, falling back to HTTP:', error);
      }
    }

    // Fallback to HTTP
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(username: string, email: string, password: string, fullName?: string): Promise<any> {
    // Try TCP first, fallback to HTTP
    if (this.isConnected && this.socket) {
      try {
        const request = {
          action: 'REGISTER',
          username,
          email,
          password,
          fullName
        };

        const response = await this.sendTcpMessage(request);
        return response;
      } catch (error) {
        console.error('TCP register failed, falling back to HTTP:', error);
      }
    }

    // Fallback to HTTP
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, fullName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async sendTcpMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('TCP connection not available'));
        return;
      }

      const messageId = Math.random().toString(36).substr(2, 9);
      const requestWithId = { ...message, messageId };

      const timeout = setTimeout(() => {
        reject(new Error('TCP request timeout'));
      }, 10000);

      const originalOnMessage = this.socket.onmessage;
      this.socket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          if (response.messageId === messageId) {
            clearTimeout(timeout);
            this.socket!.onmessage = originalOnMessage;
            resolve(response);
          }
        } catch (error) {
          clearTimeout(timeout);
          this.socket!.onmessage = originalOnMessage;
          reject(error);
        }
      };

      this.socket.send(JSON.stringify(requestWithId));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

// Singleton instance
export const tcpAuthService = new TcpAuthService();
