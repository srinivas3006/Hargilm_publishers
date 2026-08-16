import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Role, UserContextData } from '@/types';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
  profilePicture?: string;
  bio?: string;
  emailVerified?: boolean;
  isActive?: boolean;
}

export type AuthStatus = 'idle' | 'authenticating' | 'context-loading' | 'authenticated' | 'error';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
  userContext: UserContextData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authStatus: AuthStatus;
  
  // Actions
  login: (user: User, token: string, refreshToken?: string, refreshTokenExpiresAt?: string) => void;
  setUserContext: (context: UserContextData) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set: any): AuthState => ({
      user: null,
      token: null,
      refreshToken: null,
      refreshTokenExpiresAt: null,
      userContext: null,
      isAuthenticated: false,
      isLoading: false,
      authStatus: 'idle',
      
      login: (user: User, token: string, refreshToken?: string, refreshTokenExpiresAt?: string) => 
        set({ 
          user, 
          token, 
          refreshToken: refreshToken || null,
          refreshTokenExpiresAt: refreshTokenExpiresAt || null,
          isAuthenticated: true,
          authStatus: 'context-loading',
        }),

      setUserContext: (userContext: UserContextData) =>
        set((state: AuthState) => ({
          userContext,
          user: state.user ? {
            ...state.user,
            role: userContext.user.role || state.user.role,
            profileImage: userContext.user.profilePicture || state.user.profileImage,
          } : null,
          authStatus: 'authenticated',
        })),

      setAuthStatus: (authStatus: AuthStatus) =>
        set({ authStatus }),

      setUser: (user: User) => 
        set({ user }),
        
      setLoading: (isLoading: boolean) => 
        set({ isLoading }),

      logout: () => 
        set({ 
          user: null, 
          token: null, 
          refreshToken: null,
          refreshTokenExpiresAt: null,
          userContext: null,
          isAuthenticated: false,
          authStatus: 'idle',
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: AuthState) => ({ 
        user: state.user, 
        token: state.token, 
        refreshToken: state.refreshToken,
        refreshTokenExpiresAt: state.refreshTokenExpiresAt,
        userContext: state.userContext,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
