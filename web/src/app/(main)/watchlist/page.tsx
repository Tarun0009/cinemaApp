'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Trash2, Film, Loader2 } from 'lucide-react';
import { useWatchlist } from '@/hooks/use-watchlist';
import tmdb from '@/lib/tmdb';

export default function WatchlistPage() {
  const { watchlist, isLoading, removeFromWatchlist } = useWatchlist();

  const handleRemove = async (movieId: number) => {
    if (window.confirm('Remove from watchlist?')) {
      await removeFromWatchlist(movieId);
    }
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
        {watchlist.length > 0 && (
          <span className="bg-[#E50914] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {watchlist.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-[#E50914] animate-spin" size={32} />
        </div>
      ) : watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bookmark className="text-[#808080] mb-4" size={48} />
          <p className="text-white font-semibold text-lg mb-2">Your watchlist is empty</p>
          <p className="text-[#808080] mb-6">Start adding movies you want to watch</p>
          <Link
            href="/search"
            className="bg-[#E50914] hover:bg-[#B81D24] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="group relative">
              <Link href={`/movie/${item.movie_id}`}>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1F1F1F]">
                  <Image
                    src={tmdb.getImageUrl(item.movie_poster, 'medium')}
                    alt={item.movie_title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <p className="text-white text-sm font-medium mt-2 line-clamp-1">
                  {item.movie_title}
                </p>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(item.movie_id);
                }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-[#E50914] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
