'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, Search, Bookmark, Sparkles, User } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/', label: 'Home', icon: Film },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { href: '/chat', label: 'AI Chat', icon: Sparkles },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-sm border-b border-[#333]">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Film className="text-[#E50914]" size={28} />
          <span className="text-xl font-extrabold tracking-wider text-white hidden sm:inline">
            CINEMATE
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'text-white bg-[#E50914]/10 text-[#E50914]'
                    : 'text-[#B3B3B3] hover:text-white hover:bg-[#1F1F1F]'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="w-7 lg:hidden" />
      </div>
    </header>
  );
}
