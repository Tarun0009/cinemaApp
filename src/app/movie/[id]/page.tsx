"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Star, Clock, Calendar, Play, Heart, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { tmdb, Movie, getImageUrl, GENRES } from "@/lib/tmdb"
import TrailerModal from "@/components/TrailerModal"
import Footer from "@/components/Footer"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWatchlist } from "@/hooks/useWatchlist"
import CastRail from "@/components/CastRail"
import MovieGrid from "@/components/MovieGrid"

export default function MovieDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = Number(params.id)

    const [movie, setMovie] = useState<Movie | null>(null)
    const [cast, setCast] = useState([])
    const [recommendations, setRecommendations] = useState<Movie[]>([])
    const [trailerKey, setTrailerKey] = useState<string | null>(null)

    const [isTrailerOpen, setIsTrailerOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const { toggleWatchlist, isInWatchlist } = useWatchlist()
    const isWatchlisted = isInWatchlist(id)

    useEffect(() => {
        const loadMovieData = async () => {
            setIsLoading(true)
            try {
                const [movieData, credits, videos, recs] = await Promise.all([
                    tmdb.getMovieDetails(id),
                    tmdb.getMovieCredits(id),
                    tmdb.getMovieVideos(id),
                    tmdb.getRecommendations(id)
                ])

                setMovie(movieData)
                setCast(credits.cast)
                setRecommendations(recs)

                const trailer = videos.find(
                    (v: any) => v.type === "Trailer" && v.site === "YouTube"
                ) || videos.find((v: any) => v.site === "YouTube")

                if (trailer) {
                    setTrailerKey(trailer.key)
                }
            } catch (error) {
                console.error("Failed to fetch movie details:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadMovieData()
    }, [id])

    if (isLoading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
    )

    if (!movie) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold">Movie not found</h2>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
    )

    const movieGenres = GENRES.filter(g => movie.genre_ids?.includes(g.id))

    return (
        <main className="min-h-screen bg-background">
            {/* Backdrop Header */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    src={getImageUrl(movie.backdrop_path, "original")}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent hidden md:block" />

                <div className="absolute top-28 left-6 md:left-12 flex gap-4">
                    <button
                        className="flex items-center gap-2 p-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl glass-card border-none transition-all active:scale-95"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-bold">Back</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 md:px-12 -mt-80 relative z-10 pb-24">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hidden lg:block w-[350px] shrink-0 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group"
                    >
                        <div className="relative aspect-[2/3]">
                            <img
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setIsTrailerOpen(true)}
                                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl"
                                >
                                    <Play className="w-8 h-8 text-black fill-current ml-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details */}
                    <div className="flex-1 lg:pt-12">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
                                    <span className="font-black text-white">{movie.vote_average?.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center text-white/40 text-sm font-bold uppercase tracking-widest">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {movie.runtime || 120} min
                                </div>
                                <div className="flex items-center text-white/40 text-sm font-bold uppercase tracking-widest">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {movie.release_date?.split('-')[0]}
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap gap-3 mb-10">
                                {movieGenres.length > 0 ? movieGenres.map(genre => (
                                    <Badge key={genre.id} variant="outline" className="px-5 py-2 border-white/10 bg-white/5 text-white/60 hover:text-white transition-colors">
                                        {genre.name}
                                    </Badge>
                                )) : (
                                    <Badge variant="outline" className="px-5 py-2 border-white/10 bg-white/5 text-white/60">
                                        Cinema
                                    </Badge>
                                )}
                            </div>

                            <p className="text-xl md:text-2xl text-white/50 leading-relaxed mb-12 max-w-4xl font-medium">
                                {movie.overview}
                            </p>

                            <div className="flex flex-wrap gap-5 mb-16">
                                <button
                                    onClick={() => setIsTrailerOpen(true)}
                                    disabled={!trailerKey}
                                    className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed font-black text-lg shadow-2xl flex items-center gap-3 transition-all active:scale-95"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    {trailerKey ? "Watch Trailer" : "No Trailer"}
                                </button>

                                <button
                                    onClick={() => toggleWatchlist(movie)}
                                    className={cn(
                                        "h-16 px-8 rounded-2xl border border-white/10 backdrop-blur-md transition-all font-bold flex items-center gap-3 active:scale-95",
                                        isWatchlisted ? "bg-red-500/20 text-red-500 border-red-500/40" : "bg-white/5 text-white hover:bg-white/10"
                                    )}
                                >
                                    <Heart className={cn("w-6 h-6", isWatchlisted && "fill-current")} />
                                    {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
                                </button>

                                <button
                                    className="h-16 w-16 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all active:scale-95"
                                >
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Cast & Credits */}
                            <CastRail cast={cast} />

                            {/* Recommendations */}
                            {recommendations.length > 0 && (
                                <div className="mt-12">
                                    <MovieGrid title="Recommended Movies" movies={recommendations.slice(0, 6)} className="px-0 container-none" />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />

            {trailerKey && (
                <TrailerModal
                    isOpen={isTrailerOpen}
                    onClose={() => setIsTrailerOpen(false)}
                    title={movie.title}
                    videoKey={trailerKey}
                />
            )}
        </main>
    )
}
