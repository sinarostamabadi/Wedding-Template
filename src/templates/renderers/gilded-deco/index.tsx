"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  Coffee,
  Heart,
  MapPin,
  Minus,
  Music2,
  Navigation,
  Plus,
  ScrollText,
  Sparkles,
  Users,
  Utensils,
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

const DEFAULT_COVER = "/images/templates/gilded-deco-cover.jpg";

const NOIR = "#0b0a09";
const GOLD = "#c9a227";
const GOLD_LIGHT = "#f4e3b0";
const BRASS = "#8a6a1f";
const CREAM_TOP = "#fbf6ea";
const CREAM_MID = "#f4ecdb";
const CREAM_DEEP = "#eadcc3";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)' opacity='0.6'/%3E%3C/svg%3E\")";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "پیشواز در لابی",
    description: "خوشامدگویی با کوکتل زعفران و نوای گرامافون",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "آیین پیمان",
    description: "امضای پیمان زیر لوستر کریستال، با گواهی خانواده‌ها",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافت طلایی",
    description: "شام پنج‌دوره‌ای با خدمات سر میز و ارکستر زنده",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "چرخ‌فلک و پایکوبی",
    description: "رقص و دست‌افشانی تا پاسی از شب",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#17140f", label: "مشکی شب", en: "Noir" },
  { color: GOLD, label: "طلایی کهنه", en: "Gold" },
  { color: "#14504a", label: "زمردی", en: "Emerald" },
  { color: "#f2e8d5", label: "عاجی", en: "Ivory" },
];

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", day: "", month: "", year: "" };
  try {
    const date = new Date(iso);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...options }).format(date);
    return {
      weekday: format({ weekday: "long" }),
      day: format({ day: "numeric" }),
      month: format({ month: "long" }),
      year: format({ year: "numeric" }),
    };
  } catch {
    return { weekday: "", day: "", month: "", year: "" };
  }
}

function latinDateOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("en-GB", { timeZone, ...options }).format(date);
    return `${format({ day: "2-digit" })} . ${format({ month: "2-digit" })} . ${format({ year: "numeric" })}`;
  } catch {
    return "";
  }
}

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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.65))]" />
      <span className="whitespace-nowrap text-[8.5px] uppercase tracking-[0.42em] text-[#c9a227]/85">
        {children}
      </span>
      <span className="h-px w-8 bg-[linear-gradient(270deg,transparent,rgba(201,162,39,0.65))]" />
    </div>
  );
}

function DecoDivider({
  className = "",
  color = "#b08a2a",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden>
      <span
        className="h-px w-12"
        style={{ backgroundImage: `linear-gradient(90deg, transparent, ${color}99)` }}
      />
      <svg viewBox="0 0 20 20" className="h-2.5 w-2.5">
        <path d="M10 1 L19 10 L10 19 L1 10 Z" fill="none" stroke={color} strokeWidth="1" />
        <path d="M10 6.5 L13.5 10 L10 13.5 L6.5 10 Z" fill={color} />
      </svg>
      <span
        className="h-px w-12"
        style={{ backgroundImage: `linear-gradient(270deg, transparent, ${color}99)` }}
      />
    </div>
  );
}

function DecoCorner({
  className = "",
  color = "#b08a2a",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path d="M0 15 V0 H15" fill="none" stroke={color} strokeWidth="1" />
      <path d="M4 21 V4 H21" fill="none" stroke={color} strokeWidth="0.6" opacity="0.65" />
      <path d="M0 0 L7 7" stroke={color} strokeWidth="0.6" opacity="0.5" />
      <circle cx="10" cy="10" r="1.5" fill={color} opacity="0.9" />
    </svg>
  );
}

function Sunburst({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      <div
        className="h-full w-full rounded-full"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 50%, rgba(201,162,39,0.20) 0deg 0.3deg, transparent 0.3deg 8deg)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.32) 42%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.32) 42%, transparent 68%)",
          animation: "gd-spin 150s linear infinite",
        }}
      />
    </div>
  );
}

function FanOrnament({
  className = "",
  color = GOLD,
}: {
  className?: string;
  color?: string;
}) {
  const rays = Array.from({ length: 9 }, (_, i) => -60 + i * 15);
  return (
    <svg viewBox="0 0 120 48" className={className} aria-hidden>
      <path
        d="M18 46 A 42 42 0 0 1 102 46"
        fill="none"
        stroke={color}
        strokeWidth="0.7"
        opacity="0.35"
      />
      {rays.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1="60"
            y1="46"
            x2={60 + Math.sin(rad) * 44}
            y2={46 - Math.cos(rad) * 44}
            stroke={color}
            strokeWidth="1"
            opacity={0.3 + Math.abs(4 - i) * 0.05}
          />
        );
      })}
      <path d="M48 46 L60 33 L72 46 Z" fill={color} opacity="0.9" />
      <circle cx="60" cy="46" r="2.2" fill={color} />
    </svg>
  );
}

function CrestFan({
  open,
  onToggle,
  label,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
}) {
  const count = 13;
  const mid = (count - 1) / 2;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-expanded={open}
      className="group relative z-10 block h-[184px] w-[300px] max-w-full cursor-pointer"
    >
      <span className="pointer-events-none absolute bottom-8 left-1/2 h-36 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(201,162,39,0.22),transparent_70%)] blur-lg transition-opacity duration-700" />

      {Array.from({ length: count }, (_, i) => {
        const dist = Math.abs(i - mid);
        const angle = (i - mid) * 13.2;
        return (
          <span
            key={i}
            className="absolute bottom-0 left-1/2 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${open ? angle : 0}deg)`,
              transition: `transform ${open ? 900 : 560}ms cubic-bezier(0.2,0.85,0.2,1)`,
              transitionDelay: `${open ? dist * 42 : (count - dist) * 14}ms`,
              zIndex: 20 - dist,
            }}
          >
            <span
              className="relative block h-[142px] w-[24px]"
              style={{
                clipPath: "polygon(48% 100%, 52% 100%, 100% 12%, 50% 0%, 0% 12%)",
                backgroundImage:
                  "linear-gradient(180deg,#fdf6dc 0%,#f0d99a 20%,#d4b04a 46%,#c9a227 72%,#8f6f1f 100%)",
              }}
            >
              <span className="absolute inset-x-0 top-0 h-[10px] bg-[#fdf6dc]/45" />
            </span>
            <span className="absolute -top-[2px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#fdf3cf] shadow-[0_0_6px_rgba(253,243,207,0.85)]" />
          </span>
        );
      })}

      <svg
        viewBox="0 0 300 184"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: open ? 1 : 0, transition: "opacity 800ms ease 260ms" }}
        aria-hidden
      >
        <path
          d="M0 182 A 150 150 0 0 1 300 182"
          fill="none"
          stroke="rgba(201,162,39,0.5)"
          strokeWidth="1"
        />
        <path
          d="M10 182 A 140 140 0 0 1 290 182"
          fill="none"
          stroke="rgba(201,162,39,0.14)"
          strokeWidth="1"
        />
      </svg>
    </button>
  );
}

function MonogramDiamond({
  text,
  size = 72,
  className = "",
  tone = "dark",
}: {
  text: string;
  size?: number;
  className?: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="absolute inset-0 rotate-45 border"
        style={{ borderColor: light ? `${BRASS}70` : "rgba(201,162,39,0.7)" }}
      />
      <span
        className="absolute inset-[4px] rotate-45 border"
        style={{ borderColor: light ? `${BRASS}35` : "rgba(201,162,39,0.25)" }}
      />
      <span
        className="absolute inset-[9px] rotate-45"
        style={{
          backgroundImage: light
            ? `linear-gradient(150deg,${CREAM_TOP},${CREAM_DEEP})`
            : "linear-gradient(150deg,#1b1713,#0b0a09 60%,#171310)",
        }}
      />
      {!light ? (
        <span className="absolute inset-[9px] rotate-45 bg-[radial-gradient(circle_at_30%_25%,rgba(201,162,39,0.2),transparent_62%)]" />
      ) : null}
      <span
        className="relative font-display tracking-tight"
        style={{
          fontSize: Math.max(10, Math.round(size * 0.24)),
          color: light ? BRASS : GOLD_LIGHT,
        }}
      >
        {text}
      </span>
    </span>
  );
}

function GoldSeal({ monogram }: { monogram: string }) {
  return (
    <span
      className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full"
      style={{
        backgroundImage:
          "radial-gradient(circle at 34% 28%,#fbf0cd 0%,#e2c46f 34%,#c9a227 66%,#8a6a1f 100%)",
        boxShadow:
          "0 14px 30px -14px rgba(201,162,39,0.7), inset 0 -3px 8px rgba(90,66,15,0.42), inset 0 3px 6px rgba(255,247,220,0.55)",
        animation: "gd-stamp 620ms cubic-bezier(0.2,1.3,0.3,1) both",
      }}
      aria-hidden
    >
      <span className="absolute inset-[4px] rounded-full border border-[#6b4f12]/35" />
      <span className="absolute inset-[8px] rounded-full border border-[#6b4f12]/20" />
      <span className="absolute inset-[12px] rounded-full border border-dashed border-[#6b4f12]/30" />
      <span className="absolute inset-[19px] flex items-center justify-center rounded-full bg-[#e5c979]/70 shadow-[inset_0_1px_3px_rgba(90,66,15,0.3)]">
        <span className="text-center font-display text-[10px] leading-[1.45] text-[#3d2c05]">
          مهر
          <br />
          {monogram}
        </span>
      </span>
    </span>
  );
}

export function GildedDecoRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [fanOpen, setFanOpen] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [stamped, setStamped] = useState(false);

  useEffect(() => {
    const delay = features?.entranceAnimation === false ? 60 : 620;
    const timer = window.setTimeout(() => setFanOpen(true), delay);
    return () => window.clearTimeout(timer);
  }, [features?.entranceAnimation]);

  const theme: TemplateCustomization = {
    primaryColor: GOLD,
    secondaryColor: BRASS,
    backgroundColor: NOIR,
    poeticLine: "«درخشش یک عمر، در یک شبِ طلایی»",
    blessingLine:
      "طلایی‌ترین شب زندگی‌مان را با حضورتان کامل کنید؛ جای شما همیشه در خاطره‌ی این شب می‌درخشد.",
    dressCode:
      "پوشش رسمی با درخششی از عصر طلایی: مشکی، طلایی، زمردی و عاجی. لطفاً از پوشش تمام‌سفید پرهیز کنید.",
    musicTitle: "گرامافون · نوای جاز تهران",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const parts = datePartsOf(data.eventStartAt, data.timezone);
  const latinDate = latinDateOf(data.eventStartAt, data.timezone);
  const timeRange = formatEventTimeRange(data.eventStartAt, data.eventEndAt, data.timezone);
  const startTime = timeRange ? timeRange.replace("ساعت ", "").split(" الی ")[0] : null;
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
      className="relative min-h-screen overflow-x-clip bg-[#0b0a09] font-sans text-[#f7f0e1]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes gd-spin { to { transform: rotate(360deg); } }
        @keyframes gd-foil {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes gd-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gd-stamp {
          0% { opacity: 0; transform: scale(1.75) rotate(-16deg); }
          60% { opacity: 1; transform: scale(0.94) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes gd-twinkle {
          0%, 100% { opacity: 0.12; transform: scale(0.75); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes gd-bob {
          0%, 100% { transform: translateY(0); opacity: 0.55; }
          50% { transform: translateY(5px); opacity: 1; }
        }
        .gd-foil {
          background-image: linear-gradient(100deg,#8a6a1f 0%,#c9a227 12%,#f9efc9 26%,#fffdf4 33%,#f2dfa4 40%,#c9a227 56%,#8a6a1f 74%,#c9a227 100%);
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gd-foil 11s linear infinite;
        }
        .gd-gold-v {
          background-image: linear-gradient(180deg,#fdf6dc 0%,#f2dfa4 32%,#dcbb63 60%,#c9a227 84%,#b08a2a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-md overflow-x-clip">
        {/* page texture */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 46px), radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.10), transparent 55%)",
          }}
          aria-hidden
        />

        <header className="sticky top-0 z-40 border-b border-[#c9a227]/20 bg-[#0b0a09]/85 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4">
            <MonogramDiamond text={monogram} size={34} />
            <div className="flex flex-col items-center leading-none">
              <span className="font-display text-[15px] text-[#f4e3b0]">عصر طلایی</span>
              <span className="mt-1 text-[7px] uppercase tracking-[0.38em] text-[#c9a227]/70">
                The Golden Age
              </span>
            </div>
            <span className="text-[8px] uppercase tracking-[0.24em] text-[#c9a227]/60">
              Est. 2027
            </span>
          </div>
        </header>

        <main className="relative z-10 pb-24">
          {/* ————— Hero ————— */}
          <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-start overflow-hidden px-5 pb-[86px] pt-8 text-center">
            <Sunburst className="-top-[180px] left-1/2 h-[900px] w-[900px] -translate-x-1/2" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 50% 42%, transparent 20%, rgba(11,10,9,0.55) 62%, #0b0a09 88%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
              aria-hidden
            />

            {/* hairline frame */}
            <span className="pointer-events-none absolute bottom-[70px] left-3 right-3 top-3 border border-[#c9a227]/35" />
            <span className="pointer-events-none absolute bottom-[66px] left-[7px] right-[7px] top-[7px] border border-[#c9a227]/12" />
            <DecoCorner className="pointer-events-none absolute right-3 top-3 h-7 w-7" />
            <DecoCorner className="pointer-events-none absolute left-3 top-3 h-7 w-7 -rotate-90" />
            <DecoCorner className="pointer-events-none absolute bottom-[70px] left-3 h-7 w-7 rotate-180" />
            <DecoCorner className="pointer-events-none absolute bottom-[70px] right-3 h-7 w-7 rotate-90" />

            {/* twinkles */}
            {[
              { top: "22%", left: "16%", delay: "0s", size: 3 },
              { top: "34%", left: "78%", delay: "1.4s", size: 2 },
              { top: "58%", left: "12%", delay: "2.2s", size: 2 },
              { top: "48%", left: "88%", delay: "0.8s", size: 3 },
              { top: "76%", left: "26%", delay: "1.9s", size: 2 },
              { top: "70%", left: "70%", delay: "2.7s", size: 2 },
            ].map((dot) => (
              <span
                key={`${dot.top}-${dot.left}`}
                className="pointer-events-none absolute rounded-full bg-[#f7e6b4]"
                style={{
                  top: dot.top,
                  left: dot.left,
                  height: dot.size,
                  width: dot.size,
                  animation: `gd-twinkle 4.5s ease-in-out ${dot.delay} infinite`,
                }}
                aria-hidden
              />
            ))}

            <div
              className="relative z-10 flex flex-col items-center"
              style={{ animation: "gd-rise 900ms ease-out both" }}
            >
              <p className="text-[8.5px] uppercase tracking-[0.55em] text-[#c9a227]/80">
                The Wedding Of
              </p>

              <CrestFan
                open={fanOpen}
                onToggle={() => setFanOpen((value) => !value)}
                label={fanOpen ? "بستن بادبزن طلایی" : "گشودن بادبزن طلایی"}
              />

              <MonogramDiamond
                text={monogram}
                size={62}
                className="relative z-20 -mt-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]"
              />

              <h1 className="mt-5 flex flex-col items-center font-display text-[46px] leading-[1.24]">
                <span className="gd-foil inline-block px-2">{data.partnerOneName}</span>
                <span className="flex items-center gap-2 text-[#c9a227]">
                  <span className="h-px w-8 bg-[#c9a227]/45" />
                  <span className="font-sans text-[10px] tracking-[0.4em]">و</span>
                  <span className="h-px w-8 bg-[#c9a227]/45" />
                </span>
                <span className="gd-foil inline-block px-2">{data.partnerTwoName}</span>
              </h1>

              <p className="mt-5 text-[11px] tracking-[0.22em] text-[#f7f0e1]/60">
                {parts.day && parts.month
                  ? `${parts.weekday} · ${parts.day} ${parts.month} ${parts.year}`
                  : "تاریخ به‌زودی اعلام می‌شود"}
              </p>
              <p className="mt-2 text-[11px] tracking-[0.18em] text-[#c9a227]/85">
                {data.venueName || "محل جشن"}
              </p>
            </div>

            {/* ghost medallion fills the lower negative space */}
            <div
              className="pointer-events-none absolute bottom-[120px] left-1/2 z-0 hidden -translate-x-1/2 [@media(min-height:860px)]:block"
              aria-hidden
            >
              <div className="relative flex h-[160px] w-[160px] items-center justify-center">
                <span className="absolute inset-0 rotate-45 border border-[#c9a227]/12" />
                <span className="absolute inset-[26px] rotate-45 border border-[#c9a227]/[0.08]" />
                <span className="h-1 w-1 rotate-45 bg-[#c9a227]/40" />
              </div>
            </div>

            <div
              className="relative z-10 mt-auto flex flex-col items-center"
              style={{ animation: "gd-rise 900ms ease-out 320ms both" }}
            >
              <span className="text-[8px] uppercase tracking-[0.34em] text-[#f7f0e1]/35">
                Scroll
              </span>
              <ChevronDown
                className="mt-1 h-4 w-4 text-[#c9a227]/80"
                style={{ animation: "gd-bob 2.6s ease-in-out infinite" }}
              />
            </div>
          </section>

          {/* ————— Invitation card ————— */}
          <section id="invitation" className="relative scroll-mt-20 px-4 pt-14">
            <SectionLabel>The Invitation</SectionLabel>

            <div
              className="relative mt-5 overflow-hidden border px-5 pb-8 pt-7 text-[#1d1915] shadow-[0_30px_70px_-32px_rgba(0,0,0,0.95)]"
              style={{
                borderColor: "rgba(176,138,42,0.45)",
                backgroundImage: `linear-gradient(165deg,${CREAM_TOP} 0%,${CREAM_MID} 46%,${CREAM_DEEP} 100%)`,
              }}
            >
              <span className="pointer-events-none absolute inset-0 border border-[#b08a2a]/40" />
              <span className="pointer-events-none absolute inset-[7px] border border-[#b08a2a]/18" />
              <DecoCorner className="pointer-events-none absolute right-[10px] top-[10px] h-7 w-7" />
              <DecoCorner className="pointer-events-none absolute left-[10px] top-[10px] h-7 w-7 -rotate-90" />
              <DecoCorner className="pointer-events-none absolute bottom-[10px] left-[10px] h-7 w-7 rotate-180" />
              <DecoCorner className="pointer-events-none absolute bottom-[10px] right-[10px] h-7 w-7 rotate-90" />

              <p className="text-center text-[10px] tracking-[0.4em] text-[#8a6a1f]">
                به نام عشق
              </p>

              <div className="relative mx-auto mt-5 w-[68%]">
                <div
                  className="pointer-events-none absolute -inset-[6px] border border-[#b08a2a]/45"
                  style={{ borderRadius: "50% 50% 0 0 / 30% 30% 0 0" }}
                />
                <div
                  className="relative overflow-hidden"
                  style={{ borderRadius: "50% 50% 0 0 / 30% 30% 0 0" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt=""
                    className="aspect-[3/4] w-full object-cover"
                    style={{ filter: "sepia(0.16) saturate(0.92) contrast(1.05)" }}
                  />
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(70,45,12,0.32))]" />
                </div>
                <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-[#b08a2a] bg-[#f7f1e4]" />
              </div>

              <h2 className="mt-7 text-center font-display text-[30px] leading-tight text-[#1d1915]">
                {couple}
              </h2>

              <DecoDivider className="mt-3" />

              <p className="mt-4 text-center font-display text-[18px] leading-9 text-[#3a2f22]">
                {theme.poeticLine}
              </p>

              <p className="mt-3 text-center text-[12.5px] leading-7 text-[#4a4034]">
                {data.invitationText ||
                  `با کمال شادی و افتخار، شما را به جشن پیوندمان فرا می‌خوانیم؛ شبی به درخشش طلا و به گرمیِ حضور شما.`}
              </p>

              {families ? (
                <p className="mt-3 text-center text-[11px] text-[#7a6440]">
                  به همراه خاندان‌های {families}
                </p>
              ) : null}

              <div className="mt-6 flex items-center justify-center gap-3 text-center">
                <div>
                  <p className="text-[7.5px] uppercase tracking-[0.32em] text-[#a08040]">Date</p>
                  <p className="mt-1 font-display text-[13px] text-[#2a2118]">
                    {parts.day && parts.month ? `${parts.day} ${parts.month}` : "—"}
                  </p>
                </div>
                <span className="h-6 w-px bg-[#b08a2a]/30" />
                <div>
                  <p className="text-[7.5px] uppercase tracking-[0.32em] text-[#a08040]">Time</p>
                  <p className="mt-1 font-display text-[13px] text-[#2a2118]">
                    {startTime || "به‌زودی"}
                  </p>
                </div>
                <span className="h-6 w-px bg-[#b08a2a]/30" />
                <div>
                  <p className="text-[7.5px] uppercase tracking-[0.32em] text-[#a08040]">City</p>
                  <p className="mt-1 font-display text-[13px] text-[#2a2118]">
                    {data.venueAddress ? "تهران" : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <MonogramDiamond text={monogram} size={56} tone="light" />
              </div>
            </div>
          </section>

          {/* ————— Date & countdown ————— */}
          <section className="relative px-4 pt-16">
            <FanOrnament className="mx-auto h-8 w-24 opacity-70" />
            <SectionLabel>Save The Date</SectionLabel>

            <div className="relative mt-6 border-y border-[#c9a227]/25 py-6">
              <span className="absolute -right-px top-0 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[#c9a227]/70" />
              <span className="absolute -left-px top-0 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[#c9a227]/70" />
              <span className="absolute -right-px bottom-0 h-1.5 w-1.5 translate-y-1/2 rotate-45 bg-[#c9a227]/70" />
              <span className="absolute -left-px bottom-0 h-1.5 w-1.5 translate-y-1/2 rotate-45 bg-[#c9a227]/70" />

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="text-center">
                  <p className="text-[7.5px] uppercase tracking-[0.34em] text-[#c9a227]/65">
                    Weekday
                  </p>
                  <p className="mt-2 font-display text-[15px] text-[#f7f0e1]">
                    {parts.weekday || "—"}
                  </p>
                  <p className="mt-1 text-[10px] text-[#f7f0e1]/40">{parts.year}</p>
                </div>

                <div className="relative flex flex-col items-center px-4">
                  <span className="absolute inset-y-1 right-0 w-px bg-[#c9a227]/20" />
                  <span className="absolute inset-y-1 left-0 w-px bg-[#c9a227]/20" />
                  <p className="gd-gold-v font-display text-[70px] leading-[0.86]">
                    {parts.day || "—"}
                  </p>
                  <p className="mt-2 font-display text-[14px] text-[#c9a227]">
                    {parts.month || ""}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-[7.5px] uppercase tracking-[0.34em] text-[#c9a227]/65">
                    Time
                  </p>
                  <p className="mt-2 font-display text-[15px] text-[#f7f0e1]">
                    {startTime || "—"}
                  </p>
                  <p className="mt-1 text-[10px] tracking-[0.1em] text-[#f7f0e1]/40">
                    {latinDate}
                  </p>
                </div>
              </div>
            </div>

            {showCountdown ? (
              <div className="mt-8">
                <p className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.4em] text-[#c9a227]/80">
                  <span className="h-px w-6 bg-[#c9a227]/40" />
                  Countdown
                  <span className="h-px w-6 bg-[#c9a227]/40" />
                </p>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="mt-4 [&>div]:rounded-none [&>div]:border [&>div]:border-[#c9a227]/30 [&>div]:bg-[#121010] [&>div]:px-1 [&>div]:py-3.5 [&_p:first-child]:font-display [&_p:first-child]:text-[26px] [&_p:first-child]:leading-none [&_p:first-child]:text-[#f4e3b0] [&_p:last-child]:mt-1.5 [&_p:last-child]:text-[8.5px] [&_p:last-child]:tracking-[0.22em] [&_p:last-child]:text-[#c9a227]/80"
                />
              </div>
            ) : null}
          </section>

          {/* ————— Evening timeline ————— */}
          <section id="schedule" className="relative scroll-mt-20 px-4 pt-16">
            <FanOrnament className="mx-auto h-8 w-24 opacity-70" />
            <SectionLabel>The Evening</SectionLabel>
            <h2 className="mt-3 text-center font-display text-[26px] text-[#f7f0e1]">
              برنامه‌ی شب
            </h2>

            <div className="relative mt-8">
              <ul className="space-y-3">
                {schedule.map((item, index) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <li
                      key={`${item.time}-${item.title}`}
                      className="relative grid grid-cols-[64px_1fr] gap-3.5 border border-[#c9a227]/18 bg-[linear-gradient(100deg,rgba(201,162,39,0.07),transparent_72%)] p-3"
                    >
                      <span className="pointer-events-none absolute right-0 top-0 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rotate-45 bg-[#c9a227]/80" />
                      <div className="flex flex-col items-center justify-center gap-1 border border-[#c9a227]/30 bg-[#0b0a09] py-2">
                        <Icon className="h-3.5 w-3.5 text-[#c9a227]/80" />
                        <span className="font-display text-[12px] text-[#e9cd85]">
                          {item.time}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-[18px] leading-tight text-[#f7f0e1]">
                            {item.title}
                          </p>
                          <span className="shrink-0 text-[8px] uppercase tracking-[0.24em] text-[#c9a227]/45">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] leading-6 text-[#f7f0e1]/55">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* ————— Venue ————— */}
          {showMap ? (
            <section id="location" className="relative scroll-mt-20 px-4 pt-16">
              <FanOrnament className="mx-auto h-8 w-24 opacity-70" />
              <SectionLabel>The Venue</SectionLabel>

              <div className="relative mt-5 border border-[#c9a227]/30 p-1">
                <span className="pointer-events-none absolute -right-1 -top-1 h-2 w-2 rotate-45 bg-[#c9a227]" />
                <span className="pointer-events-none absolute -left-1 -top-1 h-2 w-2 rotate-45 bg-[#c9a227]" />
                <span className="pointer-events-none absolute -bottom-1 -right-1 h-2 w-2 rotate-45 bg-[#c9a227]" />
                <span className="pointer-events-none absolute -bottom-1 -left-1 h-2 w-2 rotate-45 bg-[#c9a227]" />

                <div className="border border-[#c9a227]/15 px-5 py-7 text-center">
                  <span className="mx-auto flex h-12 w-12 rotate-45 items-center justify-center border border-[#c9a227]/45 bg-[#c9a227]/5">
                    <MapPin className="h-5 w-5 -rotate-45 text-[#e9cd85]" />
                  </span>
                  <h2 className="mt-5 font-display text-[22px] leading-tight text-[#f7f0e1]">
                    {data.venueName || "محل جشن"}
                  </h2>
                  {data.venueAddress ? (
                    <p className="mt-2 text-[12px] leading-6 text-[#f7f0e1]/55">
                      {data.venueAddress}
                    </p>
                  ) : null}

                  {query ? (
                    <div className="mt-6 grid grid-cols-3 gap-2">
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
                          className="flex items-center justify-center gap-1.5 border border-[#c9a227]/35 py-2.5 text-[11px] text-[#f4e3b0] transition hover:bg-[#c9a227]/10"
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
                      className="mt-2 flex items-center justify-center gap-2 bg-[linear-gradient(100deg,#b8912a,#f4e3b0_46%,#c9a227)] py-3 text-[11px] font-medium text-[#241c06] transition hover:brightness-105"
                    >
                      <CalendarDays className="h-4 w-4" />
                      افزودن به تقویم
                    </a>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {/* ————— Dress code ————— */}
          <section className="relative px-4 pt-16">
            <FanOrnament className="mx-auto h-8 w-24 opacity-70" />
            <SectionLabel>Dress Code</SectionLabel>
            <h2 className="mt-3 text-center font-display text-[26px] text-[#f7f0e1]">
              پالت شب
            </h2>
            <p className="mt-3 text-center text-[12.5px] leading-7 text-[#f7f0e1]/55">
              {theme.dressCode}
            </p>

            <div className="mt-7 grid grid-cols-4 gap-x-3">
              {SWATCHES.map((swatch) => (
                <div key={swatch.label} className="flex flex-col items-center">
                  <span className="relative flex h-11 w-11 rotate-45 items-center justify-center border border-[#c9a227]/45">
                    <span
                      className="absolute inset-[4px] border border-white/10"
                      style={{ backgroundColor: swatch.color }}
                    />
                  </span>
                  <span className="mt-4 text-center text-[10px] leading-4 text-[#f7f0e1]/60">
                    {swatch.label}
                  </span>
                  <span className="text-center text-[7px] uppercase tracking-[0.22em] text-[#c9a227]/45">
                    {swatch.en}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ————— RSVP ————— */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="relative scroll-mt-20 px-4 pt-16">
              <SectionLabel>R · S · V · P</SectionLabel>

              <div
                className="relative mt-5 overflow-hidden border px-5 py-7 text-[#1d1915] shadow-[0_30px_70px_-32px_rgba(0,0,0,0.95)]"
                style={{
                  borderColor: "rgba(176,138,42,0.45)",
                  backgroundImage: `linear-gradient(165deg,${CREAM_TOP} 0%,${CREAM_MID} 48%,${CREAM_DEEP} 100%)`,
                }}
              >
                <span className="pointer-events-none absolute inset-0 border border-[#b08a2a]/40" />
                <span className="pointer-events-none absolute inset-[7px] border border-[#b08a2a]/18" />
                <DecoCorner className="pointer-events-none absolute right-[10px] top-[10px] h-6 w-6" />
                <DecoCorner className="pointer-events-none absolute left-[10px] top-[10px] h-6 w-6 -rotate-90" />
                <DecoCorner className="pointer-events-none absolute bottom-[10px] left-[10px] h-6 w-6 rotate-180" />
                <DecoCorner className="pointer-events-none absolute bottom-[10px] right-[10px] h-6 w-6 rotate-90" />

                <div className="flex justify-center">
                  <span className="flex h-11 w-11 rotate-45 items-center justify-center border border-[#b08a2a]/60 bg-[#b08a2a]/5">
                    <Heart className="h-5 w-5 -rotate-45 text-[#8a6a1f]" />
                  </span>
                </div>

                <p className="mt-5 text-center text-[8px] uppercase tracking-[0.4em] text-[#a08040]">
                  Kindly Reply
                </p>
                <h2 className="mt-1.5 text-center font-display text-[25px] text-[#1d1915]">
                  افتخار حضور
                </h2>
                <p className="mx-auto mt-2 max-w-[280px] text-center text-[12px] leading-6 text-[#4a4034]">
                  لطفاً با ثبت پاسخ خود، ما را در آماده‌سازی این شب یاری کنید.
                </p>

                {stamped ? (
                  <div
                    className="mt-7 flex flex-col items-center gap-3"
                    style={{ animation: "gd-rise 520ms ease-out both" }}
                  >
                    <GoldSeal monogram={monogram} />
                    <p className="text-center font-display text-[16px] leading-7 text-[#2a2118]">
                      {attending
                        ? "با مهر طلایی ثبت شد؛ چشم به راهتان هستیم"
                        : "پاسخ شما با مهر طلایی ثبت شد"}
                    </p>
                    <p className="text-center text-[11px] text-[#7a6440]">
                      {attending
                        ? `${guests.toLocaleString("fa-IR")} نفر · ${couple}`
                        : "دلمان با شماست"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStamped(false)}
                      className="mt-1 text-[11px] text-[#8a6a1f] underline decoration-[#b08a2a]/40 underline-offset-4"
                    >
                      تغییر پاسخ
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {[
                        { value: true, label: "با افتخار می‌آیم" },
                        { value: false, label: "دلم با شماست" },
                      ].map(({ value, label }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAttending(value)}
                          aria-pressed={attending === value}
                          className={`border py-3 text-[12px] transition ${
                            attending === value
                              ? "border-[#8a6a1f] bg-[#1d1915] text-[#f4e3b0]"
                              : "border-[#b08a2a]/35 text-[#4a4034] hover:border-[#b08a2a]/60"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div
                      className={`mt-3 flex items-center justify-between border border-dashed border-[#b08a2a]/40 px-4 py-2.5 transition ${
                        attending ? "" : "pointer-events-none opacity-40"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-[12px] text-[#3a2f22]">
                        <Users className="h-4 w-4 text-[#8a6a1f]" />
                        شمار همراهان
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="کاهش همراهان"
                          onClick={() => setGuests((value) => Math.max(1, value - 1))}
                          className="flex h-8 w-8 items-center justify-center border border-[#b08a2a]/45 text-[#3a2f22] active:scale-90"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-display text-[19px] text-[#1d1915]">
                          {guests.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          aria-label="افزایش همراهان"
                          onClick={() => setGuests((value) => Math.min(8, value + 1))}
                          className="flex h-8 w-8 items-center justify-center bg-[#1d1915] text-[#f4e3b0] active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStamped(true)}
                      className="mt-5 flex w-full items-center justify-center gap-2 bg-[linear-gradient(100deg,#b8912a,#f4e3b0_46%,#c9a227)] py-3 text-[12px] font-medium text-[#241c06] transition hover:brightness-105 active:scale-[0.99]"
                    >
                      <Sparkles className="h-4 w-4" />
                      {preview ? "پاسخ را با مهر طلایی ثبت کن" : "ثبت پاسخ با مهر طلایی"}
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : null}

          {/* ————— Blessing ————— */}
          <section className="relative px-6 pb-10 pt-16 text-center">
            <FanOrnament className="mx-auto h-10 w-28" />
            <p className="mt-4 font-display text-[22px] leading-9 text-[#e9cd85]">
              {theme.blessingLine}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#f7f0e1]/45">
              <Music2 className="h-3.5 w-3.5 text-[#c9a227]/70" />
              {theme.musicTitle}
            </div>

            <DecoDivider className="mt-7" />

            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-[#c9a227]/30" />
              <MonogramDiamond text={monogram} size={48} />
              <span className="h-px w-10 bg-[#c9a227]/30" />
            </div>

            <p className="mt-5 text-[9px] uppercase tracking-[0.34em] text-[#c9a227]/60">
              {latinDate}
            </p>
            <p className="mt-2 text-[11px] text-[#f7f0e1]/50">
              {couple} · {data.venueName || "عمارت یاس سفید"}
            </p>
          </section>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-md border-t border-[#c9a227]/25 bg-[#0b0a09]/92 backdrop-blur-md">
          <div className="flex h-16 items-center justify-around px-2">
            {[
              { href: "#invitation", label: "دعوت", Icon: ScrollText },
              { href: "#schedule", label: "شب", Icon: Clock },
              { href: "#location", label: "نشانی", Icon: MapPin },
              { href: "#rsvp", label: "پاسخ", Icon: Heart },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="flex min-w-[56px] flex-col items-center gap-1 text-[10px] text-[#f7f0e1]/55 transition hover:text-[#f4e3b0]"
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
