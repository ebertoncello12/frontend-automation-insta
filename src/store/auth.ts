import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces'
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Mock login - in real app, this would make an API call
    if (email && password) {
      set({ user: mockUser, isAuthenticated: true });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));