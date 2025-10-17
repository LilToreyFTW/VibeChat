import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subscription, TierInfo, CreateSubscriptionRequest } from '../types';
import apiService from '../services/api';

interface SubscriptionState {
  subscriptions: Subscription[];
  availableTiers: Record<string, TierInfo>;
  paymentMethods: Record<string, any>;
  btcWallet: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSubscriptions: () => Promise<void>;
  fetchAvailableTiers: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  purchaseSubscription: (data: CreateSubscriptionRequest) => Promise<void>;
  cancelSubscription: (subscriptionId: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      availableTiers: {},
      paymentMethods: {},
      btcWallet: '',
      isLoading: false,
      error: null,

      fetchSubscriptions: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.getMySubscriptions();

          if (response.success && response.data) {
            set({
              subscriptions: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              subscriptions: [],
              isLoading: false,
              error: response.message || 'Failed to fetch subscriptions',
            });
          }
        } catch (error: any) {
          set({
            subscriptions: [],
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch subscriptions',
          });
        }
      },

      fetchAvailableTiers: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.getAvailableTiers();

          if (response.success && response.data) {
            set({
              availableTiers: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              availableTiers: {},
              isLoading: false,
              error: response.message || 'Failed to fetch tiers',
            });
          }
        } catch (error: any) {
          set({
            availableTiers: {},
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch tiers',
          });
        }
      },

      fetchPaymentMethods: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.getPaymentMethods();

          if (response.success && response.data) {
            set({
              paymentMethods: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              paymentMethods: {},
              isLoading: false,
              error: response.message || 'Failed to fetch payment methods',
            });
          }

          // Also fetch BTC wallet
          const walletResponse = await apiService.getBTCWallet();
          if (walletResponse.success && walletResponse.data) {
            set({
              btcWallet: walletResponse.data.btcWallet,
            });
          }
        } catch (error: any) {
          set({
            paymentMethods: {},
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch payment methods',
          });
        }
      },

      purchaseSubscription: async (data: CreateSubscriptionRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.purchaseSubscription(data);

          if (response.success) {
            // Refresh subscriptions
            await get().fetchSubscriptions();
            set({
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: response.message || 'Failed to purchase subscription',
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to purchase subscription',
          });
        }
      },

      cancelSubscription: async (subscriptionId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.cancelSubscription(subscriptionId);

          if (response.success) {
            // Refresh subscriptions
            await get().fetchSubscriptions();
            set({
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isLoading: false,
              error: response.message || 'Failed to cancel subscription',
            });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to cancel subscription',
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({
        subscriptions: state.subscriptions,
        availableTiers: state.availableTiers,
      }),
    }
  )
);
