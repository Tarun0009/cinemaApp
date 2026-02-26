'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { Sparkles, Trash2, Smile, Skull, Heart, Rocket } from 'lucide-react';
import { useChatStore } from '@/stores/chat-store';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import gemini from '@/lib/gemini';
import tmdb from '@/lib/tmdb';
import ChatBubble from '@/components/chat-bubble';
import ChatInput from '@/components/chat-input';
import ChatMovieCard from '@/components/chat-movie-card';
import type { LocalChatMessage } from '@/types/chat';
import type { Movie } from '@/types/movie';

const SUGGESTED_PROMPTS = [
  { icon: Smile, label: 'Feel-Good', prompt: 'Suggest some feel-good movies that will make me smile' },
  { icon: Skull, label: 'Horror', prompt: 'What are the scariest horror movies of all time?' },
  { icon: Heart, label: 'Romance', prompt: 'Recommend romantic movies for a cozy night in' },
  { icon: Rocket, label: 'Sci-Fi', prompt: 'What are the best sci-fi movies with mind-bending plots?' },
];

export default function ChatPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const {
    messages, isStreaming, addMessage, updateLastModelMessage,
    finalizeLastModelMessage, setStreaming, setMessages, clearMessages,
  } = useChatStore();
  const [movieCache, setMovieCache] = useState<Record<number, Movie>>({});

  // Load history
  useEffect(() => {
    if (!user?.id) return;
    const loadHistory = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);
      if (data && data.length > 0) {
        const loaded: LocalChatMessage[] = data.map((m: Record<string, unknown>) => ({
          id: m.id as string,
          role: m.role as 'user' | 'model',
          content: m.content as string,
          movie_ids: (m.movie_ids as number[]) || [],
        }));
        setMessages(loaded);
        const allIds = data.flatMap((m: Record<string, unknown>) => (m.movie_ids as number[]) || []);
        const uniqueIds = [...new Set(allIds)];
        if (uniqueIds.length > 0) loadMovieDetails(uniqueIds);
      }
    };
    loadHistory();
  }, [user?.id, setMessages]);

  const loadMovieDetails = async (ids: number[]) => {
    const results: Record<number, Movie> = {};
    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const movie = await tmdb.getMovieDetails(id);
          results[id] = movie;
        } catch { /* skip */ }
      })
    );
    setMovieCache((prev) => ({ ...prev, ...results }));
  };

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  const handleSend = async (text: string) => {
    if (isStreaming) return;

    const userMsg: LocalChatMessage = {
      id: Date.now().toString(), role: 'user', content: text, movie_ids: [],
    };
    addMessage(userMsg);

    const modelMsg: LocalChatMessage = {
      id: (Date.now() + 1).toString(), role: 'model', content: '', movie_ids: [], isStreaming: true,
    };
    addMessage(modelMsg);
    setStreaming(true);
    scrollToEnd();

    try {
      const history = messages.filter((m) => m.content.trim()).map((m) => ({
        role: m.role, parts: [{ text: m.content }],
      }));

      const fullResponse = await gemini.sendMessage(text, history);
      updateLastModelMessage(fullResponse);
      scrollToEnd();

      const titles = gemini.parseMovieTitles(fullResponse);
      const movieIds: number[] = [];

      if (titles.length > 0) {
        const searchResults = await Promise.allSettled(
          titles.map(async (title) => {
            const result = await tmdb.searchMovies(title);
            return result.results?.[0] || null;
          })
        );
        const foundMovies: Record<number, Movie> = {};
        for (const result of searchResults) {
          if (result.status === 'fulfilled' && result.value) {
            const movie = result.value;
            movieIds.push(movie.id);
            foundMovies[movie.id] = movie;
          }
        }
        setMovieCache((prev) => ({ ...prev, ...foundMovies }));
      }

      finalizeLastModelMessage(movieIds);
      setStreaming(false);

      if (user?.id) {
        const supabase = createClient();
        await supabase.from('chat_messages').insert([
          { user_id: user.id, role: 'user', content: text, movie_ids: [] },
          { user_id: user.id, role: 'model', content: fullResponse, movie_ids: movieIds },
        ]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      updateLastModelMessage(`Sorry, I encountered an error: ${errorMessage}`);
      finalizeLastModelMessage([]);
      setStreaming(false);
    }
  };

  const handleClear = () => {
    if (!window.confirm('Clear all chat history?')) return;
    clearMessages();
    if (user?.id) {
      const supabase = createClient();
      supabase.from('chat_messages').delete().eq('user_id', user.id);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E50914] flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">CineMate AI</h1>
            <p className="text-xs text-[#46d369]">{isStreaming ? 'Thinking...' : 'Online'}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} className="text-[#808080] hover:text-white p-2">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 rounded-full bg-[#E50914]/10 flex items-center justify-center mb-6">
            <Sparkles size={32} className="text-[#E50914]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">CineMate AI</h2>
          <p className="text-[#B3B3B3] text-center max-w-sm mb-8">
            Your personal movie recommendation assistant. Ask me anything about movies!
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-md w-full">
            {SUGGESTED_PROMPTS.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => handleSend(prompt)}
                className="bg-[#1F1F1F] border border-[#333] rounded-xl p-4 text-left hover:border-[#555] transition-colors"
              >
                <Icon size={20} className="text-[#E50914] mb-2" />
                <p className="text-white text-sm font-bold">{label}</p>
                <p className="text-[#808080] text-xs mt-1 line-clamp-2">{prompt}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              <ChatBubble message={msg} />
              {msg.role === 'model' && msg.movie_ids.length > 0 && !msg.isStreaming && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide ml-11 mb-4 pb-1">
                  {msg.movie_ids.map((id) => {
                    const movie = movieCache[id];
                    if (!movie) return null;
                    return <ChatMovieCard key={id} movie={movie} />;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
