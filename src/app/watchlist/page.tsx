"use client"

import React from "react"
import { Heart, ChevronRight } from "lucide-react"
import Footer from "@/components/Footer"
import MovieGrid from "@/components/MovieGrid"
import Link from "next/link"
import { useWatchlist } from "@/hooks/useWatchlist"

export default function WatchlistPage() {
    const { watchlist } = useWatchlist()

    return (
        <main className="min-h-screen bg-background flex flex-col pt-32">
            <div className="container mx-auto px-6 md:px-12 flex-1 pb-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 text-white/40 font-bold uppercase tracking-widest text-sm mb-4">
                            <div className="w-8 h-[2px] bg-white/20" />
                            My Collection
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                            Watchlist
                        </h1>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-right hidden md:block">
                            <p className="text-4xl font-black text-white">{watchlist.length}</p>
                            <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Saved Titles</p>
                        </div>
                        <Link href="/" className="inline-flex items-center gap-2 group text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                            Explore More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {watchlist.length > 0 ? (
                    <MovieGrid title="Saved for Later" movies={watchlist} className="container mx-auto px-6 md:px-12" />
                ) : (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-white/10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your collection is empty</h2>
                        <p className="text-white/40 max-w-sm">Start exploring and save your favorite movies to watch them later.</p>
                        <Link href="/" className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all">
                            Find Movies
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
