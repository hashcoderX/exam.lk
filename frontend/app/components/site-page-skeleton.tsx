import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonListingItem, SkeletonText } from "@/components/ui/skeleton-loaders";

export function SitePageSkeleton() {
  return (
    <main className="min-h-screen bg-[#efefef] text-[#666]">
      <header className="border-b border-[#ddd] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="h-[3px] w-full bg-[#1f1f1f]" />
        <div className="mx-auto flex max-w-[1020px] items-center justify-between px-4 py-2">
          <Skeleton className="h-9 w-44" />
          <div className="hidden items-center gap-3 sm:flex">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1020px] px-4 pt-4">
        <article className="grid overflow-hidden border border-[#d8d8d8] bg-white sm:grid-cols-[180px_1fr]">
          <div className="p-3">
            <SkeletonText lines={2} />
          </div>
          <Skeleton className="min-h-[108px] w-full rounded-none" />
        </article>
      </section>

      <section className="mx-auto max-w-[1020px] px-4 pt-4">
        <div className="grid gap-2 border border-[#d8d8d8] bg-[#f5f5f5] p-2 md:grid-cols-[1fr_1.5fr_96px]">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </section>

      <section className="border-t border-[#ddd] bg-[#efefef] pb-16 pt-6">
        <div className="mx-auto grid max-w-[1020px] gap-4 px-4 lg:grid-cols-[180px_1fr_160px]">
          <aside className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
          </aside>

          <div className="space-y-4">
            <SkeletonListingItem />
            <SkeletonListingItem />
            <SkeletonListingItem />
          </div>

          <aside>
            <Skeleton className="h-[300px] w-full" />
          </aside>
        </div>
      </section>
    </main>
  );
}
