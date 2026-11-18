"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  CalendarDays,
  Clock3,
  Gem,
  Heart,
  MapPin,
  Music2,
  Navigation,
  RotateCcw,
  Sparkles,
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

const DEFAULT_COVER = "/images/templates/pearl-silk-cover.jpg";

const ROSE = "#c47884";
const CHAMPAGNE = "#d4b896";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "خوش‌آمد مخملی",
    description: "گلاب و گلبرگ دمِ در، موسیقی آرام و نور مرواریدی",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "پیمان دو قلب",
    description: "لحظه‌ای که دست در دست، «بله» را برای همیشه می‌گوییم",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "ضیافت نور",
    description: "شام در نور شمع و حریر، کنار عزیزترین‌ها",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "رقص نخست",
    description: "اولین رقص زیر بارش گلبرگ و درخشش مرواریدها",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#f3d6dc", label: "پودری" },
  { color: "#c47884", label: "رزکوارتز" },
  { color: "#f5ebe0", label: "عاجی" },
  { color: "#d4b896", label: "شامپاینی" },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const PEARLS = (() => {
  const rand = seeded(91402);
  return Array.from({ length: 16 }, () => ({
    left: rand() * 100,
    size: 4 + rand() * 7,
    duration: 10 + rand() * 10,
    delay: -rand() * 16,
    drift: 12 + rand() * 28,
  }));
})();

const SPARKS = (() => {
  const rand = seeded(55021);
  return Array.from({ length: 20 }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 1.5 + rand() * 2.5,
    duration: 2.4 + rand() * 2.8,
    delay: -rand() * 4,
  }));
})();

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

function Pearl({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <span
      className={`inline-block rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#f3e6ef_48%,#c9b0b8)] shadow-[0_2px_6px_rgba(120,80,90,0.25)] ${className}`}
      style={style}
      aria-hidden
    />
  );
}

export function PearlSilkRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = `ps${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [stage, setStage] = useState<"closed" | "unclasp" | "parting" | "open">("closed");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [sent, setSent] = useState(false);
  const timers = useRef<number[]>([]);

  const open = stage === "open";
  const parted = stage === "parting" || stage === "open";

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const openPouch = () => {
    if (stage !== "closed") return;
    setStage("unclasp");
    timers.current.push(
      window.setTimeout(() => setStage("parting"), 700),
      window.setTimeout(() => setStage("open"), 2100),
    );
  };

  const closePouch = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStage("closed");
    setSent(false);
  };

  const forceOpen = () => {
    if (open) return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStage("open");
  };

  const theme: TemplateCustomization = {
    primaryColor: ROSE,
    secondaryColor: CHAMPAGNE,
    backgroundColor: "#f7ece8",
    poeticLine: "«تو را در حریر دل پیچیدم، با مرواریدِ نگاهت گره زدم»",
    dressCode:
      "پوشش رسمی و لطیف؛ پودری، رزکوارتز، عاجی و شامپاینی. لطفاً از لباس کاملاً سفید پرهیز کنید.",
    blessingLine: "حضور شما، درخشان‌ترین مروارید این شب است",
    musicTitle: "والس آرام پیانو و ویولن",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const parts = datePartsOf(data.eventStartAt, data.timezone);
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
  const fullDate = parts.day ? `${parts.weekday}، ${parts.day} ${parts.month} ${parts.year}` : "";

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#5a3d48]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes ps-float { from { transform: translate3d(0,0,0); opacity: 0; } 12% { opacity: 0.9; } 88% { opacity: 0.9; } to { transform: translate3d(var(--drift), -110vh, 0); opacity: 0; } }
        @keyframes ps-twinkle { 0%,100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.25); } }
        @keyframes ps-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.035); } }
        @keyframes ps-shimmer { 0% { transform: translateX(-120%) skewX(-18deg); } 55%,100% { transform: translateX(220%) skewX(-18deg); } }
        @keyframes ps-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ps-softbeat { 0%,100% { transform: scale(1); } 40% { transform: scale(1.08); } 60% { transform: scale(1); } }
        @keyframes ps-pearl-drop { from { transform: translateY(-8px); opacity: 0; } to { transform: translateY(18px); opacity: 0; } 30% { opacity: 1; } }
      `}</style>

      <div
        className="relative mx-auto flex min-h-screen w-full max-w-md flex-col"
        style={{
          backgroundImage:
            "radial-gradient(120% 70% at 50% -10%, #ffe8ec 0%, transparent 55%), radial-gradient(90% 50% at 100% 30%, rgba(212,184,150,0.28), transparent 50%), linear-gradient(180deg, #fff6f2 0%, #f7ece8 45%, #f3e4df 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {SPARKS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                animation: `ps-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
          {(open ? PEARLS : PEARLS.slice(0, 6)).map((p, i) => (
            <span
              key={`p-${i}`}
              className="absolute bottom-[-20px] rounded-full"
              style={
                {
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size,
                  "--drift": `${i % 2 ? p.drift : -p.drift}px`,
                  background: "radial-gradient(circle at 35% 30%, #fff, #f0dde4 55%, #c9aeb6)",
                  boxShadow: "0 2px 8px rgba(160,110,120,0.25)",
                  animation: `ps-float ${p.duration}s linear ${p.delay}s infinite`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#c47884]/15 bg-[#fff8f4]/80 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 font-display text-[15px] text-[#c47884]">
            <Gem className="h-4 w-4" />
            مروارید و حریر
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4b896]/70 bg-white/70 font-display text-[11px] text-[#8a5a66]">
            {monogram}
          </span>
        </header>

        <main className="relative z-10 flex flex-col pb-28">
          <section className="px-6 pt-8 text-center">
            <p className="text-[11px] tracking-[0.35em] text-[#c47884]">✦ دعوتی از جنس حریر ✦</p>
            <h1 className="mt-3 font-display text-[40px] leading-tight text-[#5a3d48]">
              {data.partnerOneName}
              <span className="mx-2 text-[#c47884]">&</span>
              {data.partnerTwoName}
            </h1>
            <p className="mt-2 text-[13px] text-[#8a6570]">گره مروارید را باز کن؛ دلمان برایت نوشته است</p>
          </section>

          {/* Silk pouch */}
          <section className="relative mt-8 flex flex-col items-center px-5">
            <div className="relative h-[300px] w-[250px]">
              <span
                className="pointer-events-none absolute -inset-8 rounded-full bg-[#ffd6de]/35 blur-3xl"
                style={{ animation: parted ? "ps-softbeat 3.2s ease-in-out infinite" : undefined }}
                aria-hidden
              />

              {/* revealed photo card behind silk */}
              <div
                className={`absolute inset-x-4 top-6 bottom-8 overflow-hidden rounded-[28px] bg-white shadow-[0_22px_40px_-18px_rgba(120,70,80,0.45)] transition-all duration-1000 ${
                  parted ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt={couple} className="h-full w-full object-cover object-[50%_20%]" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#5a3d48]/55 via-transparent to-white/10" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-center">
                  <span className="block font-display text-xl text-white">{couple}</span>
                  {fullDate ? <span className="mt-0.5 block text-[11px] text-white/85">{fullDate}</span> : null}
                </span>
                <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                  <span
                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{ animation: parted ? "ps-shimmer 3.8s ease-in-out 0.6s infinite" : undefined }}
                  />
                </span>
              </div>

              {/* left silk */}
              <div
                className="absolute inset-y-0 left-0 w-1/2 origin-left overflow-hidden rounded-l-[32px] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: parted ? "translateX(-108%)" : "translateX(0)" }}
                aria-hidden
              >
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      "linear-gradient(120deg, #f7d4db 0%, #efc0c9 35%, #e8b4bc 60%, #d89aa6 100%)",
                    boxShadow: "inset -10px 0 24px rgba(255,255,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.25)",
                  }}
                />
                <span className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#fff8f4]/35 to-transparent" />
              </div>

              {/* right silk */}
              <div
                className="absolute inset-y-0 right-0 w-1/2 origin-right overflow-hidden rounded-r-[32px] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: parted ? "translateX(108%)" : "translateX(0)" }}
                aria-hidden
              >
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      "linear-gradient(240deg, #f7d4db 0%, #efc0c9 35%, #e8b4bc 60%, #d89aa6 100%)",
                    boxShadow: "inset 10px 0 24px rgba(255,255,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.25)",
                  }}
                />
                <span className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#fff8f4]/35 to-transparent" />
              </div>

              {/* pearl clasp */}
              <button
                type="button"
                onClick={openPouch}
                disabled={stage !== "closed"}
                aria-label="باز کردن قفل مرواریدی"
                className={`absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-700 ${
                  parted ? "pointer-events-none scale-75 opacity-0" : "opacity-100"
                }`}
                style={{ animation: stage === "closed" ? "ps-breathe 3.4s ease-in-out infinite" : undefined }}
              >
                <span className="mb-1 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Pearl
                      key={i}
                      className="h-3.5 w-3.5"
                      style={{
                        transform: stage === "unclasp" ? `translateY(${8 + i * 6}px)` : undefined,
                        opacity: stage === "unclasp" ? 0 : 1,
                        transition: `transform 0.6s ease ${i * 40}ms, opacity 0.5s ease ${i * 40}ms`,
                      }}
                    />
                  ))}
                </span>
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#d4b896]/80 bg-[radial-gradient(circle_at_35%_30%,#fff,#f6e7ea_50%,#e4c4cb)] shadow-[0_12px_28px_-8px_rgba(140,80,90,0.55),inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <span className="absolute inset-[5px] rounded-full border border-dashed border-[#d4b896]/55" />
                  <Gem className={`h-6 w-6 text-[#c47884] transition-transform duration-700 ${stage === "unclasp" ? "rotate-45 scale-90" : ""}`} />
                </span>
                <span className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Pearl
                      key={i}
                      className="h-3.5 w-3.5"
                      style={{
                        transform: stage === "unclasp" ? `translateY(${8 + i * 6}px)` : undefined,
                        opacity: stage === "unclasp" ? 0 : 1,
                        transition: `transform 0.6s ease ${i * 40}ms, opacity 0.5s ease ${i * 40}ms`,
                      }}
                    />
                  ))}
                </span>
              </button>

              {!parted ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                  <div className="mt-28 text-center">
                    <p className="font-display text-[22px] text-[#fff8f4] drop-shadow-[0_2px_8px_rgba(120,60,70,0.45)]">
                      {couple}
                    </p>
                    <p className="mt-1 text-[11px] tracking-[0.25em] text-white/85">تا همیشه</p>
                  </div>
                </div>
              ) : null}
            </div>

            {!open ? (
              <div className="mt-7 flex flex-col items-center gap-2 text-center">
                {stage === "closed" ? (
                  <button
                    type="button"
                    onClick={openPouch}
                    className="flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f3d6dc,#c47884)] px-6 py-3 text-sm font-bold text-[#fff8f4] shadow-[0_14px_30px_-10px_rgba(196,120,132,0.7)] transition hover:brightness-105 active:scale-95"
                  >
                    <Gem className="h-4 w-4" />
                    گره مروارید را باز کن
                  </button>
                ) : (
                  <p className="font-display text-[15px] text-[#c47884]">
                    {stage === "unclasp" ? "مرواریدها باز شدند…" : "حریر کنار می‌رود…"}
                  </p>
                )}
                {stage === "closed" ? (
                  <p className="text-[11px] text-[#8a6570]">یا روی قفل مرواریدی بزن</p>
                ) : null}
              </div>
            ) : (
              <p className="mt-7 font-display text-[16px] text-[#c47884]" style={{ animation: "ps-rise 0.9s ease-out both" }}>
                قلب‌مان برایت گشوده شد
              </p>
            )}
          </section>

          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-12 px-5 transition-all duration-1000 ease-out ${
              open
                ? "mt-10 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            {/* Letter */}
            <section id="letter" className="scroll-mt-20 text-center">
              <div className="mx-auto flex items-center justify-center gap-2" aria-hidden>
                <span className="h-px w-10 bg-gradient-to-l from-[#c47884]/60 to-transparent" />
                <Pearl className="h-2.5 w-2.5" />
                <Pearl className="h-3.5 w-3.5" />
                <Pearl className="h-2.5 w-2.5" />
                <span className="h-px w-10 bg-gradient-to-r from-[#c47884]/60 to-transparent" />
              </div>
              <p className="mt-5 font-display text-[22px] leading-10 text-[#8a5a66]">{theme.poeticLine}</p>
              <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-8 text-[#6e4a54]">
                {data.invitationText ||
                  "با کمال مهر و افتخار، شما را به جشن پیوندمان دعوت می‌کنیم؛ شبی که بی حضور شما کامل نخواهد شد."}
              </p>
              {families ? <p className="mt-3 text-[12px] text-[#8a6570]">به همراه خانواده‌های {families}</p> : null}
            </section>

            {/* Date jewel */}
            <section className="relative overflow-hidden rounded-[28px] border border-[#d4b896]/35 bg-white/55 p-6 text-center shadow-[0_16px_36px_-22px_rgba(120,70,80,0.45)] backdrop-blur-sm">
              <span className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-[#ffd6de]/40 blur-2xl" aria-hidden />
              <span className="pointer-events-none absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-[#d4b896]/25 blur-2xl" aria-hidden />
              <p className="text-[11px] tracking-[0.3em] text-[#c47884]">حک‌شده با مروارید</p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="text-left">
                  <p className="text-[13px] text-[#8a6570]">{parts.weekday}</p>
                  <p className="font-display text-xl text-[#5a3d48]">{parts.month}</p>
                </div>
                <span className="relative flex h-24 w-24 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#f3d6dc_55%,#e8b4bc)] shadow-[0_10px_24px_-8px_rgba(160,90,100,0.45)]" />
                  <span className="absolute inset-2 rounded-full border border-dashed border-[#d4b896]/60" />
                  <span className="relative font-display text-4xl text-[#8a5a66]">{parts.day || "♥"}</span>
                </span>
                <div className="text-right">
                  <p className="text-[13px] text-[#8a6570]">سال</p>
                  <p className="font-display text-xl text-[#5a3d48]">{parts.year}</p>
                </div>
              </div>
              {timeFa ? (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-[#6e4a54]">
                  <Clock3 className="h-4 w-4 text-[#c47884]" />
                  {timeFa}
                </p>
              ) : null}
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#8a6570]">
                <Music2 className="h-3.5 w-3.5" />
                {theme.musicTitle}
              </p>
            </section>

            {showCountdown ? (
              <section className="text-center">
                <p className="text-[11px] tracking-[0.3em] text-[#c47884]">تا درخشش آن شب</p>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="mt-3 [&>div]:rounded-2xl [&>div]:border-[#d4b896]/35 [&>div]:bg-white/55 [&_p:first-child]:font-display [&_p:first-child]:text-3xl [&_p:first-child]:text-[#c47884] [&_p:last-child]:text-[#8a6570]"
                />
                {calendarHref ? (
                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#c47884]/30 bg-white/50 px-4 py-2 text-xs text-[#8a5a66] transition hover:bg-white/80"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Schedule */}
            <section id="schedule" className="scroll-mt-20">
              <h2 className="text-center font-display text-2xl text-[#8a5a66]">ریسمان شب عشق</h2>
              <ol className="relative mt-6 space-y-4 pr-8">
                <span className="absolute bottom-4 right-[13px] top-4 w-px bg-gradient-to-b from-[#c47884]/0 via-[#c47884]/50 to-[#c47884]/0" aria-hidden />
                {schedule.map((item, i) => (
                  <li key={`${item.time}-${item.title}`} className="relative">
                    <Pearl className="absolute -right-[7px] top-4 h-3.5 w-3.5" />
                    <div className="rounded-[22px] border border-[#d4b896]/25 bg-white/55 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-[17px] text-[#5a3d48]">{item.title}</p>
                        <span className="shrink-0 rounded-full bg-[#f3d6dc]/80 px-2.5 py-0.5 text-[12px] text-[#8a5a66]">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-6 text-[#8a6570]">{item.description}</p>
                    </div>
                    <span className="sr-only">{i + 1}</span>
                  </li>
                ))}
              </ol>
            </section>

            {showMap ? (
              <section
                id="location"
                className="scroll-mt-20 overflow-hidden rounded-[28px] border border-[#d4b896]/30 bg-white/55 p-5 text-center shadow-[0_16px_36px_-22px_rgba(120,70,80,0.4)]"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3d6dc]/80">
                  <MapPin className="h-5 w-5 text-[#c47884]" />
                </span>
                <h2 className="mt-3 font-display text-2xl text-[#5a3d48]">{data.venueName || "محل جشن"}</h2>
                {data.venueAddress ? (
                  <p className="mt-1 text-[12px] leading-6 text-[#8a6570]">{data.venueAddress}</p>
                ) : null}
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
                        className="flex items-center justify-center gap-1 rounded-full border border-[#c47884]/25 bg-white/60 py-2.5 text-xs text-[#5a3d48] transition hover:bg-[#f3d6dc]/50"
                      >
                        <Navigation className="h-3.5 w-3.5 text-[#c47884]" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Dress code */}
            <section className="text-center">
              <h2 className="font-display text-2xl text-[#8a5a66]">پالت مخملی شب</h2>
              <p className="mt-2 text-[13px] leading-7 text-[#8a6570]">{theme.dressCode}</p>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {SWATCHES.map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-2">
                    <span
                      className="h-14 w-14 rounded-full shadow-[0_10px_20px_-10px_rgba(100,60,70,0.45)] ring-2 ring-white"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[11px] text-[#8a6570]">{s.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP */}
            {features?.rsvp !== false ? (
              <section
                id="rsvp"
                className="scroll-mt-20 rounded-[28px] border border-[#c47884]/25 bg-[linear-gradient(165deg,rgba(243,214,220,0.55),rgba(255,255,255,0.55))] p-6 text-center shadow-[0_16px_36px_-22px_rgba(120,70,80,0.4)]"
              >
                <h2 className="font-display text-2xl text-[#8a5a66]">مروارید حضورت را بنشان</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "با مهر می‌آیم" },
                    { value: false, label: "دلم با شماست" },
                  ].map(({ value, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setAttending(value);
                        setSent(false);
                      }}
                      className={`rounded-full py-3 text-[13px] transition ${
                        attending === value
                          ? "bg-[linear-gradient(135deg,#f3d6dc,#c47884)] font-bold text-white"
                          : "border border-[#c47884]/30 bg-white/50 text-[#6e4a54]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  className={`mt-3 flex items-center justify-between rounded-full border border-[#c47884]/20 bg-white/60 px-5 py-2.5 transition ${
                    attending ? "" : "pointer-events-none opacity-40"
                  }`}
                >
                  <span className="text-[13px] text-[#6e4a54]">تعداد همراهان</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c47884]/35 active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-5 font-display text-xl text-[#c47884]">{guests.toLocaleString("fa-IR")}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c47884] text-white active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(true)}
                  className="mx-auto mt-6 flex flex-col items-center gap-2"
                  aria-label="ارسال پاسخ"
                >
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${
                      sent
                        ? "bg-[linear-gradient(135deg,#f3d6dc,#c47884)] text-white shadow-[0_0_0_10px_rgba(232,180,188,0.25)]"
                        : "border border-[#c47884]/35 bg-white/70 text-[#c47884]"
                    }`}
                    style={{ animation: sent ? "ps-softbeat 1.8s ease-in-out infinite" : undefined }}
                  >
                    {sent ? <Heart className="h-8 w-8 fill-current" /> : <Gem className="h-8 w-8" />}
                  </span>
                  <span className="font-display text-[15px] text-[#5a3d48]">
                    {sent
                      ? attending
                        ? "نشست؛ جایت کنار مرواریدهای ماست ♥"
                        : "دلت را نگه داشتیم؛ جایت خالی می‌ماند"
                      : preview
                        ? "لمس کن تا ثبت شود"
                        : "ثبت کن و بفرست"}
                  </span>
                </button>
              </section>
            ) : null}

            <section className="text-center">
              <Sparkles className="mx-auto h-5 w-5 text-[#c47884]" />
              <p className="mt-3 font-display text-xl leading-9 text-[#8a5a66]">{theme.blessingLine}</p>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[#8a6570]">
                <Heart className="h-3.5 w-3.5 fill-[#c47884] text-[#c47884]" />
                {couple}
              </p>
            </section>

            <button
              type="button"
              onClick={closePouch}
              className="mx-auto flex items-center gap-1.5 rounded-full border border-[#c47884]/35 bg-white/60 px-4 py-2 text-xs text-[#8a5a66] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              بستن حریر
            </button>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#c47884]/15 bg-[#fff8f4]/92 px-2 backdrop-blur">
          {[
            { href: "#letter", label: "نامه", Icon: Gem },
            { href: "#schedule", label: "برنامه", Icon: Clock3 },
            { href: "#location", label: "مکان", Icon: MapPin },
            { href: "#rsvp", label: "حضور", Icon: Heart },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => forceOpen()}
              className="flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] text-[#8a6570] hover:text-[#c47884]"
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          ))}
        </nav>

        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <linearGradient id={`${uid}-silk`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f7d4db" />
              <stop offset="1" stopColor="#d89aa6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
