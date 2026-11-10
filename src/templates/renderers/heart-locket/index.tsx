"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  CalendarDays,
  Clock3,
  Gem,
  Heart,
  Lock,
  LockOpen,
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

const DEFAULT_COVER = "/images/templates/heart-locket-cover.jpg";

const ROSE_GOLD = "#e8a184";
const PLUM = "#2a0f1c";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "غروب عاشقانه",
    description: "پذیرایی با رزهای تازه، شمع‌های معطر و شربت گل",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "سفره‌ی عقد",
    description: "پیمان دو قلب، زیر نور شمع‌ها و نگاه عزیزان",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "ضیافت شام",
    description: "شام در نور چراغ‌های مخملی، کنار هم",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "رقص نخست",
    description: "نخستین رقص زوج و جشن عشق تا نیمه‌شب",
    icon: "music",
  },
];

const GEMS = [
  { color: "#5a1a33", label: "شرابی" },
  { color: ROSE_GOLD, label: "رزگلد" },
  { color: "#f7ded6", label: "پودری" },
  { color: "#c96f6a", label: "مرجانی" },
];

const HEART_100 =
  "M50 96 C20 75 0 56 0 33 C0 14 13 2 29 2 C39 2 46 8 50 17 C54 8 61 2 71 2 C87 2 100 14 100 33 C100 56 80 75 50 96 Z";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const DUST = (() => {
  const rand = seeded(7171);
  return Array.from({ length: 18 }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 1.5 + rand() * 2.5,
    duration: 2.5 + rand() * 3,
    delay: -rand() * 5,
  }));
})();

const BURST = Array.from({ length: 14 }, (_, i) => ({
  angle: (360 / 14) * i,
  delay: (i % 3) * 0.06,
}));

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

function Chain() {
  return (
    <svg viewBox="0 0 20 120" className="h-[120px] w-5" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse
          key={i}
          cx="10"
          cy={i * 13 + 7}
          rx={i % 2 ? 2.2 : 4.4}
          ry="6.4"
          fill="none"
          stroke="#e8b493"
          strokeWidth="2"
          opacity={0.55 + i * 0.05}
        />
      ))}
    </svg>
  );
}

/** نیمه‌ی فلزی قلب (برای جلد و پشت آویز) */
function MetalHeart({ uid, children, inner = false }: { uid: string; children?: ReactNode; inner?: boolean }) {
  return (
    <svg viewBox="-4 -4 108 108" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fbd9bf" />
          <stop offset="0.35" stopColor="#eaa889" />
          <stop offset="0.7" stopColor="#c98063" />
          <stop offset="1" stopColor="#9c5a44" />
        </linearGradient>
        <linearGradient id={`${uid}-inner`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4c3a6" />
          <stop offset="1" stopColor="#b36e55" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={HEART_100} />
        </clipPath>
      </defs>
      <path d={HEART_100} fill="#5c2a1f" opacity="0.55" transform="translate(2 4)" />
      <path d={HEART_100} fill={`url(#${uid}-${inner ? "inner" : "metal"})`} stroke="#ffe3cf" strokeWidth="1.2" />
      {inner ? null : (
        <path d={HEART_100} fill="none" stroke="#8f4a36" strokeOpacity="0.55" strokeWidth="0.8" strokeDasharray="2 1.6" transform="translate(8 8) scale(0.84)" />
      )}
      {children}
      <g clipPath={`url(#${uid}-clip)`} pointerEvents="none">
        <polygon
          points="-34,-4 -18,-4 -30,104 -46,104"
          fill="#fff"
          opacity="0.4"
          style={{ animation: "hl-sglint 3.8s ease-in-out infinite" }}
        />
      </g>
    </svg>
  );
}

export function HeartLocketRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = `hl${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [stage, setStage] = useState<"closed" | "unclasp" | "opening" | "open">("closed");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [locked, setLocked] = useState(false);
  const timers = useRef<number[]>([]);

  const open = stage === "open";
  const swung = stage === "opening" || stage === "open";

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const openLocket = () => {
    if (stage !== "closed") return;
    setStage("unclasp");
    timers.current.push(
      window.setTimeout(() => setStage("opening"), 450),
      window.setTimeout(() => setStage("open"), 1900),
    );
  };

  const closeLocket = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStage("closed");
    setLocked(false);
  };

  const theme: TemplateCustomization = {
    primaryColor: ROSE_GOLD,
    secondaryColor: "#c96f6a",
    backgroundColor: PLUM,
    poeticLine: "«دو قلب که به هم گره خوردند، ابدی شدند»",
    dressCode:
      "پوشش رسمی با پالت عاشقانه؛ شرابی عمیق، رزگلد، پودری و مرجانی. لطفاً از لباس کاملاً سفید پرهیز کنید.",
    blessingLine: "حضور شما، درخشان‌ترین نگین این آویز است",
    musicTitle: "نوای پیانوی عاشقانه",
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
  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#f7ded6]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes hl-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes hl-shake { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
        @keyframes hl-twinkle { 0%,100% { opacity: 0.15; transform: scale(0.7); } 50% { opacity: 0.9; transform: scale(1.2); } }
        @keyframes hl-burst { from { transform: rotate(var(--a)) translateY(0) scale(1); opacity: 1; } to { transform: rotate(var(--a)) translateY(-120px) scale(0.2); opacity: 0; } }
        @keyframes hl-beat { 0%,100% { transform: scale(1); } 14% { transform: scale(1.18); } 28% { transform: scale(1); } 42% { transform: scale(1.1); } }
        @keyframes hl-ecg { from { stroke-dashoffset: 300; } to { stroke-dashoffset: 0; } }
        @keyframes hl-halo { 0%,100% { opacity: 0.45; } 50% { opacity: 0.9; } }
        @keyframes hl-sglint { 0% { transform: translateX(0); } 55%,100% { transform: translateX(180px); } }
        @keyframes hl-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hl-spin { to { transform: rotate(360deg); } }
        @keyframes hl-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[radial-gradient(130%_70%_at_50%_0%,#5a1a33_0%,#3a1224_45%,#2a0f1c_100%)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {DUST.map((d, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-[#ffd9c4]"
              style={{
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: d.size,
                height: d.size,
                boxShadow: "0 0 6px rgba(255,217,196,0.6)",
                animation: `hl-twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
              }}
            />
          ))}
        </div>

        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#e8a184]/15 bg-[#2a0f1c]/85 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 font-display text-sm text-[#f2c3a4]">
            <Gem className="h-4 w-4" />
            آویز دل
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8a184]/50 font-display text-[11px] text-[#f2c3a4]">
            {monogram}
          </span>
        </header>

        <main className="relative z-10 flex flex-col pb-28">
          <section className="px-6 pt-7 text-center">
            <p className="text-[11px] tracking-[0.3em] text-[#e8a184]">✦ دعوت‌نامه‌ی عشق ✦</p>
            <h1 className="mt-2 font-display text-[38px] leading-tight text-[#fbe6dc]">
              {data.partnerOneName}
              <span className="mx-2 text-[#e8a184]">&</span>
              {data.partnerTwoName}
            </h1>
            <p className="mt-1 text-[12px] text-[#d9b5aa]">قلب‌مان را برای شما گشوده‌ایم</p>
          </section>

          {/* Locket stage */}
          <section className="relative mt-2 flex flex-col items-center">
            <div
              className={`flex flex-col items-center transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                swung ? "translate-x-[46px]" : "translate-x-0"
              }`}
            >
            <Chain />
            <div
              className="relative -mt-1 origin-top"
              style={{
                animation:
                  stage === "closed"
                    ? "hl-sway 4.2s ease-in-out infinite"
                    : stage === "unclasp"
                      ? "hl-shake 0.45s ease-in-out"
                      : open
                        ? "hl-float 5s ease-in-out infinite"
                        : undefined,
              }}
            >
              <span className="mx-auto block h-4 w-4 rounded-full border-[3px] border-[#e8b493]" aria-hidden />

              <div
                className={`relative transition-[width,height] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  swung ? "h-[236px] w-[240px]" : "h-[184px] w-[188px]"
                }`}
              >
                <span
                  className="pointer-events-none absolute -inset-10 rounded-full bg-[#ffb59a]/25 blur-3xl"
                  style={{ animation: swung ? "hl-halo 2.4s ease-in-out infinite" : undefined, opacity: swung ? 1 : 0.35 }}
                  aria-hidden
                />
                {swung ? (
                  <svg
                    viewBox="0 0 100 100"
                    className="pointer-events-none absolute -inset-7 h-[calc(100%+3.5rem)] w-[calc(100%+3.5rem)] opacity-60"
                    style={{ animation: "hl-spin 40s linear infinite" }}
                    aria-hidden
                  >
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#f6cba8" strokeWidth="0.35" strokeDasharray="0.6 3.2" strokeLinecap="round" />
                  </svg>
                ) : null}

                {/* back half: photo */}
                <div className="absolute inset-0" role="img" aria-label={couple}>
                  <MetalHeart uid={`${uid}-b`} inner>
                    <defs>
                      <clipPath id={`${uid}-photo`}>
                        <path d={HEART_100} transform="translate(9 9) scale(0.82)" />
                      </clipPath>
                      <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#fff1e4" />
                        <stop offset="0.5" stopColor="#e8a184" />
                        <stop offset="1" stopColor="#8f4a36" />
                      </linearGradient>
                      <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#ffe8d8" stopOpacity="0.18" />
                        <stop offset="0.55" stopColor="#ffe8d8" stopOpacity="0" />
                        <stop offset="1" stopColor="#5a1a33" stopOpacity="0.35" />
                      </linearGradient>
                    </defs>
                    <g clipPath={`url(#${uid}-photo)`}>
                      <rect x="0" y="0" width="100" height="100" fill="#3a1224" />
                      <image href={cover} x="9" y="8" width="82" height="84" preserveAspectRatio="xMidYMin slice" />
                      <rect x="0" y="0" width="100" height="100" fill={`url(#${uid}-shade)`} />
                    </g>
                    <path d={HEART_100} transform="translate(9 9) scale(0.82)" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="3.4" />
                    <path d={HEART_100} transform="translate(9 9) scale(0.82)" fill="none" stroke="#fff6ee" strokeOpacity="0.6" strokeWidth="0.7" />
                  </MetalHeart>
                </div>

                  {/* burst */}
                  {swung ? (
                    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
                      {BURST.map((b, i) => (
                        <span
                          key={i}
                          className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#ffd9c4] shadow-[0_0_8px_#ffd9c4]"
                          style={
                            {
                              "--a": `${b.angle}deg`,
                              animation: `hl-burst 1.1s ease-out ${b.delay}s both`,
                            } as CSSProperties
                          }
                        />
                      ))}
                    </div>
                  ) : null}

                  {/* front cover hinged on the left */}
                  <span
                    className="absolute left-[3.5%] top-[31%] z-10 h-8 w-2 -translate-x-1/2 rounded-full border border-[#7a3f2e]/60 bg-[linear-gradient(90deg,#9c5a44,#fbd9bf,#c98063)]"
                    aria-hidden
                  />
                  <div
                    className={`absolute inset-0 origin-[3.5%_50%] transition-transform duration-[1300ms] ease-[cubic-bezier(0.3,0.8,0.25,1)] [transform-style:preserve-3d] ${
                      swung ? "pointer-events-none" : ""
                    }`}
                    style={{ transform: swung ? "perspective(1000px) rotateY(-115deg)" : "perspective(1000px) rotateY(0deg)" }}
                  >
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <MetalHeart uid={`${uid}-i`} inner>
                        <path d={HEART_100} transform="translate(9 9) scale(0.82)" fill="none" stroke="#8f4a36" strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="2 1.6" />
                        <text x="50" y="36" textAnchor="middle" fill="#7a3a28" fontSize="7" className="font-display">
                          تا همیشه
                        </text>
                        <text x="50" y="51" textAnchor="middle" fill="#5a2418" fontSize="12" fontWeight="700" className="font-display">
                          {couple}
                        </text>
                        <text x="50" y="64" textAnchor="middle" fill="#7a3a28" fontSize="6">
                          {parts.day ? `${parts.day} ${parts.month} ${parts.year}` : "روز پیوند"}
                        </text>
                      </MetalHeart>
                    </div>
                    <button
                      type="button"
                      onClick={openLocket}
                      disabled={stage !== "closed"}
                      aria-label="گشودن آویز قلب"
                      className="absolute inset-0 cursor-pointer [backface-visibility:hidden] disabled:cursor-default"
                    >
                      <MetalHeart uid={`${uid}-f`}>
                        <text
                          x="50"
                          y="46"
                          textAnchor="middle"
                          fill="#7a3a28"
                          fontSize="18"
                          fontWeight="700"
                          className="font-display"
                        >
                          {monogram}
                        </text>
                        <path
                          d="M30 60 C 38 54 44 62 50 58 C 56 62 62 54 70 60"
                          fill="none"
                          stroke="#8f4a36"
                          strokeWidth="1"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                        <path d={HEART_100} transform="translate(44.5 65) scale(0.11)" fill="#fff0e6" stroke="#b36e55" strokeWidth="6" />
                        <rect x="96" y="40" width="5" height="12" rx="2" fill="#c98063" stroke="#7a3f2e" strokeWidth="0.8" />
                      </MetalHeart>
                    </button>
                  </div>
              </div>
            </div>
            </div>

            {open ? (
              <div className="mt-7 flex flex-col items-center text-center" style={{ animation: "hl-rise 0.9s ease-out both" }}>
                <div className="relative rounded-full border border-[#fff1e4]/60 bg-[linear-gradient(135deg,#f9d8bd,#d48d70_55%,#b36e55)] px-7 py-2 shadow-[0_10px_26px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.6)]">
                  <span className="absolute inset-1 rounded-full border border-dashed border-[#7a3a28]/40" aria-hidden />
                  <p className="text-[10px] tracking-[0.4em] text-[#6a2f20]">تا همیشه</p>
                  <p className="font-display text-[18px] leading-7 text-[#3c130d]">{couple}</p>
                </div>
                {parts.day ? (
                  <p className="mt-3 text-[12px] tracking-wide text-[#f2c3a4]">
                    {`${parts.weekday}، ${parts.day} ${parts.month} ${parts.year}`}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-2 text-center">
                {stage === "closed" ? (
                  <button
                    type="button"
                    onClick={openLocket}
                    className="flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f6cba8,#c97d63)] px-6 py-3 text-sm font-bold text-[#3c130d] shadow-[0_12px_30px_rgba(232,161,132,0.4)] transition hover:brightness-105 active:scale-95"
                  >
                    <LockOpen className="h-4 w-4" />
                    آویز را باز کن
                  </button>
                ) : (
                  <p className="font-display text-[15px] text-[#f2c3a4]">
                    {stage === "unclasp" ? "تَق… قفل آویز باز شد" : "قلب‌مان گشوده شد…"}
                  </p>
                )}
                {stage === "closed" ? (
                  <p className="text-[11px] text-[#d9b5aa]">یا روی آویز قلب بزن</p>
                ) : null}
              </div>
            )}
          </section>

          {/* Revealed content */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-12 px-5 transition-all duration-1000 ease-out ${
              open
                ? "mt-10 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            {/* Letter */}
            <section id="letter" className="scroll-mt-20 text-center">
              <svg viewBox="0 0 220 40" className="mx-auto h-8 w-52 text-[#e8a184]" aria-hidden>
                <path
                  d="M0 22 H60 L70 8 L82 34 L92 22 H128 L136 15 L144 28 L150 22 H220"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="300"
                  style={{ animation: open ? "hl-ecg 2.4s linear infinite" : undefined }}
                />
              </svg>
              <p className="mt-4 font-display text-[22px] leading-10 text-[#f2c3a4]">{theme.poeticLine}</p>
              <p className="mx-auto mt-3 max-w-sm text-[13px] leading-8 text-[#e6c7bd]">
                {data.invitationText ||
                  "با کمال مهر و افتخار، شما را به جشن پیوند قلب‌هایمان دعوت می‌کنیم؛ شبی که بی حضور شما کامل نخواهد شد."}
              </p>
              {families ? <p className="mt-3 text-[12px] text-[#d9b5aa]">به همراه خانواده‌های {families}</p> : null}
            </section>

            {/* Engraved date */}
            <section className="relative overflow-hidden rounded-[28px] border border-[#e8a184]/30 bg-[linear-gradient(160deg,rgba(246,203,168,0.16),rgba(255,255,255,0.03))] p-6 text-center">
              <p className="text-[11px] tracking-[0.3em] text-[#e8a184]">حک‌شده در قلب ما</p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="text-left">
                  <p className="text-[13px] text-[#d9b5aa]">{parts.weekday}</p>
                  <p className="font-display text-xl text-[#fbe6dc]">{parts.month}</p>
                </div>
                <span className="relative flex h-24 w-24 items-center justify-center">
                  <svg viewBox="-4 -4 108 108" className="absolute inset-0 h-full w-full" aria-hidden>
                    <path d={HEART_100} fill="none" stroke="#e8a184" strokeWidth="2" />
                  </svg>
                  <span className="relative -mt-2 font-display text-4xl text-[#f6cba8]">{parts.day || "♥"}</span>
                </span>
                <div className="text-right">
                  <p className="text-[13px] text-[#d9b5aa]">سال</p>
                  <p className="font-display text-xl text-[#fbe6dc]">{parts.year}</p>
                </div>
              </div>
              {timeFa ? (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-[#e6c7bd]">
                  <Clock3 className="h-4 w-4 text-[#e8a184]" />
                  {timeFa}
                </p>
              ) : null}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#d9b5aa]">
                <Music2 className="h-3.5 w-3.5" />
                {theme.musicTitle}
              </p>
            </section>

            {/* Countdown */}
            {showCountdown ? (
              <section className="text-center">
                <p className="text-[11px] tracking-[0.3em] text-[#e8a184]">تا پیوند دو قلب</p>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="mt-3 [&>div]:rounded-2xl [&>div]:border-[#e8a184]/25 [&>div]:bg-white/[0.05] [&_p:first-child]:font-display [&_p:first-child]:text-3xl [&_p:first-child]:text-[#f6cba8] [&_p:last-child]:text-[#d9b5aa]"
                />
                {calendarHref ? (
                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#e8a184]/30 px-4 py-2 text-xs text-[#f2c3a4] transition hover:bg-[#e8a184]/10"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Schedule */}
            <section id="schedule" className="scroll-mt-20">
              <h2 className="text-center font-display text-2xl text-[#f2c3a4]">برنامه‌ی شب عشق</h2>
              <ol className="relative mt-5 space-y-4 pr-7">
                <span className="absolute bottom-3 right-[11px] top-3 w-px bg-gradient-to-b from-[#e8a184]/0 via-[#e8a184]/60 to-[#e8a184]/0" />
                {schedule.map((item, i) => (
                  <li key={`${item.time}-${item.title}`} className="relative">
                    <span className="absolute -right-7 top-3 h-6 w-6 text-[#e8a184]" style={{ animation: `hl-beat 1.8s ease-in-out ${i * 0.3}s infinite` }}>
                      <svg viewBox="-4 -4 108 108" className="h-full w-full" aria-hidden>
                        <path d={HEART_100} fill="currentColor" />
                      </svg>
                    </span>
                    <div className="rounded-2xl border border-[#e8a184]/15 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-[17px] text-[#fbe6dc]">{item.title}</p>
                        <span className="shrink-0 rounded-full bg-[#e8a184]/15 px-2.5 py-0.5 text-[12px] text-[#f2c3a4]">{item.time}</span>
                      </div>
                      <p className="mt-1 text-[12px] leading-6 text-[#d9b5aa]">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Venue */}
            {showMap ? (
              <section id="location" className="scroll-mt-20 rounded-[28px] border border-[#e8a184]/20 bg-white/[0.04] p-5 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8a184]/15">
                  <MapPin className="h-5 w-5 text-[#f2c3a4]" />
                </span>
                <h2 className="mt-3 font-display text-2xl text-[#fbe6dc]">{data.venueName || "محل جشن"}</h2>
                {data.venueAddress ? <p className="mt-1 text-[12px] leading-6 text-[#d9b5aa]">{data.venueAddress}</p> : null}
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
                        className="flex items-center justify-center gap-1 rounded-full border border-[#e8a184]/30 py-2.5 text-xs text-[#f7ded6] transition hover:bg-[#e8a184]/10"
                      >
                        <Navigation className="h-3.5 w-3.5 text-[#e8a184]" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Dress code gems */}
            <section className="text-center">
              <h2 className="font-display text-2xl text-[#f2c3a4]">نگین‌های شب</h2>
              <p className="mt-2 text-[13px] leading-7 text-[#d9b5aa]">{theme.dressCode}</p>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {GEMS.map((g) => (
                  <div key={g.label} className="flex flex-col items-center gap-2">
                    <span
                      className="relative h-14 w-14 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.7)]"
                      style={{
                        backgroundColor: g.color,
                        clipPath: "polygon(50% 0, 100% 35%, 80% 100%, 20% 100%, 0 35%)",
                      }}
                    >
                      <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),transparent_45%,rgba(0,0,0,0.25))]" />
                    </span>
                    <span className="text-[11px] text-[#e6c7bd]">{g.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP heart padlock */}
            {features?.rsvp !== false ? (
              <section id="rsvp" className="scroll-mt-20 rounded-[28px] border border-[#e8a184]/30 bg-[linear-gradient(165deg,rgba(232,161,132,0.14),rgba(255,255,255,0.03))] p-6 text-center">
                <h2 className="font-display text-2xl text-[#f2c3a4]">جایت را در قلب ما قفل کن</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "با افتخار می‌آیم" },
                    { value: false, label: "دلم با شماست" },
                  ].map(({ value, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setAttending(value);
                        setLocked(false);
                      }}
                      className={`rounded-full py-3 text-[13px] transition ${
                        attending === value
                          ? "bg-[linear-gradient(135deg,#f6cba8,#c97d63)] font-bold text-[#3c130d]"
                          : "border border-[#e8a184]/30 text-[#e6c7bd]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className={`mt-3 flex items-center justify-between rounded-full border border-[#e8a184]/25 px-5 py-2.5 transition ${attending ? "" : "pointer-events-none opacity-40"}`}>
                  <span className="text-[13px] text-[#e6c7bd]">تعداد همراهان</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8a184]/40 active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-5 font-display text-xl text-[#f6cba8]">{guests.toLocaleString("fa-IR")}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8a184] text-[#3c130d] active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLocked(true)}
                  className="mx-auto mt-6 flex flex-col items-center gap-2"
                  aria-label="قفل کردن و فرستادن پاسخ"
                >
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 ${
                      locked
                        ? "bg-[linear-gradient(135deg,#f6cba8,#c97d63)] text-[#3c130d] shadow-[0_0_0_10px_rgba(232,161,132,0.15)]"
                        : "border border-[#e8a184]/40 text-[#f2c3a4]"
                    }`}
                    style={{ animation: locked ? "hl-beat 1.6s ease-in-out infinite" : undefined }}
                  >
                    {locked ? <Lock className="h-8 w-8" /> : <LockOpen className="h-8 w-8" />}
                  </span>
                  <span className="font-display text-[15px] text-[#fbe6dc]">
                    {locked
                      ? attending
                        ? "قفل شد! جایت در قلب ما محفوظ است ♥"
                        : "دلت را نگه داشتیم؛ جایت خالی می‌ماند"
                      : preview
                        ? "لمس کن تا قفل شود"
                        : "قفل کن و پاسخت را بفرست"}
                  </span>
                </button>
              </section>
            ) : null}

            {/* Blessing */}
            <section className="text-center">
              <Sparkles className="mx-auto h-5 w-5 text-[#e8a184]" />
              <p className="mt-3 font-display text-xl leading-9 text-[#f2c3a4]">{theme.blessingLine}</p>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[#d9b5aa]">
                <Heart className="h-3.5 w-3.5 fill-[#e8a184] text-[#e8a184]" />
                {couple}
              </p>
            </section>

            <button
              type="button"
              onClick={closeLocket}
              className="mx-auto flex items-center gap-1.5 rounded-full border border-[#e8a184]/40 px-4 py-2 text-xs text-[#f2c3a4] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              بستن آویز
            </button>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#e8a184]/15 bg-[#2a0f1c]/92 px-2 backdrop-blur">
          {[
            { href: "#letter", label: "آویز", Icon: Gem },
            { href: "#schedule", label: "برنامه", Icon: Clock3 },
            { href: "#location", label: "مکان", Icon: MapPin },
            { href: "#rsvp", label: "قلب شما", Icon: Heart },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (!open) {
                  timers.current.forEach((t) => window.clearTimeout(t));
                  timers.current = [];
                  setStage("open");
                }
              }}
              className="flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] text-[#d9b5aa] hover:text-[#f2c3a4]"
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
