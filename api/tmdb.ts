import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '@/constants/config';
import { ApiResponse, Movie, MovieDetails, Genre } from '@/types/movie';

/**
 * TMDB API service
 * Uses TMDB v3 API key (your case).
 * Does NOT use Bearer token (only v4 uses Bearer).
 */
class TMDBService {
  /** Helper to build URL with API key */
  private buildUrl(path: string, params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      include_adult: 'false',
      ...params,
    });

    return `${TMDB_BASE_URL}${path}?${searchParams.toString()}`;
  }

  /** ------------------------------
   * GET TRENDING
   * ------------------------------ */
  async getTrendingMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const url = this.buildUrl('/trending/movie/week', { page });
    const res = await fetch(url);
    return res.json();
  }

  /** ------------------------------
   * POPULAR MOVIES
   * ------------------------------ */
  async getPopularMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const url = this.buildUrl('/movie/popular', { page });
    const res = await fetch(url);
    return res.json();
  }

  /** ------------------------------
   * TOP RATED MOVIES
   * ------------------------------ */
  async getTopRatedMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const url = this.buildUrl('/movie/top_rated', { page });
    const res = await fetch(url);
    return res.json();
  }

  /** ------------------------------
   * NOW PLAYING MOVIES
   * ------------------------------ */
  async getNowPlayingMovies(page: number = 1): Promise<ApiResponse<Movie>> {
    const url = this.buildUrl('/movie/now_playing', { page });
    const res = await fetch(url);
    return res.json();
  }

  /** ------------------------------
   * MOVIE DETAILS
   * ------------------------------ */
  async getMovieDetails(id: number): Promise<MovieDetails> {
    const url = this.buildUrl(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar',
    });

    const res = await fetch(url);
    return res.json();
  }

  /** ------------------------------
   * SEARCH MOVIES
   * ------------------------------ */
  async searchMovies(query: string, page: number = 1): Promise<ApiResponse<Movie>> {
    const url = this.buildUrl('/search/movie', { query, page });
    const res = await fetch(url);
    return res.json();
  }

  /** ------------------------------
   * DISCOVER BY GENRE
   * ------------------------------ */
  async discoverMoviesByGenre(genreId: number, page: number = 1): Promise<ApiResponse<Movie>> {
    const url = this.buildUrl('/discover/movie', {
      with_genres: genreId.toString(),
      sort_by: 'popularity.desc',
      page,
    });
    const res = await fetch(url);
    return res.json();
  }

  /** ------------------------------
   * GENRES
   * ------------------------------ */
  async getGenres(): Promise<{ genres: Genre[] }> {
    const url = this.buildUrl('/genre/movie/list');
    const res = await fetch(url);
    return res.json();
  }

  /** ------------------------------
   * IMAGE HELPERS
   * ------------------------------ */
  getImageUrl(path: string, size: keyof typeof IMAGE_SIZES = 'medium'): string {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES[size]}${path}`;
  }

  getBackdropUrl(path: string, size: keyof typeof IMAGE_SIZES = 'backdrop'): string {
    if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image';
    return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES[size]}${path}`;
  }
}

export default new TMDBService();
