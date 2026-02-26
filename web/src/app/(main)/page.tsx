import tmdb from '@/lib/tmdb';
import FeaturedHero from '@/components/featured-hero';
import MovieRow from '@/components/movie-row';

export default async function HomePage() {
  const [trending, popular, nowPlaying, topRated] = await Promise.all([
    tmdb.getTrendingMovies(),
    tmdb.getPopularMovies(),
    tmdb.getNowPlayingMovies(),
    tmdb.getTopRatedMovies(),
  ]);

  const featuredMovie = trending.results[0];

  return (
    <div className="space-y-8">
      {featuredMovie && <FeaturedHero movie={featuredMovie} />}
      <div className="space-y-10 pb-8">
        <MovieRow title="Trending This Week" movies={trending.results.slice(1)} />
        <MovieRow title="Popular" movies={popular.results} />
        <MovieRow title="Now Playing" movies={nowPlaying.results} />
        <MovieRow title="Top Rated" movies={topRated.results} />
      </div>
    </div>
  );
}
