"use client";

import { useId, useState, type CSSProperties } from "react";
import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Coffee,
  Feather,
  Flame,
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

const DEFAULT_COVER = "/images/templates/arya-paradise-cover.jpg";

type ParadiseMood = "dawn" | "goldenhour" | "fire";

const MOODS: Record<
  ParadiseMood,
  {
    label: string;
    bg: string;
    cardBg: string;
    ink: string;
    muted: string;
    lapis: string;
    gold: string;
    turquoise: string;
    saffron: string;
    border: string;
    isDark: boolean;
  }
> = {
  dawn: {
    label: "سپیده‌دمِ پردیس",
    bg: "#f3e9d5",
    cardBg: "#fffaf0",
    ink: "#2a1f14",
    muted: "#6e5a45",
    lapis: "#1e3a6e",
    gold: "#c9a13b",
    turquoise: "#2a9d8f",
    saffron: "#d4843b",
    border: "rgba(201, 161, 59, 0.4)",
    isDark: false,
  },
  goldenhour: {
    label: "غروبِ زرین",
    bg: "#f6e2c8",
    cardBg: "#fff8ec",
    ink: "#2c180c",
    muted: "#7a5640",
    lapis: "#243f72",
    gold: "#d4ae4a",
    turquoise: "#1f8f84",
    saffron: "#e09445",
    border: "rgba(212, 174, 74, 0.42)",
    isDark: false,
  },
  fire: {
    label: "آتشِ شب",
    bg: "#120e0a",
    cardBg: "#1c1510",
    ink: "#f6ead7",
    muted: "#c4b09a",
    lapis: "#6f93d6",
    gold: "#e0b973",
    turquoise: "#5ec4b8",
    saffron: "#f0a35a",
    border: "rgba(224, 185, 115, 0.35)",
    isDark: true,
  },
};

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "گاهِ نخست · ورود به پردیس",
    description: "گلاب و نقل دمِ دروازه، نوای نی و سایه‌ی سروهای کهن",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "گاهِ دوم · پیمان کنار حوض نیلوفر",
    description: "آیین عقد میان ستون‌های زرین و عطر شکوفه‌های انار",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "گاهِ سوم · ضیافتِ چهارباغ",
    description: "شام در میان کرت‌های گل و نور فانوس‌های لاجوردی",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "گاهِ چهارم · رقص زیر آتشکده",
    description: "نخستین رقص کنار شعله‌ی فروزان و ستاره‌های شب پارسه",
    icon: "music",
  },
];

const LOVE_STORY = [
  {
    tag: "سرآغاز",
    title: "نگاهی چون طلوع بر سنگِ پارسه",
    text: "در میان روزهای عادی، نگاهی آمد که مثل نقشِ زرین بر دل نشست و دیگر محو نشد.",
  },
  {
    tag: "هم‌قدم",
    title: "سایه‌ی دو سرو در یک جوی",
    text: "با هم خندیدیم، با هم رؤیا بافتیم و فهمیدیم خانه همان‌جاست که دستت در دست من است.",
  },
  {
    tag: "پیمان",
    title: "عهدی به استواریِ تخت جمشید",
    text: "کنار حوض نیلوفر قول همیشگی دادیم و حالا می‌خواهیم این شادی را با شما قسمت کنیم.",
  },
] as const;

const SWATCHES = [
  {
    color: "#1e3a6e",
    label: "لاجورد",
    tip: "آبی ژرفِ کاشی‌های کهن؛ برای لباس شب و اکسسوری آقایان.",
  },
  {
    color: "#c9a13b",
    label: "زرین",
    tip: "طلایی هخامنشی برای جزئیات و درخشش استایل.",
  },
  {
    color: "#2a9d8f",
    label: "فیروزه",
    tip: "سبزآبیِ حوض پردیس؛ لطیف و هماهنگ با باغ.",
  },
  {
    color: "#d4843b",
    label: "زعفرانی",
    tip: "نارنجی گرمِ غروب پارسه برای استایلی زنده.",
  },
  {
    color: "#2a1f14",
    label: "سروی",
    tip: "قهوه‌ای تیره و مشکی رسمی برای کت‌وشلوار کلاسیک.",
  },
];

const OFFERINGS = [
  { id: "lotus", label: "نیلوفر آبی (پاکی و عشق)", mark: "❀" },
  { id: "cypress", label: "شاخه‌ی سرو (جاودانگی)", mark: "†" },
  { id: "pomegranate", label: "انار زرین (برکت و شادی)", mark: "✦" },
] as const;

const FALLING = [
  { left: "8%", delay: "0s", dur: "13s", size: 6 },
  { left: "24%", delay: "2.5s", dur: "11s", size: 5 },
  { left: "45%", delay: "4.2s", dur: "12.5s", size: 7 },
  { left: "62%", delay: "1.2s", dur: "14s", size: 5 },
  { left: "78%", delay: "3.3s", dur: "11.8s", size: 6 },
  { left: "90%", delay: "0.8s", dur: "13.2s", size: 5 },
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

function Cypress({
  className = "",
  gold,
  flip = false,
}: {
  className?: string;
  gold: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 140"
      className={`${className} ${flip ? "-scale-x-100" : ""}`}
      aria-hidden
    >
      <path
        d="M20 8 C 8 40, 10 70, 14 100 C 16 118, 18 130, 20 136 C 22 130, 24 118, 26 100 C 30 70, 32 40, 20 8 Z"
        fill="currentColor"
        opacity="0.88"
      />
      <path
        d="M20 20 C 14 42, 15 70, 17 96"
        fill="none"
        stroke={gold}
        strokeWidth="0.7"
        strokeOpacity="0.55"
      />
      <rect x="18.5" y="132" width="3" height="8" rx="1" fill={gold} opacity="0.7" />
    </svg>
  );
}

function WingedRosette({
  monogram,
  gold,
  lapis,
  size = 72,
}: {
  monogram: string;
  gold: string;
  lapis: string;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="50" cy="50" r="46" fill={lapis} />
        <circle cx="50" cy="50" r="46" fill="none" stroke={gold} strokeWidth="2.2" />
        <circle cx="50" cy="50" r="38" fill="none" stroke={gold} strokeWidth="0.8" strokeDasharray="2 2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <ellipse
            key={a}
            cx="50"
            cy="28"
            rx="5"
            ry="10"
            fill={gold}
            opacity="0.85"
            transform={`rotate(${a} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="14" fill={gold} />
      </svg>
      <span className="relative z-10 font-display text-[12px] font-bold tracking-wider" style={{ color: lapis }}>
        {monogram}
      </span>
    </span>
  );
}

function SectionHeader({
  subtitleEn,
  title,
  description,
  gold,
  lapis,
  muted,
}: {
  subtitleEn: string;
  title: string;
  description?: string;
  gold: string;
  lapis: string;
  muted: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2.5">
        <span className="h-px w-10" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${gold})` }} />
        <span className="text-[11px]" style={{ color: gold }}>
          ✦
        </span>
        <span className="text-[9px] uppercase tracking-[0.34em]" style={{ color: gold }}>
          {subtitleEn}
        </span>
        <span className="text-[11px]" style={{ color: gold }}>
          ✦
        </span>
        <span className="h-px w-10" style={{ backgroundImage: `linear-gradient(270deg, transparent, ${gold})` }} />
      </div>
      <h2 className="mt-2.5 font-display text-[28px] leading-tight" style={{ color: lapis }}>
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-[295px] text-[12px] leading-6" style={{ color: muted }}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ParadiseGate({
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
  mood: (typeof MOODS)[ParadiseMood];
}) {
  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[330px] flex-col items-center">
      <Cypress
        className="pointer-events-none absolute -right-2 top-8 z-30 h-40 w-11 text-[#2f5a3a]"
        gold={mood.gold}
      />
      <Cypress
        className="pointer-events-none absolute -left-2 top-8 z-30 h-40 w-11 text-[#2f5a3a]"
        gold={mood.gold}
        flip
      />

      <div
        className="relative w-[288px] overflow-hidden p-3 transition-all duration-700"
        style={{
          borderRadius: "18px 18px 28px 28px",
          backgroundColor: mood.cardBg,
          border: `1.5px solid ${mood.gold}`,
          boxShadow: mood.isDark
            ? "0 28px 65px -20px rgba(0,0,0,0.85), 0 0 40px -12px rgba(201,161,59,0.25)"
            : "0 26px 60px -22px rgba(80, 50, 20, 0.28), inset 0 0 24px rgba(201, 161, 59, 0.12)",
        }}
      >
        {/* Achaemenid crenellation */}
        <div className="absolute inset-x-3 top-1.5 z-20 flex h-3 justify-between px-1" aria-hidden>
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="w-3 rounded-sm" style={{ backgroundColor: mood.gold, opacity: 0.75 }} />
          ))}
        </div>

        <div className="relative mt-2 aspect-[3/3.7] w-full overflow-hidden rounded-[12px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={couple}
            className="h-full w-full object-cover transition-all duration-1000"
            style={{
              transform: opened ? "scale(1.02)" : "scale(1.08)",
              filter: opened ? "contrast(1.04) saturate(1.05)" : "brightness(0.72) saturate(0.85)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(30,58,110,0.25) 0%, transparent 35%, rgba(42,31,20,0.7) 100%)",
            }}
          />

          {/* twin doors */}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={opened}
            aria-label={opened ? "بستن دروازه‌ی پردیس" : "گشودن دروازه‌ی پردیس"}
            className="absolute inset-0 z-20"
          >
            <span
              className={`absolute inset-y-0 left-0 w-1/2 origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                opened ? "-translate-x-[102%]" : "translate-x-0"
              }`}
              style={{
                background: `linear-gradient(100deg, ${mood.lapis} 0%, #2a4a7a 55%, ${mood.lapis}ee 100%)`,
                boxShadow: "inset -8px 0 20px rgba(0,0,0,0.25)",
              }}
              aria-hidden
            >
              <span className="absolute inset-3 border border-dashed" style={{ borderColor: `${mood.gold}66` }} />
              <span className="absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: mood.gold }} />
            </span>
            <span
              className={`absolute inset-y-0 right-0 w-1/2 origin-right transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                opened ? "translate-x-[102%]" : "translate-x-0"
              }`}
              style={{
                background: `linear-gradient(260deg, ${mood.lapis} 0%, #2a4a7a 55%, ${mood.lapis}ee 100%)`,
                boxShadow: "inset 8px 0 20px rgba(0,0,0,0.25)",
              }}
              aria-hidden
            >
              <span className="absolute inset-3 border border-dashed" style={{ borderColor: `${mood.gold}66` }} />
              <span className="absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: mood.gold }} />
            </span>

            <span
              className={`absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
                opened ? "scale-75 opacity-90" : "scale-100 hover:scale-105"
              }`}
            >
              <WingedRosette monogram={monogram} gold={mood.gold} lapis={mood.isDark ? "#1c1510" : "#fffaf0"} />
            </span>

            <span className="absolute inset-x-4 bottom-4 z-30 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-center text-[10px] text-white backdrop-blur-md">
              {opened
                ? "دروازه گشوده شد · لمس برای بستن"
                : "مهرِ زرین را لمس کن تا دروازه‌ی پردیس باز شود"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AryaParadiseRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const rawUid = useId();
  const uid = rawUid.replace(/:/g, "");

  const [moodKey, setMoodKey] = useState<ParadiseMood>("dawn");
  const [opened, setOpened] = useState(false);
  const [storyTab, setStoryTab] = useState<"story" | "vows">("story");
  const [playingMusic, setPlayingMusic] = useState(false);
  const [swatchIdx, setSwatchIdx] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [offeringId, setOfferingId] =
    useState<(typeof OFFERINGS)[number]["id"]>("lotus");
  const [rsvpSealed, setRsvpSealed] = useState(false);

  const theme: TemplateCustomization = {
    primaryColor: "#1e3a6e",
    secondaryColor: "#c9a13b",
    backgroundColor: "#f3e9d5",
    poeticLine:
      "«در پردیسِ دل، دو سرو کنار یک جوی روییدند و سایه‌شان تا ابد یکی شد»",
    blessingLine: "حضور شما، فرخنده‌ترین نقشِ این پردیس است",
    dressCode:
      "پوشش رسمی با الهام از باغ‌های آریایی؛ لاجورد، زرین، فیروزه، زعفرانی و سروی تیره.",
    musicTitle: "نوای چنگ و نی · چهارباغ",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const mood = MOODS[moodKey];
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
  const showMusic = features?.music !== false;
  const query = encodeURIComponent(
    data.mapUrl || [data.venueName, data.venueAddress].filter(Boolean).join(" ") || "",
  );
  const families = [data.familyNames?.partnerOneFamily, data.familyNames?.partnerTwoFamily]
    .filter(Boolean)
    .join(" و ");
  const selectedOffering = OFFERINGS.find((o) => o.id === offeringId) ?? OFFERINGS[0];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans transition-colors duration-700"
      style={
        {
          backgroundColor: mood.bg,
          color: mood.ink,
          "--ap-gold": mood.gold,
          "--ap-lapis": mood.lapis,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes ap-fall {
          0% { transform: translateY(-12px) rotate(0deg); opacity: 0; }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% { transform: translateY(92vh) rotate(180deg); opacity: 0; }
        }
        @keyframes ap-foil {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes ap-eq {
          0%,100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes ap-seal-in {
          0% { transform: scale(1.3) rotate(-8deg); opacity: 0; }
          65% { transform: scale(0.96) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .ap-title-gradient {
          background-image: linear-gradient(100deg, ${mood.lapis} 0%, ${mood.gold} 40%, ${mood.ink} 70%, ${mood.lapis} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ap-foil 11s linear infinite;
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-md overflow-x-clip">
        <div className="pointer-events-none fixed inset-0 z-20 mx-auto max-w-md overflow-hidden" aria-hidden>
          {FALLING.map((p, idx) => (
            <span
              key={idx}
              className="absolute -top-4 rounded-full"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                backgroundColor: mood.gold,
                opacity: 0.55,
                animation: `ap-fall ${p.dur} linear ${p.delay} infinite`,
              }}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 6%, ${mood.gold}33 0%, transparent 42%),
              radial-gradient(circle at 12% 55%, ${mood.turquoise}22 0%, transparent 40%),
              radial-gradient(circle at 88% 70%, ${mood.lapis}18 0%, transparent 45%)
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
              style={{ borderColor: mood.gold, backgroundColor: mood.cardBg, color: mood.lapis }}
            >
              {monogram}
            </span>

            <div
              className="flex items-center gap-1 rounded-full border p-1"
              style={{ borderColor: mood.border, backgroundColor: mood.cardBg }}
            >
              {(
                [
                  { id: "dawn", Icon: Sunrise },
                  { id: "goldenhour", Icon: Sun },
                  { id: "fire", Icon: Moon },
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
                    style={{ backgroundColor: active ? mood.lapis : "transparent" }}
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
                style={{ borderColor: mood.gold, backgroundColor: mood.cardBg, color: mood.lapis }}
              >
                {playingMusic ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />}
              </button>
            ) : (
              <Flame className="h-4 w-4" style={{ color: mood.saffron }} />
            )}
          </div>
        </header>

        <main className="relative z-10 px-4 pb-28">
          <section className="relative flex flex-col items-center pt-7 pb-10 text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10.5px]"
              style={{ borderColor: mood.border, backgroundColor: mood.cardBg, color: mood.lapis }}
            >
              <span style={{ color: mood.gold }}>✦</span>
              به نامِ مهر و پیوندِ جاودان
            </span>

            <div className="mt-5 w-full">
              <ParadiseGate
                opened={opened}
                onToggle={() => setOpened((v) => !v)}
                cover={cover}
                couple={couple}
                monogram={monogram}
                mood={mood}
              />
            </div>

            <h1 className="mt-5 flex flex-col items-center font-display text-[44px] leading-[1.18]">
              <span className="ap-title-gradient px-3">{data.partnerOneName}</span>
              <span className="my-1 flex items-center gap-3">
                <span className="h-px w-10" style={{ backgroundColor: mood.gold }} />
                <Heart className="h-4 w-4 fill-current" style={{ color: mood.saffron }} />
                <span className="h-px w-10" style={{ backgroundColor: mood.gold }} />
              </span>
              <span className="ap-title-gradient px-3">{data.partnerTwoName}</span>
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
              className={`mt-5 flex flex-col items-center opacity-55 transition-opacity duration-700 ${
                opened ? "opacity-55" : "invisible opacity-0"
              }`}
              style={{ color: mood.lapis }}
              aria-hidden={!opened}
            >
              <span className="text-[8.5px] uppercase tracking-[0.3em]">ورق بزنید</span>
              <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
            </div>
          </section>

          <div
            inert={!opened}
            aria-hidden={!opened}
            className={`transition-all duration-1000 ease-out ${
              opened
                ? "translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
          <section id="invitation" className="scroll-mt-20 pt-6">
            <SectionHeader
              subtitleEn="The Paradise Letter"
              title="فرمانی از دلِ پردیس"
              description="خوشحالیم که شب پیوندمان را در کنار شما جشن می‌گیریم"
              gold={mood.gold}
              lapis={mood.lapis}
              muted={mood.muted}
            />

            <div
              className="relative mt-5 overflow-hidden rounded-[30px] border p-6 shadow-[0_24px_55px_-24px_rgba(80,50,20,0.22)]"
              style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
            >
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

              <p className="relative z-10 mt-3.5 text-center text-[13px] leading-8" style={{ color: mood.muted }}>
                {data.invitationText ||
                  "با کمال مهر و افتخار، شما را به جشن پیوندمان در پردیسِ عشق دعوت می‌کنیم؛ شبی که بی حضور شما کامل نیست."}
              </p>

              {families ? (
                <p className="relative z-10 mt-3 text-center text-[11.5px] font-medium" style={{ color: mood.gold }}>
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
                    style={{ backgroundColor: storyTab === "story" ? mood.lapis : "transparent" }}
                  >
                    فصل‌های عاشقی
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoryTab("vows")}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-1 transition ${
                      storyTab === "vows" ? "font-medium text-white shadow-xs" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: storyTab === "vows" ? mood.lapis : "transparent" }}
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
                        <span className="text-[10px] font-semibold" style={{ color: mood.saffron }}>
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
                    <div className="rounded-2xl border p-4" style={{ borderColor: mood.border, backgroundColor: mood.bg }}>
                      <p className="text-[10.5px] font-semibold" style={{ color: mood.saffron }}>
                        عهدِ {data.partnerOneName}:
                      </p>
                      <p className="mt-1 font-display text-[17px] leading-8">
                        «عهد می‌بندم که چون سرو، در کنار تو استوار بمانم.»
                      </p>
                    </div>
                    <div className="rounded-2xl border p-4" style={{ borderColor: mood.border, backgroundColor: mood.bg }}>
                      <p className="text-[10.5px] font-semibold" style={{ color: mood.saffron }}>
                        عهدِ {data.partnerTwoName}:
                      </p>
                      <p className="mt-1 font-display text-[17px] leading-8">
                        «عهد می‌بندم که آتشِ مهرت را تا ابد در دل روشن نگه دارم.»
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
                      style={{ backgroundColor: mood.lapis }}
                    >
                      {playingMusic ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[0.5px]" />}
                    </button>
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-medium">{theme.musicTitle}</p>
                      <p className="text-[9.5px]" style={{ color: mood.muted }}>
                        {playingMusic ? "در حال پخش…" : "لمس برای شنیدن نوای پردیس"}
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
                          backgroundColor: mood.gold,
                          animation: playingMusic ? `ap-eq ${0.6 + i * 0.14}s ease-in-out infinite` : "none",
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
              title="تقویمِ روزِ پیمان"
              description="روز موعود در سنگِ دل ما با نقشِ زرین کنده شده است"
              gold={mood.gold}
              lapis={mood.lapis}
              muted={mood.muted}
            />

            <div
              className="mt-5 overflow-hidden rounded-[30px] border p-5 shadow-lg"
              style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: mood.border }}>
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
                      {isWeddingDay ? <Flame className="h-3 w-3 text-[#f0d9a8]" /> : null}
                      <span className="font-display text-[16px]">{d.toLocaleString("fa-IR")}</span>
                    </div>
                  );
                })}
              </div>

              {showCountdown ? (
                <div className="mt-5 border-t pt-4" style={{ borderColor: mood.border }}>
                  <p className="mb-2.5 text-center text-[10.5px]" style={{ color: mood.muted }}>
                    شمارش تپش‌ها تا ورود به پردیس
                  </p>
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-2xl [&>div]:border [&>div]:border-[#c9a13b]/35 [&>div]:bg-black/[0.03] [&>div]:py-3 [&_p:first-child]:font-display [&_p:first-child]:text-[24px] [&_p:last-child]:text-[10px]"
                  />
                </div>
              ) : null}
            </div>
          </section>

          <section id="schedule" className="scroll-mt-20 pt-14">
            <SectionHeader
              subtitleEn="The Four Watches"
              title="چهار گاهِ شبِ رؤیایی"
              description="از ورود تا رقص زیر آتش"
              gold={mood.gold}
              lapis={mood.lapis}
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
                        borderRadius: "10px 10px 16px 16px",
                        borderColor: mood.gold,
                        backgroundColor: mood.bg,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: mood.lapis }} />
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
                subtitleEn="The Garden Venue"
                title="نشانی پردیس و مسیریابی"
                description="مشتاق دیدار روی ماهتان در پردیس جشن هستیم"
                gold={mood.gold}
                lapis={mood.lapis}
                muted={mood.muted}
              />

              <div
                className="mt-5 overflow-hidden rounded-[30px] border p-5 text-center shadow-lg"
                style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
              >
                <span
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border"
                  style={{ borderColor: mood.gold, backgroundColor: mood.bg, color: mood.lapis }}
                >
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="mt-3.5 font-display text-[23px]">{data.venueName || "عمارت یاس سفید"}</h3>
                {data.venueAddress ? (
                  <p className="mx-auto mt-1.5 max-w-[285px] text-[12px] leading-6" style={{ color: mood.muted }}>
                    {data.venueAddress}
                  </p>
                ) : null}

                {query ? (
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                      { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                      { href: `https://www.google.com/maps/search/?api=1&query=${query}`, label: "گوگل‌مپ" },
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
                    style={{ backgroundColor: mood.lapis }}
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
              subtitleEn="The Royal Palette"
              title="پالتِ پردیس و پوشش"
              description={theme.dressCode}
              gold={mood.gold}
              lapis={mood.lapis}
              muted={mood.muted}
            />

            <div className="mt-6 grid grid-cols-5 gap-2">
              {SWATCHES.map((swatch, idx) => {
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
                      className={`relative flex h-12 w-12 items-center justify-center rounded-[8px] border-2 transition-all duration-300 ${
                        active ? "scale-110 shadow-md" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: swatch.color,
                        borderColor: active ? mood.gold : "rgba(255,255,255,0.5)",
                        clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
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
              <span className="font-semibold" style={{ color: mood.lapis }}>
                {SWATCHES[swatchIdx].label}:{" "}
              </span>
              <span style={{ color: mood.muted }}>{SWATCHES[swatchIdx].tip}</span>
            </div>
          </section>

          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 pt-14">
              <SectionHeader
                subtitleEn="Kindly Reply"
                title="اعلام حضور و پیشکش"
                description="پاسختان را با مهرِ زرینِ گل‌نقش برای ما بفرستید"
                gold={mood.gold}
                lapis={mood.lapis}
                muted={mood.muted}
              />

              <div
                className="relative mt-5 overflow-hidden rounded-[30px] border p-6 shadow-xl"
                style={{ backgroundColor: mood.cardBg, borderColor: mood.border }}
              >
                {rsvpSealed ? (
                  <div
                    className="flex flex-col items-center py-2 text-center"
                    style={{ animation: "ap-seal-in 550ms ease-out both" }}
                  >
                    <WingedRosette
                      monogram={monogram}
                      gold={mood.gold}
                      lapis={mood.isDark ? "#1c1510" : "#fffaf0"}
                      size={88}
                    />
                    <p className="mt-4 font-display text-[21px]">
                      {attending
                        ? "مهر خورد؛ در پردیس چشم‌به‌راهتانیم"
                        : "پیشکشِ محبتتان در دل ما نشست"}
                    </p>
                    <p className="mt-1 text-[12px]" style={{ color: mood.muted }}>
                      {attending
                        ? `${guests.toLocaleString("fa-IR")} نفر همراه · ${selectedOffering.label}`
                        : `دلمان با شماست · ${selectedOffering.label}`}
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

                    <div
                      className={`mt-3 flex items-center justify-between rounded-2xl border px-4 py-2.5 transition ${
                        attending ? "" : "pointer-events-none opacity-40"
                      }`}
                      style={{ borderColor: mood.border, backgroundColor: mood.bg }}
                    >
                      <span className="flex items-center gap-1.5 text-[12px] font-medium">
                        <Users className="h-4 w-4" style={{ color: mood.lapis }} />
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

                    <div className="mt-4">
                      <p className="text-center text-[11px]" style={{ color: mood.muted }}>
                        کدام پیشکش را همراه نامه‌تان می‌فرستید؟
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {OFFERINGS.map((item) => {
                          const active = offeringId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setOfferingId(item.id)}
                              className="flex w-full items-center justify-between rounded-xl border px-3.5 py-2 text-[11.5px] transition"
                              style={{
                                borderColor: active ? mood.gold : mood.border,
                                backgroundColor: active ? `${mood.gold}18` : mood.bg,
                              }}
                            >
                              <span className="flex items-center gap-2">
                                <span>{item.mark}</span>
                                <span>{item.label}</span>
                              </span>
                              {active ? <Check className="h-3.5 w-3.5" style={{ color: mood.lapis }} /> : null}
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
                      {preview ? "مهر کردن نامه با گل‌نقش زرین" : "ثبت حضور با مهرِ زرین"}
                    </button>
                  </>
                )}
              </div>
            </section>
          ) : null}

          <section className="pt-16 pb-6 text-center">
            <Flame className="mx-auto h-6 w-6" style={{ color: mood.saffron }} />
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
          </div>
        </main>

        <nav
          className={`fixed bottom-4 left-0 right-0 z-40 mx-auto w-[calc(100%-2rem)] max-w-[390px] transition-all duration-700 ${
            opened ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
          }`}
          aria-hidden={!opened}
          inert={!opened}
        >
          <div
            className="flex h-14 items-center justify-around rounded-full border px-2 shadow-xl backdrop-blur-2xl"
            style={{ backgroundColor: `${mood.cardBg}e8`, borderColor: mood.border }}
          >
            {(
              [
                { href: "#invitation", label: "فرمان", Icon: Feather },
                { href: "#schedule", label: "گاه‌ها", Icon: Clock },
                { href: "#location", label: "پردیس", Icon: MapPin },
                { href: "#rsvp", label: "مهر", Icon: Flame },
              ] as const
            ).map(({ href, label, Icon }) => (
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
