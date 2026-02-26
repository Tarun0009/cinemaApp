'use client';

import { useState, useEffect, useCallback } from 'react';
import tmdb from '@/lib/tmdb';
import type { Movie, MovieDetails } from '@/types/movie';

type FetchFunction = 'trending' | 'popular' | 'topRated' | 'nowPlaying' | 'search';

export function useMovies(fetchFunction: FetchFunction, query?: string) {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      let result;
      switch (fetchFunction) {
        case 'trending':
          result = await tmdb.getTrendingMovies(pageNum);
          break;
        case 'popular':
          result = await tmdb.getPopularMovies(pageNum);
          break;
        case 'topRated':
          result = await tmdb.getTopRatedMovies(pageNum);
          break;
        case 'nowPlaying':
          result = await tmdb.getNowPlayingMovies(pageNum);
          break;
        case 'search':
          if (!query) return;
          result = await tmdb.searchMovies(query, pageNum);
          break;
      }
      if (result) {
        setData(pageNum === 1 ? result.results : (prev) => [...prev, ...result.results]);
        setTotalPages(result.total_pages);
      }
    } catch {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, query]);

  useEffect(() => {
    setData([]);
    setPage(1);
    fetchData(1);
  }, [fetchData]);

  const loadMore = useCallback(() => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  }, [page, totalPages, fetchData]);

  return { data, loading, error, loadMore, hasMore: page < totalPages };
}

export function useMovieDetails(id: number) {
  const [data, setData] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const result = await tmdb.getMovieDetails(id);
        setData(result);
      } catch {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  return { data, loading, error };
}
