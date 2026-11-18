"use client";

import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock,
  Coffee,
  Compass,
  Heart,
  MapPin,
  Minus,
  Moon,
  Music2,
  Navigation,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ScrollText,
  Sparkles,
  Sun,
  Sunrise,
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

const DEFAULT_COVER = "/images/templates/orsi-palace-cover.jpg";

/** پالت رنگ‌های عمارت اُرسی و شیشه‌های هفت‌رنگ */
const WALNUT_DEEP = "#140d09";
const GOLD = "#d4a84f";
const GOLD_LIGHT = "#f7e5b7";
const GOLD_DARK = "#8e6920";
const RUBY = "#c82846";
const EMERALD = "#187a62";
const LAPIS = "#1e4d92";
const AMBER = "#e59a28";
const TURQUOISE = "#1e8c8a";
const ALABASTER_TOP = "#fbf6ec";
const ALABASTER_MID = "#f4ead8";
const ALABASTER_DEEP = "#e8d7bc";

type LightMood = "morning" | "sunset" | "moonlight";

const MOOD_CONFIG: Record<
  LightMood,
  {
    label: string;
    subtitle: string;
    bg: string;
    raysOpacity: number;
    poolGlow: string;
    beamColors: [string, string, string, string];
  }
> = {
  morning: {
    label: "آفتابِ صبح",
    subtitle: "تابش منشور هفت‌رنگ بر تالار شاه‌نشین",
    bg: "#140d09",
    raysOpacity: 0.85,
    poolGlow: "rgba(30, 140, 138, 0.42)",
    beamColors: [RUBY, AMBER, EMERALD, LAPIS],
  },
  sunset: {
    label: "طلاییِ عصر",
    subtitle: "نور زعفرانی و یاقوتیِ هنگامه‌ی غروب",
    bg: "#190e0a",
    raysOpacity: 0.92,
    poolGlow: "rgba(229, 154, 40, 0.38)",
    beamColors: ["#d93848", "#f0a830", "#c86432", "#9e2a4b"],
  },
  moonlight: {
    label: "مهتابِ شب",
    subtitle: "درخشش چلچراغ تالار در شبِ لاجوردی",
    bg: "#0c111d",
    raysOpacity: 0.65,
    poolGlow: "rgba(56, 132, 186, 0.45)",
    beamColors: ["#2b6cb0", "#187a62", "#d4a84f", "#5a4fcf"],
  },
};

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "رواقِ اول · پیشواز در حیاط نارنجستان",
    description: "خوشامدگویی با شربت بهارنارنج، گلابِ کاشان و نوای سنتور",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "رواقِ دوم · آیین پیوند در شاه‌نشینِ اُرسی",
    description: "جاری شدن خطبه‌ی عقد زیر طاقِ شیشه‌های هفت‌رنگ و باران نقل و گلبرگ",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "رواقِ سوم · ضیافتِ شامِ عمارت",
    description: "پذیرایی تشریفاتی در تالار آینه و ایوانِ رو به حوض فیروزه",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "رواقِ چهارم · سماعِ نور و پایکوبی",
    description: "جشن، موسیقی زنده و افروختن مشعل‌های حوض تا پاسی از شب",
    icon: "music",
  },
];

const JEWEL_SWATCHES = [
  {
    color: RUBY,
    label: "یاقوتی",
    en: "Persian Ruby",
    tip: "شال، کراوات یا جزئیات مخمل یاقوتی در کنار رنگ‌های خنثی درخششی شاهانه دارد.",
  },
  {
    color: EMERALD,
    label: "زمردی",
    en: "Orsi Emerald",
    tip: "سبز زمردی و یشمی، همنشین بی‌نظیر طلایی در قاب‌های عکاسی عمارت است.",
  },
  {
    color: AMBER,
    label: "کهربایی",
    en: "Saffron Gold",
    tip: "طیف طلایی کهنه، زعفرانی و شامپاینی هماهنگ با گره‌چینی‌های چوبی تالار.",
  },
  {
    color: LAPIS,
    label: "لاجوردی",
    en: "Kashan Lapis",
    tip: "کت‌وشلوار یا لباس شب سرمه‌ای و لاجوردی، وقار شبانه بی‌همتایی می‌آفریند.",
  },
  {
    color: "#efe4ce",
    label: "حریریِ عاجی",
    en: "Warm Silk",
    tip: "رنگ‌های کرم، شنی و بژ گرم (لطفاً سفید کامل را به عروس اختصاص دهید).",
  },
];

const WISH_OPTIONS = [
  { id: "light", label: "روشنایی و برکت", color: AMBER },
  { id: "love", label: "عشقِ جاودان", color: RUBY },
  { id: "joy", label: "شادیِ بی‌کران", color: EMERALD },
] as const;

const DUST_MOTES = [
  { top: "14%", left: "18%", size: 3, delay: "0s", dur: "4.6s", color: GOLD_LIGHT },
  { top: "24%", left: "78%", size: 2.5, delay: "1.1s", dur: "5.2s", color: "#ff9eb0" },
  { top: "36%", left: "26%", size: 3.5, delay: "0.5s", dur: "4.2s", color: "#9ee8d5" },
  { top: "44%", left: "68%", size: 2, delay: "1.9s", dur: "5.8s", color: GOLD_LIGHT },
  { top: "58%", left: "15%", size: 3, delay: "2.3s", dur: "4.9s", color: "#f9d67a" },
  { top: "64%", left: "82%", size: 2.5, delay: "0.8s", dur: "5.4s", color: "#9ec5ff" },
  { top: "75%", left: "32%", size: 2, delay: "1.5s", dur: "4.5s", color: GOLD_LIGHT },
  { top: "72%", left: "64%", size: 3, delay: "2.7s", dur: "5.1s", color: "#ff9eb0" },
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
    return `${format({ day: "2-digit" })} · ${format({ month: "2-digit" })} · ${format({ year: "numeric" })}`;
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

/** شمسه‌ی شیشه‌رنگی هشت‌پر (گره‌چینی اُرسی) */
function StainedRosette({
  size = 44,
  centerColor = RUBY,
  petalColors = [AMBER, EMERALD, LAPIS, RUBY],
  className = "",
  children,
}: {
  size?: number;
  centerColor?: string;
  petalColors?: [string, string, string, string];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden={!children}
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
        {/* قاب هشت‌پر طلایی */}
        <polygon
          points="32,2 41,11 55,9 53,23 62,32 53,41 55,55 41,53 32,62 23,53 9,55 11,41 2,32 11,23 9,9 23,11"
          fill="#1b110c"
          stroke={GOLD}
          strokeWidth="1.5"
        />
        {/* گلبرگ‌های شیشه‌رنگی */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => (
          <g key={deg} transform={`rotate(${deg} 32 32)`}>
            <polygon
              points="32,6 37,18 32,25 27,18"
              fill={petalColors[idx % 4]}
              fillOpacity="0.88"
              stroke={GOLD}
              strokeWidth="0.9"
            />
          </g>
        ))}
        <circle
          cx="32"
          cy="32"
          r="11"
          fill={centerColor}
          stroke={GOLD_LIGHT}
          strokeWidth="1.3"
        />
        <circle
          cx="32"
          cy="32"
          r="7.5"
          fill="none"
          stroke={GOLD_LIGHT}
          strokeWidth="0.6"
          strokeDasharray="2 1.5"
        />
      </svg>
      {children ? (
        <span className="relative z-10 flex items-center justify-center font-display text-[#fff9ec]">
          {children}
        </span>
      ) : null}
    </span>
  );
}

/** سرپوش و عنوان هر بخش با جواهرهای شیشه‌ای */
function OrsiSectionHeader({
  en,
  title,
  subtitle,
}: {
  en: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center gap-2.5">
        <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(212,168,79,0.75))]" />
        <span className="h-2 w-2 rotate-45 border border-[#d4a84f] bg-[#c82846]" />
        <span className="text-[9px] uppercase tracking-[0.38em] text-[#f7e5b7]/80">
          {en}
        </span>
        <span className="h-2 w-2 rotate-45 border border-[#d4a84f] bg-[#187a62]" />
        <span className="h-px w-10 bg-[linear-gradient(270deg,transparent,rgba(212,168,79,0.75))]" />
      </div>
      <h2 className="mt-2.5 font-display text-[27px] leading-tight text-[#fbf6ec]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 max-w-[290px] text-[11.5px] leading-6 text-[#fbf6ec]/60">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** گوشه‌نگارِ گره‌چینی برای کارت‌های عاجی */
function GerehCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        d="M2 28 V2 H28"
        fill="none"
        stroke={GOLD_DARK}
        strokeWidth="1.5"
      />
      <path
        d="M7 36 V7 H36"
        fill="none"
        stroke={GOLD_DARK}
        strokeWidth="0.8"
        opacity="0.65"
      />
      <polygon
        points="2,2 11,2 11,11 2,11"
        fill={RUBY}
        fillOpacity="0.85"
        stroke={GOLD_DARK}
        strokeWidth="0.9"
      />
      <polygon
        points="14,7 19,12 14,17 9,12"
        fill={TURQUOISE}
        fillOpacity="0.85"
        stroke={GOLD_DARK}
        strokeWidth="0.8"
      />
      <circle cx="22" cy="7" r="1.8" fill={AMBER} />
      <circle cx="7" cy="22" r="1.8" fill={AMBER} />
    </svg>
  );
}

/** جداکننده‌ی شیشه‌رنگی بین متون */
function StainedDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-hidden
    >
      <span className="h-px w-12 bg-[linear-gradient(90deg,transparent,rgba(142,105,32,0.65))]" />
      <span className="h-2 w-2 rotate-45 border border-[#8e6920] bg-[#1e4d92]" />
      <span className="h-3 w-3 rotate-45 border border-[#8e6920] bg-[#c82846]" />
      <span className="h-2.5 w-2.5 rotate-45 border border-[#8e6920] bg-[#e59a28]" />
      <span className="h-3 w-3 rotate-45 border border-[#8e6920] bg-[#187a62]" />
      <span className="h-2 w-2 rotate-45 border border-[#8e6920] bg-[#1e4d92]" />
      <span className="h-px w-12 bg-[linear-gradient(270deg,transparent,rgba(142,105,32,0.65))]" />
    </div>
  );
}

/** پنجره‌ی اُرسیِ سه‌لَت با اَرسِ متحرک و کلاله‌ی شیشه‌رنگی */
function InteractiveOrsiWindow({
  uid,
  sashOpen,
  onToggleSash,
  cover,
  couple,
  monogram,
  mood,
}: {
  uid: string;
  sashOpen: boolean;
  onToggleSash: () => void;
  cover: string;
  couple: string;
  monogram: string;
  mood: LightMood;
}) {
  const moodColors = MOOD_CONFIG[mood].beamColors;

  return (
    <div className="relative mx-auto w-full max-w-[336px] select-none">
      {/* هاله‌ی نور پشت پنجره‌ی اُرسی */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-t-full opacity-80 blur-2xl transition-all duration-1000"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 35%, ${moodColors[0]}55 0%, ${moodColors[1]}44 36%, ${moodColors[2]}33 65%, transparent 80%)`,
        }}
        aria-hidden
      />

      {/* چارچوب چوبی طاقِ شاه‌نشین */}
      <div
        className="relative overflow-hidden border-[3px] border-[#d4a84f]/80 bg-[#19100b] shadow-[0_28px_70px_-20px_rgba(0,0,0,0.95),inset_0_0_30px_rgba(0,0,0,0.85)]"
        style={{
          borderRadius: "170px 170px 16px 16px",
        }}
      >
        {/* لایه‌ی اول (پشت پنجره): شاه‌نشین، عکس زوج و منظره‌ی عمارت */}
        <div className="relative aspect-[3/4.1] w-full overflow-hidden">
          {/* تصویر زوج در قاب شاه‌نشین */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={couple}
            className="h-full w-full object-cover transition-all duration-1000 ease-out"
            style={{
              transform: sashOpen ? "scale(1.03)" : "scale(1.12)",
              filter: sashOpen
                ? "contrast(1.04) saturate(1.06)"
                : "brightness(0.68) contrast(1.08) saturate(1.15)",
            }}
          />

          {/* سایه‌روشنِ مخملی داخل شاه‌نشین */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(20,13,9,0.55) 0%, transparent 35%, rgba(20,13,9,0.25) 68%, rgba(20,13,9,0.88) 100%)",
            }}
          />

          {/* پرتوهای نورِ شیشه‌های رنگی که روی تصویر زوج می‌افتد */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-1000"
            style={{
              opacity: sashOpen ? 0.45 : 0.78,
              backgroundImage: `
                linear-gradient(125deg, ${moodColors[0]}66 0%, transparent 38%),
                linear-gradient(235deg, ${moodColors[2]}66 0%, transparent 42%),
                radial-gradient(circle at 50% 24%, ${moodColors[1]}77 0%, transparent 55%)
              `,
            }}
          />

          {/* ستون‌های مقرنس و طاق درونی شاه‌نشین */}
          <svg
            viewBox="0 0 300 410"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id={`${uid}-arch-gold`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f7e5b7" />
                <stop offset="50%" stopColor="#d4a84f" />
                <stop offset="100%" stopColor="#7a5614" />
              </linearGradient>
            </defs>
            {/* قوس مقرنس طلایی دور شاه‌نشین */}
            <path
              d="M12 405 V155 A138 138 0 0 1 288 155 V405"
              fill="none"
              stroke={`url(#${uid}-arch-gold)`}
              strokeWidth="2.5"
              opacity="0.75"
            />
            <path
              d="M20 405 V155 A130 130 0 0 1 280 155 V405"
              fill="none"
              stroke={`url(#${uid}-arch-gold)`}
              strokeWidth="0.9"
              strokeDasharray="4 3"
              opacity="0.55"
            />
          </svg>

          {/* کلاله‌ی ثابتِ بالای طاق (شمسه‌ی تاج اُرسی که همیشه می‌درخشد) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[132px]">
            <svg viewBox="0 0 300 135" className="h-full w-full" aria-hidden>
              <defs>
                <radialGradient id={`${uid}-crown-glow`} cx="50%" cy="65%" r="60%">
                  <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.95" />
                  <stop offset="45%" stopColor={AMBER} stopOpacity="0.75" />
                  <stop offset="100%" stopColor={RUBY} stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* پس‌زمینه‌ی کلاله با گره‌چینی خورشیدی */}
              <path
                d="M12 132 A138 138 0 0 1 288 132 Z"
                fill="#1b110c"
                fillOpacity="0.86"
                stroke={GOLD}
                strokeWidth="2"
              />
              {/* پره‌های شیشه‌رنگیِ کلاله (خورشید نیم‌دایره بالای ارسی) */}
              {[-75, -50, -25, 0, 25, 50, 75].map((angle, idx) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                const rOuter = 128;
                const rInner = 34;
                const spread = 0.19;
                const x1 = 150 + rInner * Math.cos(rad - spread);
                const y1 = 132 + rInner * Math.sin(rad - spread);
                const x2 = 150 + rOuter * Math.cos(rad - spread * 0.85);
                const y2 = 132 + rOuter * Math.sin(rad - spread * 0.85);
                const x3 = 150 + rOuter * Math.cos(rad + spread * 0.85);
                const y3 = 132 + rOuter * Math.sin(rad + spread * 0.85);
                const x4 = 150 + rInner * Math.cos(rad + spread);
                const y4 = 132 + rInner * Math.sin(rad + spread);
                const colors = [LAPIS, EMERALD, RUBY, AMBER, RUBY, EMERALD, LAPIS];
                return (
                  <polygon
                    key={angle}
                    points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
                    fill={colors[idx]}
                    fillOpacity="0.84"
                    stroke={GOLD}
                    strokeWidth="1.2"
                  />
                );
              })}
              {/* لوزی‌های شیشه‌ای میانی */}
              {[-62.5, -37.5, -12.5, 12.5, 37.5, 62.5].map((angle, idx) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                const cx = 150 + 82 * Math.cos(rad);
                const cy = 132 + 82 * Math.sin(rad);
                return (
                  <circle
                    key={angle}
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill={idx % 2 === 0 ? GOLD_LIGHT : TURQUOISE}
                    stroke="#1b110c"
                    strokeWidth="1"
                  />
                );
              })}
              {/* نیم‌شمسه‌ی مرکزی بالای ارسی */}
              <circle
                cx="150"
                cy="132"
                r="34"
                fill={`url(#${uid}-crown-glow)`}
                stroke={GOLD_LIGHT}
                strokeWidth="1.6"
              />
              <line
                x1="10"
                y1="132"
                x2="290"
                y2="132"
                stroke={GOLD}
                strokeWidth="3"
              />
            </svg>
          </div>

          {/* لایه‌ی دوم: لَت‌های متحرک پنجره‌ی اُرسی که به بالا می‌لغزد */}
          <div
            onClick={onToggleSash}
            role="button"
            tabIndex={0}
            aria-expanded={sashOpen}
            aria-label={sashOpen ? "پایین کشیدن پنجره ارسی" : "بالا بردن پنجره ارسی"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleSash();
              }
            }}
            className="absolute inset-x-[10px] bottom-[34px] top-[130px] z-20 cursor-pointer transition-transform duration-[1150ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: sashOpen ? "translateY(-78%)" : "translateY(0%)",
            }}
          >
            {/* قاب چوبی سه‌لَتِ اُرسی با شیشه‌های رنگی و گره‌چینی */}
            <div className="relative h-full w-full overflow-hidden border-2 border-[#d4a84f] bg-[#1c110b]/92 shadow-[0_18px_36px_rgba(0,0,0,0.85)] backdrop-blur-[2px]">
              <svg viewBox="0 0 280 240" className="h-full w-full" aria-hidden>
                {/* سه لَتِ عمودی اُرسی */}
                {[0, 1, 2].map((col) => {
                  const x = 6 + col * 90;
                  const w = 88;
                  const isCenter = col === 1;
                  return (
                    <g key={col}>
                      {/* چهارچوب هر لَت */}
                      <rect
                        x={x}
                        y="6"
                        width={w}
                        height="226"
                        fill="#170e09"
                        fillOpacity="0.65"
                        stroke={GOLD}
                        strokeWidth="2"
                      />
                      {/* طاقِ ظریف بالای هر لَت */}
                      <path
                        d={`M${x + 4} 52 A${w / 2 - 4} 36 0 0 1 ${x + w - 4} 52`}
                        fill={isCenter ? RUBY : LAPIS}
                        fillOpacity="0.72"
                        stroke={GOLD}
                        strokeWidth="1.2"
                      />
                      {/* شیشه‌های لوزیِ بالا و پایین در هر لَت */}
                      {[
                        { cy: 68, c1: AMBER, c2: EMERALD },
                        { cy: 122, c1: isCenter ? RUBY : TURQUOISE, c2: AMBER },
                        { cy: 176, c1: EMERALD, c2: LAPIS },
                      ].map((row, rIdx) => {
                        const cx = x + w / 2;
                        return (
                          <g key={rIdx}>
                            {/* قاب شبکه‌ی گره‌چینی */}
                            <polygon
                              points={`${cx},${row.cy - 24} ${cx + 34},${row.cy} ${cx},${row.cy + 24} ${cx - 34},${row.cy}`}
                              fill={row.c1}
                              fillOpacity="0.78"
                              stroke={GOLD}
                              strokeWidth="1.3"
                            />
                            {/* ستاره‌ی درونی گره */}
                            <polygon
                              points={`${cx},${row.cy - 12} ${cx + 16},${row.cy} ${cx},${row.cy + 12} ${cx - 16},${row.cy}`}
                              fill={row.c2}
                              fillOpacity="0.9"
                              stroke={GOLD_LIGHT}
                              strokeWidth="0.9"
                            />
                            {/* لچکی‌های شیشه‌رنگی گوشه‌ها */}
                            <circle
                              cx={cx - 28}
                              cy={row.cy - 18}
                              r="4.2"
                              fill={RUBY}
                              stroke={GOLD}
                              strokeWidth="0.7"
                            />
                            <circle
                              cx={cx + 28}
                              cy={row.cy - 18}
                              r="4.2"
                              fill={AMBER}
                              stroke={GOLD}
                              strokeWidth="0.7"
                            />
                          </g>
                        );
                      })}
                      {/* نوار شیشه‌ای پایینی لَت */}
                      <rect
                        x={x + 8}
                        y="206"
                        width={w - 16}
                        height="18"
                        fill={isCenter ? AMBER : RUBY}
                        fillOpacity="0.82"
                        stroke={GOLD}
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* پلاک مونوگرام طلایی در قلب لَتِ میانی */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border-2 border-[#f7e5b7] bg-[radial-gradient(circle,#2a1810_0%,#120a06_100%)] shadow-[0_0_25px_rgba(212,168,79,0.65)]">
                <span className="-rotate-45 font-display text-[15px] tracking-tight text-[#f7e5b7]">
                  {monogram}
                </span>
              </div>

              {/* دستگیره و چفتِ برنجیِ پایین اُرسی */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-[linear-gradient(180deg,transparent,rgba(18,10,6,0.95))] pb-1.5 pt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f7e5b7]/70 bg-[#24150e]/95 px-3.5 py-1 text-[10px] font-medium text-[#f7e5b7] shadow-[0_4px_14px_rgba(0,0,0,0.75)]">
                  <Sparkles className="h-3 w-3 text-[#e59a28]" />
                  {sashOpen ? "بستنِ اُرسی" : "لمس چفت برای گشودنِ اُرسی"}
                </span>
              </div>
            </div>
          </div>

          {/* لبه‌ی ایوان و حوضِ فیروزه‌ای در پای پنجره‌ی اُرسی */}
          <div className="absolute inset-x-0 bottom-0 z-30 flex h-[36px] items-center justify-between border-t-2 border-[#d4a84f] bg-[linear-gradient(90deg,#123e42_0%,#1e8c8a_50%,#123e42_100%)] px-4 shadow-[inset_0_2px_10px_rgba(255,255,255,0.28)]">
            <span className="h-2 w-2 rotate-45 border border-[#f7e5b7] bg-[#e59a28]" />
            <span className="text-[10px] tracking-[0.18em] text-[#fbf6ec]/95">
              حوضِ فیروزه‌نشانِ شاه‌نشین
            </span>
            <span className="h-2 w-2 rotate-45 border border-[#f7e5b7] bg-[#c82846]" />
          </div>
        </div>
      </div>

      {/* فرشِ نورِ شیشه‌های رنگی که زیر پنجره روی زمین می‌افتد */}
      <div
        className="pointer-events-none relative mx-auto -mt-1 h-10 w-[92%] overflow-hidden rounded-b-3xl transition-all duration-1000"
        style={{
          opacity: MOOD_CONFIG[mood].raysOpacity,
          backgroundImage: `linear-gradient(90deg, ${moodColors[3]}55 0%, ${moodColors[0]}75 28%, ${moodColors[1]}85 52%, ${moodColors[2]}75 76%, ${moodColors[3]}55 100%)`,
          filter: "blur(6px)",
          transform: "perspective(180px) rotateX(38deg)",
        }}
        aria-hidden
      />
    </div>
  );
}

export function OrsiPalaceRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, "");

  // در پیش‌نمایش و پس از ورود، پنجره ارسی آرام به بالا می‌لغزد تا هم شیشه‌های رنگی و هم تصویر زوج بدرخشند
  const [sashOpen, setSashOpen] = useState(false);
  const [mood, setMood] = useState<LightMood>("morning");
  const [playingMusic, setPlayingMusic] = useState(false);
  const [selectedSwatch, setSelectedSwatch] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [wishId, setWishId] = useState<(typeof WISH_OPTIONS)[number]["id"]>("light");
  const [poolSealed, setPoolSealed] = useState(false);

  useEffect(() => {
    const delay = features?.entranceAnimation === false ? 80 : 750;
    const timer = window.setTimeout(() => setSashOpen(true), delay);
    return () => window.clearTimeout(timer);
  }, [features?.entranceAnimation]);

  const theme: TemplateCustomization = {
    primaryColor: GOLD,
    secondaryColor: TURQUOISE,
    backgroundColor: WALNUT_DEEP,
    poeticLine:
      "«رواقِ منظرِ چشمِ من آشیانه‌ی توست، کرم نما و فرود آ که خانه خانه‌ی توست»",
    blessingLine:
      "در پناهِ نورِ هفت‌رنگ و طاقِ بلندِ عشق، قدومِ پرمهرتان روشنایی‌بخشِ شبِ پیوندِ ماست.",
    dressCode:
      "پوشش رسمی شب با الهام از شیشه‌های هفت‌رنگِ اُرسی؛ طیف یاقوتی، زمردی، کهربایی، لاجوردی و حریری عاجی.",
    musicTitle: "سنتور و تار · چهارمضرابِ نارنجستان",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const parts = datePartsOf(data.eventStartAt, data.timezone);
  const latinDate = latinDateOf(data.eventStartAt, data.timezone);
  const timeRange = formatEventTimeRange(
    data.eventStartAt,
    data.eventEndAt,
    data.timezone,
  );
  const startTime = timeRange
    ? timeRange.replace("ساعت ", "").split(" الی ")[0]
    : null;
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
  const query = encodeURIComponent(
    data.mapUrl ||
      [data.venueName, data.venueAddress].filter(Boolean).join(" ") ||
      "",
  );
  const families = [
    data.familyNames?.partnerOneFamily,
    data.familyNames?.partnerTwoFamily,
  ]
    .filter(Boolean)
    .join(" و ");

  const activeMood = MOOD_CONFIG[mood];
  const selectedWish =
    WISH_OPTIONS.find((w) => w.id === wishId) ?? WISH_OPTIONS[0];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans text-[#fbf6ec] transition-colors duration-700"
      style={
        {
          backgroundColor: activeMood.bg,
          "--op-gold": theme.primaryColor || GOLD,
          "--op-turq": theme.secondaryColor || TURQUOISE,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes op-foil {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes op-float {
          0%, 100% { transform: translateY(0px) scale(0.9); opacity: 0.35; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 0.95; }
        }
        @keyframes op-ripple {
          0% { transform: scale(0.55); opacity: 0.85; }
          100% { transform: scale(1.65); opacity: 0; }
        }
        @keyframes op-eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes op-spin-slow {
          to { transform: rotate(360deg); }
        }
        .op-gold-foil {
          background-image: linear-gradient(100deg, #9a7122 0%, #d4a84f 18%, #fff3d1 36%, #f7e5b7 48%, #d4a84f 66%, #9a7122 84%, #f7e5b7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: op-foil 9s linear infinite;
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-md overflow-x-clip">
        {/* نقش هندسی گره‌چینی در پس‌زمینه‌ی کل عمارت */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 8%, ${activeMood.beamColors[0]}40 0%, transparent 45%),
              radial-gradient(circle at 50% 55%, ${activeMood.poolGlow} 0%, transparent 50%),
              repeating-linear-gradient(45deg, rgba(212,168,79,0.12) 0 1px, transparent 1px 28px),
              repeating-linear-gradient(-45deg, rgba(212,168,79,0.12) 0 1px, transparent 1px 28px)
            `,
          }}
          aria-hidden
        />

        {/* نوار بالای عمارت */}
        <header className="sticky top-0 z-40 border-b border-[#d4a84f]/25 bg-[#140d09]/88 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4">
            <StainedRosette size={34} centerColor={RUBY}>
              <span className="text-[9px] font-bold">{monogram}</span>
            </StainedRosette>

            <div className="flex flex-col items-center leading-none">
              <span className="font-display text-[16px] text-[#f7e5b7]">
                عمارتِ اُرسیِ هفت‌رنگ
              </span>
              <span className="mt-1 text-[7.5px] uppercase tracking-[0.34em] text-[#d4a84f]/75">
                Persian Stained-Glass Palace
              </span>
            </div>

            {showMusic ? (
              <button
                type="button"
                onClick={() => setPlayingMusic((p) => !p)}
                aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d4a84f]/45 bg-[#23160f] text-[#f7e5b7] transition hover:border-[#f7e5b7]"
              >
                {playingMusic ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
                )}
              </button>
            ) : (
              <span className="text-[8px] uppercase tracking-[0.22em] text-[#d4a84f]/65">
                Est. 2027
              </span>
            )}
          </div>
        </header>

        <main className="relative z-10 pb-24">
          {/* ————— ۱. صحنه‌ی نخست: پنجره‌ی اُرسی و تالار شاه‌نشین ————— */}
          <section className="relative flex flex-col items-center overflow-hidden px-4 pb-10 pt-6 text-center">
            {/* پرتوهای مورب نور شیشه‌های رنگی در فضای تالار */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[540px] transition-opacity duration-1000"
              style={{
                opacity: activeMood.raysOpacity * 0.45,
                backgroundImage: `
                  conic-gradient(from 152deg at 50% 6%,
                    transparent 0deg,
                    ${activeMood.beamColors[0]}44 10deg,
                    transparent 20deg,
                    ${activeMood.beamColors[1]}44 32deg,
                    transparent 42deg,
                    ${activeMood.beamColors[2]}44 52deg,
                    transparent 64deg)
                `,
                filter: "blur(18px)",
              }}
              aria-hidden
            />

            {/* ذرات طلایی معلق در پرتو آفتاب */}
            {DUST_MOTES.map((mote, idx) => (
              <span
                key={idx}
                className="pointer-events-none absolute rounded-full"
                style={{
                  top: mote.top,
                  left: mote.left,
                  width: mote.size,
                  height: mote.size,
                  backgroundColor: mote.color,
                  boxShadow: `0 0 8px ${mote.color}`,
                  animation: `op-float ${mote.dur} ease-in-out ${mote.delay} infinite`,
                }}
                aria-hidden
              />
            ))}

            {/* کتیبه‌ی خوشامدگویی */}
            <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4a84f]/35 bg-[#23160f]/80 px-3.5 py-1 text-[10.5px] text-[#f7e5b7]/90 shadow-sm">
              <span className="h-2 w-2 rotate-45 bg-[#c82846]" />
              <span>بزمِ پیوند در شاه‌نشینِ هفت‌رنگ</span>
              <span className="h-2 w-2 rotate-45 bg-[#187a62]" />
            </div>

            {/* پنجره‌ی اُرسیِ تعاملی */}
            <InteractiveOrsiWindow
              uid={uid}
              sashOpen={sashOpen}
              onToggleSash={() => setSashOpen((o) => !o)}
              cover={cover}
              couple={couple}
              monogram={monogram}
              mood={mood}
            />

            {/* کلیدهای تغییر زاویه‌ی تابش نور از شیشه‌های اُرسی و باز/بستن پنجره */}
            <div className="relative z-10 mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {(
                [
                  { id: "morning", label: "آفتاب صبح", Icon: Sunrise },
                  { id: "sunset", label: "طلایی عصر", Icon: Sun },
                  { id: "moonlight", label: "مهتاب شب", Icon: Moon },
                ] as const
              ).map(({ id, label, Icon }) => {
                const active = mood === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMood(id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] transition ${
                      active
                        ? "border-[#f7e5b7] bg-[#d4a84f]/25 text-[#f7e5b7] shadow-[0_0_16px_rgba(212,168,79,0.3)]"
                        : "border-[#d4a84f]/25 bg-[#1b110c]/70 text-[#fbf6ec]/65 hover:border-[#d4a84f]/50"
                    }`}
                  >
                    <Icon className="h-3 w-3 text-[#e59a28]" />
                    {label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setSashOpen((o) => !o)}
                className="inline-flex items-center gap-1 rounded-full border border-[#1e8c8a]/60 bg-[#123e42]/60 px-3 py-1 text-[10.5px] text-[#a5f2ef] transition hover:bg-[#123e42]"
              >
                <Sparkles className="h-3 w-3" />
                {sashOpen ? "بستن اُرسی" : "گشودن اُرسی"}
              </button>
            </div>

            {/* نام عروس و داماد با فویل طلایی */}
            <div className="relative z-10 mt-6 flex flex-col items-center">
              <p className="text-[10px] tracking-[0.28em] text-[#d4a84f]/80">
                {activeMood.subtitle}
              </p>

              <h1 className="mt-3 flex flex-col items-center font-display text-[44px] leading-[1.2]">
                <span className="op-gold-foil px-3">{data.partnerOneName}</span>
                <span className="my-1 flex items-center gap-2.5">
                  <span className="h-px w-9 bg-[#d4a84f]/45" />
                  <StainedRosette size={24} centerColor={RUBY} />
                  <span className="h-px w-9 bg-[#d4a84f]/45" />
                </span>
                <span className="op-gold-foil px-3">{data.partnerTwoName}</span>
              </h1>

              <p className="mt-4 text-[12px] tracking-[0.12em] text-[#fbf6ec]/80">
                {parts.day && parts.month
                  ? `${parts.weekday} · ${parts.day} ${parts.month} ${parts.year}`
                  : "تاریخ به‌زودی اعلام می‌شود"}
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] text-[#f7e5b7]/85">
                <MapPin className="h-3.5 w-3.5 text-[#e59a28]" />
                {data.venueName || "عمارت یاس سفید"}
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center text-[#d4a84f]/70">
              <span className="text-[8px] uppercase tracking-[0.34em]">
                ورود به تالار
              </span>
              <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
            </div>
          </section>

          {/* ————— ۲. کارت دعوتِ شاه‌نشین (پشت‌بوم عاجی و گره‌چینی) ————— */}
          <section id="invitation" className="relative scroll-mt-20 px-4 pt-6">
            <OrsiSectionHeader
              en="The Royal Invitation"
              title="رقعهٔ دعوتِ شاه‌نشین"
              subtitle="مزین به گره‌چینیِ هفت‌رنگ و شعرِ خواجه‌ی شیراز"
            />

            <div
              className="relative mt-5 overflow-hidden border-2 px-5 pb-8 pt-7 text-[#1f140e] shadow-[0_28px_65px_-28px_rgba(0,0,0,0.95)]"
              style={{
                borderColor: "rgba(180,136,48,0.65)",
                backgroundImage: `linear-gradient(168deg, ${ALABASTER_TOP} 0%, ${ALABASTER_MID} 52%, ${ALABASTER_DEEP} 100%)`,
              }}
            >
              {/* نوار موزاییک شیشه‌رنگی در لبه‌ی بالای کارت */}
              <div className="pointer-events-none absolute inset-x-0 top-0 grid h-2 grid-cols-8">
                {[RUBY, AMBER, EMERALD, LAPIS, TURQUOISE, RUBY, AMBER, EMERALD].map(
                  (col, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: col }}
                      className="h-full w-full opacity-85"
                    />
                  ),
                )}
              </div>

              <span className="pointer-events-none absolute inset-[7px] border border-[#8e6920]/30" />
              <GerehCorner className="pointer-events-none absolute right-[10px] top-[14px] h-8 w-8" />
              <GerehCorner className="pointer-events-none absolute left-[10px] top-[14px] h-8 w-8 -scale-x-100" />
              <GerehCorner className="pointer-events-none absolute bottom-[10px] right-[10px] h-8 w-8 -scale-y-100" />
              <GerehCorner className="pointer-events-none absolute bottom-[10px] left-[10px] h-8 w-8 -scale-100" />

              <div className="flex justify-center pt-1">
                <StainedRosette size={48} centerColor={TURQUOISE}>
                  <span className="text-[11px] font-bold">{monogram}</span>
                </StainedRosette>
              </div>

              <p className="mt-3 text-center text-[10.5px] tracking-[0.28em] text-[#7a5614]">
                به نامِ آن که جان را فکرت آموخت
              </p>

              {/* بیت شعر حافظ */}
              <blockquote className="mx-auto mt-4 max-w-[300px] text-center font-display text-[19px] leading-9 text-[#2b1911]">
                {theme.poeticLine}
              </blockquote>

              <StainedDivider className="mt-4" />

              <p className="mt-4 text-center text-[13px] leading-8 text-[#3e2b1d]">
                {data.invitationText ||
                  "همچون پرتوِ آفتاب که از شیشه‌های هفت‌رنگِ اُرسی می‌گذرد و تالار را غرقِ نور می‌سازد، حضورِ گرمِ شما محفلِ پیوندِ ما را رنگین و جاودانه خواهد کرد."}
              </p>

              {families ? (
                <p className="mt-3 text-center text-[11.5px] font-medium text-[#7a5614]">
                  میزبانانِ شما: خاندان‌های {families}
                </p>
              ) : null}

              {/* کادر سه‌ستونی خلاصه‌ی جشن */}
              <div className="mt-6 grid grid-cols-3 divide-x divide-x-reverse divide-[#8e6920]/25 rounded-xl border border-[#8e6920]/30 bg-[#fbf6ec]/80 py-3 text-center">
                <div className="px-2">
                  <p className="text-[9px] text-[#7a5614]">روزِ موعود</p>
                  <p className="mt-1 font-display text-[14px] font-bold text-[#1f140e]">
                    {parts.day && parts.month
                      ? `${parts.day} ${parts.month}`
                      : "به‌زودی"}
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-[9px] text-[#7a5614]">ساعتِ آغاز</p>
                  <p className="mt-1 font-display text-[14px] font-bold text-[#1f140e]">
                    {startTime || "۱۸:۰۰"}
                  </p>
                </div>
                <div className="px-2">
                  <p className="text-[9px] text-[#7a5614]">نگینِ تالار</p>
                  <p className="mt-1 truncate font-display text-[13px] font-bold text-[#1f140e]">
                    {data.venueName || "عمارت یاس"}
                  </p>
                </div>
              </div>

              {/* پخش‌کننده‌ی نوای سنتور و تار */}
              {showMusic ? (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-[#8e6920]/35 bg-[#23160f] px-3.5 py-2.5 text-[#fbf6ec]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setPlayingMusic((p) => !p)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f7e5b7,#c89632)] text-[#1b110c] shadow"
                      aria-label={playingMusic ? "توقف نوای عمارت" : "پخش نوای عمارت"}
                    >
                      {playingMusic ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 translate-x-[0.5px]" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-medium text-[#f7e5b7]">
                        {theme.musicTitle}
                      </p>
                      <p className="text-[9.5px] text-[#fbf6ec]/60">
                        {playingMusic
                          ? "در حال نواختن در تالار شاه‌نشین…"
                          : "برای شنیدن نوای پیشواز لمس کنید"}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-4 items-end gap-0.5 px-1" aria-hidden>
                    {[0.6, 1, 0.75, 0.9, 0.5].map((h, idx) => (
                      <span
                        key={idx}
                        className="w-1 rounded-full bg-[#e59a28]"
                        style={{
                          height: `${h * 16}px`,
                          animation: playingMusic
                            ? `op-eq ${0.6 + idx * 0.14}s ease-in-out infinite`
                            : "none",
                          opacity: playingMusic ? 0.95 : 0.35,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {/* ————— ۳. ساعتِ آفتابیِ هفت‌رنگ و شمارش معکوس ————— */}
          <section className="relative px-4 pt-14">
            <OrsiSectionHeader
              en="The Solar Calendar"
              title="تقویمِ خورشیدی و شمارشِ لحظه‌ها"
              subtitle="تا گشوده شدنِ دروازه‌های عمارت به روی شما"
            />

            {/* قاب هشت‌ضلعی تاریخ */}
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#d4a84f]/40 bg-[linear-gradient(160deg,#23160f_0%,#160e09_100%)] p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)]">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
                <div className="rounded-xl border border-[#d4a84f]/20 bg-black/25 px-2 py-3">
                  <span className="inline-block h-2 w-2 rotate-45 bg-[#c82846]" />
                  <p className="mt-1 text-[9.5px] text-[#d4a84f]/75">روزِ هفته</p>
                  <p className="mt-1 font-display text-[17px] text-[#fbf6ec]">
                    {parts.weekday || "جمعه"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#fbf6ec]/50">
                    {parts.year || "۱۴۰۶"}
                  </p>
                </div>

                <div className="relative flex flex-col items-center px-3">
                  <div
                    className="pointer-events-none absolute -inset-2 rounded-full opacity-25"
                    style={{
                      border: `1px dashed ${GOLD}`,
                      animation: "op-spin-slow 40s linear infinite",
                    }}
                    aria-hidden
                  />
                  <span className="text-[9px] uppercase tracking-[0.28em] text-[#e59a28]">
                    {parts.month || "اردیبهشت"}
                  </span>
                  <span className="op-gold-foil mt-1 font-display text-[64px] leading-none">
                    {parts.day || "۳۱"}
                  </span>
                  <span className="mt-1.5 text-[9.5px] tracking-[0.18em] text-[#fbf6ec]/55">
                    {latinDate}
                  </span>
                </div>

                <div className="rounded-xl border border-[#d4a84f]/20 bg-black/25 px-2 py-3">
                  <span className="inline-block h-2 w-2 rotate-45 bg-[#187a62]" />
                  <p className="mt-1 text-[9.5px] text-[#d4a84f]/75">زمانِ بزم</p>
                  <p className="mt-1 font-display text-[17px] text-[#fbf6ec]">
                    {startTime || "۱۸:۰۰"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#fbf6ec]/50">به وقت تهران</p>
                </div>
              </div>

              {showCountdown ? (
                <div className="mt-6 border-t border-[#d4a84f]/20 pt-5">
                  <div className="mb-2.5 flex items-center justify-around px-2" aria-hidden>
                    {[RUBY, AMBER, EMERALD, LAPIS].map((col, idx) => (
                      <span
                        key={idx}
                        className="h-2.5 w-2.5 rotate-45 border border-[#f7e5b7]/70"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-xl [&>div]:border [&>div]:border-[#d4a84f]/35 [&>div]:bg-[#140d09]/90 [&>div]:py-3 [&_p:first-child]:font-display [&_p:first-child]:text-[25px] [&_p:first-child]:text-[#f7e5b7] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#d4a84f]/80"
                  />
                </div>
              ) : null}
            </div>
          </section>

          {/* ————— ۴. چهار رواقِ شبِ جشن (برنامه مراسم) ————— */}
          <section id="schedule" className="relative scroll-mt-20 px-4 pt-14">
            <OrsiSectionHeader
              en="The Four Courtyards"
              title="چهار رواقِ شبِ سور"
              subtitle="گذر از نارنجستان تا شاه‌نشینِ اُرسی"
            />

            <ul className="mt-6 space-y-3.5">
              {schedule.map((item, idx) => {
                const Icon = scheduleIcon(item.icon);
                const jewel = [RUBY, EMERALD, AMBER, LAPIS][idx % 4];
                return (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="relative overflow-hidden rounded-2xl border border-[#d4a84f]/30 bg-[linear-gradient(115deg,rgba(35,22,15,0.95),rgba(20,13,9,0.92))] p-3.5 shadow-md"
                  >
                    {/* نوار رنگی شیشه‌ای در سمت راست هر رواق */}
                    <span
                      className="absolute inset-y-0 right-0 w-1.5"
                      style={{ backgroundColor: jewel }}
                      aria-hidden
                    />

                    <div className="grid grid-cols-[68px_1fr] items-center gap-3.5 pr-1.5">
                      {/* طاقِ ساعت هر مرحله */}
                      <div
                        className="flex flex-col items-center justify-center border border-[#d4a84f]/45 bg-[#140d09] pb-2 pt-3 text-center"
                        style={{ borderRadius: "36px 36px 8px 8px" }}
                      >
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm"
                          style={{ backgroundColor: jewel }}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="mt-1.5 font-display text-[13px] text-[#f7e5b7]">
                          {item.time}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="font-display text-[17.5px] leading-snug text-[#fbf6ec]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[12px] leading-6 text-[#fbf6ec]/65">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ————— ۵. نشانی عمارت و قطب‌نمای حوض ————— */}
          {showMap ? (
            <section id="location" className="relative scroll-mt-20 px-4 pt-14">
              <OrsiSectionHeader
                en="The Mansion Courtyard"
                title="نشانیِ عمارت و مسیریابی"
                subtitle="چشم‌به‌راهِ گام‌های سبزتان در حیاط عمارت هستیم"
              />

              <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#d4a84f]/40 bg-[linear-gradient(165deg,#23160f_0%,#140d09_100%)] p-5 text-center shadow-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#d4a84f]/60 bg-[#123e42] text-[#f7e5b7] shadow-[0_0_24px_rgba(30,140,138,0.4)]">
                  <Compass className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-display text-[22px] text-[#f7e5b7]">
                  {data.venueName || "عمارت یاس سفید"}
                </h3>
                {data.venueAddress ? (
                  <p className="mx-auto mt-1.5 max-w-[290px] text-[12.5px] leading-6 text-[#fbf6ec]/70">
                    {data.venueAddress}
                  </p>
                ) : null}

                {query ? (
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      {
                        href: `https://neshan.org/maps/search/${query}`,
                        label: "مسیریابی نشان",
                        dot: RUBY,
                      },
                      {
                        href: `https://balad.ir/search?query=${query}`,
                        label: "مسیریابی بلد",
                        dot: EMERALD,
                      },
                      {
                        href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                        label: "گوگل‌مپ",
                        dot: LAPIS,
                      },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-[#d4a84f]/35 bg-[#1b110c] py-2.5 text-[11px] text-[#f7e5b7] transition hover:border-[#f7e5b7] hover:bg-[#d4a84f]/15"
                      >
                        <span
                          className="h-2 w-2 rotate-45"
                          style={{ backgroundColor: item.dot }}
                        />
                        <Navigation className="h-3 w-3" />
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
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(100deg,#b88928,#f7e5b7_48%,#c89632)] py-3 text-[12px] font-semibold text-[#1f140e] shadow-md transition hover:brightness-105"
                  >
                    <CalendarDays className="h-4 w-4" />
                    ثبتِ یادآور در تقویم گوگل
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* ————— ۶. پالتِ هفت‌رنگِ پوشش (Dress Code تعاملی) ————— */}
          <section className="relative px-4 pt-14">
            <OrsiSectionHeader
              en="Stained-Glass Attire"
              title="پالتِ هفت‌رنگِ پوشش"
              subtitle={theme.dressCode}
            />

            <div className="mt-6 grid grid-cols-5 gap-2">
              {JEWEL_SWATCHES.map((swatch, idx) => {
                const active = selectedSwatch === idx;
                return (
                  <button
                    key={swatch.label}
                    type="button"
                    onClick={() => setSelectedSwatch(idx)}
                    aria-pressed={active}
                    className="group flex flex-col items-center focus:outline-none"
                  >
                    <span
                      className={`relative flex h-12 w-12 rotate-45 items-center justify-center border-2 transition duration-300 ${
                        active
                          ? "scale-110 border-[#f7e5b7] shadow-[0_0_18px_rgba(247,229,183,0.45)]"
                          : "border-[#d4a84f]/45 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <span
                        className="absolute inset-[3px] border border-white/20"
                        style={{ backgroundColor: swatch.color }}
                      />
                    </span>
                    <span
                      className={`mt-3.5 text-center text-[10.5px] font-medium ${
                        active ? "text-[#f7e5b7]" : "text-[#fbf6ec]/65"
                      }`}
                    >
                      {swatch.label}
                    </span>
                    <span className="text-[7px] uppercase tracking-[0.16em] text-[#d4a84f]/55">
                      {swatch.en}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* راهنمای استایل رنگ انتخاب‌شده */}
            <div className="mt-4 rounded-xl border border-[#d4a84f]/25 bg-[#23160f]/80 px-4 py-3 text-center text-[11.5px] leading-6 text-[#f7e5b7]/90">
              <span className="font-semibold text-[#e59a28]">
                {JEWEL_SWATCHES[selectedSwatch].label}:{" "}
              </span>
              {JEWEL_SWATCHES[selectedSwatch].tip}
            </div>
          </section>

          {/* ————— ۷. حوضِ فیروزه و ثبتِ حضور (RSVP تعاملی با موجِ آب) ————— */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="relative scroll-mt-20 px-4 pt-14">
              <OrsiSectionHeader
                en="The Turquoise Pool R·S·V·P"
                title="حوضِ آرزو و اعلامِ حضور"
                subtitle="پاسخ و دعای خیرتان را همچون برگِ گلی در حوضِ فیروزه‌ایِ عمارت بیندازید"
              />

              <div
                className="relative mt-5 overflow-hidden border-2 px-5 py-7 text-[#1f140e] shadow-[0_28px_65px_-28px_rgba(0,0,0,0.95)]"
                style={{
                  borderColor: "rgba(180,136,48,0.65)",
                  backgroundImage: `linear-gradient(168deg, ${ALABASTER_TOP} 0%, ${ALABASTER_MID} 52%, ${ALABASTER_DEEP} 100%)`,
                }}
              >
                <span className="pointer-events-none absolute inset-[7px] border border-[#8e6920]/30" />
                <GerehCorner className="pointer-events-none absolute right-[10px] top-[10px] h-7 w-7" />
                <GerehCorner className="pointer-events-none absolute left-[10px] top-[10px] h-7 w-7 -scale-x-100" />
                <GerehCorner className="pointer-events-none absolute bottom-[10px] right-[10px] h-7 w-7 -scale-y-100" />
                <GerehCorner className="pointer-events-none absolute bottom-[10px] left-[10px] h-7 w-7 -scale-100" />

                {poolSealed ? (
                  <div className="flex flex-col items-center py-2 text-center">
                    {/* حوضِ فیروزه‌ای هشت‌ضلعی با موج‌های طلایی */}
                    <div className="relative flex h-28 w-28 items-center justify-center">
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#1e8c8a]"
                        style={{ animation: "op-ripple 2.4s ease-out infinite" }}
                      />
                      <span
                        className="pointer-events-none absolute inset-2 rounded-full border border-[#d4a84f]"
                        style={{
                          animation: "op-ripple 2.4s ease-out 0.8s infinite",
                        }}
                      />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-[#d4a84f] bg-[radial-gradient(circle_at_35%_30%,#36b8b5_0%,#1e8c8a_52%,#0f4c4f_100%)] shadow-[0_12px_30px_rgba(18,62,66,0.55),inset_0_2px_8px_rgba(255,255,255,0.45)]">
                        <div className="text-center text-[#fbf6ec]">
                          <Sparkles className="mx-auto h-4 w-4 text-[#f7e5b7]" />
                          <span className="mt-0.5 block font-display text-[12px] font-bold">
                            ثبت در حوض
                          </span>
                          <span className="block text-[9.5px] text-[#f7e5b7]">
                            {monogram}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 font-display text-[19px] text-[#1f140e]">
                      {attending
                        ? "قدومِ شما بر دیدگان؛ نامتان در شاه‌نشین ثبت شد"
                        : "پاسخ و دعای پرمهرتان در حوضِ فیروزه نشست"}
                    </p>
                    <p className="mt-1.5 text-[12px] text-[#5e442c]">
                      {attending
                        ? `${guests.toLocaleString("fa-IR")} نفر همراه · دعای خیر: «${selectedWish.label}»`
                        : `دلمان با شماست · دعای خیر: «${selectedWish.label}»`}
                    </p>

                    <button
                      type="button"
                      onClick={() => setPoolSealed(false)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#8e6920]/45 px-3.5 py-1 text-[11px] text-[#7a5614] transition hover:bg-[#8e6920]/10"
                    >
                      <RotateCcw className="h-3 w-3" />
                      ویرایشِ پاسخ
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <StainedRosette size={44} centerColor={EMERALD}>
                        <Heart className="h-4 w-4 text-[#f7e5b7]" />
                      </StainedRosette>
                    </div>

                    <h3 className="mt-3 text-center font-display text-[23px] text-[#1f140e]">
                      اعلامِ تشریف‌فرمایی
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {[
                        { value: true, label: "با افتخار تشریف می‌آورم" },
                        { value: false, label: "دلم در بزمِ شماست" },
                      ].map(({ value, label }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAttending(value)}
                          aria-pressed={attending === value}
                          className={`rounded-xl border py-3 text-[12px] font-medium transition ${
                            attending === value
                              ? "border-[#1f140e] bg-[#23160f] text-[#f7e5b7] shadow-sm"
                              : "border-[#8e6920]/40 bg-white/50 text-[#3e2b1d] hover:border-[#8e6920]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* شمار همراهان */}
                    <div
                      className={`mt-3 flex items-center justify-between rounded-xl border border-dashed border-[#8e6920]/45 bg-white/45 px-4 py-2.5 transition ${
                        attending ? "" : "pointer-events-none opacity-40"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#2b1911]">
                        <Users className="h-4 w-4 text-[#7a5614]" />
                        تعدادِ همراهان
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="کاهش همراهان"
                          onClick={() => setGuests((v) => Math.max(1, v - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#8e6920]/45 text-[#2b1911] active:scale-95"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-display text-[19px] font-bold text-[#1f140e]">
                          {guests.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          aria-label="افزایش همراهان"
                          onClick={() => setGuests((v) => Math.min(8, v + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#23160f] text-[#f7e5b7] active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* انتخاب برگِ آرزو برای انداختن در حوض */}
                    <div className="mt-4">
                      <p className="text-center text-[11px] text-[#5e442c]">
                        کدام آرزو را به آبِ زلالِ حوضِ فیروزه می‌سپارید؟
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {WISH_OPTIONS.map((w) => {
                          const active = wishId === w.id;
                          return (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => setWishId(w.id)}
                              className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] transition ${
                                active
                                  ? "border-[#123e42] bg-[#123e42] text-[#f7e5b7]"
                                  : "border-[#8e6920]/35 bg-white/50 text-[#3e2b1d]"
                              }`}
                            >
                              <span
                                className="h-2 w-2 rotate-45"
                                style={{ backgroundColor: w.color }}
                              />
                              {w.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPoolSealed(true)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(100deg,#123e42,#1e8c8a_50%,#123e42)] py-3.5 text-[12.5px] font-semibold text-[#fbf6ec] shadow-md transition hover:brightness-110 active:scale-[0.99]"
                    >
                      <Sparkles className="h-4 w-4 text-[#f7e5b7]" />
                      {preview
                        ? "سپردنِ آرزو به حوضِ فیروزه و ثبتِ پاسخ"
                        : "ثبتِ پاسخ در حوضِ فیروزه"}
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : null}

          {/* ————— ۸. کلامِ پایانی و مهرِ عمارت ————— */}
          <section className="relative px-6 pb-10 pt-14 text-center">
            <div className="flex justify-center">
              <StainedRosette size={54} centerColor={RUBY}>
                <span className="text-[12px] font-bold">{monogram}</span>
              </StainedRosette>
            </div>

            <p className="mt-4 font-display text-[21px] leading-9 text-[#f7e5b7]">
              {theme.blessingLine}
            </p>

            <StainedDivider className="mt-6" />

            <p className="mt-5 text-[10px] uppercase tracking-[0.34em] text-[#d4a84f]/70">
              {latinDate}
            </p>
            <p className="mt-1.5 text-[11.5px] text-[#fbf6ec]/60">
              {couple} · {data.venueName || "عمارت یاس سفید"}
            </p>
          </section>
        </main>

        {/* نوار ناوبری پایین صفحه */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-md border-t border-[#d4a84f]/30 bg-[#140d09]/92 backdrop-blur-md">
          <div className="flex h-16 items-center justify-around px-2">
            {[
              { href: "#invitation", label: "شاه‌نشین", Icon: ScrollText, dot: RUBY },
              { href: "#schedule", label: "رواق‌ها", Icon: Clock, dot: EMERALD },
              { href: "#location", label: "عمارت", Icon: MapPin, dot: AMBER },
              { href: "#rsvp", label: "حوضِ آرزو", Icon: Heart, dot: TURQUOISE },
            ].map(({ href, label, Icon, dot }) => (
              <a
                key={label}
                href={href}
                className="group flex min-w-[60px] flex-col items-center gap-1 text-[10.5px] text-[#fbf6ec]/65 transition hover:text-[#f7e5b7]"
              >
                <span className="relative">
                  <Icon className="h-[18px] w-[18px]" />
                  <span
                    className=" -right-1.5 -top-0.5 absolute h-1.5 w-1.5 rotate-45"
                    style={{ backgroundColor: dot }}
                  />
                </span>
                {label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
