"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import {
  CalendarDays,
  Clock3,
  Feather,
  Heart,
  MapPin,
  Music2,
  Navigation,
  RotateCcw,
  Sparkles,
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

const DEFAULT_COVER = "/images/templates/rose-bloom-cover.jpg";

const ROSE = "#b3123c";
const CREAM = "#fff7f5";
const GOLD = "#c9a35a";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "پذیرایی زیر نور شمع",
    description: "خوش‌آمدگویی با گلبرگ، موسیقی آرام و شربت گل‌محمدی",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "پیمان همیشگی",
    description: "لحظه‌ای که دست در دست هم، «بله» را برای همیشه می‌گوییم",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافت عشق",
    description: "شام در باغ، کنار عزیزترین‌هایمان",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "رقص اول",
    description: "اولین رقص عاشقانه‌مان و جشن تا پاسی از شب",
    icon: "music",
  },
];

const STORY = [
  { title: "اولین نگاه", text: "نگاهی که بی‌اجازه آمد و دیگر هیچ‌وقت نرفت." },
  { title: "اولین قرار", text: "یک فنجان قهوه که تا غروب طول کشید." },
  { title: "خواستگاری", text: "یک حلقه، یک دنیا اشک شوق و یک «آره» از ته دل." },
  { title: "همیشه", text: "و حالا می‌خواهیم بقیه‌ی قصه را کنار شما بنویسیم." },
];

const ROSES = [
  { color: "#b3123c", label: "سرخ" },
  { color: "#e8a0ae", label: "صورتی" },
  { color: "#f6e7dc", label: "شیری" },
  { color: "#c9a35a", label: "طلایی" },
];

const LAYERS = [
  { count: 6, offset: 0, spread: 1, size: 1, color: "outer" },
  { count: 5, offset: 36, spread: 0.85, size: 0.78, color: "mid" },
  { count: 4, offset: 45, spread: 0.7, size: 0.56, color: "inner" },
] as const;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const PETALS = (() => {
  const rand = seeded(14021405);
  return Array.from({ length: 22 }, (_, i) => ({
    left: rand() * 100,
    size: 10 + rand() * 12,
    duration: 9 + rand() * 9,
    delay: -rand() * 18,
    sway: 20 + rand() * 40,
    hue: rand() > 0.5 ? ROSE : "#e8a0ae",
    always: i < 10,
  }));
})();

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", day: "", month: "", year: "" };
  try {
    const d = new Date(iso);
    const f = (o: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...o }).format(d);
    return {
      weekday: f({ weekday: "long" }),
      day: f({ day: "numeric" }),
      month: f({ month: "long" }),
      year: f({ year: "numeric" }),
    };
  } catch {
    return { weekday: "", day: "", month: "", year: "" };
  }
}

function Rose({ progress, uid }: { progress: number; uid: string }) {
  const p = Math.min(1, Math.max(0, progress));
  const ease = 1 - Math.pow(1 - p, 3);
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-outer`} cx="50%" cy="90%" r="90%">
          <stop offset="0%" stopColor="#5a0a20" />
          <stop offset="55%" stopColor={ROSE} />
          <stop offset="100%" stopColor="#e2496b" />
        </radialGradient>
        <radialGradient id={`${uid}-mid`} cx="50%" cy="90%" r="90%">
          <stop offset="0%" stopColor="#6d0f2a" />
          <stop offset="60%" stopColor="#c81d47" />
          <stop offset="100%" stopColor="#f06a88" />
        </radialGradient>
        <radialGradient id={`${uid}-inner`} cx="50%" cy="90%" r="90%">
          <stop offset="0%" stopColor="#7a1030" />
          <stop offset="100%" stopColor="#d72d55" />
        </radialGradient>
        <linearGradient id={`${uid}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5f8f5a" />
          <stop offset="100%" stopColor="#2f5a33" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0%" stopColor="#ffd6de" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd6de" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r={60 + 40 * ease} fill={`url(#${uid}-glow)`} opacity={0.25 + 0.6 * ease} />

      <path d="M100 118 C 98 160 104 190 100 236" stroke="#3d6b3d" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path
        d="M101 178 C 124 160 150 164 162 176 C 146 190 120 192 101 178 Z"
        fill={`url(#${uid}-leaf)`}
        style={{ transformOrigin: "101px 178px", transform: `rotate(${-10 + 14 * ease}deg)`, transition: "transform 160ms linear" }}
      />
      <path
        d="M99 202 C 76 186 50 190 40 202 C 56 214 82 214 99 202 Z"
        fill={`url(#${uid}-leaf)`}
        style={{ transformOrigin: "99px 202px", transform: `rotate(${10 - 14 * ease}deg)`, transition: "transform 160ms linear" }}
      />
      <path d="M86 120 C 90 108 96 104 100 112 C 104 104 110 108 114 120 C 106 116 94 116 86 120 Z" fill="#3d6b3d" />

      {LAYERS.map((layer) => (
        <g key={layer.color}>
          {Array.from({ length: layer.count }, (_, i) => {
            const base = layer.offset + (360 / layer.count) * i;
            const signed = base > 180 ? base - 360 : base;
            const angle = signed * ease * layer.spread;
            const sx = (0.42 + 0.58 * ease) * layer.size;
            const sy = (0.78 + 0.22 * ease) * layer.size;
            return (
              <path
                key={i}
                d="M0 0 C -30 -12 -34 -56 0 -70 C 34 -56 30 -12 0 0 Z"
                fill={`url(#${uid}-${layer.color})`}
                stroke="#5a0a20"
                strokeOpacity="0.25"
                strokeWidth="0.8"
                style={{
                  transform: `translate(100px, 112px) rotate(${angle}deg) scale(${sx}, ${sy})`,
                  transition: "transform 160ms linear",
                }}
              />
            );
          })}
        </g>
      ))}

      <g style={{ transform: `translate(100px, ${92 + 14 * ease}px) scale(${0.7 + 0.5 * ease})`, transition: "transform 160ms linear" }}>
        <path d="M0 -14 C 12 -14 14 -2 6 4 C -2 10 -12 4 -10 -4 C -8 -10 0 -10 2 -4" fill="none" stroke="#5a0a20" strokeWidth="2" strokeLinecap="round" />
        <circle r="13" fill="#a3133a" opacity="0.55" />
      </g>
    </svg>
  );
}

export function RoseBloomRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = `rb${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [auto, setAuto] = useState(false);
  const [open, setOpen] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [sent, setSent] = useState(false);

  const bloomed = progress >= 100;
  const growing = (holding || auto) && !bloomed;

  const active = growing || progress > 0;

  useEffect(() => {
    if (bloomed || !active) return;
    const id = window.setInterval(() => {
      setProgress((p) => (growing ? Math.min(100, p + 3) : Math.max(0, p - 4)));
    }, 30);
    return () => window.clearInterval(id);
  }, [growing, bloomed, active]);

  useEffect(() => {
    if (!bloomed || open) return;
    const t = window.setTimeout(() => setOpen(true), 1300);
    return () => window.clearTimeout(t);
  }, [bloomed, open]);

  const reset = () => {
    setOpen(false);
    setAuto(false);
    setHolding(false);
    setProgress(0);
    setSent(false);
  };

  const theme: TemplateCustomization = {
    primaryColor: ROSE,
    secondaryColor: GOLD,
    backgroundColor: CREAM,
    poeticLine: "«هرگز نمیرد آن که دلش زنده شد به عشق، ثبت است بر جریده‌ی عالم دوام ما»",
    blessingLine:
      "عشق ما با حضور شما کامل می‌شود؛ بیایید تا این شب را با گلبرگ و لبخند به خاطره‌ای همیشگی بدل کنیم.",
    dressCode:
      "پوشش رسمی و رمانتیک؛ رنگ‌های گل رز مثل سرخ، صورتی ملایم، شیری و طلایی را دوست داریم.",
    musicTitle: "ترانه‌ی عاشقانه‌ی ما",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const parts = datePartsOf(data.eventStartAt, data.timezone);
  const timeFa = formatEventTimeRange(data.eventStartAt, data.eventEndAt, data.timezone);
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
  const ring = 2 * Math.PI * 46;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#4a1022]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes rb-fall {
          0% { transform: translate3d(0,-12vh,0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          50% { transform: translate3d(var(--sway),50vh,0) rotate(200deg); }
          100% { transform: translate3d(0,112vh,0) rotate(420deg); opacity: 0; }
        }
        @keyframes rb-beat { 0%,100% { transform: scale(1); } 15% { transform: scale(1.14); } 30% { transform: scale(1); } 45% { transform: scale(1.08); } }
        @keyframes rb-line { from { opacity: 0; transform: translateY(10px); filter: blur(3px); } to { opacity: 1; transform: none; filter: none; } }
        @keyframes rb-halo { 0%,100% { opacity: 0.35; transform: scale(0.96); } 50% { opacity: 0.8; transform: scale(1.04); } }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[radial-gradient(120%_60%_at_50%_0%,#fde8ec_0%,#fff7f5_55%,#fbeee8_100%)]">
        {/* falling petals */}
        <div className="pointer-events-none fixed inset-y-0 left-0 right-0 z-30 mx-auto max-w-md overflow-hidden" aria-hidden>
          {PETALS.filter((pt) => pt.always || open).map((pt, i) => (
            <span
              key={i}
              className="absolute top-0 block rounded-[80%_0_80%_0]"
              style={
                {
                  left: `${pt.left}%`,
                  width: pt.size,
                  height: pt.size * 0.8,
                  background: `linear-gradient(135deg, ${pt.hue}, #f7c6d0)`,
                  opacity: 0.75,
                  animation: `rb-fall ${pt.duration}s linear ${pt.delay}s infinite`,
                  "--sway": `${pt.sway}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#b3123c]/10 bg-[#fff7f5]/85 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 font-display text-sm text-[#6d0f2a]">
            <Heart className="h-4 w-4 fill-[#b3123c] text-[#b3123c]" />
            با عشق، برای تو
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a35a]/60 font-display text-xs text-[#6d0f2a]">
            {monogram}
          </span>
        </header>

        <main className="relative z-10 flex flex-col pb-28">
          {/* Hero / bloom */}
          <section className="px-6 pt-8 text-center">
            <p className="text-[11px] tracking-[0.35em] text-[#c9a35a]">✦ WITH ALL OUR LOVE ✦</p>
            <h1 className="mt-3 font-display text-[40px] leading-tight text-[#6d0f2a]">
              {data.partnerOneName}
              <span className="mx-2 inline-block text-[#b3123c]" style={{ animation: "rb-beat 1.6s ease-in-out infinite" }}>
                ♥
              </span>
              {data.partnerTwoName}
            </h1>
            <p className="mt-2 text-[13px] text-[#8a4a5a]">قصه‌ی عشق ما به فصل تازه‌ای رسیده است</p>

            <div className={`relative mx-auto transition-all duration-1000 ${open ? "mt-4 h-52 w-44" : "mt-6 h-72 w-60"}`}>
              <span
                className="absolute inset-[8%] rounded-full bg-[#ffc9d4] blur-2xl"
                style={{ animation: "rb-halo 3s ease-in-out infinite" }}
              />
              <div className="relative h-full w-full">
                <Rose progress={progress / 100} uid={uid} />
              </div>
            </div>

            {!open ? (
              <div className="mt-2 flex flex-col items-center gap-3">
                <button
                  type="button"
                  disabled={bloomed}
                  onPointerDown={(e) => {
                    try {
                      e.currentTarget.setPointerCapture(e.pointerId);
                    } catch {}
                    setHolding(true);
                  }}
                  onPointerUp={() => setHolding(false)}
                  onPointerCancel={() => setHolding(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setAuto(true);
                    }
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  className="relative flex h-24 w-24 touch-none select-none items-center justify-center rounded-full bg-white/70 shadow-[0_12px_30px_-10px_rgba(179,18,60,0.45)] backdrop-blur transition active:scale-95"
                  aria-label="برای شکفتن گل نگه دار"
                >
                  <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#f3cbd3" strokeWidth="3" />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke={ROSE}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray={ring}
                      strokeDashoffset={ring * (1 - progress / 100)}
                    />
                  </svg>
                  <Heart
                    className="h-9 w-9 fill-[#b3123c] text-[#b3123c]"
                    style={{ animation: growing ? "rb-beat 0.7s ease-in-out infinite" : "rb-beat 1.6s ease-in-out infinite" }}
                  />
                </button>
                <p className="font-display text-[15px] text-[#6d0f2a]">
                  {bloomed
                    ? "گل شکفت… نامه‌مان برای توست"
                    : growing
                      ? "نگه دار… دارد می‌شکفد"
                      : "قلب را لمس کن و نگه دار تا گل بشکفد"}
                </p>
                {!bloomed ? (
                  <button
                    type="button"
                    onClick={() => setAuto(true)}
                    className="text-[12px] text-[#8a4a5a] underline decoration-[#c9a35a]/60 underline-offset-4"
                  >
                    یا اینجا بزن تا خودش بشکفد
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Revealed content */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-12 px-5 transition-all duration-[1200ms] ease-out ${
              open
                ? "mt-6 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-12 overflow-hidden opacity-0"
            }`}
          >
            {/* Love letter */}
            <section id="letter" className="scroll-mt-20">
              <div className="relative rounded-[6px] bg-[#fffdf9] px-6 pb-8 pt-10 shadow-[0_24px_50px_-24px_rgba(109,15,42,0.45)] ring-1 ring-[#c9a35a]/25 [background-image:repeating-linear-gradient(transparent_0_31px,rgba(179,18,60,0.07)_31px_32px)]">
                <span className="absolute -top-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d8345c,#7a0f2e)] font-display text-[11px] text-[#fde8ec] shadow-lg ring-4 ring-[#fff7f5]">
                  {monogram}
                </span>

                <svg viewBox="0 0 100 92" className="mx-auto w-[64%] drop-shadow-[0_14px_20px_rgba(109,15,42,0.25)]" aria-hidden>
                  <defs>
                    <clipPath id={`${uid}-heart`}>
                      <path d="M50 90 C 20 70 0 52 0 28 C 0 12 12 0 27 0 C 38 0 46 6 50 15 C 54 6 62 0 73 0 C 88 0 100 12 100 28 C 100 52 80 70 50 90 Z" />
                    </clipPath>
                  </defs>
                  <image
                    href={cover}
                    x="0"
                    y="0"
                    width="100"
                    height="92"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#${uid}-heart)`}
                  />
                  <path
                    d="M50 90 C 20 70 0 52 0 28 C 0 12 12 0 27 0 C 38 0 46 6 50 15 C 54 6 62 0 73 0 C 88 0 100 12 100 28 C 100 52 80 70 50 90 Z"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="1.2"
                  />
                </svg>

                <p className="mt-6 font-display text-lg text-[#b3123c]">به عزیزترین مهمانمان،</p>
                {[
                  theme.poeticLine,
                  data.invitationText ||
                    "دو دل که سال‌ها به سوی هم تپیدند، حالا می‌خواهند برای همیشه یکی شوند. هیچ لحظه‌ای از این قصه بدون تو کامل نیست؛ بیا و در شیرین‌ترین شب زندگی‌مان کنارمان باش.",
                  families ? `با احترام، به همراه خانواده‌های ${families}` : null,
                ]
                  .filter(Boolean)
                  .map((line, i) => (
                    <p
                      key={i}
                      className={`mt-3 leading-8 ${i === 0 ? "font-display text-[17px] text-[#6d0f2a]" : "text-[14px] text-[#5c2b38]"}`}
                      style={{ animation: open ? `rb-line 1s ease-out ${0.4 + i * 0.5}s both` : undefined }}
                    >
                      {line}
                    </p>
                  ))}
                <div className="mt-6 flex items-end justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-[#fde8ec] px-3 py-1.5 text-[11px] text-[#6d0f2a]">
                    <Music2 className="h-3.5 w-3.5" />
                    {theme.musicTitle}
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] text-[#8a4a5a]">با تمام عشق،</p>
                    <p className="font-display text-xl text-[#b3123c]">{couple}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Date in heart */}
            <section className="text-center">
              <p className="text-[11px] tracking-[0.3em] text-[#c9a35a]">SAVE OUR DAY</p>
              <h2 className="mt-1 font-display text-2xl text-[#6d0f2a]">روزی که «بله» می‌گوییم</h2>
              <div className="relative mx-auto mt-5 w-64">
                <svg viewBox="0 0 100 92" className="w-full" aria-hidden>
                  <path
                    d="M50 90 C 20 70 0 52 0 28 C 0 12 12 0 27 0 C 38 0 46 6 50 15 C 54 6 62 0 73 0 C 88 0 100 12 100 28 C 100 52 80 70 50 90 Z"
                    fill="#fde8ec"
                    stroke={ROSE}
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pb-6">
                  <span className="text-[13px] text-[#8a4a5a]">{parts.weekday || "به‌زودی"}</span>
                  <span className="font-display text-6xl leading-none text-[#b3123c]">{parts.day || "♥"}</span>
                  <span className="mt-1 font-display text-xl text-[#6d0f2a]">
                    {parts.month} {parts.year}
                  </span>
                </div>
              </div>
              {timeFa ? (
                <p className="mt-2 flex items-center justify-center gap-1.5 text-[13px] text-[#5c2b38]">
                  <Clock3 className="h-4 w-4 text-[#c9a35a]" />
                  {timeFa}
                </p>
              ) : null}
            </section>

            {/* Love story */}
            <section id="story" className="scroll-mt-20">
              <div className="text-center">
                <p className="text-[11px] tracking-[0.3em] text-[#c9a35a]">OUR LOVE STORY</p>
                <h2 className="mt-1 font-display text-2xl text-[#6d0f2a]">قصه‌ی ما</h2>
              </div>
              <ol className="relative mt-6">
                <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-[#c9a35a]/0 via-[#c9a35a]/70 to-[#b3123c]/0" />
                {STORY.map((s, i) => (
                  <li key={s.title} className={`relative flex pb-7 last:pb-0 ${i % 2 ? "justify-end" : "justify-start"}`}>
                    <span className="absolute left-1/2 top-3 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#fff7f5] ring-1 ring-[#c9a35a]/60">
                      <Heart
                        className={`h-3.5 w-3.5 ${i === STORY.length - 1 ? "fill-[#b3123c] text-[#b3123c]" : "text-[#b3123c]"}`}
                      />
                    </span>
                    <div className={`w-[44%] rounded-2xl bg-white/80 p-3.5 shadow-[0_10px_24px_-14px_rgba(109,15,42,0.4)] ring-1 ring-[#f3cbd3] ${i % 2 ? "text-left" : ""}`}>
                      <p className="font-display text-[16px] text-[#b3123c]">{s.title}</p>
                      <p className="mt-1 text-[12px] leading-6 text-[#5c2b38]">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Countdown */}
            {showCountdown ? (
              <section className="rounded-[28px] bg-gradient-to-br from-[#6d0f2a] to-[#b3123c] p-5 text-center text-[#fde8ec] shadow-[0_20px_40px_-20px_rgba(109,15,42,0.7)]">
                <p className="text-[11px] tracking-[0.3em] text-[#f1d29a]">UNTIL FOREVER</p>
                <h2 className="mt-1 font-display text-2xl">تا همیشه‌مان</h2>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="mt-4 [&>div]:rounded-2xl [&>div]:border-[#fde8ec]/20 [&>div]:bg-white/10 [&_p:first-child]:font-display [&_p:first-child]:text-3xl [&_p:first-child]:text-white [&_p:last-child]:text-[#f1d29a]"
                />
              </section>
            ) : null}

            {/* Schedule */}
            <section id="schedule" className="scroll-mt-20">
              <div className="text-center">
                <p className="text-[11px] tracking-[0.3em] text-[#c9a35a]">THE EVENING</p>
                <h2 className="mt-1 font-display text-2xl text-[#6d0f2a]">برنامه‌ی شب عشق</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {schedule.map((item) => (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 ring-1 ring-[#f3cbd3]"
                  >
                    <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full bg-[#fde8ec] font-display text-sm text-[#b3123c] ring-1 ring-[#c9a35a]/50">
                      {item.time}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-[17px] text-[#6d0f2a]">{item.title}</p>
                      <p className="mt-0.5 text-[12px] leading-6 text-[#5c2b38]">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Venue */}
            {showMap ? (
              <section id="location" className="scroll-mt-20 rounded-[28px] bg-white/85 p-5 text-center ring-1 ring-[#f3cbd3]">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fde8ec]">
                  <MapPin className="h-5 w-5 text-[#b3123c]" />
                </span>
                <p className="mt-3 text-[11px] tracking-[0.3em] text-[#c9a35a]">WHERE OUR HEARTS MEET</p>
                <h2 className="mt-1 font-display text-2xl text-[#6d0f2a]">{data.venueName || "محل جشن"}</h2>
                {data.venueAddress ? (
                  <p className="mt-1 text-[13px] leading-6 text-[#5c2b38]">{data.venueAddress}</p>
                ) : null}
                {query ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                      { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                      { href: `https://www.google.com/maps/search/?api=1&query=${query}`, label: "گوگل" },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-full border border-[#b3123c]/25 py-2.5 text-xs text-[#6d0f2a] transition hover:bg-[#fde8ec]"
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
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-[#6d0f2a] py-2.5 text-xs text-[#fde8ec] transition hover:bg-[#b3123c]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Dress code roses */}
            <section className="text-center">
              <p className="text-[11px] tracking-[0.3em] text-[#c9a35a]">DRESS IN ROSES</p>
              <h2 className="mt-1 font-display text-2xl text-[#6d0f2a]">رنگ‌های گل رز</h2>
              <p className="mt-2 text-[13px] leading-7 text-[#5c2b38]">{theme.dressCode}</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {ROSES.map((r) => (
                  <div key={r.label} className="flex flex-col items-center gap-1.5">
                    <svg viewBox="-40 -40 80 80" className="h-14 w-14 drop-shadow-sm" aria-hidden>
                      {[0, 72, 144, 216, 288].map((a) => (
                        <ellipse key={a} cx="0" cy="-16" rx="13" ry="18" fill={r.color} stroke="#6d0f2a" strokeOpacity="0.15" transform={`rotate(${a})`} />
                      ))}
                      {[36, 108, 180, 252, 324].map((a) => (
                        <ellipse key={a} cx="0" cy="-9" rx="9" ry="12" fill={r.color} stroke="#6d0f2a" strokeOpacity="0.2" transform={`rotate(${a})`} />
                      ))}
                      <circle r="6" fill={r.color} stroke="#6d0f2a" strokeOpacity="0.3" />
                    </svg>
                    <span className="text-[11px] text-[#6d0f2a]">{r.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP */}
            {features?.rsvp !== false ? (
              <section id="rsvp" className="scroll-mt-20 rounded-[28px] bg-gradient-to-b from-[#fde8ec] to-white p-6 text-center ring-1 ring-[#f3cbd3]">
                <p className="text-[11px] tracking-[0.3em] text-[#c9a35a]">R.S.V.P</p>
                <h2 className="mt-1 font-display text-2xl text-[#6d0f2a]">قلبت را برایمان بفرست</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "با تمام وجود می‌آیم" },
                    { value: false, label: "دلم با شماست" },
                  ].map(({ value, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setAttending(value);
                        setSent(false);
                      }}
                      className={`rounded-full px-3 py-3 text-[13px] transition ${
                        attending === value
                          ? "bg-[#b3123c] text-white shadow-[0_10px_20px_-10px_rgba(179,18,60,0.8)]"
                          : "bg-white text-[#6d0f2a] ring-1 ring-[#f3cbd3]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className={`mt-3 flex items-center justify-between rounded-full bg-white px-5 py-2.5 ring-1 ring-[#f3cbd3] transition ${attending ? "" : "pointer-events-none opacity-40"}`}>
                  <span className="text-[13px] text-[#6d0f2a]">تعداد همراهان</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fde8ec] text-[#b3123c] active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-5 font-display text-xl text-[#b3123c]">{guests.toLocaleString("fa-IR")}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b3123c] text-white active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(true)}
                  className="group mx-auto mt-6 flex flex-col items-center gap-2"
                >
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${
                      sent ? "bg-[#b3123c] shadow-[0_0_0_10px_rgba(179,18,60,0.12)]" : "bg-white ring-1 ring-[#f3cbd3]"
                    }`}
                  >
                    <Heart
                      className={`h-9 w-9 transition-all duration-500 ${sent ? "scale-110 fill-white text-white" : "text-[#b3123c] group-hover:fill-[#fde8ec]"}`}
                      style={{ animation: sent ? "rb-beat 1.2s ease-in-out infinite" : undefined }}
                    />
                  </span>
                  <span className="font-display text-[15px] text-[#6d0f2a]">
                    {sent
                      ? attending
                        ? "قلبت رسید! بی‌صبرانه منتظرت هستیم ♥"
                        : "دلت رسید؛ جایت خالی خواهد بود ♥"
                      : preview
                        ? "لمس کن تا قلبت را بفرستی"
                        : "ارسال پاسخ با یک قلب"}
                  </span>
                </button>
              </section>
            ) : null}

            {/* Blessing */}
            <section className="relative overflow-hidden rounded-[28px] bg-[#6d0f2a] px-6 py-8 text-center text-[#fde8ec]">
              <Sparkles className="mx-auto h-5 w-5 text-[#f1d29a]" />
              <p className="mt-3 font-display text-lg leading-9">{theme.blessingLine}</p>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[#f1d29a]">
                <Feather className="h-3.5 w-3.5" />
                {couple}
              </p>
            </section>

            <button
              type="button"
              onClick={reset}
              className="mx-auto flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs text-[#6d0f2a] ring-1 ring-[#f3cbd3] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              دوباره گل را غنچه کن
            </button>

            <footer className="pb-4 text-center text-[11px] tracking-[0.2em] text-[#8a4a5a]">
              {couple} · تا همیشه ♥
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#b3123c]/10 bg-[#fff7f5]/90 px-2 backdrop-blur">
          {[
            { href: "#letter", label: "نامه", Icon: Feather },
            { href: "#story", label: "قصه", Icon: Heart },
            { href: "#location", label: "مکان", Icon: MapPin },
            { href: "#rsvp", label: "پاسخ", Icon: Sparkles },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (!open) {
                  setProgress(100);
                  setOpen(true);
                }
              }}
              className="flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] text-[#8a4a5a] hover:text-[#b3123c]"
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
