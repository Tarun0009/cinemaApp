import { create } from 'zustand';
import type { LocalChatMessage } from '@/types/chat';

interface ChatState {
  messages: LocalChatMessage[];
  isStreaming: boolean;
  error: string | null;

  addMessage: (message: LocalChatMessage) => void;
  updateLastModelMessage: (content: string) => void;
  finalizeLastModelMessage: (movieIds: number[]) => void;
  setStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  setMessages: (messages: LocalChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastModelMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      const lastIdx = msgs.length - 1;
      if (lastIdx >= 0 && msgs[lastIdx].role === 'model') {
        msgs[lastIdx] = { ...msgs[lastIdx], content };
      }
      return { messages: msgs };
    }),

  finalizeLastModelMessage: (movieIds) =>
    set((state) => {
      const msgs = [...state.messages];
      const lastIdx = msgs.length - 1;
      if (lastIdx >= 0 && msgs[lastIdx].role === 'model') {
        msgs[lastIdx] = { ...msgs[lastIdx], isStreaming: false, movie_ids: movieIds };
      }
      return { messages: msgs };
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [] }),
  setMessages: (messages) => set({ messages }),
}));
