"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
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

const DEFAULT_COVER = "/images/templates/wisteria-terrace-cover.jpg";

type TerraceMood = "mist" | "dusk" | "violet";

const MOODS: Record<
  TerraceMood,
  {
    label: string;
    bg: string;
    cardBg: string;
    ink: string;
    muted: string;
    lilac: string;
    gold: string;
    sage: string;
    blossomA: string;
    blossomB: string;
    border: string;
    isDark: boolean;
  }
> = {
  mist: {
    label: "مه صبحگاهی",
    bg: "#f7f4fb",
    cardBg: "#ffffff",
    ink: "#2a1f3a",
    muted: "#6f627f",
    lilac: "#8b6bb0",
    gold: "#c4a46a",
    sage: "#6a7d6e",
    blossomA: "#e4d4f5",
    blossomB: "#c9a8e0",
    border: "rgba(196, 164, 106, 0.34)",
    isDark: false,
  },
  dusk: {
    label: "غروب یاسی",
    bg: "#faf3ef",
    cardBg: "#fffdfb",
    ink: "#2c1c24",
    muted: "#7a5f68",
    lilac: "#a56b8d",
    gold: "#c39a4e",
    sage: "#6b7558",
    blossomA: "#f0d4e0",
    blossomB: "#d9a3bb",
    border: "rgba(195, 154, 78, 0.38)",
    isDark: false,
  },
  violet: {
    label: "شب ویستریا",
    bg: "#140f1c",
    cardBg: "#1f1729",
    ink: "#f4eef8",
    muted: "#b8a8c9",
    lilac: "#c9a6e8",
    gold: "#e0c07a",
    sage: "#8fa894",
    blossomA: "#9b6fc0",
    blossomB: "#6a3f8f",
    border: "rgba(224, 192, 122, 0.32)",
    isDark: true,
  },
};

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۴۵",
    title: "پرده‌ی نخست · خوشامد زیر ویستریا",
    description: "استقبال در تراس گل‌آگین، با شربت بهارنارنج و نوای ملایم ویولن",
    icon: "cafe",
  },
  {
    time: "۱۹:۱۵",
    title: "پرده‌ی دوم · پیمان زیر ستون‌های سفید",
    description: "آیین عقد میان خوشه‌های آویزان ویستریا و نور شمع‌های یاسی",
    icon: "heart",
  },
  {
    time: "۲۰:۴۵",
    title: "پرده‌ی سوم · ضیافت در تراس بلورین",
    description: "شام در کنار میزهای آراسته به گل و برگ و درخشش شامپاینی",
    icon: "dining",
  },
  {
    time: "۲۲:۱۵",
    title: "پرده‌ی چهارم · رقص زیر بارش گل",
    description: "نخستین رقص در میان عطر ویستریا و نور فانوس‌های طلایی",
    icon: "music",
  },
];

const LOVE_STORY = [
  {
    tag: "طلوع",
    title: "روزی که عطر یاس آمد",
    text: "در میان روزهای معمولی، نگاهی آمد که مثل خوشه‌ی ویستریا بر دل نشست و دیگر نرفت.",
  },
  {
    tag: "هم‌سفر",
    title: "قدم‌هایی زیر سایه‌بان بنفش",
    text: "با هم خندیدیم، با هم آرزو بافتیم و فهمیدیم خانه همان‌جاست که دستت در دست من است.",
  },
  {
    tag: "عهد",
    title: "یک قول و هزار فردا",
    text: "زیر آسمان یاسی به هم قول همیشگی دادیم و حالا می‌خواهیم این شادی را با شما قسمت کنیم.",
  },
] as const;

const BLOOM_SWATCHES = [
  {
    color: "#d4b8ec",
    label: "یاسی پودری",
    tip: "حریر و ساتن یاسی ملایم، هماهنگ با خوشه‌های ویستریا.",
  },
  {
    color: "#c4a46a",
    label: "شامپاینی",
    tip: "طلایی ملایم برای درخشش اکسسوری و جزئیات تالار.",
  },
  {
    color: "#6b3d7a",
    label: "بنفش مخملی",
    tip: "بنفش عمیق و شیک برای لباس شب و کروات آقایان.",
  },
  {
    color: "#6a7d6e",
    label: "سبز باغ",
    tip: "سبز مریم‌گلی که با برگ‌های ویستریا هارمونی دارد.",
  },
  {
    color: "#1f1729",
    label: "مشکی رسمی",
    tip: "کت‌وشلوار مشکی یا سرمه‌ای برای استایل کلاسیک شب.",
  },
];

const BLOOM_GIFTS = [
  { id: "wisteria", label: "خوشه‌ی ویستریا (عشق آویخته)", mark: "✦" },
  { id: "lilac", label: "شاخه‌ی یاس بنفش (آرامش دل)", mark: "❀" },
  { id: "goldleaf", label: "برگ طلایی (برکت و شادی)", mark: "❖" },
] as const;

const FALLING = [
  { left: "7%", delay: "0s", dur: "12s", size: 11 },
  { left: "21%", delay: "2.2s", dur: "13.5s", size: 9 },
  { left: "39%", delay: "4.5s", dur: "11s", size: 12 },
  { left: "58%", delay: "1.1s", dur: "12.8s", size: 10 },
  { left: "76%", delay: "3.4s", dur: "11.6s", size: 13 },
  { left: "90%", delay: "0.6s", dur: "13s", size: 9 },
];

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", day: "", dayNum: 21, month: "", year: "" };
  try {
    const date = new Date(iso);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...options }).format(date);
    const enDay = Number(
      new Intl.DateTimeFormat("en-US", { timeZone, day: "numeric" }).format(date),
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

/** تاجِ طلاییِ ظریف روی قاب تراس (به‌جای خوشه‌های درشت گوشه‌ها) */
function TerraceCrown({
  className = "",
  blossomA,
  blossomB,
  gold,
  sage,
}: {
  className?: string;
  blossomA: string;
  blossomB: string;
  gold: string;
  sage: string;
}) {
  return (
    <svg viewBox="0 0 320 72" className={className} aria-hidden>
      <defs>
        <linearGradient id="wt-crown-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={gold} stopOpacity="0.15" />
          <stop offset="0.5" stopColor={gold} stopOpacity="0.95" />
          <stop offset="1" stopColor={gold} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* قوس اصلی */}
      <path
        d="M18 48 C 70 8, 250 8, 302 48"
        fill="none"
        stroke="url(#wt-crown-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M36 52 C 90 20, 230 20, 284 52"
        fill="none"
        stroke={gold}
        strokeOpacity="0.35"
        strokeWidth="0.8"
        strokeDasharray="2.5 3"
        strokeLinecap="round"
      />
      {/* برگ‌های ظریف دو طرف */}
      <path
        d="M52 36 C 40 28, 36 40, 48 44 C 50 40, 52 38, 52 36 Z"
        fill={sage}
        opacity="0.7"
      />
      <path
        d="M268 36 C 280 28, 284 40, 272 44 C 270 40, 268 38, 268 36 Z"
        fill={sage}
        opacity="0.7"
      />
      {/* شکوفه‌های ریز روی قوس */}
      {[
        [78, 26],
        [112, 16],
        [160, 12],
        [208, 16],
        [242, 26],
      ].map(([cx, cy], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={cx}
              cy={cy}
              rx="3.2"
              ry="5.2"
              fill={i % 2 ? blossomB : blossomA}
              opacity="0.92"
              transform={`rotate(${a} ${cx} ${cy})`}
            />
          ))}
          <circle cx={cx} cy={cy} r="2" fill={gold} />
        </g>
      ))}
      {/* گوی‌های طلایی کوچک گوشه‌ها */}
      <circle cx="28" cy="46" r="2.2" fill={gold} opacity="0.85" />
      <circle cx="292" cy="46" r="2.2" fill={gold} opacity="0.85" />
    </svg>
  );
}

function SectionHeader({
  subtitleEn,
  title,
  description,
  lilac,
  gold,
  muted,
}: {
  subtitleEn: string;
  title: string;
  description?: string;
  lilac: string;
  gold: string;
  muted: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2.5">
        <span
          className="h-px w-10"
          style={{ backgroundImage: `linear-gradient(90deg, transparent, ${gold})` }}
        />
        <span className="text-[12px]" style={{ color: lilac }}>
          ❀
        </span>
        <span className="text-[9px] uppercase tracking-[0.36em]" style={{ color: gold }}>
          {subtitleEn}
        </span>
        <span className="text-[12px]" style={{ color: lilac }}>
          ❀
        </span>
        <span
          className="h-px w-10"
          style={{ backgroundImage: `linear-gradient(270deg, transparent, ${gold})` }}
        />
      </div>
      <h2 className="mt-2.5 font-display text-[28px] leading-tight">{title}</h2>
      {description ? (
        <p className="mt-1.5 max-w-[295px] text-[12px] leading-6" style={{ color: muted }}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function WisteriaTerraceHero({
  opened,
  onToggle,
  cover,
  couple,
  monogram,
  mood,
}: {
  opened: boolean;
  onToggle: () => void;
  cover: string;
  couple: string;
  monogram: string;
  mood: (typeof MOODS)[TerraceMood];
}) {
  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[330px] flex-col items-center">
      <TerraceCrown
        className="pointer-events-none absolute -top-7 left-1/2 z-30 h-[72px] w-[320px] -translate-x-1/2 drop-shadow-sm"
        blossomA={mood.blossomA}
        blossomB={mood.blossomB}
        gold={mood.gold}
        sage={mood.sage}
      />

      <div
        className="relative w-[288px] overflow-hidden p-3 transition-all duration-700"
        style={{
          borderRadius: "22px 22px 28px 28px",
          backgroundColor: mood.cardBg,
          border: `1.5px solid ${mood.gold}88`,
          boxShadow: mood.isDark
            ? "0 28px 65px -20px rgba(0,0,0,0.85), 0 0 40px -15px rgba(155,111,192,0.25)"
            : "0 26px 60px -22px rgba(80, 50, 110, 0.2), inset 0 0 24px rgba(228, 212, 245, 0.35)",
        }}
      >
        {/* terrace columns hint */}
        <span
          className="pointer-events-none absolute bottom-3 left-5 top-3 w-px opacity-40"
          style={{ backgroundImage: `linear-gradient(${mood.gold}, transparent)` }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-3 right-5 top-3 w-px opacity-40"
          style={{ backgroundImage: `linear-gradient(${mood.gold}, transparent)` }}
          aria-hidden
        />

        <div className="relative aspect-[3/3.85] w-full overflow-hidden rounded-[18px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={couple}
            className="h-full w-full object-cover transition-all duration-1000 ease-out"
            style={{
              transform: opened ? "scale(1.02)" : "scale(1.08)",
              filter: opened
                ? "contrast(1.03) saturate(1.05)"
                : "brightness(0.86) saturate(0.92) blur(2.5px)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(42,31,58,0.2) 0%, transparent 38%, rgba(42,31,58,0.7) 100%)",
            }}
          />

          {/* hanging wisteria curtain */}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={opened}
            aria-label={opened ? "بستن پرده‌ی ویستریا" : "گشودن پرده‌ی ویستریا"}
            className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-end pb-5"
          >
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-1000"
              style={{
                backgroundImage: opened
                  ? "linear-gradient(180deg, transparent, transparent)"
                  : `linear-gradient(180deg, ${mood.blossomA}cc 0%, ${mood.blossomB}99 42%, ${mood.cardBg}ee 100%)`,
                backdropFilter: opened ? "blur(0px)" : "blur(5px)",
                WebkitBackdropFilter: opened ? "blur(0px)" : "blur(5px)",
              }}
            />

            {/* cascading blossom strips */}
            <div
              className={`pointer-events-none absolute inset-x-3 top-0 flex justify-between transition-all duration-[1100ms] ${
                opened ? "-translate-y-[108%] opacity-0" : "translate-y-0 opacity-100"
              }`}
              aria-hidden
            >
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i} className="flex w-7 flex-col items-center gap-1 pt-2">
                  {Array.from({ length: 5 + (i % 3) }, (_, j) => (
                    <span
                      key={j}
                      className="rounded-full"
                      style={{
                        width: 10 - j * 0.6,
                        height: 14 - j,
                        backgroundImage: `linear-gradient(180deg, ${mood.blossomA}, ${mood.blossomB})`,
                        boxShadow: `0 2px 6px ${mood.lilac}33`,
                      }}
                    />
                  ))}
                </span>
              ))}
            </div>

            {/* silk cord tassel */}
            <div
              className={`relative z-10 transition-all duration-700 ${
                opened ? "translate-y-2 scale-90 opacity-95" : "scale-100 hover:scale-105"
              }`}
            >
              <span
                className="mx-auto mb-1 block h-10 w-px"
                style={{ backgroundColor: mood.gold }}
                aria-hidden
              />
              <span
                className="relative flex h-16 w-16 items-center justify-center rounded-full border select-none"
                style={{
                  borderColor: `${mood.gold}99`,
                  backgroundImage: `radial-gradient(circle at 32% 28%, ${mood.blossomA} 0%, ${mood.lilac} 52%, #4a2d66 100%)`,
                  boxShadow:
                    "0 12px 26px -8px rgba(70, 40, 100, 0.55), inset 0 2px 5px rgba(255,255,255,0.4)",
                }}
              >
                <span
                  className="absolute inset-[6px] rounded-full border border-dashed"
                  style={{ borderColor: `${mood.gold}66` }}
                />
                <span className="relative flex flex-col items-center leading-none text-[#fff8ff]">
                  <span className="text-[10px]">❀</span>
                  <span className="mt-1 font-display text-[12px] font-bold tracking-wider">
                    {monogram}
                  </span>
                </span>
              </span>
            </div>

            <span className="relative z-10 mt-2 rounded-full border border-white/35 bg-black/40 px-3.5 py-1 text-[10px] text-white backdrop-blur-md">
              {opened
                ? "پرده کنار رفت · لمس برای بستن دوباره"
                : "برای کنار زدن پرده‌ی ویستریا، منگوله را لمس کنید"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function WisteriaTerraceRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, "");

  const [moodKey, setMoodKey] = useState<TerraceMood>("mist");
  const [opened, setOpened] = useState(false);
  const [storyTab, setStoryTab] = useState<"story" | "vows">("story");
  const [playingMusic, setPlayingMusic] = useState(false);
  const [swatchIdx, setSwatchIdx] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [giftId, setGiftId] = useState<(typeof BLOOM_GIFTS)[number]["id"]>("wisteria");
  const [rsvpSealed, setRsvpSealed] = useState(false);

  useEffect(() => {
    const delay = features?.entranceAnimation === false ? 60 : 780;
    const timer = window.setTimeout(() => setOpened(true), delay);
    return () => window.clearTimeout(timer);
  }, [features?.entranceAnimation]);

  const theme: TemplateCustomization = {
    primaryColor: "#8b6bb0",
    secondaryColor: "#c4a46a",
    backgroundColor: "#f7f4fb",
    poeticLine:
      "«زیر سایه‌بان بنفش ویستریا، قول دادیم که همیشه هم‌قدمِ هم بمانیم»",
    blessingLine: "حضور شما، زیباترین خوشه‌ی آویخته‌ی این تراس است",
    dressCode:
      "پوشش رسمی و رمانتیک (Garden Formal)؛ طیف یاسی پودری، شامپاینی، بنفش مخملی، سبز باغ و مشکی رسمی.",
    musicTitle: "نکتورن ویستریا · پیانو و ویولن",
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
  const selectedGift = BLOOM_GIFTS.find((b) => b.id === giftId) ?? BLOOM_GIFTS[0];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans transition-colors duration-700"
      style={
        {
          backgroundColor: mood.bg,
          color: mood.ink,
          "--wt-lilac": mood.lilac,
          "--wt-gold": mood.gold,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes wt-fall {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(92vh) translateX(24px) rotate(200deg); opacity: 0; }
        }
        @keyframes wt-foil {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes wt-eq {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes wt-seal-in {
          0% { transform: scale(1.3) rotate(-8deg); opacity: 0; }
          65% { transform: scale(0.96) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .wt-title-gradient {
          background-image: linear-gradient(100deg, ${mood.lilac} 0%, ${mood.gold} 38%, ${mood.ink} 68%, ${mood.lilac} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: wt-foil 10s linear infinite;
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-md overflow-x-clip">
        <div
          className="pointer-events-none fixed inset-0 z-20 mx-auto max-w-md overflow-hidden"
          aria-hidden
        >
          {FALLING.map((p, idx) => (
            <span
              key={idx}
              className="absolute -top-6 rounded-full"
              style={{
                left: p.left,
                width: p.size,
                height: p.size * 1.4,
                backgroundImage: `linear-gradient(160deg, ${mood.blossomA}, ${mood.blossomB})`,
                animation: `wt-fall ${p.dur} linear ${p.delay} infinite`,
              }}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 8%, ${mood.blossomA}55 0%, transparent 45%),
              radial-gradient(circle at 12% 50%, ${mood.gold}20 0%, transparent 42%),
              radial-gradient(circle at 88% 72%, ${mood.blossomB}30 0%, transparent 48%)
            `,
          }}
          aria-hidden
        />

        <header
          className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-500"
          style={{ borderColor: mood.border, backgroundColor: `${mood.bg}d8` }}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full border font-display text-[11px]"
              style={{
                borderColor: mood.gold,
                backgroundColor: mood.cardBg,
                color: mood.lilac,
              }}
            >
              {monogram}
            </span>

            <div
              className="flex items-center gap-1 rounded-full border p-1"
              style={{ borderColor: mood.border, backgroundColor: mood.cardBg }}
            >
              {(
                [
                  { id: "mist", Icon: Sunrise },
                  { id: "dusk", Icon: Sun },
                  { id: "violet", Icon: Moon },
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
                    style={{ backgroundColor: active ? mood.lilac : "transparent" }}
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
                  color: mood.lilac,
                }}
              >
                {playingMusic ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
                )}
              </button>
            ) : (
              <Heart className="h-4 w-4" style={{ color: mood.lilac }} />
            )}
          </div>
        </header>

        <main className="relative z-10 px-4 pb-28">
          <section className="relative flex flex-col items-center pt-7 pb-10 text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10.5px]"
              style={{
                borderColor: mood.border,
                backgroundColor: mood.cardBg,
                color: mood.lilac,
              }}
            >
              <span>❀</span>
              به نام عشق، زیر سایه‌بان بنفش
            </span>

            <div className="mt-5 w-full">
              <WisteriaTerraceHero
                opened={opened}
                onToggle={() => setOpened((v) => !v)}
                cover={cover}
                couple={couple}
                monogram={monogram}
                mood={mood}
              />
            </div>

            <h1 className="mt-5 flex flex-col items-center font-display text-[44px] leading-[1.18]">
              <span className="wt-title-gradient px-3">{data.partnerOneName}</span>
              <span className="my-1 flex items-center gap-3">
                <span className="h-px w-10" style={{ backgroundColor: mood.gold }} />
                <Heart className="h-4 w-4 fill-current" style={{ color: mood.lilac }} />
                <span className="h-px w-10" style={{ backgroundColor: mood.gold }} />
              </span>
              <span className="wt-title-gradient px-3">{data.partnerTwoName}</span>
            </h1>

            <p className="mt-3 text-[12.5px] font-medium">
              {parts.day && parts.month
                ? `${parts.weekday} · ${parts.day} ${parts.month} ${parts.year}`
                : "تاریخ به‌زودی اعلام می‌شود"}
            </p>
            <p className="mt-1 text-[11.5px]" style={{ color: mood.muted }}>
              {data.venueName || "عمارت یاس سفید"}
            </p>

            <div className="mt-5 flex flex-col items-center opacity-55" style={{ color: mood.lilac }}>
              <span className="text-[8.5px] uppercase tracking-[0.3em]">ورق بزنید</span>
              <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
            </div>
          </section>

          <section id="invitation" className="scroll-mt-20 pt-6">
            <SectionHeader
              subtitleEn="The Terrace Letter"
              title="نامه‌ای از تراسِ عشق"
              description="خوشحالیم که شب پیوندمان را در کنار شما جشن می‌گیریم"
              lilac={mood.lilac}
              gold={mood.gold}
              muted={mood.muted}
            />

            <div
              className="relative mt-5 overflow-hidden rounded-[30px] border p-6 shadow-[0_24px_55px_-24px_rgba(80,50,110,0.18)]"
              style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
            >
              <span
                className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-dashed"
                style={{ borderColor: `${mood.gold}45` }}
              />

              <blockquote
                className="relative z-10 text-center font-display text-[20px] leading-9"
                style={{ color: mood.lilac }}
              >
                {theme.poeticLine}
              </blockquote>

              <p
                className="relative z-10 mt-3.5 text-center text-[13px] leading-8"
                style={{ color: mood.muted }}
              >
                {data.invitationText ||
                  "عطر ویستریا در هواست و دل‌مان برای دیدار شما می‌تپد. با مهر تمام، شما را به جشن پیوندمان دعوت می‌کنیم."}
              </p>

              {families ? (
                <p
                  className="relative z-10 mt-3 text-center text-[11.5px] font-medium"
                  style={{ color: mood.gold }}
                >
                  به میزبانی خانواده‌های {families}
                </p>
              ) : null}

              <div className="relative z-10 mt-6">
                <div
                  className="mx-auto flex w-fit rounded-full border p-1 text-[11px]"
                  style={{ borderColor: mood.border, backgroundColor: mood.bg }}
                >
                  <button
                    type="button"
                    onClick={() => setStoryTab("story")}
                    className={`rounded-full px-4 py-1 transition ${
                      storyTab === "story" ? "font-medium text-white shadow-xs" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: storyTab === "story" ? mood.lilac : "transparent" }}
                  >
                    فصل‌های عاشقی
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoryTab("vows")}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-1 transition ${
                      storyTab === "vows" ? "font-medium text-white shadow-xs" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: storyTab === "vows" ? mood.lilac : "transparent" }}
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
                        className="rounded-2xl border p-3.5"
                        style={{ borderColor: mood.border, backgroundColor: mood.bg }}
                      >
                        <span className="text-[10px] font-semibold" style={{ color: mood.lilac }}>
                          {item.tag}
                        </span>
                        <p className="mt-0.5 font-display text-[17px]">{item.title}</p>
                        <p className="mt-1 text-[12px] leading-6" style={{ color: mood.muted }}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div
                      className="rounded-2xl border p-4"
                      style={{ borderColor: mood.border, backgroundColor: mood.bg }}
                    >
                      <p className="text-[10.5px] font-semibold" style={{ color: mood.lilac }}>
                        عهدِ {data.partnerOneName}:
                      </p>
                      <p className="mt-1 font-display text-[17px] leading-8">
                        «عهد می‌بندم که در تمام فصل‌ها، سایه‌بان آرامش تو باشم.»
                      </p>
                    </div>
                    <div
                      className="rounded-2xl border p-4"
                      style={{ borderColor: mood.border, backgroundColor: mood.bg }}
                    >
                      <p className="text-[10.5px] font-semibold" style={{ color: mood.lilac }}>
                        عهدِ {data.partnerTwoName}:
                      </p>
                      <p className="mt-1 font-display text-[17px] leading-8">
                        «عهد می‌بندم که هر غروب را با دستت در دستم، مثل خوشه‌ی ویستریا آویخته‌ی عشقت بمانم.»
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {showMusic ? (
                <div
                  className="relative z-10 mt-5 flex items-center justify-between rounded-2xl border px-3.5 py-2.5"
                  style={{ borderColor: mood.border, backgroundColor: mood.bg }}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPlayingMusic((p) => !p)}
                      aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition active:scale-95"
                      style={{ backgroundColor: mood.lilac }}
                    >
                      {playingMusic ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 translate-x-[0.5px]" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-medium">{theme.musicTitle}</p>
                      <p className="text-[9.5px]" style={{ color: mood.muted }}>
                        {playingMusic ? "در حال پخش…" : "لمس برای شنیدن ملودی تراس"}
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
                          backgroundColor: mood.lilac,
                          animation: playingMusic
                            ? `wt-eq ${0.6 + i * 0.14}s ease-in-out infinite`
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

          <section className="pt-14">
            <SectionHeader
              subtitleEn="Save The Date"
              title="تقویم روز پیوند"
              description="روز موعود در تقویم دل ما با خوشه‌ای بنفش نشانه خورده است"
              lilac={mood.lilac}
              gold={mood.gold}
              muted={mood.muted}
            />

            <div
              className="mt-5 overflow-hidden rounded-[30px] border p-5 shadow-lg"
              style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
            >
              <div
                className="flex items-center justify-between border-b pb-3"
                style={{ borderColor: mood.border }}
              >
                <span className="font-display text-[20px]">
                  {parts.month || "اردیبهشت"} {parts.year || "۱۴۰۶"}
                </span>
                <span
                  className="rounded-full px-3 py-0.5 text-[11px] font-medium text-white"
                  style={{ backgroundColor: mood.lilac }}
                >
                  {parts.weekday || "جمعه"} · ساعت {startTime || "۱۸:۰۰"}
                </span>
              </div>

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
                        backgroundColor: isWeddingDay ? mood.lilac : mood.bg,
                        borderColor: isWeddingDay ? mood.gold : mood.border,
                      }}
                    >
                      {isWeddingDay ? <Heart className="h-3 w-3 fill-current text-[#f8f0ff]" /> : null}
                      <span className="font-display text-[16px]">{d.toLocaleString("fa-IR")}</span>
                    </div>
                  );
                })}
              </div>

              {showCountdown ? (
                <div className="mt-5 border-t pt-4" style={{ borderColor: mood.border }}>
                  <p className="mb-2.5 text-center text-[10.5px]" style={{ color: mood.muted }}>
                    شمارش تپش‌ها تا دیدار زیر تراس
                  </p>
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-2xl [&>div]:border [&>div]:border-[#c4a46a]/35 [&>div]:bg-black/[0.03] [&>div]:py-3 [&_p:first-child]:font-display [&_p:first-child]:text-[24px] [&_p:last-child]:text-[10px]"
                  />
                </div>
              ) : null}
            </div>
          </section>

          <section id="schedule" className="scroll-mt-20 pt-14">
            <SectionHeader
              subtitleEn="The Evening Acts"
              title="پرده‌های شب رؤیایی"
              description="چهار پرده‌ی شیرین از غروب تا نیمه‌شب"
              lilac={mood.lilac}
              gold={mood.gold}
              muted={mood.muted}
            />

            <ul className="mt-6 space-y-3.5">
              {schedule.map((item) => {
                const Icon = scheduleIcon(item.icon);
                return (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="relative flex items-start gap-3.5 overflow-hidden rounded-3xl border p-4 shadow-xs"
                    style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
                  >
                    <div
                      className="flex h-16 w-14 shrink-0 flex-col items-center justify-center border text-center"
                      style={{
                        borderRadius: "14px 14px 18px 18px",
                        borderColor: mood.gold,
                        backgroundColor: mood.bg,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: mood.lilac }} />
                      <span className="mt-1 font-display text-[13px] font-bold">{item.time}</span>
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="font-display text-[18px] leading-snug">{item.title}</p>
                      <p className="mt-1 text-[12px] leading-6" style={{ color: mood.muted }}>
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {showMap ? (
            <section id="location" className="scroll-mt-20 pt-14">
              <SectionHeader
                subtitleEn="The Terrace Venue"
                title="نشانی تراس و مسیریابی"
                description="مشتاق دیدار روی ماهتان در تراس جشن هستیم"
                lilac={mood.lilac}
                gold={mood.gold}
                muted={mood.muted}
              />

              <div
                className="mt-5 overflow-hidden rounded-[30px] border p-5 text-center shadow-lg"
                style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
              >
                <span
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border"
                  style={{
                    borderColor: mood.gold,
                    backgroundColor: mood.bg,
                    color: mood.lilac,
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
                      { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                      { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
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
                        style={{ borderColor: mood.border, backgroundColor: mood.bg }}
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
                    style={{ backgroundColor: mood.lilac }}
                  >
                    <CalendarDays className="h-4 w-4" />
                    ثبت یادآور در تقویم گوگل
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          <section className="pt-14">
            <SectionHeader
              subtitleEn="The Bloom Palette"
              title="پالت شکوفه و پوشش"
              description={theme.dressCode}
              lilac={mood.lilac}
              gold={mood.gold}
              muted={mood.muted}
            />

            <div className="mt-6 grid grid-cols-5 gap-2">
              {BLOOM_SWATCHES.map((swatch, idx) => {
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
                      className={`relative flex h-13 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        active ? "scale-110 shadow-md" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: swatch.color,
                        borderColor: active ? mood.gold : "rgba(255,255,255,0.65)",
                      }}
                    />
                    <span className={`mt-2.5 text-center text-[10px] ${active ? "font-bold" : "opacity-70"}`}>
                      {swatch.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="mt-4 rounded-2xl border px-4 py-3 text-center text-[11.5px] leading-6"
              style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
            >
              <span className="font-semibold" style={{ color: mood.lilac }}>
                {BLOOM_SWATCHES[swatchIdx].label}:{" "}
              </span>
              <span style={{ color: mood.muted }}>{BLOOM_SWATCHES[swatchIdx].tip}</span>
            </div>
          </section>

          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 pt-14">
              <SectionHeader
                subtitleEn="Kindly Reply"
                title="اعلام حضور و هدیه‌ی شکوفه"
                description="پاسخ پرمهرتان را با منگوله‌ی طلایی برای ما بفرستید"
                lilac={mood.lilac}
                gold={mood.gold}
                muted={mood.muted}
              />

              <div
                className="relative mt-5 overflow-hidden rounded-[30px] border p-6 shadow-xl"
                style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
              >
                {rsvpSealed ? (
                  <div
                    className="flex flex-col items-center py-2 text-center"
                    style={{ animation: "wt-seal-in 550ms ease-out both" }}
                  >
                    <span
                      className="flex h-20 w-20 items-center justify-center rounded-full border text-white"
                      style={{
                        borderColor: mood.gold,
                        backgroundImage: `radial-gradient(circle at 32% 28%, ${mood.blossomA}, ${mood.lilac} 55%, #4a2d66)`,
                        boxShadow: "0 12px 26px -8px rgba(70,40,100,0.5)",
                      }}
                    >
                      <span className="font-display text-lg">{monogram}</span>
                    </span>
                    <p className="mt-4 font-display text-[21px]">
                      {attending
                        ? "با مهر ثبت شد؛ زیر تراس چشم‌به‌راهتانیم"
                        : "پاسخ و شکوفه‌ی محبت شما در قلب ما نشست"}
                    </p>
                    <p className="mt-1 text-[12px]" style={{ color: mood.muted }}>
                      {attending
                        ? `${guests.toLocaleString("fa-IR")} نفر همراه · هدیه: ${selectedGift.label}`
                        : `دلمان با شماست · هدیه: ${selectedGift.label}`}
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
                        { value: true, label: "با افتخار می‌آیم" },
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
                              backgroundColor: active ? mood.lilac : mood.bg,
                              color: active ? "#ffffff" : mood.ink,
                              borderColor: active ? mood.lilac : mood.border,
                            }}
                          >
                            {active ? <Check className="h-3.5 w-3.5" /> : null}
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className={`mt-3 flex items-center justify-between rounded-2xl border px-4 py-2.5 transition ${
                        attending ? "" : "pointer-events-none opacity-40"
                      }`}
                      style={{ borderColor: mood.border, backgroundColor: mood.bg }}
                    >
                      <span className="flex items-center gap-1.5 text-[12px] font-medium">
                        <Users className="h-4 w-4" style={{ color: mood.lilac }} />
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
                          style={{ backgroundColor: mood.lilac }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-center text-[11px]" style={{ color: mood.muted }}>
                        کدام شکوفه را همراه نامه‌تان می‌فرستید؟
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {BLOOM_GIFTS.map((item) => {
                          const active = giftId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setGiftId(item.id)}
                              className="flex w-full items-center justify-between rounded-xl border px-3.5 py-2 text-[11.5px] transition"
                              style={{
                                borderColor: active ? mood.lilac : mood.border,
                                backgroundColor: active ? `${mood.lilac}15` : mood.bg,
                              }}
                            >
                              <span className="flex items-center gap-2">
                                <span>{item.mark}</span>
                                <span>{item.label}</span>
                              </span>
                              {active ? (
                                <Check className="h-3.5 w-3.5" style={{ color: mood.lilac }} />
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
                      style={{ backgroundColor: mood.lilac }}
                    >
                      <Sparkles className="h-4 w-4" />
                      {preview ? "ثبت حضور با منگوله‌ی طلایی" : "ثبت حضور با منگوله‌ی طلایی"}
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : null}

          <section className="pt-16 pb-6 text-center">
            <span className="text-2xl" style={{ color: mood.lilac }}>
              ❀
            </span>
            <p className="mx-auto mt-3 max-w-[290px] font-display text-[21px] leading-9">
              {theme.blessingLine}
            </p>
            <p
              className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.34em]"
              style={{ color: mood.muted }}
            >
              {latinDate} · {couple}
            </p>
            <span className="sr-only">{uid}</span>
          </section>
        </main>

        <nav className="fixed bottom-4 left-0 right-0 z-40 mx-auto w-[calc(100%-2rem)] max-w-[390px]">
          <div
            className="flex h-14 items-center justify-around rounded-full border px-2 shadow-xl backdrop-blur-2xl"
            style={{
              backgroundColor: `${mood.cardBg}e8`,
              borderColor: mood.border,
            }}
          >
            {(
              [
                { href: "#invitation", label: "نامه‌ی ما", Icon: Feather },
                { href: "#schedule", label: "پرده‌ها", Icon: Clock },
                { href: "#location", label: "تراس", Icon: MapPin },
                { href: "#rsvp", label: "حضور", Icon: Heart },
              ] as const
            ).map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] opacity-80 transition hover:opacity-100"
              >
                <Icon className="h-3.5 w-3.5" style={{ color: mood.lilac }} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
