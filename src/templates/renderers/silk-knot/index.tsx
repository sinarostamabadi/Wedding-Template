"use client";

import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  Clock,
  Coffee,
  Feather,
  Heart,
  MapPin,
  Minus,
  Music2,
  Pause,
  Play,
  Plus,
  RotateCcw,
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

const DEFAULT_COVER = "/images/templates/silk-knot-cover.jpg";

/** پالت رنگ‌های نئومینیمال عاشقانه (کتان خام، رز تراکوتا، اسپرسو و سنگ تراورتن) */
const LINEN_BG = "#f6f2ec";
const TERRACOTTA_ROSE = "#b86456";
const WARM_TAUPE = "#8c7a6b";

type PaperEdition = "linen" | "blush" | "travertine";

const PAPER_EDITIONS: Record<
  PaperEdition,
  {
    label: string;
    en: string;
    bg: string;
    cardBg: string;
    ink: string;
    muted: string;
    accent: string;
    border: string;
    pillBg: string;
  }
> = {
  linen: {
    label: "کتانِ خام",
    en: "Raw Linen",
    bg: "#f6f2ec",
    cardBg: "#fbf9f5",
    ink: "#1d1816",
    muted: "#786c63",
    accent: "#b86456",
    border: "rgba(29, 24, 22, 0.11)",
    pillBg: "rgba(255, 255, 255, 0.68)",
  },
  blush: {
    label: "حریرِ رز",
    en: "Blushed Silk",
    bg: "#f4eae6",
    cardBg: "#faf4f2",
    ink: "#261918",
    muted: "#826865",
    accent: "#a84c42",
    border: "rgba(38, 25, 24, 0.11)",
    pillBg: "rgba(255, 250, 249, 0.72)",
  },
  travertine: {
    label: "سنگِ مهتاب",
    en: "Warm Stone",
    bg: "#ebe5dc",
    cardBg: "#f5f0e8",
    ink: "#1c1a17",
    muted: "#6e675f",
    accent: "#8f5849",
    border: "rgba(28, 26, 23, 0.13)",
    pillBg: "rgba(251, 248, 243, 0.72)",
  },
};

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "درنگِ نخست · خوشامد و نوشیدنی",
    description: "دیدار در ایوانِ مینیمال همراه با نوای پیانو و قهوه تخصصی",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "درنگِ دوم · گرهِ پیمان",
    description: "ثبتِ لحظه‌ی یکی‌شدن در حضور عزیزترین‌ها زیر نورِ طبیعیِ غروب",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "درنگِ سوم · شامِ صمیمانه",
    description: "میزبانی به سبکِ مدیترانه‌ای دورِ میزهای بلندِ چوب و کتان",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "درنگِ چهارم · رقصِ اول و موسیقی",
    description: "نخستین رقصِ ما و ادامهٔ شب با ملودی‌های منتخب",
    icon: "music",
  },
];

const NEO_SWATCHES = [
  {
    color: "#b86456",
    label: "رزِ خاکی",
    en: "Terracotta Rose",
    note: "طیف گرمِ رزِ خاکی و مرجانی مات، قلبِ تپنده‌ی پالتِ این شب است.",
  },
  {
    color: "#d9c5b8",
    label: "پودریِ گرم",
    en: "Blush Nude",
    note: "پارچه‌های ابریشمی و ساتن مات به رنگ پودری و نودِ گرم.",
  },
  {
    color: "#8c7a6b",
    label: "توپِ سنگی",
    en: "Warm Taupe",
    note: "کت‌وشلوار یا پیراهن‌های مینیمال با تناژ خاکی، موکا و سنگی.",
  },
  {
    color: "#4a5246",
    label: "زیتونیِ تیره",
    en: "Muted Olive",
    note: "سبزِ زیتونیِ عمیق و مات که کنتراستی شاعرانه با فضای روشن دارد.",
  },
  {
    color: "#1d1816",
    label: "اسپرسو",
    en: "Deep Espresso",
    note: "مشکیِ گرم و قهوه‌ایِ اسپرسو برای استایل‌های کلاسیک و رسمی.",
  },
];

const KEEPSAKE_WORDS = [
  { id: "eternity", word: "«جاودانگی»", en: "Eternity" },
  { id: "serenity", word: "«آرامش»", en: "Serenity" },
  { id: "warmth", word: "«روشنایی»", en: "Luminance" },
] as const;

const PAPER_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")";

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", day: "", month: "", monthNum: "", year: "" };
  try {
    const date = new Date(iso);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...options }).format(date);
    return {
      weekday: format({ weekday: "long" }),
      day: format({ day: "2-digit" }),
      month: format({ month: "long" }),
      monthNum: format({ month: "2-digit" }),
      year: format({ year: "numeric" }),
    };
  } catch {
    return { weekday: "", day: "", month: "", monthNum: "", year: "" };
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

/** سرصلِ ادیتوریال نئومینیمال با شماره‌گذاری ۰۱ تا ۰۵ */
function MinimalSectionIndex({
  index,
  en,
  title,
  accent,
  border,
}: {
  index: string;
  en: string;
  title: string;
  accent: string;
  border: string;
}) {
  return (
    <div className="mb-6">
      <div
        className="flex items-center justify-between border-b pb-2.5 text-[9.5px] uppercase tracking-[0.32em]"
        style={{ borderColor: border }}
      >
        <span className="flex items-center gap-2 font-mono">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
          {index}
        </span>
        <span className="opacity-55">{en}</span>
      </div>
      <h2 className="mt-3 font-display text-[26px] leading-tight tracking-tight">
        {title}
      </h2>
    </div>
  );
}

/** رشته‌ی ابریشمِ سرنوشت (تعاملی) که دو حلقه را به هم گره می‌زند */
function SilkThreadKnot({
  uid,
  tied,
  onToggle,
  accent,
  monogram,
}: {
  uid: string;
  tied: boolean;
  onToggle: () => void;
  accent: string;
  monogram: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={tied}
      aria-label={tied ? "باز کردن گره ابریشم" : "گره زدن رشته ابریشم"}
      className="group relative mx-auto my-2 flex w-full max-w-[320px] cursor-pointer flex-col items-center py-2 focus:outline-none"
    >
      <svg
        viewBox="0 0 320 76"
        className="h-[72px] w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${uid}-silk`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
            <stop offset="25%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="50%" stopColor="#d98273" stopOpacity="1" />
            <stop offset="75%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* رشته‌ی چپ و راست ابریشم */}
        <path
          d={
            tied
              ? "M 4 38 C 68 38, 108 14, 160 38 C 212 62, 252 38, 316 38"
              : "M 4 50 C 64 16, 112 64, 160 38 C 208 12, 256 60, 316 26"
          }
          fill="none"
          stroke={`url(#${uid}-silk)`}
          strokeWidth="2.2"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />

        {/* حلقهٔ بی‌نهایتِ گرهِ ابریشم در مرکز */}
        <path
          d={
            tied
              ? "M 160 38 C 142 14, 116 22, 126 42 C 134 58, 154 46, 160 38 C 166 30, 186 18, 194 34 C 204 54, 178 62, 160 38 Z"
              : "M 160 38 C 130 2, 92 20, 108 48 C 120 68, 150 50, 160 38 C 170 26, 200 8, 212 28 C 228 56, 190 74, 160 38 Z"
          }
          fill="none"
          stroke={accent}
          strokeWidth={tied ? "2" : "1.3"}
          strokeDasharray={tied ? "0" : "3 3"}
          className="transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />

        {/* دو حلقه‌ی مینیمال طلایی/برنزی که با گره به هم نزدیک می‌شوند */}
        <circle
          cx={tied ? "151" : "130"}
          cy="38"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          className="transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
        <circle
          cx={tied ? "169" : "190"}
          cy="38"
          r="15"
          fill="none"
          stroke={accent}
          strokeOpacity="0.7"
          strokeWidth="1.2"
          className="transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />

        {/* نقطه‌ی تپندهٔ مرکزی گره */}
        <circle
          cx="160"
          cy="38"
          r={tied ? "4.5" : "3"}
          fill={accent}
          className="transition-all duration-700"
        />
      </svg>

      <span className="mt-0.5 inline-flex items-center gap-2 rounded-full border border-current/10 bg-white/55 px-3.5 py-1 text-[10px] tracking-wide backdrop-blur-sm transition group-hover:border-current/25">
        <span
          className="h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:scale-125"
          style={{ backgroundColor: accent }}
        />
        <span>
          {tied
            ? `گرهِ ابدیِ ${monogram} بسته شد · لمس برای بازگشایی لفاف`
            : "برای بستنِ گرهِ ابریشم و کنار رفتنِ کاغذ کالک لمس کنید"}
        </span>
      </span>
    </button>
  );
}

export function SilkKnotRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, "");

  const [edition, setEdition] = useState<PaperEdition>("linen");
  const [knotTied, setKnotTied] = useState(false);
  const [showPersonalNote, setShowPersonalNote] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [keepsake, setKeepsake] =
    useState<(typeof KEEPSAKE_WORDS)[number]["id"]>("eternity");
  const [embossed, setEmbossed] = useState(false);

  useEffect(() => {
    const delay = features?.entranceAnimation === false ? 60 : 680;
    const timer = window.setTimeout(() => setKnotTied(true), delay);
    return () => window.clearTimeout(timer);
  }, [features?.entranceAnimation]);

  const theme: TemplateCustomization = {
    primaryColor: TERRACOTTA_ROSE,
    secondaryColor: WARM_TAUPE,
    backgroundColor: LINEN_BG,
    poeticLine: "«در سادگیِ بودنِ با تو، تمامِ جهان خلاصه شده است»",
    blessingLine:
      "حضورِ آرام و پرمهرِ شما، زیباترین سطرِ کتابِ زندگیِ ماست.",
    dressCode:
      "مینیمال و شاعرانه (Minimal Formal)؛ پارچه‌های لطیف با تناژهای رز خاکی، پودری، سنگی، زیتونی مات و اسپرسو.",
    musicTitle: "سولوی پیانو و ویلنسل · قطعهٔ ابریشم",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const paper = PAPER_EDITIONS[edition];
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
  const selectedKeepsake =
    KEEPSAKE_WORDS.find((k) => k.id === keepsake) ?? KEEPSAKE_WORDS[0];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans transition-colors duration-700"
      style={
        {
          backgroundColor: paper.bg,
          color: paper.ink,
          "--sk-accent": paper.accent,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes sk-breathe {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.18); opacity: 1; }
        }
        @keyframes sk-wave {
          0%, 100% { transform: scaleY(0.28); }
          50% { transform: scaleY(1); }
        }
        @keyframes sk-emboss {
          0% { transform: scale(1.08); opacity: 0; }
          60% { transform: scale(0.97); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* بافتِ ملموسِ کاغذ کتان در سراسر صفحه */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.055] mix-blend-multiply"
        style={{ backgroundImage: PAPER_NOISE }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-md overflow-x-clip">
        {/* خطوط راهنمای معماری نئومینیمال در طرفین صفحه */}
        <span
          className="pointer-events-none absolute inset-y-0 right-4 z-0 w-px"
          style={{ backgroundColor: paper.border }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute inset-y-0 left-4 z-0 w-px"
          style={{ backgroundColor: paper.border }}
          aria-hidden
        />

        {/* هدر بسیار ظریف ادیتوریال */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-500"
          style={{
            borderColor: paper.border,
            backgroundColor: `${paper.bg}d9`,
          }}
        >
          <div className="flex h-13 items-center justify-between px-5">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] opacity-65">
              No. 01 — {monogram}
            </span>

            <div className="flex items-center gap-1.5">
              {(Object.keys(PAPER_EDITIONS) as PaperEdition[]).map((key) => {
                const item = PAPER_EDITIONS[key];
                const active = edition === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEdition(key)}
                    aria-label={`بافت ${item.label}`}
                    title={item.label}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9.5px] transition ${
                      active
                        ? "bg-[#1d1816] text-[#fbf9f5]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full border border-black/15"
                      style={{ backgroundColor: item.bg }}
                    />
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
                className="flex h-7 w-7 items-center justify-center rounded-full border border-current/15 transition hover:border-current/40"
              >
                {playingMusic ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3 translate-x-[0.5px]" />
                )}
              </button>
            ) : (
              <span className="font-mono text-[9px] opacity-50">2027</span>
            )}
          </div>
        </header>

        <main className="relative z-10 px-6 pb-28">
          {/* ————— HERO: نئومینیمالیسمِ شاعرانه با لفاف کالک و گره ابریشم ————— */}
          <section className="relative pt-7 pb-12">
            {/* متادیتای بالای هیرو */}
            <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.34em] opacity-55">
              <span>Atelier Edition</span>
              <span>{latinDate || "21 . 05 . 2027"}</span>
            </div>

            {/* تایپوگرافی نام عروس و داماد با چیدمان نامتقارن ادیتوریال */}
            <div className="mt-5">
              <p
                className="text-[11px] tracking-[0.22em]"
                style={{ color: paper.accent }}
              >
                پیمانِ پیوند و همسفری
              </p>

              <h1 className="mt-2 flex flex-col font-display text-[46px] leading-[1.08] tracking-tight">
                <span className="self-start">{data.partnerOneName}</span>
                <span className="my-1 flex items-center gap-3 self-center">
                  <span
                    className="h-px w-12"
                    style={{ backgroundColor: paper.border }}
                  />
                  <span
                    className="font-sans text-[11px] font-light italic tracking-[0.3em]"
                    style={{ color: paper.accent }}
                  >
                    &amp;
                  </span>
                  <span
                    className="h-px w-12"
                    style={{ backgroundColor: paper.border }}
                  />
                </span>
                <span className="self-end">{data.partnerTwoName}</span>
              </h1>
            </div>

            {/* قاب مجسمه‌گونه‌ی عکس زوج با لفافِ کاغذ کالک (Vellum) که با گره ابریشم کنار می‌رود */}
            <div className="relative mx-auto mt-6 w-full max-w-[300px]">
              {/* کادر گودافتاده (Blind Deboss) روی کاغذ کتان */}
              <div
                className="relative overflow-hidden p-3 transition-colors duration-500"
                style={{
                  backgroundColor: paper.cardBg,
                  borderRadius: "150px 150px 20px 20px",
                  boxShadow:
                    "inset 0 2px 6px rgba(29,24,22,0.08), 0 24px 48px -24px rgba(29,24,22,0.18)",
                  border: `1px solid ${paper.border}`,
                }}
              >
                <div
                  className="relative aspect-[3/3.8] w-full overflow-hidden"
                  style={{ borderRadius: "140px 140px 12px 12px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={couple}
                    className="h-full w-full object-cover transition-all duration-1000 ease-out"
                    style={{
                      transform: knotTied ? "scale(1.0)" : "scale(1.08)",
                      filter: knotTied
                        ? "contrast(1.02) saturate(0.95)"
                        : "grayscale(0.35) contrast(0.95) blur(3px)",
                    }}
                  />

                  {/* لفافِ نیمه‌شفافِ کاغذ کالک (Vellum Sleeve) که با بسته شدن گره کنار می‌رود */}
                  <div
                    onClick={() => setKnotTied((v) => !v)}
                    role="button"
                    tabIndex={0}
                    aria-label="کنار زدن کاغذ کالک"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setKnotTied((v) => !v);
                      }
                    }}
                    className="absolute inset-0 flex cursor-pointer flex-col items-center justify-end p-5 text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      backgroundColor: knotTied
                        ? "rgba(251, 249, 245, 0.0)"
                        : "rgba(246, 242, 236, 0.72)",
                      backdropFilter: knotTied ? "blur(0px)" : "blur(8px)",
                      WebkitBackdropFilter: knotTied ? "blur(0px)" : "blur(8px)",
                    }}
                  >
                    <div
                      className={`rounded-2xl border px-4 py-2.5 backdrop-blur-md transition-all duration-700 ${
                        knotTied
                          ? "translate-y-2 opacity-90"
                          : "translate-y-0 opacity-100"
                      }`}
                      style={{
                        backgroundColor: paper.pillBg,
                        borderColor: paper.border,
                      }}
                    >
                      <p className="font-display text-[15px] text-[#1d1816]">
                        {parts.day && parts.month
                          ? `${parts.day} ${parts.month} ${parts.year}`
                          : "بهار ۱۴۰۶"}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#786c63]">
                        {data.venueName || "عمارت یاس سفید"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* برچسب عمودی ادیتوریال در کنار قاب */}
              <span
                className="pointer-events-none absolute -left-3 top-1/2 -translate-y-1/2 rotate-90 rounded-full border px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.28em]"
                style={{
                  backgroundColor: paper.cardBg,
                  borderColor: paper.border,
                  color: paper.muted,
                }}
              >
                Silk &amp; Stone
              </span>
            </div>

            {/* رشته‌ی ابریشمِ سرنوشت */}
            <div className="mt-4">
              <SilkThreadKnot
                uid={uid}
                tied={knotTied}
                onToggle={() => setKnotTied((v) => !v)}
                accent={paper.accent}
                monogram={monogram}
              />
            </div>
          </section>

          {/* ————— 01 / THE PROLOGUE: دعوت‌نامه و دست‌نوشتهٔ صمیمانه ————— */}
          <section id="invitation" className="scroll-mt-20 pt-8">
            <MinimalSectionIndex
              index="01"
              en="The Prologue"
              title="پیش‌درآمدِ با هم بودن"
              accent={paper.accent}
              border={paper.border}
            />

            <div
              className="relative overflow-hidden rounded-3xl border p-6 transition-all duration-500"
              style={{
                backgroundColor: paper.cardBg,
                borderColor: paper.border,
                boxShadow: "0 18px 40px -24px rgba(29,24,22,0.12)",
              }}
            >
              {/* سوییچر بین متن رسمی دعوت و یادداشت صمیمانه زوج */}
              <div
                className="mb-5 inline-flex rounded-full border p-0.5 text-[10.5px]"
                style={{
                  borderColor: paper.border,
                  backgroundColor: paper.bg,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowPersonalNote(false)}
                  className={`rounded-full px-3.5 py-1 transition ${
                    !showPersonalNote
                      ? "bg-[#1d1816] text-[#fbf9f5]"
                      : "opacity-65 hover:opacity-100"
                  }`}
                >
                  کارتِ دعوت
                </button>
                <button
                  type="button"
                  onClick={() => setShowPersonalNote(true)}
                  className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1 transition ${
                    showPersonalNote
                      ? "bg-[#1d1816] text-[#fbf9f5]"
                      : "opacity-65 hover:opacity-100"
                  }`}
                >
                  <Feather className="h-3 w-3" />
                  یادداشتِ شخصیِ ما
                </button>
              </div>

              {!showPersonalNote ? (
                <div>
                  <blockquote className="font-display text-[21px] leading-9">
                    {theme.poeticLine}
                  </blockquote>

                  <p
                    className="mt-4 text-[13px] leading-8"
                    style={{ color: paper.muted }}
                  >
                    {data.invitationText ||
                      "زیباترین لحظه‌های زندگی زمانی معنا می‌گیرند که در کنارِ عزیزترین‌ها تقسیم شوند. با قلبی سرشار از عشق و آرامش، شما را به جشنِ آغازِ زندگیِ مشترکمان دعوت می‌کنیم."}
                  </p>

                  {families ? (
                    <p
                      className="mt-4 border-t pt-3 text-[11.5px]"
                      style={{
                        borderColor: paper.border,
                        color: paper.muted,
                      }}
                    >
                      به میزبانی خانواده‌های {families}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-3 py-1">
                  <p
                    className="text-[11px] uppercase tracking-[0.2em]"
                    style={{ color: paper.accent }}
                  >
                    از طرفِ {data.partnerOneName} و {data.partnerTwoName} به شما:
                  </p>
                  <p className="font-display text-[18px] leading-9">
                    «ما باور داریم که زیبایی در سادگی و صمیمیت است؛ این شب برای ما یک تشریفات نیست، بلکه بهانه‌ای است تا در آغوشِ لبخندِ شما، قصه‌مان را آغاز کنیم.»
                  </p>
                  <p
                    className="text-[11.5px]"
                    style={{ color: paper.muted }}
                  >
                    — با تمامِ مهر، منتظر دیدارتان هستیم.
                  </p>
                </div>
              )}

              {/* نوار مینیمال پخش موسیقی */}
              {showMusic ? (
                <div
                  className="mt-6 flex items-center justify-between rounded-2xl border px-3.5 py-2.5"
                  style={{
                    borderColor: paper.border,
                    backgroundColor: paper.bg,
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setPlayingMusic((p) => !p)}
                      aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition active:scale-95"
                      style={{ backgroundColor: paper.accent }}
                    >
                      {playingMusic ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-medium">
                        {theme.musicTitle}
                      </p>
                      <p
                        className="text-[9.5px]"
                        style={{ color: paper.muted }}
                      >
                        {playingMusic
                          ? "در حال پخشِ ملودی…"
                          : "لمس برای شنیدنِ قطعهٔ عاشقانه"}
                      </p>
                    </div>
                  </div>

                  <div className="flex h-3.5 items-end gap-0.5 px-1" aria-hidden>
                    {[0.4, 0.85, 0.6, 1, 0.5, 0.75].map((h, i) => (
                      <span
                        key={i}
                        className="w-[2.5px] rounded-full"
                        style={{
                          height: `${h * 14}px`,
                          backgroundColor: paper.accent,
                          animation: playingMusic
                            ? `sk-wave ${0.65 + i * 0.12}s ease-in-out infinite`
                            : "none",
                          opacity: playingMusic ? 0.9 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {/* ————— 02 / THE MOMENT: تقویم تایپوگرافیک و شمارش معکوس ————— */}
          <section className="pt-14">
            <MinimalSectionIndex
              index="02"
              en="The Moment"
              title="لحظهٔ موعود"
              accent={paper.accent}
              border={paper.border}
            />

            {/* گرید تایپوگرافیک تاریخ */}
            <div
              className="grid grid-cols-3 divide-x divide-x-reverse overflow-hidden rounded-3xl border text-center"
              style={{
                borderColor: paper.border,
                backgroundColor: paper.cardBg,
              }}
            >
              <div className="p-4" style={{ borderColor: paper.border }}>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.26em] opacity-45">
                  Day
                </span>
                <p className="mt-1 font-display text-[36px] leading-none">
                  {parts.day || "۳۱"}
                </p>
                <p
                  className="mt-1.5 text-[11px]"
                  style={{ color: paper.muted }}
                >
                  {parts.weekday || "جمعه"}
                </p>
              </div>

              <div className="p-4" style={{ borderColor: paper.border }}>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.26em] opacity-45">
                  Month
                </span>
                <p
                  className="mt-1 font-display text-[36px] leading-none"
                  style={{ color: paper.accent }}
                >
                  {parts.monthNum || "۰۲"}
                </p>
                <p
                  className="mt-1.5 text-[11px]"
                  style={{ color: paper.muted }}
                >
                  {parts.month || "اردیبهشت"}
                </p>
              </div>

              <div className="p-4" style={{ borderColor: paper.border }}>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.26em] opacity-45">
                  Time
                </span>
                <p className="mt-1 font-display text-[28px] leading-none pt-1">
                  {startTime || "۱۸:۰۰"}
                </p>
                <p
                  className="mt-2 text-[11px]"
                  style={{ color: paper.muted }}
                >
                  {parts.year || "۱۴۰۶"}
                </p>
              </div>
            </div>

            {showCountdown ? (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span
                    className="text-[10.5px]"
                    style={{ color: paper.muted }}
                  >
                    شمارشِ لحظه‌ها تا دیدار
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] opacity-60">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: paper.accent,
                        animation: "sk-breathe 2.2s ease-in-out infinite",
                      }}
                    />
                    Live
                  </span>
                </div>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="[&>div]:rounded-2xl [&>div]:border [&>div]:border-black/10 [&>div]:bg-white/60 [&>div]:py-3.5 [&>div]:backdrop-blur-sm [&_p:first-child]:font-display [&_p:first-child]:text-[24px] [&_p:first-child]:font-normal [&_p:last-child]:text-[10px] [&_p:last-child]:opacity-60"
                />
              </div>
            ) : null}
          </section>

          {/* ————— 03 / THE RHYTHM: تایم‌لاین خطی نئومینیمال ————— */}
          <section id="schedule" className="scroll-mt-20 pt-14">
            <MinimalSectionIndex
              index="03"
              en="The Rhythm"
              title="ریتمِ شبِ جشن"
              accent={paper.accent}
              border={paper.border}
            />

            <div className="relative pr-4">
              {/* خط عمودی بسیار ظریف */}
              <span
                className="pointer-events-none absolute bottom-4 right-[7px] top-3 w-px"
                style={{ backgroundColor: paper.border }}
                aria-hidden
              />

              <ul className="space-y-5">
                {schedule.map((item, idx) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <li key={`${item.time}-${item.title}`} className="relative pr-5">
                      {/* گره دایره‌ای روی خط زمان */}
                      <span
                        className="absolute -right-[13px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-white"
                        style={{ borderColor: paper.accent }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: paper.accent }}
                        />
                      </span>

                      <div
                        className="rounded-2xl border p-4 transition"
                        style={{
                          backgroundColor: paper.cardBg,
                          borderColor: paper.border,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                            style={{
                              backgroundColor: paper.bg,
                              color: paper.accent,
                            }}
                          >
                            <Icon className="h-3 w-3" />
                            {item.time}
                          </span>
                          <span className="font-mono text-[9px] opacity-40">
                            0{idx + 1}
                          </span>
                        </div>
                        <p className="mt-2 font-display text-[18px] leading-snug">
                          {item.title}
                        </p>
                        <p
                          className="mt-1 text-[12px] leading-6"
                          style={{ color: paper.muted }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* ————— 04 / THE SPACE: مکان و مسیریابی به سبک کارت گالری ————— */}
          {showMap ? (
            <section id="location" className="scroll-mt-20 pt-14">
              <MinimalSectionIndex
                index="04"
                en="The Space"
                title="مکانِ میزبانی"
                accent={paper.accent}
                border={paper.border}
              />

              <div
                className="overflow-hidden rounded-3xl border p-5"
                style={{
                  backgroundColor: paper.cardBg,
                  borderColor: paper.border,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="font-mono text-[9px] uppercase tracking-[0.26em]"
                      style={{ color: paper.accent }}
                    >
                      35.8167° N · 51.4667° E
                    </span>
                    <h3 className="mt-1 font-display text-[23px]">
                      {data.venueName || "عمارت یاس سفید"}
                    </h3>
                    {data.venueAddress ? (
                      <p
                        className="mt-1 text-[12px] leading-6"
                        style={{ color: paper.muted }}
                      >
                        {data.venueAddress}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
                    style={{
                      borderColor: paper.border,
                      backgroundColor: paper.bg,
                      color: paper.accent,
                    }}
                  >
                    <MapPin className="h-5 w-5" />
                  </span>
                </div>

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
                        className="flex items-center justify-center gap-1 rounded-xl border py-2.5 text-[11.5px] font-medium transition hover:opacity-80"
                        style={{
                          borderColor: paper.border,
                          backgroundColor: paper.bg,
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
                    className="mt-2.5 flex items-center justify-center gap-2 rounded-xl py-3 text-[12px] font-medium text-[#fbf9f5] transition hover:opacity-95"
                    style={{ backgroundColor: paper.ink }}
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن رویداد به تقویم گوگل
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* ————— 05 / THE PALETTE: گوی‌های هم‌پوشان نئومینیمال ————— */}
          <section className="pt-14">
            <MinimalSectionIndex
              index="05"
              en="The Palette"
              title="پالتِ رنگ و بافتِ پوشش"
              accent={paper.accent}
              border={paper.border}
            />

            <p
              className="text-[12.5px] leading-7"
              style={{ color: paper.muted }}
            >
              {theme.dressCode}
            </p>

            {/* دایره‌های هم‌پوشان ملموس (Tactile Overlapping Spheres) */}
            <div className="mt-5 flex items-center justify-center">
              {NEO_SWATCHES.map((swatch, idx) => {
                const active = activeSwatch === idx;
                return (
                  <button
                    key={swatch.label}
                    type="button"
                    onClick={() => setActiveSwatch(idx)}
                    aria-pressed={active}
                    className={`relative -mx-1.5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white shadow-md transition-all duration-300 focus:outline-none ${
                      active ? "z-20 scale-115 shadow-lg" : "z-10 opacity-85 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: swatch.color }}
                    title={swatch.label}
                  >
                    {active ? (
                      <span className="h-2 w-2 rounded-full bg-white shadow" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div
              className="mt-4 rounded-2xl border px-4 py-3 text-center transition"
              style={{
                backgroundColor: paper.cardBg,
                borderColor: paper.border,
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="font-display text-[16px]">
                  {NEO_SWATCHES[activeSwatch].label}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-45">
                  {NEO_SWATCHES[activeSwatch].en}
                </span>
              </div>
              <p
                className="mt-1 text-[11.5px] leading-6"
                style={{ color: paper.muted }}
              >
                {NEO_SWATCHES[activeSwatch].note}
              </p>
            </div>
          </section>

          {/* ————— 06 / THE RESPONSE: کارت پستال برجسته و مهر خشک (Blind Emboss RSVP) ————— */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 pt-14">
              <MinimalSectionIndex
                index="06"
                en="The Response"
                title="پاسخِ حضور و مهرِ برجسته"
                accent={paper.accent}
                border={paper.border}
              />

              <div
                className="relative overflow-hidden rounded-3xl border p-6"
                style={{
                  backgroundColor: paper.cardBg,
                  borderColor: paper.border,
                  boxShadow:
                    "inset 0 2px 5px rgba(29,24,22,0.05), 0 24px 48px -24px rgba(29,24,22,0.14)",
                }}
              >
                {embossed ? (
                  <div
                    className="flex flex-col items-center py-3 text-center"
                    style={{ animation: "sk-emboss 550ms ease-out both" }}
                  >
                    {/* مهرِ برجسته‌ی خشک روی کاغذ کتان (Blind Emboss Seal) */}
                    <div
                      className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full border"
                      style={{
                        backgroundColor: paper.bg,
                        borderColor: paper.border,
                        boxShadow:
                          "inset 3px 3px 7px rgba(29,24,22,0.12), inset -3px -3px 7px rgba(255,255,255,0.85), 0 8px 20px -10px rgba(29,24,22,0.15)",
                      }}
                    >
                      <span
                        className="absolute inset-2 rounded-full border border-dashed"
                        style={{ borderColor: paper.border }}
                      />
                      <span className="font-mono text-[8px] uppercase tracking-[0.26em] opacity-45">
                        Embossed
                      </span>
                      <span className="mt-0.5 font-display text-[17px]">
                        {monogram}
                      </span>
                      <span
                        className="mt-0.5 text-[9.5px]"
                        style={{ color: paper.accent }}
                      >
                        {selectedKeepsake.word}
                      </span>
                    </div>

                    <p className="mt-4 font-display text-[20px]">
                      {attending
                        ? "با مهرِ برجسته ثبت شد؛ مشتاقِ دیدارتان هستیم"
                        : "پاسخ و یادگارِ پرمهرتان ثبت شد"}
                    </p>
                    <p
                      className="mt-1 text-[12px]"
                      style={{ color: paper.muted }}
                    >
                      {attending
                        ? `${guests.toLocaleString("fa-IR")} نفر همراه · واژهٔ یادگار: ${selectedKeepsake.word}`
                        : `دلمان با شماست · واژهٔ یادگار: ${selectedKeepsake.word}`}
                    </p>

                    <button
                      type="button"
                      onClick={() => setEmbossed(false)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] opacity-70 transition hover:opacity-100"
                      style={{ borderColor: paper.border }}
                    >
                      <RotateCcw className="h-3 w-3" />
                      تغییر پاسخ
                    </button>
                  </div>
                ) : (
                  <>
                    <p
                      className="text-[12px] leading-6"
                      style={{ color: paper.muted }}
                    >
                      لطفاً ما را از حضورِ گرم خود آگاه سازید و یک واژه به عنوان یادگارِ این شب بر کارتِ ما حک کنید.
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {[
                        { value: true, label: "با کمال میل می‌آیم" },
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
                              backgroundColor: active ? paper.ink : paper.bg,
                              color: active ? "#fbf9f5" : paper.ink,
                              borderColor: active ? paper.ink : paper.border,
                            }}
                          >
                            {active ? <Check className="h-3.5 w-3.5" /> : null}
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {/* انتخاب تعداد همراهان */}
                    <div
                      className={`mt-3 flex items-center justify-between rounded-2xl border px-4 py-2.5 transition ${
                        attending ? "" : "pointer-events-none opacity-40"
                      }`}
                      style={{
                        borderColor: paper.border,
                        backgroundColor: paper.bg,
                      }}
                    >
                      <span className="flex items-center gap-1.5 text-[12px]">
                        <Users
                          className="h-4 w-4"
                          style={{ color: paper.accent }}
                        />
                        شمار همراهان
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="کاهش همراهان"
                          onClick={() => setGuests((v) => Math.max(1, v - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-90"
                          style={{ borderColor: paper.border }}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-display text-[19px]">
                          {guests.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          aria-label="افزایش همراهان"
                          onClick={() => setGuests((v) => Math.min(8, v + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition active:scale-90"
                          style={{ backgroundColor: paper.ink }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* انتخاب واژه برای مهر برجسته */}
                    <div className="mt-4">
                      <p
                        className="text-[11px]"
                        style={{ color: paper.muted }}
                      >
                        واژه‌ای برای حک شدن با مهرِ برجسته روی کارت:
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {KEEPSAKE_WORDS.map((item) => {
                          const active = keepsake === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setKeepsake(item.id)}
                              className="rounded-xl border py-2 text-center text-[11.5px] transition"
                              style={{
                                borderColor: active
                                  ? paper.accent
                                  : paper.border,
                                backgroundColor: active
                                  ? `${paper.accent}18`
                                  : paper.bg,
                                color: active ? paper.accent : paper.ink,
                              }}
                            >
                              {item.word}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEmbossed(true)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[12.5px] font-medium text-[#fbf9f5] shadow-sm transition hover:opacity-95 active:scale-[0.99]"
                      style={{ backgroundColor: paper.accent }}
                    >
                      <Sparkles className="h-4 w-4" />
                      {preview
                        ? "حک کردنِ مهرِ برجسته و ثبتِ پاسخ"
                        : "ثبتِ پاسخ با مهرِ برجسته"}
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : null}

          {/* ————— FOOTER / COLOPHON ————— */}
          <section className="pt-16 pb-6 text-center">
            <p className="mx-auto max-w-[280px] font-display text-[20px] leading-9">
              {theme.blessingLine}
            </p>

            <div className="my-6 flex items-center justify-center gap-3">
              <span
                className="h-px w-12"
                style={{ backgroundColor: paper.border }}
              />
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border font-display text-[12px]"
                style={{
                  borderColor: paper.border,
                  backgroundColor: paper.cardBg,
                }}
              >
                {monogram}
              </span>
              <span
                className="h-px w-12"
                style={{ backgroundColor: paper.border }}
              />
            </div>

            <p className="font-mono text-[9px] uppercase tracking-[0.34em] opacity-50">
              {latinDate} · {couple}
            </p>
          </section>
        </main>

        {/* نوار ناوبری کپسولی شناور (Neo-Minimal Floating Dock) */}
        <nav className="fixed bottom-4 left-0 right-0 z-40 mx-auto w-[calc(100%-2.5rem)] max-w-[380px]">
          <div
            className="flex h-13 items-center justify-around rounded-full border px-3 shadow-[0_16px_36px_-12px_rgba(29,24,22,0.22)] backdrop-blur-xl"
            style={{
              backgroundColor: paper.pillBg,
              borderColor: paper.border,
            }}
          >
            {[
              { href: "#invitation", label: "پیش‌درآمد", Icon: Feather },
              { href: "#schedule", label: "ریتمِ شب", Icon: Clock },
              { href: "#location", label: "مکان", Icon: MapPin },
              { href: "#rsvp", label: "پاسخ", Icon: Heart },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] opacity-70 transition hover:opacity-100"
              >
                <Icon
                  className="h-3.5 w-3.5"
                  style={{ color: paper.accent }}
                />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
