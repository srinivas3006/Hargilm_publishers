import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'visitor' | 'reader' | 'author' | 'admin';
  profileImage?: string;
  bio?: string;
  emailVerified?: boolean;
  isActive?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set: any): AuthState => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (user: User, token: string) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        }),
        
      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        }),
        
      setUser: (user: User) => 
        set({ user }),
        
      setLoading: (isLoading: boolean) => 
        set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: AuthState) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
