"use client"

import React from "react"
import { motion } from "framer-motion"
import { Play, Info, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Movie, getImageUrl } from "@/lib/tmdb"

interface HeroProps {
    movie: Movie;
    onWatchTrailer?: () => void;
}

export default function Hero({ movie, onWatchTrailer }: HeroProps) {
    if (!movie) return null;

    return (
        <section className="relative h-[90vh] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={getImageUrl(movie.backdrop_path, "original")}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto flex flex-col justify-center px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400 mr-2" />
                            <span className="font-black text-white">{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <span className="text-white/60 font-medium tracking-wide uppercase text-xs">Trending Now</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white leading-none uppercase">
                        {movie.title}
                    </h1>

                    <p className="text-lg md:text-xl text-white/50 mb-10 line-clamp-3 leading-relaxed max-w-xl font-medium">
                        {movie.overview}
                    </p>

                    <div className="flex flex-wrap items-center gap-5">
                        <Button
                            size="lg"
                            onClick={onWatchTrailer}
                            className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-white/90 transition-all font-black"
                        >
                            <Play className="w-6 h-6 mr-3 fill-current" />
                            Watch Now
                        </Button>
                        <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white transition-all font-bold">
                            <Info className="w-6 h-6 mr-3" />
                            Details
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
