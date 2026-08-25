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

function buildConfiguredAdvertisingEndpoints(configuredApi: string | null | undefined): string[] {
  const normalized = normalizeEndpoint(configuredApi);

  if (!normalized) {
    return [];
  }

  const candidates = [
    normalized,
    normalized.replace(/\/categories$/, "/advertisements"),
    normalized.replace(/\/exam-listings$/, "/advertisements"),
    normalized.replace(/\/users$/, "/advertisements"),
    `${normalized}/advertisements`,
    `${normalized}/api/advertisements`,
  ];

  return Array.from(new Set(candidates));
}

function getAdvertisingEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    ...buildConfiguredAdvertisingEndpoints(configuredApi),
    "http://127.0.0.1:8000/api/advertisements",
    "http://localhost:8000/api/advertisements",
    "http://localhost/exam.lk/backend/public/api/advertisements",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const search = requestUrl.searchParams.toString();
  let lastError: unknown = null;

  for (const endpoint of getAdvertisingEndpoints()) {
    try {
      const endpointWithQuery = search ? `${endpoint}?${search}` : endpoint;

      const response = await fetch(endpointWithQuery, {
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
      message: "Advertising service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  let lastError: unknown = null;

  for (const endpoint of getAdvertisingEndpoints()) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(
        {
          message: data?.message ?? "Unable to create advertisement.",
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
      message: "Advertising service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}
