import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput({ placeholder = "Search" }: { placeholder?: string }) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
      <Input aria-label={placeholder} className="pl-9" placeholder={placeholder} />
    </label>
  );
}
