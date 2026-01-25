"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp, User, Film } from "lucide-react"
import { Input } from "@/components/ui/input"
import { tmdb, Movie, getImageUrl } from "@/lib/tmdb"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("")
    const [movieResults, setMovieResults] = useState<Movie[]>([])
    const [peopleResults, setPeopleResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("movies")

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    useEffect(() => {
        if (!query) {
            setMovieResults([])
            setPeopleResults([])
            return
        }

        const timer = setTimeout(async () => {
            setIsLoading(true)
            try {
                const [movies, people] = await Promise.all([
                    tmdb.searchMovies(query),
                    tmdb.getSearchPeople(query)
                ])
                setMovieResults(movies.slice(0, 6))
                setPeopleResults(people.slice(0, 6))
            } catch (error) {
                console.error("Search failed:", error)
            } finally {
                setIsLoading(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl p-6 md:pt-32 md:p-12"
                >
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4 flex-1">
                                <Search className="w-8 h-8 text-white/40" />
                                <Input
                                    autoFocus
                                    placeholder="Movies, actors, genres..."
                                    className="bg-transparent border-none text-3xl md:text-6xl font-black p-0 h-auto focus-visible:ring-0 placeholder:text-white/5 text-white uppercase tracking-tighter"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-8 h-8 text-white" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                            <div className="lg:col-span-3">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-8 flex items-center gap-2">
                                    Quick Discovery
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {["Interstellar", "Oppenheimer", "Inception", "The Batman", "Dune"].map(item => (
                                        <button
                                            key={item}
                                            onClick={() => setQuery(item)}
                                            className="text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all hover:translate-x-1"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-9">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl mb-8">
                                        <TabsTrigger value="movies" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:text-black font-bold">
                                            <Film className="w-4 h-4 mr-2" /> Movies
                                        </TabsTrigger>
                                        <TabsTrigger value="people" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:text-black font-bold">
                                            <User className="w-4 h-4 mr-2" /> People
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="movies" className="mt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {isLoading ? (
                                                [1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />)
                                            ) : movieResults.length > 0 ? (
                                                movieResults.map(movie => (
                                                    <Link
                                                        key={movie.id}
                                                        href={`/movie/${movie.id}`}
                                                        onClick={onClose}
                                                        className="flex items-center gap-4 group p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all"
                                                    >
                                                        <img
                                                            src={getImageUrl(movie.poster_path)}
                                                            className="w-16 h-24 object-cover rounded-xl"
                                                            alt=""
                                                        />
                                                        <div>
                                                            <p className="font-black text-white group-hover:text-white transition-colors uppercase tracking-tight text-lg line-clamp-1">{movie.title}</p>
                                                            <p className="text-sm font-bold text-white/30 uppercase tracking-widest">{movie.release_date?.split('-')[0]}</p>
                                                            <div className="flex items-center mt-2 text-yellow-500">
                                                                <Search className="w-3 h-3 mr-2" />
                                                                <span className="text-xs font-bold">View Movie</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : query && (
                                                <p className="text-white/40 font-bold p-8 text-center bg-white/5 rounded-3xl">No movies found for "{query}"</p>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="people" className="mt-0">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {isLoading ? (
                                                [1, 2, 3].map(i => <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-full" />)
                                            ) : peopleResults.length > 0 ? (
                                                peopleResults.map(person => (
                                                    <div
                                                        key={person.id}
                                                        className="flex flex-col items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 group text-center"
                                                    >
                                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/40 transition-all">
                                                            <img
                                                                src={getImageUrl(person.profile_path)}
                                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white uppercase tracking-tight line-clamp-1">{person.name}</p>
                                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">{person.known_for_department}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : query && (
                                                <p className="col-span-full text-white/40 font-bold p-8 text-center bg-white/5 rounded-3xl">No people found for "{query}"</p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
