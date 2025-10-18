import { create } from 'zustand';
import { ChatMessage } from '../types';
import webSocketService from '../services/websocket';

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  currentRoomCode: string | null;

  // Actions
  connectToRoom: (roomCode: string, username: string) => Promise<void>;
  disconnectFromRoom: () => void;
  sendMessage: (content: string, sender: string) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isConnected: false,
  isLoading: false,
  error: null,
  currentRoomCode: null,

  connectToRoom: async (roomCode: string, username: string) => {
    set({ isLoading: true, error: null });

    try {
      await webSocketService.connect(roomCode, (message) => {
        get().addMessage(message);
      });

      webSocketService.joinRoom(roomCode, username);

      set({
        isConnected: true,
        isLoading: false,
        currentRoomCode: roomCode,
        error: null,
      });
    } catch (error: any) {
      set({
        isConnected: false,
        isLoading: false,
        error: error.message || 'Failed to connect to room',
      });
    }
  },

  disconnectFromRoom: () => {
    webSocketService.disconnect();

    set({
      isConnected: false,
      currentRoomCode: null,
      messages: [],
      error: null,
    });
  },

  sendMessage: (content: string, sender: string) => {
    if (!get().isConnected || !get().currentRoomCode) {
      set({ error: 'Not connected to a room' });
      return;
    }

    const message: ChatMessage = {
      type: 'CHAT',
      content,
      sender,
      timestamp: new Date().toISOString(),
      roomCode: get().currentRoomCode || '',
    };

    webSocketService.sendMessage(get().currentRoomCode!, message);
  },

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
