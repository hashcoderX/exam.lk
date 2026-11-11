"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type Quill from "quill";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SkeletonListingItem } from "@/components/ui/skeleton-loaders";

type ListingStatus = "published" | "pending";

type CategoryOption = {
  id: number;
  name: string;
  slug: string;
};

type ExamListing = {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: ListingStatus;
  posterUrl: string;
  applicationUrl: string | null;
  posterWidth: number;
  posterHeight: number;
};

type ApiExamListing = {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: ListingStatus;
  poster_url: string;
  application_url: string | null;
  poster_width: number;
  poster_height: number;
};

type ApiCreateResponse = {
  message?: string;
  data?: ApiExamListing;
  errors?: Record<string, string[] | string>;
};

type ApiListResponse = {
  data: ApiExamListing[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

function mapApiListing(listing: ApiExamListing): ExamListing {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    deadline: listing.deadline,
    status: listing.status,
    posterUrl: listing.poster_url,
    applicationUrl: listing.application_url,
    posterWidth: listing.poster_width,
    posterHeight: listing.poster_height,
  };
}

export function ExamListingsClient() {
  const [listings, setListings] = useState<ExamListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [perPage] = useState(8);
  const [refreshToken, setRefreshToken] = useState(0);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listError, setListError] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingListingId, setEditingListingId] = useState<number | null>(null);
  const [deletingListingId, setDeletingListingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<ListingStatus>("pending");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState("");
  const [applicationFile, setApplicationFile] = useState<File | null>(null);
  const [existingApplicationUrl, setExistingApplicationUrl] = useState<string | null>(null);
  const [posterWidth, setPosterWidth] = useState("1200");
  const [posterHeight, setPosterHeight] = useState("630");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const quillContainerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const initialEditorHtmlRef = useRef("");
  const isEditMode = editingListingId !== null;

  const getPlainTextFromHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  useEffect(() => {
    if (!openModal) {
      quillRef.current = null;
      if (quillContainerRef.current) {
        quillContainerRef.current.innerHTML = "";
      }
      return;
    }

    let mounted = true;

    const initQuill = async () => {
      if (!quillContainerRef.current || quillRef.current) {
        return;
      }

      const { default: QuillEditor } = await import("quill");

      if (!mounted || !quillContainerRef.current) {
        return;
      }

      quillContainerRef.current.innerHTML = "";

      const editor = new QuillEditor(quillContainerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["blockquote", "code-block", "link", "image"],
            ["clean"],
          ],
        },
      });

      editor.root.innerHTML = initialEditorHtmlRef.current;
      setDescription(editor.root.innerHTML);
      editor.on("text-change", () => {
        setDescription(editor.root.innerHTML);
      });

      quillRef.current = editor;
    };

    void initQuill();

    return () => {
      mounted = false;
    };
  }, [openModal]);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);

      try {
        const response = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          setCategories([]);
          return;
        }

        const data = (await response.json().catch(() => [])) as CategoryOption[];

        if (!Array.isArray(data)) {
          setCategories([]);
          return;
        }

        const validCategories = data
          .filter((item) => item && typeof item.id === "number" && typeof item.name === "string")
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(validCategories);
        setCategory((prev) => prev || validCategories[0]?.name || "");
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const page = currentPage;

    fetch(`/api/dashboard/exam-listings?page=${page}&per_page=${perPage}`, {
      method: "GET",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string };
          setListError(errorData.message ?? "Unable to load exam listings.");
          setListings([]);
          return;
        }

        const data = (await response.json().catch(() => ({ data: [] }))) as ApiListResponse | ApiExamListing[];

        if (Array.isArray(data)) {
          setListings(data.map(mapApiListing));
          setCurrentPage(1);
          setLastPage(1);
          setTotalListings(data.length);
          setListError("");
          return;
        }

        const items = Array.isArray(data.data) ? data.data : [];
        setListings(items.map(mapApiListing));
        setCurrentPage(data.meta?.current_page ?? page);
        setLastPage(data.meta?.last_page ?? 1);
        setTotalListings(data.meta?.total ?? items.length);
        setListError("");
      })
      .catch(() => {
        setListError("Unable to load exam listings.");
        setListings([]);
      })
      .finally(() => {
        setLoadingListings(false);
      });
  }, [currentPage, perPage, refreshToken]);

  const publishedCount = useMemo(
    () => listings.filter((listing) => listing.status === "published").length,
    [listings],
  );

  const pendingCount = useMemo(
    () => listings.filter((listing) => listing.status === "pending").length,
    [listings],
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    initialEditorHtmlRef.current = "";
    if (quillRef.current) {
      quillRef.current.setContents([]);
    }
    setCategory(categories[0]?.name ?? "");
    setDeadline("");
    setStatus("pending");
    setPosterFile(null);
    setPosterPreviewUrl("");
    setApplicationFile(null);
    setExistingApplicationUrl(null);
    setPosterWidth("1200");
    setPosterHeight("630");
    setEditingListingId(null);
    setError("");
  };

  const openCreateModal = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEditModal = (listing: ExamListing) => {
    initialEditorHtmlRef.current = listing.description;
    setEditingListingId(listing.id);
    setTitle(listing.title);
    setDescription(listing.description);
    setCategory(listing.category);
    setDeadline(listing.deadline);
    setStatus(listing.status);
    setPosterFile(null);
    setPosterPreviewUrl(listing.posterUrl);
    setApplicationFile(null);
    setExistingApplicationUrl(listing.applicationUrl);
    setPosterWidth(String(listing.posterWidth));
    setPosterHeight(String(listing.posterHeight));
    setError("");
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const handleDeleteListing = async (listingId: number) => {
    const shouldDelete = window.confirm("Delete this exam listing?");

    if (!shouldDelete) {
      return;
    }

    setDeletingListingId(listingId);

    try {
      const response = await fetch(`/api/dashboard/exam-listings/${listingId}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setListError(data.message ?? "Unable to delete exam listing.");
        return;
      }

      const targetPage = listings.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setLoadingListings(true);
      setListError("");
      setCurrentPage(targetPage);

      if (targetPage === currentPage) {
        setRefreshToken((prev) => prev + 1);
      }
    } catch {
      setListError("Unable to delete exam listing.");
    } finally {
      setDeletingListingId(null);
    }
  };

  const handlePosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPosterFile(file);

    if (!file) {
      setPosterPreviewUrl("");
      return;
    }

    const preview = URL.createObjectURL(file);
    setPosterPreviewUrl(preview);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const currentEditorHtml = quillRef.current?.root?.innerHTML ?? description;
    const descriptionText = getPlainTextFromHtml(currentEditorHtml);
    const hasPosterSource = Boolean(posterFile || posterPreviewUrl);

    const missingFields: string[] = [];

    if (!title.trim()) {
      missingFields.push("title");
    }

    if (!descriptionText) {
      missingFields.push("description");
    }

    if (!category.trim()) {
      missingFields.push("category");
    }

    if (!deadline) {
      missingFields.push("deadline");
    }

    if (missingFields.length > 0) {
      setError(`Please fill required field(s): ${missingFields.join(", ")}.`);
      return;
    }

    if (!isEditMode && !posterFile) {
      setError("Poster is required when creating a new exam listing.");
      return;
    }

    if (isEditMode && !hasPosterSource) {
      setError("Poster is required. Please upload a poster image.");
      return;
    }

    const width = Number.parseInt(posterWidth, 10);
    const height = Number.parseInt(posterHeight, 10);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 100 || height < 100) {
      setError("Poster width and height must be at least 100px.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", currentEditorHtml);
    formData.append("category", category.trim());
    formData.append("deadline", deadline);
    formData.append("status", status);
    formData.append("poster_width", String(width));
    formData.append("poster_height", String(height));

    if (posterFile) {
      formData.append("poster", posterFile);
    }

    if (applicationFile) {
      formData.append("application_file", applicationFile);
    }

    setSaving(true);

    try {
      const endpoint = isEditMode
        ? `/api/dashboard/exam-listings/${editingListingId}`
        : "/api/dashboard/exam-listings";

      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => ({}))) as ApiCreateResponse;

      if (!response.ok || !data.data) {
        const firstValidationMessage = data.errors
          ? Object.values(data.errors)
              .map((value) => (Array.isArray(value) ? value[0] : value))
              .find((value) => Boolean(value))
          : null;

        setError((firstValidationMessage as string | null) ?? data.message ?? "Unable to create exam listing.");
        return;
      }

      setLoadingListings(true);
      setListError("");
      setRefreshToken((prev) => prev + 1);
      closeModal();
    } catch {
      setError(isEditMode ? "Unable to update exam listing." : "Unable to create exam listing.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container-fluid space-y-6 py-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">Dashboard / Exam Listings</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">Exam Listings</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            Create, moderate, and publish exam listings with category, deadline, and poster workflow.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={openCreateModal}>New Exam Listing</Button>
            <Button variant="outline">Export</Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{totalListings}</p>
              <p className="mt-1 text-xs text-slate-500">All exam listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{publishedCount}</p>
              <p className="mt-1 text-xs text-emerald-600">Live on site</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{pendingCount}</p>
              <p className="mt-1 text-xs text-amber-600">Needs review</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Exam Listing Management</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingListings ? (
              <div className="mb-3 space-y-3">
                <SkeletonListingItem />
                <SkeletonListingItem />
                <SkeletonListingItem />
              </div>
            ) : null}
            {listError ? <p className="mb-3 text-sm text-red-600">{listError}</p> : null}
            {!loadingListings && !listError && listings.length === 0 ? (
              <p className="mb-3 text-sm text-slate-500">No exam listings yet. Use &quot;New Exam Listing&quot; to add one.</p>
            ) : null}

            <div className="space-y-3">
              {listings.map((listing) => (
                <article key={listing.id} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[160px_1fr_auto]">
                  <div
                    className="w-full overflow-hidden rounded-lg border border-slate-200"
                    style={{ aspectRatio: `${listing.posterWidth}/${listing.posterHeight}` }}
                  >
                    <Image
                      src={listing.posterUrl}
                      alt={`${listing.title} poster`}
                      width={listing.posterWidth}
                      height={listing.posterHeight}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{listing.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{getPlainTextFromHtml(listing.description)}</p>
                    <p className="mt-1 text-sm text-slate-500">{listing.category}</p>
                    <p className="mt-1 text-xs text-slate-500">Deadline: {listing.deadline}</p>
                    <p className="mt-1 text-xs text-slate-400">Poster: {listing.posterWidth} x {listing.posterHeight}px</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Application: {listing.applicationUrl ? "Uploaded" : "Not uploaded"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 self-start sm:items-end">
                    <div className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold capitalize text-white">
                      {listing.status}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      onClick={() => openEditModal(listing)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 border-red-200 px-3 text-xs text-red-600 hover:bg-red-50"
                      onClick={() => void handleDeleteListing(listing.id)}
                      disabled={deletingListingId === listing.id}
                    >
                      {deletingListingId === listing.id ? "Deleting..." : "Delete"}
                    </Button>
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
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => {
                      setLoadingListings(true);
                      setListError("");
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                    disabled={currentPage <= 1 || loadingListings}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={() => {
                      setLoadingListings(true);
                      setListError("");
                      setCurrentPage((prev) => Math.min(prev + 1, lastPage));
                    }}
                    disabled={currentPage >= lastPage || loadingListings}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
            <Link
              href="/dashboard"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              Back to dashboard
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {openModal ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-2 sm:items-center sm:p-4" onClick={closeModal}>
          <div
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Add new exam listing"
          >
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="text-xl font-semibold text-slate-900">{isEditMode ? "Edit Exam Listing" : "New Exam Listing"}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
              <div className="space-y-4 overflow-y-auto pr-1 [scrollbar-gutter:stable]">
                <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-title">
                  Exam Title
                </label>
                <Input
                  id="exam-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. G.C.E. A/L Biology 2026"
                />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-description-editor">
                    Description
                  </label>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div
                      id="exam-description-editor"
                      ref={quillContainerRef}
                      className="[&_.ql-editor]:min-h-[180px] [&_.ql-editor]:text-sm [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Full rich editor enabled with headings, lists, links, image, colors, alignment, and code blocks.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-category">
                      Category
                    </label>
                    <select
                      id="exam-category"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      disabled={loadingCategories || categories.length === 0}
                      className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {loadingCategories ? <option value="">Loading categories...</option> : null}
                      {!loadingCategories && categories.length === 0 ? <option value="">No categories found</option> : null}
                      {!loadingCategories && categories.length > 0
                        ? categories.map((categoryOption) => (
                            <option key={categoryOption.id} value={categoryOption.name}>
                              {categoryOption.name}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-deadline">
                      Deadline
                    </label>
                    <Input
                      id="exam-deadline"
                      type="date"
                      value={deadline}
                      onChange={(event) => setDeadline(event.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-status">
                      Status
                    </label>
                    <select
                      id="exam-status"
                      value={status}
                      onChange={(event) => setStatus(event.target.value as ListingStatus)}
                      className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                      <option value="pending">pending</option>
                      <option value="published">published</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-poster">
                      Poster
                    </label>
                    <Input
                      id="exam-poster"
                      type="file"
                      accept="image/*"
                      onChange={handlePosterChange}
                    />
                    <p className="mt-1 text-xs text-slate-500">Recommended poster size: 1200 x 630px</p>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-application-file">
                    Exam Application File (PDF/DOC)
                  </label>
                  <Input
                    id="exam-application-file"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) => setApplicationFile(event.target.files?.[0] ?? null)}
                  />
                  <p className="mt-1 text-xs text-slate-500">Optional. Upload the application form students can download.</p>
                  {applicationFile ? (
                    <p className="mt-1 text-xs text-slate-600">Selected: {applicationFile.name}</p>
                  ) : existingApplicationUrl ? (
                    <p className="mt-1 text-xs text-slate-600">Existing file will be kept unless replaced.</p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-poster-width">
                      Poster Width (px)
                    </label>
                    <Input
                      id="exam-poster-width"
                      type="number"
                      min={100}
                      value={posterWidth}
                      onChange={(event) => setPosterWidth(event.target.value)}
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="exam-poster-height">
                      Poster Height (px)
                    </label>
                    <Input
                      id="exam-poster-height"
                      type="number"
                      min={100}
                      value={posterHeight}
                      onChange={(event) => setPosterHeight(event.target.value)}
                      placeholder="630"
                    />
                  </div>
                </div>

                {posterPreviewUrl ? (
                  <div className="rounded-lg border border-slate-200 p-2">
                    <p className="mb-2 text-xs text-slate-500">Preview ({posterWidth || "-"} x {posterHeight || "-"} px)</p>
                    <div
                      className="mx-auto w-full max-w-[640px] overflow-hidden rounded border border-slate-200"
                      style={{
                        aspectRatio: `${Math.max(Number.parseInt(posterWidth || "0", 10), 1)}/${Math.max(Number.parseInt(posterHeight || "0", 10), 1)}`,
                      }}
                    >
                      <Image
                        src={posterPreviewUrl}
                        alt="Poster preview"
                        width={Math.max(Number.parseInt(posterWidth || "0", 10), 1)}
                        height={Math.max(Number.parseInt(posterHeight || "0", 10), 1)}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <div className="mt-4 flex shrink-0 justify-end gap-2 border-t border-slate-200 pt-3">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : isEditMode ? "Update Exam" : "Add Exam"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
