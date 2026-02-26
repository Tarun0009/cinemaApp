import { clsx } from 'clsx';
import { Star } from 'lucide-react';

interface BadgeProps {
  variant?: 'rating' | 'genre';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'genre', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-[#F5C518]/20 text-[#F5C518]': variant === 'rating',
          'bg-[#1F1F1F] text-[#B3B3B3] border border-[#333]': variant === 'genre',
        },
        className
      )}
    >
      {variant === 'rating' && <Star size={12} fill="currentColor" />}
      {children}
    </span>
  );
}
