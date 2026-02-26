import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Clock, Calendar } from 'lucide-react';
import tmdb from '@/lib/tmdb';
import Badge from '@/components/ui/badge';
import CastCarousel from '@/components/cast-carousel';
import MovieRow from '@/components/movie-row';
import MovieDetailActions from '@/components/movie-detail-actions';
import TrailerButton from './trailer-button';
import type { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await tmdb.getMovieDetails(Number(id));
    return {
      title: `${movie.title} - CineMate`,
      description: movie.overview,
    };
  } catch {
    return { title: 'Movie - CineMate' };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  let movie;
  try {
    movie = await tmdb.getMovieDetails(Number(id));
  } catch {
    notFound();
  }

  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const cast = movie.credits?.cast || [];
  const similar = movie.similar?.results || [];
  const videos = movie.videos?.results || [];

  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full h-[40vh] lg:h-[50vh]">
        <Image
          src={tmdb.getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
      </div>

      <div className="px-4 lg:px-8 -mt-32 relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-[200px] lg:w-[280px] mx-auto lg:mx-0">
            <Image
              src={tmdb.getImageUrl(movie.poster_path, 'large')}
              alt={movie.title}
              width={280}
              height={420}
              className="rounded-xl shadow-2xl"
              unoptimized
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-[#B3B3B3] italic">&quot;{movie.tagline}&quot;</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge variant="rating">{movie.vote_average.toFixed(1)}</Badge>
              {movie.release_date && (
                <span className="flex items-center gap-1 text-[#B3B3B3]">
                  <Calendar size={14} />
                  {movie.release_date.slice(0, 4)}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1 text-[#B3B3B3]">
                  <Clock size={14} />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <Badge key={genre.id} variant="genre">{genre.name}</Badge>
              ))}
            </div>

            <MovieDetailActions movie={movie} />

            {videos.length > 0 && <TrailerButton videos={videos} />}

            {/* Overview */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Storyline</h3>
              <p className="text-[#B3B3B3] leading-relaxed">{movie.overview}</p>
            </div>

            {director && (
              <p className="text-[#B3B3B3]">
                <span className="text-white font-medium">Director:</span> {director.name}
              </p>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-10">
            <h3 className="text-xl font-bold text-white mb-4">Cast</h3>
            <CastCarousel cast={cast} />
          </section>
        )}

        {/* Details Grid */}
        <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Status', value: movie.status },
            { label: 'Language', value: movie.spoken_languages?.[0]?.english_name || 'N/A' },
            { label: 'Budget', value: movie.budget ? `$${(movie.budget / 1_000_000).toFixed(1)}M` : 'N/A' },
            { label: 'Revenue', value: movie.revenue ? `$${(movie.revenue / 1_000_000).toFixed(1)}M` : 'N/A' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#1F1F1F] rounded-xl p-4 border border-[#333]">
              <p className="text-[#808080] text-xs mb-1">{label}</p>
              <p className="text-white font-semibold">{value}</p>
            </div>
          ))}
        </section>

        {/* Similar Movies */}
        {similar.length > 0 && (
          <section className="mt-10 pb-8">
            <MovieRow title="Similar Movies" movies={similar} />
          </section>
        )}
      </div>
    </div>
  );
}
