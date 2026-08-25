import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
}

export function SectionHeader({ title, subtitle, actionLabel }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {actionLabel ? <Button variant="outline">{actionLabel}</Button> : null}
    </div>
  );
}
