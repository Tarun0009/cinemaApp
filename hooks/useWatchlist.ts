import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabase';
import { useAuthStore } from '@/store/authStore';
import type { WatchlistItem } from '@/types/movie';

export function useWatchlist() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const {
    data: watchlist = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async (): Promise<WatchlistItem[]> => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user!.id)
        .order('added_at', { ascending: false });
      if (error) throw error;
      return (data || []) as WatchlistItem[];
    },
    enabled: !!user?.id,
  });

  const watchlistIds = new Set(watchlist.map((w) => w.movie_id));

  const addMutation = useMutation({
    mutationFn: async (movie: {
      id: number;
      title: string;
      poster_path: string | null;
    }) => {
      const { error } = await supabase.from('watchlist').insert({
        user_id: user!.id,
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster: movie.poster_path,
      });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (movieId: number) => {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user!.id)
        .eq('movie_id', movieId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] }),
  });

  const isInWatchlist = (movieId: number) => watchlistIds.has(movieId);

  const toggleWatchlist = async (movie: {
    id: number;
    title: string;
    poster_path: string | null;
  }) => {
    if (isInWatchlist(movie.id)) {
      await removeMutation.mutateAsync(movie.id);
    } else {
      await addMutation.mutateAsync(movie);
    }
  };

  return {
    watchlist,
    isLoading,
    refetch,
    isInWatchlist,
    toggleWatchlist,
    addToWatchlist: addMutation.mutateAsync,
    removeFromWatchlist: removeMutation.mutateAsync,
  };
}
