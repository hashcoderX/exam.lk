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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let lastError: unknown = null;

  for (const endpoint of getAdvertisingEndpoints()) {
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
          message: data?.message ?? "Advertisement not found.",
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();
  let lastError: unknown = null;

  for (const endpoint of getAdvertisingEndpoints()) {
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
          message: data?.message ?? "Unable to update advertisement.",
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let lastError: unknown = null;

  for (const endpoint of getAdvertisingEndpoints()) {
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
          message: data?.message ?? "Unable to delete advertisement.",
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
