import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  label: string;
  icon: LucideIcon;
}

export function QuickActionCard({ label, icon: Icon }: QuickActionCardProps) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300"
    >
      <span className="rounded-xl bg-blue-50 p-2 text-blue-600">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </motion.button>
  );
}
