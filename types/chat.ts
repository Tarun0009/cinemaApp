export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'model';
  content: string;
  movie_ids: number[];
  created_at: string;
}

export interface LocalChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  movie_ids: number[];
  isStreaming?: boolean;
}

export interface SuggestedPrompt {
  icon: string;
  label: string;
  prompt: string;
}
