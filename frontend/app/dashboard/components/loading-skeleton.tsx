import { SkeletonCard, SkeletonText } from "@/components/ui/skeleton-loaders";

export function LoadingSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
      <SkeletonText lines={2} className="max-w-md" />
      <SkeletonCard />
    </div>
  );
}
