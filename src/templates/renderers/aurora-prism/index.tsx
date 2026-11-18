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
  ChevronDown,
  Clock,
  Coffee,
  Disc3,
  Heart,
  MapPin,
  Minus,
  Music2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Stars,
  Users,
  Utensils,
  Wand2,
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

const DEFAULT_COVER = "/images/templates/aurora-prism-cover.jpg";

const ROSE_QUARTZ = "#f4a6b8";
const CHAMPAGNE = "#f5d69b";
const VELVET_NOIR = "#120b18";

type AuraMode = "rosequartz" | "pearl" | "magenta";

const AURA_MODES: Record<
  AuraMode,
  {
    label: string;
    en: string;
    bg: string;
    orbA: string;
    orbB: string;
    orbC: string;
    accent: string;
    secondary: string;
  }
> = {
  rosequartz: {
    label: "رزکوارتز",
    en: "Rose Quartz",
    bg: "#120b18",
    orbA: "rgba(244, 166, 184, 0.42)",
    orbB: "rgba(245, 214, 155, 0.32)",
    orbC: "rgba(186, 148, 255, 0.28)",
    accent: "#f4a6b8",
    secondary: "#f5d69b",
  },
  pearl: {
    label: "صدفِ مهتابی",
    en: "Pearl Opal",
    bg: "#0b111e",
    orbA: "rgba(165, 216, 255, 0.38)",
    orbB: "rgba(232, 185, 255, 0.32)",
    orbC: "rgba(245, 224, 183, 0.28)",
    accent: "#b8dcff",
    secondary: "#f2d8ff",
  },
  magenta: {
    label: "یاقوتِ مدرن",
    en: "Couture Berry",
    bg: "#170912",
    orbA: "rgba(232, 74, 127, 0.42)",
    orbB: "rgba(245, 196, 138, 0.34)",
    orbC: "rgba(158, 71, 184, 0.30)",
    accent: "#ff85ad",
    secondary: "#f7cfa0",
  },
};

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۳۰",
    title: "گامِ اول · خوشامدگویی و کوکتلِ شفق",
    description: "استقبال در تراسِ شیشه‌ای همراه با موسیقیِ مدرن و نوشیدنی‌های خوش‌رنگ",
    icon: "cafe",
  },
  {
    time: "۲۰:۰۰",
    title: "گامِ دوم · تلاقیِ دو مدار (آیینِ پیمان)",
    description: "لحظهٔ جادوییِ بله گفتن زیر بارشِ نورهای منشوری و حلقه‌های طلایی",
    icon: "heart",
  },
  {
    time: "۲۱:۳۰",
    title: "گامِ سوم · ضیافتِ شامِ بلورین",
    description: "پنج کورسِ منتخبِ سرآشپز زیرِ لوسترهای مدرن و شمع‌های شناور",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰",
    title: "گامِ چهارم · رقصِ نور و افترپارتی",
    description: "نخستین رقصِ عاشقانه در مه و نور، و ادامهٔ جشن با دی‌جی تا نیمه‌شب",
    icon: "music",
  },
];

const LOVE_CHAPTERS = [
  {
    step: "فصل اول",
    title: "جرقه‌ی نخستین نگاه",
    caption: "یک عصرِ پاییزی، یک فنجان قهوه و لبخندی که مسیرِ زندگیِ هر دوی ما را برای همیشه تغییر داد.",
  },
  {
    step: "فصل دوم",
    title: "هم‌سفری در روزهای روشن",
    caption: "هزاران دقیقه گفت‌وگو، سفرهای بی‌مقصد و کشفِ جهانی که در کنار هم زیباتر و امن‌تر بود.",
  },
  {
    step: "فصل سوم",
    title: "درخششِ حلقه و وعدهٔ ابدیت",
    caption: "زیر آسمانِ پرستاره، دو مسیر به یک مدار تبدیل شد؛ و حالا شما دعوتید به تماشای این طلوع.",
  },
] as const;

const MODERN_SWATCHES = [
  {
    color: "#f4a6b8",
    label: "رزکوارتز",
    en: "Rose Quartz",
    tip: "ساتن ابریشمی یا حریر با تناژ صورتیِ کوارتز، درخششی فوق‌العاده در نورپردازی شب دارد.",
  },
  {
    color: "#f5d69b",
    label: "شامپاینی",
    en: "Champagne Gold",
    tip: "طلاییِ شامپاینی و متالیکِ ملایم برای اکسسوری‌ها و لباس‌های شب مدرن.",
  },
  {
    color: "#c8b6ff",
    label: "یاسیِ بلورین",
    en: "Crystal Lilac",
    tip: "بنفشِ یاسی و نقره‌ایِ پاستلی که با فضای منشوری تالار هارمونی رویایی می‌سازد.",
  },
  {
    color: "#2b1938",
    label: "مخملِ شب",
    en: "Velvet Plum",
    tip: "سرمه‌ایِ تیره، بادمجانیِ مخملی و مشکیِ کلاسیک برای کت‌وشلوار و تاکسیدو.",
  },
  {
    color: "#fbf4ee",
    label: "صدفیِ گرم",
    en: "Warm Pearl",
    tip: "طیف صدفی و بژِ روشن (خواهشمندیم رنگ سفیدِ خالص را به عروس اختصاص دهید).",
  },
];

const PULSE_WISHES = [
  { id: "infinite", label: "عشقِ بی‌پایان ✨", badge: "Infinite Love" },
  { id: "cheers", label: "شوقِ دیدار 🥂", badge: "See You Soon" },
  { id: "bliss", label: "درخششِ همیشگی 🤍", badge: "Pure Bliss" },
] as const;

const BOKEH_PARTICLES = [
  { top: "10%", left: "14%", size: 6, dur: "5.2s", delay: "0s" },
  { top: "18%", left: "82%", size: 4, dur: "4.6s", delay: "1.2s" },
  { top: "34%", left: "10%", size: 5, dur: "6.1s", delay: "0.7s" },
  { top: "42%", left: "88%", size: 7, dur: "5.5s", delay: "1.9s" },
  { top: "62%", left: "16%", size: 4, dur: "4.9s", delay: "2.4s" },
  { top: "68%", left: "80%", size: 5, dur: "5.8s", delay: "0.4s" },
  { top: "82%", left: "26%", size: 6, dur: "5.0s", delay: "1.5s" },
];

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

/** عنوان مدرن هر بخش با کپسول شیشه‌ای */
function PrismSectionHeader({
  badge,
  title,
  subtitle,
  accent,
}: {
  badge: string;
  title: string;
  subtitle?: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 text-[9.5px] uppercase tracking-[0.34em] text-white/80 backdrop-blur-md">
        <Sparkles className="h-3 w-3" style={{ color: accent }} />
        {badge}
      </span>
      <h2 className="mt-3 font-display text-[28px] leading-tight text-white">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1.5 max-w-[290px] text-[12px] leading-6 text-white/60">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** منشورِ بلورینِ تعاملی با دو مدارِ نورِ هم‌گرا */
function InteractiveCrystalPrism({
  uid,
  aligned,
  onToggleAlign,
  cover,
  couple,
  monogram,
  accent,
  secondary,
}: {
  uid: string;
  aligned: boolean;
  onToggleAlign: () => void;
  cover: string;
  couple: string;
  monogram: string;
  accent: string;
  secondary: string;
}) {
  return (
    <div className="relative mx-auto my-2 flex w-full max-w-[330px] flex-col items-center select-none">
      {/* دو مدار بیضوی نور که با هم‌گرایی به یک هاله‌ی واحد تبدیل می‌شوند */}
      <svg
        viewBox="0 0 340 420"
        className="pointer-events-none absolute -inset-x-2 -inset-y-3 z-20 h-[calc(100%+24px)] w-[calc(100%+16px)] overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${uid}-ring1`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`${uid}-ring2`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={secondary} stopOpacity="0.95" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* مدار اول */}
        <ellipse
          cx="170"
          cy="210"
          rx="154"
          ry="194"
          fill="none"
          stroke={`url(#${uid}-ring1)`}
          strokeWidth="1.4"
          style={{
            transformOrigin: "170px 210px",
            transform: aligned ? "rotate(-4deg) scale(1)" : "rotate(-16deg) scale(0.96)",
            transition: "transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {/* مدار دوم */}
        <ellipse
          cx="170"
          cy="210"
          rx="154"
          ry="194"
          fill="none"
          stroke={`url(#${uid}-ring2)`}
          strokeWidth="1.4"
          strokeDasharray={aligned ? "0" : "6 5"}
          style={{
            transformOrigin: "170px 210px",
            transform: aligned ? "rotate(4deg) scale(1)" : "rotate(16deg) scale(0.96)",
            transition: "transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {/* ستاره‌های چهارپر روی مدار */}
        <g
          style={{
            transformOrigin: "170px 210px",
            transform: aligned ? "rotate(0deg)" : "rotate(-28deg)",
            transition: "transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <circle cx="170" cy="16" r="4" fill="#ffffff" />
          <circle cx="24" cy="150" r="3" fill={accent} />
          <circle cx="316" cy="270" r="3.5" fill={secondary} />
        </g>
      </svg>

      {/* قاب شیشه‌ای منشوری (Liquid Glass Capsule) */}
      <div
        onClick={onToggleAlign}
        role="button"
        tabIndex={0}
        aria-expanded={aligned}
        aria-label={aligned ? "تغییر شکست منشور نور" : "هم‌گرایی منشور نور"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleAlign();
          }
        }}
        className="group relative z-10 w-[276px] cursor-pointer overflow-hidden p-2.5 transition-all duration-700"
        style={{
          borderRadius: "140px 140px 38px 38px",
          backgroundImage:
            "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 45%, rgba(244,166,184,0.18) 100%)",
          boxShadow: aligned
            ? `0 28px 70px -18px ${accent}55, inset 0 1px 2px rgba(255,255,255,0.65)`
            : "0 20px 50px -20px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.35)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          className="relative aspect-[3/3.9] w-full overflow-hidden"
          style={{ borderRadius: "130px 130px 30px 30px" }}
        >
          {/* تصویر زوج */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={couple}
            className="h-full w-full object-cover transition-all duration-1000 ease-out"
            style={{
              transform: aligned ? "scale(1.02)" : "scale(1.12)",
              filter: aligned
                ? "contrast(1.05) saturate(1.08)"
                : "brightness(0.78) contrast(1.1) saturate(1.2) blur(4px)",
            }}
          />

          {/* لایه شکست منشوری (Prismatic Facets) وقتی هنوز هم‌گرا نشده */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: aligned ? 0.22 : 0.82,
              backgroundImage: `
                linear-gradient(125deg, transparent 20%, ${accent}66 42%, rgba(255,255,255,0.45) 50%, ${secondary}66 58%, transparent 78%),
                repeating-linear-gradient(60deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 32px)
              `,
              mixBlendMode: "screen",
            }}
          />

          {/* گرادیان پایین عکس برای خوانایی مونوگرام */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(18,11,24,0.28) 0%, transparent 38%, rgba(18,11,24,0.78) 100%)",
            }}
          />

          {/* نشانِ بلورینِ مونوگرام در پایین قاب */}
          <div className="absolute inset-x-0 bottom-3.5 flex flex-col items-center px-4 text-center">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/15 font-display text-[15px] text-white shadow-[0_0_24px_rgba(255,255,255,0.35)] backdrop-blur-md transition-transform duration-500 group-hover:scale-105"
            >
              {monogram}
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] text-white/90 backdrop-blur-md">
              <Wand2 className="h-3 w-3" style={{ color: accent }} />
              {aligned ? "مدارِ عشق هم‌گرا شد · لمس برای شکستِ منشور" : "لمس کنید تا دو مدارِ نور یکی شوند"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuroraPrismRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, "");

  const [aura, setAura] = useState<AuraMode>("rosequartz");
  const [aligned, setAligned] = useState(false);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [swatchIdx, setSwatchIdx] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [pulseWish, setPulseWish] =
    useState<(typeof PULSE_WISHES)[number]["id"]>("infinite");
  const [passIssued, setPassIssued] = useState(false);

  useEffect(() => {
    const delay = features?.entranceAnimation === false ? 60 : 680;
    const timer = window.setTimeout(() => setAligned(true), delay);
    return () => window.clearTimeout(timer);
  }, [features?.entranceAnimation]);

  const theme: TemplateCustomization = {
    primaryColor: ROSE_QUARTZ,
    secondaryColor: CHAMPAGNE,
    backgroundColor: VELVET_NOIR,
    poeticLine: "«دو مدارِ سرگردان بودیم؛ در جاذبه‌ی عشق به یک ستاره بدل شدیم»",
    blessingLine:
      "درخششِ این شب با حضورِ پرمهرِ شما به ابدیت پیوند می‌خورد.",
    dressCode:
      "استایل رسمی و مدرنِ شب (Modern Black-Tie & Glamour)؛ طیف رزکوارتز، شامپاینی، یاسی بلورین و مخمل شب.",
    musicTitle: "سمفونیِ شفق · پیانو و زهیِ مدرن",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const activeAura = AURA_MODES[aura];
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
  const selectedWish =
    PULSE_WISHES.find((w) => w.id === pulseWish) ?? PULSE_WISHES[0];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans text-white transition-colors duration-700"
      style={
        {
          backgroundColor: activeAura.bg,
          "--ap-accent": activeAura.accent,
          "--ap-sec": activeAura.secondary,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes ap-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes ap-float {
          0%, 100% { transform: translateY(0px) scale(0.85); opacity: 0.25; }
          50% { transform: translateY(-14px) scale(1.2); opacity: 0.85; }
        }
        @keyframes ap-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ap-pulse {
          0% { transform: scale(0.95); opacity: 0; }
          60% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .ap-iridescent-text {
          background-image: linear-gradient(100deg, #ffffff 0%, ${activeAura.accent} 28%, ${activeAura.secondary} 52%, #ffffff 76%, ${activeAura.accent} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ap-shimmer 8s linear infinite;
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-md overflow-x-clip">
        {/* هاله‌های شفق و منشور در پس‌زمینه (Ambient Aurora Mesh) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute -right-20 -top-16 h-80 w-80 rounded-full blur-3xl transition-all duration-1000"
            style={{ backgroundColor: activeAura.orbA }}
          />
          <div
            className="absolute -left-24 top-64 h-80 w-80 rounded-full blur-3xl transition-all duration-1000"
            style={{ backgroundColor: activeAura.orbB }}
          />
          <div
            className="absolute right-6 top-[52%] h-72 w-72 rounded-full blur-3xl transition-all duration-1000"
            style={{ backgroundColor: activeAura.orbC }}
          />
        </div>

        {/* هدر شیشه‌ای مدرن با سوییچر هالهٔ نور */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/35 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 font-display text-[11px] text-white">
              {monogram}
            </span>

            {/* انتخاب هاله‌ی نوری */}
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] p-1">
              {(Object.keys(AURA_MODES) as AuraMode[]).map((key) => {
                const mode = AURA_MODES[key];
                const active = aura === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAura(key)}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] transition ${
                      active
                        ? "bg-white text-[#120b18] font-medium shadow-sm"
                        : "text-white/65 hover:text-white"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: mode.accent }}
                    />
                    {mode.label}
                  </button>
                );
              })}
            </div>

            {showMusic ? (
              <button
                type="button"
                onClick={() => setPlayingMusic((p) => !p)}
                aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/50"
              >
                {playingMusic ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
                )}
              </button>
            ) : (
              <Stars className="h-4 w-4 text-white/60" />
            )}
          </div>
        </header>

        <main className="relative z-10 px-4 pb-28">
          {/* ————— ۱. صحنه‌ی نخست: منشور بلورین و دو مدارِ نور ————— */}
          <section className="relative flex flex-col items-center pt-6 pb-10 text-center">
            {/* ذرات بوکه معلق */}
            {BOKEH_PARTICLES.map((p, idx) => (
              <span
                key={idx}
                className="pointer-events-none absolute rounded-full"
                style={{
                  top: p.top,
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  backgroundColor:
                    idx % 2 === 0 ? activeAura.accent : activeAura.secondary,
                  boxShadow: `0 0 12px ${activeAura.accent}`,
                  animation: `ap-float ${p.dur} ease-in-out ${p.delay} infinite`,
                }}
                aria-hidden
              />
            ))}

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1 text-[10px] tracking-[0.22em] text-white/85 backdrop-blur-md">
              <Sparkles
                className="h-3 w-3"
                style={{ color: activeAura.accent }}
              />
              جشنِ پیوند در منشورِ نور
            </span>

            {/* منشورِ بلورینِ تعاملی */}
            <div className="mt-4 w-full">
              <InteractiveCrystalPrism
                uid={uid}
                aligned={aligned}
                onToggleAlign={() => setAligned((a) => !a)}
                cover={cover}
                couple={couple}
                monogram={monogram}
                accent={activeAura.accent}
                secondary={activeAura.secondary}
              />
            </div>

            {/* تایپوگرافی درخشان نام زوج */}
            <h1 className="mt-4 flex flex-col items-center font-display text-[44px] leading-[1.18]">
              <span className="ap-iridescent-text px-2">
                {data.partnerOneName}
              </span>
              <span className="my-1 flex items-center gap-3 text-sm font-sans font-light tracking-[0.35em] text-white/55">
                <span className="h-px w-10 bg-white/25" />
                <span>&amp;</span>
                <span className="h-px w-10 bg-white/25" />
              </span>
              <span className="ap-iridescent-text px-2">
                {data.partnerTwoName}
              </span>
            </h1>

            <p className="mt-3 text-[12px] tracking-[0.14em] text-white/75">
              {parts.day && parts.month
                ? `${parts.weekday} · ${parts.day} ${parts.month} ${parts.year}`
                : "تاریخ به‌زودی اعلام می‌شود"}
            </p>
            <p
              className="mt-1 text-[11.5px]"
              style={{ color: activeAura.secondary }}
            >
              {data.venueName || "عمارت یاس سفید"}
            </p>

            <div className="mt-6 flex flex-col items-center text-white/45">
              <span className="text-[8px] uppercase tracking-[0.34em]">
                Explore
              </span>
              <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
            </div>
          </section>

          {/* ————— ۲. کارت شیشه‌ای دعوت و فصل‌های قصهٔ آشنایی ————— */}
          <section id="invitation" className="scroll-mt-20 pt-6">
            <PrismSectionHeader
              badge="The Love Story"
              title="دعوت‌نامه و قصه‌ی ما"
              subtitle="روایتِ روزهایی که ما را به این شبِ درخشان رساند"
              accent={activeAura.accent}
            />

            <div className="relative mt-5 overflow-hidden rounded-[28px] border border-white/20 bg-white/[0.08] p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
              {/* هایلایتِ منشوری بالای کارت */}
              <div
                className="pointer-events-none absolute inset-x-8 top-0 h-px"
                style={{
                  backgroundImage: `linear-gradient(90deg, transparent, ${activeAura.accent}, #ffffff, ${activeAura.secondary}, transparent)`,
                }}
              />

              <blockquote className="text-center font-display text-[20px] leading-9 text-white">
                {theme.poeticLine}
              </blockquote>

              <p className="mt-3 text-center text-[12.5px] leading-7 text-white/75">
                {data.invitationText ||
                  "با قلبی سرشار از شوق و عشق، شما را دعوت می‌کنیم تا در شبی که آسمان و زمین برای ما می‌درخشند، شاهدِ آغازِ فصلِ جاودانگیِ ما باشید."}
              </p>

              {families ? (
                <p
                  className="mt-3 text-center text-[11.5px]"
                  style={{ color: activeAura.secondary }}
                >
                  به میزبانی خاندان‌های {families}
                </p>
              ) : null}

              {/* کاروسل تعاملیِ ۳ فصلِ آشنایی */}
              <div className="mt-6 rounded-2xl border border-white/15 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-medium text-white/60">
                    فصل‌های عاشقانهٔ ما
                  </span>
                  <div className="flex gap-1.5">
                    {LOVE_CHAPTERS.map((ch, idx) => {
                      const active = chapterIdx === idx;
                      return (
                        <button
                          key={ch.step}
                          type="button"
                          onClick={() => setChapterIdx(idx)}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] transition ${
                            active
                              ? "bg-white text-[#120b18] font-semibold"
                              : "bg-white/10 text-white/65 hover:bg-white/20"
                          }`}
                        >
                          {ch.step}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3">
                  <p
                    className="font-display text-[18px]"
                    style={{ color: activeAura.accent }}
                  >
                    {LOVE_CHAPTERS[chapterIdx].title}
                  </p>
                  <p className="mt-1 text-[12px] leading-6 text-white/75">
                    {LOVE_CHAPTERS[chapterIdx].caption}
                  </p>
                </div>
              </div>

              {/* پخش‌کننده‌ی مدرن موسیقی با دیسک چرخان */}
              {showMusic ? (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setPlayingMusic((p) => !p)}
                      aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#120b18] shadow-md transition active:scale-95"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${activeAura.accent}, ${activeAura.secondary})`,
                      }}
                    >
                      {playingMusic ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 translate-x-[0.5px]" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-white">
                        {theme.musicTitle}
                      </p>
                      <p className="text-[10px] text-white/55">
                        {playingMusic
                          ? "در حال پخشِ ملودیِ اختصاصی…"
                          : "پخشِ موسیقیِ پیشواز"}
                      </p>
                    </div>
                  </div>
                  <Disc3
                    className="h-5 w-5 shrink-0 text-white/65"
                    style={{
                      animation: playingMusic ? "ap-spin 4s linear infinite" : "none",
                      color: playingMusic ? activeAura.accent : undefined,
                    }}
                  />
                </div>
              ) : null}
            </div>
          </section>

          {/* ————— ۳. کپسولِ تاریخ و شمارش معکوس بلورین ————— */}
          <section className="pt-14">
            <PrismSectionHeader
              badge="Save The Date"
              title="لحظه‌شمارِ شبِ رؤیایی"
              subtitle="ثانیه‌هایی که ما را به دیدارِ شما نزدیک‌تر می‌کنند"
              accent={activeAura.accent}
            />

            <div className="mt-5 overflow-hidden rounded-[28px] border border-white/20 bg-white/[0.07] p-5 backdrop-blur-xl">
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/15 text-center">
                <div className="px-2">
                  <p className="text-[9.5px] text-white/50">روزِ هفته</p>
                  <p className="mt-1 font-display text-[19px] text-white">
                    {parts.weekday || "جمعه"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/45">
                    {parts.year || "۱۴۰۶"}
                  </p>
                </div>

                <div className="px-2">
                  <p
                    className="text-[10px] font-medium"
                    style={{ color: activeAura.accent }}
                  >
                    {parts.month || "اردیبهشت"}
                  </p>
                  <p className="ap-iridescent-text mt-0.5 font-display text-[52px] leading-none">
                    {parts.day || "۳۱"}
                  </p>
                </div>

                <div className="px-2">
                  <p className="text-[9.5px] text-white/50">ساعتِ آغاز</p>
                  <p className="mt-1 font-display text-[19px] text-white">
                    {startTime || "۱۸:۳۰"}
                  </p>
                  <p className="mt-0.5 text-[9.5px] text-white/45">
                    {latinDate}
                  </p>
                </div>
              </div>

              {showCountdown ? (
                <div className="mt-5 border-t border-white/15 pt-4">
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-2xl [&>div]:border [&>div]:border-white/15 [&>div]:bg-black/30 [&>div]:py-3 [&_p:first-child]:font-display [&_p:first-child]:text-[24px] [&_p:first-child]:text-white [&_p:last-child]:text-[10px] [&_p:last-child]:text-white/60"
                  />
                </div>
              ) : null}
            </div>
          </section>

          {/* ————— ۴. تایم‌لاین نوریِ شب جشن ————— */}
          <section id="schedule" className="scroll-mt-20 pt-14">
            <PrismSectionHeader
              badge="Evening Flow"
              title="تایم‌لاینِ نوریِ جشن"
              subtitle="چهار ایستگاهِ درخشان در شبِ پیوندِ ما"
              accent={activeAura.accent}
            />

            <div className="relative mt-6 pr-4">
              {/* خط نوری گرادیان عمودی */}
              <span
                className="pointer-events-none absolute bottom-5 right-[11px] top-4 w-[2px] rounded-full"
                style={{
                  backgroundImage: `linear-gradient(180deg, ${activeAura.accent}, ${activeAura.secondary}, transparent)`,
                }}
                aria-hidden
              />

              <ul className="space-y-3.5">
                {schedule.map((item) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <li
                      key={`${item.time}-${item.title}`}
                      className="relative pr-6"
                    >
                      {/* گوی نوری روی تایم‌لاین */}
                      <span
                        className="absolute -right-[9px] top-4 flex h-4 w-4 items-center justify-center rounded-full border border-white/60 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                        style={{ backgroundColor: activeAura.accent }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>

                      <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-xl transition hover:border-white/30">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-0.5 text-[11px] font-medium"
                            style={{ color: activeAura.secondary }}
                          >
                            <Icon className="h-3 w-3" />
                            {item.time}
                          </span>
                          <Sparkles className="h-3.5 w-3.5 text-white/30" />
                        </div>
                        <p className="mt-2 font-display text-[18px] text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[12px] leading-6 text-white/65">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* ————— ۵. کارت بلورین مکان و مسیریابی ————— */}
          {showMap ? (
            <section id="location" className="scroll-mt-20 pt-14">
              <PrismSectionHeader
                badge="The Destination"
                title="مقصدِ جشن و مسیریابی"
                subtitle="دسترسی سریع با مسیریاب‌های آنلاین"
                accent={activeAura.accent}
              />

              <div className="mt-5 overflow-hidden rounded-[28px] border border-white/20 bg-white/[0.08] p-5 text-center backdrop-blur-2xl">
                <div
                  className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl border border-white/25 shadow-lg"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${activeAura.accent}33, ${activeAura.secondary}33)`,
                  }}
                >
                  <MapPin
                    className="h-5 w-5"
                    style={{ color: activeAura.accent }}
                  />
                </div>

                <h3 className="mt-3.5 font-display text-[23px] text-white">
                  {data.venueName || "عمارت یاس سفید"}
                </h3>
                {data.venueAddress ? (
                  <p className="mx-auto mt-1.5 max-w-[280px] text-[12px] leading-6 text-white/65">
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
                        className="flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/[0.06] py-2.5 text-[11.5px] text-white transition hover:bg-white/15"
                      >
                        <span>{item.label}</span>
                        <ArrowUpLeft className="h-3.5 w-3.5 opacity-65" />
                      </a>
                    ))}
                  </div>
                ) : null}

                {calendarHref ? (
                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl py-3 text-[12px] font-semibold text-[#120b18] shadow-md transition hover:brightness-105"
                    style={{
                      backgroundImage: `linear-gradient(100deg, ${activeAura.accent}, #ffffff 50%, ${activeAura.secondary})`,
                    }}
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن یادآور به تقویم گوگل
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* ————— ۶. گوی‌های بلورین کد پوشش (Dress Code) ————— */}
          <section className="pt-14">
            <PrismSectionHeader
              badge="Dress Code"
              title="پالتِ درخششِ شب"
              subtitle={theme.dressCode}
              accent={activeAura.accent}
            />

            <div className="mt-6 grid grid-cols-5 gap-2">
              {MODERN_SWATCHES.map((swatch, idx) => {
                const active = swatchIdx === idx;
                return (
                  <button
                    key={swatch.label}
                    type="button"
                    onClick={() => setSwatchIdx(idx)}
                    aria-pressed={active}
                    className="flex flex-col items-center focus:outline-none"
                  >
                    <span
                      className={`relative flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
                        active
                          ? "scale-110 border-white shadow-[0_0_20px_rgba(255,255,255,0.45)]"
                          : "border-white/25 opacity-75 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: swatch.color,
                        boxShadow: "inset 0 2px 6px rgba(255,255,255,0.45)",
                      }}
                    />
                    <span
                      className={`mt-2.5 text-center text-[10.5px] ${
                        active ? "font-semibold text-white" : "text-white/60"
                      }`}
                    >
                      {swatch.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-center text-[11.5px] leading-6 text-white/80 backdrop-blur-md">
              <span
                className="font-semibold"
                style={{ color: activeAura.accent }}
              >
                {MODERN_SWATCHES[swatchIdx].label}:{" "}
              </span>
              {MODERN_SWATCHES[swatchIdx].tip}
            </div>
          </section>

          {/* ————— ۷. کارت ورود بلورین و ثبت حضور (Holographic Pass RSVP) ————— */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 pt-14">
              <PrismSectionHeader
                badge="V · I · P  R·S·V·P"
                title="تپشِ نور و کارتِ حضور"
                subtitle="پاسخ خود را ثبت کنید تا کارتِ ورودِ بلورینِ شما صادر شود"
                accent={activeAura.accent}
              />

              <div className="mt-5 overflow-hidden rounded-[28px] border border-white/25 bg-white/[0.09] p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
                {passIssued ? (
                  <div
                    className="flex flex-col items-center py-2 text-center"
                    style={{ animation: "ap-pulse 520ms ease-out both" }}
                  >
                    {/* کارتِ ورودِ هولوگرافیکِ بلورین */}
                    <div
                      className="relative w-full overflow-hidden rounded-2xl border border-white/35 p-4 text-right shadow-xl"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.18) 0%, ${activeAura.accent}33 50%, ${activeAura.secondary}28 100%)`,
                      }}
                    >
                      <div className="flex items-center justify-between border-b border-white/20 pb-3">
                        <div>
                          <span className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-white/65">
                            Crystal Guest Pass
                          </span>
                          <p className="mt-0.5 font-display text-[20px] text-white">
                            {couple}
                          </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 font-display text-sm text-white">
                          {monogram}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
                        <div>
                          <span className="text-[9.5px] text-white/55">
                            وضعیت حضور
                          </span>
                          <p className="mt-0.5 font-medium text-white">
                            {attending
                              ? `تأیید شده (${guests.toLocaleString("fa-IR")} نفر)`
                              : "همراهِ دلِ شما"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9.5px] text-white/55">
                            پیامِ نوریِ شما
                          </span>
                          <p
                            className="mt-0.5 font-medium"
                            style={{ color: activeAura.secondary }}
                          >
                            {selectedWish.label}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPassIssued(false)}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] text-white/80 transition hover:bg-white/20"
                    >
                      <RotateCcw className="h-3 w-3" />
                      ویرایش پاسخ
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { value: true, label: "با افتخار می‌آیم" },
                        { value: false, label: "دلم با شماست" },
                      ].map(({ value, label }) => {
                        const active = attending === value;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setAttending(value)}
                            aria-pressed={active}
                            className={`flex items-center justify-center gap-1.5 rounded-2xl border py-3 text-[12px] font-medium transition ${
                              active
                                ? "border-white bg-white text-[#120b18] shadow-md"
                                : "border-white/20 bg-black/25 text-white/80 hover:border-white/40"
                            }`}
                          >
                            {active ? <Check className="h-3.5 w-3.5" /> : null}
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {/* شمار همراهان */}
                    <div
                      className={`mt-3 flex items-center justify-between rounded-2xl border border-white/15 bg-black/25 px-4 py-2.5 transition ${
                        attending ? "" : "pointer-events-none opacity-40"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-[12px] text-white/85">
                        <Users
                          className="h-4 w-4"
                          style={{ color: activeAura.accent }}
                        />
                        تعداد همراهان
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="کاهش همراهان"
                          onClick={() => setGuests((v) => Math.max(1, v - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white active:scale-90"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center font-display text-[19px] text-white">
                          {guests.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          aria-label="افزایش همراهان"
                          onClick={() => setGuests((v) => Math.min(8, v + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#120b18] active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* انتخاب تپش نوری */}
                    <div className="mt-4">
                      <p className="text-center text-[11px] text-white/65">
                        یک تپشِ نور همراهِ پاسخ خود بفرستید:
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {PULSE_WISHES.map((w) => {
                          const active = pulseWish === w.id;
                          return (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => setPulseWish(w.id)}
                              className={`rounded-xl border py-2 text-[11px] transition ${
                                active
                                  ? "border-white/70 bg-white/20 text-white font-medium"
                                  : "border-white/15 bg-black/20 text-white/65"
                              }`}
                            >
                              {w.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPassIssued(true)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[12.5px] font-semibold text-[#120b18] shadow-lg transition hover:brightness-105 active:scale-[0.99]"
                      style={{
                        backgroundImage: `linear-gradient(100deg, ${activeAura.accent}, #ffffff 50%, ${activeAura.secondary})`,
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                      {preview
                        ? "دریافتِ کارتِ ورودِ بلورین و ثبتِ پاسخ"
                        : "ثبتِ پاسخ و صدورِ کارتِ حضور"}
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : null}

          {/* ————— ۸. کلام پایانی ————— */}
          <section className="pt-16 pb-6 text-center">
            <p className="mx-auto max-w-[290px] font-display text-[21px] leading-9 text-white/90">
              {theme.blessingLine}
            </p>
            <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.34em] text-white/45">
              {latinDate} · {couple}
            </p>
          </section>
        </main>

        {/* داک شیشه‌ای شناور پایین صفحه */}
        <nav className="fixed bottom-4 left-0 right-0 z-40 mx-auto w-[calc(100%-2rem)] max-w-[390px]">
          <div className="flex h-14 items-center justify-around rounded-full border border-white/20 bg-black/55 px-2 shadow-[0_20px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
            {[
              { href: "#invitation", label: "قصه‌ی ما", Icon: Sparkles },
              { href: "#schedule", label: "تایم‌لاین", Icon: Clock },
              { href: "#location", label: "مکان", Icon: MapPin },
              { href: "#rsvp", label: "کارت حضور", Icon: Heart },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <Icon
                  className="h-3.5 w-3.5"
                  style={{ color: activeAura.accent }}
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
