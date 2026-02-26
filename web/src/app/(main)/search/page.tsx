'use client';

import { Search as SearchIcon, Film } from 'lucide-react';
import SearchInput from '@/components/search-input';
import GenreChips from '@/components/genre-chips';
import MovieGrid from '@/components/movie-grid';
import { useSearch } from '@/hooks/use-search';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres,
    movies,
    searchLoading,
    isSearchActive,
  } = useSearch();

  return (
    <div className="px-4 lg:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Search</h1>

      <SearchInput value={searchQuery} onChange={setSearchQuery} />

      <GenreChips genres={genres} selectedGenre={selectedGenre} onSelect={setSelectedGenre} />

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          {isSearchActive ? 'Results' : 'Trending'}
        </h2>

        {searchLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="text-[#E50914] animate-spin" size={32} />
          </div>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="text-[#808080] mb-4" size={48} />
            <p className="text-[#808080]">No movies found</p>
            <p className="text-[#808080] text-sm">Try a different search or genre</p>
          </div>
        )}
      </div>
    </div>
  );
}
