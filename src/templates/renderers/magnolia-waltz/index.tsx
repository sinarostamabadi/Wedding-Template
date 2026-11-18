"use client";

import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Coffee,
  Feather,
  Flower2,
  Heart,
  MapPin,
  Minus,
  Moon,
  Music2,
  Pause,
  Play,
  Plus,
  RotateCcw,
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

const DEFAULT_COVER = "/images/templates/magnolia-waltz-cover.jpg";

const BLUSH_IVORY = "#fcf7f4";
const VINTAGE_ROSE = "#b5566a";
const CHAMPAGNE_GOLD = "#c79d59";

type RomanticMood = "dawn" | "sunset" | "candlelight";

const MOODS: Record<
  RomanticMood,
  {
    label: string;
    bg: string;
    cardBg: string;
    ink: string;
    muted: string;
    rose: string;
    gold: string;
    sage: string;
    petalA: string;
    petalB: string;
    border: string;
    isDark: boolean;
  }
> = {
  dawn: {
    label: "سپیده‌دمِ رز",
    bg: "#fcf7f4",
    cardBg: "#ffffff",
    ink: "#2d1a1f",
    muted: "#7a5e65",
    rose: "#b5566a",
    gold: "#c79d59",
    sage: "#5b7061",
    petalA: "#f4cfd6",
    petalB: "#e8a5b4",
    border: "rgba(199, 157, 89, 0.34)",
    isDark: false,
  },
  sunset: {
    label: "باغِ طلایی",
    bg: "#faf2ea",
    cardBg: "#fffdf9",
    ink: "#2e1c16",
    muted: "#7d6054",
    rose: "#c26158",
    gold: "#bf8f3e",
    sage: "#636e54",
    petalA: "#f7d4c4",
    petalB: "#e6a48e",
    border: "rgba(191, 143, 62, 0.38)",
    isDark: false,
  },
  candlelight: {
    label: "شمع و مخمل",
    bg: "#1e0c12",
    cardBg: "#2b121b",
    ink: "#fbf0ec",
    muted: "#c9acb3",
    rose: "#e892a4",
    gold: "#e0b973",
    sage: "#8ca894",
    petalA: "#d97a8e",
    petalB: "#9e374e",
    border: "rgba(224, 185, 115, 0.35)",
    isDark: true,
  },
};

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "فصلِ اول · خوشامدگویی در باغِ مگنولیا",
    description:
      "استقبال از شما در میان شاخه‌های گل و نوای زندهٔ ویولن و پیانو همراه با نوشیدنی‌های بهاری",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "فصلِ دوم · آیینِ عقد و پیمانِ ابدی",
    description:
      "لحظهٔ تلاقیِ نگاه‌ها و جاری شدن خطبهٔ عقد زیر طاقِ گل‌های رز و بارانِ گلبرگ",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "فصلِ سوم · ضیافتِ شام در گلخانهٔ بلورین",
    description:
      "میزبانیِ شام در کنار میزهای آراسته به شمع‌های روشن، گل‌های تازه و موسیقیِ ملایم",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "فصلِ چهارم · والسِ عاشقانه و جشن",
    description:
      "نخستین رقصِ ما در میان مه و نورِ فشفشه‌ها، برش کیک و شادی تا پاسی از شب",
    icon: "music",
  },
];

const LOVE_STORY = [
  {
    tag: "آغازِ قصه",
    title: "نگاهی که همه چیز را عوض کرد",
    text: "میانِ تمامِ روزهای عادی، لحظه‌ای رسید که زمان ایستاد و لبخندِ تو شد زیباترین بهانهٔ زندگی.",
  },
  {
    tag: "هم‌قدم",
    title: "روزهایی به لطافتِ شکوفه",
    text: "با هم خندیدیم، با هم رؤیا بافتیم و فهمیدیم خانه جایی نیست جز آغوشِ امنِ یکدیگر.",
  },
  {
    tag: "پیمانِ ما",
    title: "یک حلقه و هزاران فردای روشن",
    text: "در شبی پرستاره به هم قولِ همیشگی دادیم و حالا می‌خواهیم این شادی را با شما قسمت کنیم.",
  },
] as const;

const PETAL_SWATCHES = [
  {
    color: "#e6a8b5",
    label: "رزِ پودری",
    en: "Blush Rose",
    tip: "لباس‌های حریر و ساتن به رنگ صورتی پودری و گل‌بهی ملایم، لطافتِ باغ را کامل می‌کند.",
  },
  {
    color: "#d4b27a",
    label: "شامپاینیِ طلایی",
    en: "Champagne",
    tip: "طلاییِ ملایم و شامپاینی برای استایلی درخشان و هماهنگ با جزئیات تالار.",
  },
  {
    color: "#732235",
    label: "شرابیِ مخملی",
    en: "Velvet Wine",
    tip: "زرشکی و شرابیِ عمیق، انتخابی فوق‌العاده شیک برای لباس شب و اکسسوری آقایان.",
  },
  {
    color: "#6b8272",
    label: "سبزِ مریم‌گلی",
    en: "Botanical Sage",
    tip: "سبزِ زیتونیِ روشن و مریم‌گلی که با گل‌آراییِ مگنولیا هارمونی بی‌نظیری دارد.",
  },
  {
    color: "#261b1e",
    label: "مشکیِ رسمی",
    en: "Formal Noir",
    tip: "کت‌وشلوار و تاکسیدوی مشکی یا سرمه‌ای تیره برای استایل کلاسیک و رسمی.",
  },
];

const BOUQUET_WISHES = [
  { id: "rose", label: "دسته گلِ رز سرخ (عشقِ بی‌کران)", icon: "🌹" },
  { id: "magnolia", label: "شکوفهٔ مگنولیا (بختِ سپید و آرامش)", icon: "🌸" },
  { id: "gold", label: "شاخهٔ زیتون طلایی (برکت و شادی)", icon: "🌿" },
] as const;

const FALLING_PETALS = [
  { left: "8%", delay: "0s", dur: "11s", size: 13, rot: 25 },
  { left: "22%", delay: "2.4s", dur: "13s", size: 10, rot: -40 },
  { left: "38%", delay: "4.8s", dur: "10.5s", size: 14, rot: 60 },
  { left: "56%", delay: "1.3s", dur: "12.2s", size: 11, rot: -20 },
  { left: "74%", delay: "3.6s", dur: "11.8s", size: 13, rot: 45 },
  { left: "89%", delay: "0.7s", dur: "12.8s", size: 10, rot: -55 },
];

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso)
    return {
      weekday: "",
      day: "",
      dayNum: 21,
      month: "",
      year: "",
    };
  try {
    const date = new Date(iso);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...options }).format(date);
    const enDay = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        day: "numeric",
      }).format(date),
    );
    return {
      weekday: format({ weekday: "long" }),
      day: format({ day: "numeric" }),
      dayNum: Number.isNaN(enDay) ? 21 : enDay,
      month: format({ month: "long" }),
      year: format({ year: "numeric" }),
    };
  } catch {
    return { weekday: "", day: "", dayNum: 21, month: "", year: "" };
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

/** شاخه‌ی گلِ مگنولیا و برگ‌های طلایی (SVG دست‌نگار) */
function MagnoliaBranchSvg({
  className = "",
  petalA,
  petalB,
  gold,
  sage,
  flip = false,
}: {
  className?: string;
  petalA: string;
  petalB: string;
  gold: string;
  sage: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 180 110"
      className={`${className} ${flip ? "-scale-x-100" : ""}`}
      aria-hidden
    >
      {/* شاخه طلایی منحنی */}
      <path
        d="M 6 88 Q 56 62, 108 42 T 172 18"
        fill="none"
        stroke={gold}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 48 68 Q 72 86, 102 82"
        fill="none"
        stroke={gold}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* برگ‌های مریم‌گلی و طلایی */}
      <path
        d="M 34 74 C 24 56, 38 42, 54 58 C 46 68, 38 72, 34 74 Z"
        fill={sage}
        fillOpacity="0.78"
        stroke={gold}
        strokeWidth="0.8"
      />
      <path
        d="M 96 46 C 88 28, 104 16, 118 32 C 110 42, 102 44, 96 46 Z"
        fill={sage}
        fillOpacity="0.82"
        stroke={gold}
        strokeWidth="0.8"
      />
      <path
        d="M 124 38 C 138 50, 156 44, 146 28 C 136 30, 128 34, 124 38 Z"
        fill={gold}
        fillOpacity="0.45"
        stroke={gold}
        strokeWidth="0.8"
      />
      {/* شکوفه بزرگ مگنولیا */}
      <g transform="translate(72, 52)">
        <path
          d="M 0 0 C -18 -14, -14 -34, 0 -26 C 14 -34, 18 -14, 0 0 Z"
          fill={petalA}
          stroke={gold}
          strokeWidth="0.9"
        />
        <path
          d="M 0 0 C -26 -2, -28 18, -6 14 C -2 10, 0 4, 0 0 Z"
          fill={petalB}
          fillOpacity="0.88"
          stroke={gold}
          strokeWidth="0.8"
        />
        <path
          d="M 0 0 C 26 -2, 28 18, 6 14 C 2 10, 0 4, 0 0 Z"
          fill={petalB}
          fillOpacity="0.88"
          stroke={gold}
          strokeWidth="0.8"
        />
        <path
          d="M 0 2 C -10 -12, 10 -12, 0 2 Z"
          fill="#fff9f5"
          stroke={gold}
          strokeWidth="0.7"
        />
        <circle cx="0" cy="-4" r="3" fill={gold} />
      </g>
      {/* غنچه مگنولیا */}
      <g transform="translate(142, 24) rotate(22)">
        <path
          d="M 0 0 C -8 -10, 0 -22, 6 -12 C 10 -4, 4 2, 0 0 Z"
          fill={petalA}
          stroke={gold}
          strokeWidth="0.8"
        />
        <circle cx="2" cy="-14" r="1.8" fill={gold} />
      </g>
    </svg>
  );
}

/** مهرِ مومِ رزگلد با گلِ برجسته */
function BotanicalWaxSeal({
  monogram,
  rose,
  gold,
  size = 76,
}: {
  monogram: string;
  rose: string;
  gold: string;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full select-none"
      style={{
        width: size,
        height: size,
        backgroundImage: `radial-gradient(circle at 32% 28%, #f7cfd8 0%, ${rose} 48%, #6e2032 100%)`,
        boxShadow:
          "0 12px 26px -8px rgba(110, 32, 50, 0.65), inset 0 2px 5px rgba(255, 255, 255, 0.45), inset 0 -4px 8px rgba(45, 10, 18, 0.55)",
      }}
    >
      <span
        className="absolute inset-[5px] rounded-full border"
        style={{ borderColor: `${gold}99` }}
      />
      <span
        className="absolute inset-[9px] rounded-full border border-dashed"
        style={{ borderColor: `${gold}66` }}
      />
      <span className="relative flex flex-col items-center leading-none text-[#fff7f2]">
        <Flower2 className="h-4 w-4" style={{ color: gold }} />
        <span className="mt-1 font-display text-[13px] font-bold tracking-wider">
          {monogram}
        </span>
      </span>
    </span>
  );
}

/** عنوان شاعرانه هر بخش با تاجِ گل و برگ */
function RomanticSectionHeader({
  subtitleEn,
  title,
  description,
  rose,
  gold,
  muted,
}: {
  subtitleEn: string;
  title: string;
  description?: string;
  rose: string;
  gold: string;
  muted: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2.5">
        <span
          className="h-px w-10"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${gold})`,
          }}
        />
        <Flower2 className="h-3.5 w-3.5" style={{ color: rose }} />
        <span
          className="text-[9px] uppercase tracking-[0.36em]"
          style={{ color: gold }}
        >
          {subtitleEn}
        </span>
        <Flower2 className="h-3.5 w-3.5" style={{ color: rose }} />
        <span
          className="h-px w-10"
          style={{
            backgroundImage: `linear-gradient(270deg, transparent, ${gold})`,
          }}
        />
      </div>
      <h2 className="mt-2.5 font-display text-[28px] leading-tight">{title}</h2>
      {description ? (
        <p
          className="mt-1.5 max-w-[295px] text-[12px] leading-6"
          style={{ color: muted }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** طاقِ گلخانه‌ی بلورین و پاکتِ ابریشمیِ مهروموم‌شده (Hero Interactive) */
function ConservatoryFloralArch({
  uid,
  unsealed,
  onToggleSeal,
  cover,
  couple,
  monogram,
  mood,
}: {
  uid: string;
  unsealed: boolean;
  onToggleSeal: () => void;
  cover: string;
  couple: string;
  monogram: string;
  mood: (typeof MOODS)[RomanticMood];
}) {
  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[330px] flex-col items-center">
      {/* شاخه‌های گل مگنولیا در بالای طاق (چپ و راست) */}
      <MagnoliaBranchSvg
        className="pointer-events-none absolute -right-3 -top-6 z-30 h-24 w-40 drop-shadow-sm"
        petalA={mood.petalA}
        petalB={mood.petalB}
        gold={mood.gold}
        sage={mood.sage}
      />
      <MagnoliaBranchSvg
        className="pointer-events-none absolute -left-3 -top-6 z-30 h-24 w-40 drop-shadow-sm"
        petalA={mood.petalA}
        petalB={mood.petalB}
        gold={mood.gold}
        sage={mood.sage}
        flip
      />

      {/* طاقِ دوپوشِ طلایی و گلخانهٔ بلورین */}
      <div
        className="relative w-[288px] overflow-hidden p-3 transition-all duration-700"
        style={{
          borderRadius: "150px 150px 28px 28px",
          backgroundColor: mood.cardBg,
          border: `1.5px solid ${mood.gold}88`,
          boxShadow: mood.isDark
            ? "0 28px 65px -20px rgba(0,0,0,0.85), 0 0 40px -15px rgba(232,146,164,0.22)"
            : "0 26px 60px -22px rgba(115, 34, 53, 0.22), inset 0 0 24px rgba(244, 207, 214, 0.35)",
        }}
      >
        {/* خطوط ظریف شبکه‌ی شیشه‌ای گلخانه در پس‌زمینه طاق */}
        <svg
          viewBox="0 0 264 360"
          className="pointer-events-none absolute inset-3 z-10 h-[calc(100%-24px)] w-[calc(100%-24px)]"
          aria-hidden
        >
          <defs>
            <linearGradient id={`${uid}-arch-rim`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={mood.gold} stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fff4dc" stopOpacity="0.95" />
              <stop offset="100%" stopColor={mood.gold} stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <path
            d="M 4 356 V 132 A 128 128 0 0 1 260 132 V 356 Z"
            fill="none"
            stroke={`url(#${uid}-arch-rim)`}
            strokeWidth="1.6"
          />
          <path
            d="M 10 350 V 132 A 122 122 0 0 1 254 132 V 350 Z"
            fill="none"
            stroke={mood.gold}
            strokeOpacity="0.38"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
        </svg>

        {/* قاب عکس زوج */}
        <div
          className="relative aspect-[3/3.85] w-full overflow-hidden"
          style={{ borderRadius: "138px 138px 20px 20px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={couple}
            className="h-full w-full object-cover transition-all duration-1000 ease-out"
            style={{
              transform: unsealed ? "scale(1.02)" : "scale(1.1)",
              filter: unsealed
                ? "contrast(1.03) saturate(1.05)"
                : "brightness(0.88) saturate(0.95) blur(3px)",
            }}
          />

          {/* هاله رمانتیک پایین قاب */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(45,26,31,0.18) 0%, transparent 40%, rgba(45,26,31,0.72) 100%)",
            }}
          />

          {/* لفافِ نامه‌ی عاشقانه و روبان ابریشمی که با لمس مهر موم باز می‌شود */}
          <div
            onClick={onToggleSeal}
            role="button"
            tabIndex={0}
            aria-expanded={unsealed}
            aria-label={unsealed ? "بستن پاکت نامه عاشقانه" : "گشودن مهر موم نامه عاشقانه"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleSeal();
              }
            }}
            className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-end pb-5 transition-all duration-1000"
            style={{
              backgroundColor: unsealed
                ? "rgba(252, 247, 244, 0.0)"
                : "rgba(252, 247, 244, 0.62)",
              backdropFilter: unsealed ? "blur(0px)" : "blur(6px)",
              WebkitBackdropFilter: unsealed ? "blur(0px)" : "blur(6px)",
            }}
          >
            {/* روبان افقی ابریشمی */}
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-[66px] h-7 transition-all duration-700 ${
                unsealed ? "scale-x-0 opacity-0" : "scale-x-100 opacity-95"
              }`}
              style={{
                backgroundImage: `linear-gradient(180deg, ${mood.petalA}, ${mood.petalB})`,
                boxShadow: "0 4px 12px rgba(115,34,53,0.22)",
              }}
            />

            {/* مهر موم رزگلد در مرکز روبان */}
            <div
              className={`transition-all duration-700 ${
                unsealed ? "scale-75 opacity-95" : "scale-100 hover:scale-105"
              }`}
            >
              <BotanicalWaxSeal
                monogram={monogram}
                rose={mood.rose}
                gold={mood.gold}
                size={68}
              />
            </div>

            <span className="mt-2 rounded-full border border-white/35 bg-black/40 px-3.5 py-1 text-[10px] text-white backdrop-blur-md">
              {unsealed
                ? "مهرِ نامه گشوده شد · لمس برای بستنِ روبان"
                : "برای گشودنِ روبانِ ابریشمی، مهرِ گل را لمس کنید"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MagnoliaWaltzRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, "");

  const [moodKey, setMoodKey] = useState<RomanticMood>("dawn");
  const [unsealed, setUnsealed] = useState(false);
  const [storyTab, setStoryTab] = useState<"story" | "vows">("story");
  const [playingMusic, setPlayingMusic] = useState(false);
  const [swatchIdx, setSwatchIdx] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [bouquetId, setBouquetId] =
    useState<(typeof BOUQUET_WISHES)[number]["id"]>("rose");
  const [rsvpSealed, setRsvpSealed] = useState(false);

  useEffect(() => {
    const delay = features?.entranceAnimation === false ? 60 : 720;
    const timer = window.setTimeout(() => setUnsealed(true), delay);
    return () => window.clearTimeout(timer);
  }, [features?.entranceAnimation]);

  const theme: TemplateCustomization = {
    primaryColor: VINTAGE_ROSE,
    secondaryColor: CHAMPAGNE_GOLD,
    backgroundColor: BLUSH_IVORY,
    poeticLine:
      "«مرا عهدیست با جانان که تا جان در بدن دارم، هوادارانِ کویش را چو جانِ خویشتن دارم»",
    blessingLine:
      "در باغِ زندگیِ ما، زیباترین شکوفه، لبخند و حضورِ پرمهرِ شماست.",
    dressCode:
      "پوشش رسمی و رمانتیک (Garden Formal)؛ طیف رز پودری، شامپاینی، شرابی مخملی، سبز مریم‌گلی و مشکی رسمی.",
    musicTitle: "والسِ مگنولیا · سولوی ویولن و پیانو",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const mood = MOODS[moodKey];
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
  const selectedBouquet =
    BOUQUET_WISHES.find((b) => b.id === bouquetId) ?? BOUQUET_WISHES[0];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans transition-colors duration-700"
      style={
        {
          backgroundColor: mood.bg,
          color: mood.ink,
          "--mw-rose": mood.rose,
          "--mw-gold": mood.gold,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes mw-petal-fall {
          0% { transform: translateY(-20px) translateX(0px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.75; }
          85% { opacity: 0.75; }
          100% { transform: translateY(92vh) translateX(28px) rotate(220deg); opacity: 0; }
        }
        @keyframes mw-rose-foil {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes mw-eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes mw-seal-in {
          0% { transform: scale(1.35) rotate(-10deg); opacity: 0; }
          65% { transform: scale(0.95) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .mw-title-gradient {
          background-image: linear-gradient(100deg, ${mood.rose} 0%, ${mood.gold} 38%, ${mood.ink} 68%, ${mood.rose} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: mw-rose-foil 10s linear infinite;
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-md overflow-x-clip">
        {/* بارش آرام گلبرگ‌های مگنولیا و رز در کل صفحه */}
        <div
          className="pointer-events-none fixed inset-0 z-20 mx-auto max-w-md overflow-hidden"
          aria-hidden
        >
          {FALLING_PETALS.map((p, idx) => (
            <span
              key={idx}
              className="absolute -top-6 rounded-tl-full rounded-tr-none rounded-br-full rounded-bl-full shadow-xs"
              style={{
                left: p.left,
                width: p.size,
                height: p.size * 1.25,
                backgroundImage: `linear-gradient(135deg, ${mood.petalA}, ${mood.petalB})`,
                animation: `mw-petal-fall ${p.dur} linear ${p.delay} infinite`,
              }}
            />
          ))}
        </div>

        {/* هاله‌های لطیف نور در پس‌زمینه */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 8%, ${mood.petalA}55 0%, transparent 45%),
              radial-gradient(circle at 15% 48%, ${mood.gold}22 0%, transparent 42%),
              radial-gradient(circle at 85% 75%, ${mood.petalB}33 0%, transparent 48%)
            `,
          }}
          aria-hidden
        />

        {/* نوار بالای صفحه با سوییچر ۳ حال‌وهوای عاشقانه */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-500"
          style={{
            borderColor: mood.border,
            backgroundColor: `${mood.bg}d8`,
          }}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full border font-display text-[11px]"
              style={{
                borderColor: mood.gold,
                backgroundColor: mood.cardBg,
                color: mood.rose,
              }}
            >
              {monogram}
            </span>

            {/* سوییچر حال‌وهوای باغ */}
            <div
              className="flex items-center gap-1 rounded-full border p-1"
              style={{
                borderColor: mood.border,
                backgroundColor: mood.cardBg,
              }}
            >
              {(
                [
                  { id: "dawn", Icon: Sunrise },
                  { id: "sunset", Icon: Sun },
                  { id: "candlelight", Icon: Moon },
                ] as const
              ).map(({ id, Icon }) => {
                const item = MOODS[id];
                const active = moodKey === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMoodKey(id)}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] transition ${
                      active ? "font-semibold text-white shadow-xs" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: active ? mood.rose : "transparent",
                    }}
                  >
                    <Icon className="h-3 w-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {showMusic ? (
              <button
                type="button"
                onClick={() => setPlayingMusic((p) => !p)}
                aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                className="flex h-8 w-8 items-center justify-center rounded-full border transition"
                style={{
                  borderColor: mood.gold,
                  backgroundColor: mood.cardBg,
                  color: mood.rose,
                }}
              >
                {playingMusic ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
                )}
              </button>
            ) : (
              <Heart className="h-4 w-4" style={{ color: mood.rose }} />
            )}
          </div>
        </header>

        <main className="relative z-10 px-4 pb-28">
          {/* ————— ۱. صحنه‌ی نخست: طاقِ مگنولیا و نامه‌ی مهروموم‌شده ————— */}
          <section className="relative flex flex-col items-center pt-7 pb-10 text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10.5px]"
              style={{
                borderColor: mood.border,
                backgroundColor: mood.cardBg,
                color: mood.rose,
              }}
            >
              <Flower2 className="h-3.5 w-3.5" />
              به نامِ عشق و پیوندِ جاودان
            </span>

            {/* طاق گلخانه و پاکت ابریشمی */}
            <div className="mt-5 w-full">
              <ConservatoryFloralArch
                uid={uid}
                unsealed={unsealed}
                onToggleSeal={() => setUnsealed((u) => !u)}
                cover={cover}
                couple={couple}
                monogram={monogram}
                mood={mood}
              />
            </div>

            {/* نام عروس و داماد */}
            <h1 className="mt-5 flex flex-col items-center font-display text-[44px] leading-[1.18]">
              <span className="mw-title-gradient px-3">
                {data.partnerOneName}
              </span>
              <span className="my-1 flex items-center gap-3">
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: mood.gold }}
                />
                <Heart
                  className="h-4 w-4 fill-current"
                  style={{ color: mood.rose }}
                />
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: mood.gold }}
                />
              </span>
              <span className="mw-title-gradient px-3">
                {data.partnerTwoName}
              </span>
            </h1>

            <p className="mt-3 text-[12.5px] font-medium">
              {parts.day && parts.month
                ? `${parts.weekday} · ${parts.day} ${parts.month} ${parts.year}`
                : "تاریخ به‌زودی اعلام می‌شود"}
            </p>
            <p className="mt-1 text-[11.5px]" style={{ color: mood.muted }}>
              {data.venueName || "عمارت یاس سفید"}
            </p>

            <div
              className="mt-5 flex flex-col items-center opacity-55"
              style={{ color: mood.rose }}
            >
              <span className="text-[8.5px] uppercase tracking-[0.3em]">
                ورق بزنید
              </span>
              <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
            </div>
          </section>

          {/* ————— ۲. نامه‌ی دعوت، قصه‌ی عاشقی و عهدنامه‌ی عروس و داماد ————— */}
          <section id="invitation" className="scroll-mt-20 pt-6">
            <RomanticSectionHeader
              subtitleEn="The Love Letter"
              title="نامه‌ای از دلِ ما به شما"
              description="خوشحال‌ترینیم که زیباترین شب زندگی‌مان را در کنار شما جشن می‌گیریم"
              rose={mood.rose}
              gold={mood.gold}
              muted={mood.muted}
            />

            <div
              className="relative mt-5 overflow-hidden rounded-[30px] border p-6 shadow-[0_24px_55px_-24px_rgba(115,34,53,0.18)]"
              style={{
                backgroundColor: mood.cardBg,
                borderColor: mood.border,
              }}
            >
              {/* قاب داخلی طلایی */}
              <span
                className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-dashed"
                style={{ borderColor: `${mood.gold}45` }}
              />

              <blockquote
                className="relative z-10 text-center font-display text-[20px] leading-9"
                style={{ color: mood.rose }}
              >
                {theme.poeticLine}
              </blockquote>

              <p
                className="relative z-10 mt-3.5 text-center text-[13px] leading-8"
                style={{ color: mood.muted }}
              >
                {data.invitationText ||
                  "عشق، زیباترین بهانهٔ آفرینش است و حضورِ شما، گرم‌ترین روشناییِ این شب. با قلبی سرشار از مهر و اشتیاق، چشمانمان به دروازهٔ باغ دوخته است تا قدومِ سبزتان را گلباران کنیم."}
              </p>

              {families ? (
                <p
                  className="relative z-10 mt-3 text-center text-[11.5px] font-medium"
                  style={{ color: mood.gold }}
                >
                  به میزبانی خانواده‌های {families}
                </p>
              ) : null}

              {/* تب‌های «قصه‌ی آشنایی ما» و «عهدنامه‌ی عاشقانه» */}
              <div className="relative z-10 mt-6">
                <div
                  className="mx-auto flex w-fit rounded-full border p-1 text-[11px]"
                  style={{
                    borderColor: mood.border,
                    backgroundColor: mood.bg,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setStoryTab("story")}
                    className={`rounded-full px-4 py-1 transition ${
                      storyTab === "story"
                        ? "text-white font-medium shadow-xs"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor:
                        storyTab === "story" ? mood.rose : "transparent",
                    }}
                  >
                    فصل‌های عاشقی
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoryTab("vows")}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-1 transition ${
                      storyTab === "vows"
                        ? "text-white font-medium shadow-xs"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor:
                        storyTab === "vows" ? mood.rose : "transparent",
                    }}
                  >
                    <Feather className="h-3 w-3" />
                    عهدنامه‌ی ما
                  </button>
                </div>

                {storyTab === "story" ? (
                  <div className="mt-4 space-y-2.5">
                    {LOVE_STORY.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border p-3.5 transition"
                        style={{
                          borderColor: mood.border,
                          backgroundColor: mood.bg,
                        }}
                      >
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: mood.rose }}
                        >
                          {item.tag}
                        </span>
                        <p className="mt-0.5 font-display text-[17px]">
                          {item.title}
                        </p>
                        <p
                          className="mt-1 text-[12px] leading-6"
                          style={{ color: mood.muted }}
                        >
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div
                      className="rounded-2xl border p-4"
                      style={{
                        borderColor: mood.border,
                        backgroundColor: mood.bg,
                      }}
                    >
                      <p
                        className="text-[10.5px] font-semibold"
                        style={{ color: mood.rose }}
                      >
                        عهدِ {data.partnerOneName}:
                      </p>
                      <p className="mt-1 font-display text-[17px] leading-8">
                        «عهد می‌بندم که در تمامِ فصل‌های زندگی، پناهِ آرامشِ تو و هم‌قدمِ رؤیاهایت باشم.»
                      </p>
                    </div>
                    <div
                      className="rounded-2xl border p-4"
                      style={{
                        borderColor: mood.border,
                        backgroundColor: mood.bg,
                      }}
                    >
                      <p
                        className="text-[10.5px] font-semibold"
                        style={{ color: mood.rose }}
                      >
                        عهدِ {data.partnerTwoName}:
                      </p>
                      <p className="mt-1 font-display text-[17px] leading-8">
                        «عهد می‌بندم که هر طلوع را با لبخندِ تو آغاز کنم و عشقت را چو جان در سینه نگه دارم.»
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* پخش‌کننده موسیقی عاشقانه */}
              {showMusic ? (
                <div
                  className="relative z-10 mt-5 flex items-center justify-between rounded-2xl border px-3.5 py-2.5"
                  style={{
                    borderColor: mood.border,
                    backgroundColor: mood.bg,
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setPlayingMusic((p) => !p)}
                      aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition active:scale-95"
                      style={{ backgroundColor: mood.rose }}
                    >
                      {playingMusic ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 translate-x-[0.5px]" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-medium">
                        {theme.musicTitle}
                      </p>
                      <p
                        className="text-[9.5px]"
                        style={{ color: mood.muted }}
                      >
                        {playingMusic
                          ? "در حال پخشِ ملودی عاشقانه…"
                          : "لمس برای شنیدنِ ملودیِ جشن"}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-4 items-end gap-0.5 px-1" aria-hidden>
                    {[0.5, 1, 0.65, 0.9, 0.45].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full"
                        style={{
                          height: `${h * 15}px`,
                          backgroundColor: mood.rose,
                          animation: playingMusic
                            ? `mw-eq ${0.6 + i * 0.14}s ease-in-out infinite`
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

          {/* ————— ۳. تقویمِ شکوفه‌ها و شمارشِ معکوس (Floral Calendar & Countdown) ————— */}
          <section className="pt-14">
            <RomanticSectionHeader
              subtitleEn="Save The Date"
              title="تقویمِ روزِ پیوند"
              description="روزِ موعود در تقویمِ دلِ ما با قلبی سرخ نشانه خورده است"
              rose={mood.rose}
              gold={mood.gold}
              muted={mood.muted}
            />

            <div
              className="mt-5 overflow-hidden rounded-[30px] border p-5 shadow-lg"
              style={{
                backgroundColor: mood.cardBg,
                borderColor: mood.border,
              }}
            >
              {/* سرتیتر ماه و سال */}
              <div
                className="flex items-center justify-between border-b pb-3"
                style={{ borderColor: mood.border }}
              >
                <span className="font-display text-[20px]">
                  {parts.month || "اردیبهشت"} {parts.year || "۱۴۰۶"}
                </span>
                <span
                  className="rounded-full px-3 py-0.5 text-[11px] font-medium text-white"
                  style={{ backgroundColor: mood.rose }}
                >
                  {parts.weekday || "جمعه"} · ساعت {startTime || "۱۸:۰۰"}
                </span>
              </div>

              {/* ردیف روزهای اطراف روز عروسی با حلقه قلب دور روز موعود */}
              <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
                {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                  const d = Math.max(1, Math.min(31, parts.dayNum + offset));
                  const isWeddingDay = offset === 0;
                  return (
                    <div
                      key={offset}
                      className={`relative flex h-12 flex-col items-center justify-center rounded-2xl border transition ${
                        isWeddingDay ? "scale-105 font-bold text-white shadow-md" : "opacity-65"
                      }`}
                      style={{
                        backgroundColor: isWeddingDay ? mood.rose : mood.bg,
                        borderColor: isWeddingDay ? mood.gold : mood.border,
                      }}
                    >
                      {isWeddingDay ? (
                        <Heart className="h-3 w-3 fill-current text-[#fff5f7]" />
                      ) : null}
                      <span className="font-display text-[16px]">
                        {d.toLocaleString("fa-IR")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {showCountdown ? (
                <div
                  className="mt-5 border-t pt-4"
                  style={{ borderColor: mood.border }}
                >
                  <p
                    className="mb-2.5 text-center text-[10.5px]"
                    style={{ color: mood.muted }}
                  >
                    شمارشِ تپش‌های دل تا لحظهٔ دیدار
                  </p>
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-2xl [&>div]:border [&>div]:border-[#c79d59]/35 [&>div]:bg-black/[0.03] [&>div]:py-3 [&_p:first-child]:font-display [&_p:first-child]:text-[24px] [&_p:last-child]:text-[10px]"
                  />
                </div>
              ) : null}
            </div>
          </section>

          {/* ————— ۴. برنامه‌ی شبِ رویایی ————— */}
          <section id="schedule" className="scroll-mt-20 pt-14">
            <RomanticSectionHeader
              subtitleEn="The Wedding Chapters"
              title="برنامه‌ی شبِ رؤیایی"
              description="چهار فصلِ شیرین از غروب تا نیمه‌شب"
              rose={mood.rose}
              gold={mood.gold}
              muted={mood.muted}
            />

            <ul className="mt-6 space-y-3.5">
              {schedule.map((item) => {
                const Icon = scheduleIcon(item.icon);
                return (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="relative flex items-start gap-3.5 overflow-hidden rounded-3xl border p-4 shadow-xs transition"
                    style={{
                      backgroundColor: mood.cardBg,
                      borderColor: mood.border,
                    }}
                  >
                    {/* قاب طاقی ساعت */}
                    <div
                      className="flex h-16 w-14 shrink-0 flex-col items-center justify-center border text-center"
                      style={{
                        borderRadius: "40px 40px 14px 14px",
                        borderColor: mood.gold,
                        backgroundColor: mood.bg,
                      }}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{ color: mood.rose }}
                      />
                      <span className="mt-1 font-display text-[13px] font-bold">
                        {item.time}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="font-display text-[18px] leading-snug">
                        {item.title}
                      </p>
                      <p
                        className="mt-1 text-[12px] leading-6"
                        style={{ color: mood.muted }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ————— ۵. عمارتِ باغ و مسیریابی ————— */}
          {showMap ? (
            <section id="location" className="scroll-mt-20 pt-14">
              <RomanticSectionHeader
                subtitleEn="The Garden Venue"
                title="نشانیِ عمارت و مسیریابی"
                description="مشتاقِ دیدارِ روی ماهتان در عمارتِ جشن هستیم"
                rose={mood.rose}
                gold={mood.gold}
                muted={mood.muted}
              />

              <div
                className="mt-5 overflow-hidden rounded-[30px] border p-5 text-center shadow-lg"
                style={{
                  backgroundColor: mood.cardBg,
                  borderColor: mood.border,
                }}
              >
                <span
                  className="mx-auto flex h-13 w-13 items-center justify-center rounded-full border"
                  style={{
                    borderColor: mood.gold,
                    backgroundColor: mood.bg,
                    color: mood.rose,
                  }}
                >
                  <MapPin className="h-5 w-5" />
                </span>

                <h3 className="mt-3.5 font-display text-[23px]">
                  {data.venueName || "عمارت یاس سفید"}
                </h3>
                {data.venueAddress ? (
                  <p
                    className="mx-auto mt-1.5 max-w-[285px] text-[12px] leading-6"
                    style={{ color: mood.muted }}
                  >
                    {data.venueAddress}
                  </p>
                ) : null}

                {query ? (
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      {
                        href: `https://neshan.org/maps/search/${query}`,
                        label: "نشان",
                      },
                      {
                        href: `https://balad.ir/search?query=${query}`,
                        label: "بلد",
                      },
                      {
                        href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                        label: "گوگل‌مپ",
                      },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-2xl border py-2.5 text-[11.5px] font-medium transition hover:opacity-80"
                        style={{
                          borderColor: mood.border,
                          backgroundColor: mood.bg,
                        }}
                      >
                        <span>{item.label}</span>
                        <ArrowUpLeft className="h-3.5 w-3.5 opacity-60" />
                      </a>
                    ))}
                  </div>
                ) : null}

                {calendarHref ? (
                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-2xl py-3 text-[12px] font-semibold text-white shadow-sm transition hover:opacity-95"
                    style={{ backgroundColor: mood.rose }}
                  >
                    <CalendarDays className="h-4 w-4" />
                    ثبتِ یادآور در تقویم گوگل
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* ————— ۶. پالتِ گلبرگ‌ها (Dress Code) ————— */}
          <section className="pt-14">
            <RomanticSectionHeader
              subtitleEn="The Petal Palette"
              title="پالتِ گلبرگ‌ها و پوشش"
              description={theme.dressCode}
              rose={mood.rose}
              gold={mood.gold}
              muted={mood.muted}
            />

            <div className="mt-6 grid grid-cols-5 gap-2">
              {PETAL_SWATCHES.map((swatch, idx) => {
                const active = swatchIdx === idx;
                return (
                  <button
                    key={swatch.label}
                    type="button"
                    onClick={() => setSwatchIdx(idx)}
                    aria-pressed={active}
                    className="flex flex-col items-center focus:outline-none"
                  >
                    {/* شکل گلبرگ رز */}
                    <span
                      className={`relative flex h-13 w-11 items-center justify-center rounded-tl-[24px] rounded-tr-[10px] rounded-br-[24px] rounded-bl-[10px] border-2 transition-all duration-300 ${
                        active ? "scale-110 shadow-md" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: swatch.color,
                        borderColor: active ? mood.gold : "rgba(255,255,255,0.65)",
                      }}
                    />
                    <span
                      className={`mt-2.5 text-center text-[10px] ${
                        active ? "font-bold" : "opacity-70"
                      }`}
                    >
                      {swatch.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="mt-4 rounded-2xl border px-4 py-3 text-center text-[11.5px] leading-6"
              style={{
                backgroundColor: mood.cardBg,
                borderColor: mood.border,
              }}
            >
              <span className="font-semibold" style={{ color: mood.rose }}>
                {PETAL_SWATCHES[swatchIdx].label}:{" "}
              </span>
              <span style={{ color: mood.muted }}>
                {PETAL_SWATCHES[swatchIdx].tip}
              </span>
            </div>
          </section>

          {/* ————— ۷. نامه‌ی پاسخ و مهرِ مومِ رزگلد (RSVP) ————— */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 pt-14">
              <RomanticSectionHeader
                subtitleEn="Kindly Reply"
                title="اعلامِ حضور و دسته‌گلِ آرزو"
                description="پاسخِ پرمهرتان را با مهرِ مومِ رزگلد برای ما بفرستید"
                rose={mood.rose}
                gold={mood.gold}
                muted={mood.muted}
              />

              <div
                className="relative mt-5 overflow-hidden rounded-[30px] border p-6 shadow-xl"
                style={{
                  backgroundColor: mood.cardBg,
                  borderColor: mood.border,
                }}
              >
                {rsvpSealed ? (
                  <div
                    className="flex flex-col items-center py-2 text-center"
                    style={{ animation: "mw-seal-in 550ms ease-out both" }}
                  >
                    <BotanicalWaxSeal
                      monogram={monogram}
                      rose={mood.rose}
                      gold={mood.gold}
                      size={88}
                    />
                    <p className="mt-4 font-display text-[21px]">
                      {attending
                        ? "با مهرِ رزگلد ثبت شد؛ بی‌صبرانه چشم‌به‌راهتان هستیم"
                        : "پاسخ و دسته‌گلِ محبتِ شما در قلبِ ما نشست"}
                    </p>
                    <p
                      className="mt-1 text-[12px]"
                      style={{ color: mood.muted }}
                    >
                      {attending
                        ? `${guests.toLocaleString("fa-IR")} نفر همراه · هدیهٔ دل: ${selectedBouquet.label}`
                        : `دلمان با شماست · هدیهٔ دل: ${selectedBouquet.label}`}
                    </p>

                    <button
                      type="button"
                      onClick={() => setRsvpSealed(false)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] opacity-75 transition hover:opacity-100"
                      style={{ borderColor: mood.border }}
                    >
                      <RotateCcw className="h-3 w-3" />
                      ویرایش پاسخ
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { value: true, label: "با افتخار تشریف می‌آورم" },
                        { value: false, label: "دلم همراهِ شماست" },
                      ].map(({ value, label }) => {
                        const active = attending === value;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setAttending(value)}
                            aria-pressed={active}
                            className="flex items-center justify-center gap-1.5 rounded-2xl border py-3 text-[12px] font-medium transition"
                            style={{
                              backgroundColor: active ? mood.rose : mood.bg,
                              color: active ? "#ffffff" : mood.ink,
                              borderColor: active ? mood.rose : mood.border,
                            }}
                          >
                            {active ? <Check className="h-3.5 w-3.5" /> : null}
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {/* شمار همراهان */}
                    <div
                      className={`mt-3 flex items-center justify-between rounded-2xl border px-4 py-2.5 transition ${
                        attending ? "" : "pointer-events-none opacity-40"
                      }`}
                      style={{
                        borderColor: mood.border,
                        backgroundColor: mood.bg,
                      }}
                    >
                      <span className="flex items-center gap-1.5 text-[12px] font-medium">
                        <Users
                          className="h-4 w-4"
                          style={{ color: mood.rose }}
                        />
                        تعداد همراهان
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="کاهش همراهان"
                          onClick={() => setGuests((v) => Math.max(1, v - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border active:scale-90"
                          style={{ borderColor: mood.border }}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-display text-[19px] font-bold">
                          {guests.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          aria-label="افزایش همراهان"
                          onClick={() => setGuests((v) => Math.min(8, v + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white active:scale-90"
                          style={{ backgroundColor: mood.rose }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* انتخاب دسته گل آرزو */}
                    <div className="mt-4">
                      <p
                        className="text-center text-[11px]"
                        style={{ color: mood.muted }}
                      >
                        کدام شاخه گل را همراهِ نامه‌ی خود می‌فرستید؟
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {BOUQUET_WISHES.map((item) => {
                          const active = bouquetId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setBouquetId(item.id)}
                              className="flex w-full items-center justify-between rounded-xl border px-3.5 py-2 text-[11.5px] transition"
                              style={{
                                borderColor: active ? mood.rose : mood.border,
                                backgroundColor: active
                                  ? `${mood.rose}15`
                                  : mood.bg,
                              }}
                            >
                              <span className="flex items-center gap-2">
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                              </span>
                              {active ? (
                                <Check
                                  className="h-3.5 w-3.5"
                                  style={{ color: mood.rose }}
                                />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRsvpSealed(true)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[12.5px] font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.99]"
                      style={{ backgroundColor: mood.rose }}
                    >
                      <Sparkles className="h-4 w-4" />
                      {preview
                        ? "مهر و موم کردنِ نامه و ثبتِ حضور"
                        : "ثبتِ حضور با مهرِ رزگلد"}
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : null}

          {/* ————— ۸. کلام پایانی ————— */}
          <section className="pt-16 pb-6 text-center">
            <Flower2
              className="mx-auto h-6 w-6"
              style={{ color: mood.rose }}
            />
            <p className="mx-auto mt-3 max-w-[290px] font-display text-[21px] leading-9">
              {theme.blessingLine}
            </p>
            <p
              className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.34em]"
              style={{ color: mood.muted }}
            >
              {latinDate} · {couple}
            </p>
          </section>
        </main>

        {/* نوار ناوبری پایین صفحه */}
        <nav className="fixed bottom-4 left-0 right-0 z-40 mx-auto w-[calc(100%-2rem)] max-w-[390px]">
          <div
            className="flex h-14 items-center justify-around rounded-full border px-2 shadow-xl backdrop-blur-2xl"
            style={{
              backgroundColor: `${mood.cardBg}e8`,
              borderColor: mood.border,
            }}
          >
            {[
              { href: "#invitation", label: "نامه‌ی ما", Icon: Feather },
              { href: "#schedule", label: "فصل‌ها", Icon: Clock },
              { href: "#location", label: "عمارت", Icon: MapPin },
              { href: "#rsvp", label: "مهرِ حضور", Icon: Heart },
            ].map(({ href, label, Icon }: { href: string; label: string; Icon: (props: { className?: string; style?: CSSProperties }) => ReactNode }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] opacity-80 transition hover:opacity-100"
              >
                <Icon className="h-3.5 w-3.5" style={{ color: mood.rose }} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
