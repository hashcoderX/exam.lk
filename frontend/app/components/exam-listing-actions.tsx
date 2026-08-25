"use client";

import { Heart, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

type ExamListItem = {
  id: number;
  title: string;
  category: string;
  posterUrl: string;
  publishedAt: string;
  createdAt: string;
};

const MY_LIST_KEY = "examlk_my_list";

function readMyList(): ExamListItem[] {
  try {
    const raw = window.localStorage.getItem(MY_LIST_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ExamListItem[]) : [];
  } catch {
    return [];
  }
}

function writeMyList(items: ExamListItem[]) {
  window.localStorage.setItem(MY_LIST_KEY, JSON.stringify(items));
}

export function ExamListingActions({
  examId,
  title,
  category,
  posterUrl,
  publishedAt,
}: {
  examId: number;
  title: string;
  category: string;
  posterUrl: string;
  publishedAt: string;
}) {
  const router = useRouter();
  const [inMyList, setInMyList] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const storedInMyList = mounted && readMyList().some((item) => item.id === examId);
  const isInMyList = inMyList || storedInMyList;

  const handleQuickView = () => {
    router.push(`/exam-listings/${examId}`);
  };

  const handleAddToMyList = () => {
    const current = readMyList();

    if (current.some((item) => item.id === examId)) {
      setInMyList(true);
      return;
    }

    const next: ExamListItem[] = [
      {
        id: examId,
        title,
        category,
        posterUrl,
        publishedAt,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ];

    writeMyList(next);
    setInMyList(true);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        suppressHydrationWarning
        type="button"
        onClick={handleQuickView}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#c5cedc] text-xl text-[#7d8ba0] transition hover:bg-[#f5f8fc]"
        aria-label="Open exam details"
        title="Open exam details"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        suppressHydrationWarning
        type="button"
        onClick={handleAddToMyList}
        className={`inline-flex h-14 w-14 items-center justify-center rounded-full border text-xl transition ${
          isInMyList
            ? "border-[#8fc54a] bg-[#f2fbe8] text-[#6ca432]"
            : "border-[#c5cedc] text-[#7d8ba0] hover:bg-[#f5f8fc]"
        }`}
        aria-label="Add to my list"
        title={isInMyList ? "Added to my list" : "Add to my list"}
      >
        <Heart className="h-5 w-5" fill={isInMyList ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
