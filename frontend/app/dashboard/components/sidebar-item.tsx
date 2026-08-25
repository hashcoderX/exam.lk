import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  collapsed?: boolean;
}

export function SidebarItem({ href, label, icon: Icon, active, collapsed }: SidebarItemProps) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined}>
      <motion.span
        whileHover={{ x: 3 }}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
          active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          collapsed ? "justify-center" : "",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {collapsed ? null : <span>{label}</span>}
      </motion.span>
    </Link>
  );
}
