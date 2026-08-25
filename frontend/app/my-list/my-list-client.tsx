"use client";

import Image from "next/image";
import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

type MyListItem = {
  id: number;
  title: string;
  category: string;
  posterUrl: string;
  publishedAt: string;
  createdAt: string;
};

const MY_LIST_KEY = "examlk_my_list";

function readMyList(): MyListItem[] {
  try {
    const raw = window.localStorage.getItem(MY_LIST_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as MyListItem[]) : [];
  } catch {
    return [];
  }
}

function writeMyList(items: MyListItem[]) {
  window.localStorage.setItem(MY_LIST_KEY, JSON.stringify(items));
}

export function MyListClient() {
  const [, forceRender] = useState(0);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const items = mounted ? readMyList() : [];

  const removeItem = (id: number) => {
    const next = items.filter((item) => item.id !== id);
    writeMyList(next);
    forceRender((prev) => prev + 1);
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="grid gap-4 rounded-2xl border border-[#dfe3eb] bg-white p-4 shadow-[0_2px_8px_rgba(12,22,44,0.08)] lg:grid-cols-[280px_1fr_210px]">
          <div>
            <div className="overflow-hidden border border-[#d8d8d8] bg-[#f8f8f8]">
              {item.posterUrl?.trim() ? (
                <Image
                  src={item.posterUrl}
                  alt={`${item.title} poster`}
                  width={290}
                  height={177}
                  unoptimized
                  className="h-[177px] w-full object-cover"
                />
              ) : (
                <div className="grid h-[177px] w-full place-items-center text-sm font-medium text-[#7d8798]">
                  No poster
                </div>
              )}
            </div>
            <p className="mt-3 text-[15px] font-medium leading-none text-[#5f6f89]">Tags: private exams</p>
          </div>

          <div className="pr-2">
            <h2 className="text-[24px] font-bold leading-[1.25] text-[#435069]">{item.title}</h2>
            <p className="mt-1 text-[16px] text-[#6f7f98]">
              by <span className="text-[#5a83b8]">Exam.lk</span>
            </p>
            <ul className="mt-4 list-disc space-y-1.5 pl-6 text-[12px] text-[#747f91]">
              <li>Exams &gt; {item.category}</li>
              <li>Published : {new Date(item.publishedAt).toLocaleString()}</li>
            </ul>
          </div>

          <div className="border-l border-[#e5e9f0] pl-4 text-center text-[14px] text-[#5f6f86]">
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = `/exam-listings/${item.id}`;
                }}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#c5cedc] text-xl text-[#7d8ba0] transition hover:bg-[#f5f8fc]"
                aria-label="Open exam details"
                title="Open exam details"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#8fc54a] bg-[#f2fbe8] text-xl text-[#6ca432] transition hover:bg-[#e9f7d8]"
                aria-label="Remove from my list"
                title="Remove from my list"
              >
                <Heart className="h-5 w-5" fill="currentColor" />
              </button>
            </div>
            <p className="mt-4 text-[12px] font-medium text-[#60708a]">13 Views</p>
            <p className="mt-3 whitespace-nowrap text-[12px] leading-snug text-[#687790]">
              Last Updated: {new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <Link
              href={`/exam-listings/${item.id}`}
              className="mt-6 inline-flex h-10 min-w-[110px] items-center justify-center rounded-xl border-2 border-[#8fc54a] px-4 text-[13px] font-semibold leading-none text-[#6ca432]"
            >
              More
            </Link>
          </div>
        </article>
      ))}

      {items.length === 0 ? (
        <article className="rounded-xl border border-[#dfe3eb] bg-white p-6 text-center text-sm text-[#7b8798] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          No saved exams yet. Click the heart button on any listing to add it here.
        </article>
      ) : null}
    </div>
  );
}
