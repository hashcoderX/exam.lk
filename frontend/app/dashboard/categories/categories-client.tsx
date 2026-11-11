"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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
  icon_path?: string | null;
  icon_url?: string | null;
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
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewingCategory, setViewingCategory] = useState<JobCategory | null>(null);
  const iconInputRef = useRef<HTMLInputElement | null>(null);

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
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("slug", finalSlug);
      formData.append("status", status);
      if (iconFile) {
        formData.append("icon", iconFile);
      }

      const response = await fetch(`${apiBase()}/api/categories`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
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
      setIconFile(null);
      if (iconInputRef.current) {
        iconInputRef.current.value = "";
      }
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

                <label className="block text-sm font-medium text-slate-700">
                  Category Icon (optional)
                  <Input
                    ref={iconInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
                    className="mt-1"
                    onChange={(event) => setIconFile(event.target.files?.[0] ?? null)}
                  />
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    Supported: JPG, PNG, WEBP, SVG (max 5MB)
                  </span>
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
                      <th className="px-3 py-2">Icon</th>
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
                        <td className="px-3 py-3">
                          {item.icon_url ? (
                            <img
                              src={item.icon_url}
                              alt={`${item.name} icon`}
                              className="h-9 w-9 rounded-md border border-slate-200 object-cover"
                            />
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
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
                          <Button variant="ghost" size="sm" onClick={() => setViewingCategory(item)}>
                            View
                          </Button>
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

      {viewingCategory ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-view-title"
          onClick={() => setViewingCategory(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 id="category-view-title" className="text-lg font-semibold text-slate-900">
                Category Details
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setViewingCategory(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                {viewingCategory.icon_url ? (
                  <img
                    src={viewingCategory.icon_url}
                    alt={`${viewingCategory.name} icon`}
                    className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 text-slate-400">
                    -
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase text-slate-500">Name</p>
                  <p className="font-medium text-slate-900">{viewingCategory.name}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Slug</p>
                <p>{viewingCategory.slug}</p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Status</p>
                <Badge
                  className={
                    viewingCategory.status === "active"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }
                >
                  {viewingCategory.status}
                </Badge>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">Created Date</p>
                <p>{(viewingCategory.created_at ?? "").slice(0, 10)}</p>
              </div>

              {viewingCategory.icon_url ? (
                <div>
                  <p className="text-xs uppercase text-slate-500">Icon URL</p>
                  <a
                    href={viewingCategory.icon_url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-blue-600 hover:underline"
                  >
                    {viewingCategory.icon_url}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
