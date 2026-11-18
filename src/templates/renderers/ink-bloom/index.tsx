"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Clock3,
  Fingerprint,
  MapPin,
  Navigation,
  RotateCcw,
} from "lucide-react";
import { Countdown } from "@/templates/shared/countdown";
import {
  coupleLabel,
  formatEventTimeRange,
  googleCalendarUrl,
} from "@/templates/shared/format";
import type {
  TemplateCustomization,
  TemplateRendererProps,
  TemplateScheduleItem,
} from "@/templates/types";

const DEFAULT_COVER = "/images/templates/ink-bloom-cover.jpg";

const INK = "#1a2744";
const ROSE_INK = "#8b3a4a";
const PAPER = "#f3efe6";
const GOLD = "#b89a5a";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "قطرهٔ اول",
    description: "خوش‌آمد با عطر مرکبات و نور ملایم روی آب",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "شکوفایی",
    description: "لحظهٔ پیمان؛ وقتی دو جوهر یکی می‌شوند",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "سفرهٔ نور",
    description: "شام کنار حوض و شمع‌های شناور",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "موجِ آخر",
    description: "رقص آرام تا وقتی جوهرِ شب خشک شود",
    icon: "music",
  },
];

const INK_SWATCHES = [
  { color: "#1a2744", label: "لاجورد" },
  { color: "#8b3a4a", label: "شرابی" },
  { color: "#3d5a45", label: "زیتونی" },
  { color: "#b89a5a", label: "طلایی" },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const BLOBS = (() => {
  const rand = seeded(88011);
  return Array.from({ length: 9 }, (_, i) => ({
    x: 20 + rand() * 60,
    y: 25 + rand() * 45,
    r: 28 + rand() * 55,
    delay: i * 0.08,
    color: i % 3 === 0 ? ROSE_INK : INK,
    opacity: 0.18 + rand() * 0.28,
  }));
})();

const RIPPLES = (() => {
  const rand = seeded(4412);
  return Array.from({ length: 5 }, () => ({
    left: 10 + rand() * 80,
    top: 15 + rand() * 70,
    delay: -rand() * 6,
    dur: 5 + rand() * 4,
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

function PaperStrip({
  id,
  tilt,
  children,
  delay = 0,
  show,
}: {
  id?: string;
  tilt: number;
  children: ReactNode;
  delay?: number;
  show: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 rounded-[3px] px-5 py-6 shadow-[0_18px_40px_-24px_rgba(26,39,68,0.55)] transition-all duration-1000 ${
        show ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
      style={{
        backgroundColor: PAPER,
        transform: show ? `rotate(${tilt}deg)` : `rotate(${tilt}deg) translateY(40px)`,
        transitionDelay: show ? `${delay}ms` : "0ms",
        backgroundImage:
          "linear-gradient(180deg, rgba(26,39,68,0.03), transparent 30%), radial-gradient(circle at 92% 8%, rgba(184,154,90,0.12), transparent 40%)",
      }}
    >
      <span
        className="pointer-events-none absolute -left-1 top-6 h-8 w-3 rounded-sm opacity-80"
        style={{
          background: `linear-gradient(90deg, ${INK}, ${ROSE_INK})`,
          clipPath: "polygon(0 0, 100% 15%, 100% 85%, 0 100%)",
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-x-4 top-0 h-px opacity-30"
        style={{ backgroundColor: INK }}
        aria-hidden
      />
      {children}
    </section>
  );
}

export function InkBloomRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = `ib${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [stage, setStage] = useState<"still" | "dropping" | "blooming" | "open">("still");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [pressed, setPressed] = useState(false);
  const [printDone, setPrintDone] = useState(false);
  const pressTimer = useRef<number | null>(null);
  const timers = useRef<number[]>([]);

  const open = stage === "open";
  const blooming = stage === "blooming" || stage === "open";
  const dropping = stage === "dropping" || blooming;

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
      if (pressTimer.current) window.clearTimeout(pressTimer.current);
    };
  }, []);

  const dropInk = () => {
    if (stage !== "still") return;
    setStage("dropping");
    timers.current.push(
      window.setTimeout(() => setStage("blooming"), 700),
      window.setTimeout(() => setStage("open"), 2600),
    );
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStage("still");
    setPrintDone(false);
    setPressed(false);
  };

  const forceOpen = () => {
    if (open) return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStage("open");
  };

  const startPress = () => {
    if (printDone) return;
    setPressed(true);
    pressTimer.current = window.setTimeout(() => {
      setPrintDone(true);
      setPressed(false);
    }, 1100);
  };

  const endPress = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (!printDone) setPressed(false);
  };

  const theme: TemplateCustomization = {
    primaryColor: INK,
    secondaryColor: ROSE_INK,
    backgroundColor: "#d9e2ea",
    poeticLine: "«دو قطره که در یک حوض افتادند و دیگر از هم جدا نشدند»",
    dressCode:
      "پوشش آزادِ شاعرانه؛ لاجورد، شرابی جوهر، زیتونی مرکب و طلایی کهنه. سفید مطلق نپوشید.",
    blessingLine: "اثر انگشت حضورتان، زیباترین لکهٔ این کاغذ است",
    musicTitle: "صدای آب و پیانو",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
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
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: theme.backgroundColor, color: INK }}
    >
      <style>{`
        @keyframes ib-ripple {
          0% { transform: scale(0.2); opacity: 0.45; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes ib-drop {
          0% { transform: translateY(-80px) scale(0.6); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes ib-bloom {
          0% { transform: scale(0.1); opacity: 0; }
          40% { opacity: 0.85; }
          100% { transform: scale(1); opacity: 0.55; }
        }
        @keyframes ib-fadeup {
          from { opacity: 0; transform: translateY(24px) rotate(var(--tilt, 0deg)); }
          to { opacity: 1; transform: translateY(0) rotate(var(--tilt, 0deg)); }
        }
        @keyframes ib-float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes ib-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes ib-press {
          0% { transform: scale(1); }
          100% { transform: scale(0.92); filter: brightness(0.9); }
        }
      `}</style>

      {/* water plane */}
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-md flex-col"
        style={{
          backgroundImage: `
            radial-gradient(120% 80% at 50% 0%, #eef3f7 0%, transparent 55%),
            radial-gradient(80% 50% at 20% 80%, rgba(26,39,68,0.08), transparent 50%),
            radial-gradient(70% 40% at 90% 30%, rgba(139,58,74,0.08), transparent 45%),
            linear-gradient(180deg, #e7eef4 0%, #d5dee8 48%, #c8d3df 100%)
          `,
        }}
      >
        {/* ambient ripples always */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {RIPPLES.map((r, i) => (
            <span
              key={i}
              className="absolute rounded-full border"
              style={{
                left: `${r.left}%`,
                top: `${r.top}%`,
                width: 70,
                height: 70,
                borderColor: "rgba(26,39,68,0.12)",
                animation: `ib-ripple ${r.dur}s ease-out ${r.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* no classic header — just a floating ink mark */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-5">
          <span
            className="rounded-full px-3 py-1 text-[10px] tracking-[0.28em]"
            style={{
              backgroundColor: "rgba(243,239,230,0.7)",
              color: ROSE_INK,
              border: "1px solid rgba(26,39,68,0.08)",
            }}
          >
            شکوفایی جوهر
          </span>
          {open ? (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 rounded-full bg-white/50 px-2.5 py-1 text-[10px] text-[#1a2744]/70 backdrop-blur"
            >
              <RotateCcw className="h-3 w-3" />
              از نو
            </button>
          ) : (
            <span className="text-[10px] text-[#1a2744]/45">قطره به حوض</span>
          )}
        </div>

        <main className="relative z-10 flex flex-1 flex-col pb-16">
          {/* THE POOL */}
          <section className="relative mt-4 flex flex-col items-center px-4">
            <button
              type="button"
              onClick={dropInk}
              disabled={stage !== "still"}
              aria-label="چکاندن قطره جوهر"
              className="relative h-[360px] w-full max-w-[320px] overflow-hidden rounded-[42%_42%_46%_46%/38%_38%_52%_52%] border border-white/40 shadow-[inset_0_-30px_60px_rgba(26,39,68,0.12),0_30px_60px_-28px_rgba(26,39,68,0.45)] disabled:cursor-default"
              style={{
                background:
                  "radial-gradient(circle at 40% 30%, rgba(255,255,255,0.55), rgba(220,230,238,0.35) 45%, rgba(180,198,214,0.5))",
              }}
            >
              {/* water sheen */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.45) 48%, transparent 62%)",
                  backgroundSize: "200% 100%",
                  animation: "ib-shimmer 7s linear infinite",
                }}
                aria-hidden
              />

              {/* ink drops */}
              {dropping ? (
                <span className="pointer-events-none absolute left-1/2 top-[18%] -ml-2 h-4 w-4 rounded-full" style={{ backgroundColor: INK, animation: "ib-drop 0.7s ease-in both" }} aria-hidden />
              ) : null}
              {dropping ? (
                <span className="pointer-events-none absolute left-[42%] top-[12%] h-3 w-3 rounded-full" style={{ backgroundColor: ROSE_INK, animation: "ib-drop 0.75s ease-in 0.12s both" }} aria-hidden />
              ) : null}

              {/* bloom blobs */}
              <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <filter id={`${uid}-soft`}>
                    <feGaussianBlur stdDeviation="2.2" />
                  </filter>
                </defs>
                {blooming
                  ? BLOBS.map((b, i) => (
                      <circle
                        key={i}
                        cx={b.x}
                        cy={b.y}
                        r={b.r}
                        fill={b.color}
                        opacity={b.opacity}
                        filter={`url(#${uid}-soft)`}
                        style={{
                          transformOrigin: `${b.x}px ${b.y}px`,
                          animation: `ib-bloom 1.6s ease-out ${b.delay}s both`,
                        }}
                      />
                    ))
                  : null}
              </svg>

              {/* revealed photo inside bloom */}
              <div
                className={`absolute inset-[18%] overflow-hidden rounded-full transition-all duration-[1400ms] ${
                  blooming ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
                style={{ transitionDelay: blooming ? "700ms" : "0ms" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={couple}
                  className="h-full w-full object-cover object-[50%_20%]"
                  style={{
                    filter: blooming ? "contrast(1.05) saturate(0.9)" : undefined,
                    mixBlendMode: "multiply",
                    opacity: 0.92,
                  }}
                />
                <span className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(26,39,68,0.35)_100%)]" />
              </div>

              {/* names crystallizing from ink */}
              <div
                aria-hidden={!blooming}
                className={`absolute inset-x-6 bottom-[14%] text-center transition-all duration-1000 ${
                  blooming ? "translate-y-0 opacity-100" : "invisible translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: blooming ? "1100ms" : "0ms" }}
              >
                <p
                  className="font-display text-[28px] leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
                  style={{ animation: blooming ? "ib-float 5s ease-in-out infinite" : undefined }}
                >
                  {data.partnerOneName}
                  <span className="mx-2 text-[#f0d9a8]">·</span>
                  {data.partnerTwoName}
                </p>
              </div>

              {!dropping ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[#1a2744]/20 bg-white/40 backdrop-blur"
                    style={{ animation: "ib-float 3.2s ease-in-out infinite" }}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: INK }} />
                  </span>
                  <p className="font-display text-[18px] text-[#1a2744]/80">یک قطره بچکان</p>
                  <p className="mt-1 text-[11px] text-[#1a2744]/45">تا جوهر شکوفا شود</p>
                </div>
              ) : null}

              {stage === "dropping" || stage === "blooming" ? (
                <p className="absolute inset-x-0 bottom-8 text-center font-display text-[14px] text-white/90">
                  {stage === "dropping" ? "افتاد…" : "در حال شکوفایی…"}
                </p>
              ) : null}
            </button>

            {open ? (
              <p
                className="mt-6 max-w-[260px] text-center font-display text-[17px] leading-8 text-[#1a2744]/75"
                style={{ animation: "ib-fadeup 0.9s ease-out both" }}
              >
                {theme.poeticLine}
              </p>
            ) : null}
          </section>

          {/* floating paper strips — only after bloom */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`mx-auto flex w-full max-w-[340px] flex-col gap-8 px-4 ${
              open ? "mt-10" : "invisible pointer-events-none max-h-0 overflow-hidden"
            }`}
          >
            <PaperStrip id="letter" tilt={-1.2} show={open} delay={80}>
              <p className="text-[11px] tracking-[0.3em]" style={{ color: ROSE_INK }}>
                روی کاغذ خیس نوشته شد
              </p>
              <p className="mt-3 text-[14px] leading-8" style={{ color: INK }}>
                {data.invitationText ||
                  "با کمال مهر و افتخار شما را به جشن پیوندمان دعوت می‌کنیم؛ شبی که جوهرش تا همیشه خشک نمی‌شود."}
              </p>
              {families ? (
                <p className="mt-2 text-[12px] leading-7 text-[#1a2744]/65">
                  به همراه خانواده‌های {families}
                </p>
              ) : null}
              <p className="mt-4 text-left font-display text-[16px]" style={{ color: ROSE_INK }}>
                — {couple}
              </p>
            </PaperStrip>

            <PaperStrip tilt={1.1} show={open} delay={180}>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.25em]" style={{ color: GOLD }}>
                    تاریخِ مرکب
                  </p>
                  <p className="mt-1 font-display text-[26px] leading-none">{parts.day || "—"}</p>
                  <p className="mt-1 text-[13px]">
                    {parts.month} {parts.year}
                  </p>
                  <p className="text-[12px] text-[#1a2744]/60">{parts.weekday}</p>
                </div>
                <div className="text-left text-[12px] leading-6 text-[#1a2744]/70">
                  {timeFa ? (
                    <p className="flex items-center justify-end gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {timeFa}
                    </p>
                  ) : null}
                  {fullDate ? <p className="mt-1 max-w-[140px]">{fullDate}</p> : null}
                </div>
              </div>
              {showCountdown ? (
                <div className="mt-5 border-t border-dashed border-[#1a2744]/20 pt-4">
                  <p className="mb-2 text-center text-[11px]" style={{ color: ROSE_INK }}>
                    تا خشک شدنِ این شب
                  </p>
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-none [&>div]:border [&>div]:border-[#1a2744]/15 [&>div]:bg-[#1a2744]/[0.03] [&_p:first-child]:font-display [&_p:first-child]:text-2xl [&_p:first-child]:text-[#1a2744] [&_p:last-child]:text-[#8b3a4a]"
                  />
                </div>
              ) : null}
              {calendarHref ? (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 border-b border-[#1a2744]/30 pb-0.5 text-[12px]"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  علامت روی تقویم
                </a>
              ) : null}
            </PaperStrip>

            <PaperStrip id="schedule" tilt={-0.7} show={open} delay={280}>
              <p className="text-[11px] tracking-[0.3em]" style={{ color: ROSE_INK }}>
                چهار موج
              </p>
              <ol className="mt-3 space-y-3">
                {schedule.map((item, i) => (
                  <li key={`${item.time}-${item.title}`} className="flex gap-3">
                    <span
                      className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] text-white"
                      style={{ backgroundColor: i % 2 ? ROSE_INK : INK }}
                    >
                      {(i + 1).toLocaleString("fa-IR")}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <p className="font-display text-[17px]">{item.title}</p>
                        <span className="text-[11px] text-[#1a2744]/55">{item.time}</span>
                      </div>
                      <p className="text-[12px] leading-6 text-[#1a2744]/65">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </PaperStrip>

            {showMap ? (
              <PaperStrip id="location" tilt={0.9} show={open} delay={380}>
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${INK}14`, color: INK }}
                  >
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] tracking-[0.25em]" style={{ color: GOLD }}>
                      ساحلِ جشن
                    </p>
                    <h2 className="font-display text-[22px]">{data.venueName || "محل جشن"}</h2>
                    {data.venueAddress ? (
                      <p className="mt-1 text-[12px] leading-6 text-[#1a2744]/65">{data.venueAddress}</p>
                    ) : null}
                  </div>
                </div>
                {query ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                      { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                      {
                        href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                        label: "گوگل",
                      },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 border border-[#1a2744]/15 py-2 text-[11px] transition hover:bg-[#1a2744]/5"
                      >
                        <Navigation className="h-3 w-3" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </PaperStrip>
            ) : null}

            <PaperStrip tilt={-1} show={open} delay={480}>
              <p className="text-[11px] tracking-[0.3em]" style={{ color: ROSE_INK }}>
                جوهرهای پوشش
              </p>
              <p className="mt-2 text-[12.5px] leading-7 text-[#1a2744]/70">{theme.dressCode}</p>
              <div className="mt-4 flex justify-center gap-4">
                {INK_SWATCHES.map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-1.5">
                    <span
                      className="h-11 w-11 rounded-[40%_60%_55%_45%/45%_40%_60%_55%] shadow-md"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[10px] text-[#1a2744]/65">{s.label}</span>
                  </div>
                ))}
              </div>
            </PaperStrip>

            {features?.rsvp !== false ? (
              <PaperStrip id="rsvp" tilt={1.3} show={open} delay={580}>
                <p className="text-[11px] tracking-[0.3em]" style={{ color: ROSE_INK }}>
                  اثرِ انگشتِ حضور
                </p>
                <p className="mt-2 font-display text-[20px]">انگشتت را روی جوهر بگذار</p>

                {printDone ? (
                  <div className="mt-5 text-center" style={{ animation: "ib-fadeup 0.6s ease-out both" }}>
                    <span
                      className="mx-auto flex h-20 w-16 items-center justify-center rounded-[40%_60%_70%_30%/40%_50%_50%_60%] text-white"
                      style={{
                        backgroundColor: attending ? INK : ROSE_INK,
                        boxShadow: "0 10px 24px -10px rgba(26,39,68,0.55)",
                      }}
                    >
                      <Fingerprint className="h-8 w-8 opacity-80" />
                    </span>
                    <p className="mt-3 font-display text-[17px]">
                      {attending
                        ? "نقش بست؛ منتظرتان کنار حوضیم"
                        : "نقشِ دلتان ماند؛ جایتان خالی"}
                    </p>
                    <p className="mt-1 text-[12px] text-[#1a2744]/60">
                      {attending
                        ? `${guests.toLocaleString("fa-IR")} نفر`
                        : "این بار نمی‌رسیم"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPrintDone(false)}
                      className="mt-3 text-[11px] underline decoration-dashed"
                    >
                      پاک کردن و دوباره
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {[
                        { value: true, label: "می‌آیم" },
                        { value: false, label: "نمی‌رسم" },
                      ].map(({ value, label }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAttending(value)}
                          className="py-2.5 text-[13px] transition"
                          style={{
                            backgroundColor: attending === value ? INK : "transparent",
                            color: attending === value ? PAPER : INK,
                            border: `1px solid ${INK}33`,
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div
                      className={`mt-3 flex items-center justify-between border border-dashed border-[#1a2744]/20 px-3 py-2 ${
                        attending ? "" : "pointer-events-none opacity-40"
                      }`}
                    >
                      <span className="text-[12px]">چند نفر؟</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          className="flex h-7 w-7 items-center justify-center border border-[#1a2744]/25"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-display text-lg">
                          {guests.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.min(8, g + 1))}
                          className="flex h-7 w-7 items-center justify-center text-white"
                          style={{ backgroundColor: INK }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onPointerDown={startPress}
                      onPointerUp={endPress}
                      onPointerLeave={endPress}
                      onPointerCancel={endPress}
                      className="mx-auto mt-6 flex flex-col items-center gap-2"
                      aria-label="نگه داشتن برای ثبت اثر انگشت"
                    >
                      <span
                        className="relative flex h-24 w-20 items-center justify-center rounded-[40%_60%_70%_30%/40%_50%_50%_60%] border-2 border-dashed"
                        style={{
                          borderColor: `${INK}55`,
                          backgroundColor: pressed ? `${INK}22` : `${INK}08`,
                          animation: pressed ? "ib-press 1.1s ease-out forwards" : undefined,
                        }}
                      >
                        <Fingerprint
                          className="h-10 w-10 transition-colors"
                          style={{ color: pressed ? INK : `${INK}88` }}
                        />
                        {pressed ? (
                          <span
                            className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_50%_60%]"
                            style={{
                              background: `radial-gradient(circle, ${INK}55, transparent 70%)`,
                            }}
                          />
                        ) : null}
                      </span>
                      <span className="text-[12px] text-[#1a2744]/65">
                        {preview ? "نگه دار تا نقش ببندد" : "نگه دار تا اثر انگشتت بماند"}
                      </span>
                    </button>
                  </>
                )}
              </PaperStrip>
            ) : null}

            <div className="pb-8 text-center">
              <p className="font-display text-[18px] leading-8 text-[#1a2744]/80">
                {theme.blessingLine}
              </p>
              <p className="mt-2 text-[11px] tracking-[0.2em] text-[#1a2744]/45">{couple}</p>
            </div>
          </div>
        </main>

        {/* side ink bookmarks instead of classic bottom nav */}
        {open ? (
          <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-white/50 bg-[#f3efe6]/85 p-1 shadow-[0_12px_30px_-12px_rgba(26,39,68,0.45)] backdrop-blur">
            {[
              { href: "#letter", label: "کاغذ" },
              { href: "#schedule", label: "موج" },
              { href: "#location", label: "ساحل" },
              { href: "#rsvp", label: "اثر" },
            ].map((item) => (
              <a
                key={item.label}
                href={preview ? undefined : item.href}
                onClick={() => forceOpen()}
                className="rounded-full px-3.5 py-2 text-[11px] text-[#1a2744]/75 transition hover:bg-[#1a2744]/8 hover:text-[#f3efe6]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
