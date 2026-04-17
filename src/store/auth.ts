// store de autenticación con zustand
// guarda el token y los datos del usuario en memoria
// en producción probablemente usaría cookies seguras

import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loginError: null,

  login: async (email: string, password: string) => {
    set({ loginError: null });
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      if (!res.ok) {
        set({ loginError: 'Error del servidor. Intenta de nuevo.' });
        return false;
      }
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('ecos_token', data.token);
        set({
          token: data.token,
          user: data.user,
          isAuthenticated: true,
          isAdmin: data.user.role === 'admin',
          loginError: null,
        });
        return true;
      }
      set({ loginError: data.error || 'Credenciales incorrectas.' });
      return false;
    } catch {
      set({ loginError: 'No se pudo conectar al servidor.' });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('ecos_token');
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false, loginError: null });
  },

  checkAuth: async () => {
    const stored = localStorage.getItem('ecos_token');
    if (!stored) return;
    try {
      const res = await fetch('/api/auth', {
        headers: { Authorization: `Bearer ${stored}` },
      });
      if (!res.ok) {
        localStorage.removeItem('ecos_token');
        return;
      }
      const data = await res.json();
      if (data.user) {
        set({
          token: stored,
          user: data.user,
          isAuthenticated: true,
          isAdmin: data.user.role === 'admin',
        });
      } else {
        localStorage.removeItem('ecos_token');
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
      }
    } catch {
      // Server might be starting up; keep token for retry
    }
  },

  clearError: () => set({ loginError: null }),
}));
