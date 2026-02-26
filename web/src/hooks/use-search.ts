'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import tmdb from '@/lib/tmdb';
import type { Movie, Genre } from '@/types/movie';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: genreData } = useQuery({
    queryKey: ['genres'],
    queryFn: () => tmdb.getGenres(),
    staleTime: Infinity,
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => tmdb.searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const { data: genreMovies, isLoading: genreLoading } = useQuery({
    queryKey: ['genreMovies', selectedGenre],
    queryFn: () => tmdb.discoverMoviesByGenre(selectedGenre!),
    enabled: !!selectedGenre && debouncedQuery.length === 0,
  });

  const { data: trendingData } = useQuery({
    queryKey: ['trendingSearch'],
    queryFn: () => tmdb.getTrendingMovies(),
    enabled: debouncedQuery.length === 0 && !selectedGenre,
  });

  const movies: Movie[] = useMemo(() => {
    if (debouncedQuery.length > 0) return searchData?.results || [];
    if (selectedGenre) return genreMovies?.results || [];
    return trendingData?.results || [];
  }, [debouncedQuery, selectedGenre, searchData, genreMovies, trendingData]);

  const genres: Genre[] = genreData?.genres || [];
  const isSearchActive = debouncedQuery.length > 0 || !!selectedGenre;

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
    searchLoading: searchLoading || genreLoading,
    clearSearch,
    isSearchActive,
  };
}
