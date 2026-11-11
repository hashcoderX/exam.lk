import { HomeBaseTemplate } from "@/app/components/home-base-template";
import Link from "next/link";

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
  category: string;
  deadline: string;
  status: "pending" | "published";
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
    configuredApi,
    "http://127.0.0.1:8000/api/exam-listings",
    "http://localhost/exam.lk/backend/public/api/exam-listings",
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

async function fetchExamListings(): Promise<ExamListing[]> {
  const endpoints = getExamListingApiEndpoints();

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });

      if (!response.ok) {
        continue;
      }

      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        return data
          .filter((item): item is ExamListing => {
            if (!item || typeof item !== "object") {
              return false;
            }

            const exam = item as Record<string, unknown>;
            return (
              typeof exam.id === "number" &&
              typeof exam.title === "string" &&
              typeof exam.category === "string" &&
              typeof exam.deadline === "string" &&
              (exam.status === "pending" || exam.status === "published")
            );
          })
          .sort((a, b) => a.deadline.localeCompare(b.deadline));
      }
    } catch {
      // Keep trying the next endpoint.
    }
  }

  return [];
}

export default async function GuestDashboardPage() {
  const categories = await fetchCategories();
  const examListings = await fetchExamListings();

  return (
    <HomeBaseTemplate>

      <section className="mx-auto max-w-[1020px] px-4 pt-4">
        <article aria-label="Top advertisement" className="grid overflow-hidden border border-[#d8d8d8] bg-white sm:grid-cols-[180px_1fr]">
          <div className="grid min-h-[108px] place-items-center border-r border-[#d8d8d8] bg-[#f8f8f8] p-3">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase text-[#88a7b0]">Sponsored</div>
              <div className="mt-1 text-lg font-bold text-[#43a5c6]">cleartax</div>
            </div>
          </div>
          <div className="min-h-[108px] bg-[linear-gradient(120deg,#e2a523_0%,#f4bf2e_50%,#cb8f15_100%)] p-4 text-[#222]">
            <p className="text-[14px]">Welcome back</p>
            <h2 className="text-[48px] font-black leading-[0.88]">guest dashboard</h2>
          </div>
        </article>
      </section>

      <section aria-label="Advertisement listing search" className="mx-auto max-w-[1020px] px-4 pt-4">
        <form className="grid gap-2 border border-[#d8d8d8] bg-[#f5f5f5] p-2 md:grid-cols-[1fr_1.5fr_96px]">
          <label className="flex items-center rounded border border-[#d6d6d6] bg-white px-2 text-xs text-[#888]">
            <span className="mr-1 text-[#e26b6b]">*</span>
            <span className="mr-1 text-[10px]">⚙</span>
            <select className="h-8 w-full bg-transparent outline-none">
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
              type="search"
              placeholder="What are you searching for?"
              className="h-8 w-full bg-transparent outline-none placeholder:text-[#9f9f9f]"
            />
          </label>
          <button type="submit" className="h-8 rounded border border-[#dcae42] bg-[#f0be52] text-xs font-bold text-[#4f4329]">
            Search
          </button>
        </form>

        <div className="py-3 text-xs text-[#8a8a8a]">
          <p>
            Home <span className="px-1">→</span> <span className="text-[#555]">Guest dashboard</span>
          </p>
          <p className="mt-1">Overview of your account and activity</p>
        </div>
      </section>

      <section className="border-t border-[#ddd] bg-[#efefef] pb-16 pt-6">
        <div className="mx-auto grid max-w-[1020px] gap-4 px-4 lg:grid-cols-[180px_1fr_160px]">
          <aside className="space-y-3 text-[11px]">
            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[10px] uppercase tracking-wide text-[#a3a3a3]">Account Menu</h2>
              <ul className="space-y-1 text-[#4f87bc]">
                <li><a href="#" className="hover:text-[#2f6a9d]">Dashboard Home</a></li>
                <li><a href="#" className="hover:text-[#2f6a9d]">My Profile</a></li>
                <li><a href="#" className="hover:text-[#2f6a9d]">Saved Ads</a></li>
                <li><a href="#" className="hover:text-[#2f6a9d]">Messages</a></li>
              </ul>
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
            <section className="border border-[#dadada] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <h3 className="text-[20px] font-light text-[#6f6f6f]">Guest Overview</h3>
              <p className="mt-2 text-[12px] text-[#8a8a8a]">Manage your profile, track your activity, and register exams from one place.</p>
            </section>

            <section className="border border-[#dadada] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between border-b border-[#ececec] pb-2">
                <h3 className="text-[18px] font-light text-[#6f6f6f]">Exam List</h3>
                <Link href="/guest/exam-listings" className="text-[12px] text-[#4f87bc] hover:text-[#2f6a9d]">
                  View all
                </Link>
              </div>

              <div className="mt-3 space-y-2 text-[12px]">
                {examListings.slice(0, 5).map((exam) => (
                  <article key={exam.id} className="flex items-center justify-between border border-[#e2e2e2] bg-[#fcfcfc] px-3 py-2">
                    <div>
                      <p className="text-[13px] font-bold text-[#5b5b5b]">{exam.title}</p>
                      <p className="text-[#8d8d8d]">
                        {exam.category} • Deadline: {exam.deadline} • {exam.status === "published" ? "Registration open" : "Pending"}
                      </p>
                    </div>
                    <Link href="/guest/exam-registration" className="rounded-sm border border-[#dcae42] bg-[#f0be52] px-3 py-1 text-[11px] font-bold text-[#4f4329]">
                      Explore
                    </Link>
                  </article>
                ))}
                {examListings.length === 0 ? (
                  <p className="border border-[#e2e2e2] bg-[#fcfcfc] px-3 py-3 text-[#8d8d8d]">No exam listings found.</p>
                ) : null}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-3">
              <article className="border border-[#d8d8d8] bg-white p-3 text-center">
                <p className="text-[11px] uppercase text-[#a0a0a0]">Active Ads</p>
                <p className="mt-1 text-[28px] font-light text-[#6f6f6f]">0</p>
              </article>
              <article className="border border-[#d8d8d8] bg-white p-3 text-center">
                <p className="text-[11px] uppercase text-[#a0a0a0]">Saved Ads</p>
                <p className="mt-1 text-[28px] font-light text-[#6f6f6f]">0</p>
              </article>
              <article className="border border-[#d8d8d8] bg-white p-3 text-center">
                <p className="text-[11px] uppercase text-[#a0a0a0]">Messages</p>
                <p className="mt-1 text-[28px] font-light text-[#6f6f6f]">0</p>
              </article>
            </section>

            <section className="grid place-items-center border border-[#ddd] bg-white px-4 py-7 text-center">
              <p className="text-2xl">🎓</p>
              <h3 className="mt-2 text-2xl font-light text-[#8a8a8a]">Ready to register for an exam?</h3>
              <p className="mt-2 text-[13px] text-[#9b9b9b]">Use your guest account to submit your exam registration.</p>
              <Link href="/guest/register-exam" className="mt-4 rounded bg-[#f0be52] px-6 py-2 text-[12px] font-bold text-[#594c31]">
                Register for exam
              </Link>
            </section>
          </div>

          <aside className="border border-[#d8d8d8] bg-[linear-gradient(180deg,#75a3c7,#3f678b)] p-4 text-center text-white sm:text-right">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/80">Guest Zone</p>
            <h2 className="mt-5 text-[30px] font-black uppercase leading-[0.95] sm:text-[34px] lg:mt-8 lg:text-[38px]">
              Manage your account
            </h2>
          </aside>
        </div>
      </section>

    </HomeBaseTemplate>
  );
}
