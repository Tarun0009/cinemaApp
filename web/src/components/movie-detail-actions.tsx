'use client';

import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { useWatchlist } from '@/hooks/use-watchlist';
import type { Movie } from '@/types/movie';

export default function MovieDetailActions({ movie }: { movie: Movie }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: movie.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => toggleWatchlist(movie)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          inWatchlist
            ? 'bg-[#E50914] text-white'
            : 'bg-[#1F1F1F] text-white border border-[#333] hover:border-[#555]'
        }`}
      >
        {inWatchlist ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        {inWatchlist ? 'In Watchlist' : 'Watchlist'}
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-[#1F1F1F] text-white border border-[#333] hover:border-[#555] transition-colors"
      >
        <Share2 size={18} />
        Share
      </button>
    </div>
  );
}
