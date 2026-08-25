import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonTextProps = {
  lines?: number;
  className?: string;
  lineClassName?: string;
};

export function SkeletonText({ lines = 3, className, lineClassName }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-3",
            index === lines - 1 ? "w-3/5" : "w-full",
            lineClassName,
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
}

export function SkeletonImage({ className }: { className?: string }) {
  return <Skeleton className={cn("h-24 w-full rounded-lg", className)} />;
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-8 w-20 rounded-md", className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4", className)}>
      <div className="mb-3 flex items-center gap-3">
        <SkeletonAvatar className="h-9 w-9" />
        <div className="flex-1">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="mt-2 h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="mt-4 flex gap-2">
        <SkeletonButton />
        <SkeletonButton className="w-16" />
      </div>
    </div>
  );
}

export function SkeletonListingItem() {
  return (
    <article className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[160px_1fr_auto]">
      <SkeletonImage className="h-full min-h-[110px]" />
      <div>
        <Skeleton className="h-4 w-3/4" />
        <SkeletonText className="mt-2" lines={3} />
        <Skeleton className="mt-3 h-3 w-2/5" />
      </div>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <Skeleton className="h-6 w-16 rounded-full" />
        <SkeletonButton />
        <SkeletonButton />
      </div>
    </article>
  );
}

export function SkeletonProfileSection() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-full md:col-span-2" />
        <Skeleton className="h-3 w-full md:col-span-2" />
      </div>
      <div className="mt-3 flex justify-end">
        <SkeletonButton className="w-24" />
      </div>
    </div>
  );
}

type SkeletonTableRowsProps = {
  rows?: number;
  columns?: number;
};

export function SkeletonTableRows({ rows = 5, columns = 6 }: SkeletonTableRowsProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-100 p-3 sm:grid-cols-6">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={colIndex} className="h-3 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

type SkeletonListProps = {
  count?: number;
  itemClassName?: string;
};

export function SkeletonList({ count = 3, itemClassName }: SkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} className={itemClassName} />
      ))}
    </div>
  );
}
