import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  hint: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, hint, icon: Icon }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-600">{title}</CardTitle>
          <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            {change}
          </p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
          <div className="mt-4 h-8 w-full rounded-md bg-[linear-gradient(90deg,#DBEAFE_0%,#93C5FD_50%,#DBEAFE_100%)]" aria-hidden="true" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
