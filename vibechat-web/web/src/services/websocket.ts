import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../types';

class WebSocketService {
  private client: Client | null = null;
  private isConnected: boolean = false;
  private messageHandlers: Map<string, (message: ChatMessage) => void> = new Map();

  connect(roomCode: string, onMessage: (message: ChatMessage) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected && this.client) {
        resolve();
        return;
      }

      // Detect if running in Electron
      const isElectron = typeof window !== 'undefined' && window.electron;
      const wsUrl = isElectron ? 'http://localhost:8082/ws' : 'http://localhost:8082/ws';

      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        connectHeaders: {},
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = (frame) => {
        console.log('Connected to WebSocket:', frame);
        this.isConnected = true;

        // Subscribe to room messages
        this.client?.subscribe(`/topic/chat/${roomCode}`, (message) => {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          onMessage(chatMessage);
        });

        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP Error:', frame.headers['message']);
        console.error('Error details:', frame.body);
        this.isConnected = false;
        reject(new Error(`STOMP Error: ${frame.headers['message']}`));
      };

      this.client.onWebSocketClose = () => {
        console.log('WebSocket connection closed');
        this.isConnected = false;
      };

      this.client.activate();
    });
  }

  disconnect(): void {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
      this.client = null;
    }
  }

  sendMessage(roomCode: string, message: ChatMessage): void {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: `/app/chat/${roomCode}/sendMessage`,
        body: JSON.stringify(message),
      });
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinRoom(roomCode: string, username: string): void {
    if (this.client && this.isConnected) {
      const joinMessage: ChatMessage = {
        type: 'JOIN',
        content: `${username} joined the room`,
        sender: username,
        timestamp: new Date().toISOString(),
        roomCode,
      };

      this.client.publish({
        destination: `/app/chat/${roomCode}/addUser`,
        body: JSON.stringify(joinMessage),
      });
    }
  }

  isConnectionActive(): boolean {
    return this.isConnected && this.client !== null;
  }
}

// Create and export a single instance
export const webSocketService = new WebSocketService();
export default webSocketService;
