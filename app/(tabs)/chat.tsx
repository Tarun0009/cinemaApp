import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/config';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/api/supabase';
import gemini from '@/services/gemini';
import tmdb from '@/api/tmdb';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import MovieSuggestionCard from '@/components/MovieSuggestionCard';
import type { LocalChatMessage, SuggestedPrompt } from '@/types/chat';
import type { Movie } from '@/types/movie';

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: 'happy-outline',
    label: 'Feel-Good',
    prompt: 'Suggest some feel-good movies that will make me smile',
  },
  {
    icon: 'skull-outline',
    label: 'Horror',
    prompt: 'What are the scariest horror movies of all time?',
  },
  {
    icon: 'heart-outline',
    label: 'Romance',
    prompt: 'Recommend romantic movies for a cozy night in',
  },
  {
    icon: 'planet-outline',
    label: 'Sci-Fi',
    prompt: 'What are the best sci-fi movies with mind-bending plots?',
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const user = useAuthStore((s) => s.user);
  const {
    messages,
    isStreaming,
    addMessage,
    updateLastModelMessage,
    finalizeLastModelMessage,
    setStreaming,
    setError,
    clearMessages,
    setMessages,
  } = useChatStore();

  const [movieCache, setMovieCache] = React.useState<Record<number, Movie>>({});

  // Load chat history from Supabase on mount
  useEffect(() => {
    if (!user?.id) return;
    loadHistory();
  }, [user?.id]);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      if (data && data.length > 0) {
        const loaded: LocalChatMessage[] = data.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'model',
          content: m.content,
          movie_ids: m.movie_ids || [],
        }));
        setMessages(loaded);

        // Load movie data for any cached movie_ids
        const allIds = data.flatMap((m) => m.movie_ids || []);
        const uniqueIds = [...new Set(allIds)];
        if (uniqueIds.length > 0) {
          loadMovieDetails(uniqueIds);
        }
      }
    } catch {
      // Silently fail — user can still chat
    }
  };

  const loadMovieDetails = async (ids: number[]) => {
    const results: Record<number, Movie> = {};
    await Promise.allSettled(
      ids.map(async (id) => {
        try {
          const movie = await tmdb.getMovieDetails(id);
          results[id] = movie;
        } catch {
          // Skip failed lookups
        }
      })
    );
    setMovieCache((prev) => ({ ...prev, ...results }));
  };

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleSend = async (text: string) => {
    if (isStreaming) return;

    // Add user message
    const userMsg: LocalChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      movie_ids: [],
    };
    addMessage(userMsg);

    // Add placeholder model message
    const modelMsg: LocalChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: '',
      movie_ids: [],
      isStreaming: true,
    };
    addMessage(modelMsg);
    setStreaming(true);
    scrollToEnd();

    try {
      // Build chat history for Gemini
      const history = messages
        .filter((m) => m.content.trim())
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        }));

      const fullResponse = await gemini.streamChat(
        text,
        history,
        (accumulated) => {
          updateLastModelMessage(accumulated);
          scrollToEnd();
        }
      );

      // Parse movie titles from response
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

      // Persist to Supabase
      if (user?.id) {
        await supabase.from('chat_messages').insert([
          {
            user_id: user.id,
            role: 'user',
            content: text,
            movie_ids: [],
          },
          {
            user_id: user.id,
            role: 'model',
            content: fullResponse,
            movie_ids: movieIds,
          },
        ]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong';
      updateLastModelMessage(`Sorry, I encountered an error: ${errorMessage}`);
      finalizeLastModelMessage([]);
      setStreaming(false);
      setError(errorMessage);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'This will delete all your chat history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            clearMessages();
            if (user?.id) {
              await supabase
                .from('chat_messages')
                .delete()
                .eq('user_id', user.id);
            }
          },
        },
      ]
    );
  };

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const renderMessage = ({ item }: { item: LocalChatMessage }) => (
    <View>
      <ChatBubble message={item} />
      {item.role === 'model' &&
        item.movie_ids.length > 0 &&
        !item.isStreaming && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieCardsContainer}
            style={styles.movieCardsScroll}
          >
            {item.movie_ids.map((id) => {
              const movie = movieCache[id];
              if (!movie) return null;
              return (
                <MovieSuggestionCard
                  key={id}
                  movie={movie}
                  onPress={() => handleMoviePress(id)}
                />
              );
            })}
          </ScrollView>
        )}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="chatbubbles-outline" size={48} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>CineMate AI</Text>
      <Text style={styles.emptySubtitle}>
        Your personal movie recommendation assistant. Ask me anything about
        movies!
      </Text>

      <View style={styles.promptsGrid}>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt.label}
            style={styles.promptCard}
            onPress={() => handleSend(prompt.prompt)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={prompt.icon as any}
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.promptLabel}>{prompt.label}</Text>
            <Text style={styles.promptText} numberOfLines={2}>
              {prompt.prompt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Ionicons name="sparkles" size={18} color={COLORS.text} />
            </View>
            <View>
              <Text style={styles.headerTitle}>CineMate AI</Text>
              <Text style={styles.headerStatus}>
                {isStreaming ? 'Thinking...' : 'Online'}
              </Text>
            </View>
          </View>
          {messages.length > 0 && (
            <TouchableOpacity
              onPress={handleClearChat}
              style={styles.clearButton}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Messages */}
      {messages.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState />
        </ScrollView>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollToEnd()}
        />
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
      <View
        style={{
          height: Platform.OS === 'ios' ? 0 : insets.bottom,
          backgroundColor: COLORS.background,
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatus: {
    color: COLORS.success,
    fontSize: 12,
  },
  clearButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  movieCardsScroll: {
    marginBottom: SPACING.md,
  },
  movieCardsContainer: {
    paddingHorizontal: SPACING.md + 28 + SPACING.sm,
    gap: SPACING.sm,
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: SPACING.xl,
  },
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    width: '100%',
  },
  promptCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  promptLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  promptText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
});
