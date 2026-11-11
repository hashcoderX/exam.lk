"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonTableRows } from "@/components/ui/skeleton-loaders";

type AdStatus = "draft" | "active" | "paused" | "completed";
type Placement =
  | "home_top"
  | "home_sidebar"
  | "exam_details"
  | "guest_sidebar"
  | "footer"
  | "exam_listings_top"
  | "exam_listings_sidebar"
  | "exam_details_top"
  | "exam_details_sidebar"
  | "exam_details_heading_banner"
  | "exam_details_google_ads"
  | "guest_dashboard_top"
  | "guest_dashboard_sidebar"
  | "guest_exam_listings_top"
  | "guest_exam_listings_sidebar"
  | "guest_exam_registration_top"
  | "guest_exam_registration_sidebar"
  | "global_header"
  | "global_footer";
type AdSource = "image" | "google_code";
type AdNetwork =
  | "direct_image"
  | "google_adsense"
  | "google_ad_manager"
  | "media_net"
  | "ezoic"
  | "monumetric"
  | "mediavine"
  | "adsterra"
  | "propellerads"
  | "infolinks"
  | "custom";

type Advertisement = {
  id: number;
  title: string;
  description: string;
  advertiser_name: string;
  placement: Placement;
  target_url: string | null;
  start_date: string;
  end_date: string;
  status: AdStatus;
  ad_source: AdSource;
  ad_network: AdNetwork | null;
  ad_unit_reference: string | null;
  google_ad_code: string | null;
  budget: string | null;
  impressions: number;
  clicks: number;
  ctr: number;
  image_url: string | null;
  image_width: number;
  image_height: number;
  created_at: string;
};

type AdsListResponse = {
  data: Advertisement[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

type ApiMutationResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

const statusOptions: AdStatus[] = ["draft", "active", "paused", "completed"];
const placementOptions: Placement[] = [
  "home_top",
  "home_sidebar",
  "exam_listings_top",
  "exam_listings_sidebar",
  "exam_details_top",
  "exam_details_sidebar",
  "exam_details_heading_banner",
  "exam_details_google_ads",
  "guest_dashboard_top",
  "guest_dashboard_sidebar",
  "guest_exam_listings_top",
  "guest_exam_listings_sidebar",
  "guest_exam_registration_top",
  "guest_exam_registration_sidebar",
  "global_header",
  "global_footer",
  "exam_details",
  "guest_sidebar",
  "footer",
];
const adSourceOptions: AdSource[] = ["image", "google_code"];
const adNetworkOptions: AdNetwork[] = [
  "google_adsense",
  "google_ad_manager",
  "media_net",
  "ezoic",
  "monumetric",
  "mediavine",
  "adsterra",
  "propellerads",
  "infolinks",
  "custom",
];

function formatAdSourceLabel(value: AdSource): string {
  return value === "image" ? "Image Banner" : "Google Code";
}

function formatAdNetworkLabel(value: AdNetwork): string {
  const labels: Record<AdNetwork, string> = {
    direct_image: "Direct Image",
    google_adsense: "Google AdSense",
    google_ad_manager: "Google Ad Manager",
    media_net: "Media.net",
    ezoic: "Ezoic",
    monumetric: "Monumetric",
    mediavine: "Mediavine",
    adsterra: "Adsterra",
    propellerads: "PropellerAds",
    infolinks: "Infolinks",
    custom: "Custom / Other",
  };

  return labels[value];
}

function formatPlacementLabel(placement: Placement): string {
  const labels: Record<Placement, string> = {
    home_top: "Home - Top Banner",
    home_sidebar: "Home - Sidebar",
    exam_listings_top: "Exam Listings - Top Banner",
    exam_listings_sidebar: "Exam Listings - Sidebar",
    exam_details_top: "Exam Details - Top Banner",
    exam_details_sidebar: "Exam Details - Sidebar",
    exam_details_heading_banner: "Exam Details - Hedding Banner",
    exam_details_google_ads: "Exam Details - Google Ads",
    guest_dashboard_top: "Guest Dashboard - Top Banner",
    guest_dashboard_sidebar: "Guest Dashboard - Sidebar",
    guest_exam_listings_top: "Guest Exam Listings - Top Banner",
    guest_exam_listings_sidebar: "Guest Exam Listings - Sidebar",
    guest_exam_registration_top: "Guest Exam Registration - Top Banner",
    guest_exam_registration_sidebar: "Guest Exam Registration - Sidebar",
    global_header: "Global - Header",
    global_footer: "Global - Footer",
    exam_details: "Exam Details (Legacy)",
    guest_sidebar: "Guest Sidebar (Legacy)",
    footer: "Footer (Legacy)",
  };

  return labels[placement];
}

export function AdvertisingClient() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalAds, setTotalAds] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"all" | AdStatus>("all");
  const [placementFilter, setPlacementFilter] = useState<"all" | Placement>("all");
  const perPage = 8;

  const [openModal, setOpenModal] = useState(false);
  const [previewAd, setPreviewAd] = useState<Advertisement | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [advertiserName, setAdvertiserName] = useState("");
  const [placement, setPlacement] = useState<Placement>("home_top");
  const [targetUrl, setTargetUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<AdStatus>("draft");
  const [adSource, setAdSource] = useState<AdSource>("image");
  const [adNetwork, setAdNetwork] = useState<AdNetwork>("direct_image");
  const [adUnitReference, setAdUnitReference] = useState("");
  const [googleAdCode, setGoogleAdCode] = useState("");
  const [budget, setBudget] = useState("");
  const [impressions, setImpressions] = useState("0");
  const [clicks, setClicks] = useState("0");
  const [imageWidth, setImageWidth] = useState("1200");
  const [imageHeight, setImageHeight] = useState("630");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const loadAds = useCallback(async (page: number) => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    if (placementFilter !== "all") {
      params.set("placement", placementFilter);
    }

    const response = await fetch(`/api/dashboard/advertising?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      throw new Error(data.message ?? "Unable to load advertisements.");
    }

    return (await response.json().catch(() => ({ data: [] }))) as AdsListResponse;
  }, [placementFilter, statusFilter]);

  useEffect(() => {
    const page = currentPage;

    loadAds(page)
      .then((data) => {
        const records = Array.isArray(data.data) ? data.data : [];
        setAds(records);
        setCurrentPage(data.meta?.current_page ?? page);
        setLastPage(data.meta?.last_page ?? 1);
        setTotalAds(data.meta?.total ?? records.length);
        setError("");
      })
      .catch((fetchError: unknown) => {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load advertisements.");
        setAds([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, loadAds]);

  const totalBudget = useMemo(() => {
    return ads.reduce((sum, ad) => sum + Number(ad.budget ?? 0), 0);
  }, [ads]);

  const activeCount = useMemo(() => ads.filter((ad) => ad.status === "active").length, [ads]);

  const averageCtr = useMemo(() => {
    if (ads.length === 0) {
      return 0;
    }

    return Number((ads.reduce((sum, ad) => sum + Number(ad.ctr ?? 0), 0) / ads.length).toFixed(2));
  }, [ads]);

  const pageNumbers = Array.from({ length: lastPage }, (_, index) => index + 1).slice(
    Math.max(currentPage - 3, 0),
    Math.max(currentPage - 3, 0) + 5,
  );

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setAdvertiserName("");
    setPlacement("home_top");
    setTargetUrl("");
    setStartDate("");
    setEndDate("");
    setStatus("draft");
    setAdSource("image");
    setAdNetwork("direct_image");
    setAdUnitReference("");
    setGoogleAdCode("");
    setBudget("");
    setImpressions("0");
    setClicks("0");
    setImageWidth("1200");
    setImageHeight("630");
    setImageFile(null);
    setImagePreviewUrl("");
    setError("");
  };

  const openCreateModal = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEditModal = (ad: Advertisement) => {
    setEditingId(ad.id);
    setTitle(ad.title);
    setDescription(ad.description || "");
    setAdvertiserName(ad.advertiser_name);
    setPlacement(ad.placement);
    setTargetUrl(ad.target_url ?? "");
    setStartDate(ad.start_date);
    setEndDate(ad.end_date);
    setStatus(ad.status);
    setAdSource(ad.ad_source ?? "image");
    setAdNetwork(ad.ad_network ?? (ad.ad_source === "google_code" ? "google_adsense" : "direct_image"));
    setAdUnitReference(ad.ad_unit_reference ?? "");
    setGoogleAdCode(ad.google_ad_code ?? "");
    setBudget(ad.budget ?? "");
    setImpressions(String(ad.impressions));
    setClicks(String(ad.clicks));
    setImageWidth(String(ad.image_width));
    setImageHeight(String(ad.image_height));
    setImageFile(null);
    setImagePreviewUrl(ad.image_url ?? "");
    setError("");
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const openPreviewModal = (ad: Advertisement) => {
    setPreviewAd(ad);
  };

  const closePreviewModal = () => {
    setPreviewAd(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !advertiserName.trim() || !startDate || !endDate) {
      setError("Please fill all required fields.");
      return;
    }

    if (adSource === "image" && !editingId && !imageFile) {
      setError("Please upload advertisement image.");
      return;
    }

    if (adSource === "google_code" && !googleAdCode.trim()) {
      setError("Please add ad code snippet.");
      return;
    }

    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("advertiser_name", advertiserName.trim());
    formData.append("placement", placement);
    formData.append("target_url", targetUrl.trim());
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("status", status);
    formData.append("ad_source", adSource);
    formData.append("ad_network", adSource === "google_code" ? adNetwork : "direct_image");
    formData.append("ad_unit_reference", adUnitReference.trim());
    formData.append("google_ad_code", adSource === "google_code" ? googleAdCode.trim() : "");
    formData.append("budget", budget.trim() || "0");
    formData.append("impressions", impressions || "0");
    formData.append("clicks", clicks || "0");
    formData.append("image_width", imageWidth || "1200");
    formData.append("image_height", imageHeight || "630");

    if (adSource === "image" && imageFile) {
      formData.append("image", imageFile);
    }

    const endpoint = editingId ? `/api/dashboard/advertising/${editingId}` : "/api/dashboard/advertising";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      const responseData = (await response.json().catch(() => ({}))) as ApiMutationResponse;

      if (!response.ok) {
        const firstError = responseData.errors
          ? Object.values(responseData.errors).flat().map(String)[0]
          : null;

        setError(firstError ?? responseData.message ?? "Unable to save advertisement.");
        return;
      }

      setLoading(true);
      const refreshed = await loadAds(currentPage);
      const refreshedRecords = Array.isArray(refreshed.data) ? refreshed.data : [];
      setAds(refreshedRecords);
      setCurrentPage(refreshed.meta?.current_page ?? currentPage);
      setLastPage(refreshed.meta?.last_page ?? 1);
      setTotalAds(refreshed.meta?.total ?? refreshedRecords.length);
      closeModal();
    } catch {
      setError("Unable to save advertisement.");
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm("Delete this advertisement?");
    if (!shouldDelete) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/dashboard/advertising/${id}`, {
        method: "DELETE",
      });

      const responseData = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setError(responseData.message ?? "Unable to delete advertisement.");
        return;
      }

      const nextCountOnPage = ads.filter((ad) => ad.id !== id).length;
      const targetPage = nextCountOnPage === 0 && currentPage > 1 ? currentPage - 1 : currentPage;

      setLoading(true);
      const refreshed = await loadAds(targetPage);
      const refreshedRecords = Array.isArray(refreshed.data) ? refreshed.data : [];
      setAds(refreshedRecords);
      setCurrentPage(refreshed.meta?.current_page ?? targetPage);
      setLastPage(refreshed.meta?.last_page ?? 1);
      setTotalAds(refreshed.meta?.total ?? refreshedRecords.length);
    } catch {
      setError("Unable to delete advertisement.");
    } finally {
      setDeletingId(null);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container-fluid space-y-6 py-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Dashboard / Advertising</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">Advertising Control Center</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Control full advertisement process: create campaigns, schedule placements, track performance, and update campaign status.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={openCreateModal}>New Advertisement</Button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Total Campaigns</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-slate-900">{totalAds}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Active Campaigns</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-emerald-700">{activeCount}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Page Budget</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-slate-900">LKR {totalBudget.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Average CTR</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-slate-900">{averageCtr}%</p></CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm text-slate-600">
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setLoading(true);
                    setStatusFilter(event.target.value as "all" | AdStatus);
                  }}
                  className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="all">All statuses</option>
                  {statusOptions.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-600">
                Placement
                <select
                  value={placementFilter}
                  onChange={(event) => {
                    setLoading(true);
                    setPlacementFilter(event.target.value as "all" | Placement);
                  }}
                  className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="all">All placements</option>
                  {placementOptions.map((value) => (
                    <option key={value} value={value}>{formatPlacementLabel(value)}</option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="mb-3">
                <SkeletonTableRows rows={5} columns={10} />
              </div>
            ) : null}
            {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
            {!loading && !error && ads.length === 0 ? <p className="mb-3 text-sm text-slate-500">No advertisements found.</p> : null}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1060px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Preview</th>
                    <th className="px-3 py-2">Campaign</th>
                    <th className="px-3 py-2">Ad Source</th>
                    <th className="px-3 py-2">Platform</th>
                    <th className="px-3 py-2">Advertiser</th>
                    <th className="px-3 py-2">Placement</th>
                    <th className="px-3 py-2">Period</th>
                    <th className="px-3 py-2">Performance</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.id} className="border-b border-slate-100 text-slate-700">
                      <td className="px-3 py-2">
                        {ad.image_url ? (
                          <div className="relative h-10 w-16 overflow-hidden rounded border border-slate-200 bg-slate-50">
                            <Image src={ad.image_url} alt={ad.title} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                            Code Ad
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-semibold text-slate-900">{ad.title}</p>
                        <p className="text-xs text-slate-500">LKR {Number(ad.budget ?? 0).toLocaleString()}</p>
                      </td>
                      <td className="px-3 py-2">{formatAdSourceLabel(ad.ad_source ?? "image")}</td>
                      <td className="px-3 py-2">{formatAdNetworkLabel((ad.ad_network ?? "direct_image") as AdNetwork)}</td>
                      <td className="px-3 py-2">{ad.advertiser_name}</td>
                      <td className="px-3 py-2">{formatPlacementLabel(ad.placement)}</td>
                      <td className="px-3 py-2">{ad.start_date} to {ad.end_date}</td>
                      <td className="px-3 py-2">
                        <p>{ad.impressions.toLocaleString()} impressions</p>
                        <p className="text-xs text-slate-500">{ad.clicks.toLocaleString()} clicks ({ad.ctr}%)</p>
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold capitalize">
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              openPreviewModal(ad);
                            }}
                            className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              openEditModal(ad);
                            }}
                            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void handleDelete(ad.id);
                            }}
                            disabled={deletingId === ad.id || loading}
                            className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === ad.id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {lastPage} ({totalAds} campaigns)
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage <= 1 || loading}
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>
                {pageNumbers.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      setCurrentPage(value);
                    }}
                    disabled={loading}
                    className={`rounded-md border px-3 py-1 text-xs font-semibold ${
                      value === currentPage
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {value}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
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

        {openModal ? (
          <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/55 p-3 sm:p-6">
            <div className="flex h-[calc(100vh-24px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-[calc(100vh-48px)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId ? "Edit Advertisement" : "Create Advertisement"}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {error ? <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm text-slate-600">Campaign title*
                      <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
                    </label>
                    <label className="text-sm text-slate-600">Advertiser name*
                      <Input value={advertiserName} onChange={(event) => setAdvertiserName(event.target.value)} required />
                    </label>
                  </div>

                  <label className="text-sm text-slate-600">Description
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="mt-1 block min-h-[90px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <label className="text-sm text-slate-600">Ad source*
                      <select
                        value={adSource}
                        onChange={(event) => {
                          const value = event.target.value as AdSource;
                          setAdSource(value);
                          if (value === "google_code") {
                            setImageFile(null);
                            setImagePreviewUrl("");
                            setAdNetwork((prev) => (prev === "direct_image" ? "google_adsense" : prev));
                          } else {
                            setAdNetwork("direct_image");
                          }
                        }}
                        className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      >
                        {adSourceOptions.map((value) => (
                          <option key={value} value={value}>{formatAdSourceLabel(value)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm text-slate-600">Ad platform*
                      <select
                        value={adNetwork}
                        onChange={(event) => setAdNetwork(event.target.value as AdNetwork)}
                        className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        disabled={adSource === "image"}
                        required
                      >
                        {adSource === "image" ? (
                          <option value="direct_image">Direct Image</option>
                        ) : null}
                        {adSource === "google_code"
                          ? adNetworkOptions.map((value) => (
                              <option key={value} value={value}>{formatAdNetworkLabel(value)}</option>
                            ))
                          : null}
                      </select>
                    </label>
                    <label className="text-sm text-slate-600">Placement*
                      <select
                        value={placement}
                        onChange={(event) => setPlacement(event.target.value as Placement)}
                        className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      >
                        {placementOptions.map((value) => (
                          <option key={value} value={value}>{formatPlacementLabel(value)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm text-slate-600">Status*
                      <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value as AdStatus)}
                        className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      >
                        {statusOptions.map((value) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm text-slate-600">Target URL
                      <Input type="url" value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} placeholder="https://..." />
                    </label>
                  </div>

                  {adSource === "google_code" ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm text-slate-600">Ad unit / zone reference
                          <Input
                            value={adUnitReference}
                            onChange={(event) => setAdUnitReference(event.target.value)}
                            placeholder="Unit ID, zone ID, slot name, etc."
                          />
                        </label>
                      </div>

                      <label className="text-sm text-slate-600">Ad code snippet*
                        <textarea
                          value={googleAdCode}
                          onChange={(event) => setGoogleAdCode(event.target.value)}
                          className="mt-1 block min-h-[130px] w-full rounded-md border border-slate-200 px-3 py-2 text-xs font-mono"
                          placeholder="Paste JS/HTML ad code from your ad platform"
                          required
                        />
                      </label>
                    </>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm text-slate-600">Start date*
                      <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
                    </label>
                    <label className="text-sm text-slate-600">End date*
                      <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="text-sm text-slate-600">Budget (LKR)
                      <Input type="number" min="0" value={budget} onChange={(event) => setBudget(event.target.value)} />
                    </label>
                    <label className="text-sm text-slate-600">Impressions
                      <Input type="number" min="0" value={impressions} onChange={(event) => setImpressions(event.target.value)} />
                    </label>
                    <label className="text-sm text-slate-600">Clicks
                      <Input type="number" min="0" value={clicks} onChange={(event) => setClicks(event.target.value)} />
                    </label>
                  </div>

                  {adSource === "image" ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm text-slate-600">Image width
                          <Input type="number" min="100" value={imageWidth} onChange={(event) => setImageWidth(event.target.value)} />
                        </label>
                        <label className="text-sm text-slate-600">Image height
                          <Input type="number" min="100" value={imageHeight} onChange={(event) => setImageHeight(event.target.value)} />
                        </label>
                      </div>

                      <label className="text-sm text-slate-600">Advertisement image{editingId ? "" : "*"}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            setImageFile(file);
                            setImagePreviewUrl(file ? URL.createObjectURL(file) : imagePreviewUrl);
                          }}
                        />
                      </label>

                      {imagePreviewUrl ? (
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                          <div className="relative h-44 w-full bg-slate-50">
                            <Image src={imagePreviewUrl} alt="Advertisement preview" fill className="object-contain" unoptimized />
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Update Campaign" : "Create Campaign"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {previewAd ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6">
            <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Advertisement Preview</h3>
                  <p className="text-xs text-slate-500">
                    {previewAd.title} • {formatPlacementLabel(previewAd.placement)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePreviewModal}
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              <div className="overflow-y-auto p-5">
                {previewAd.ad_source === "image" && previewAd.image_url ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <div className="relative h-[360px] w-full">
                      <Image src={previewAd.image_url} alt={previewAd.title} fill className="object-contain" unoptimized />
                    </div>
                  </div>
                ) : previewAd.ad_source === "google_code" && previewAd.google_ad_code ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <iframe
                      title={`Preview ${previewAd.title}`}
                      srcDoc={previewAd.google_ad_code}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                      className="h-[360px] w-full border-0"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    No preview content available for this advertisement.
                  </div>
                )}

                <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                  <p><span className="font-semibold text-slate-800">Source:</span> {formatAdSourceLabel(previewAd.ad_source)}</p>
                  <p><span className="font-semibold text-slate-800">Platform:</span> {formatAdNetworkLabel((previewAd.ad_network ?? "direct_image") as AdNetwork)}</p>
                  <p><span className="font-semibold text-slate-800">Status:</span> {previewAd.status}</p>
                  <p><span className="font-semibold text-slate-800">Period:</span> {previewAd.start_date} to {previewAd.end_date}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
