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

function buildConfiguredCategoryEndpoints(configuredApi: string | null | undefined): string[] {
  const normalized = normalizeEndpoint(configuredApi);

  if (!normalized) {
    return [];
  }

  const candidates = [
    normalized,
    normalized.replace(/\/exam-listings$/, "/categories"),
    normalized.replace(/\/guest\/login$/, "/categories"),
    normalized.replace(/\/guest\/register$/, "/categories"),
    `${normalized}/categories`,
    `${normalized}/api/categories`,
  ];

  return Array.from(new Set(candidates));
}

function getCategoryEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    ...buildConfiguredCategoryEndpoints(configuredApi),
    "http://127.0.0.1:8000/api/categories",
    "http://localhost:8000/api/categories",
    "http://localhost/exam.lk/backend/public/api/categories",
  ];

  return Array.from(new Set(endpoints));
}

export async function GET() {
  let lastError: unknown = null;

  for (const endpoint of getCategoryEndpoints()) {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await response.json().catch(() => []);

      if (response.ok) {
        return NextResponse.json(data, { status: response.status });
      }
    } catch (error) {
      lastError = error;
    }
  }

  return NextResponse.json(
    {
      message: "Category service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}
