'use client';

import Modal from '@/components/ui/modal';
import type { Video } from '@/types/movie';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
}

export default function TrailerModal({ isOpen, onClose, videos }: TrailerModalProps) {
  const trailer = videos.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  if (!trailer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trailer">
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
          title={trailer.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    </Modal>
  );
}
