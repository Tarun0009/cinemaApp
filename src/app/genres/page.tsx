"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GENRES, getImageUrl } from "@/lib/tmdb"
import Footer from "@/components/Footer"
import { ChevronRight, Sparkles } from "lucide-react"

export default function GenresPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col pt-32">
            <div className="container mx-auto px-6 md:px-12 flex-1 pb-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 text-white/40 font-bold uppercase tracking-widest text-sm mb-4">
                            <Sparkles className="w-5 h-5" />
                            Curated Categories
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                            Browse Genres
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {GENRES.map((genre, index) => (
                        <Link key={genre.id} href={`/?genre=${genre.id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative aspect-[16/10] rounded-3xl overflow-hidden glass-card border-white/5 hover:border-white/20 transition-all cursor-pointer"
                            >
                                {/* Background Decoration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:scale-110 transition-transform duration-700" />

                                <div className="relative h-full p-8 flex flex-col justify-end">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{genre.name}</h2>
                                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                Browse Movies <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Glassy reflection effect */}
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    )
}
