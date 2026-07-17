"use client";

import { motion } from "framer-motion";

interface BookCardSkeletonProps {
  variant?: "default" | "compact" | "horizontal";
}

export function BookCardSkeleton({ variant = "default" }: BookCardSkeletonProps) {
  if (variant === "horizontal") {
    return (
      <div className="flex gap-4 p-4 bg-card rounded-lg border border-border animate-pulse">
        <div className="relative w-24 h-36 flex-shrink-0 bg-muted rounded-md" />
        <div className="flex-1 min-w-0 py-2">
          <div className="h-5 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2 mb-4" />
          <div className="h-3 bg-muted rounded w-1/3 mb-4" />
          <div className="h-5 bg-muted rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="animate-pulse">
        <div className="relative aspect-[2/3] bg-muted rounded-lg mb-2" />
        <div className="h-4 bg-muted rounded w-3/4 mb-1" />
        <div className="h-3 bg-muted rounded w-1/2 mb-2" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="relative aspect-[2/3] bg-muted" />

      {/* Content Skeleton */}
      <div className="p-5">
        <div className="h-6 bg-muted rounded w-full mb-2" />
        <div className="h-4 bg-muted rounded w-2/3 mb-4" />

        {/* Rating Skeleton */}
        <div className="flex items-center gap-1 mb-4">
          <div className="h-4 w-20 bg-muted rounded" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="h-6 w-1/3 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}
