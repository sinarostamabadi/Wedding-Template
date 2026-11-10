"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowDown,
  Bird,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coffee,
  Feather,
  Heart,
  MapPin,
  Moon,
  MoonStar,
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

const DEFAULT_COVER = "/images/templates/moonlit-garden-cover.jpg";

const GOLD = "#e9c87c";
const MIST = "#a9c4b0";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۹:۰۰",
    title: "پذیرایی در کوی باغ",
    description: "شربت گل‌بهی و پذیرایی آغازین زیر نور فانوس‌های طلایی",
    icon: "cafe",
  },
  {
    time: "۲۰:۳۰",
    title: "مراسم عقد و گلباران",
    description: "پیمان پیوند، همراه با گلبرگ‌پاشی و نوای تار و بلبل",
    icon: "heart",
  },
  {
    time: "۲۱:۳۰",
    title: "ضیافت زیر طاق ماه",
    description: "شام ایرانی در آغوش باغ، کنار عزیزترین‌هایمان",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰",
    title: "رقص و جشن تا سپیده‌دم",
    description: "شادی زیر نورپردازی ماه و ثبت یادگار شبانه",
    icon: "music",
  },
];

const PALETTE = [
  { color: "#e9c87c", label: "طلاییِ مهتاب" },
  { color: "#2e5d46", label: "سبز یشمی" },
  { color: "#f3ecd9", label: "عاجیِ یاس" },
  { color: "#d9a5b3", label: "گل‌بهی" },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const STARS = (() => {
  const rand = seeded(9301);
  return Array.from({ length: 26 }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 1.4 + rand() * 2.2,
    duration: 2.4 + rand() * 3.4,
    delay: -rand() * 6,
    bright: rand() > 0.62,
  }));
})();

const FIREFLIES = (() => {
  const rand = seeded(4058);
  return Array.from({ length: 12 }, () => ({
    left: rand() * 100,
    top: 10 + rand() * 82,
    dx: -46 + rand() * 92,
    dy: -34 + rand() * 58,
    duration: 5 + rand() * 6,
    delay: -rand() * 11,
    size: 3 + rand() * 2.6,
    peak: 0.4 + rand() * 0.5,
  }));
})();

const PETALS = (() => {
  const rand = seeded(2211);
  return Array.from({ length: 14 }, (_, i) => ({
    left: rand() * 100,
    size: 7 + rand() * 6,
    duration: 8 + rand() * 7,
    delay: -rand() * 15,
    sway: 18 + rand() * 44,
    blush: rand() > 0.55,
    far: i >= 9,
  }));
})();

const LATTICE: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent 0 7px, rgba(233,200,124,0.22) 7px 8px), repeating-linear-gradient(-45deg, transparent 0 7px, rgba(233,200,124,0.22) 7px 8px)",
};

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

function Cypress({
  x,
  scale,
  opacity = 1,
}: {
  x: number;
  scale: number;
  opacity?: number;
}) {
  return (
    <path
      transform={`translate(${x} 90) scale(${scale})`}
      d="M0 0 C-6 -12 -5 -32 0 -50 C5 -32 6 -12 0 0 Z"
      fill="#0d2315"
      opacity={opacity}
    />
  );
}

function Door({ mirrored }: { mirrored: boolean }) {
  return (
    <div className="absolute inset-0 p-3">
      <div
        className={`mt-12 h-40 w-full rounded-[14px] border border-[#e9c87c]/30 bg-[#081710]/70 ${
          mirrored ? "rounded-tr-full" : "rounded-tl-full"
        }`}
        style={LATTICE}
      />
      <div
        className="mt-3 h-16 w-full rounded-[10px] border border-[#e9c87c]/20 bg-[#081710]/60"
        style={LATTICE}
      />
      <div
        className={`absolute top-[52%] ${
          mirrored ? "left-3" : "right-3"
        } h-9 w-2.5 rounded-full bg-gradient-to-b from-[#f6e5b3] to-[#8a6f35] shadow-[0_2px_8px_rgba(0,0,0,0.55)]`}
      />
      <div
        className={`absolute inset-y-3 ${
          mirrored ? "right-3" : "left-3"
        } w-px bg-[#e9c87c]/12`}
      />
    </div>
  );
}

export function MoonlitGardenRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");
  const open = stage === "open";
  const gateOpen = stage !== "closed";

  const theme: TemplateCustomization = {
    primaryColor: "#e9c87c",
    secondaryColor: "#a9c4b0",
    backgroundColor: "#0a1410",
    poeticLine: "«بنشین بر لب جوی و گذر عمر نظر کن»",
    dressCode:
      "پوشش رسمی شب با الهام از باغ ایرانی؛ طیف سبز یشمی، طلاییِ مهتاب، عاجی و گل‌بهی.",
    blessingLine: "در باغ پیوند ما، زیباترین شکوفه، حضور شماست",
    musicTitle: "نوای بلبل و تار",
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

  const openGate = () => {
    if (stage !== "closed") return;
    setStage("opening");
    window.setTimeout(() => setStage("open"), 1500);
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden font-sans text-[#eef0e6]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--mg-gold": theme.primaryColor || GOLD,
          "--mg-mist": theme.secondaryColor || MIST,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes mg-twinkle { 0%,100% { opacity: .18; transform: scale(.72); } 50% { opacity: .95; transform: scale(1.12); } }
        @keyframes mg-drift {
          0% { transform: translate(0,0) scale(.9); opacity: 0; }
          14% { opacity: var(--mg-o,.6); }
          50% { transform: translate(var(--mg-dx,24px), var(--mg-dy,-28px)) scale(1.3); opacity: var(--mg-o,.6); }
          86% { opacity: var(--mg-o,.6); }
          100% { transform: translate(calc(var(--mg-dx,24px) * -.7), calc(var(--mg-dy,-28px) * -.5)) scale(.9); opacity: 0; }
        }
        @keyframes mg-petal {
          0% { transform: translate(0,-12px) rotate(0deg); opacity: 0; }
          10% { opacity: .9; }
          88% { opacity: .5; }
          100% { transform: translate(var(--mg-sw,30px), calc(130vh + 60px)) rotate(330deg); opacity: 0; }
        }
        @keyframes mg-glow { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: .95; transform: scale(1.05); } }
        @keyframes mg-vu { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
      `}</style>

      {/* شبِ باغ: ستاره‌ها، ماه و شب‌تاب‌ها */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {STARS.map((s, i) => (
          <span
            key={`star-${i}`}
            className="absolute rounded-full bg-[#f6ecd4]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.bright ? 0.8 : 0.35,
              boxShadow: s.bright ? "0 0 6px 1px rgba(246,236,212,.5)" : "none",
              animation: `mg-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

        {/* ماهِ طلایی */}
        <div className="absolute right-[7%] top-[26px]">
          <div
            className="relative h-20 w-20"
            style={{ animation: "mg-glow 7s ease-in-out infinite" }}
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_38%_32%,#fdf6df_0%,#f0d9a0_38%,#dcbd80_68%,#b39355_100%)] shadow-[0_0_50px_14px_rgba(233,200,124,0.3),0_0_110px_40px_rgba(233,200,124,0.12)]" />
            <span className="absolute left-[20%] top-[36%] h-3 w-3 rounded-full bg-[#00000012]" />
            <span className="absolute left-[54%] top-[20%] h-2 w-2 rounded-full bg-[#00000010]" />
            <span className="absolute left-[58%] top-[56%] h-4 w-4 rounded-full bg-[#0000000d]" />
          </div>
        </div>
        <MoonStar className="absolute left-[10%] top-[72px] h-5 w-5 text-[#e9c87c]/45" />

        {FIREFLIES.map((f, i) => (
          <span
            key={`fly-${i}`}
            className="absolute rounded-full bg-[#ffe9a3]"
            style={
              {
                left: `${f.left}%`,
                top: `${f.top}%`,
                width: f.size,
                height: f.size,
                boxShadow: "0 0 12px 3px rgba(255,233,163,.45)",
                filter: "blur(.3px)",
                "--mg-dx": `${f.dx}px`,
                "--mg-dy": `${f.dy}px`,
                "--mg-o": f.peak,
                animation: `mg-drift ${f.duration}s ease-in-out ${f.delay}s infinite`,
              } as CSSProperties
            }
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050b08]/90 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col">
        {/* سربرگ چسبان (پس از گشودن دروازه) */}
        <header
          className={`sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#e9c87c]/10 bg-[#0a1410]/80 px-4 backdrop-blur-xl transition-all duration-700 ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-full opacity-0"
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9c87c]/10 text-[color:var(--mg-gold)] ring-1 ring-[#e9c87c]/25">
            <Moon className="h-4 w-4" />
          </span>
          <div className="flex flex-col items-center">
            <span className="font-display text-xl tracking-widest text-[color:var(--mg-gold)]">
              {monogram}
            </span>
            <span className="-mt-1 text-[10px] font-medium tracking-[0.22em] text-[#a9c4b0]">
              باغ پیوند
            </span>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9c87c]/10 text-[color:var(--mg-gold)] ring-1 ring-[#e9c87c]/25">
            <Bird className="h-4 w-4" />
          </span>
        </header>

        {/* صحنه‌ی دروازه باغ */}
        <section className="relative overflow-hidden">
          {/* گلبرگ‌های یاس */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {PETALS.map((p, i) => (
              <span
                key={`petal-${i}`}
                className="absolute"
                style={{
                  left: `${p.left}%`,
                  top: 0,
                  width: p.size,
                  height: p.size * 0.72,
                  background: p.blush ? "#e3bcc2" : "#f4efdf",
                  borderRadius: "62% 38% 55% 45% / 60% 44% 56% 40%",
                  opacity: p.far ? 0.35 : 0.7,
                  filter: p.far ? "blur(1px)" : "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,.18)",
                  "--mg-sw": `${p.sway}px`,
                  animation: `mg-petal ${p.duration}s linear ${p.delay}s infinite`,
                } as CSSProperties}
              />
            ))}
          </div>

          <div className="flex flex-col items-center px-5 pb-8 pt-14 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e9c87c]/25 bg-[#e9c87c]/[0.08] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[color:var(--mg-gold)]">
              <MoonStar className="h-3.5 w-3.5" />
              دعوت‌نامه‌ی باغ مهتاب
            </span>
            <h1 className="mt-4 font-display text-3xl leading-snug text-[#f3ecd9]">
              جشن پیوندِ <span className="text-[color:var(--mg-gold)]">{couple}</span>
            </h1>
            <p className="mt-1.5 text-xs tracking-wide text-[#a9c4b0]">
              شبی مهتابی در باغِ پیوند
            </p>

            {/* دروازه */}
            <div className="relative mt-8 h-[440px] w-[290px] [perspective:1600px]">
              {/* آنچه پشت درهاست: باغ درنیاتِ مهتاب */}
              <div className="absolute inset-0 overflow-hidden rounded-t-full bg-[radial-gradient(120%_95%_at_50%_100%,#3f6e55_0%,#1d3b2a_40%,#0b1c12_78%)]">
                <div
                  className={`absolute inset-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    gateOpen
                      ? "opacity-100 brightness-110"
                      : "opacity-40 brightness-50"
                  }`}
                >
                  {/* عکس زوج در قلب باغ */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={couple}
                    className={`h-full w-full object-cover object-center transition-all duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      gateOpen
                        ? "scale-100 opacity-90 blur-0"
                        : "scale-110 opacity-40 blur-[2px]"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071009] via-[#071009]/25 to-[#0a1410]/40" />
                </div>

                {/* ستاره‌های ریز داخل طاق */}
                {STARS.slice(0, 6).map((s, i) => (
                  <span
                    key={`gate-star-${i}`}
                    className="absolute rounded-full bg-[#ffe9a3]"
                    style={{
                      left: `${18 + s.left * 0.64}%`,
                      top: `${s.top * 0.42}%`,
                      width: 2.4,
                      height: 2.4,
                      boxShadow: "0 0 8px 2px rgba(255,233,163,.6)",
                      animation: `mg-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                    }}
                  />
                ))}

                {/* نشان زوج */}
                <div
                  className={`absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 transition-all duration-1000 ${
                    gateOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e9c87c]/50 bg-[#0a1410]/70 font-display text-base tracking-widest text-[color:var(--mg-gold)] shadow-[0_0_20px_rgba(233,200,124,0.3)] backdrop-blur">
                    {monogram}
                  </span>
                  <span className="rounded-full bg-[#0a1410]/60 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#f3ecd9] backdrop-blur">
                    {data.partnerOneName} & {data.partnerTwoName}
                  </span>
                </div>
              </div>

              {/* درِ چپ */}
              <div
                className={`absolute bottom-0 left-0 top-0 z-20 w-[calc(50%-1px)] origin-left overflow-hidden rounded-tl-full border-l-[3px] border-[#e9c87c]/40 bg-[linear-gradient(180deg,#1e3d2b_0%,#12291d_55%,#0c1f14_100%)] shadow-[inset_-12px_0_20px_rgba(0,0,0,0.5)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] [backface-visibility:hidden] ${
                  gateOpen ? "[transform:rotateY(-98deg)]" : ""
                }`}
              >
                <Door mirrored={false} />
              </div>

              {/* درِ راست */}
              <div
                className={`absolute bottom-0 right-0 top-0 z-20 w-[calc(50%-1px)] origin-right overflow-hidden rounded-tr-full border-r-[3px] border-[#e9c87c]/40 bg-[linear-gradient(180deg,#1e3d2b_0%,#12291d_55%,#0c1f14_100%)] shadow-[inset_12px_0_20px_rgba(0,0,0,0.5)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] [backface-visibility:hidden] ${
                  gateOpen ? "[transform:rotateY(98deg)]" : ""
                }`}
              >
                <Door mirrored={true} />
              </div>

              {/* قاب طلایی دروازه */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-30 rounded-t-full border-[3px] border-[#e9c87c]/55 shadow-[0_0_34px_rgba(233,200,124,0.16),inset_0_0_26px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-[6px] rounded-t-full border border-[#e9c87c]/25" />
              </div>

              {/* مهر ماه */}
              <button
                type="button"
                aria-label="گشودن دروازه باغ"
                onClick={openGate}
                className={`group absolute left-1/2 top-[44%] z-40 flex h-[76px] w-[76px] -translate-x-1/2 items-center justify-center rounded-full transition-all duration-500 ${
                  gateOpen
                    ? "pointer-events-none scale-[0.4] opacity-0"
                    : "hover:scale-105 active:scale-95"
                }`}
              >
                <span
                  className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#f6e5b3]/25"
                  style={{ animationDuration: "2.6s" }}
                />
                <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_120deg,#f6e5b3,#c8a24e,#8a6f35,#c8a24e,#f6e5b3)] p-[3px] shadow-[0_12px_32px_rgba(233,200,124,0.45)]">
                  <span className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_32%,#16301f,#0a1410)]">
                    <span className="font-display text-lg font-bold leading-none tracking-widest text-[#f6e5b3]">
                      {monogram}
                    </span>
                    <Moon className="mt-1 h-3.5 w-3.5 text-[#e9c87c]/80" />
                  </span>
                </span>
              </button>
            </div>

            {/* پایه‌ی دروازه */}
            <div className="mt-0 h-2 w-[86%] rounded-b-xl bg-gradient-to-l from-[#e9c87c]/10 via-[#e9c87c]/30 to-[#e9c87c]/10" />

            {/* سروهای باغ */}
            <svg
              viewBox="0 0 360 90"
              preserveAspectRatio="none"
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full"
            >
              <rect x="0" y="84" width="360" height="6" fill="#0d2315" />
              <Cypress x={18} scale={1.15} />
              <Cypress x={38} scale={0.75} opacity={0.7} />
              <Cypress x={330} scale={1.3} />
              <Cypress x={312} scale={0.7} opacity={0.65} />
              <Cypress x={54} scale={0.55} opacity={0.5} />
              <Cypress x={292} scale={0.5} opacity={0.45} />
            </svg>

            {/* راهنمای گشودن */}
            <div
              className={`relative z-10 mt-5 flex justify-center transition-all duration-500 ${
                gateOpen
                  ? "pointer-events-none -translate-y-2 opacity-0"
                  : "opacity-100"
              }`}
            >
              <span className="flex animate-bounce items-center gap-1.5 rounded-full border border-[#e9c87c]/25 bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-[color:var(--mg-gold)] backdrop-blur">
                برای گشودن دروازه، مهر ماه را لمس کنید
                <Moon className="h-3.5 w-3.5" />
              </span>
            </div>

            {open ? (
              <div className="relative z-10 mt-5 flex animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_both] items-center justify-center gap-3">
                <a
                  href="#ceremony-details"
                  className="flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#f0d9a0,#c8a24e)] px-5 py-2.5 text-sm font-semibold text-[#221a08] shadow-[0_10px_26px_rgba(233,200,124,0.35)] transition hover:brightness-105"
                >
                  <ArrowDown className="h-4 w-4" />
                  مشاهده جزئیات جشن
                </a>
                <button
                  type="button"
                  onClick={() => setStage("closed")}
                  className="flex items-center gap-1.5 rounded-full border border-[#e9c87c]/30 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-[#c7d2c4] backdrop-blur transition hover:text-[#f3ecd9]"
                >
                  <RotateCcw className="h-4 w-4" />
                  بستن دروازه
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* نامه‌ی باغ — پس از گشودن دروازه */}
        <div
          className={`flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 translate-y-6 overflow-hidden opacity-0"
          }`}
        >
          {/* شعر و متن دعوت */}
          <section className="flex flex-col items-center px-5 pt-8 text-center">
            <div className="flex items-center gap-2 text-[color:var(--mg-gold)]">
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#e9c87c]/70" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#e9c87c]/70" />
            </div>
            <p className="mt-4 max-w-sm font-display text-[1.55rem] leading-[2.2rem] text-[color:var(--mg-gold)]">
              {theme.poeticLine}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-8 text-[#c7d2c4]">
              {data.invitationText ||
                "شما با کمال مهر و افتخار به باغ پیوند ما فراخوانده شده‌اید"}
            </p>
          </section>

          {/* موسیقی باغ */}
          {showMusic ? (
            <section className="px-5 pt-8">
              <div className="flex items-center justify-between rounded-2xl border border-[#e9c87c]/15 bg-white/[0.035] p-3.5 backdrop-blur-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f0d9a0,#b39355)] text-[#0a1410] shadow-[0_8px_22px_rgba(233,200,124,0.3)]">
                    <Bird className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#f3ecd9]">
                      {theme.musicTitle}
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e9c87c]" />
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#a9c4b0]">
                      تار و بلبل، نوازندگانِ شبِ ما
                    </p>
                  </div>
                </div>
                <div className="flex h-6 items-end gap-1 px-1">
                  {[3, 5, 4, 6, 3].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 origin-bottom rounded-full bg-[#e9c87c]/70"
                      style={{
                        height: `${h * 4}px`,
                        animation: `mg-vu ${1 + i * 0.17}s ease-in-out ${i * 0.11}s infinite`,
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
              <div className="mb-2 flex items-center gap-2 text-[color:var(--mg-gold)]">
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#e9c87c]/70" />
                <MoonStar className="h-4 w-4" />
                <span className="text-[11px] font-semibold tracking-[0.18em]">
                  تا برآمدن ماهِ پیوند
                </span>
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#e9c87c]/70" />
              </div>
              <p className="font-display text-xl text-[#f3ecd9]">{dayLabel}</p>
              {timeLabel ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#a9c4b0]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {timeLabel}
                </p>
              ) : null}
              <Countdown
                eventStartAt={data.eventStartAt!}
                className="mt-4 w-full [&_div]:rounded-xl [&_div]:border [&_div]:border-[#e9c87c]/20 [&_div]:bg-white/[0.04] [&_div]:backdrop-blur-sm [&_p:first-child]:font-display [&_p:first-child]:text-[22px] [&_p:first-child]:font-semibold [&_p:first-child]:text-[color:var(--mg-gold)] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#a9c4b0]"
              />
              {calendarHref ? (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#e9c87c]/25 bg-[#e9c87c]/[0.06] px-4 py-2 text-xs font-medium text-[color:var(--mg-gold)] transition hover:bg-[#e9c87c]/[0.12]"
                >
                  <CalendarDays className="h-4 w-4" />
                  افزودن به تقویم گوگل و اپل
                </a>
              ) : null}
            </section>
          ) : (
            <span id="ceremony-details" />
          )}

          {/* برنامه‌ی شبِ باغ */}
          <section className="px-5 pt-9">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-[color:var(--mg-gold)]">
                برنامه‌ی شبِ باغ
              </h2>
              <span className="rounded-full border border-[#e9c87c]/20 bg-[#e9c87c]/[0.07] px-2.5 py-1 text-[10px] font-semibold text-[#a9c4b0]">
                از غروب تا سپیده‌دم
              </span>
            </div>
            <div className="relative rounded-2xl border border-[#e9c87c]/15 bg-white/[0.035] p-5 backdrop-blur-sm">
              <div className="absolute bottom-6 right-[41px] top-6 w-px bg-[repeating-linear-gradient(180deg,rgba(233,200,124,0.5)_0_6px,transparent_6px_12px)]" />
              <div className="flex flex-col gap-6">
                {schedule.map((item) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <div
                      key={`${item.time}-${item.title}`}
                      className="relative z-10 flex items-start gap-4"
                    >
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e9c87c]/35 bg-[#0d2015] text-[color:var(--mg-gold)] shadow-[0_0_16px_rgba(233,200,124,0.16)]">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-sm font-semibold text-[#f3ecd9]">
                            {item.title}
                          </h3>
                          <span className="shrink-0 rounded-full bg-[#e9c87c]/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-[color:var(--mg-gold)]">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-6 text-[#a9c4b0]">
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
                <h2 className="font-display text-2xl text-[color:var(--mg-gold)]">
                  محل برگزاری
                </h2>
                {data.venueName ? (
                  <span className="text-xs font-medium text-[#a9c4b0]">
                    {data.venueName}
                  </span>
                ) : null}
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#e9c87c]/15 bg-white/[0.035] backdrop-blur-sm">
                <div className="relative flex h-40 items-end justify-start bg-[linear-gradient(140deg,#0d2315_0%,#1d3b2a_55%,#2e5d46_100%)] p-3">
                  <svg
                    viewBox="0 0 360 160"
                    preserveAspectRatio="none"
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
                  >
                    <Cypress x={300} scale={2.2} />
                    <Cypress x={280} scale={1.1} opacity={0.6} />
                    <Cypress x={40} scale={1.6} opacity={0.8} />
                    <Cypress x={20} scale={0.9} opacity={0.5} />
                    <path
                      d="M150 40 q5 -7 10 0 q5 -7 10 0"
                      fill="none"
                      stroke="#0d2315"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M120 58 q4 -6 8 0 q4 -6 8 0"
                      fill="none"
                      stroke="#0d2315"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </svg>
                  <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#0a1410]/70 px-3 py-1.5 text-[11px] font-semibold text-[color:var(--mg-gold)] ring-1 ring-[#e9c87c]/30 backdrop-blur">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.venueName || "محل مراسم"}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div>
                    {data.venueName ? (
                      <h3 className="text-sm font-semibold text-[#f3ecd9]">
                        {data.venueName}
                      </h3>
                    ) : null}
                    {data.venueAddress ? (
                      <p className="mt-1 text-xs leading-6 text-[#a9c4b0]">
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
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#e9c87c]/15 bg-[#0a1410]/50 p-2.5 text-[#f3ecd9] transition hover:border-[#e9c87c]/40 hover:bg-[#0d2015]"
                        >
                          <Navigation className="h-4 w-4 text-[color:var(--mg-gold)]" />
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
            <div className="rounded-2xl border border-[#e9c87c]/15 bg-white/[0.035] p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9c87c]/[0.12] text-[color:var(--mg-gold)] ring-1 ring-[#e9c87c]/25">
                  <MoonStar className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#f3ecd9]">
                    پوشش مهمانان (Dress Code)
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#a9c4b0]">
                    {theme.dressCode}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {PALETTE.map((s) => (
                      <span
                        key={s.label}
                        className="flex items-center gap-1.5 rounded-full bg-[#0a1410]/60 px-2.5 py-1 text-[10px] text-[#c7d2c4] ring-1 ring-white/10"
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

          {/* اعلام حضور */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 px-5 pt-9">
              <div className="relative overflow-hidden rounded-2xl border border-[#e9c87c]/25 bg-[linear-gradient(165deg,rgba(233,200,124,0.1),rgba(255,255,255,0.03))] p-5 text-center backdrop-blur-sm">
                <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#e9c87c]/15 blur-2xl" />
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#e9c87c]/40 bg-[#0a1410]/60 text-[color:var(--mg-gold)]">
                  <Feather className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl text-[color:var(--mg-gold)]">
                  اعلام حضور در باغ پیوند
                </h2>
                <p className="mt-1.5 text-xs leading-6 text-[#a9c4b0]">
                  آیا افتخارِ همراهی‌تان را در این شبِ مهتابی خواهیم داشت؟
                </p>
                {preview ? (
                  <div className="mt-4 flex flex-col gap-2.5 text-right">
                    <div className="flex w-full items-center justify-between rounded-xl border border-[#e9c87c]/40 bg-[#e9c87c]/10 p-3.5">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-[color:var(--mg-gold)]" />
                        <span className="text-sm font-semibold text-[#f3ecd9]">
                          با افتخار همراه شما هستیم
                        </span>
                      </div>
                      <span className="h-4 w-4 rounded-full border border-[#e9c87c]/60 bg-[#e9c87c]" />
                    </div>
                    <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <div className="flex items-center gap-2.5">
                        <XCircle className="h-5 w-5 text-[#a9c4b0]" />
                        <span className="text-sm font-medium text-[#c7d2c4]">
                          متأسفانه امکان حضور ندارم
                        </span>
                      </div>
                      <span className="h-4 w-4 rounded-full border border-white/25" />
                    </div>
                  </div>
                ) : (
                  <a
                    href="#rsvp"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f0d9a0,#c8a24e)] py-3.5 text-sm font-semibold text-[#221a08] shadow-[0_12px_28px_rgba(233,200,124,0.35)] transition hover:brightness-105"
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
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#e9c87c]/30 bg-[#e9c87c]/[0.07]">
              <Moon className="h-5 w-5 text-[color:var(--mg-gold)]" />
              <span className="absolute inset-0 rounded-full bg-[#e9c87c]/10 blur-md" />
            </span>
            <p className="max-w-sm font-display text-xl leading-relaxed text-[color:var(--mg-gold)]">
              {theme.blessingLine}
            </p>
            <p className="text-xs text-[#a9c4b0]">
              چشم‌انتظارِ دیدارِ روی ماهتان هستیم
            </p>
            <div className="mt-2 flex items-center gap-2 text-[#c7d2c4]">
              <span className="h-px w-8 bg-[#e9c87c]/30" />
              <Sparkles className="h-3.5 w-3.5 text-[#e9c87c]/70" />
              <span className="text-sm font-semibold">{couple}</span>
              <Sparkles className="h-3.5 w-3.5 text-[#e9c87c]/70" />
              <span className="h-px w-8 bg-[#e9c87c]/30" />
            </div>
          </footer>
        </div>
      </div>

      {/* منوی پایین */}
      {open ? (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-16 w-full max-w-md items-center justify-around border-t border-[#e9c87c]/15 bg-[#07100b]/90 px-2 backdrop-blur-xl">
          {[
            { href: "#ceremony-details", label: "جزئیات جشن", icon: MoonStar },
            { href: "#location", label: "مکان", icon: MapPin },
            { href: "#rsvp", label: "اعلام حضور", icon: Feather },
          ].map((item) => (
            <a
              key={item.href}
              href={preview ? undefined : item.href}
              className="flex min-h-[44px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[10px] font-medium text-[#a9c4b0] transition hover:text-[color:var(--mg-gold)]"
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
