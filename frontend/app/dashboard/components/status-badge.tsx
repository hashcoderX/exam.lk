import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "danger" | "default";

const toneClass: Record<StatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  default: "border-slate-200 bg-slate-50 text-slate-600",
};

export function StatusBadge({ label, tone = "default" }: { label: string; tone?: StatusTone }) {
  return <Badge className={cn("rounded-lg", toneClass[tone])}>{label}</Badge>;
}
