"use client";

import { useEffect, useMemo, useState } from "react";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}

function getDeadlineTarget(deadline: string): number {
  const parsed = new Date(`${deadline}T23:59:59`).getTime();
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

function getRemaining(targetTime: number, now: number): Remaining {
  const diff = Math.max(0, targetTime - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    done: diff <= 0,
  };
}

function CountdownUnit({ value, label, tick }: { value: string; label: string; tick: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        key={`${label}-${value}-${tick}`}
        className="inline-flex min-w-[2ch] justify-center animate-[countdown-pop_280ms_ease-out]"
      >
        {value}
      </span>
      <span className="text-[#da4343]">{label}</span>
    </span>
  );
}

export function DeadlineCountdown({ deadline }: { deadline: string }) {
  const targetTime = useMemo(() => getDeadlineTarget(deadline), [deadline]);
  const [tick, setTick] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const remaining = useMemo(() => getRemaining(targetTime, now), [targetTime, now]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((prev) => prev + 1);
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const countdownText = `${pad(remaining.days)} .${pad(remaining.hours)} .${pad(remaining.minutes)}.${pad(remaining.seconds)} SEC`;

  if (remaining.done) {
    return <p className="mt-2 text-[14px] font-semibold tracking-wide text-[#da4343]">00 .00 .00.00 SEC</p>;
  }

  return (
    <p className="mt-2 text-[14px] font-semibold tracking-wide text-[#da4343]">
      <CountdownUnit value={pad(remaining.days)} label="." tick={tick} />
      <CountdownUnit value={pad(remaining.hours)} label="." tick={tick} />
      <CountdownUnit value={pad(remaining.minutes)} label="." tick={tick} />
      <CountdownUnit value={pad(remaining.seconds)} label="SEC" tick={tick} />
      <span className="sr-only">{countdownText}</span>
    </p>
  );
}
