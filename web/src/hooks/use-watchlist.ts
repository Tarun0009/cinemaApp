'use client';

import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import type { Movie, WatchlistItem } from '@/types/movie';

export function useWatchlist() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading, refetch } = useQuery<WatchlistItem[]>({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const watchlistIds = useMemo(() => new Set(watchlist.map((w) => w.movie_id)), [watchlist]);

  const isInWatchlist = useCallback(
    (movieId: number) => watchlistIds.has(movieId),
    [watchlistIds]
  );

  const addMutation = useMutation({
    mutationFn: async (movie: Movie) => {
      const supabase = createClient();
      const { error } = await supabase.from('watchlist').insert({
        user_id: user!.id,
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster: movie.poster_path,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (movieId: number) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user!.id)
        .eq('movie_id', movieId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] }),
  });

  const toggleWatchlist = useCallback(
    async (movie: Movie) => {
      if (isInWatchlist(movie.id)) {
        await removeMutation.mutateAsync(movie.id);
      } else {
        await addMutation.mutateAsync(movie);
      }
    },
    [isInWatchlist, addMutation, removeMutation]
  );

  return {
    watchlist,
    isLoading,
    refetch,
    isInWatchlist,
    toggleWatchlist,
    addToWatchlist: (movie: Movie) => addMutation.mutateAsync(movie),
    removeFromWatchlist: (movieId: number) => removeMutation.mutateAsync(movieId),
  };
}
