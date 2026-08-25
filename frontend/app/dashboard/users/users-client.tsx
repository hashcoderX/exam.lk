"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonTableRows } from "@/components/ui/skeleton-loaders";

type DashboardUser = {
  id: number;
  name: string;
  email: string;
  user_id: string;
  role: string;
  contact_no: string;
  address: string;
  created_at: string;
};

type UsersResponse = {
  data: DashboardUser[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export function UsersClient() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const perPage = 10;

  const loadUsers = async (page: number) => {
    const response = await fetch(`/api/dashboard/users?page=${page}&per_page=${perPage}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      throw new Error(data.message ?? "Unable to load users.");
    }

    return (await response.json().catch(() => ({ data: [] }))) as UsersResponse;
  };

  useEffect(() => {
    const page = currentPage;

    loadUsers(page)
      .then((data) => {
        const records = Array.isArray(data.data) ? data.data : [];
        setUsers(records);
        setCurrentPage(data.meta?.current_page ?? page);
        setLastPage(data.meta?.last_page ?? 1);
        setTotalUsers(data.meta?.total ?? records.length);
        setError("");
      })
      .catch((fetchError: unknown) => {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load users.");
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handleRemoveUser = async (userId: number) => {
    const confirmed = window.confirm("Remove this user?");
    if (!confirmed) {
      return;
    }

    setDeletingId(userId);
    setError("");

    try {
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to remove user.");
      }

      const nextCountOnPage = users.filter((user) => user.id !== userId).length;
      const targetPage = nextCountOnPage === 0 && currentPage > 1 ? currentPage - 1 : currentPage;

      setLoading(true);
      const refreshed = await loadUsers(targetPage);
      const refreshedRecords = Array.isArray(refreshed.data) ? refreshed.data : [];

      setUsers(refreshedRecords);
      setCurrentPage(refreshed.meta?.current_page ?? targetPage);
      setLastPage(refreshed.meta?.last_page ?? 1);
      setTotalUsers(refreshed.meta?.total ?? refreshedRecords.length);
    } catch (removeError: unknown) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove user.");
    } finally {
      setDeletingId(null);
      setLoading(false);
    }
  };

  const pageNumbers = Array.from(
    { length: lastPage },
    (_, index) => index + 1,
  ).slice(Math.max(currentPage - 3, 0), Math.max(currentPage - 3, 0) + 5);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container-fluid space-y-6 py-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Dashboard / Users</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">Users</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Real users loaded from the users table.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>User List ({totalUsers})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="mb-3">
                <SkeletonTableRows rows={6} columns={8} />
              </div>
            ) : null}
            {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
            {!loading && !error && users.length === 0 ? (
              <p className="mb-3 text-sm text-slate-500">No users found.</p>
            ) : null}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">User ID</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Contact</th>
                    <th className="px-3 py-2">Address</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 text-slate-700">
                      <td className="px-3 py-2 font-medium text-slate-900">{user.name || "-"}</td>
                      <td className="px-3 py-2">{user.email || "-"}</td>
                      <td className="px-3 py-2">{user.user_id || "-"}</td>
                      <td className="px-3 py-2 capitalize">{user.role || "-"}</td>
                      <td className="px-3 py-2">{user.contact_no || "-"}</td>
                      <td className="px-3 py-2">{user.address || "-"}</td>
                      <td className="px-3 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            void handleRemoveUser(user.id);
                          }}
                          disabled={deletingId === user.id || loading}
                          className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === user.id ? "Removing..." : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {lastPage} ({totalUsers} users)
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setError("");
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage <= 1 || loading}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      setError("");
                      setCurrentPage(pageNumber);
                    }}
                    disabled={loading}
                    className={`rounded-md border px-3 py-1 text-xs font-semibold ${
                      pageNumber === currentPage
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setError("");
                    setCurrentPage((prev) => Math.min(prev + 1, lastPage));
                  }}
                  disabled={currentPage >= lastPage || loading}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Next
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
