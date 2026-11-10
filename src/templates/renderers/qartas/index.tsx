"use client";

import {
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coffee,
  Feather,
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

const DEFAULT_COVER = "/images/templates/qartas-cover.jpg";

/** رنگ‌های نسخه‌های خطی ایرانِ قدیم */
const GOLD = "#d9b45b";
const LAPIS = "#26336e";
const VERMILION = "#b23a2e";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "آغاز با چای و شربت",
    description: "پذیرایی سنتی با گلاب، نبات و بهارنارنج",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "سفره‌ی عقد",
    description: "مراسم عقد روی سفره‌ی عقد با نقش‌های سنتی",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "ضیافت ایرانی",
    description: "شامی با طعم‌های قدیمیِ ایران",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "تار و کمانچه",
    description: "موسیقی زنده و شادی تا پاسی از شب",
    icon: "music",
  },
];

const PALETTE = [
  { color: "#26336e", label: "لاجورد" },
  { color: "#b23a2e", label: "شنگرف" },
  { color: "#d9b45b", label: "طلایی" },
  { color: "#f3e9d2", label: "کاغذ کرم" },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** غبار طلاییِ نسخه‌خوانی */
const DUST = (() => {
  const rand = seeded(6047);
  return Array.from({ length: 18 }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 1.4 + rand() * 2.4,
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

/** گوشه‌نگارِ تذهیب برای قاب کاغذ */
function Corner({ flip = "" }: { flip?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      aria-hidden
      className={`h-7 w-7 text-[color:var(--qa-gold)] ${flip}`}
    >
      <path
        d="M55 1.5 H17 C8 1.5 1.5 8 1.5 17 V55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M55 11 H21 C13.5 11 11 13.5 11 21 V55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />
      <circle cx="9" cy="9" r="2.6" fill="currentColor" />
      <circle cx="19" cy="19" r="1.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** گره هشت‌پرِ تذهیب */
function Knot8({
  size = 40,
  className = "",
  children,
}: {
  size?: number;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rotate-45 rounded-[16%] bg-[linear-gradient(135deg,#e7c470,#b18a3e)] shadow-[0_0_14px_rgba(233,200,124,0.35)]" />
      <span className="absolute inset-0 rounded-[16%] bg-[linear-gradient(135deg,#e7c470,#b18a3e)] shadow-[0_0_14px_rgba(233,200,124,0.35)]" />
      {children ? (
        <span className="relative z-10 grid h-[62%] w-[62%] place-items-center rounded-full bg-[#232c52] text-[color:var(--qa-gold)]">
          {children}
        </span>
      ) : null}
    </span>
  );
}

/** پرتوهای شمسه — خورشیدِ تذهیب */
function Shamseh({ uid }: { uid: string }) {
  const rays = [];
  const N = 32;
  const polar = (r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return `${150 + r * Math.cos(rad)},${150 + r * Math.sin(rad)}`;
  };
  for (let i = 0; i < N; i += 1) {
    const a = (i / N) * 360;
    const long = i % 2 === 0;
    const r1 = long ? 148 : 122;
    const w = long ? 5.6 : 3.6;
    const fill = i % 4 < 2 ? `url(#${uid}-rayg)` : VERMILION;
    rays.push(
      <polygon
        key={i}
        points={`${polar(96, a - w)} ${polar(96, a + w)} ${polar(r1, a)}`}
        fill={fill}
        opacity={long ? 0.95 : 0.75}
      />,
    );
  }
  return (
    <svg viewBox="0 0 300 300" aria-hidden className="h-full w-full">
      <defs>
        <linearGradient id={`${uid}-rayg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e7c470" />
          <stop offset="1" stopColor="#b18a3e" />
        </linearGradient>
      </defs>
      <g>{rays}</g>
      <circle cx="150" cy="150" r="98" fill="none" stroke={`url(#${uid}-rayg)`} strokeWidth="3" />
      <circle cx="150" cy="150" r="104" fill="none" stroke={VERMILION} strokeWidth="1.4" opacity="0.6" />
    </svg>
  );
}

/** رویِ جلد — لاک شنگرف با تذهیب طلایی */
function CoverFace({
  monogram,
  onOpen,
}: {
  monogram: string;
  onOpen: () => void;
}) {
  return (
    <div
      className={`absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-[12px] bg-[linear-gradient(160deg,#c14434_0%,#8a2418_70%,#6e1a11_100%)] shadow-[0_26px_54px_rgba(0,0,0,0.5)]`}
    >
      {/* لبه‌ی صفحات */}
      <div className="absolute inset-y-1.5 left-1 w-[7px] rounded-l-md bg-[repeating-linear-gradient(180deg,#e9dcc0_0_3px,#cbb98e_3px_4px)]" />
      {/* طاق جلد */}
      <div className="absolute inset-x-4 inset-y-3 rounded-[10px] border-[3px] border-[color:var(--qa-gold)]/90" />
      <div className="absolute inset-x-7 inset-y-6 rounded-[8px] border border-[color:var(--qa-gold)]/45" />
      {/* گوشه‌های تذهیب */}
      <Corner flip="absolute right-5 top-5" />
      <Corner flip="absolute left-5 top-5 -scale-x-100" />
      <Corner flip="absolute right-5 bottom-5 -scale-y-100" />
      <Corner flip="absolute left-5 bottom-5 -scale-100" />

      <div className="flex h-full flex-col items-center justify-center px-8">
        <span className="text-[11px] font-semibold tracking-[0.3em] text-[#f0d79a]/90">
          دیوانِ پیوند
        </span>

        {/* گرهِ گشایش */}
        <button
          type="button"
          aria-label="گشودن دیوان"
          onClick={onOpen}
          className="group relative mt-5 flex items-center justify-center outline-none"
        >
          <span className="pointer-events-none absolute -inset-7 animate-ping rounded-full bg-[#f0d79a]/15" style={{ animationDuration: "2.8s" }} />
          <Knot8 size={92}>
            <span className="flex flex-col items-center">
              <span className="font-display text-2xl font-bold leading-none tracking-widest">
                {monogram}
              </span>
              <Star className="mt-1 h-3 w-3 fill-current opacity-80" />
            </span>
          </Knot8>
        </button>

        <span className="mt-5 font-display text-sm tracking-[0.18em] text-[#f6e3b4]">
          قرطاسِ عاشقانه
        </span>
        <span className="mt-6 flex items-center gap-1.5 text-[10px] text-[#f0d79a]/70">
          <span className="h-px w-8 bg-[#f0d79a]/50" />
          نسخه‌ی خطی
          <span className="h-px w-8 bg-[#f0d79a]/50" />
        </span>
      </div>
    </div>
  );
}

/** پشتِ جلد — کاغذ ساده */
function CoverBack() {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded-[12px] bg-[#e6d9b8] shadow-[0_26px_54px_rgba(0,0,0,0.4)]">
      <div className="absolute inset-x-4 inset-y-3 rounded-[10px] border border-[#b18a3e]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,252,240,0.7),transparent_60%)]" />
    </div>
  );
}

/** ورقِ یکم — بسم‌الله و شعر */
function PageOneFace({
  theme,
  onNext,
}: {
  theme: TemplateCustomization;
  onNext: () => void;
}) {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-[12px] bg-[#f3e9d2] shadow-[0_20px_44px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-x-1.5 inset-y-1.5 rounded-[10px] border border-[#b18a3e]/50" />
      <Corner flip="absolute right-3 top-3" />
      <Corner flip="absolute left-3 top-3 -scale-x-100" />
      <Corner flip="absolute right-3 bottom-3 -scale-y-100" />
      <Corner flip="absolute left-3 bottom-3 -scale-100" />
      {/* کهنگی کاغذ */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(150,110,60,0.1),transparent_55%)]" />

      <div className="flex h-full flex-col items-center justify-between px-7 py-9 text-center">
        <div>
          {/* قرنیز بسم‌الله */}
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#b18a3e]/60 bg-[#faf3e3] px-4 py-1.5 shadow-[inset_0_0_12px_rgba(177,138,62,0.15)]">
            <Star className="h-3 w-3 fill-current text-[#b18a3e]" />
            <span className="font-display text-[13px] tracking-[0.08em] text-[#8a6a2c]">
              بسم الله الرحمن الرحیم
            </span>
            <Star className="h-3 w-3 fill-current text-[#b18a3e]" />
          </div>

          <p className="mt-7 font-display text-[1.3rem] leading-[2.2rem] text-[color:#232c52]">
            {theme.poeticLine}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-[#b18a3e]">
            <span className="h-px w-12 bg-[#b18a3e]/60" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#b23a2e]" />
            <span className="h-px w-12 bg-[#b18a3e]/60" />
          </div>
          <p className="mt-4 text-xs leading-7 text-[#4b4368]">
            در این قرطاس، خبرِ پیوندی نوشته‌اند
            <br />
            که چون نسخه‌ای کهن، هرگز کهنه نمی‌شود
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#e7c470,#b18a3e)] px-6 py-3 text-sm font-semibold text-[#2b1f08] shadow-[0_10px_24px_rgba(217,180,91,0.45)] transition hover:brightness-105 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          ورق بزنید
        </button>
      </div>
    </div>
  );
}

/** ورقِ دوم — شمسه‌ی زوج */
function PageTwoFace({
  uid,
  cover,
  couple,
  onDetails,
}: {
  uid: string;
  cover: string;
  couple: string;
  onDetails: () => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[12px] bg-[#f3e9d2] shadow-[0_16px_36px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-x-1.5 inset-y-1.5 rounded-[10px] border border-[#b18a3e]/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,252,240,0.8),transparent_55%)]" />
      {/* لبه‌ی صفحاتِ باقی */}
      <div className="absolute inset-y-1.5 left-1 w-[7px] rounded-l-md bg-[repeating-linear-gradient(180deg,#e9dcc0_0_3px,#cbb98e_3px_4px)]" />

      <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
        {/* شمسه */}
        <div className="relative h-[210px] w-[210px]">
          <div className="absolute inset-0">
            <Shamseh uid={uid} />
          </div>
          <div className="absolute inset-[14%] overflow-hidden rounded-full border-[3px] border-[#d9b45b] bg-[#e9dcc0] shadow-[0_0_0_5px_#f3e9d2,0_14px_30px_rgba(0,0,0,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={couple} className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_115%,rgba(35,44,82,0.35),transparent_55%)]" />
          </div>
        </div>

        <div>
          <p className="font-display text-xl text-[color:#232c52]">{couple}</p>
          <p className="mt-0.5 text-[11px] font-semibold tracking-[0.2em] text-[#8a6a2c]">
            جشنِ پیوند
          </p>
        </div>

        <button
          type="button"
          onClick={onDetails}
          className="flex items-center gap-2 rounded-full bg-[#232c52] px-6 py-3 text-sm font-semibold text-[#f0d79a] shadow-[0_10px_24px_rgba(35,44,82,0.4)] transition hover:bg-[#2b3768] active:scale-95"
        >
          <ArrowDown className="h-4 w-4" />
          خواندنِ ادامه‌ی قرطاس
        </button>
      </div>
    </div>
  );
}

export function QartasRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = useId().replace(/:/g, "");
  const [stage, setStage] = useState<"closed" | "page1" | "content">("closed");
  const coverOpen = stage !== "closed";
  const revealed = stage === "content";

  const theme: TemplateCustomization = {
    primaryColor: "#d9b45b",
    secondaryColor: "#26336e",
    backgroundColor: "#16214e",
    poeticLine: "«بده ساقی می باقی که در جنت نخواهی یافت»",
    dressCode:
      "پوشش رسمی با الهام از نسخه‌های خطی ایران؛ طیف لاجوردی، شنگرف، طلایی و کرم. لطفاً از لباس کاملاً سفید پرهیز کنید.",
    blessingLine: "حضور شما، نگارین‌ترین ورقِ این دیوان است",
    musicTitle: "نوای تار و کمانچه",
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
      className="relative min-h-screen overflow-hidden font-sans text-[#e9e4d2]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--qa-gold": theme.primaryColor || GOLD,
          "--qa-lapis": theme.secondaryColor || LAPIS,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes qa-twinkle { 0%,100% { opacity: .16; transform: scale(.72); } 50% { opacity: .9; transform: scale(1.14); } }
        @keyframes qa-vu { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
      `}</style>

      {/* شب‌خانِ نسخه‌خوانی: لاجورد و غبار طلایی */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,180,91,0.22),transparent_65%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0d1533]/90 to-transparent" />
        {DUST.map((s, i) => (
          <span
            key={`dust-${i}`}
            className="absolute rounded-full bg-[#f0d79a]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.bright ? 0.8 : 0.3,
              boxShadow: s.bright ? "0 0 7px 1.5px rgba(240,215,154,.55)" : "none",
              animation: `qa-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col">
        {/* سربرگ چسبان — پس از ورق‌خوردن */}
        <header
          className={`sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#d9b45b]/15 bg-[#16214e]/85 px-4 backdrop-blur-xl transition-all duration-700 ${
            revealed
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-full opacity-0"
          }`}
        >
          <Knot8 size={32}>
            <BookOpen className="h-3.5 w-3.5" />
          </Knot8>
          <div className="flex flex-col items-center">
            <span className="font-display text-xl tracking-widest text-[color:var(--qa-gold)]">
              {monogram}
            </span>
            <span className="-mt-1 text-[10px] font-medium tracking-[0.22em] text-[#a9b3d6]">
              قرطاسِ پیوند
            </span>
          </div>
          <Knot8 size={32}>
            <Star className="h-3 w-3 fill-current" />
          </Knot8>
        </header>

        {/* صحنه‌ی دیوان */}
        <section className="relative overflow-hidden">
          <div className="flex flex-col items-center px-5 pb-8 pt-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9b45b]/30 bg-[#d9b45b]/[0.1] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[color:var(--qa-gold)]">
              <BookOpen className="h-3.5 w-3.5" />
              دعوت‌نامه‌ی نسخه‌ی خطی
            </span>
            <h1 className="mt-4 font-display text-3xl leading-snug text-[#f3e9d2]">
              جشن پیوندِ{" "}
              <span className="text-[color:var(--qa-gold)]">{couple}</span>
            </h1>
            <p className="mt-1.5 text-xs tracking-wide text-[#a9b3d6]">
              قرطاسی به سبک ایرانِ قدیم
            </p>

            {/* کتاب */}
            <div className="relative mt-8 [perspective:1600px]">
              {/* روبانِ نشان‌کِ جلد */}
              <div
                className={`absolute -bottom-7 left-7 z-40 h-16 w-5 transition-opacity duration-700 ${
                  coverOpen ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
                  background: "linear-gradient(180deg,#c14434,#8a2418)",
                  boxShadow: "0 6px 14px rgba(0,0,0,.4)",
                }}
              />

              <div className="relative h-[440px] w-[290px] [transform-style:preserve-3d]">
                {/* ورقِ دوم — شمسه (زیر همه) */}
                <div className={`absolute inset-0 z-0 ${revealed ? "" : "pointer-events-none"}`}>
                  <PageTwoFace
                    uid={`${uid}-p2`}
                    cover={cover}
                    couple={couple}
                    onDetails={() =>
                      document
                        .getElementById("ceremony-details")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  />
                </div>

                {/* ورقِ یکم — بسم‌الله و شعر */}
                <div
                  className={`absolute inset-0 z-20 origin-right transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${
                    revealed ? "[transform:rotateY(-168deg)]" : ""
                  }`}
                >
                  <PageOneFace
                    theme={theme}
                    onNext={() => setStage("content")}
                  />
                  {/* پشت ورقِ یکم */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded-[12px] bg-[#eadfc0]">
                    <div className="absolute inset-x-1.5 inset-y-1.5 rounded-[10px] border border-[#b18a3e]/35" />
                  </div>
                </div>

                {/* جلد — لاک شنگرف */}
                <div
                  className={`absolute inset-0 z-30 origin-right transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${
                    coverOpen ? "[transform:rotateY(-172deg)]" : ""
                  }`}
                >
                  <CoverFace
                    monogram={monogram}
                    onOpen={() => setStage("page1")}
                  />
                  <CoverBack />
                </div>
              </div>

              {/* سایه‌ی کتاب روی میز */}
              <div className="mx-auto mt-2 h-5 w-[86%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),transparent_70%)] blur-[6px]" />
            </div>

            {/* راهنما یا دکمه‌های پس از ورق‌خوردن */}
            <div
              className={`relative z-10 mt-9 flex justify-center transition-all duration-500 ${
                coverOpen
                  ? "pointer-events-none -translate-y-2 opacity-0"
                  : "opacity-100"
              }`}
            >
              <span className="flex animate-bounce items-center gap-1.5 rounded-full border border-[#d9b45b]/30 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-[color:var(--qa-gold)] backdrop-blur">
                <BookOpen className="h-3.5 w-3.5" />
                برای خواندن، گرهِ جلد را لمس کنید
              </span>
            </div>

            {revealed ? (
              <div className="relative z-10 mt-6 flex animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_both] items-center justify-center gap-3">
                <a
                  href="#ceremony-details"
                  className="flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#e7c470,#b18a3e)] px-5 py-2.5 text-sm font-semibold text-[#2b1f08] shadow-[0_10px_26px_rgba(217,180,91,0.4)] transition hover:brightness-105"
                >
                  <ArrowDown className="h-4 w-4" />
                  مشاهده جزئیات جشن
                </a>
                <button
                  type="button"
                  onClick={() => setStage("closed")}
                  className="flex items-center gap-1.5 rounded-full border border-[#d9b45b]/30 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-[#c3cbe4] backdrop-blur transition hover:text-[#f3e9d2]"
                >
                  <RotateCcw className="h-4 w-4" />
                  بستن دیوان
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* ورق‌های ادامه — پس از ورق‌خوردن */}
        <div
          className={`flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            revealed
              ? "translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 translate-y-6 overflow-hidden opacity-0"
          }`}
        >
          {/* نامه‌ی آغازین */}
          <section className="flex flex-col items-center px-5 pt-8 text-center">
            <div className="relative w-full rounded-2xl border border-[#b18a3e]/35 bg-[#f3e9d2] p-6 pt-7 text-[#232c52] shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
              <Corner flip="absolute right-2 top-2" />
              <Corner flip="absolute left-2 top-2 -scale-x-100" />
              <Corner flip="absolute right-2 bottom-2 -scale-y-100" />
              <Corner flip="absolute left-2 bottom-2 -scale-100" />
              <div className="absolute inset-x-3 inset-y-3 rounded-xl border border-[#b18a3e]/25" />

              <p className="text-sm leading-8 text-[#3b3f63]">
                {data.invitationText ||
                  "شما با کمال مهر و افتخار به جشن پیوندمان فراخوانده شده‌اید"}
              </p>

              <div className="mt-5 flex items-center justify-center gap-2 text-[#b18a3e]">
                <span className="h-px w-12 bg-[#b18a3e]/60" />
                <Knot8 size={16} />
                <span className="h-px w-12 bg-[#b18a3e]/60" />
              </div>
              <p className="mt-4 font-display text-lg leading-8 text-[#8a2418]">
                {theme.blessingLine}
              </p>
            </div>
          </section>

          {/* موسیقی */}
          {showMusic ? (
            <section className="px-5 pt-7">
              <div className="flex items-center justify-between rounded-2xl border border-[#b18a3e]/35 bg-[#f3e9d2] p-3.5 text-[#232c52] shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e7c470,#b18a3e)] text-[#2b1f08] shadow-[0_8px_20px_rgba(217,180,91,0.4)]">
                    <Music2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-semibold">
                      {theme.musicTitle}
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b23a2e]" />
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#4b4368]">
                      نوازندگانِ شبِ ما
                    </p>
                  </div>
                </div>
                <div className="flex h-6 items-end gap-1 px-1">
                  {[3, 5, 4, 6, 3].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 origin-bottom rounded-full bg-[#b18a3e]"
                      style={{
                        height: `${h * 4}px`,
                        animation: `qa-vu ${1 + i * 0.17}s ease-in-out ${i * 0.11}s infinite`,
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
              className="flex scroll-mt-20 flex-col items-center px-5 pt-7 text-center"
            >
              <div className="mb-2 flex items-center gap-2 text-[color:var(--qa-gold)]">
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d9b45b]/70" />
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] font-semibold tracking-[0.18em]">
                  تا بزمِ پیوند
                </span>
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d9b45b]/70" />
              </div>
              <p className="font-display text-xl text-[#f3e9d2]">{dayLabel}</p>
              {timeLabel ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#a9b3d6]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {timeLabel}
                </p>
              ) : null}
              <Countdown
                eventStartAt={data.eventStartAt!}
                className="mt-4 w-full [&_div]:rounded-xl [&_div]:border [&_div]:border-[#b18a3e]/35 [&_div]:bg-[#f3e9d2] [&_div]:shadow-[0_10px_24px_rgba(0,0,0,0.2)] [&_p:first-child]:font-display [&_p:first-child]:text-[22px] [&_p:first-child]:font-semibold [&_p:first-child]:text-[#8a6a2c] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#4b4368]"
              />
              {calendarHref ? (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#d9b45b]/30 bg-[#d9b45b]/[0.08] px-4 py-2 text-xs font-medium text-[color:var(--qa-gold)] transition hover:bg-[#d9b45b]/[0.16]"
                >
                  <CalendarDays className="h-4 w-4" />
                  افزودن به تقویم گوگل و اپل
                </a>
              ) : null}
            </section>
          ) : (
            <span id="ceremony-details" />
          )}

          {/* برنامه‌ی بزم */}
          <section className="px-5 pt-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-[color:var(--qa-gold)]">
                برنامه‌ی بزم
              </h2>
              <span className="rounded-full border border-[#d9b45b]/25 bg-[#d9b45b]/[0.08] px-2.5 py-1 text-[10px] font-semibold text-[#a9b3d6]">
                از غروب تا سپیده‌دم
              </span>
            </div>
            <div className="relative rounded-2xl border border-[#b18a3e]/35 bg-[#f3e9d2] p-5 pt-6 text-[#232c52] shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
              <Corner flip="absolute right-2 top-2" />
              <Corner flip="absolute left-2 bottom-2 -scale-100" />
              <div className="absolute bottom-6 right-[42px] top-6 w-px bg-[repeating-linear-gradient(180deg,rgba(177,138,62,0.55)_0_6px,transparent_6px_12px)]" />
              <div className="flex flex-col gap-6">
                {schedule.map((item) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <div
                      key={`${item.time}-${item.title}`}
                      className="relative z-10 flex items-start gap-4"
                    >
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                        <span className="absolute inset-0 rotate-45 rounded-[9px] border border-[#b18a3e]/60 bg-[#e9dcc0]" />
                        <Icon className="relative h-[17px] w-[17px] text-[#8a2418]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-sm font-semibold">{item.title}</h3>
                          <span className="shrink-0 rounded-full bg-[#e9dcc0] px-2 py-0.5 text-[11px] font-medium tabular-nums text-[#8a6a2c]">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-6 text-[#4b4368]">
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
            <section id="location" className="scroll-mt-20 px-5 pt-8">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-[color:var(--qa-gold)]">
                  محل برگزاری
                </h2>
                {data.venueName ? (
                  <span className="text-xs font-medium text-[#a9b3d6]">
                    {data.venueName}
                  </span>
                ) : null}
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#b18a3e]/35 bg-[#f3e9d2] text-[#232c52] shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
                <div className="relative flex h-40 items-end justify-start bg-[linear-gradient(140deg,#26336e_0%,#1b2a5c_60%,#141f47_100%)] p-3">
                  {/* گنبد و ستاره‌های کاشی */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 18% 28%, rgba(240,215,154,.5) 0%, transparent 3.5%), radial-gradient(circle at 70% 18%, rgba(240,215,154,.42) 0%, transparent 3%), radial-gradient(circle at 42% 55%, rgba(240,215,154,.36) 0%, transparent 2.6%), radial-gradient(circle at 84% 62%, rgba(240,215,154,.3) 0%, transparent 2.2%), radial-gradient(circle at 58% 40%, rgba(178,58,46,.5) 0%, transparent 2.4%)",
                    }}
                  />
                  <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#16214e]/70 px-3 py-1.5 text-[11px] font-semibold text-[#f0d79a] ring-1 ring-[#d9b45b]/35 backdrop-blur">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.venueName || "محل مراسم"}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div>
                    {data.venueName ? (
                      <h3 className="text-sm font-semibold">{data.venueName}</h3>
                    ) : null}
                    {data.venueAddress ? (
                      <p className="mt-1 text-xs leading-6 text-[#4b4368]">
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
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#b18a3e]/30 bg-[#faf3e3] p-2.5 transition hover:border-[#b18a3e]/60 hover:bg-[#e9dcc0]"
                        >
                          <Navigation className="h-4 w-4 text-[#8a2418]" />
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
          <section className="px-5 pt-8">
            <div className="relative rounded-2xl border border-[#b18a3e]/35 bg-[#f3e9d2] p-5 pt-6 text-[#232c52] shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
              <Corner flip="absolute right-2 top-2" />
              <Corner flip="absolute left-2 top-2 -scale-x-100" />
              <div className="flex items-start gap-3">
                <Knot8 size={40} className="mt-1">
                  <Sparkles className="h-4 w-4" />
                </Knot8>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">
                    پوشش مهمانان (Dress Code)
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#4b4368]">
                    {theme.dressCode}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {PALETTE.map((s) => (
                      <span
                        key={s.label}
                        className="flex items-center gap-1.5 rounded-full bg-[#faf3e3] px-2.5 py-1 text-[10px] text-[#4b4368] ring-1 ring-[#b18a3e]/30"
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15"
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

          {/* اعلام حضور */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 px-5 pt-8">
              <div className="relative overflow-hidden rounded-2xl border border-[#b18a3e]/40 bg-[#f3e9d2] p-5 pt-7 text-center text-[#232c52] shadow-[0_18px_36px_rgba(0,0,0,0.3)]">
                <Corner flip="absolute right-2 top-2" />
                <Corner flip="absolute left-2 top-2 -scale-x-100" />
                <Corner flip="absolute right-2 bottom-2 -scale-y-100" />
                <Corner flip="absolute left-2 bottom-2 -scale-100" />
                <div className="absolute inset-x-3 inset-y-3 rounded-xl border border-[#b18a3e]/25" />
                <Knot8 size={48} className="mx-auto mb-3">
                  <Feather className="h-4 w-4" />
                </Knot8>
                <h2 className="font-display text-xl text-[#8a2418]">
                  اعلام حضور در بزمِ پیوند
                </h2>
                <p className="mt-1.5 text-xs leading-6 text-[#4b4368]">
                  آیا نامِ شما را نیز در این قرطاس می‌نویسیم؟
                </p>
                {preview ? (
                  <div className="mt-4 flex flex-col gap-2.5 text-right">
                    <div className="flex w-full items-center justify-between rounded-xl border border-[#b18a3e]/50 bg-[#faf3e3] p-3.5">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-[#26336e]" />
                        <span className="text-sm font-semibold">
                          با افتخار همراه شما هستیم
                        </span>
                      </div>
                      <span className="h-4 w-4 rounded-full border border-[#26336e]/60 bg-[#26336e]" />
                    </div>
                    <div className="flex w-full items-center justify-between rounded-xl border border-[#b18a3e]/30 bg-[#f6efdb] p-3.5">
                      <div className="flex items-center gap-2.5">
                        <XCircle className="h-5 w-5 text-[#4b4368]" />
                        <span className="text-sm font-medium text-[#4b4368]">
                          متأسفانه امکان حضور ندارم
                        </span>
                      </div>
                      <span className="h-4 w-4 rounded-full border border-[#4b4368]/40" />
                    </div>
                  </div>
                ) : (
                  <a
                    href="#rsvp"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#e7c470,#b18a3e)] py-3.5 text-sm font-semibold text-[#2b1f08] shadow-[0_12px_28px_rgba(217,180,91,0.45)] transition hover:brightness-105"
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
            <div className="relative h-[130px] w-[130px]">
              <div className="absolute inset-0 opacity-90">
                <Shamseh uid={`${uid}-f`} />
              </div>
              <div className="absolute inset-[18%] overflow-hidden rounded-full border-2 border-[#d9b45b] bg-[#26336e]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={couple}
                  className="h-full w-full object-cover object-center opacity-90"
                />
              </div>
            </div>
            <p className="max-w-sm font-display text-lg leading-relaxed text-[#a9b3d6]">
              این نسخه را به یادگار نگاه دارید؛
              <br />
              <span className="text-[color:var(--qa-gold)]">
                هر ورقش، خاطره‌ای از شبِ ماست
              </span>
            </p>
            <div className="mt-2 flex items-center gap-2 text-[#c3cbe4]">
              <span className="h-px w-8 bg-[#d9b45b]/40" />
              <Sparkles className="h-3.5 w-3.5 text-[#d9b45b]" />
              <span className="text-sm font-semibold">{couple}</span>
              <Sparkles className="h-3.5 w-3.5 text-[#d9b45b]" />
              <span className="h-px w-8 bg-[#d9b45b]/40" />
            </div>
          </footer>
        </div>
      </div>

      {/* منوی پایین */}
      {revealed ? (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-16 w-full max-w-md items-center justify-around border-t border-[#d9b45b]/15 bg-[#101a3f]/90 px-2 backdrop-blur-xl">
          {[
            { href: "#ceremony-details", label: "جزئیات جشن", icon: Sparkles },
            { href: "#location", label: "مکان", icon: MapPin },
            { href: "#rsvp", label: "اعلام حضور", icon: Feather },
          ].map((item) => (
            <a
              key={item.href}
              href={preview ? undefined : item.href}
              className="flex min-h-[44px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[10px] font-medium text-[#a9b3d6] transition hover:text-[color:var(--qa-gold)]"
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



