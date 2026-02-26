'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import TrailerModal from '@/components/trailer-modal';
import type { Video } from '@/types/movie';

export default function TrailerButton({ videos }: { videos: Video[] }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const hasTrailer = videos.some(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  if (!hasTrailer) return null;

  return (
    <>
      <button
        onClick={() => setShowTrailer(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <Play size={18} />
        Play Trailer
      </button>
      <TrailerModal isOpen={showTrailer} onClose={() => setShowTrailer(false)} videos={videos} />
    </>
  );
}
