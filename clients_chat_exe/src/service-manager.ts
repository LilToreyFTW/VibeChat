// VibeChat Service Manager
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { ServiceStatus } from '../types/vibechat';

export class ServiceManager {
  private services: Map<string, ChildProcess> = new Map();
  private status: ServiceStatus;

  constructor() {
    this.status = {
      backend: false,
      python: false,
      chatRooms: false,
      httpServer: false,
      lastCheck: new Date().toISOString()
    };
  }

  public async startAll(): Promise<void> {
    try {
      await this.startJavaBackend();
      await this.startPythonService();
      await this.startChatRooms();
      await this.startHttpServer();
      
      this.status.lastCheck = new Date().toISOString();
      console.log('All services started successfully');
    } catch (error) {
      console.error('Failed to start services:', error);
      throw error;
    }
  }

  public async stopAll(): Promise<void> {
    try {
      for (const [name, process] of this.services) {
        if (process && !process.killed) {
          process.kill();
          console.log(`Stopped service: ${name}`);
        }
      }
      this.services.clear();
      
      this.status = {
        backend: false,
        python: false,
        chatRooms: false,
        httpServer: false,
        lastCheck: new Date().toISOString()
      };
      
      console.log('All services stopped');
    } catch (error) {
      console.error('Failed to stop services:', error);
      throw error;
    }
  }

  public getStatus(): ServiceStatus {
    return this.status;
  }

  private async startJavaBackend(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const backendPath = path.join(__dirname, '../../backend/target/vibechat-backend-1.0.0.jar');
        
        if (!fs.existsSync(backendPath)) {
          console.warn('Backend JAR not found, using mock service');
          this.status.backend = true;
          resolve();
          return;
        }

        const process = spawn('java', ['-jar', backendPath], {
          cwd: path.join(__dirname, '../../backend'),
          stdio: 'pipe'
        });

        process.on('error', (error) => {
          console.error('Backend service error:', error);
          this.status.backend = false;
          reject(error);
        });

        process.on('spawn', () => {
          console.log('Java backend started');
          this.status.backend = true;
          this.services.set('backend', process);
          resolve();
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          if (!this.status.backend) {
            reject(new Error('Backend startup timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('Failed to start Java backend:', error);
        reject(error);
      }
    });
  }

  private async startPythonService(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const pythonPath = path.join(__dirname, '../../python-service/dist/VibeChat-AI-Service/VibeChat-AI-Service.exe');
        
        if (!fs.existsSync(pythonPath)) {
          console.warn('Python service not found, using mock service');
          this.status.python = true;
          resolve();
          return;
        }

        const process = spawn(pythonPath, [], {
          cwd: path.join(__dirname, '../../python-service/dist/VibeChat-AI-Service'),
          stdio: 'pipe'
        });

        process.on('error', (error) => {
          console.error('Python service error:', error);
          this.status.python = false;
          reject(error);
        });

        process.on('spawn', () => {
          console.log('Python AI service started');
          this.status.python = true;
          this.services.set('python', process);
          resolve();
        });

        setTimeout(() => {
          if (!this.status.python) {
            reject(new Error('Python service startup timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('Failed to start Python service:', error);
        reject(error);
      }
    });
  }

  private async startChatRooms(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const chatRoomsPath = path.join(__dirname, '../../chat-rooms');
        
        if (!fs.existsSync(path.join(chatRoomsPath, 'package.json'))) {
          console.warn('Chat rooms service not found, using mock service');
          this.status.chatRooms = true;
          resolve();
          return;
        }

        const process = spawn('npm', ['start'], {
          cwd: chatRoomsPath,
          stdio: 'pipe',
          shell: true
        });

        process.on('error', (error) => {
          console.error('Chat rooms service error:', error);
          this.status.chatRooms = false;
          reject(error);
        });

        process.on('spawn', () => {
          console.log('Chat rooms service started');
          this.status.chatRooms = true;
          this.services.set('chatRooms', process);
          resolve();
        });

        setTimeout(() => {
          if (!this.status.chatRooms) {
            reject(new Error('Chat rooms service startup timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('Failed to start chat rooms service:', error);
        reject(error);
      }
    });
  }

  private async startHttpServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const httpServerPath = path.join(__dirname, '../../http_server_files');
        
        if (!fs.existsSync(path.join(httpServerPath, 'package.json'))) {
          console.warn('HTTP server not found, using mock service');
          this.status.httpServer = true;
          resolve();
          return;
        }

        const process = spawn('npm', ['start'], {
          cwd: httpServerPath,
          stdio: 'pipe',
          shell: true
        });

        process.on('error', (error) => {
          console.error('HTTP server error:', error);
          this.status.httpServer = false;
          reject(error);
        });

        process.on('spawn', () => {
          console.log('HTTP server started');
          this.status.httpServer = true;
          this.services.set('httpServer', process);
          resolve();
        });

        setTimeout(() => {
          if (!this.status.httpServer) {
            reject(new Error('HTTP server startup timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('Failed to start HTTP server:', error);
        reject(error);
      }
    });
  }
}
