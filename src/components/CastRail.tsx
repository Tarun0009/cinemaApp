"use client"

import React from "react"
import { getImageUrl } from "@/lib/tmdb"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string;
}

interface CastRailProps {
    cast: CastMember[];
}

export default function CastRail({ cast }: CastRailProps) {
    if (!cast || cast.length === 0) return null;

    return (
        <section className="py-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-1 bg-white" />
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase">Main Cast</h2>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-6 pb-4">
                    {cast.slice(0, 12).map((person) => (
                        <div key={person.id} className="w-32 group">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-white/5 bg-white/5">
                                <img
                                    src={getImageUrl(person.profile_path)}
                                    alt={person.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <p className="text-sm font-bold text-white truncate">{person.name}</p>
                            <p className="text-xs text-white/40 truncate">{person.character}</p>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="bg-white/5" />
            </ScrollArea>
        </section>
    )
}
