import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeadlineCountdown } from "@/app/components/deadline-countdown";
import { HomeBaseTemplate } from "@/app/components/home-base-template";
import { ReadMoreHtml } from "@/app/components/read-more-html";
import { SimilarExamsSlider } from "@/app/components/similar-exams-slider";

type ExamListing = {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: "published" | "pending";
  poster_url: string;
  poster_width: number;
  poster_height: number;
  created_at: string;
};

type ExamListingSingleResponse = {
  data?: ExamListing;
};

type ExamListingListResponse = {
  data?: ExamListing[];
};

type Advertisement = {
  id: number;
  title: string;
  advertiser_name: string;
  placement: string;
  target_url: string | null;
  status: "draft" | "active" | "paused" | "completed";
  ad_source: "image" | "google_code";
  image_url: string | null;
  image_width: number;
  image_height: number;
  google_ad_code: string | null;
};

type AdvertisementResponse = {
  data: Advertisement[];
};

function getExamListingEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    configuredApi ? configuredApi.replace(/\/categories$/, "/exam-listings") : null,
    "http://127.0.0.1:8000/api/exam-listings",
    "http://localhost/exam.lk/backend/public/api/exam-listings",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

function getAdvertisementApiEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    configuredApi ? configuredApi.replace(/\/categories$/, "/advertisements") : null,
    configuredApi ? configuredApi.replace(/\/exam-listings$/, "/advertisements") : null,
    "http://127.0.0.1:8000/api/advertisements",
    "http://localhost/exam.lk/backend/public/api/advertisements",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

function formatPostedDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

async function fetchExamListingById(id: string): Promise<ExamListing | null> {
  for (const endpoint of getExamListingEndpoints()) {
    try {
      const response = await fetch(`${endpoint}/${id}`, { cache: "no-store" });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json().catch(() => ({}))) as ExamListingSingleResponse;
      const listing = payload?.data;

      if (!listing) {
        continue;
      }

      if (listing.status !== "published") {
        return null;
      }

      return listing;
    } catch {
      // Try next endpoint.
    }
  }

  return null;
}

async function fetchSimilarExams(currentExam: ExamListing): Promise<ExamListing[]> {
  for (const endpoint of getExamListingEndpoints()) {
    try {
      const response = await fetch(`${endpoint}?status=published&sort=latest&per_page=16`, {
        cache: "no-store",
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json().catch(() => ({}))) as ExamListingListResponse;
      const records = Array.isArray(payload?.data) ? payload.data : [];

      const normalized = records.filter((item) => item && item.status === "published" && item.id !== currentExam.id);
      const categoryMatches = normalized.filter((item) => item.category === currentExam.category);
      const merged = [...categoryMatches, ...normalized.filter((item) => item.category !== currentExam.category)];

      return merged.slice(0, 12);
    } catch {
      // Try next endpoint.
    }
  }

  return [];
}

async function fetchActiveAdvertisementByPlacement(placement: string): Promise<Advertisement | null> {
  const endpoints = getAdvertisementApiEndpoints();

  for (const endpoint of endpoints) {
    try {
      const url = `${endpoint}?status=active&placement=${encodeURIComponent(placement)}&sort=latest&per_page=1`;
      const response = await fetch(url, { cache: "no-store" });

      if (!response.ok) {
        continue;
      }

      const payload: unknown = await response.json();
      const records = (payload as AdvertisementResponse)?.data;

      if (Array.isArray(records) && records.length > 0) {
        const ad = records[0];

        if (ad && typeof ad.id === "number" && typeof ad.title === "string") {
          return ad;
        }
      }
    } catch {
      // Keep trying next endpoint.
    }
  }

  return null;
}

async function fetchActiveAdvertisementByPlacements(placements: string[]): Promise<Advertisement | null> {
  for (const placement of placements) {
    const ad = await fetchActiveAdvertisementByPlacement(placement);

    if (ad) {
      return ad;
    }
  }

  return null;
}

function renderCodeAd(ad: Advertisement, minHeightClass: string) {
  if (ad.ad_source !== "google_code" || !ad.google_ad_code) {
    return null;
  }

  return (
    <iframe
      title={ad.title}
      srcDoc={ad.google_ad_code}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      className={`block w-full border-0 ${minHeightClass}`}
      loading="lazy"
    />
  );
}

function renderImageOrCodeAd(ad: Advertisement | null, minHeightClass: string) {
  if (!ad) {
    return null;
  }

  if (ad.ad_source === "image" && ad.image_url) {
    return (
      <a
        href={ad.target_url ?? "#"}
        target={ad.target_url ? "_blank" : undefined}
        rel={ad.target_url ? "noopener noreferrer" : undefined}
        className={`relative block ${minHeightClass}`}
      >
        <Image
          src={ad.image_url}
          alt={ad.title}
          width={Math.max(ad.image_width || 900, 1)}
          height={Math.max(ad.image_height || 200, 1)}
          unoptimized
          className="h-full w-full object-cover"
        />
      </a>
    );
  }

  return renderCodeAd(ad, minHeightClass);
}

function DetailIconRow({
  icon,
  label,
  extraIcon,
  extraLabel,
}: {
  icon: string;
  label: string;
  extraIcon?: string;
  extraLabel?: string;
}) {
  return (
    <div className="border-b border-[#e7edf6] py-3">
      <p className="flex items-center gap-2 text-[34px] font-light leading-tight text-[#2f4b78]">
        <Image src={icon} alt="" width={33} height={33} className="h-[33px] w-[33px] object-contain" />
        <span className="text-[17px] font-medium text-[#2f4b78]">{label}</span>
        {extraLabel ? (
          <>
            <span className="text-[17px] text-[#6f87ae]">|</span>
            {extraIcon ? <Image src={extraIcon} alt="" width={33} height={33} className="h-[33px] w-[33px] object-contain" /> : null}
            <span className="text-[17px] font-medium text-[#2f4b78]">{extraLabel}</span>
          </>
        ) : null}
      </p>
    </div>
  );
}

export default async function ExamListingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await fetchExamListingById(id);

  if (!exam) {
    notFound();
  }

  const [topAd, sidebarAd, similarExams] = await Promise.all([
    fetchActiveAdvertisementByPlacements(["exam_details_heading_banner", "exam_details_top", "exam_details", "home_top"]),
    fetchActiveAdvertisementByPlacements(["exam_details_google_ads", "exam_details_sidebar", "exam_details", "home_sidebar"]),
    fetchSimilarExams(exam),
  ]);

  const renderedTopAd = renderImageOrCodeAd(topAd, "min-h-[130px]");
  const renderedSidebarAd = renderImageOrCodeAd(sidebarAd, "min-h-[300px]");

  return (
    <HomeBaseTemplate>
      <section className="mx-auto max-w-[1120px] px-4 pt-5">
        <article className="overflow-hidden border border-dashed border-[#6f7782] bg-[#eceff5] px-4 py-5 sm:px-8">
          {renderedTopAd ? (
            renderedTopAd
          ) : (
            <div className="grid min-h-[120px] place-items-center text-center">
              <h2 className="text-5xl font-light tracking-tight text-[#101014] sm:text-7xl">Hedding Banner</h2>
            </div>
          )}
        </article>
      </section>

      <section className="mx-auto max-w-[1120px] space-y-4 px-4 pb-8 pt-4">
        <article className="grid gap-3 lg:grid-cols-[1fr_270px]">
          <div className="rounded-xl border border-[#d9dde6] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.08)] sm:p-6">
            <h2 className="text-[46px] font-light leading-[1.08] tracking-[-0.01em] text-[#3f4650]">{exam.title}</h2>
            <p className="mt-1 text-[20px] text-[#838a95]">
              Post By Exam.lk, {formatPostedDate(exam.created_at)}, Exams, {exam.category}
            </p>
            <div className="mt-3 overflow-hidden rounded-md border border-[#e5e7ec] bg-[#f8fafc]">
              <Image
                src={exam.poster_url}
                alt={`${exam.title} poster`}
                width={Math.max(exam.poster_width, 1)}
                height={Math.max(exam.poster_height, 1)}
                unoptimized
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <aside className="rounded-2xl border border-[#dbe2ee] bg-[linear-gradient(180deg,#ffffff_0%,#fafcff_100%)] px-5 py-5 shadow-[0_8px_24px_rgba(44,62,98,0.08)]">
            <div className="flex justify-end">
              <span className="rounded-full border border-[#e3ebfa] bg-[#f5f9ff] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#8ba5cf]">
                Share
              </span>
            </div>

            <div className="mt-4 border-b border-[#e8edf6] pb-4">
              <p className="flex items-center gap-2 text-[34px] font-light leading-tight text-[#2f4b78]">
                <Image src="/icons/More-details.png" alt="" width={34} height={34} className="h-[34px] w-[34px] object-contain" />
                <span className="text-[18px] font-medium tracking-[0.02em]">More Details</span>
              </p>
            </div>

            <div className="border-b border-[#e8edf6] py-4">
              <p className="flex items-center justify-center gap-2 text-center text-[14px] uppercase tracking-[0.2em] text-[#86a0c4]">
                <Image src="/icons/timer.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
                APPLICATION DEADLINE
              </p>
              <DeadlineCountdown  deadline={exam.deadline}  />
            </div>

            <div className="space-y-0 text-[18px] text-[#3d4f67]">
              <DetailIconRow icon="/icons/Download.png" label="Application Download" />
              <DetailIconRow icon="/icons/Clsses.png" label="Classes" extraIcon="/icons/books.png" extraLabel="Books" />
              <DetailIconRow icon="/icons/Discussion.png" label="Discussion" extraLabel="Forums" />
            </div>

            <div className="pt-5 text-center">
              <p className="flex items-center justify-center gap-2 text-[15px] text-[#d65050]">
                <Image src="/icons/timer.png" alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                Closing Date
              </p>
              <p className="mt-2 text-[16px] font-light tracking-[0.14em] text-[#6166b2] sm:text-[16px]">
                {exam.deadline.replace(/-/g, " / ")}
              </p>
            </div>
          </aside>
        </article>

        <article className="rounded-xl border border-[#dfe3eb] bg-white p-4 shadow-[0_1px_2px_rgba(17,24,39,0.07)] sm:p-6">
          <h3 className="text-[30px] font-light text-[#444b53]">{exam.title}</h3>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
            <div>
              <ReadMoreHtml html={exam.description} />

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#edf0f5] pt-4">
                <Link
                  href={`/guest/exam-registration?examId=${exam.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2f7ddd] px-4 text-base font-semibold text-white"
                >
                  <Image src="/icons/Download-btn.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                  Download
                </Link>
                <a href="#" className="inline-flex h-10 items-center gap-2 rounded-md border border-[#ccd3de] bg-[#eff2f7] px-4 text-base text-[#424853]">
                  <Image src="/icons/View.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                  View
                </a>
              </div>
            </div>

            <aside className="overflow-hidden rounded-md border border-dashed border-[#a8acb7] bg-white">
              {renderedSidebarAd ? (
                renderedSidebarAd
              ) : (
                <div className="grid min-h-[300px] place-items-center p-4 text-center">
                  <p className="text-[52px] font-light leading-none tracking-tight text-[#16181c]">google ads</p>
                </div>
              )}
            </aside>
          </div>
        </article>

        <article className="rounded-xl border border-[#dfe3eb] bg-white p-4 shadow-[0_1px_2px_rgba(17,24,39,0.07)] sm:p-6">
          <h3 className="text-[34px] font-light text-[#445271]">Similar Exams</h3>
          <div className="mt-4">
            <SimilarExamsSlider items={similarExams} />
          </div>
        </article>
      </section>
    </HomeBaseTemplate>
  );
}
