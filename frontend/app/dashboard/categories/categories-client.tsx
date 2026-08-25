"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SkeletonTableRows, SkeletonText } from "@/components/ui/skeleton-loaders";

type CategoryStatus = "active" | "inactive";

export type JobCategory = {
  id: number;
  name: string;
  slug: string;
  status: CategoryStatus;
  created_at: string;
};

interface CategoriesClientProps {
  initialCategories: JobCategory[];
}

function createSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function apiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<JobCategory[]>(initialCategories);
  const [hydrating, setHydrating] = useState(initialCategories.length === 0);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<CategoryStatus>("active");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const stats = useMemo(() => {
    const active = categories.filter((item) => item.status === "active").length;
    const inactive = categories.length - active;
    return { total: categories.length, active, inactive };
  }, [categories]);

  useEffect(() => {
    if (!hydrating) {
      return;
    }

    const timer = window.setTimeout(() => setHydrating(false), 250);
    return () => window.clearTimeout(timer);
  }, [hydrating]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const finalSlug = slug.trim() || createSlug(name);

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!finalSlug) {
      setError("Slug is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${apiBase()}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: finalSlug,
          status,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        data?: JobCategory;
        errors?: Record<string, string[]>;
      };

      if (!response.ok || !payload.data) {
        const firstValidationError = payload.errors
          ? Object.values(payload.errors)[0]?.[0]
          : undefined;
        setError(firstValidationError ?? payload.message ?? "Failed to register category.");
        return;
      }

      setCategories((prev) => [payload.data as JobCategory, ...prev]);
      setName("");
      setSlug("");
      setStatus("active");
    } catch {
      setError("Cannot connect to API. Ensure Laravel server is running.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(categoryId: number) {
    setDeletingId(categoryId);
    setError("");

    try {
      const response = await fetch(`${apiBase()}/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        setError("Failed to delete category.");
        return;
      }

      setCategories((prev) => prev.filter((item) => item.id !== categoryId));
    } catch {
      setError("Cannot connect to API. Ensure Laravel server is running.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container-fluid space-y-6 py-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Dashboard / Categories</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">Job Categories</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Register and manage job categories used for exam and career listings.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">{stats.active}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-600">{stats.inactive}</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[380px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Register Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-slate-700">
                  Category Name
                  <Input
                    value={name}
                    onChange={(event) => {
                      const nextName = event.target.value;
                      setName(nextName);
                      if (!slug.trim()) {
                        setSlug(createSlug(nextName));
                      }
                    }}
                    placeholder="e.g. Public Service"
                    className="mt-1"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Slug
                  <Input
                    value={slug}
                    onChange={(event) => setSlug(createSlug(event.target.value))}
                    placeholder="e.g. public-service"
                    className="mt-1"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Status
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as CategoryStatus)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Registering..." : "Register Category"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {hydrating ? (
                <div className="mb-3 space-y-3">
                  <SkeletonText lines={2} className="max-w-sm" />
                  <SkeletonTableRows rows={5} columns={5} />
                </div>
              ) : null}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Slug</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Created</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-3 py-3 font-medium text-slate-800">{item.name}</td>
                        <td className="px-3 py-3 text-slate-600">{item.slug}</td>
                        <td className="px-3 py-3">
                          <Badge
                            className={
                              item.status === "active"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-slate-600">{(item.created_at ?? "").slice(0, 10)}</td>
                        <td className="px-3 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id)}
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
