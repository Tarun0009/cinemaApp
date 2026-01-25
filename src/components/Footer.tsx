import Link from "next/link"
import { Film, Github, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-background border-t border-white/5 pt-24 pb-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <Film className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                            <span className="text-2xl font-bold tracking-tight text-white uppercase">
                                Cinema <span className="text-white/50">Web</span>
                            </span>
                        </Link>
                        <p className="text-white/40 max-w-sm leading-relaxed mb-8">
                            Experience the best of world cinema through our curated collection. Professional design meets unparalleled cinematic depth.
                        </p>
                        <div className="flex items-center gap-4 text-white/40">
                            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                            <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                            <Mail className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Discovery</h4>
                        <ul className="space-y-4 text-white/40">
                            <li><Link href="/" className="hover:text-white transition-colors">Popular Movies</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Top Rated</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Upcoming</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Genre Guide</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-white/40">
                            <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Press Kit</Link></li>
                            <li><Link href="/" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/20 font-medium">
                    <p>© 2026 Cinema Web. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/" className="hover:text-white/40 transition-colors">Privacy Policy</Link>
                        <Link href="/" className="hover:text-white/40 transition-colors">Terms of Service</Link>
                        <Link href="/" className="hover:text-white/40 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
