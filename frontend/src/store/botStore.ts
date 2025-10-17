import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bot, CreateBotRequest, UpdateBotRequest } from '../types';
import apiService from '../services/api';

interface BotState {
  bots: Bot[];
  currentBot: Bot | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBots: () => Promise<void>;
  fetchUserBots: () => Promise<void>;
  fetchRoomBots: (roomId: number) => Promise<void>;
  fetchBotById: (botId: number) => Promise<void>;
  createBot: (data: CreateBotRequest) => Promise<void>;
  updateBot: (botId: number, data: UpdateBotRequest) => Promise<void>;
  deleteBot: (botId: number) => Promise<void>;
  setCurrentBot: (bot: Bot | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useBotStore = create<BotState>()(
  persist(
    (set, get) => ({
      bots: [],
      currentBot: null,
      isLoading: false,
      error: null,

      fetchBots: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.getMyBots();

          if (response.success && response.data) {
            set({
              bots: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              bots: [],
              isLoading: false,
              error: response.message || 'Failed to fetch bots',
            });
          }
        } catch (error: any) {
          set({
            bots: [],
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch bots',
          });
        }
      },

      fetchUserBots: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.getMyBots();

          if (response.success && response.data) {
            set({
              bots: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              bots: [],
              isLoading: false,
              error: response.message || 'Failed to fetch user bots',
            });
          }
        } catch (error: any) {
          set({
            bots: [],
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch user bots',
          });
        }
      },

      fetchRoomBots: async (roomId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.getRoomBots(roomId);

          if (response.success && response.data) {
            set({
              bots: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              bots: [],
              isLoading: false,
              error: response.message || 'Failed to fetch room bots',
            });
          }
        } catch (error: any) {
          set({
            bots: [],
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch room bots',
          });
        }
      },

      fetchBotById: async (botId: number) => {
        set({ isLoading: true, error: null });

        try {
          // For now, we'll search in the existing bots array
          // In a real app, you might want to make an API call
          const existingBot = get().bots.find(bot => bot.id === botId);

          if (existingBot) {
            set({
              currentBot: existingBot,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              currentBot: null,
              isLoading: false,
              error: 'Bot not found',
            });
          }
        } catch (error: any) {
          set({
            currentBot: null,
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch bot',
          });
        }
      },

      createBot: async (data: CreateBotRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.createBot(data);

          if (response.success && response.data) {
            const newBots = [...get().bots, response.data];
            set({
              bots: newBots,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: response.message || 'Failed to create bot',
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to create bot',
          });
        }
      },

      updateBot: async (botId: number, data: UpdateBotRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.updateBot(botId, data);

          if (response.success && response.data) {
            const updatedBots = get().bots.map(bot =>
              bot.id === botId ? response.data! : bot
            ).filter(bot => bot !== undefined) as Bot[];
            set({
              bots: updatedBots,
              currentBot: get().currentBot?.id === botId ? response.data : get().currentBot,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: response.message || 'Failed to update bot',
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update bot',
          });
        }
      },

      deleteBot: async (botId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.deleteBot(botId);

          if (response.success) {
            const filteredBots = get().bots.filter(bot => bot.id !== botId);
            set({
              bots: filteredBots,
              currentBot: get().currentBot?.id === botId ? null : get().currentBot,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: response.message || 'Failed to delete bot',
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to delete bot',
          });
        }
      },

      setCurrentBot: (bot: Bot | null) => {
        set({ currentBot: bot });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'bot-storage',
      partialize: (state) => ({
        bots: state.bots,
        currentBot: state.currentBot,
      }),
    }
  )
);
