import { NextResponse } from "next/server";

function getGuestLoginEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    configuredApi ? configuredApi.replace(/\/categories$/, "/guest/login") : null,
    "http://127.0.0.1:8000/api/guest/login",
    "http://localhost/exam.lk/backend/public/api/guest/login",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

export async function POST(request: Request) {
  const payload = await request.json();
  let lastError: unknown = null;

  for (const endpoint of getGuestLoginEndpoints()) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(
        {
          message: data?.message ?? "Unable to sign in.",
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
      message: "Guest sign-in service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}
