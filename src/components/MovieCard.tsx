"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Movie, getImageUrl } from "@/lib/tmdb"

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Link href={`/movie/${movie.id}`}>
                <Card className="group relative overflow-hidden bg-white/5 border-white/10 rounded-2xl">
                    <AspectRatio ratio={2 / 3}>
                        <img
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                    </AspectRatio>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 p-4 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-white/20 text-white backdrop-blur-md border-transparent">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                    {movie.vote_average.toFixed(1)}
                                </Badge>
                                <span className="text-xs text-white/70">{movie.release_date?.split('-')[0]}</span>
                            </div>
                            <h3 className="text-sm font-bold leading-tight text-white mb-1 line-clamp-2">{movie.title}</h3>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}
