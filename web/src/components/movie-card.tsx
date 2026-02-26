'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import tmdb from '@/lib/tmdb';
import type { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
}

export default function MovieCard({ movie, size = 'md' }: MovieCardProps) {
  const widths = { sm: 'w-[130px]', md: 'w-[160px]', lg: 'w-[200px]' };

  return (
    <Link href={`/movie/${movie.id}`} className={`${widths[size]} shrink-0 group`}>
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1F1F1F]">
        <Image
          src={tmdb.getImageUrl(movie.poster_path, size === 'sm' ? 'small' : 'medium')}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="200px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-sm font-semibold line-clamp-2">{movie.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-[#F5C518] fill-[#F5C518]" />
            <span className="text-xs text-[#F5C518]">{movie.vote_average.toFixed(1)}</span>
            {movie.release_date && (
              <span className="text-xs text-[#808080] ml-1">{movie.release_date.slice(0, 4)}</span>
            )}
          </div>
        </div>
        {/* Rating badge always visible */}
        <div className="absolute top-2 right-2 bg-black/70 rounded-md px-1.5 py-0.5 flex items-center gap-1">
          <Star size={10} className="text-[#F5C518] fill-[#F5C518]" />
          <span className="text-[10px] text-white font-medium">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-white text-sm font-medium mt-2 line-clamp-1 group-hover:text-[#E50914] transition-colors">
        {movie.title}
      </p>
    </Link>
  );
}
