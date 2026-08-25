"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonProfileSection } from "@/components/ui/skeleton-loaders";

type ExamInquiry = {
  id: number;
  exam_listing_id: number;
  exam_title: string | null;
  date_of_birth: string;
  qualifications: string;
  cv_path: string;
  cv_url: string;
  whatsapp_number: string;
  mobile_number: string;
  nic: string;
  address: string;
  inquiry: string | null;
  status: "pending" | "rejected";
  created_at: string;
};

type InquiryListResponse = {
  data: ExamInquiry[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export function ExamInquiriesClient() {
  const [inquiries, setInquiries] = useState<ExamInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const perPage = 10;

  useEffect(() => {
    const page = currentPage;

    fetch(`/api/dashboard/exam-inquiries?page=${page}&per_page=${perPage}`, {
      method: "GET",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as { message?: string };
          setError(data.message ?? "Unable to load exam inquiries.");
          setInquiries([]);
          return;
        }

        const data = (await response.json().catch(() => ({ data: [] }))) as InquiryListResponse | ExamInquiry[];

        if (Array.isArray(data)) {
          setInquiries(data);
          setCurrentPage(1);
          setLastPage(1);
          setTotalInquiries(data.length);
          setError("");
          return;
        }

        const items = Array.isArray(data.data) ? data.data : [];
        setInquiries(items);
        setCurrentPage(data.meta?.current_page ?? page);
        setLastPage(data.meta?.last_page ?? 1);
        setTotalInquiries(data.meta?.total ?? items.length);
        setError("");
      })
      .catch(() => {
        setError("Unable to load exam inquiries.");
        setInquiries([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handleReject = async (inquiryId: number) => {
    const shouldReject = window.confirm("Reject this inquiry?");

    if (!shouldReject) {
      return;
    }

    setRejectingId(inquiryId);

    try {
      const response = await fetch(`/api/dashboard/exam-inquiries/${inquiryId}/reject`, {
        method: "PATCH",
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Unable to reject inquiry.");
        return;
      }

      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId
            ? {
                ...inquiry,
                status: "rejected",
              }
            : inquiry,
        ),
      );
    } catch {
      setError("Unable to reject inquiry.");
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container-fluid space-y-6 py-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Dashboard / Exams Inquiries</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">Exams Inquiries</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Real-time inquiries submitted by guests for exam applications.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Inquiry List ({totalInquiries})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="mb-3 space-y-3">
                <SkeletonProfileSection />
                <SkeletonProfileSection />
                <SkeletonProfileSection />
              </div>
            ) : null}
            {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
            {!loading && !error && inquiries.length === 0 ? (
              <p className="mb-3 text-sm text-slate-500">No exam inquiries found.</p>
            ) : null}

            <div className="space-y-3">
              {inquiries.map((inquiry) => (
                <article key={inquiry.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {inquiry.exam_title ?? `Exam #${inquiry.exam_listing_id}`}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${inquiry.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {inquiry.status}
                      </span>
                      <p className="text-xs text-slate-500">Submitted: {new Date(inquiry.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    <p><span className="font-medium text-slate-800">DOB:</span> {inquiry.date_of_birth}</p>
                    <p><span className="font-medium text-slate-800">NIC:</span> {inquiry.nic}</p>
                    <p><span className="font-medium text-slate-800">WhatsApp:</span> {inquiry.whatsapp_number}</p>
                    <p><span className="font-medium text-slate-800">Mobile:</span> {inquiry.mobile_number}</p>
                    <p className="md:col-span-2"><span className="font-medium text-slate-800">Address:</span> {inquiry.address}</p>
                    <p className="md:col-span-2"><span className="font-medium text-slate-800">Qualifications:</span> {inquiry.qualifications}</p>
                    <p className="md:col-span-2"><span className="font-medium text-slate-800">Inquiry:</span> {inquiry.inquiry || "-"}</p>
                    <p className="md:col-span-2">
                      <span className="font-medium text-slate-800">CV:</span>{" "}
                      <a href={inquiry.cv_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        View CV
                      </a>
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void handleReject(inquiry.id)}
                      disabled={inquiry.status === "rejected" || rejectingId === inquiry.id}
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {inquiry.status === "rejected" ? "Rejected" : rejectingId === inquiry.id ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {lastPage > 1 ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-500">
                  Page {currentPage} of {lastPage}
                </p>
                <div className="flex gap-2">
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
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
