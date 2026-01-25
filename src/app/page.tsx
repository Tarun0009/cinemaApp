"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation";
import Hero from "@/components/Hero";
import MovieGrid from "@/components/MovieGrid";
import Footer from "@/components/Footer";
import { tmdb, Movie, GENRES } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import TrailerModal from "@/components/TrailerModal";

function HomeContent() {
  const searchParams = useSearchParams();
  const genreIdParam = searchParams.get("genre");

  const [activeGenre, setActiveGenre] = useState<number | null>(
    genreIdParam ? Number(genreIdParam) : null
  );
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    if (genreIdParam) {
      setActiveGenre(Number(genreIdParam));
    }
  }, [genreIdParam]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [trendingData, popularData] = await Promise.all([
          tmdb.getTrending(),
          tmdb.getPopular()
        ]);
        setTrending(trendingData);
        setPopular(popularData);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeGenre) {
      const loadGenreMovies = async () => {
        setIsLoading(true);
        try {
          const data = await tmdb.getMoviesByGenre(activeGenre);
          setGenreMovies(data);
        } catch (error) {
          console.error("Failed to fetch genre movies:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadGenreMovies();
    }
  }, [activeGenre]);

  const featuredMovie = trending[0];

  return (
    <main className="min-h-screen bg-background">
      {featuredMovie && (
        <Hero
          movie={featuredMovie}
          onWatchTrailer={() => setIsTrailerOpen(true)}
        />
      )}

      <div className="relative -mt-32 z-10 pb-24">
        {/* Genre Filter */}
        <div className="container mx-auto px-6 md:px-12 mb-12">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            <button
              onClick={() => setActiveGenre(null)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold border transition-all whitespace-nowrap",
                activeGenre === null
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
              )}
            >
              All Movies
            </button>
            {GENRES.slice(0, 10).map(genre => (
              <button
                key={genre.id}
                onClick={() => setActiveGenre(genre.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold border transition-all whitespace-nowrap",
                  activeGenre === genre.id
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white"
                )}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="container mx-auto px-6 md:px-12 py-12">
            <div className="h-64 w-full bg-white/5 animate-pulse rounded-3xl" />
          </div>
        ) : (
          <>
            <MovieGrid
              title={activeGenre ? `Discover ${GENRES.find(g => g.id === activeGenre)?.name}` : "Trending Now"}
              movies={activeGenre ? genreMovies : trending}
              className="container mx-auto px-6 md:px-12"
            />

            {!activeGenre && (
              <>
                <MovieGrid title="Top Rated Classics" movies={popular} className="container mx-auto px-6 md:px-12" />
                <MovieGrid title="International Hits" movies={popular.length > 10 ? popular.slice(10) : popular} className="container mx-auto px-6 md:px-12" />
              </>
            )}
          </>
        )}
      </div>

      <Footer />

      {featuredMovie && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          title={featuredMovie.title}
        />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
