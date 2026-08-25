import { cn } from "@/lib/utils";

export function ChartContainer({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("h-64 w-full", className)}>{children}</div>;
}
