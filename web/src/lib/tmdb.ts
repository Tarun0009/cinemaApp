import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from './constants';
import type { Movie, MovieDetails, Genre, ApiResponse } from '@/types/movie';

class TMDBService {
  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', TMDB_API_KEY);
    url.searchParams.set('language', 'en-US');
    url.searchParams.set('include_adult', 'false');
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
    return res.json();
  }

  async getTrendingMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetch('/trending/movie/week', { page: String(page) });
  }

  async getPopularMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetch('/movie/popular', { page: String(page) });
  }

  async getTopRatedMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetch('/movie/top_rated', { page: String(page) });
  }

  async getNowPlayingMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetch('/movie/now_playing', { page: String(page) });
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    return this.fetch(`/movie/${id}`, { append_to_response: 'credits,videos,similar' });
  }

  async searchMovies(query: string, page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetch('/search/movie', { query, page: String(page) });
  }

  async discoverMoviesByGenre(genreId: number, page: number = 1): Promise<ApiResponse<Movie>> {
    return this.fetch('/discover/movie', {
      with_genres: String(genreId),
      sort_by: 'popularity.desc',
      page: String(page),
    });
  }

  async getGenres(): Promise<{ genres: Genre[] }> {
    return this.fetch('/genre/movie/list');
  }

  getImageUrl(path: string | null, size: keyof typeof IMAGE_SIZES = 'medium'): string {
    if (!path) return '/placeholder-poster.svg';
    return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES[size]}${path}`;
  }

  getBackdropUrl(path: string | null, size: 'backdrop' | 'original' = 'backdrop'): string {
    if (!path) return '/placeholder-backdrop.svg';
    return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES[size]}${path}`;
  }
}

const tmdb = new TMDBService();
export default tmdb;
