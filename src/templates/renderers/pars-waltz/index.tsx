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
  Utensils
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

const DEFAULT_COVER = "/images/templates/pars-waltz-cover.jpg";

const LIMESTONE = "#ebe4d4";
const ROYAL_LAPIS = "#1a3568";
const ACHAEMENID_GOLD = "#c9a84a";

type CourtMood = "dawn" | "sunset" | "candlelight";

const MOODS: Record<
  CourtMood,
  {
    label: string;
    bg: string;
    cardBg: string;
    ink: string;
    muted: string;
    lapis: string;
    gold: string;
    sage: string;
    petalA: string;
    petalB: string;
    border: string;
    isDark: boolean;
  }
> = {
  dawn: {
    label: "سپیده‌دمِ پارسه",
    bg: "#ebe4d4",
    cardBg: "#f7f1e4",
    ink: "#1f1810",
    muted: "#6b5a45",
    lapis: "#1a3568",
    gold: "#c9a84a",
    sage: "#2f5a3a",
    petalA: "#c9a84a",
    petalB: "#8b6914",
    border: "rgba(201, 168, 74, 0.42)",
    isDark: false,
  },
  sunset: {
    label: "غروبِ آپادانا",
    bg: "#f0dcc0",
    cardBg: "#faf0dc",
    ink: "#2a180c",
    muted: "#7a5640",
    lapis: "#243f72",
    gold: "#d4ae4a",
    sage: "#3a6544",
    petalA: "#d4843b",
    petalB: "#a85a22",
    border: "rgba(212, 174, 74, 0.45)",
    isDark: false,
  },
  candlelight: {
    label: "شبِ آتشکده",
    bg: "#0f0c0a",
    cardBg: "#1a1410",
    ink: "#f3e6d0",
    muted: "#c4b09a",
    lapis: "#6f93d6",
    gold: "#e0b973",
    sage: "#5a8f6a",
    petalA: "#e0b973",
    petalB: "#c9a84a",
    border: "rgba(224, 185, 115, 0.38)",
    isDark: true,
  },
};

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "گاهِ نخست · ورود به بارگاه",
    description:
      "استقبال رسمی با گلاب و نقل، نوای چنگ و نی در سایه‌ی ستون‌های آپادانا",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "گاهِ دوم · پیمان در تالار ستون‌ها",
    description:
      "جاری شدن خطبه‌ی عقد میان سرستون‌های گاوسر و نقش‌های نیلوفر هخامنشی",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "گاهِ سوم · ضیافتِ شاهانه",
    description:
      "شام رسمی در میان تخت‌سنگ‌های زرین، فانوس‌های لاجوردی و عطر زعفران",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "گاهِ چهارم · والسِ پارسه",
    description:
      "نخستین رقص کنار شعله‌ی آتشکده و ستارگان شبِ تختِ جمشید",
    icon: "music",
  },
];

const LOVE_STORY = [
  {
    tag: "طلوع",
    title: "نگاهی چون نقشِ زرین بر سنگِ پارسه",
    text: "در میان روزهای عادی، نگاهی آمد که مثل مهرِ هخامنشی بر دل نشست و دیگر محو نشد.",
  },
  {
    tag: "هم‌قدم",
    title: "دو ستون زیر یک سقفِ آسمان",
    text: "با هم خندیدیم، با هم رؤیا بافتیم و فهمیدیم خانه همان‌جاست که دستت در دست من است.",
  },
  {
    tag: "عهد",
    title: "پیمانی به استواریِ تخت جمشید",
    text: "کنار حوضِ نیلوفر قولِ همیشگی دادیم و حالا می‌خواهیم این شادی را در بارگاهِ عشق با شما قسمت کنیم.",
  },
] as const;

const COURT_SWATCHES = [
  {
    color: "#1a3568",
    label: "لاجوردِ شاهی",
    en: "Royal Lapis",
    tip: "لاجورد عمیق، رنگ رسمی بارگاه؛ برای کت‌وشلوار و اکسسوری آقایان ایده‌آل است.",
  },
  {
    color: "#c9a84a",
    label: "زرِ هخامنشی",
    en: "Achaemenid Gold",
    tip: "طلاییِ کهنه و درخشان، هماهنگ با جزئیات سنگی و مهرِ فروهر.",
  },
  {
    color: "#2a9d8f",
    label: "فیروزه‌ی پارسه",
    en: "Pars Turquoise",
    tip: "فیروزهٔ ایرانی برای شال، جواهر و جزئیات ظریفِ پوشش بانوان.",
  },
  {
    color: "#8b3a2a",
    label: "سفالِ تخت‌جمشید",
    en: "Terracotta",
    tip: "سفالی گرم و باستانی؛ انتخابی اصیل برای لباس شب و کراوات.",
  },
  {
    color: "#1a1410",
    label: "سرویِ شب",
    en: "Cypress Noir",
    tip: "سیاهِ سروی و سرمه‌ای تیره برای استایل کلاسیک و کاملاً رسمی.",
  },
];

const COURT_OFFERINGS = [
  { id: "lotus", label: "نیلوفر آبی (پاکی و عشقِ آسمانی)", icon: "❀" },
  { id: "cypress", label: "شاخه‌ی سرو (جاودانگیِ آریایی)", icon: "†" },
  { id: "pomegranate", label: "انارِ زرین (برکت و شادی)", icon: "✦" },
] as const;

const FALLING_LOTUSES = [
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

/** سرستونِ گاوسرِ هخامنشی (SVG) */
function BullCapitalColumn({
  className = "",
  gold,
  lapis,
  sage,
  flip = false,
}: {
  className?: string;
  gold: string;
  lapis: string;
  sage: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 160"
      className={`${className} ${flip ? "-scale-x-100" : ""}`}
      aria-hidden
    >
      <rect x="26" y="48" width="12" height="100" rx="2" fill={gold} fillOpacity="0.55" />
      <rect x="24" y="48" width="16" height="6" rx="1" fill={gold} />
      <path
        d="M 8 46 C 8 22, 28 10, 32 10 C 36 10, 56 22, 56 46 L 48 46 C 48 30, 38 22, 32 22 C 26 22, 16 30, 16 46 Z"
        fill={lapis}
        fillOpacity="0.92"
        stroke={gold}
        strokeWidth="1.2"
      />
      <ellipse cx="18" cy="38" rx="10" ry="7" fill={gold} fillOpacity="0.85" />
      <ellipse cx="46" cy="38" rx="10" ry="7" fill={gold} fillOpacity="0.85" />
      <circle cx="32" cy="34" r="3.5" fill={gold} />
      <path
        d="M 20 148 H 44 L 40 156 H 24 Z"
        fill={sage}
        fillOpacity="0.7"
        stroke={gold}
        strokeWidth="0.8"
      />
      {/* نوار نیلوفر روی ستون */}
      <path
        d="M 26 70 Q 32 64, 38 70 Q 32 76, 26 70 Z"
        fill={gold}
        fillOpacity="0.7"
      />
      <path
        d="M 26 90 Q 32 84, 38 90 Q 32 96, 26 90 Z"
        fill={gold}
        fillOpacity="0.55"
      />
    </svg>
  );
}

/** مهرِ زرینِ فروهر */
function FaravaharSeal({
  monogram,
  lapis,
  gold,
  size = 76,
}: {
  monogram: string;
  lapis: string;
  gold: string;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full select-none"
      style={{
        width: size,
        height: size,
        backgroundImage: `radial-gradient(circle at 32% 28%, #e8d5a0 0%, ${gold} 48%, #6a4e12 100%)`,
        boxShadow:
          "0 12px 26px -8px rgba(80, 50, 10, 0.65), inset 0 2px 5px rgba(255, 255, 255, 0.45), inset 0 -4px 8px rgba(45, 30, 8, 0.55)",
      }}
    >
      <span
        className="absolute inset-[5px] rounded-full border"
        style={{ borderColor: `${lapis}99` }}
      />
      <span
        className="absolute inset-[9px] rounded-full border border-dashed"
        style={{ borderColor: `${lapis}55` }}
      />
      <span className="relative flex flex-col items-center leading-none" style={{ color: lapis }}>
        <svg viewBox="0 0 48 28" className="h-4 w-7" aria-hidden>
          <path
            d="M 4 14 Q 14 4, 24 14 Q 34 4, 44 14 Q 34 18, 24 14 Q 14 18, 4 14 Z"
            fill={lapis}
            fillOpacity="0.9"
          />
          <circle cx="24" cy="12" r="3.2" fill={gold} stroke={lapis} strokeWidth="0.8" />
          <path d="M 24 15 V 24" stroke={lapis} strokeWidth="1.2" />
          <path d="M 18 20 H 30" stroke={lapis} strokeWidth="1" />
        </svg>
        <span className="mt-0.5 font-display text-[12px] font-bold tracking-wider">
          {monogram}
        </span>
      </span>
    </span>
  );
}

/** عنوان رسمی هر بخش با نشانِ نیلوفر */
function CourtSectionHeader({
  subtitleEn,
  title,
  description,
  lapis,
  gold,
  muted,
}: {
  subtitleEn: string;
  title: string;
  description?: string;
  lapis: string;
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
        <Sparkles className="h-3.5 w-3.5" style={{ color: lapis }} />
        <span
          className="text-[9px] uppercase tracking-[0.36em]"
          style={{ color: gold }}
        >
          {subtitleEn}
        </span>
        <Sparkles className="h-3.5 w-3.5" style={{ color: lapis }} />
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

/** دروازه‌ی آپادانا با روبانِ شاهی و مهرِ فروهر */
function ApadanaPortico({
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
  mood: (typeof MOODS)[CourtMood];
}) {
  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[330px] flex-col items-center">
      <BullCapitalColumn
        className="pointer-events-none absolute -right-1 top-10 z-30 h-44 w-12 drop-shadow-sm"
        gold={mood.gold}
        lapis={mood.lapis}
        sage={mood.sage}
      />
      <BullCapitalColumn
        className="pointer-events-none absolute -left-1 top-10 z-30 h-44 w-12 drop-shadow-sm"
        gold={mood.gold}
        lapis={mood.lapis}
        sage={mood.sage}
        flip
      />

      <div
        className="relative w-[288px] overflow-hidden p-3 transition-all duration-700"
        style={{
          borderRadius: "18px 18px 28px 28px",
          backgroundColor: mood.cardBg,
          border: `1.5px solid ${mood.gold}`,
          boxShadow: mood.isDark
            ? "0 28px 65px -20px rgba(0,0,0,0.85), 0 0 40px -15px rgba(201,168,74,0.22)"
            : "0 26px 60px -22px rgba(80, 50, 20, 0.28), inset 0 0 24px rgba(201, 168, 74, 0.14)",
        }}
      >
        {/* کنگره‌ی هخامنشی */}
        <div className="absolute inset-x-3 top-1.5 z-20 flex h-3 justify-between px-0.5" aria-hidden>
          {Array.from({ length: 11 }, (_, i) => (
            <span
              key={i}
              className="w-2.5 rounded-[1px]"
              style={{ backgroundColor: mood.gold, opacity: 0.8 }}
            />
          ))}
        </div>

        {/* قاب عکس زوج */}
        <div
          className="relative mt-3 aspect-[3/3.85] w-full overflow-hidden rounded-[12px]"
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

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(26,53,104,0.22) 0%, transparent 40%, rgba(31,24,16,0.72) 100%)",
            }}
          />

          <div
            onClick={onToggleSeal}
            role="button"
            tabIndex={0}
            aria-expanded={unsealed}
            aria-label={unsealed ? "بستن فرمانِ بارگاه" : "گشودن مهرِ فروهر"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleSeal();
              }
            }}
            className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-end pb-5 transition-all duration-1000"
            style={{
              backgroundColor: unsealed
                ? "rgba(235, 228, 212, 0.0)"
                : "rgba(235, 228, 212, 0.55)",
              backdropFilter: unsealed ? "blur(0px)" : "blur(6px)",
              WebkitBackdropFilter: unsealed ? "blur(0px)" : "blur(6px)",
            }}
          >
            {/* روبان شاهی لاجوردی */}
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-[66px] h-7 transition-all duration-700 ${
                unsealed ? "scale-x-0 opacity-0" : "scale-x-100 opacity-95"
              }`}
              style={{
                backgroundImage: `linear-gradient(180deg, ${mood.lapis}, #0f2448)`,
                boxShadow: "0 4px 12px rgba(26,53,104,0.35)",
              }}
            />

            <div
              className={`transition-all duration-700 ${
                unsealed ? "scale-75 opacity-95" : "scale-100 hover:scale-105"
              }`}
            >
              <FaravaharSeal
                monogram={monogram}
                lapis={mood.isDark ? "#1a1410" : "#1a3568"}
                gold={mood.gold}
                size={68}
              />
            </div>

            <span className="mt-2 rounded-full border border-white/35 bg-black/40 px-3.5 py-1 text-[10px] text-white backdrop-blur-md">
              {unsealed
                ? "مهرِ فروهر گشوده شد · لمس برای بستن"
                : "برای گشودنِ فرمان، مهرِ فروهر را لمس کنید"}
            </span>
          </div>
        </div>

        {/* نوار نیلوفر پایین قاب */}
        <svg viewBox="0 0 260 18" className="mt-2 w-full" aria-hidden>
          <defs>
            <linearGradient id={`${uid}-lotus-band`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={mood.gold} stopOpacity="0.2" />
              <stop offset="50%" stopColor={mood.gold} stopOpacity="0.95" />
              <stop offset="100%" stopColor={mood.gold} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M 10 9 Q 40 2, 70 9 Q 100 16, 130 9 Q 160 2, 190 9 Q 220 16, 250 9"
            fill="none"
            stroke={`url(#${uid}-lotus-band)`}
            strokeWidth="1.4"
          />
        </svg>
      </div>
    </div>
  );
}

export function ParsWaltzRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, "");

  const [moodKey, setMoodKey] = useState<CourtMood>("dawn");
  const [unsealed, setUnsealed] = useState(false);
  const [storyTab, setStoryTab] = useState<"story" | "vows">("story");
  const [playingMusic, setPlayingMusic] = useState(false);
  const [swatchIdx, setSwatchIdx] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [offeringId, setOfferingId] =
    useState<(typeof COURT_OFFERINGS)[number]["id"]>("lotus");
  const [rsvpSealed, setRsvpSealed] = useState(false);

  useEffect(() => {
    const delay = features?.entranceAnimation === false ? 60 : 720;
    const timer = window.setTimeout(() => setUnsealed(true), delay);
    return () => window.clearTimeout(timer);
  }, [features?.entranceAnimation]);

  const theme: TemplateCustomization = {
    primaryColor: ROYAL_LAPIS,
    secondaryColor: ACHAEMENID_GOLD,
    backgroundColor: LIMESTONE,
    poeticLine:
      "«در بارگاهِ دل، دو ستون زیر یک سقف روییدند و سایه‌شان تا ابد یکی شد»",
    blessingLine:
      "حضور شما، فرخنده‌ترین نقشِ این بارگاه است.",
    dressCode:
      "پوشش رسمیِ شاهانه (Court Formal)؛ لاجورد، زرِ هخامنشی، فیروزه، سفال و سروی تیره.",
    musicTitle: "والسِ پارسه · چنگ و نیِ آپادانا",
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
  const selectedOffering =
    COURT_OFFERINGS.find((b) => b.id === offeringId) ?? COURT_OFFERINGS[0];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans transition-colors duration-700"
      style={
        {
          backgroundColor: mood.bg,
          color: mood.ink,
          "--pw-lapis": mood.lapis,
          "--pw-gold": mood.gold,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes pw-petal-fall {
          0% { transform: translateY(-20px) translateX(0px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.75; }
          85% { opacity: 0.75; }
          100% { transform: translateY(92vh) translateX(28px) rotate(220deg); opacity: 0; }
        }
        @keyframes pw-gold-foil {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes pw-eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes pw-seal-in {
          0% { transform: scale(1.35) rotate(-10deg); opacity: 0; }
          65% { transform: scale(0.95) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .pw-title-gradient {
          background-image: linear-gradient(100deg, ${mood.lapis} 0%, ${mood.gold} 40%, ${mood.ink} 70%, ${mood.gold} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: pw-gold-foil 10s linear infinite;
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-md overflow-x-clip">
        {/* بارش نرم ذرات زرین و نیلوفری */}
        <div
          className="pointer-events-none fixed inset-0 z-20 mx-auto max-w-md overflow-hidden"
          aria-hidden
        >
          {FALLING_LOTUSES.map((p, idx) => (
            <span
              key={idx}
              className="absolute -top-6 rounded-tl-full rounded-tr-none rounded-br-full rounded-bl-full shadow-xs"
              style={{
                left: p.left,
                width: p.size,
                height: p.size * 1.25,
                backgroundImage: `linear-gradient(135deg, ${mood.petalA}, ${mood.petalB})`,
                animation: `pw-petal-fall ${p.dur} linear ${p.delay} infinite`,
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
                color: mood.lapis,
              }}
            >
              {monogram}
            </span>

            {/* سوییچر حال‌وهوای بارگاه */}
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
                      backgroundColor: active ? mood.lapis : "transparent",
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
                  color: mood.lapis,
                }}
              >
                {playingMusic ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
                )}
              </button>
            ) : (
              <Heart className="h-4 w-4" style={{ color: mood.lapis }} />
            )}
          </div>
        </header>

        <main className="relative z-10 px-4 pb-28">
          {/* ————— ۱. صحنه‌ی نخست: دروازه‌ی آپادانا و مهرِ فروهر ————— */}
          <section className="relative flex flex-col items-center pt-7 pb-10 text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10.5px]"
              style={{
                borderColor: mood.border,
                backgroundColor: mood.cardBg,
                color: mood.lapis,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              به نامِ مهر و پیوندِ آریایی
            </span>

            {/* دروازه‌ی آپادانا و فرمانِ مهروموم‌شده */}
            <div className="mt-5 w-full">
              <ApadanaPortico
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
              <span className="pw-title-gradient px-3">
                {data.partnerOneName}
              </span>
              <span className="my-1 flex items-center gap-3">
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: mood.gold }}
                />
                <Heart
                  className="h-4 w-4 fill-current"
                  style={{ color: mood.lapis }}
                />
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: mood.gold }}
                />
              </span>
              <span className="pw-title-gradient px-3">
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
              style={{ color: mood.lapis }}
            >
              <span className="text-[8.5px] uppercase tracking-[0.3em]">
                ورق بزنید
              </span>
              <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
            </div>
          </section>

          {/* ————— ۲. فرمان دعوت، قصه‌ی پیمان و عهدنامه‌ی عروس و داماد ————— */}
          <section id="invitation" className="scroll-mt-20 pt-6">
            <CourtSectionHeader
              subtitleEn="The Royal Decree"
              title="فرمانی از بارگاهِ عشق"
              description="افتخار داریم شبِ پیمانمان را در بارگاهِ عشق کنار شما برگزار کنیم"
              lapis={mood.lapis}
              gold={mood.gold}
              muted={mood.muted}
            />

            <div
              className="relative mt-5 overflow-hidden rounded-[30px] border p-6 shadow-[0_24px_55px_-24px_rgba(80,50,20,0.22)]"
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
                style={{ color: mood.lapis }}
              >
                {theme.poeticLine}
              </blockquote>

              <p
                className="relative z-10 mt-3.5 text-center text-[13px] leading-8"
                style={{ color: mood.muted }}
              >
                {data.invitationText ||
                  "با کمال مهر و افتخار، شما را به جشن پیوندمان در بارگاهِ پارسه دعوت می‌کنیم؛ شبی که بی حضور شما کامل نیست."}
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
                        storyTab === "story" ? mood.lapis : "transparent",
                    }}
                  >
                    گاه‌های آشنایی
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
                        storyTab === "vows" ? mood.lapis : "transparent",
                    }}
                  >
                    <Feather className="h-3 w-3" />
                    عهدِ پارسه
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
                          style={{ color: mood.lapis }}
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
                        style={{ color: mood.lapis }}
                      >
                        عهدِ {data.partnerOneName}:
                      </p>
                      <p className="mt-1 font-display text-[17px] leading-8">
                        «عهد می‌بندم که چون ستونِ آپادانا، سایه‌بانِ آرامشِ تو و هم‌قدمِ رؤیاهایت باشم.»
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
                        style={{ color: mood.lapis }}
                      >
                        عهدِ {data.partnerTwoName}:
                      </p>
                      <p className="mt-1 font-display text-[17px] leading-8">
                        «عهد می‌بندم که هر طلوع را با لبخندِ تو آغاز کنم و مهرت را چون نقشِ زرین بر سنگِ دل نگه دارم.»
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
                      style={{ backgroundColor: mood.lapis }}
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
                          backgroundColor: mood.lapis,
                          animation: playingMusic
                            ? `pw-eq ${0.6 + i * 0.14}s ease-in-out infinite`
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
            <CourtSectionHeader
              subtitleEn="Save The Date"
              title="تقویمِ روزِ پیوند"
              description="روزِ موعود در سنگِ دل ما با نقشِ زرینِ فروهر کنده شده است"
              lapis={mood.lapis}
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
                  style={{ backgroundColor: mood.lapis }}
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
                        backgroundColor: isWeddingDay ? mood.lapis : mood.bg,
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
                    شمارش تپش‌ها تا ورود به بارگاه
                  </p>
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-2xl [&>div]:border [&>div]:border-[#c79d59]/35 [&>div]:bg-black/[0.03] [&>div]:py-3 [&_p:first-child]:font-display [&_p:first-child]:text-[24px] [&_p:last-child]:text-[10px]"
                  />
                </div>
              ) : null}
            </div>
          </section>

          {/* ————— ۴. چهار گاهِ شبِ رؤیایی ————— */}
          <section id="schedule" className="scroll-mt-20 pt-14">
            <CourtSectionHeader
              subtitleEn="The Wedding Chapters"
              title="چهار گاهِ شبِ رؤیایی"
              description="از ورود به بارگاه تا والس زیر آتشکده"
              lapis={mood.lapis}
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
                        style={{ color: mood.lapis }}
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

          {/* ————— ۵. نشانی بارگاه و مسیریابی ————— */}
          {showMap ? (
            <section id="location" className="scroll-mt-20 pt-14">
              <CourtSectionHeader
                subtitleEn="The Garden Venue"
                title="نشانیِ بارگاه و مسیریابی"
                description="مشتاق دیدار روی ماهتان در بارگاهِ جشن هستیم"
                lapis={mood.lapis}
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
                    color: mood.lapis,
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
                    style={{ backgroundColor: mood.lapis }}
                  >
                    <CalendarDays className="h-4 w-4" />
                    ثبتِ یادآور در تقویم گوگل
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* ————— ۶. پالتِ بارگاه (Dress Code) ————— */}
          <section className="pt-14">
            <CourtSectionHeader
              subtitleEn="The Petal Palette"
              title="پالتِ بارگاه و پوشش"
              description={theme.dressCode}
              lapis={mood.lapis}
              gold={mood.gold}
              muted={mood.muted}
            />

            <div className="mt-6 grid grid-cols-5 gap-2">
              {COURT_SWATCHES.map((swatch, idx) => {
                const active = swatchIdx === idx;
                return (
                  <button
                    key={swatch.label}
                    type="button"
                    onClick={() => setSwatchIdx(idx)}
                    aria-pressed={active}
                    className="flex flex-col items-center focus:outline-none"
                  >
                    {/* نشانِ لاجورد */}
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
              <span className="font-semibold" style={{ color: mood.lapis }}>
                {COURT_SWATCHES[swatchIdx].label}:{" "}
              </span>
              <span style={{ color: mood.muted }}>
                {COURT_SWATCHES[swatchIdx].tip}
              </span>
            </div>
          </section>

          {/* ————— ۷. اعلام حضور و مهرِ فروهر (RSVP) ————— */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 pt-14">
              <CourtSectionHeader
                subtitleEn="Kindly Reply"
                title="اعلامِ حضور و پیشکشِ بارگاه"
                description="پاسختان را با مهرِ زرینِ فروهر برای ما بفرستید"
                lapis={mood.lapis}
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
                    style={{ animation: "pw-seal-in 550ms ease-out both" }}
                  >
                    <FaravaharSeal
                      monogram={monogram}
                      lapis={mood.lapis}
                      gold={mood.gold}
                      size={88}
                    />
                    <p className="mt-4 font-display text-[21px]">
                      {attending
                        ? "با مهرِ فروهر ثبت شد؛ بی‌صبرانه چشم‌به‌راهتان در بارگاه هستیم"
                        : "پیشکش و پاسختان در بارگاهِ دل نشست"}
                    </p>
                    <p
                      className="mt-1 text-[12px]"
                      style={{ color: mood.muted }}
                    >
                      {attending
                        ? `${guests.toLocaleString("fa-IR")} نفر همراه · هدیهٔ دل: ${selectedOffering.label}`
                        : `دلمان با شماست · هدیهٔ دل: ${selectedOffering.label}`}
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
                              backgroundColor: active ? mood.lapis : mood.bg,
                              color: active ? "#ffffff" : mood.ink,
                              borderColor: active ? mood.lapis : mood.border,
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
                          style={{ color: mood.lapis }}
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
                          style={{ backgroundColor: mood.lapis }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* انتخاب پیشکش */}
                    <div className="mt-4">
                      <p
                        className="text-center text-[11px]"
                        style={{ color: mood.muted }}
                      >
                        کدام پیشکش را همراه فرمانِ خود می‌فرستید؟
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {COURT_OFFERINGS.map((item) => {
                          const active = offeringId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setOfferingId(item.id)}
                              className="flex w-full items-center justify-between rounded-xl border px-3.5 py-2 text-[11.5px] transition"
                              style={{
                                borderColor: active ? mood.lapis : mood.border,
                                backgroundColor: active
                                  ? `${mood.lapis}15`
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
                                  style={{ color: mood.lapis }}
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
                      style={{ backgroundColor: mood.lapis }}
                    >
                      <Sparkles className="h-4 w-4" />
                      {preview
                        ? "مهر کردن فرمان با فروهرِ زرین"
                        : "ثبتِ حضور با مهرِ فروهر"}
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : null}

          {/* ————— ۸. کلام پایانی ————— */}
          <section className="pt-16 pb-6 text-center">
            <Sparkles
              className="mx-auto h-6 w-6"
              style={{ color: mood.lapis }}
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
              { href: "#invitation", label: "فرمان", Icon: Feather },
              { href: "#schedule", label: "گاه‌ها", Icon: Clock },
              { href: "#location", label: "بارگاه", Icon: MapPin },
              { href: "#rsvp", label: "مهرِ حضور", Icon: Heart },
            ].map(({ href, label, Icon }: { href: string; label: string; Icon: (props: { className?: string; style?: CSSProperties }) => ReactNode }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] opacity-80 transition hover:opacity-100"
              >
                <Icon className="h-3.5 w-3.5" style={{ color: mood.lapis }} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
