import { NextResponse } from "next/server";

function normalizeEndpoint(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\/+$/, "");
}

function buildConfiguredExamListingEndpoints(configuredApi: string | null | undefined): string[] {
  const normalized = normalizeEndpoint(configuredApi);

  if (!normalized) {
    return [];
  }

  const candidates = [
    normalized,
    normalized.replace(/\/categories$/, "/exam-listings"),
    normalized.replace(/\/exam-listings$/, "/exam-listings"),
    `${normalized}/exam-listings`,
    `${normalized}/api/exam-listings`,
  ];

  return Array.from(new Set(candidates));
}

function getExamListingEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    ...buildConfiguredExamListingEndpoints(configuredApi),
    "http://127.0.0.1:8000/api/exam-listings",
    "http://localhost:8000/api/exam-listings",
    "http://localhost/exam.lk/backend/public/api/exam-listings",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let lastError: unknown = null;

  for (const endpoint of getExamListingEndpoints()) {
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(
        {
          message: data?.message ?? "Exam listing not found.",
        },
        { status: response.status },
      );
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    {
      message: "Exam listing service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();
  let lastError: unknown = null;

  for (const endpoint of getExamListingEndpoints()) {
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-HTTP-Method-Override": "PUT",
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(
        {
          message: data?.message ?? "Unable to update exam listing.",
          errors: data?.errors,
        },
        { status: response.status },
      );
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    {
      message: "Exam listing service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let lastError: unknown = null;

  for (const endpoint of getExamListingEndpoints()) {
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(
        {
          message: data?.message ?? "Unable to delete exam listing.",
        },
        { status: response.status },
      );
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    {
      message: "Exam listing service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}
