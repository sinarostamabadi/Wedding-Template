"use client";

import { useEffect, useMemo, useState } from "react";

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function calc(targetIso: string): Parts {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: false };
}

export function Countdown({
  eventStartAt,
  className = "",
}: {
  eventStartAt: string;
  className?: string;
}) {
  // Rendered empty on the server so static HTML never mismatches the client clock.
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(calc(eventStartAt));
    const timer = window.setInterval(() => setParts(calc(eventStartAt)), 1000);
    return () => window.clearInterval(timer);
  }, [eventStartAt]);

  const items = useMemo(
    () => [
      { label: "روز", value: parts?.days },
      { label: "ساعت", value: parts?.hours },
      { label: "دقیقه", value: parts?.minutes },
      { label: "ثانیه", value: parts?.seconds },
    ],
    [parts],
  );

  if (parts?.done) {
    return (
      <p className={`text-center text-sm ${className}`}>
        مراسم آغاز شده است. برای زوجین آرزوی خوشبختی داریم.
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-current/15 bg-black/5 px-2 py-3 text-center"
        >
          <p className="text-xl font-semibold tabular-nums md:text-2xl">
            {item.value ?? "–"}
          </p>
          <p className="mt-1 text-[11px] opacity-70">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
