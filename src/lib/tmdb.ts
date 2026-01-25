const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
  runtime?: number;
}

async function fetchTMDB(
  endpoint: string,
  params: Record<string, string> = {},
) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY!);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

export const tmdb = {
  getTrending: async () => {
    const data = await fetchTMDB("/trending/movie/day");
    return data.results as Movie[];
  },
  getPopular: async () => {
    const data = await fetchTMDB("/movie/popular");
    return data.results as Movie[];
  },
  getTopRated: async () => {
    const data = await fetchTMDB("/movie/top_rated");
    return data.results as Movie[];
  },
  getMovieDetails: async (id: number) => {
    return (await fetchTMDB(`/movie/${id}`)) as Movie;
  },
  getMovieVideos: async (id: number) => {
    const data = await fetchTMDB(`/movie/${id}/videos`);
    return data.results;
  },
  getMovieCredits: async (id: number) => {
    const data = await fetchTMDB(`/movie/${id}/credits`);
    return data;
  },
  getRecommendations: async (id: number) => {
    const data = await fetchTMDB(`/movie/${id}/recommendations`);
    return data.results as Movie[];
  },
  searchMovies: async (query: string) => {
    const data = await fetchTMDB("/search/movie", { query });
    return data.results as Movie[];
  },
  getSearchPeople: async (query: string) => {
    const data = await fetchTMDB("/search/person", { query });
    return data.results;
  },
  getMoviesByGenre: async (genreId: number) => {
    const data = await fetchTMDB("/discover/movie", {
      with_genres: genreId.toString(),
    });
    return data.results as Movie[];
  },
};

export const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
];

export const getImageUrl = (
  path: string,
  size: "w500" | "original" = "w500",
) => {
  if (!path)
    return "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};
