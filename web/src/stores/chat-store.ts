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
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0 && messages[lastIndex].role === 'model') {
        messages[lastIndex] = { ...messages[lastIndex], content };
      }
      return { messages };
    }),

  finalizeLastModelMessage: (movieIds) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0 && messages[lastIndex].role === 'model') {
        messages[lastIndex] = {
          ...messages[lastIndex],
          movie_ids: movieIds,
          isStreaming: false,
        };
      }
      return { messages };
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [] }),
  setMessages: (messages) => set({ messages }),
}));
