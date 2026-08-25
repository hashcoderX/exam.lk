import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]",
        "before:animate-[skeleton-shimmer_1.4s_ease-in-out_infinite] motion-reduce:before:animate-none",
        className,
      )}
    />
  );
}
