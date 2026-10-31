import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Set when the API rejected the stored token, so the login page can explain why. */
  sessionExpired: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  expireSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      sessionExpired: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true, sessionExpired: false }),
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({ user: null, token: null, isAuthenticated: false, sessionExpired: false }),
      expireSession: () =>
        set({ user: null, token: null, isAuthenticated: false, sessionExpired: true }),
    }),
    {
      name: 'kumuka-auth',
      version: 2,
      partialize: ({ user, token, isAuthenticated }) => ({ user, token, isAuthenticated }),
      migrate: () => ({ user: null, token: null, isAuthenticated: false }),
    },
  ),
);
