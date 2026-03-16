import { create } from 'zustand';

interface AuthState {
  authenticated: boolean;
  handle: string;
  fingerprint: string;
  step: 'welcome' | 'detecting' | 'handle-input' | 'authenticating' | 'success';
  setAuthenticated: (handle: string, fingerprint: string) => void;
  setStep: (step: AuthState['step']) => void;
  setHandle: (handle: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  handle: '',
  fingerprint: '',
  step: 'welcome',
  setAuthenticated: (handle, fingerprint) =>
    set({ authenticated: true, handle, fingerprint, step: 'success' }),
  setStep: (step) => set({ step }),
  setHandle: (handle) => set({ handle }),
}));
