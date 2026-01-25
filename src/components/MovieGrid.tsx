"use client"

import React from "react"
import MovieCard from "./MovieCard"
import { Movie } from "@/lib/tmdb"
import { cn } from "@/lib/utils"

interface MovieGridProps {
    title: string;
    movies: Movie[];
    className?: string;
}

export default function MovieGrid({ title, movies, className }: MovieGridProps) {
    if (!movies || movies.length === 0) return null;

    return (
        <section className={cn("py-12", className)}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-1 bg-white" />
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase">{title}</h2>
                </div>
                <button className="text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Explore All</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </section>
    )
}
