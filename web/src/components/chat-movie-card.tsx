import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronRight } from 'lucide-react';
import tmdb from '@/lib/tmdb';
import type { Movie } from '@/types/movie';

export default function ChatMovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="flex items-center gap-3 bg-[#1F1F1F] border border-[#333] rounded-xl p-2 hover:border-[#555] transition-colors min-w-[260px] shrink-0"
    >
      <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-[#2A2A2A]">
        <Image
          src={tmdb.getImageUrl(movie.poster_path, 'small')}
          alt={movie.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold line-clamp-1">{movie.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Star size={12} className="text-[#F5C518] fill-[#F5C518]" />
          <span className="text-xs text-[#F5C518]">{movie.vote_average.toFixed(1)}</span>
          {movie.release_date && (
            <span className="text-xs text-[#808080]">{movie.release_date.slice(0, 4)}</span>
          )}
        </div>
      </div>
      <ChevronRight size={16} className="text-[#808080] shrink-0" />
    </Link>
  );
}
