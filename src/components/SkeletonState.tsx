import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function MovieCardSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl bg-white/5" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[80%] bg-white/5" />
                <Skeleton className="h-3 w-[40%] bg-white/5" />
            </div>
        </div>
    )
}

export function GridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    )
}
