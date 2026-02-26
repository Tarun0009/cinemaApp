'use client';

import { clsx } from 'clsx';
import type { Genre } from '@/types/movie';

interface GenreChipsProps {
  genres: Genre[];
  selectedGenre: number | null;
  onSelect: (genreId: number | null) => void;
}

export default function GenreChips({ genres, selectedGenre, onSelect }: GenreChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          !selectedGenre
            ? 'bg-[#E50914] text-white'
            : 'bg-[#1F1F1F] text-[#B3B3B3] border border-[#333] hover:border-[#555]'
        )}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre.id === selectedGenre ? null : genre.id)}
          className={clsx(
            'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
            genre.id === selectedGenre
              ? 'bg-[#E50914] text-white'
              : 'bg-[#1F1F1F] text-[#B3B3B3] border border-[#333] hover:border-[#555]'
          )}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
