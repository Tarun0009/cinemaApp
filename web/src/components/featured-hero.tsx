'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, TrendingUp } from 'lucide-react';
import tmdb from '@/lib/tmdb';
import type { Movie } from '@/types/movie';

export default function FeaturedHero({ movie }: { movie: Movie }) {
  return (
    <div className="relative w-full h-[55vh] lg:h-[65vh] overflow-hidden">
      <Image
        src={tmdb.getBackdropUrl(movie.backdrop_path)}
        alt={movie.title}
        fill
        className="object-cover"
        priority
        unoptimized
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8 pb-8 lg:pb-12">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-[#E50914]" />
          <span className="text-sm font-semibold text-[#E50914] uppercase tracking-wider">
            Trending Now
          </span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-3 max-w-2xl">
          {movie.title}
        </h1>
        <p className="text-[#B3B3B3] text-sm lg:text-base max-w-xl line-clamp-2 mb-5">
          {movie.overview}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={`/movie/${movie.id}`}
            className="flex items-center gap-2 bg-[#E50914] hover:bg-[#B81D24] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
          >
            <Info size={18} />
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
