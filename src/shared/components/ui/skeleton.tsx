import { cn } from '@/shared/lib/utils';

export const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-[var(--color-sidebar-hover)]',
      className
    )}
  />
);

export const SkeletonCard = () => (
  <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-3">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
  </div>
);

export const SkeletonPage = () => (
  <div className="p-6 space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);
