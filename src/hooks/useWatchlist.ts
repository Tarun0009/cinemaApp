"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/lib/tmdb";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cinema-watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse watchlist", e);
      }
    }
  }, []);

  const toggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      let next;
      if (exists) {
        next = prev.filter((m) => m.id !== movie.id);
      } else {
        next = [...prev, movie];
      }
      localStorage.setItem("cinema-watchlist", JSON.stringify(next));
      return next;
    });
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some((m) => m.id === id);
  };

  return { watchlist, toggleWatchlist, isInWatchlist };
}
