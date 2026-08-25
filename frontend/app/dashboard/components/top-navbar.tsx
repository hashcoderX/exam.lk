"use client";

import { useMemo } from "react";
import { CalendarDays, Globe, MessageSquare, Moon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import { NotificationDropdown } from "./notification-dropdown";
import { UserMenu } from "./user-menu";

export function TopNavbar() {
  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date()),
    [],
  );

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#F8FAFC]/95 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="min-w-[260px] flex-1">
          <SearchInput placeholder="Search users, listings, payments, logs" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:inline-flex">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {currentDate}
          </Button>
          <Button variant="outline" size="icon" aria-label="Messages">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Toggle dark mode">
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Language selector">
            <Globe className="h-4 w-4" />
          </Button>
          <NotificationDropdown />
          <Button className="hidden md:inline-flex">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Quick Create
          </Button>
          <UserMenu />
        </div>
      </div>
      <div className="px-4 pb-3 text-xs text-slate-500 md:px-6">Dashboard / Superadmin / Overview</div>
    </header>
  );
}
