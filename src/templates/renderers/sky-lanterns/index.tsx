"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowDown,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coffee,
  Feather,
  Flame,
  Heart,
  MapPin,
  Music2,
  Navigation,
  RotateCcw,
  Sparkles,
  Star,
  Utensils,
  XCircle,
} from "lucide-react";
import { Countdown } from "@/templates/shared/countdown";
import {
  coupleLabel,
  coupleMonogram,
  formatEventDay,
  formatEventTimeRange,
  googleCalendarUrl,
} from "@/templates/shared/format";
import type {
  TemplateCustomization,
  TemplateRendererProps,
  TemplateScheduleItem,
} from "@/templates/types";

const DEFAULT_COVER = "/images/templates/sky-lanterns-cover.jpg";

const AMBER = "#ffb347";
const INDIGO = "#101a3c";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۳۰",
    title: "آغازِ شبِ فانوس",
    description: "پذیرایی روی بام، با چای و شربت و نسیمِ غروب",
    icon: "cafe",
  },
  {
    time: "۲۰:۰۰",
    title: "سفره‌ی عقد",
    description: "پیمانِ پیوند، روی بامِ شهر و زیر چشمکِ ستاره‌ها",
    icon: "heart",
  },
  {
    time: "۲۱:۳۰",
    title: "ضیافتِ شبانه",
    description: "شام با چشم‌اندازِ شهرِ روشن",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "رهاییِ هزار فانوس",
    description: "رویایی‌ترین لحظه‌ی شب؛ رها کردنِ فانوس‌ها در آسمان",
    icon: "music",
  },
];

const PALETTE = [
  { color: "#101a3c", label: "لاجوردی" },
  { color: "#ffb347", label: "کهربایی" },
  { color: "#ff8f5e", label: "مرجانی" },
  { color: "#f5ead6", label: "کرم" },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** فانوس‌های شناور آسمان — سه لایه با عمق‌های متفاوت */
const FLOATERS = (() => {
  const rand = seeded(8841);
  return Array.from({ length: 15 }, (_, i) => ({
    left: 3 + rand() * 92,
    scale: [0.42, 0.62, 0.85][i % 3],
    duration: 15 + rand() * 14,
    delay: -rand() * 28,
    sway: 5 + rand() * 7,
    coral: rand() > 0.55,
    top: i % 3 === 0 ? 8 + rand() * 20 : 52 + rand() * 40,
  }));
})();

/** ستاره‌های آرام */
const STARS = (() => {
  const rand = seeded(3307);
  return Array.from({ length: 22, }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 1.4 + rand() * 2,
    duration: 2.6 + rand() * 3.4,
    delay: -rand() * 6,
    bright: rand() > 0.62,
  }));
})();

function scheduleIcon(icon?: TemplateScheduleItem["icon"]) {
  switch (icon) {
    case "heart":
      return Heart;
    case "dining":
      return Utensils;
    case "music":
      return Music2;
    case "cafe":
    default:
      return Coffee;
  }
}

function mapsLinks(query: string) {
  const q = encodeURIComponent(query);
  return {
    neshan: `https://neshan.org/maps/search/${q}`,
    balad: `https://balad.ir/search?query=${q}`,
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
}

/** بدنه‌ی فانوسِ آسمانی — کاغذی با چهارپایه‌ی چوبی و شعله‌ی درون */
function LanternBody({
  uid,
  lit,
  coral = false,
  monogram,
}: {
  uid: string;
  lit: boolean;
  coral?: boolean;
  monogram?: string;
}) {
  const body1 = coral ? "#ff9d6e" : "#ffc169";
  const body2 = coral ? "#e2683f" : "#e08b2e";
  return (
    <svg viewBox="0 0 100 150" aria-hidden className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={body1} />
          <stop offset="0.55" stopColor={coral ? "#f5854f" : "#ffae4d"} />
          <stop offset="1" stopColor={body2} />
        </linearGradient>
        <linearGradient id={`${uid}-bamboo`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a2e22" />
          <stop offset="0.5" stopColor="#7a4c34" />
          <stop offset="1" stopColor="#4a2e22" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffdca3" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#ffbe6e" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffbe6e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-flame`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset="0.5" stopColor="#ffc85e" />
          <stop offset="1" stopColor="#f2842e" />
        </linearGradient>
      </defs>

      {/* هاله‌ی نور */}
      <ellipse
        cx="50"
        cy="72"
        rx="52"
        ry="56"
        fill={`url(#${uid}-glow)`}
        style={{
          opacity: lit ? 1 : 0,
          transition: "opacity 900ms ease",
        }}
      />

      {/* قلاب و بند */}
      <line x1="50" y1="0" x2="50" y2="14" stroke="#8a6f4d" strokeWidth="1.6" />
      <circle cx="50" cy="2" r="3" fill="none" stroke="#8a6f4d" strokeWidth="1.4" />

      {/* کلاهکِ چوبی */}
      <path d="M28 22 h44 l-7 -9 h-30 z" fill={`url(#${uid}-bamboo)`} />
      <rect x="27" y="21" width="46" height="4" rx="2" fill="#5d3b28" />

      {/* بدنه‌ی کاغذی */}
      <path
        d="M27 25 C27 40 14 58 14 76 C14 96 30 110 50 110 C70 110 86 96 86 76 C86 58 73 40 73 25 Z"
        fill={`url(#${uid}-paper)`}
        opacity={lit ? 1 : 0.34}
        style={{ transition: "opacity 900ms ease" }}
      />
      {/* تیرهای کاغذ */}
      <path d="M27 25 C27 40 14 58 14 76 C14 96 30 110 50 110" fill="none" stroke="#b06a2f" strokeWidth="0.8" opacity="0.5" />
      <path d="M73 25 C73 40 86 58 86 76 C86 96 70 110 50 110" fill="none" stroke="#b06a2f" strokeWidth="0.8" opacity="0.5" />
      <path d="M50 25 C50 45 38 62 38 76 C38 94 42 104 50 110" fill="none" stroke="#b06a2f" strokeWidth="0.7" opacity="0.35" />
      <path d="M50 25 C50 45 62 62 62 76 C62 94 58 104 50 110" fill="none" stroke="#b06a2f" strokeWidth="0.7" opacity="0.35" />

      {/* شعله‌ی درون */}
      {lit ? (
        <g className="sl-flicker" style={{ transformOrigin: "50px 92px", transformBox: "view-box" }}>
          <path
            d="M50 84 C56 92 54 100 50 102 C46 100 44 92 50 84 Z"
            fill={`url(#${uid}-flame)`}
          />
          <ellipse cx="50" cy="92" rx="14" ry="10" fill="#ffe9b8" opacity="0.35" />
        </g>
      ) : (
        <line x1="50" y1="88" x2="50" y2="96" stroke="#7a6a58" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* حلقه‌ی پایین */}
      <path d="M36 110 h28 l4 6 h-36 z" fill="#5d3b28" />
      <ellipse cx="50" cy="119" rx="17" ry="4" fill={`url(#${uid}-bamboo)`} />

      {/* نشانِ روی فانوس */}
      {monogram ? (
        <text
          x="50"
          y="72"
          textAnchor="middle"
          fill={lit ? "#5c3010" : "#8a6f4d"}
          style={{ fontFamily: "Amiri, serif", fontSize: 22, fontWeight: 700 }}
          opacity="0.85"
        >
          {monogram}
        </text>
      ) : null}
    </svg>
  );
}

export function SkyLanternsRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uidKey = "sl";
  const [phase, setPhase] = useState<"hang" | "lit" | "fly">("hang");
  const lit = phase !== "hang";
  const flown = phase === "fly";

  const theme: TemplateCustomization = {
    primaryColor: "#ffb347",
    secondaryColor: "#101a3c",
    backgroundColor: "#101a3c",
    poeticLine: "«هزار فانوس برمی‌داریم، سوی آسمانِ آرزو»",
    dressCode:
      "پوشش رسمی شب با تمِ شبِ فانوس؛ طیف لاجوردی، کهربایی، مرجانی و کرم. لطفاً از لباس کاملاً سفید پرهیز کنید.",
    blessingLine: "حضور شما، روشن‌ترین فانوسِ این آسمان است",
    musicTitle: "نوای تار و آوازِ شب",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const dayLabel = formatEventDay(data.eventStartAt, data.timezone);
  const timeLabel = formatEventTimeRange(
    data.eventStartAt,
    data.eventEndAt,
    data.timezone,
  );
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
    features?.map !== false &&
    !!(data.venueName || data.venueAddress || data.mapUrl);
  const showMusic = features?.music !== false;
  const locationQuery =
    data.mapUrl ||
    [data.venueName, data.venueAddress].filter(Boolean).join(" ") ||
    "";
  const links = locationQuery ? mapsLinks(locationQuery) : null;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden font-sans text-[#e8e6dc]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--sl-amber": theme.primaryColor || AMBER,
          "--sl-indigo": theme.secondaryColor || INDIGO,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes sl-twinkle { 0%,100% { opacity: .16; transform: scale(.72); } 50% { opacity: .9; transform: scale(1.14); } }
        @keyframes sl-sway { 0% { transform: translateX(-7px) rotate(-1.6deg); } 100% { transform: translateX(7px) rotate(1.6deg); } }
        @keyframes sl-flicker { 0%,100% { transform: scaleY(1); opacity: 1; } 40% { transform: scaleY(1.14); opacity: .92; } 70% { transform: scaleY(.9); opacity: .97; } }
        @keyframes sl-vu { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        @keyframes sl-flyaway {
          0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 1; }
          20% { transform: translateY(-6vh) translateX(-10px) scale(1.02) rotate(-2deg); }
          100% { transform: translateY(-108vh) translateX(-46px) scale(0.34) rotate(-5deg); opacity: 0; }
        }
      `}</style>

      {/* آسمانِ شب: ماه، ستاره‌ها و فانوس‌های شناور */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* هاله‌ی دفقِ شهر در افق */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[radial-gradient(ellipse_at_50%_115%,rgba(255,179,71,0.16),transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_50%_-25%,rgba(90,110,200,0.22),transparent_70%)]" />

        {/* ماهِ هلال */}
        <div className="absolute left-[8%] top-[64px]">
          <div className="relative h-14 w-14 rounded-full bg-[#f2e5c0] shadow-[0_0_34px_10px_rgba(242,229,192,0.18)]">
            <span className="absolute -top-1 left-[-5px] h-12 w-12 rounded-full bg-[#101a3c] opacity-98" />
          </div>
        </div>

        {/* ستاره‌ها */}
        {STARS.map((s, i) => (
          <span
            key={`st-${i}`}
            className="absolute rounded-full bg-[#f2ecd8]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.bright ? 0.75 : 0.3,
              boxShadow: s.bright ? "0 0 6px 1px rgba(242,236,216,.5)" : "none",
              animation: `sl-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

        {/* فانوس‌های شناور — پس از رهایی، آسمان پر می‌شود */}
        <div
          className="absolute inset-0"
          style={{
            opacity: flown ? 1 : 0,
            transition: "opacity 1600ms ease 300ms",
          }}
        >
          {FLOATERS.map((f, i) => (
            <div
              key={`fl-${i}`}
              className="absolute"
              style={{
                left: `${f.left}%`,
                top: `${f.top}%`,
                width: 64 * f.scale,
                height: 96 * f.scale,
                animation: `sl-sway ${f.sway}s ease-in-out ${-f.sway / 3}s infinite alternate`,
                opacity: 0.55 + f.scale * 0.4,
              }}
            >
              <LanternBody uid={`${uidKey}-f${i}`} lit coral={f.coral} />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a1229]/80 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col">
        {/* سربرگ چسبان — پس از پرواز فانوس */}
        <header
          className={`sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#ffb347]/12 bg-[#101a3c]/80 px-4 backdrop-blur-xl transition-all duration-700 ${
            flown
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-full opacity-0"
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffb347]/10 text-[color:var(--sl-amber)] ring-1 ring-[#ffb347]/25">
            <Flame className="h-4 w-4" />
          </span>
          <div className="flex flex-col items-center">
            <span className="font-display text-xl tracking-widest text-[color:var(--sl-amber)]">
              {monogram}
            </span>
            <span className="-mt-1 text-[10px] font-medium tracking-[0.22em] text-[#9aa8cc]">
              شبِ فانوس
            </span>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffb347]/10 text-[color:var(--sl-amber)] ring-1 ring-[#ffb347]/25">
            <Star className="h-4 w-4" />
          </span>
        </header>

        {/* صحنه‌ی رهاییِ فانوس */}
        <section className="relative overflow-hidden">
          <div className="flex flex-col items-center px-5 pb-8 pt-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb347]/28 bg-[#ffb347]/[0.09] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[color:var(--sl-amber)]">
              <Flame className="h-3.5 w-3.5" />
              دعوت‌نامه‌ی شبِ فانوس‌ها
            </span>
            <h1 className="mt-4 font-display text-3xl leading-snug text-[#f5ead6]">
              جشن پیوندِ{" "}
              <span className="text-[color:var(--sl-amber)]">{couple}</span>
            </h1>
            <p className="mt-1.5 text-xs tracking-wide text-[#9aa8cc]">
              شبی که هزار فانوس به آسمان می‌رود
            </p>

            {/* فانوسِ آویزان */}
            <div className="relative mt-10 flex h-[380px] w-[220px] items-start justify-center">
              {/* رشته‌ی بند */}
              <div
                className={`absolute left-1/2 top-0 h-28 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-[#8a6f4d]/70 to-[#8a6f4d]/20 transition-opacity duration-500 ${
                  flown ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* فانوسِ اصلی */}
              <div
                className={`relative h-[230px] w-[150px] ${flown ? "" : "cursor-pointer"}`}
                style={
                  flown
                    ? { animation: "sl-flyaway 3s cubic-bezier(0.3,0,0.75,1) forwards" }
                    : { animation: "sl-sway 4.4s ease-in-out infinite alternate" }
                }
              >
                <button
                  type="button"
                  aria-label="افروختن فانوس"
                  onClick={() => phase === "hang" && setPhase("lit")}
                  className="h-full w-full outline-none"
                >
                  <LanternBody uid={`${uidKey}-main`} lit={lit} monogram={monogram} />
                </button>
              </div>

              {/* نشانِ بند زیر فانوس */}
              <div
                className={`absolute left-1/2 top-[248px] -translate-x-1/2 transition-all duration-700 ${
                  flown
                    ? "-translate-y-3 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                <span className="flex flex-col items-center gap-1">
                  <span className="h-6 w-px bg-[#8a6f4d]/50" />
                  <span
                    className={`rounded-full px-4 py-1.5 text-[11px] font-semibold shadow-md backdrop-blur transition-all ${
                      phase === "hang"
                        ? "animate-bounce border border-[#ffb347]/30 bg-white/[0.06] text-[color:var(--sl-amber)]"
                        : "border border-[#ffb347]/60 bg-[#ffb347]/15 text-[#ffd9a0] shadow-[0_0_20px_rgba(255,179,71,0.3)]"
                    }`}
                  >
                    {phase === "hang"
                      ? "برای افروختن، فانوس را لمس کنید"
                      : "فانوس آماده‌ی پرواز است"}
                  </span>
                </span>
              </div>
            </div>

            {/* دکمه‌ی رهایی */}
            {phase === "lit" ? (
              <button
                type="button"
                onClick={() => setPhase("fly")}
                className="relative z-10 mt-6 flex animate-[fade-up_0.6s_cubic-bezier(0.22,1,0.36,1)_both] items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffc169,#f2842e)] px-7 py-3 text-sm font-bold text-[#341603] shadow-[0_12px_30px_rgba(255,179,71,0.45)] transition hover:brightness-105 active:scale-95"
              >
                <Flame className="h-4 w-4" />
                فانوسِ آرزو را رها کنید
              </button>
            ) : null}

            {flown ? (
              <div className="relative z-10 mt-6 flex animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_both] items-center justify-center gap-3">
                <a
                  href="#ceremony-details"
                  className="flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#ffc169,#f2842e)] px-5 py-2.5 text-sm font-semibold text-[#341603] shadow-[0_10px_26px_rgba(255,179,71,0.4)] transition hover:brightness-105"
                >
                  <ArrowDown className="h-4 w-4" />
                  مشاهده جزئیات جشن
                </a>
                <button
                  type="button"
                  onClick={() => setPhase("hang")}
                  className="flex items-center gap-1.5 rounded-full border border-[#ffb347]/30 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-[#b9c0d8] backdrop-blur transition hover:text-[#f5ead6]"
                >
                  <RotateCcw className="h-4 w-4" />
                  فانوسِ دیگری بیفروزید
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* ورق‌های شب — پس از رهایی فانوس */}
        <div
          className={`flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            flown
              ? "translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 translate-y-6 overflow-hidden opacity-0"
          }`}
        >
          {/* شعر و نامه */}
          <section className="flex flex-col items-center px-5 pt-8 text-center">
            <div className="flex items-center gap-2 text-[color:var(--sl-amber)]">
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#ffb347]/70" />
              <Flame className="h-4 w-4" />
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#ffb347]/70" />
            </div>
            <p className="mt-4 max-w-sm font-display text-[1.5rem] leading-[2.2rem] text-[color:var(--sl-amber)]">
              {theme.poeticLine}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-8 text-[#c4c8d6]">
              {data.invitationText ||
                "شما با کمال مهر و افتخار به شبِ فانوس‌های ما فراخوانده شده‌اید"}
            </p>
          </section>

          {/* عکس زوج در قاب فانوس */}
          <section className="px-5 pt-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#ffb347]/25 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={couple} className="aspect-[4/3] w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1430]/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div className="text-right">
                  <p className="font-display text-2xl text-[#f5ead6]">{couple}</p>
                  <p className="mt-0.5 text-[10px] font-semibold tracking-[0.2em] text-[color:var(--sl-amber)]">
                    جشنِ پیوند
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ffb347]/45 bg-[#101a3c]/70 font-display text-base tracking-widest text-[color:var(--sl-amber)] backdrop-blur">
                  {monogram}
                </span>
              </div>
            </div>
          </section>

          {/* موسیقی */}
          {showMusic ? (
            <section className="px-5 pt-7">
              <div className="flex items-center justify-between rounded-2xl border border-[#ffb347]/15 bg-white/[0.04] p-3.5 backdrop-blur-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffc169,#f2842e)] text-[#341603] shadow-[0_8px_22px_rgba(255,179,71,0.35)]">
                    <Music2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#f5ead6]">
                      {theme.musicTitle}
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffb347]" />
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#9aa8cc]">
                      نوازندگانِ شبِ ما
                    </p>
                  </div>
                </div>
                <div className="flex h-6 items-end gap-1 px-1">
                  {[3, 5, 4, 6, 3].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 origin-bottom rounded-full bg-[#ffb347]/70"
                      style={{
                        height: `${h * 4}px`,
                        animation: `sl-vu ${1 + i * 0.17}s ease-in-out ${i * 0.11}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {/* تاریخ و شمارش معکوس */}
          {showCountdown ? (
            <section
              id="ceremony-details"
              className="flex scroll-mt-20 flex-col items-center px-5 pt-8 text-center"
            >
              <div className="mb-2 flex items-center gap-2 text-[color:var(--sl-amber)]">
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#ffb347]/70" />
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] font-semibold tracking-[0.18em]">
                  تا برافروختنِ هزار فانوس
                </span>
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#ffb347]/70" />
              </div>
              <p className="font-display text-xl text-[#f5ead6]">{dayLabel}</p>
              {timeLabel ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#9aa8cc]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {timeLabel}
                </p>
              ) : null}
              <Countdown
                eventStartAt={data.eventStartAt!}
                className="mt-4 w-full [&_div]:rounded-xl [&_div]:border [&_div]:border-[#ffb347]/20 [&_div]:bg-white/[0.05] [&_div]:backdrop-blur-sm [&_p:first-child]:font-display [&_p:first-child]:text-[22px] [&_p:first-child]:font-semibold [&_p:first-child]:text-[color:var(--sl-amber)] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#9aa8cc]"
              />
              {calendarHref ? (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#ffb347]/25 bg-[#ffb347]/[0.08] px-4 py-2 text-xs font-medium text-[color:var(--sl-amber)] transition hover:bg-[#ffb347]/[0.16]"
                >
                  <CalendarDays className="h-4 w-4" />
                  افزودن به تقویم گوگل و اپل
                </a>
              ) : null}
            </section>
          ) : (
            <span id="ceremony-details" />
          )}

          {/* برنامه‌ی شب */}
          <section className="px-5 pt-9">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-[color:var(--sl-amber)]">
                برنامه‌ی شبِ فانوس
              </h2>
              <span className="rounded-full border border-[#ffb347]/20 bg-[#ffb347]/[0.08] px-2.5 py-1 text-[10px] font-semibold text-[#9aa8cc]">
                از غروب تا سپیده‌دم
              </span>
            </div>
            <div className="relative rounded-2xl border border-[#ffb347]/15 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="absolute bottom-6 right-[38px] top-6 w-px bg-[repeating-linear-gradient(180deg,rgba(255,179,71,0.5)_0_6px,transparent_6px_12px)]" />
              <div className="flex flex-col gap-6">
                {schedule.map((item) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <div
                      key={`${item.time}-${item.title}`}
                      className="relative z-10 flex items-start gap-3.5"
                    >
                      {/* گرهِ فانوس‌شکل */}
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                        <span className="absolute inset-0 rounded-t-full rounded-b-xl border border-[#ffb347]/40 bg-[#1a2650] shadow-[0_0_18px_rgba(255,179,71,0.14)]" />
                        <Icon className="relative h-[17px] w-[17px] text-[color:var(--sl-amber)]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-sm font-semibold text-[#f5ead6]">
                            {item.title}
                          </h3>
                          <span className="shrink-0 rounded-full bg-[#ffb347]/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-[color:var(--sl-amber)]">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-6 text-[#9aa8cc]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* محل برگزاری */}
          {showMap ? (
            <section id="location" className="scroll-mt-20 px-5 pt-9">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-[color:var(--sl-amber)]">
                  محل برگزاری
                </h2>
                {data.venueName ? (
                  <span className="text-xs font-medium text-[#9aa8cc]">
                    {data.venueName}
                  </span>
                ) : null}
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#ffb347]/15 bg-white/[0.04] backdrop-blur-sm">
                <div className="relative flex h-44 items-end justify-start bg-[linear-gradient(140deg,#101a3c_0%,#1c2c5e_55%,#2c3f78_100%)] p-3">
                  {/* شهرِ شب با چراغ‌های گرم */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-70"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 12% 78%, rgba(255,179,71,.55) 0%, transparent 2.4%), radial-gradient(circle at 30% 88%, rgba(255,143,94,.45) 0%, transparent 2%), radial-gradient(circle at 48% 82%, rgba(255,217,160,.5) 0%, transparent 2.2%), radial-gradient(circle at 68% 90%, rgba(255,179,71,.4) 0%, transparent 1.8%), radial-gradient(circle at 86% 80%, rgba(255,217,160,.5) 0%, transparent 2.4%), linear-gradient(180deg, transparent 55%, #0a1229 100%)",
                    }}
                  />
                  <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#101a3c]/70 px-3 py-1.5 text-[11px] font-semibold text-[color:var(--sl-amber)] ring-1 ring-[#ffb347]/30 backdrop-blur">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.venueName || "محل مراسم"}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div>
                    {data.venueName ? (
                      <h3 className="text-sm font-semibold text-[#f5ead6]">
                        {data.venueName}
                      </h3>
                    ) : null}
                    {data.venueAddress ? (
                      <p className="mt-1 text-xs leading-6 text-[#9aa8cc]">
                        {data.venueAddress}
                      </p>
                    ) : null}
                  </div>
                  {links ? (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { href: links.neshan, label: "مسیریابی با نشان" },
                        { href: links.balad, label: "مسیریابی با بلد" },
                        { href: links.google, label: "Google Maps" },
                      ].map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#ffb347]/15 bg-[#101a3c]/60 p-2.5 text-[#f5ead6] transition hover:border-[#ffb347]/40 hover:bg-[#1a2650]"
                        >
                          <Navigation className="h-4 w-4 text-[color:var(--sl-amber)]" />
                          <span className="text-center text-[10px] leading-4">
                            {item.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {/* پوشش مهمانان */}
          <section className="px-5 pt-9">
            <div className="rounded-2xl border border-[#ffb347]/15 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-t-full rounded-b-xl bg-[#ffb347]/[0.12] text-[color:var(--sl-amber)] ring-1 ring-[#ffb347]/25">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#f5ead6]">
                    پوشش مهمانان (Dress Code)
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#9aa8cc]">
                    {theme.dressCode}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {PALETTE.map((s) => (
                      <span
                        key={s.label}
                        className="flex items-center gap-1.5 rounded-full bg-[#101a3c]/60 px-2.5 py-1 text-[10px] text-[#c4c8d6] ring-1 ring-white/10"
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full ring-1 ring-white/25"
                          style={{ backgroundColor: s.color }}
                        />
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* اعلام حضور — فانوسِ شما */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 px-5 pt-9">
              <div className="relative overflow-hidden rounded-2xl border border-[#ffb347]/25 bg-[linear-gradient(165deg,rgba(255,179,71,0.12),rgba(255,255,255,0.03))] p-5 text-center backdrop-blur-sm">
                <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#ffb347]/15 blur-2xl" />
                <div className="relative mx-auto h-16 w-10" style={{ animation: "sl-sway 3.6s ease-in-out infinite alternate" }}>
                  <LanternBody uid={`${uidKey}-rsvp`} lit coral />
                </div>
                <h2 className="mt-3 font-display text-xl text-[color:var(--sl-amber)]">
                  فانوسِ خود را بفرستید
                </h2>
                <p className="mt-1.5 text-xs leading-6 text-[#9aa8cc]">
                  آیا فانوسی به نامِ شما نیز در این آسمان خواهد درخشید؟
                </p>
                {preview ? (
                  <div className="mt-4 flex flex-col gap-2.5 text-right">
                    {/* جعبه‌ی آرزو (نمایشی) */}
                    <div className="flex items-center gap-2.5 rounded-xl border border-[#ffb347]/25 bg-[#101a3c]/60 p-3.5">
                      <Feather className="h-4 w-4 shrink-0 text-[color:var(--sl-amber)]" />
                      <span className="truncate text-sm text-[#b9c0d8]">
                        آرزوی خوبی برای زوج بنویسید…
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between rounded-xl border border-[#ffb347]/40 bg-[#ffb347]/10 p-3.5">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-[color:var(--sl-amber)]" />
                        <span className="text-sm font-semibold text-[#f5ead6]">
                          با افتخار همراه شما هستیم
                        </span>
                      </div>
                      <span className="h-4 w-4 rounded-full border border-[#ffb347]/60 bg-[#ffb347]" />
                    </div>
                    <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <div className="flex items-center gap-2.5">
                        <XCircle className="h-5 w-5 text-[#9aa8cc]" />
                        <span className="text-sm font-medium text-[#b9c0d8]">
                          متأسفانه امکان حضور ندارم
                        </span>
                      </div>
                      <span className="h-4 w-4 rounded-full border border-white/25" />
                    </div>
                  </div>
                ) : (
                  <a
                    href="#rsvp"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffc169,#f2842e)] py-3.5 text-sm font-semibold text-[#341603] shadow-[0_12px_28px_rgba(255,179,71,0.4)] transition hover:brightness-105"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    ثبت و تأیید نهایی حضور
                  </a>
                )}
              </div>
            </section>
          ) : null}

          {/* دعای پایانی */}
          <footer className="flex flex-col items-center gap-3 px-5 pb-28 pt-10 text-center">
            <p className="max-w-sm font-display text-xl leading-relaxed text-[color:var(--sl-amber)]">
              {theme.blessingLine}
            </p>
            <p className="text-xs text-[#9aa8cc]">
              چشم‌انتظارِ درخششِ فانوسِ شما هستیم
            </p>
            <div className="mt-2 flex items-center gap-2 text-[#c4c8d6]">
              <span className="h-px w-8 bg-[#ffb347]/30" />
              <Sparkles className="h-3.5 w-3.5 text-[#ffb347]/70" />
              <span className="text-sm font-semibold">{couple}</span>
              <Sparkles className="h-3.5 w-3.5 text-[#ffb347]/70" />
              <span className="h-px w-8 bg-[#ffb347]/30" />
            </div>
          </footer>
        </div>
      </div>

      {/* منوی پایین */}
      {flown ? (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-16 w-full max-w-md items-center justify-around border-t border-[#ffb347]/15 bg-[#0c1430]/90 px-2 backdrop-blur-xl">
          {[
            { href: "#ceremony-details", label: "جزئیات جشن", icon: Sparkles },
            { href: "#location", label: "مکان", icon: MapPin },
            { href: "#rsvp", label: "فانوسِ شما", icon: Feather },
          ].map((item) => (
            <a
              key={item.href}
              href={preview ? undefined : item.href}
              className="flex min-h-[44px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[10px] font-medium text-[#9aa8cc] transition hover:text-[color:var(--sl-amber)]"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}


