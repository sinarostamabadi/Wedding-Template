"use client";

import { useId, useState, type CSSProperties } from "react";
import {
  CalendarCheck,
  CalendarDays,
  Check,
  Clock,
  Gift,
  Heart,
  MailOpen,
  MapPin,
  Music2,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Shirt,
  UserCheck,
  X,
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

const DEFAULT_COVER = "/images/templates/turquoise-tile-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "خوشامدگویی در باغ",
    description: "شربت بیدمشک و گلاب، شیرینی‌های سنتی و نوای سه‌تار زیر سایه‌ی سروها",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "آیین عقد کنار سفره‌ی آینه",
    description: "خطبه‌ی عقد در ایوان کاشی، با شمعدان نقره و سفره‌ی ترمه",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافت شام",
    description: "منوی اصیل ایرانی در کنار حوض فیروزه‌ای و نورپردازی فانوس‌ها",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "جشن و پایکوبی",
    description: "برش کیک، رقص زوج و شادمانی تا پاسی از شب",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#1f7a7a", label: "فیروزه‌ای" },
  { color: "#c9a24e", label: "طلایی" },
  { color: "#f3ead8", label: "عاجی" },
  { color: "#1d3f6e", label: "لاجوردی" },
];

const PETALS = [
  { left: 6, delay: 0, size: 10, dur: 6.5 },
  { left: 16, delay: 1.2, size: 8, dur: 7.5 },
  { left: 27, delay: 0.4, size: 12, dur: 6 },
  { left: 38, delay: 2.1, size: 9, dur: 8 },
  { left: 49, delay: 0.8, size: 11, dur: 7 },
  { left: 60, delay: 1.7, size: 8, dur: 6.8 },
  { left: 71, delay: 0.2, size: 12, dur: 7.8 },
  { left: 82, delay: 2.6, size: 9, dur: 6.4 },
  { left: 92, delay: 1, size: 10, dur: 7.2 },
];

/** Eight-pointed Persian star (khatam) */
function Star8({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <rect x="20" y="20" width="60" height="60" fill="currentColor" />
      <rect
        x="20"
        y="20"
        width="60"
        height="60"
        fill="currentColor"
        transform="rotate(45 50 50)"
      />
    </svg>
  );
}

function TilePattern({
  id,
  color,
  opacity = 0.18,
  size = 36,
}: {
  id: string;
  color: string;
  opacity?: number;
  size?: number;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g opacity={opacity} fill="none" stroke={color} strokeWidth="1">
            <rect
              x={size * 0.25}
              y={size * 0.25}
              width={size * 0.5}
              height={size * 0.5}
            />
            <rect
              x={size * 0.25}
              y={size * 0.25}
              width={size * 0.5}
              height={size * 0.5}
              transform={`rotate(45 ${size / 2} ${size / 2})`}
            />
            <circle cx={size / 2} cy={size / 2} r={size * 0.08} fill={color} />
            <path
              d={`M0 0 L${size * 0.15} 0 M0 0 L0 ${size * 0.15} M${size} ${size} L${size * 0.85} ${size} M${size} ${size} L${size} ${size * 0.85}`}
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="h-px w-10 bg-gradient-to-l from-[#c9a24e] to-transparent" />
      <Star8 className="h-2.5 w-2.5 text-[#c9a24e]" />
      <Star8 className="h-3.5 w-3.5 text-[#1f7a7a]" />
      <Star8 className="h-2.5 w-2.5 text-[#c9a24e]" />
      <span className="h-px w-10 bg-gradient-to-r from-[#c9a24e] to-transparent" />
    </div>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-5 text-center">
      <span className="text-[11px] tracking-[0.25em] text-[#1f7a7a]">
        {kicker}
      </span>
      <h3 className="mt-1 font-display text-2xl text-[#0f3d3f]">{title}</h3>
      <Ornament className="mt-2" />
    </div>
  );
}

function dateParts(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", date: "" };
  try {
    const d = new Date(iso);
    return {
      weekday: new Intl.DateTimeFormat("fa-IR", { timeZone, weekday: "long" }).format(d),
      date: new Intl.DateTimeFormat("fa-IR", {
        timeZone,
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d),
    };
  } catch {
    return { weekday: "", date: "" };
  }
}

const paper =
  "rounded-[22px] border border-[#c9a24e]/30 bg-[#fffdf8] shadow-[0_18px_40px_-18px_rgba(15,61,63,0.35)]";

export function TurquoiseTileRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = useId().replace(/:/g, "");
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");
  const [playing, setPlaying] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const open = stage === "open";
  const sealed = stage === "closed";
  const openEnvelope = () => {
    if (stage !== "closed") return;
    setStage("opening");
    window.setTimeout(() => setStage("open"), 700);
  };

  const theme: TemplateCustomization = {
    primaryColor: "#1f7a7a",
    secondaryColor: "#c9a24e",
    backgroundColor: "#f6f1e7",
    poeticLine:
      "«ما ز آغاز و ز انجام جهان بی‌خبریم، اول و آخر این کهنه کتاب افتاده‌ست»",
    blessingLine:
      "حضور گرمتان زیباترین هدیه است؛ دلمان می‌خواهد این شب را با شما جشن بگیریم.",
    dressCode:
      "پوشش رسمی و شیک با الهام از رنگ‌های کاشی ایرانی؛ فیروزه‌ای، طلایی، عاجی و لاجوردی.",
    musicTitle: "نوای سه‌تار باغ فیروزه",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const dayFa = formatEventDay(data.eventStartAt, data.timezone);
  const parts = dateParts(data.eventStartAt, data.timezone);
  const timeFa = formatEventTimeRange(
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
  const showMusic = features?.music !== false;
  const showMap =
    features?.map !== false &&
    !!(data.venueName || data.venueAddress || data.mapUrl);
  const query = encodeURIComponent(
    data.mapUrl ||
      [data.venueName, data.venueAddress].filter(Boolean).join(" ") ||
      "",
  );

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#2b2b28]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes tt-fall {
          0% { transform: translate3d(0,-20px,0) rotate(0deg); opacity: 0; }
          10% { opacity: .9; }
          100% { transform: translate3d(18px,560px,0) rotate(220deg); opacity: 0; }
        }
        @keyframes tt-glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,162,78,.45), 0 10px 24px rgba(15,61,63,.35); }
          50% { box-shadow: 0 0 0 10px rgba(201,162,78,0), 0 10px 24px rgba(15,61,63,.35); }
        }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#f6f1e7]">
        <TilePattern id={`tt-bg-${uid}`} color="#1f7a7a" opacity={0.07} size={44} />

        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#c9a24e]/25 bg-[#f6f1e7]/85 px-4 backdrop-blur-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f7a7a]/20 text-[#1f7a7a]">
            <Music2 className="h-[18px] w-[18px]" />
          </span>
          <div className="flex flex-col items-center leading-none">
            <span className="font-display text-xl text-[#0f3d3f]">{monogram}</span>
            <span
              dir="ltr"
              className="mt-1 text-[9px] uppercase tracking-[0.35em] text-[#c9a24e]"
            >
              Turquoise Garden
            </span>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f7a7a]/20 text-[#1f7a7a]">
            <Share2 className="h-[18px] w-[18px]" />
          </span>
        </header>

        <main className="relative flex flex-col pb-28">
          {/* Hero */}
          <section className="flex flex-col items-center px-6 pt-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24e]/40 bg-white/60 px-4 py-1 text-[11px] tracking-[0.2em] text-[#8a6a2a]">
              <Star8 className="h-2.5 w-2.5 text-[#1f7a7a]" />
              به نام خداوند مهر و پیوند
              <Star8 className="h-2.5 w-2.5 text-[#1f7a7a]" />
            </span>
            <h1 className="mt-4 font-display text-[30px] leading-[1.4] text-[#0f3d3f]">
              دعوت به جشن پیوند
            </h1>
            <p
              dir="ltr"
              className="mt-1 text-[11px] uppercase tracking-[0.35em] text-[#1f7a7a]/80"
            >
              {data.partnerOneName} &amp; {data.partnerTwoName}
            </p>
          </section>

          {/* Envelope */}
          <section className="relative px-5 pt-8">
            <div
              className={`transition-all duration-700 ease-in-out ${
                open
                  ? "pointer-events-none max-h-0 scale-90 overflow-hidden opacity-0"
                  : "max-h-[460px] scale-100 opacity-100"
              }`}
            >
              <div className="relative mx-auto aspect-[4/3] w-full [perspective:1200px]">
                <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f7a7a] via-[#17696a] to-[#0f4c4f] shadow-[0_26px_50px_-18px_rgba(15,61,63,0.7)]">
                  <TilePattern
                    id={`tt-env-${uid}`}
                    color="#e3c27a"
                    opacity={0.35}
                    size={32}
                  />
                  <div className="absolute inset-2.5 rounded-xl border border-[#e3c27a]/50" />
                  <div className="absolute inset-4 rounded-lg border border-dashed border-[#e3c27a]/25" />
                </div>

                <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-[#155f60]/90 [clip-path:polygon(0_0,100%_52%,0_100%)]" />
                  <div className="absolute inset-y-0 right-0 w-1/2 bg-[#176a6b]/90 [clip-path:polygon(100%_0,0_52%,100%_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-[#0f4c4f] to-[#156263] [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-[56%] [clip-path:polygon(0_100%,50%_0,100%_100%)]">
                    <TilePattern
                      id={`tt-pocket-${uid}`}
                      color="#e3c27a"
                      opacity={0.22}
                      size={28}
                    />
                  </div>
                </div>

                <div
                  className={`absolute inset-x-0 top-0 z-30 h-[58%] origin-top transition-all duration-700 ease-in-out ${
                    sealed ? "" : "opacity-0 [transform:rotateX(-115deg)]"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#238383] to-[#145d5e] shadow-xl [clip-path:polygon(0_0,100%_0,50%_100%)]" />
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden
                  >
                    <polyline
                      points="4,3 50,94 96,3"
                      fill="none"
                      stroke="#e3c27a"
                      strokeOpacity="0.7"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>

                <button
                  type="button"
                  aria-label="گشودن پاکت دعوت"
                  onClick={openEnvelope}
                  className={`absolute left-1/2 top-[58%] z-40 flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-500 hover:scale-105 active:scale-95 ${
                    sealed ? "" : "pointer-events-none scale-50 opacity-0"
                  }`}
                  style={{ animation: sealed ? "tt-glow 2.4s ease-in-out infinite" : undefined }}
                >
                  <Star8 className="absolute inset-0 h-full w-full text-[#c9a24e] drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]" />
                  <span className="relative flex h-12 w-12 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#f3dc9e] via-[#c9a24e] to-[#8a6a2a] shadow-inner ring-2 ring-[#fff3cf]/60">
                    <span className="font-display text-[15px] font-bold leading-none text-[#3a2a08]">
                      {monogram}
                    </span>
                  </span>
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={openEnvelope}
                  className="flex items-center gap-2 rounded-full bg-[#0f3d3f] px-6 py-3 text-sm font-medium text-[#f6f1e7] shadow-[0_10px_24px_-8px_rgba(15,61,63,0.6)] transition hover:bg-[#1f7a7a] active:scale-95"
                >
                  <MailOpen className="h-4 w-4 text-[#e3c27a]" />
                  گشودن دعوت‌نامه
                </button>
                <span className="text-[11px] text-[#5d6b68]">
                  مهر طلایی را لمس کنید
                </span>
              </div>
            </div>

            {/* Card — hidden until the envelope is opened */}
            <div
              inert={!open}
              aria-hidden={!open}
              className={`relative transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                open
                  ? "max-h-[1400px] translate-y-0 scale-100 opacity-100"
                  : "invisible max-h-0 translate-y-12 scale-95 overflow-hidden opacity-0"
              }`}
            >
              {open ? (
                <div className="pointer-events-none absolute inset-x-0 -top-6 z-20 h-[560px] overflow-hidden">
                  {PETALS.map((p, i) => (
                    <Star8
                      key={i}
                      className={`absolute top-0 ${
                        i % 2 ? "text-[#c9a24e]" : "text-[#1f7a7a]/70"
                      }`}
                      style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size,
                        animation: `tt-fall ${p.dur}s linear ${p.delay}s 2 both`,
                      }}
                    />
                  ))}
                </div>
              ) : null}

              <div className={`relative overflow-hidden p-3 ${paper}`}>
                <div className="rounded-[16px] border border-[#c9a24e]/45 p-1">
                  <div className="relative overflow-hidden rounded-[13px] border border-[#c9a24e]/25 bg-[#fffdf8] px-5 pb-6 pt-5">
                    <div className="absolute inset-x-0 top-0 h-9 overflow-hidden bg-[#1f7a7a]">
                      <TilePattern
                        id={`tt-band-${uid}`}
                        color="#f3dc9e"
                        opacity={0.55}
                        size={18}
                      />
                    </div>
                    <div className="absolute inset-x-0 top-9 h-px bg-[#c9a24e]" />

                    <div className="relative mx-auto mt-6 w-[78%]">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-md border-[3px] border-[#c9a24e] bg-[#e8efe9] shadow-[0_18px_30px_-14px_rgba(15,61,63,0.6)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cover}
                          alt=""
                          className="h-full w-full object-cover object-top"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f3d3f]/45 via-transparent to-transparent" />
                        <div className="pointer-events-none absolute inset-2 rounded-t-[999px] rounded-b border border-[#fff3cf]/60" />
                      </div>
                      <span className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center">
                        <Star8 className="absolute inset-0 h-full w-full text-[#1f7a7a]" />
                        <Heart className="relative h-4 w-4 fill-[#f3dc9e] text-[#f3dc9e]" />
                      </span>
                    </div>

                    <div className="mt-9 text-center">
                      <h2 className="font-display text-[34px] leading-tight text-[#0f3d3f]">
                        {data.partnerOneName}
                        <span className="mx-2 align-middle font-display text-2xl text-[#c9a24e]">
                          و
                        </span>
                        {data.partnerTwoName}
                      </h2>
                      <p className="mx-auto mt-3 max-w-[290px] font-display text-[17px] leading-8 text-[#6b5320]">
                        {theme.poeticLine}
                      </p>
                      <Ornament className="mt-4" />
                      <p className="mx-auto mt-4 max-w-[300px] text-[13px] leading-7 text-[#4a524f]">
                        {data.invitationText ||
                          "با کمال افتخار و شادمانی، حضور گرم شما را در جشن آغاز زندگی مشترکمان به انتظار نشسته‌ایم."}
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-3 items-stretch overflow-hidden rounded-2xl border border-[#c9a24e]/40 bg-[#f6f1e7] text-center">
                      <div className="flex flex-col justify-center px-2 py-3">
                        <span className="text-[10px] text-[#1f7a7a]">روز</span>
                        <span className="mt-1 text-[12px] font-semibold leading-5 text-[#0f3d3f]">
                          {parts.weekday || "—"}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center border-x border-[#c9a24e]/40 bg-[#0f3d3f] px-2 py-3 text-[#f6f1e7]">
                        <span className="text-[10px] text-[#e3c27a]">تاریخ</span>
                        <span className="mt-1 text-[12px] font-semibold leading-5">
                          {parts.date || dayFa}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center px-2 py-3">
                        <span className="text-[10px] text-[#1f7a7a]">ساعت</span>
                        <span className="mt-1 text-[12px] font-semibold leading-5 text-[#0f3d3f]">
                          {timeFa?.replace("ساعت ", "") || "—"}
                        </span>
                      </div>
                    </div>

                    {data.venueName ? (
                      <p className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-[#0f3d3f]">
                        <MapPin className="h-4 w-4 text-[#c9a24e]" />
                        {data.venueName}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStage("closed")}
                className="mx-auto mt-4 flex items-center gap-1.5 rounded-full border border-[#1f7a7a]/25 bg-white/70 px-4 py-2 text-xs text-[#1f7a7a] shadow-sm transition hover:bg-white active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                بازگرداندن به پاکت
              </button>
            </div>
          </section>

          {/* Details */}
          <div
            inert={!open}
            className={`flex flex-col gap-12 px-5 transition-all delay-200 duration-1000 ease-out ${
              open
                ? "mt-12 translate-y-0 opacity-100"
                : "pointer-events-none max-h-0 translate-y-8 overflow-hidden opacity-0"
            }`}
          >
            {showMusic ? (
              <section className="flex items-center gap-3 rounded-full border border-[#c9a24e]/35 bg-white/80 p-2 pl-5 shadow-[0_10px_24px_-14px_rgba(15,61,63,0.5)]">
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  aria-label="پخش موسیقی"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1f7a7a] text-[#f6f1e7] shadow-md transition active:scale-90"
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0f3d3f]">
                    {theme.musicTitle}
                  </p>
                  <p className="text-[11px] text-[#5d6b68]">
                    {playing ? "در حال پخش…" : "برای پخش لمس کنید"}
                  </p>
                </div>
                <div className="flex h-6 items-end gap-[3px]">
                  {[3, 6, 4, 7, 3, 5].map((h, i) => (
                    <span
                      key={i}
                      className={`w-[3px] rounded-full bg-[#c9a24e] ${playing ? "animate-pulse" : "opacity-40"}`}
                      style={{ height: h * 3, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {showCountdown ? (
              <section id="countdown" className="scroll-mt-20">
                <SectionHead kicker="تا لحظه‌ی دیدار" title="شمارش معکوس" />
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="[&_div]:rounded-2xl [&_div]:border-[#c9a24e]/35 [&_div]:bg-white/85 [&_div]:py-4 [&_div]:shadow-[0_10px_22px_-14px_rgba(15,61,63,0.5)] [&_p:first-child]:font-display [&_p:first-child]:text-[28px] [&_p:first-child]:text-[#0f3d3f] [&_p:last-child]:text-[11px] [&_p:last-child]:text-[#1f7a7a] [&_p:last-child]:opacity-100"
                />
              </section>
            ) : null}

            <section id="schedule" className="scroll-mt-20">
              <SectionHead kicker="برنامه‌ی جشن" title="روایت یک شب" />
              <div className="relative pr-6">
                <span className="absolute bottom-3 right-[13px] top-3 w-px bg-gradient-to-b from-[#c9a24e] via-[#1f7a7a]/40 to-transparent" />
                <div className="flex flex-col gap-4">
                  {schedule.map((item, i) => (
                    <div key={`${item.time}-${item.title}`} className="relative">
                      <Star8
                        className={`absolute -right-[29px] top-4 h-[18px] w-[18px] ${
                          i % 2 ? "text-[#c9a24e]" : "text-[#1f7a7a]"
                        }`}
                      />
                      <div className={`p-4 ${paper}`}>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-[15px] font-semibold text-[#0f3d3f]">
                            {item.title}
                          </h4>
                          <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#1f7a7a]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1f7a7a]">
                            <Clock className="h-3 w-3" />
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-6 text-[#5d6b68]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {showMap ? (
              <section id="location" className="scroll-mt-20">
                <SectionHead kicker="نشانی" title={data.venueName || "محل برگزاری"} />
                <div className={`overflow-hidden ${paper}`}>
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#1f7a7a] to-[#0f4c4f]">
                    <TilePattern
                      id={`tt-map-${uid}`}
                      color="#e3c27a"
                      opacity={0.3}
                      size={30}
                    />
                    <span className="relative flex h-14 w-14 items-center justify-center">
                      <Star8 className="absolute inset-0 h-full w-full text-[#c9a24e]" />
                      <MapPin className="relative h-6 w-6 text-[#0f3d3f]" />
                    </span>
                  </div>
                  <div className="p-4">
                    {data.venueAddress ? (
                      <p className="text-center text-[13px] leading-6 text-[#4a524f]">
                        {data.venueAddress}
                      </p>
                    ) : null}
                    {query ? (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[
                          { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                          { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                          {
                            href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                            label: "گوگل",
                          },
                        ].map((item, i) => (
                          <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-medium transition active:scale-95 ${
                              i === 0
                                ? "bg-[#0f3d3f] text-[#f6f1e7]"
                                : "border border-[#1f7a7a]/25 text-[#0f3d3f] hover:bg-[#1f7a7a]/5"
                            }`}
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
                        className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-[#c9a24e]/40 py-2.5 text-xs font-medium text-[#8a6a2a] transition hover:bg-[#c9a24e]/10"
                      >
                        <CalendarDays className="h-4 w-4" />
                        افزودن به تقویم
                      </a>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            <section>
              <SectionHead kicker="پوشش پیشنهادی" title="رنگ‌های جشن" />
              <div className={`p-5 text-center ${paper}`}>
                <Shirt className="mx-auto h-5 w-5 text-[#c9a24e]" />
                <p className="mt-2 text-[13px] leading-7 text-[#4a524f]">
                  {theme.dressCode}
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  {SWATCHES.map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1.5">
                      <span className="relative flex h-12 w-12 items-center justify-center">
                        <Star8
                          className="absolute inset-0 h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
                          style={{ color: s.color }}
                        />
                      </span>
                      <span className="text-[11px] text-[#0f3d3f]">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {features?.rsvp !== false ? (
              <section id="rsvp" className="scroll-mt-20">
                <SectionHead kicker="پاسخ شما" title="اعلام حضور" />
                <div className={`p-5 ${paper}`}>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: true, label: "با افتخار می‌آیم", Icon: Check },
                      { value: false, label: "متأسفانه نمی‌توانم", Icon: X },
                    ].map(({ value, label, Icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setAttending(value)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-[13px] font-medium transition ${
                          attending === value
                            ? "bg-[#1f7a7a] text-white shadow-md"
                            : "border border-[#1f7a7a]/20 text-[#4a524f]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div
                    className={`mt-3 flex items-center justify-between rounded-xl bg-[#f6f1e7] px-4 py-3 transition ${
                      attending ? "" : "pointer-events-none opacity-35"
                    }`}
                  >
                    <span className="text-[13px] text-[#0f3d3f]">تعداد نفرات</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1f7a7a]/30 text-[#1f7a7a] active:scale-90"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-display text-xl text-[#0f3d3f]">
                        {guests.toLocaleString("fa-IR")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(8, g + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f7a7a] text-white active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {preview ? (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#8a6a2a] via-[#c9a24e] to-[#8a6a2a] py-3.5 text-sm font-bold text-white shadow-lg">
                      <UserCheck className="h-4 w-4" />
                      ثبت پاسخ
                    </div>
                  ) : (
                    <a
                      href="#rsvp"
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#8a6a2a] via-[#c9a24e] to-[#8a6a2a] py-3.5 text-sm font-bold text-white shadow-lg"
                    >
                      <UserCheck className="h-4 w-4" />
                      ثبت پاسخ
                    </a>
                  )}
                </div>
              </section>
            ) : null}

            <section className="relative overflow-hidden rounded-[22px] bg-[#0f3d3f] p-6 text-center text-[#f6f1e7] shadow-[0_18px_40px_-18px_rgba(15,61,63,0.8)]">
              <TilePattern id={`tt-gift-${uid}`} color="#e3c27a" opacity={0.18} size={34} />
              <div className="relative">
                <Gift className="mx-auto h-6 w-6 text-[#e3c27a]" />
                <p className="mt-3 font-display text-lg leading-8">
                  {theme.blessingLine}
                </p>
              </div>
            </section>

            <footer className="pb-4 text-center">
              <Ornament />
              <p className="mt-3 font-display text-2xl text-[#0f3d3f]">{couple}</p>
              <p className="mt-1 text-[11px] text-[#5d6b68]">
                با مهر و سپاس از حضور سبزتان
              </p>
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#c9a24e]/25 bg-[#fffdf8]/90 px-2 backdrop-blur-xl">
          {[
            { href: "#", label: "دعوت‌نامه", Icon: Heart, active: true },
            { href: "#schedule", label: "برنامه", Icon: CalendarCheck },
            { href: "#location", label: "مسیر", Icon: MapPin },
            { href: "#rsvp", label: "حضور", Icon: UserCheck },
          ].map(({ href, label, Icon, active }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#") setStage("open");
              }}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] transition-colors ${
                active ? "font-semibold text-[#1f7a7a]" : "text-[#5d6b68] hover:text-[#1f7a7a]"
              }`}
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
