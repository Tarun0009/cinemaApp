import { useState, useEffect, useCallback } from 'react';
import tmdb from '@/api/tmdb';
import { Movie, ApiResponse } from '@/types/movie';

export const useMovies = (fetchFunction: string, query?: string) => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      let response: ApiResponse<Movie>;
      
      switch (fetchFunction) {
        case 'trending':
          response = await tmdb.getTrendingMovies(pageNum);
          break;
        case 'popular':
          response = await tmdb.getPopularMovies(pageNum);
          break;
        case 'topRated':
          response = await tmdb.getTopRatedMovies(pageNum);
          break;
        case 'nowPlaying':
          response = await tmdb.getNowPlayingMovies(pageNum);
          break;
        case 'search':
          if (!query) return;
          response = await tmdb.searchMovies(query, pageNum);
          break;
        default:
          response = await tmdb.getPopularMovies(pageNum);
      }

      if (pageNum === 1 || isRefresh) {
        setData(response.results);
      } else {
        setData(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchFunction, query]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      fetchData(page + 1);
    }
  };

  const refresh = () => {
    if (!loading) {
      fetchData(1, true);
    }
  };

  return {
    data,
    loading,
    error,
    refreshing,
    loadMore,
    refresh,
    hasMore: page < totalPages,
  };
};

export const useMovieDetails = (id: number) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieDetails = await tmdb.getMovieDetails(id);
        setData(movieDetails);
      } catch (err) {
        setError('Failed to load movie details.');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  return { data, loading, error };
};