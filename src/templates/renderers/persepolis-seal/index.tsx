"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  CalendarDays,
  Flame,
  Landmark,
  MapPin,
  Navigation,
  RotateCcw,
  ScrollText,
  Users,
} from "lucide-react";
import { Countdown } from "@/templates/shared/countdown";
import {
  coupleLabel,
  coupleMonogram,
  formatEventTimeRange,
  googleCalendarUrl,
} from "@/templates/shared/format";
import type {
  TemplateCustomization,
  TemplateRendererProps,
  TemplateScheduleItem,
} from "@/templates/types";

const DEFAULT_COVER = "/images/templates/persepolis-seal-cover.jpg";

const STONE = "#e8dcc4";
const LAPIS = "#1f3a6b";
const GOLD = "#c9a13b";
const CLAY = "#9c4a2a";
const INK = "#2a2420";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "پیشواز مهمانان",
    description: "خوشامد از دروازه‌ی جشن با گلاب، شربت و نوای چنگ",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "آیین پیمان",
    description: "پیمان زناشویی با گواهی خانواده‌ها و روشنایی آتش",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "سور شاهانه",
    description: "خوان گسترده‌ی جشن، به رسم سورهای کهن ایرانی",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "پایکوبی",
    description: "شادمانی و دست‌افشانی تا پاسی از شب",
    icon: "music",
  },
];

const VOWS = [
  { title: "پندار نیک", text: "همیشه برای هم نیکی بیندیشیم" },
  { title: "گفتار نیک", text: "با مهر و راستی با هم سخن بگوییم" },
  { title: "کردار نیک", text: "دست در دست، زندگی را آباد کنیم" },
];

const MONTH_MEANING: Record<string, string> = {
  فروردین: "ماه فروهرها؛ روان‌های نیک",
  اردیبهشت: "بهترین راستی و پاکی",
  خرداد: "رسایی و کمال",
  تیر: "ستاره‌ی باران‌آور",
  مرداد: "بی‌مرگی و جاودانگی",
  امرداد: "بی‌مرگی و جاودانگی",
  شهریور: "شهریاری نیک و آرمانی",
  مهر: "پیمان، دوستی و مهربانی",
  آبان: "آب‌های پاک و روان",
  آذر: "آتش و روشنایی",
  دی: "آفریدگار و آفرینش",
  بهمن: "منش نیک و اندیشه‌ی روشن",
  اسفند: "سپندارمذ؛ فروتنی و مهر زمین",
};

const BRICKS = [
  { color: LAPIS, label: "لاجوردی" },
  { color: "#2f8f8a", label: "فیروزه‌ای" },
  { color: GOLD, label: "زرین" },
  { color: CLAY, label: "سفالی" },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Wedge = { x: number; y: number; dir: "h" | "v" | "d" };

const GLYPHS: Wedge[][] = (() => {
  const rand = seeded(5500);
  return Array.from({ length: 9 }, () => {
    const n = 2 + Math.floor(rand() * 3);
    return Array.from({ length: n }, (_, j) => {
      const r = rand();
      return {
        x: 1 + j * 3.5 + rand() * 1.5,
        y: 5 + rand() * 9,
        dir: r < 0.5 ? "h" : r < 0.85 ? "v" : "d",
      } as Wedge;
    });
  });
})();

function wedgePath({ x, y, dir }: Wedge) {
  if (dir === "h") return `M${x} ${y - 2.2} L${x + 2.6} ${y} L${x} ${y + 2.2} Z M${x + 2.6} ${y} L${x + 8} ${y}`;
  if (dir === "v") return `M${x - 2.2} ${y - 4} L${x} ${y - 1.4} L${x + 2.2} ${y - 4} Z M${x} ${y - 1.4} L${x} ${y + 5}`;
  return `M${x} ${y - 3} L${x + 2.6} ${y - 1.6} L${x + 0.8} ${y + 0.6} Z M${x + 1.8} ${y - 0.4} L${x + 6} ${y + 4}`;
}

function Cuneiform({ count = 9, offset = 0, className = "", color = INK }: { count?: number; offset?: number; className?: string; color?: string }) {
  return (
    <svg viewBox={`0 0 ${count * 14} 20`} className={className} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(${i * 14} 0)`}>
          {GLYPHS[(i + offset) % GLYPHS.length].map((w, j) => (
            <path key={j} d={wedgePath(w)} fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function WingedDisc({ className = "", color = GOLD }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 50" className={className} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path d={`M52 ${16 + i * 5} L${10 + i * 6} ${10 + i * 6} L${12 + i * 6} ${14 + i * 6} L52 ${20 + i * 5} Z`} fill={color} opacity={1 - i * 0.12} />
          <path d={`M68 ${16 + i * 5} L${110 - i * 6} ${10 + i * 6} L${108 - i * 6} ${14 + i * 6} L68 ${20 + i * 5} Z`} fill={color} opacity={1 - i * 0.12} />
        </g>
      ))}
      <path d="M54 34 L60 48 L66 34 Z" fill={color} />
      <circle cx="60" cy="22" r="9" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="60" cy="22" r="3.5" fill={color} />
      <path d="M44 34 C 38 40 30 42 24 40 M76 34 C 82 40 90 42 96 40" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Rosette({ className = "", color = GOLD }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-20 -20 40 40" className={className} aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-10" rx="3.2" ry="8" fill={color} opacity="0.9" transform={`rotate(${i * 30})`} />
      ))}
      <circle r="4.5" fill={STONE} stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function Column({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 220" className={className} aria-hidden>
      <path d="M4 20 C 4 6 16 4 22 12 L 30 20 L 38 12 C 44 4 56 6 56 20 C 56 30 46 32 40 28 L 30 34 L 20 28 C 14 32 4 30 4 20 Z" fill="#cdbb98" stroke="#7d6a4c" strokeWidth="1.5" />
      <circle cx="12" cy="18" r="2" fill="#7d6a4c" />
      <circle cx="48" cy="18" r="2" fill="#7d6a4c" />
      <rect x="18" y="34" width="24" height="8" fill="#cdbb98" stroke="#7d6a4c" strokeWidth="1.5" />
      <rect x="20" y="42" width="20" height="150" fill="#d8c8a6" stroke="#7d6a4c" strokeWidth="1.5" />
      {[24, 28, 32, 36].map((x) => (
        <line key={x} x1={x} y1="44" x2={x} y2="190" stroke="#7d6a4c" strokeOpacity="0.45" />
      ))}
      <path d="M14 192 L46 192 L52 214 L8 214 Z" fill="#cdbb98" stroke="#7d6a4c" strokeWidth="1.5" />
      <path d="M12 198 Q 30 206 48 198" stroke="#7d6a4c" strokeOpacity="0.6" fill="none" />
    </svg>
  );
}

function FireAltar({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 100 120" className="h-full w-full" aria-hidden>
      <path d="M30 112 L70 112 L64 100 L36 100 Z" fill="#8a7656" />
      <rect x="40" y="62" width="20" height="38" fill="#a8916b" />
      <path d="M26 50 L74 50 L68 62 L32 62 Z" fill="#8a7656" />
      <path d="M22 42 L78 42 L74 50 L26 50 Z" fill="#a8916b" />
      {[46, 52, 58].map((y) => (
        <line key={y} x1="40" y1={y + 30} x2="60" y2={y + 30} stroke="#6b5a40" strokeOpacity="0.5" />
      ))}
      <g
        style={{
          transformOrigin: "50px 42px",
          transform: lit ? "scale(1)" : "scale(0.05)",
          transition: "transform 700ms cubic-bezier(0.2,1.4,0.4,1)",
        }}
      >
        <path d="M50 4 C 62 18 70 28 64 38 C 60 44 40 44 36 38 C 30 28 40 22 44 12 C 46 20 50 22 50 4 Z" fill="#f08a24" style={{ animation: lit ? "ps-flame 0.9s ease-in-out infinite" : undefined, transformOrigin: "50px 42px" }} />
        <path d="M50 16 C 57 25 60 31 56 37 C 53 41 47 41 44 37 C 41 31 46 26 50 16 Z" fill="#ffd25a" />
      </g>
    </svg>
  );
}

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", day: "", month: "", year: "" };
  try {
    const d = new Date(iso);
    const f = (o: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...o }).format(d);
    return {
      weekday: f({ weekday: "long" }),
      day: f({ day: "numeric" }),
      month: f({ month: "long" }),
      year: f({ year: "numeric" }),
    };
  } catch {
    return { weekday: "", day: "", month: "", year: "" };
  }
}

export function PersepolisSealRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [auto, setAuto] = useState(false);
  const [open, setOpen] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [lit, setLit] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const sealed = progress >= 100;

  useEffect(() => {
    if (!auto || sealed) return;
    const id = window.setInterval(() => setProgress((p) => Math.min(100, p + 1.6)), 30);
    return () => window.clearInterval(id);
  }, [auto, sealed]);

  useEffect(() => {
    if (!sealed || open) return;
    const t = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(t);
  }, [sealed, open]);

  const rollTo = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress((prev) => {
      const next = Math.max(prev, Math.min(100, p));
      return next >= 96 ? 100 : next;
    });
  };

  const reset = () => {
    setOpen(false);
    setAuto(false);
    setDragging(false);
    setProgress(0);
    setLit(false);
  };

  const theme: TemplateCustomization = {
    primaryColor: GOLD,
    secondaryColor: LAPIS,
    backgroundColor: STONE,
    poeticLine: "«به نام خداوند جان و خرد، کزین برتر اندیشه برنگذرد»",
    blessingLine:
      "شاد زی و دیر زی! حضور شما، فرخنده‌ترین گواه پیمان ماست.",
    dressCode:
      "پوشش رسمی با الهام از کاشی‌های لعابی شوش و تخت جمشید؛ لاجوردی، فیروزه‌ای، زرین و سفالی.",
    musicTitle: "نوای چنگ و نی",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const parts = datePartsOf(data.eventStartAt, data.timezone);
  const meaning = MONTH_MEANING[parts.month];
  const timeFa = formatEventTimeRange(data.eventStartAt, data.eventEndAt, data.timezone);
  const calendarHref = googleCalendarUrl({
    title: data.title || `عروسی ${couple}`,
    startIso: data.eventStartAt,
    endIso: data.eventEndAt,
    location: [data.venueName, data.venueAddress].filter(Boolean).join(" - "),
    details: data.invitationText,
  });
  const schedule = theme.schedule?.length ? theme.schedule : DEFAULT_SCHEDULE;
  const showCountdown = features?.countdown !== false && !!data.eventStartAt;
  const showMap =
    features?.map !== false && !!(data.venueName || data.venueAddress || data.mapUrl);
  const query = encodeURIComponent(
    data.mapUrl || [data.venueName, data.venueAddress].filter(Boolean).join(" ") || "",
  );
  const families = [data.familyNames?.partnerOneFamily, data.familyNames?.partnerTwoFamily]
    .filter(Boolean)
    .join(" و ");

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#2a2420]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes ps-flame { 0%,100% { transform: scale(1,1) skewX(0); } 33% { transform: scale(0.94,1.08) skewX(3deg); } 66% { transform: scale(1.05,0.95) skewX(-3deg); } }
        @keyframes ps-bake { 0% { box-shadow: 0 0 0 rgba(255,170,60,0); } 50% { box-shadow: 0 0 40px rgba(255,170,60,0.9); } 100% { box-shadow: 0 10px 30px -12px rgba(42,36,32,0.6); } }
        @keyframes ps-shine { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[linear-gradient(180deg,#efe5cf_0%,#e8dcc4_40%,#ddcdaf_100%)] [background-image:radial-gradient(rgba(125,106,76,0.12)_1px,transparent_1.5px),linear-gradient(180deg,#efe5cf_0%,#e8dcc4_40%,#ddcdaf_100%)] [background-size:7px_7px,100%_100%]">
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b-2 border-[#7d6a4c]/40 bg-[#efe5cf]/95 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 font-display text-sm text-[#1f3a6b]">
            <Landmark className="h-4 w-4 text-[#c9a13b]" />
            لوح پیمان
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f3a6b] font-display text-[11px] text-[#f1dd9a] ring-2 ring-[#c9a13b]">
            {monogram}
          </span>
        </header>

        <main className="relative flex flex-col pb-28">
          <div className="flex items-center justify-center gap-1 bg-[#1f3a6b] py-1.5" aria-hidden>
            {Array.from({ length: 9 }, (_, i) => (
              <Rosette key={i} className="h-5 w-5" />
            ))}
          </div>

          <section className="px-6 pt-6 text-center">
            <WingedDisc className="mx-auto h-12 w-32" />
            <p className="mt-2 text-[12px] text-[#7d6a4c]">به نام خداوند جان و خرد</p>
            <h1 className="mt-2 font-display text-[38px] leading-tight text-[#1f3a6b]">{couple}</h1>
            <p className="mt-1 text-[12px] text-[#5a4c38]">پیمانی به دیرینگی سرزمین آریایی</p>
          </section>

          {/* Clay tablet + cylinder seal */}
          <section className="mt-6 px-5">
            <div
              className="relative overflow-hidden rounded-[18px] border-2 border-[#6b4a2e] bg-[radial-gradient(circle_at_30%_20%,#c98a5e,#a8653d_55%,#8a4f2e)] p-4 shadow-[inset_0_2px_10px_rgba(255,220,180,0.35),inset_0_-6px_14px_rgba(60,30,10,0.45)]"
              style={sealed ? { animation: "ps-bake 1.4s ease-out both" } : undefined}
            >
              <Cuneiform className="mx-auto h-4 w-[88%] opacity-60" color="#5e3218" offset={2} />

              <div
                ref={trackRef}
                dir="ltr"
                onPointerDown={(e) => {
                  if (sealed) return;
                  try {
                    e.currentTarget.setPointerCapture(e.pointerId);
                  } catch {}
                  setDragging(true);
                  rollTo(e);
                }}
                onPointerMove={(e) => {
                  if (dragging && !sealed) rollTo(e);
                }}
                onPointerUp={() => setDragging(false)}
                onPointerCancel={() => setDragging(false)}
                className="relative my-3 h-36 cursor-grab touch-none select-none rounded-lg bg-[#8a4f2e]/60 shadow-[inset_0_3px_8px_rgba(40,18,6,0.6)] active:cursor-grabbing"
                role="slider"
                aria-label="غلتاندن مهر استوانه‌ای روی لوح"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Enter") {
                    e.preventDefault();
                    setAuto(true);
                  }
                }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-between gap-2 px-3"
                  style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
                >
                  <WingedDisc className="h-10 w-16 shrink-0" color="#4e2810" />
                  <div className="min-w-0 flex-1 text-center" dir="rtl">
                    <p className="font-display text-[22px] leading-tight text-[#3e1f0c] [text-shadow:0_1px_0_rgba(255,210,170,0.35)]">
                      {data.partnerOneName} و {data.partnerTwoName}
                    </p>
                    <Cuneiform count={7} className="mx-auto mt-1 h-4 w-[90%]" color="#3e1f0c" />
                    <p className="mt-1 text-[11px] text-[#3e1f0c]/85">پیمان مهر · {parts.day} {parts.month}</p>
                  </div>
                  <Rosette className="h-10 w-10 shrink-0" color="#4e2810" />
                </div>

                {!sealed ? (
                  <div
                    className="pointer-events-none absolute -bottom-2 -top-2 w-11 -translate-x-1/2 rounded-[45%/10%] border border-[#2a2420]/60 shadow-[6px_0_10px_rgba(0,0,0,0.45)]"
                    style={{
                      left: `${Math.max(6, progress)}%`,
                      backgroundImage:
                        "linear-gradient(90deg, rgba(0,0,0,0.45), rgba(255,255,255,0.35) 35%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.5)), repeating-linear-gradient(90deg, #3f5d8c 0 3px, #2b4672 3px 7px, #6b85b0 7px 8px)",
                      backgroundPosition: `0 0, ${progress * 2.4}px 0`,
                      transition: dragging ? "none" : "left 120ms linear",
                    }}
                  >
                    <span className="absolute -top-1.5 left-1/2 h-2 w-6 -translate-x-1/2 rounded-full bg-[#c9a13b]" />
                    <span className="absolute -bottom-1.5 left-1/2 h-2 w-6 -translate-x-1/2 rounded-full bg-[#c9a13b]" />
                  </div>
                ) : null}
              </div>

              <Cuneiform className="mx-auto h-4 w-[88%] opacity-60" color="#5e3218" offset={5} />
            </div>

            {!open ? (
              <div className="mt-5 flex flex-col items-center gap-2 text-center">
                <p className="font-display text-[15px] text-[#1f3a6b]">
                  {sealed ? "لوح پخته شد… دروازه گشوده می‌شود" : "مهر استوانه‌ای را روی لوح گِلی بغلتان"}
                </p>
                {!sealed ? (
                  <button
                    type="button"
                    onClick={() => setAuto(true)}
                    className="rounded-full border border-[#1f3a6b]/40 px-4 py-1.5 text-[12px] text-[#1f3a6b] transition hover:bg-[#1f3a6b]/5"
                  >
                    مهر را برایم بغلتان
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Revealed content */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-12 px-5 transition-all duration-1000 ease-out ${
              open
                ? "mt-10 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            {/* Decree */}
            <section id="decree" className="scroll-mt-20">
              <div className="relative overflow-hidden rounded-[44%/7%] border-2 border-[#7d6a4c] bg-[linear-gradient(90deg,#c9b48c,#efe2c4_18%,#f5ead2_50%,#efe2c4_82%,#c9b48c)] px-6 py-10 text-center shadow-[0_18px_30px_-16px_rgba(42,36,32,0.7)]">
                <p className="text-[11px] tracking-[0.25em] text-[#9c4a2a]">فرمان پیوند</p>
                <div className="relative mx-auto mt-4 w-[60%]">
                  <div className="overflow-hidden rounded-t-[50%] border-[3px] border-[#c9a13b] p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover} alt="" className="aspect-[3/4] w-full rounded-t-[50%] object-cover sepia-[30%]" />
                  </div>
                </div>
                <p className="mt-5 font-display text-[18px] leading-9 text-[#1f3a6b]">{theme.poeticLine}</p>
                <p className="mt-3 text-[13px] leading-8 text-[#3e3428]">
                  {data.invitationText ||
                    `چنین گویند ${data.partnerOneName} و ${data.partnerTwoName}: به فرخندگی و شادکامی، پیمان زناشویی می‌بندیم و شما را، که گرامی‌ترین یاران مایید، به گواهی این پیمان فرامی‌خوانیم.`}
                </p>
                {families ? <p className="mt-3 text-[12px] text-[#7d6a4c]">به همراه خاندان‌های {families}</p> : null}
                <Cuneiform count={10} className="mx-auto mt-5 h-4 w-[80%] opacity-70" color="#7d6a4c" offset={4} />
              </div>
            </section>

            {/* Three vows */}
            <section className="text-center">
              <p className="text-[11px] tracking-[0.25em] text-[#9c4a2a]">سه پیمان کهن</p>
              <h2 className="mt-1 font-display text-2xl text-[#1f3a6b]">پیمان ما با یکدیگر</h2>
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                {VOWS.map((v, i) => (
                  <div key={v.title} className="flex flex-col items-center rounded-t-full border border-[#7d6a4c]/40 bg-[#f5ead2] px-2 pb-4 pt-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1f3a6b] font-display text-lg text-[#f1dd9a] ring-2 ring-[#c9a13b]">
                      {(i + 1).toLocaleString("fa-IR")}
                    </span>
                    <p className="mt-3 font-display text-[16px] text-[#1f3a6b]">{v.title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-[#5a4c38]">{v.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Date with Avestan month */}
            <section className="relative rounded-2xl border-2 border-[#1f3a6b] bg-[#1f3a6b] p-6 text-center text-[#f5ead2]">
              <div className="absolute inset-x-0 top-0 flex justify-center gap-1 py-1.5 opacity-80" aria-hidden>
                {Array.from({ length: 8 }, (_, i) => (
                  <Rosette key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-4 text-[11px] tracking-[0.25em] text-[#f1dd9a]">روز پیمان</p>
              <p className="mt-2 text-[14px]">{parts.weekday}</p>
              <p className="font-display text-[64px] leading-none text-[#f1dd9a]">{parts.day || "—"}</p>
              <p className="mt-1 font-display text-2xl">
                {parts.month} {parts.year}
              </p>
              {meaning ? (
                <p className="mx-auto mt-3 max-w-[260px] rounded-full border border-[#c9a13b]/50 px-3 py-1.5 text-[12px] text-[#f1dd9a]">
                  «{parts.month}» در زبان اوستایی: {meaning}
                </p>
              ) : null}
              {timeFa ? <p className="mt-3 text-[13px] text-[#f5ead2]/85">{timeFa}</p> : null}
            </section>

            {/* Schedule as relief slabs */}
            <section id="schedule" className="scroll-mt-20">
              <div className="text-center">
                <p className="text-[11px] tracking-[0.25em] text-[#9c4a2a]">آیین جشن</p>
                <h2 className="mt-1 font-display text-2xl text-[#1f3a6b]">برنامه‌ی سور</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {schedule.map((item) => (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="relative flex items-stretch overflow-hidden rounded-md border-2 border-[#7d6a4c]/60 bg-[#e2d3b4] shadow-[inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-3px_0_rgba(125,106,76,0.35)]"
                  >
                    <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-1 bg-[#1f3a6b] text-[#f1dd9a]">
                      <Rosette className="h-5 w-5" />
                      <span className="font-display text-sm">{item.time}</span>
                    </div>
                    <div className="flex-1 p-3.5">
                      <p className="font-display text-[17px] text-[#1f3a6b]">{item.title}</p>
                      <p className="mt-0.5 text-[12px] leading-6 text-[#4a3e2e]">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Countdown */}
            {showCountdown ? (
              <section className="text-center">
                <p className="text-[11px] tracking-[0.25em] text-[#9c4a2a]">تا روز پیمان</p>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="mt-3 [&>div]:rounded-md [&>div]:border-2 [&>div]:border-[#7d6a4c]/60 [&>div]:bg-[#e2d3b4] [&>div]:shadow-[inset_0_-3px_0_rgba(125,106,76,0.35)] [&_p:first-child]:font-display [&_p:first-child]:text-3xl [&_p:first-child]:text-[#1f3a6b] [&_p:last-child]:text-[#9c4a2a]"
                />
              </section>
            ) : null}

            {/* Venue: gate of nations */}
            {showMap ? (
              <section id="location" className="scroll-mt-20 text-center">
                <p className="text-[11px] tracking-[0.25em] text-[#9c4a2a]">دروازه‌ی جشن</p>
                <h2 className="mt-1 font-display text-2xl text-[#1f3a6b]">از این دروازه بگذرید</h2>
                <div className="relative mt-4 flex items-end justify-center gap-3">
                  <Column className="h-44 w-12 shrink-0" />
                  <div className="mb-3 flex-1 rounded-t-[40%] border-2 border-[#7d6a4c]/60 bg-[#f5ead2] px-4 pb-5 pt-7">
                    <MapPin className="mx-auto h-6 w-6 text-[#9c4a2a]" />
                    <p className="mt-2 font-display text-xl leading-tight text-[#1f3a6b]">{data.venueName || "محل جشن"}</p>
                    {data.venueAddress ? (
                      <p className="mt-1 text-[12px] leading-6 text-[#4a3e2e]">{data.venueAddress}</p>
                    ) : null}
                  </div>
                  <Column className="h-44 w-12 shrink-0 -scale-x-100" />
                </div>
                {query ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                      { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                      { href: `https://www.google.com/maps/search/?api=1&query=${query}`, label: "گوگل" },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-md border-2 border-[#1f3a6b]/40 py-2.5 text-xs text-[#1f3a6b] transition hover:bg-[#1f3a6b]/5"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
                {calendarHref ? (
                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-[#1f3a6b] py-2.5 text-xs text-[#f1dd9a] transition hover:bg-[#2a4c86]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Dress code: glazed bricks */}
            <section className="text-center">
              <p className="text-[11px] tracking-[0.25em] text-[#9c4a2a]">رنگ‌های کاخ</p>
              <h2 className="mt-1 font-display text-2xl text-[#1f3a6b]">آجرهای لعابی شوش</h2>
              <p className="mt-2 text-[13px] leading-7 text-[#4a3e2e]">{theme.dressCode}</p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {BRICKS.map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1.5">
                    <div className="grid w-full grid-cols-2 gap-[3px] rounded-sm bg-[#7d6a4c]/50 p-[3px]">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="h-6 rounded-[2px] shadow-[inset_0_2px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(0,0,0,0.25)]"
                          style={{ backgroundColor: b.color }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#2a2420]">{b.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP fire altar */}
            {features?.rsvp !== false ? (
              <section id="rsvp" className="scroll-mt-20 rounded-2xl border-2 border-[#7d6a4c]/50 bg-[#f5ead2] p-6 text-center">
                <p className="text-[11px] tracking-[0.25em] text-[#9c4a2a]">گواهی حضور</p>
                <h2 className="mt-1 font-display text-2xl text-[#1f3a6b]">گواه پیمان ما می‌شوید؟</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "با شادی می‌آیم" },
                    { value: false, label: "دلم با شماست" },
                  ].map(({ value, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setAttending(value);
                        setLit(false);
                      }}
                      className={`rounded-md border-2 py-3 text-[13px] transition ${
                        attending === value
                          ? "border-[#1f3a6b] bg-[#1f3a6b] text-[#f1dd9a]"
                          : "border-[#7d6a4c]/40 text-[#3e3428]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className={`mt-3 flex items-center justify-between rounded-md border-2 border-dashed border-[#7d6a4c]/40 px-4 py-2.5 transition ${attending ? "" : "pointer-events-none opacity-40"}`}>
                  <span className="flex items-center gap-1.5 text-[13px]">
                    <Users className="h-4 w-4 text-[#9c4a2a]" />
                    شمار همراهان
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#1f3a6b]/40 active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-5 font-display text-xl text-[#1f3a6b]">{guests.toLocaleString("fa-IR")}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1f3a6b] text-[#f1dd9a] active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLit(true)}
                  className="mx-auto mt-5 flex flex-col items-center gap-1"
                  aria-label="افروختن آتش و فرستادن پاسخ"
                >
                  <span className="relative h-28 w-24">
                    {lit ? <span className="absolute inset-x-2 top-0 h-16 rounded-full bg-[#ffb347]/40 blur-xl" /> : null}
                    <span className="relative block h-full w-full">
                      <FireAltar lit={lit} />
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 font-display text-[15px] text-[#1f3a6b]">
                    <Flame className="h-4 w-4 text-[#f08a24]" />
                    {lit
                      ? attending
                        ? "آتش افروخته شد؛ چشم به راهتان هستیم"
                        : "آتش به یادتان روشن ماند"
                      : preview
                        ? "آتشدان را بیفروز تا پاسخت برسد"
                        : "با افروختن آتش، پاسخ بده"}
                  </span>
                </button>
              </section>
            ) : null}

            {/* Blessing */}
            <section className="text-center">
              <WingedDisc className="mx-auto h-10 w-28" />
              <p className="mt-3 font-display text-[30px] text-[#9c4a2a]" style={{ animation: "ps-shine 3s ease-in-out infinite" }}>
                شاد زی، دیر زی
              </p>
              <p className="mt-3 font-display text-lg leading-9 text-[#1f3a6b]">{theme.blessingLine}</p>
              <p className="mt-3 text-[12px] text-[#7d6a4c]">♪ {theme.musicTitle}</p>
            </section>

            <button
              type="button"
              onClick={reset}
              className="mx-auto flex items-center gap-1.5 rounded-full border-2 border-[#1f3a6b]/40 px-4 py-2 text-xs text-[#1f3a6b] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              مهر را دوباره بغلتان
            </button>

            <footer className="pb-4 text-center text-[11px] text-[#7d6a4c]">
              {couple} · به یادگار سرزمین آریایی
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t-2 border-[#7d6a4c]/40 bg-[#efe5cf]/95 px-2 backdrop-blur">
          {[
            { href: "#decree", label: "لوح", Icon: ScrollText },
            { href: "#schedule", label: "آیین", Icon: Landmark },
            { href: "#location", label: "دروازه", Icon: MapPin },
            { href: "#rsvp", label: "آتش", Icon: Flame },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (!open) {
                  setProgress(100);
                  setOpen(true);
                }
              }}
              className="flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] text-[#5a4c38] hover:text-[#1f3a6b]"
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
