import { GuestAuthControls } from "./components/guest-auth-controls";
import { ExamListingActions } from "./components/exam-listing-actions";
import Link from "next/link";
import Image from "next/image";

type Category = {
  id: number;
  name: string;
  slug: string;
  status: "active" | "inactive";
  created_at: string;
};

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

type ExamListingResponse = {
  data: ExamListing[];
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

function getCategoryApiEndpoints(): string[] {
  const configuredApi = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const endpoints = [
    configuredApi,
    "http://127.0.0.1:8000/api/categories",
    "http://localhost/exam.lk/backend/public/api/categories",
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(endpoints));
}

function getExamListingApiEndpoints(): string[] {
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
            return typeof category.id === "number" && typeof category.name === "string";
          })
          .sort((a, b) => a.name.localeCompare(b.name));
      }
    } catch {
      // Keep trying the next endpoint.
    }
  }

  return [];
}

async function fetchPublishedExamListings(): Promise<ExamListing[]> {
  const endpoints = getExamListingApiEndpoints();

  for (const endpoint of endpoints) {
    try {
      const url = `${endpoint}?status=published&sort=latest&per_page=12`;
      const response = await fetch(url, { cache: "no-store" });

      if (!response.ok) {
        continue;
      }

      const payload: unknown = await response.json();
      const records = (payload as ExamListingResponse)?.data;

      if (Array.isArray(records)) {
        return records.filter((item): item is ExamListing => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const listing = item as Record<string, unknown>;

          return (
            typeof listing.id === "number" &&
            typeof listing.title === "string" &&
            typeof listing.category === "string" &&
            typeof listing.deadline === "string" &&
            listing.status === "published" &&
            typeof listing.poster_url === "string"
          );
        });
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

export default async function Home() {
  const categories = await fetchCategories();
  const examListings = await fetchPublishedExamListings();
  const topAd = await fetchActiveAdvertisementByPlacement("home_top");
  const sidebarAd = await fetchActiveAdvertisementByPlacement("home_sidebar");
  const topCodeAd = topAd ? renderCodeAd(topAd, "min-h-[108px]") : null;
  const sidebarCodeAd = sidebarAd ? renderCodeAd(sidebarAd, "min-h-[300px]") : null;

  return (
    <main className="min-h-screen bg-[#efefef] text-[#666]">
      <header className="border-b border-[#ddd] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="h-[3px] w-full bg-[#1f1f1f]" />
        <div className="mx-auto flex w-full max-w-[1020px] items-center justify-between px-4 py-2 text-[11px] text-[#7b7b7b]">
          <div className="flex items-center gap-5">
            <h1 className="flex items-center gap-1 text-[30px] font-light leading-none tracking-[0.12em] text-[#c2c9cd]">
              <span className="text-[20px]">🏍</span>
              EXAM.LK
            </h1>
            <a href="#" className="font-semibold text-[#7f9caf] hover:text-[#4f6f84]">
              All Exams
            </a>
            <a href="#" className="hidden text-[#8f8f8f] md:block">
              සිංහල | தமிழ்
            </a>
          </div>
          <div className="flex items-center gap-4 text-[#8b8b8b]">
            <Link href="/my-list" className="hidden items-center gap-1 sm:inline-flex">
              ♡ <span>My List</span>
            </Link>
            <a href="#" className="hidden items-center gap-1 sm:inline-flex">
              🛒 <span>My Order</span>
            </a>
            <GuestAuthControls />
            <Link href="/guest/register-exam" className="rounded-sm border border-[#d6a948] bg-[#f0be52] px-3 py-1 font-semibold text-[#5b4b2b]">
              Register for exam
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1020px] px-4 pt-4">
        <article aria-label="Top advertisement" className="overflow-hidden border border-[#d8d8d8] bg-white">
          {topAd?.ad_source === "image" && topAd.image_url ? (
            <a
              href={topAd.target_url ?? "#"}
              target={topAd.target_url ? "_blank" : undefined}
              rel={topAd.target_url ? "noopener noreferrer" : undefined}
              className="relative block min-h-[108px]"
            >
              <Image
                src={topAd.image_url}
                alt={topAd.title}
                fill
                unoptimized
                className="object-cover"
              />
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

      <section aria-label="Advertisement listing search" className="mx-auto max-w-[1020px] px-4 pt-4">
        <form className="grid gap-2 border border-[#d8d8d8] bg-[#f5f5f5] p-2 md:grid-cols-[1fr_1.5fr_96px]">
          <label className="flex items-center rounded border border-[#d6d6d6] bg-white px-2 text-xs text-[#888]">
            <span className="mr-1 text-[#e26b6b]">*</span>
            <span className="mr-1 text-[10px]">⚙</span>
            <select suppressHydrationWarning className="h-8 w-full bg-transparent outline-none">
              <option>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="rounded border border-[#d6d6d6] bg-white px-2 text-xs text-[#888]">
            <span className="sr-only">Search</span>
            <input
              suppressHydrationWarning
              type="search"
              placeholder="What are you searching for?"
              className="h-8 w-full bg-transparent outline-none placeholder:text-[#9f9f9f]"
            />
          </label>
          <button suppressHydrationWarning type="submit" className="h-8 rounded border border-[#dcae42] bg-[#f0be52] text-xs font-bold text-[#4f4329]">
            Search
          </button>
        </form>

        <div className="py-3 text-xs text-[#8a8a8a]">
          <p>
            Home <span className="px-1">→</span> <span className="text-[#555]">All exams in Sri Lanka</span>
          </p>
          <p className="mt-1">Showing {examListings.length} ads</p>
        </div>
      </section>

      <section className="border-t border-[#ddd] bg-[#efefef] pb-16 pt-6">
        <div className="mx-auto grid max-w-[1020px] gap-4 px-4 lg:grid-cols-[180px_1fr_160px]">
          <aside className="space-y-3 text-[11px]">
            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[10px] uppercase tracking-wide text-[#a3a3a3]">Sort results by</h2>
              <select suppressHydrationWarning className="h-8 w-full border border-[#d2d2d2] bg-white px-2 text-[11px] text-[#777] outline-none">
                <option>Sort By</option>
              </select>
            </section>

            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-1 text-[10px] uppercase tracking-wide text-[#a3a3a3]">Show only by Members</h2>
              <label className="block py-1 text-[#4f87bc]">
                <input type="radio" name="member" defaultChecked className="mr-1 align-middle" /> Exam.lk Deals
              </label>
            </section>

            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-1 text-[10px] uppercase tracking-wide text-[#a3a3a3]">Type Of Poster</h2>
              <label className="block py-1 text-[#4f87bc]">
                <input type="radio" name="poster" defaultChecked className="mr-1 align-middle" /> All Post
              </label>
              <label className="block py-1 text-[#6f6f6f]">
                <input type="radio" name="poster" className="mr-1 align-middle" /> Only Member
              </label>
            </section>

            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[11px] font-semibold text-[#666]">Categories</h2>
              <p className="mb-1 text-[11px] text-[#4a4a4a]">All Categories</p>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a href="#" className="text-[#4f87bc] hover:text-[#2f6a9d]">
                      {category.name}
                    </a>
                  </li>
                ))}
                {categories.length === 0 ? <li className="text-[#8a8a8a]">No categories found</li> : null}
              </ul>
            </section>

          </aside>

          <div className="space-y-4">
            {examListings.map((exam) => (
              <article key={exam.id} className="grid gap-4 rounded-2xl border border-[#dfe3eb] bg-white p-4 shadow-[0_2px_8px_rgba(12,22,44,0.08)] lg:grid-cols-[280px_1fr_210px]">
                <div>
                  <div className="overflow-hidden border border-[#d8d8d8] bg-[#f8f8f8]">
                    <Image
                      src={exam.poster_url}
                      alt={`${exam.title} poster`}
                      width={200}
                      height={177}
                      unoptimized
                      className="h-[177px] w-full object-cover"
                    />
                  </div>
                  <p className="mt-3 text-[15px] font-medium leading-none text-[#5f6f89]">Tags: private exams</p>
                </div>

                <div className="pr-2">
                  <h3 className="text-[16px] font-bold leading-[1.25] text-[#435069]">{exam.title}</h3>
                  <p className="mt-1 text-[16px] text-[#6f7f98]">
                    by <span className="text-[#5a83b8]">Exam.lk</span>
                  </p>
                  <ul className="mt-4 list-disc space-y-1.5 pl-6 text-[12px] text-[#747f91]">
                    <li>Exams &gt; {exam.category}</li>
                    <li>Published : {new Date(exam.created_at).toLocaleString()}</li>
                  </ul>
                </div>

                <div className="border-l border-[#e5e9f0] pl-4 text-center text-[14px] text-[#5f6f86]">
                  <ExamListingActions
                    examId={exam.id}
                    title={exam.title}
                    category={exam.category}
                    posterUrl={exam.poster_url}
                    publishedAt={exam.created_at}
                  />
                  <p className="mt-4 text-[12px] font-medium text-[#60708a]">13 Views</p>
                  <p className="mt-3 whitespace-nowrap text-[12px] leading-snug text-[#687790]">
                    Last Updated: {new Date(exam.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <Link
                    href={`/exam-listings/${exam.id}`}
                    className="mt-6 inline-flex h-10 min-w-[110px] items-center justify-center rounded-xl border-2 border-[#8fc54a] px-4 text-[13px] font-semibold leading-none text-[#6ca432]"
                  >
                    More
                  </Link>
                </div>
              </article>
            ))}
            {examListings.length === 0 ? (
              <article className="grid gap-3 border border-[#dadada] bg-white p-4 text-center text-[12px] text-[#8f8f8f] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                No published exams available right now.
              </article>
            ) : null}

            
          </div>

          <aside className="border border-[#d8d8d8] bg-[linear-gradient(180deg,#75a3c7,#3f678b)] p-4 text-center text-white sm:text-right">
            {sidebarAd?.ad_source === "image" && sidebarAd.image_url ? (
              <a
                href={sidebarAd.target_url ?? "#"}
                target={sidebarAd.target_url ? "_blank" : undefined}
                rel={sidebarAd.target_url ? "noopener noreferrer" : undefined}
                className="relative block min-h-[300px]"
              >
                <Image
                  src={sidebarAd.image_url}
                  alt={sidebarAd.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </a>
            ) : sidebarCodeAd ? (
              <div className="min-h-[300px] bg-white">{sidebarCodeAd}</div>
            ) : (
              <>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/80">Mountain 7PM</p>
                <h2 className="mt-5 text-[30px] font-black uppercase leading-[0.95] sm:text-[34px] lg:mt-8 lg:text-[38px]">
                  Climb higher heights
                </h2>
              </>
            )}
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
