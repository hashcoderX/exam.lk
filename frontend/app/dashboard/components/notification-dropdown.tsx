import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: 1, title: "12 agencies awaiting approval", priority: "warning", time: "2m ago" },
  { id: 2, title: "Payment gateway latency detected", priority: "danger", time: "12m ago" },
  { id: 3, title: "AI request queue normal", priority: "success", time: "24m ago" },
];

export function NotificationDropdown() {
  return (
    <details className="relative">
      <summary className="list-none">
        <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] text-white">3</span>
        </Button>
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          <button className="text-xs text-blue-600 hover:underline">Mark all read</button>
        </div>
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="rounded-xl border border-slate-100 p-2">
              <p className="text-sm text-slate-700">{notification.title}</p>
              <p className="mt-1 text-xs text-slate-400">{notification.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
