import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import tmdb from '@/api/tmdb';
import type { Movie, Genre } from '@/types/movie';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: () => tmdb.getGenres().then((r) => r.genres),
    staleTime: Infinity,
  });

  const {
    data: searchResults,
    isLoading: searchLoading,
  } = useQuery({
    queryKey: ['searchMovies', debouncedQuery, selectedGenre],
    queryFn: async () => {
      if (debouncedQuery.trim()) {
        return tmdb.searchMovies(debouncedQuery);
      }
      if (selectedGenre) {
        return tmdb.discoverMoviesByGenre(selectedGenre);
      }
      return tmdb.getTrendingMovies();
    },
  });

  const movies: Movie[] = searchResults?.results || [];

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedGenre(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres,
    movies,
    searchLoading,
    clearSearch,
    isSearchActive: !!debouncedQuery.trim(),
  };
}
