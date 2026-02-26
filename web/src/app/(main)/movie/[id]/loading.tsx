import Skeleton from '@/components/skeleton';

export default function MovieDetailLoading() {
  return (
    <div>
      <Skeleton className="w-full h-[50vh] rounded-none" />
      <div className="px-4 lg:px-8 -mt-32 relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <Skeleton className="w-[200px] lg:w-[280px] aspect-[2/3] rounded-xl mx-auto lg:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
