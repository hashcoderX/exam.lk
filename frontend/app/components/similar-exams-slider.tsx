"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type SimilarExamItem = {
  id: number;
  title: string;
  category: string;
  deadline: string;
  poster_url: string;
  poster_width: number;
  poster_height: number;
};

function chunkItems(items: SimilarExamItem[], size: number): SimilarExamItem[][] {
  const chunks: SimilarExamItem[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

function daysLeftText(deadline: string): string {
  const now = new Date();
  const end = new Date(`${deadline}T23:59:59`);

  if (Number.isNaN(end.getTime())) {
    return "-";
  }

  const diff = end.getTime() - now.getTime();
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  return `${days} days`;
}

export function SimilarExamsSlider({ items }: { items: SimilarExamItem[] }) {
  const pages = useMemo(() => chunkItems(items, 4), [items]);
  const [pageIndex, setPageIndex] = useState(0);

  if (items.length === 0) {
    return <p className="text-sm text-[#8d94a3]">No similar exams available right now.</p>;
  }

  const hasControls = pages.length > 1;
  const safePageIndex = Math.min(pageIndex, pages.length - 1);

  return (
    <div className="bg-white py-4">
      <div className="relative mx-auto max-w-[980px] px-10">
        <button
          type="button"
          aria-label="Previous similar exams"
          onClick={() => setPageIndex((prev) => (prev - 1 + pages.length) % pages.length)}
          disabled={!hasControls}
          className="absolute -left-7 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e3e8f0] bg-white/95 text-[#90a0b6] shadow-[0_1px_3px_rgba(15,23,42,0.12)] transition hover:text-[#5f6f86] disabled:cursor-default disabled:opacity-45"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          type="button"
          aria-label="Next similar exams"
          onClick={() => setPageIndex((prev) => (prev + 1) % pages.length)}
          disabled={!hasControls}
          className="absolute -right-7 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#e3e8f0] bg-white/95 text-[#90a0b6] shadow-[0_1px_3px_rgba(15,23,42,0.12)] transition hover:text-[#5f6f86] disabled:cursor-default disabled:opacity-45"
        >
          <ChevronRight className="h-7 w-7" />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${safePageIndex * 100}%)` }}
          >
            {pages.map((page, index) => (
              <div key={index} className="grid w-full shrink-0 gap-3 sm:grid-cols-2">
                {page.map((item) => (
                  <Link
                    key={item.id}
                    href={`/exam-listings/${item.id}`}
                    className="flex items-start gap-3 border-b border-[#edf1f7] pb-3 last:border-b-0 sm:last:border-b"
                  >
                    <div className="overflow-hidden border border-[#e6e9ef] bg-white">
                      <Image
                        src={item.poster_url}
                        alt={item.title}
                        width={Math.max(item.poster_width, 1)}
                        height={Math.max(item.poster_height, 1)}
                        unoptimized
                        className="h-[72px] w-[96px] object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="line-clamp-1 text-[20px] font-semibold leading-tight text-[#2f3949]">{item.title}</h4>
                      <p className="mt-0.5 line-clamp-1 text-[16px] text-[#6d7687]">Colombo, Music, Books &amp; Movies</p>
                      <p className="mt-1 text-[14px] font-semibold text-[#00a16b]">{item.category}</p>
                      <p className="mt-0.5 text-[13px] text-[#8d94a3]">{daysLeftText(item.deadline)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {hasControls ? (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to page ${index + 1}`}
                onClick={() => setPageIndex(index)}
                className={`h-2 w-2 rounded-full ${index === safePageIndex ? "bg-[#818c9c]" : "bg-[#d3d8e0]"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
