import { clsx } from 'clsx';

function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse bg-[#2A2A2A] rounded-lg', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-40" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[160px]">
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return <Skeleton className="w-full h-[55vh] rounded-none" />;
}

export default Skeleton;
