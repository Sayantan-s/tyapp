import { create } from 'zustand';
import type { ChatMessage } from '@repo/types';

type Mode = 'CHILL' | 'DEV';

interface ChatState {
  messages: ChatMessage[];
  mode: Mode;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  setMode: (mode: Mode) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  mode: 'CHILL',
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages.slice(-99), msg] })),
  clearMessages: () => set({ messages: [] }),
  setMode: (mode) => set({ mode }),
}));
