import { GuestAuthControls } from "@/app/components/guest-auth-controls";
import Image from "next/image";
import Link from "next/link";
import { MyListClient } from "./my-list-client";

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

export default async function MyListPage() {
  const [topAd, sidebarAd] = await Promise.all([
    fetchActiveAdvertisementByPlacement("home_top"),
    fetchActiveAdvertisementByPlacement("home_sidebar"),
  ]);
  const renderedTopAd = renderImageOrCodeAd(topAd, "min-h-[108px]");
  const renderedSidebarAd = renderImageOrCodeAd(sidebarAd, "min-h-[300px]");

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
            <Link href="/" className="font-semibold text-[#7f9caf] hover:text-[#4f6f84]">
              All Exams
            </Link>
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
          {renderedTopAd ? (
            renderedTopAd
          ) : (
            <div className="min-h-[108px] bg-[linear-gradient(120deg,#e2a523_0%,#f4bf2e_50%,#cb8f15_100%)] p-4 text-[#222]">
              <p className="text-[14px]">Spotlight campaigns</p>
              <h2 className="text-[44px] font-black leading-[0.9]">Top Advertisement</h2>
            </div>
          )}
        </article>
      </section>

      <section className="mx-auto max-w-[1020px] px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[180px_1fr_160px]">
          <aside className="space-y-3 text-[11px]">
            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[10px] uppercase tracking-wide text-[#a3a3a3]">My List Tools</h2>
              <div className="space-y-2 text-[11px] text-[#6f7f95]">
                <p className="rounded border border-[#d4dae4] bg-white px-2 py-1.5">Saved Exams</p>
                <p className="rounded border border-[#d4dae4] bg-white px-2 py-1.5">Quick Access</p>
              </div>
            </section>

            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[10px] uppercase tracking-wide text-[#a3a3a3]">Browse</h2>
              <div className="space-y-1.5 text-[#6f7f95]">
                <Link href="/" className="block rounded border border-[#d4dae4] bg-white px-2 py-1.5 hover:text-[#4e6f8a]">
                  All Exams
                </Link>
                <Link href="/my-list" className="block rounded border border-[#d4dae4] bg-[#f5f9ff] px-2 py-1.5 font-semibold text-[#4e6f8a]">
                  My List
                </Link>
              </div>
            </section>
          </aside>

          <div>
            <header className="mb-5 rounded-xl border border-[#d9dde6] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <h1 className="text-2xl font-semibold text-[#435069]">My List</h1>
              <p className="mt-1 text-sm text-[#70809a]">Saved items from heart button clicks</p>
              <Link href="/" className="mt-3 inline-flex text-sm font-medium text-[#4f87bc] hover:text-[#2f6a9d]">
                ← Back to all exams
              </Link>
            </header>

            <MyListClient />
          </div>

          <aside>
            <article aria-label="Right side advertisement" className="overflow-hidden border border-[#d8d8d8] bg-white">
              {renderedSidebarAd ? (
                renderedSidebarAd
              ) : (
                <div className="grid min-h-[300px] place-items-center bg-[radial-gradient(circle_at_top,#f2f4f8_0%,#e5e9f1_55%,#d7deea_100%)] p-3 text-center text-[#5f6f86]">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em]">Advertisement</p>
                    <h2 className="mt-2 text-[22px] font-semibold leading-tight">Right Side Ad Slot</h2>
                  </div>
                </div>
              )}
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
