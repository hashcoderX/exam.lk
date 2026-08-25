import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ExamRegistrationForm } from "./exam-registration-form";

type ExamOption = {
  id: number;
  title: string;
  deadline: string;
  status: "published" | "pending";
};

type ExamListingApiResponse = {
  data?: ExamOption[];
};

type ExamListingSingleApiResponse = {
  data?: ExamOption;
};

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

function getExamListingApiEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    ...buildConfiguredExamListingEndpoints(configuredApi),
    "http://127.0.0.1:8000/api/exam-listings",
    "http://localhost:8000/api/exam-listings",
    "http://localhost/exam.lk/backend/public/api/exam-listings",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

async function fetchPublishedExams(): Promise<ExamOption[]> {
  for (const endpoint of getExamListingApiEndpoints()) {
    try {
      const response = await fetch(`${endpoint}?status=published&sort=latest&per_page=100`, {
        cache: "no-store",
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json().catch(() => ({}))) as ExamListingApiResponse;
      const records = payload.data;

      if (Array.isArray(records)) {
        return records.filter((exam): exam is ExamOption => {
          if (!exam || typeof exam !== "object") {
            return false;
          }

          return (
            typeof exam.id === "number" &&
            typeof exam.title === "string" &&
            typeof exam.deadline === "string" &&
            exam.status === "published"
          );
        });
      }
    } catch {
      // Try next endpoint.
    }
  }

  return [];
}

async function fetchExamById(examId: string): Promise<ExamOption | null> {
  for (const endpoint of getExamListingApiEndpoints()) {
    try {
      const response = await fetch(`${endpoint}/${examId}`, { cache: "no-store" });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json().catch(() => ({}))) as ExamListingSingleApiResponse;
      const exam = payload.data;

      if (!exam || typeof exam !== "object") {
        continue;
      }

      if (typeof exam.id === "number" && typeof exam.title === "string" && typeof exam.deadline === "string") {
        return exam;
      }
    } catch {
      // Try next endpoint.
    }
  }

  return null;
}

export default async function GuestExamRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ examId?: string }>;
}) {
  const cookieStore = await cookies();
  const hasGuestSession = Boolean(cookieStore.get("guest_session")?.value);
  const resolvedSearchParams = await searchParams;
  const examId = resolvedSearchParams.examId ?? "";

  if (!hasGuestSession) {
    redirect("/?auth=join&next=/guest/exam-registration");
  }

  const exams = await fetchPublishedExams();
  const examFromUrl = examId ? await fetchExamById(examId) : null;
  const finalExams = examFromUrl && !exams.some((exam) => exam.id === examFromUrl.id)
    ? [examFromUrl, ...exams]
    : exams;

  return (
    <main className="min-h-screen bg-[#efefef] text-[#666]">
      <header className="border-b border-[#ddd] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="h-[3px] w-full bg-[#1f1f1f]" />
        <div className="mx-auto flex max-w-[1020px] items-center justify-between px-4 py-2 text-[11px] text-[#7b7b7b]">
          <div className="flex items-center gap-5">
            <h1 className="flex items-center gap-1 text-[30px] font-light leading-none tracking-[0.12em] text-[#c2c9cd]">
              <span className="text-[20px]">🏍</span>
              EXAM.LK
            </h1>
            <Link href="/" className="font-semibold text-[#7f9caf] hover:text-[#4f6f84]">
              All Exams
            </Link>
            <a href="#" className="hidden text-[#8f8f8f] md:block">
              සිංහල | தமிழ்
            </a>
          </div>
          <div className="flex items-center gap-4 text-[#8b8b8b]">
            <Link href="/guest/exam-listings" className="hidden items-center gap-1 sm:inline-flex">
              Exam Listings
            </Link>
          </div>
        </div>
      </header>

      <section className="border-t border-[#ddd] bg-[#efefef] pb-16 pt-6">
        <div className="mx-auto grid max-w-[1020px] gap-4 px-4 lg:grid-cols-[180px_1fr_180px]">
          <aside className="space-y-3 text-[11px]">
            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[10px] uppercase tracking-wide text-[#a3a3a3]">Guest Menu</h2>
              <ul className="space-y-1 text-[#4f87bc]">
                <li><Link href="/guest/dashboard" className="hover:text-[#2f6a9d]">Dashboard Home</Link></li>
                <li><Link href="/guest/exam-listings" className="hover:text-[#2f6a9d]">Exam Listings</Link></li>
                <li><Link href="/guest/exam-registration" className="hover:text-[#2f6a9d]">Exam Registration</Link></li>
              </ul>
            </section>

            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[11px] font-semibold text-[#666]">Instructions</h2>
              <p className="text-[11px] text-[#8a8a8a]">Fill all mandatory fields and upload your CV before submitting.</p>
            </section>
          </aside>

          <div className="space-y-4">
            <article className="grid h-[46px] place-items-center border border-[#d9b5d9] bg-[linear-gradient(120deg,#6a1a6f,#4f1a76,#2c1b56)] text-sm font-bold uppercase tracking-wide text-white">
              Featured ad space
            </article>
            <ExamRegistrationForm exams={finalExams} initialExamId={examId} />
          </div>

          <aside className="space-y-4 text-[11px]">
            <article className="border border-[#d8d8d8] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <p className="text-[10px] uppercase tracking-wide text-[#9aa8b1]">Advertisement</p>
              <h3 className="mt-2 text-[14px] font-semibold text-[#5d6f7c]">Exam Prep Partner</h3>
              <p className="mt-1 text-[#8a8a8a]">Join premium revision classes and improve your exam score.</p>
              <button className="mt-3 h-7 rounded border border-[#dcae42] bg-[#f0be52] px-3 text-[11px] font-bold text-[#4f4329]">Learn More</button>
            </article>

            <article className="border border-[#d8d8d8] bg-[linear-gradient(180deg,#75a3c7,#3f678b)] p-4 text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/80">Sponsored</p>
              <h3 className="mt-2 text-[18px] font-black leading-[1.05]">Scholarship Alerts</h3>
              <p className="mt-2 text-[11px] text-white/90">Get notified instantly about new scholarship opportunities.</p>
            </article>

            <article className="border border-[#d8d8d8] bg-white p-3 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <p className="text-[10px] uppercase tracking-wide text-[#a0a0a0]">Advertisement Area</p>
              <p className="mt-2 text-[22px]">📚</p>
              <p className="mt-1 text-[#8a8a8a]">Place your educational ad here</p>
            </article>
          </aside>
        </div>
      </section>

      <footer className="border-t border-[#ddd] bg-[#f3f3f3]">
        <div className="mx-auto grid max-w-[1020px] gap-6 px-4 py-10 text-[12px] text-[#97a4ad] sm:grid-cols-[1fr_1fr_1fr_220px]">
          <div>
            <h2 className="mb-3 text-[21px] font-light text-[#a5b0b7]">Services</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#6d7a83]">How to sell fast</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Stay safe with exam.lk</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-[21px] font-light text-[#a5b0b7]">Informations</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#6d7a83]">About us</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Contact us</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Privacy policy</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Site map</a></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-[21px] font-light text-[#a5b0b7]">Join with us</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#6d7a83]">google.com/exam.lk</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">facebook.com/www.exam.lk</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">twitter.com/exam</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">instagram.com/exam.lk</a></li>
            </ul>
          </div>
          <div className="flex items-end justify-end text-right">
            <p className="text-[48px] font-light leading-none tracking-[0.08em] text-[#c3ccd1]">🏍 EXAM.LK</p>
          </div>
        </div>
        <div className="border-t border-[#e1e1e1] py-2 text-center text-[11px] text-[#8ba8b9]">
          © 2010-2026 exam.lk. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
