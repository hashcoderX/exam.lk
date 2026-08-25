import {
  Activity,
  Bell,
  BookOpen,
  Building2,
  Tags,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Gauge,
  LifeBuoy,
  LogOut,
  Megaphone,
  Settings,
  Shield,
  Users,
  UserSquare2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarItem } from "./sidebar-item";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const items = [
  { label: "Dashboard", icon: Gauge, href: "/dashboard" },
  { label: "Users", icon: Users, href: "/dashboard/users" },
  { label: "Exam Listings", icon: BookOpen, href: "/dashboard/exam-listings" },
  { label: "Categories", icon: Tags, href: "/dashboard/categories" },
  { label: "Exams Inquiries", icon: FileText, href: "/dashboard/exam-inquiries" },
  { label: "Advertising", icon: Megaphone, href: "/dashboard/advertising" },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { label: "Logs", icon: Shield, href: "/dashboard/logs" },
  { label: "Support", icon: LifeBuoy, href: "/dashboard/support" },
  { label: "Logout", icon: LogOut, href: "#" },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-0 hidden h-screen border-r border-slate-200 bg-white p-4 lg:block ${
        collapsed ? "w-[88px]" : "w-[280px]"
      }`}
    >
      <div className="flex items-center justify-between px-2 pb-4">
        {collapsed ? null : (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600">exam.lk</p>
            <h1 className="text-lg font-semibold text-slate-900">Superadmin</h1>
          </div>
        )}
        <Button
          aria-label="Toggle sidebar"
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
      <nav className="space-y-1" aria-label="Sidebar navigation">
        {items.map((item) => (
          <SidebarItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.href !== "#" && (pathname === item.href || pathname.startsWith(`${item.href}/`))}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
