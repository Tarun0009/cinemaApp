import Link from 'next/link';
import { Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#141414] text-center px-4">
      <Film className="text-[#E50914] mb-4" size={64} />
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-[#B3B3B3] mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="bg-[#E50914] hover:bg-[#B81D24] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
