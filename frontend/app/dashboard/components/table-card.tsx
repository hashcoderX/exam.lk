"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";

const rows = [
  { id: 1001, name: "Nimal Perera", role: "Agent", status: "Active", registered: "2026-06-01" },
  { id: 1002, name: "Lanka Prep Institute", role: "Agency", status: "Pending", registered: "2026-06-09" },
  { id: 1003, name: "Kavindi Silva", role: "Agent", status: "Suspended", registered: "2026-06-11" },
  { id: 1004, name: "FuturePath Academy", role: "Agency", status: "Active", registered: "2026-06-13" },
  { id: 1005, name: "Tharindu Jayasekara", role: "Agent", status: "Active", registered: "2026-06-15" },
  { id: 1006, name: "ExamEdge Hub", role: "Agency", status: "Pending", registered: "2026-06-17" },
];

function toneFor(status: string) {
  if (status === "Active") return "success" as const;
  if (status === "Pending") return "warning" as const;
  if (status === "Suspended") return "danger" as const;
  return "default" as const;
}

export function TableCard() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const filtered = useMemo(() => {
    return rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users and Agencies</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search table"
            className="w-full sm:w-60"
          />
          <Button variant="outline" size="sm">Sort</Button>
          <Button variant="outline" size="sm">Filter</Button>
          <Button variant="outline" size="sm">Export CSV</Button>
          <Button variant="outline" size="sm">Export Excel</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2"><input type="checkbox" aria-label="Select all rows" /></th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Registered</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {current.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-3"><input type="checkbox" aria-label={`Select ${row.name}`} /></td>
                  <td className="px-3 py-3 font-medium text-slate-800">{row.name}</td>
                  <td className="px-3 py-3 text-slate-600">{row.role}</td>
                  <td className="px-3 py-3"><StatusBadge label={row.status} tone={toneFor(row.status)} /></td>
                  <td className="px-3 py-3 text-slate-600">{row.registered}</td>
                  <td className="px-3 py-3 text-right"><Button variant="ghost" size="sm">Menu</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <p>
            Page {page} of {pageCount}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
