import { NextResponse } from "next/server";

function getGuestExamInquiryEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    configuredApi ? configuredApi.replace(/\/categories$/, "/guest/exam-inquiries") : null,
    "http://127.0.0.1:8000/api/guest/exam-inquiries",
    "http://localhost/exam.lk/backend/public/api/guest/exam-inquiries",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  let lastError: unknown = null;

  for (const endpoint of getGuestExamInquiryEndpoints()) {
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
          message: data?.message ?? "Unable to submit exam inquiry.",
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
      message: "Exam inquiry service is unavailable.",
      error: lastError instanceof Error ? lastError.message : "Unknown error",
    },
    { status: 503 },
  );
}
