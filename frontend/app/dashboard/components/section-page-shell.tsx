import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionPageShellProps {
  title: string;
  description: string;
  section: string;
}

export function SectionPageShell({ title, description, section }: SectionPageShellProps) {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container-fluid space-y-6 py-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Dashboard / {section}</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">{description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button>New {title.replace(/s$/, "")}</Button>
            <Button variant="outline">Export</Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">128</p>
              <p className="mt-1 text-xs text-emerald-600">+8.1% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">16</p>
              <p className="mt-1 text-xs text-amber-600">Needs review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-slate-900">Moments ago</p>
              <p className="mt-1 text-xs text-slate-500">Live operational data</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{title} Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm text-slate-500">
                This section is now available and ready for API/data integration.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                Back to dashboard
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
