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

function buildConfiguredInquiryEndpoints(configuredApi: string | null | undefined): string[] {
  const normalized = normalizeEndpoint(configuredApi);

  if (!normalized) {
    return [];
  }

  const candidates = [
    normalized,
    normalized.replace(/\/categories$/, "/exam-inquiries"),
    normalized.replace(/\/exam-listings$/, "/exam-inquiries"),
    `${normalized}/exam-inquiries`,
    `${normalized}/api/exam-inquiries`,
  ];

  return Array.from(new Set(candidates));
}

function getInquiryEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    ...buildConfiguredInquiryEndpoints(configuredApi),
    "http://127.0.0.1:8000/api/exam-inquiries",
    "http://localhost:8000/api/exam-inquiries",
    "http://localhost/exam.lk/backend/public/api/exam-inquiries",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let lastError: unknown = null;

  for (const endpoint of getInquiryEndpoints()) {
    try {
      const response = await fetch(`${endpoint}/${id}/reject`, {
        method: "PATCH",
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
          message: data?.message ?? "Unable to reject exam inquiry.",
        },
        { status: response.status },
      );
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    {
      message: "Exam inquiries service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}
