"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Film, Menu, X, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SearchOverlay from "./SearchOverlay"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-6 md:px-12",
                    isScrolled ? "glass py-4 shadow-2xl" : "bg-transparent"
                )}
            >
                <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl group-hover:rotate-6 transition-transform">
                            <Film className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white uppercase">
                            Cinema <span className="text-white/40 font-normal">Web</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-white/50">
                        <Link href="/" className="hover:text-white transition-colors">Explore</Link>
                        <Link href="/genres" className="hover:text-white transition-colors">Genres</Link>
                        <Link href="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Trigger */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-3 hover:bg-white/10 rounded-full text-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <Link href="/watchlist">
                            <button className="hidden md:flex items-center gap-2 p-3 px-5 bg-white/5 hover:bg-white/10 rounded-full text-white border border-white/5 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm font-bold">Watchlist</span>
                            </button>
                        </Link>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden p-2 text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 glass border-t border-white/5 animate-in slide-in-from-top-4 duration-500 overflow-hidden rounded-b-3xl mx-4 mt-2">
                        <div className="p-8 flex flex-col gap-6">
                            <Link href="/" className="text-2xl font-black uppercase tracking-tighter">Explore</Link>
                            <Link href="/" className="text-2xl font-black uppercase tracking-tighter">Movies</Link>
                            <Link href="/" className="text-2xl font-black uppercase tracking-tighter">TV Series</Link>
                            <Link href="/watchlist" className="flex items-center gap-2 text-2xl font-black uppercase tracking-tighter">
                                Watchlist <span className="w-2 h-2 rounded-full bg-white/20" />
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}
