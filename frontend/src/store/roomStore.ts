import { create } from 'zustand';
import { Room, CreateRoomRequest, UpdateRoomRequest } from '../types';
import apiService from '../services/api';

interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyRooms: () => Promise<void>;
  fetchRoomByCode: (roomCode: string) => Promise<void>;
  createRoom: (data: CreateRoomRequest) => Promise<Room | null>;
  updateRoom: (roomId: number, data: UpdateRoomRequest) => Promise<Room | null>;
  deleteRoom: (roomId: number) => Promise<void>;
  setCurrentRoom: (room: Room | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  currentRoom: null,
  isLoading: false,
  error: null,

  fetchMyRooms: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.getMyRooms();

      if (response.success && response.data) {
        set({
          rooms: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          rooms: [],
          isLoading: false,
          error: response.message || 'Failed to fetch rooms',
        });
      }
    } catch (error: any) {
      set({
        rooms: [],
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch rooms',
      });
    }
  },

  fetchRoomByCode: async (roomCode: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.getRoomByCode(roomCode);

      if (response.success && response.data) {
        set({
          currentRoom: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          currentRoom: null,
          isLoading: false,
          error: response.message || 'Failed to fetch room',
        });
      }
    } catch (error: any) {
      set({
        currentRoom: null,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch room',
      });
    }
  },

  createRoom: async (data: CreateRoomRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.createRoom(data);

      if (response.success && response.data) {
        const newRoom = response.data;

        set((state) => ({
          rooms: [...state.rooms, newRoom],
          isLoading: false,
          error: null,
        }));

        return newRoom;
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to create room',
        });
        return null;
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create room',
      });
      return null;
    }
  },

  updateRoom: async (roomId: number, data: UpdateRoomRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.updateRoom(roomId, data);

      if (response.success && response.data) {
        const updatedRoom = response.data;

        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId ? updatedRoom : room
          ),
          currentRoom: state.currentRoom?.id === roomId ? updatedRoom : state.currentRoom,
          isLoading: false,
          error: null,
        }));

        return updatedRoom;
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to update room',
        });
        return null;
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update room',
      });
      return null;
    }
  },

  deleteRoom: async (roomId: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.deleteRoom(roomId);

      if (response.success) {
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== roomId),
          currentRoom: state.currentRoom?.id === roomId ? null : state.currentRoom,
          isLoading: false,
          error: null,
        }));
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to delete room',
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete room',
      });
    }
  },

  setCurrentRoom: (room: Room | null) => {
    set({ currentRoom: room });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
