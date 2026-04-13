import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const response = await api.get('/auth/me');
            set({ user: response.data, isAuthenticated: true });
          } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({ user: null, isAuthenticated: false });
          }
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, accessToken, refreshToken } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { user, accessToken, refreshToken } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
          await api.post('/auth/logout', { refreshToken });
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false, error: null });
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/auth/me', profileData);
          set({ user: response.data.user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Update failed',
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export { api };
