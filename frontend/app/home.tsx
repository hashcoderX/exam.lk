import { HomeBaseTemplate } from "./components/home-base-template";
import Image from "next/image";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
  icon_url?: string | null;
};

type Advertisement = {
  id: number;
  title: string;
  placement: string;
  target_url: string | null;
  ad_source: "image" | "google_code";
  image_url: string | null;
  google_ad_code: string | null;
};

type AdvertisementResponse = {
  data: Advertisement[];
};

function getCategoryApiEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    configuredApi,
    "http://127.0.0.1:8000/api/categories",
    "http://localhost/exam.lk/backend/public/api/categories",
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

async function fetchCategories(): Promise<Category[]> {
  const endpoints = getCategoryApiEndpoints();

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });

      if (!response.ok) {
        continue;
      }

      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        return data
          .filter((item): item is Category => {
            if (!item || typeof item !== "object") {
              return false;
            }

            const category = item as Record<string, unknown>;
            return typeof category.id === "number" && typeof category.name === "string" && typeof category.slug === "string";
          })
          .sort((a, b) => a.name.localeCompare(b.name));
      }
    } catch {
      // Keep trying next endpoint.
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

const grades = Array.from({ length: 13 }, (_, index) => index + 1);
const gradeIconByNumber: Record<number, string> = {
  1: "/numbers/exam-lk-grade01.png",
  2: "/numbers/exam-lk-grade-02.png",
  3: "/numbers/exam-lk-grade-3.png",
  4: "/numbers/exam-lk-grade004.png",
  5: "/numbers/exam-lk-grade5.png",
  6: "/numbers/exam-lk-grade-06.png",
  7: "/numbers/exam-lk-grade-007.png",
  8: "/numbers/exam-lk-grade-08.png",
  9: "/numbers/exam-lk-grade-09.png",
  10: "/numbers/exam-lk-grade-10-.png",
  11: "/numbers/exam-lk-grade-11.png",
  12: "/numbers/exam-lk-grade-12.png",
  13: "/numbers/exam-lk-grade-13.png",
};

export default async function HomePage() {
  const categories = await fetchCategories();
  const topAd = await fetchActiveAdvertisementByPlacement("home_top");
  const topCodeAd = topAd ? renderCodeAd(topAd, "min-h-[108px]") : null;

  return (
    <HomeBaseTemplate>
      <section className="mx-auto max-w-[1020px] px-4 pt-4">
        <article aria-label="Top advertisement" className="overflow-hidden border border-[#d8d8d8] bg-white">
          {topAd?.ad_source === "image" && topAd.image_url ? (
            <a
              href={topAd.target_url ?? "#"}
              target={topAd.target_url ? "_blank" : undefined}
              rel={topAd.target_url ? "noopener noreferrer" : undefined}
              className="relative block min-h-[108px]"
            >
              <Image src={topAd.image_url} alt={topAd.title} fill unoptimized className="object-cover" />
            </a>
          ) : topCodeAd ? (
            <div className="min-h-[108px] bg-white">{topCodeAd}</div>
          ) : (
            <div className="min-h-[108px] bg-[linear-gradient(120deg,#e2a523_0%,#f4bf2e_50%,#cb8f15_100%)] p-4 text-[#222]">
              <p className="text-[14px]">Alpine&apos;s guide to</p>
              <h2 className="text-[48px] font-black leading-[0.88]">winter cycling</h2>
            </div>
          )}
        </article>
      </section>

      <section className="mx-auto max-w-[1020px] px-4 pb-12 pt-10">
        <div className="rounded-2xl border border-[#e9edf4] bg-white px-6 py-8 sm:px-10">
          <div className="relative flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Previous intro"
              className="absolute left-0 hidden h-10 w-10 items-center justify-center rounded-full text-[46px] font-light leading-none text-[#d4dae5] sm:inline-flex"
            >
              ‹
            </button>
            <div className="hidden h-[88px] w-[120px] overflow-hidden rounded-xl bg-[#f3f6fb] sm:block" />
            <div className="max-w-[460px] text-center">
              <h2 className="text-[30px] font-light text-[#6d7688]">Hello Biker !! welcome to bike world !!!</h2>
              <p className="mt-1 text-[13px] text-[#a0a8b8]">
                On a motorcycle, you can&apos;t really think about more than where you are.
              </p>
            </div>
            <button
              type="button"
              aria-label="Next intro"
              className="absolute right-0 hidden h-10 w-10 items-center justify-center rounded-full text-[46px] font-light leading-none text-[#d4dae5] sm:inline-flex"
            >
              ›
            </button>
          </div>

          <form className="mx-auto mt-8 grid max-w-[760px] gap-2 border border-[#e2e7ef] bg-[#f8fafc] p-2 md:grid-cols-[1fr_1fr_2fr_100px]">
            <label className="relative flex items-center rounded border border-[#d6dce7] bg-white px-2 text-xs text-[#95a0b2]">
              <span className="mr-1 text-[#e26b6b]">*</span>
              <select className="h-8 w-full bg-transparent pr-9 outline-none" defaultValue="">
                <option value="" disabled>Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={String(grade)}>Grade {grade}</option>
                ))}
              </select>
              <Image
                src="/icons/homeicons/Select-Grade-Icon.png"
                alt="Select grade icon"
                width={20}
                height={20}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 object-contain"
              />
            </label>
            <label className="relative flex items-center rounded border border-[#d6dce7] bg-white px-2 text-xs text-[#95a0b2]">
              <span className="mr-1 text-[#e26b6b]">*</span>
              <select className="h-8 w-full bg-transparent pr-9 outline-none" defaultValue="">
                <option value="" disabled>Select Subject</option>
                {categories.slice(0, 12).map((category) => (
                  <option key={category.id} value={category.slug}>{category.name}</option>
                ))}
              </select>
              <Image
                src="/icons/homeicons/Select-Subject-Icon.png"
                alt="Select subject icon"
                width={20}
                height={20}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 object-contain"
              />
            </label>
            <label className="rounded border border-[#d6dce7] bg-white px-2 text-xs text-[#95a0b2]">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="What are you Searching For (E.g. Lesson / Past Papers)"
                className="h-8 w-full bg-transparent outline-none placeholder:text-[#b6bfcd]"
              />
            </label>
            <button type="submit" className="h-8 rounded border border-[#dcae42] bg-[#f0be52] text-xs font-bold text-[#4f4329]">
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-start justify-center gap-x-4 gap-y-6 text-center sm:gap-x-6">
            {(categories.length > 0 ? categories.slice(0, 8) : []).map((category) => (
              <Link
                key={category.id}
                href={{
                  pathname: "/all-exams",
                  query: { category: category.name },
                }}
                className="flex w-[160px] flex-col items-center justify-start rounded-xl p-1 transition hover:bg-[#f7faff] sm:w-[180px]"
              >
                {category.icon_url ? (
                  <img
                    src={category.icon_url}
                    alt={category.name}
                    className="h-[64px] w-[124px] object-contain sm:h-[74px] sm:w-[142px]"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-[64px] w-[124px] rounded-xl bg-[linear-gradient(140deg,#fff1d4_0%,#ffd889_100%)] sm:h-[74px] sm:w-[142px]" />
                )}
                <p className="mt-3 min-h-[52px] text-[16px] font-medium leading-[1.2] tracking-[0.01em] text-[#4a68a3] sm:text-[18px]">
                  {category.name}
                </p>
              </Link>
            ))}
            {categories.length === 0 ? (
              <p className="col-span-full text-[13px] text-[#9aa5b8]">No categories available right now.</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Image
            src="/icons/homeicons/down_arrow.png"
            alt="Scroll down"
            width={110}
            height={44}
            className="h-auto w-[80px] opacity-80 sm:w-[110px]"
          />
        </div>
      </section>

      <section className="border-y border-[#eceff5] bg-white py-12">
        <div className="mx-auto max-w-[1020px] px-4">
          <div className="mx-auto max-w-[560px] text-center">
            <h3 className="flex items-center justify-center gap-5 text-[36px] font-light text-[#4f5666]">
              <span className="h-px w-20 bg-[#8f96a6]" />
              <span className="text-[38px] leading-none">Explore by Grade</span>
              <span className="h-px w-20 bg-[#8f96a6]" />
            </h3>
            <p className="mt-1 text-[16px] text-[#7d8594]">Find study materials and past papers for your grade</p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-2 gap-y-10 text-center sm:grid-cols-4">
            {grades.map((grade) => (
              <article key={grade} className="px-2">
                <div className="mx-auto flex h-[74px] w-[64px] items-center justify-center">
                  <Image
                    src={gradeIconByNumber[grade]}
                    alt={`Grade ${grade}`}
                    width={64}
                    height={74}
                    className="h-auto w-auto object-contain"
                  />
                </div>
                <p className="mt-1 text-[14px] text-[#5f6b83]">Grade_{grade}</p>
                <p className="mt-2 text-[12px] leading-snug text-[#8d97a8]">
                  Sinhala | English | Mathematics | Second National Language | Etc. | Past Papers
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </HomeBaseTemplate>
  );
}
