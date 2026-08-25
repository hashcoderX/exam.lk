import { ChevronDown, UserCircle2 } from "lucide-react";

export function UserMenu() {
  return (
    <details className="relative">
      <summary className="list-none">
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <UserCircle2 className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Super Admin</span>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </summary>
      <ul className="absolute right-0 z-30 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
        <li><button className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50">Profile</button></li>
        <li><button className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50">Preferences</button></li>
        <li><button className="w-full rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button></li>
      </ul>
    </details>
  );
}
