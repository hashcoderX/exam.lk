"use client";

import { useState, useSyncExternalStore } from "react";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLayoutShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="min-w-0 flex-1">
        <TopNavbar />
        {children}
      </div>
    </div>
  );
}