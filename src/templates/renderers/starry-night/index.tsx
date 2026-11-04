"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Hand,
  Heart,
  MapPin,
  Moon,
  Music2,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Wand2,
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

const DEFAULT_COVER = "/images/templates/starry-night-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "طلوع جشن",
    description: "خوش‌آمدگویی زیر نور فانوس‌ها با نوشیدنی و موسیقی آرام",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "پیوند دو ستاره",
    description: "آیین عقد در حضور خانواده و دوستان",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافت مهتاب",
    description: "شام زیر آسمان باز با چیدمان شمع و گل",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "رقص کهکشانی",
    description: "برش کیک، رقص زوج و جشن تا نیمه‌شب",
    icon: "music",
  },
];

const PLANETS = [
  { from: "#fff1c9", to: "#d8a948", label: "طلایی" },
  { from: "#e5dcff", to: "#7b68d9", label: "یاسی" },
  { from: "#ffd9e6", to: "#d9759a", label: "صورتی" },
  { from: "#3a4378", to: "#0b1030", label: "سرمه‌ای" },
];

const ORBIT_COLORS = ["#f2d38a", "#b9a8ff", "#f7a8c4", "#8fd3ff"];

/** Heart-shaped constellation, coordinates in a 100×100 box. */
const HEART: [number, number][] = [
  [50, 84],
  [27, 64],
  [14, 44],
  [17, 26],
  [32, 16],
  [50, 30],
  [68, 16],
  [83, 26],
  [86, 44],
  [73, 64],
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rnd = seeded(20260521);
const SKY = Array.from({ length: 80 }, () => ({
  x: +(rnd() * 100).toFixed(2),
  y: +(rnd() * 100).toFixed(2),
  size: +(rnd() * 1.8 + 0.6).toFixed(2),
  delay: +(rnd() * 5).toFixed(2),
  dur: +(rnd() * 3 + 2).toFixed(2),
}));

function timeOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

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

const glass =
  "rounded-[26px] border border-white/10 bg-white/[0.06] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur-md";
const goldText =
  "bg-[linear-gradient(120deg,#fff6dc_0%,#f2d38a_40%,#d8a948_70%,#fff1c9_100%)] bg-clip-text text-transparent";

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-5 text-center">
      <p className="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#b9a8ff]">
        <Star className="h-2.5 w-2.5 fill-current" />
        {kicker}
        <Star className="h-2.5 w-2.5 fill-current" />
      </p>
      <h3 className={`mt-1.5 font-display text-[28px] font-bold ${goldText}`}>
        {title}
      </h3>
    </div>
  );
}

export function StarryNightRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [lit, setLit] = useState(0);
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [wished, setWished] = useState(false);
  const complete = lit >= HEART.length;

  const theme: TemplateCustomization = {
    primaryColor: "#f2d38a",
    secondaryColor: "#b9a8ff",
    backgroundColor: "#060a1f",
    poeticLine: "«ما ز بالاییم و بالا می‌رویم، ما ز دریاییم و دریا می‌رویم»",
    blessingLine:
      "در آسمان این شب، روشن‌ترین ستاره حضور توست. منتظرت هستیم.",
    dressCode:
      "پوشش رسمی شب؛ رنگ‌های آسمان شب مثل سرمه‌ای، یاسی، طلایی و صورتی ملایم.",
    musicTitle: "نوای کهکشان",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const timeFa = formatEventTimeRange(data.eventStartAt, data.eventEndAt, data.timezone);
  const parts = datePartsOf(data.eventStartAt, data.timezone);
  const dayFa = parts.day
    ? `${parts.weekday}، ${parts.day} ${parts.month} ${parts.year}`
    : formatEventDay(data.eventStartAt, data.timezone);
  const startTime = timeOf(data.eventStartAt, data.timezone);
  const calendarHref = googleCalendarUrl({
    title: data.title || `عروسی ${couple}`,
    startIso: data.eventStartAt,
    endIso: data.eventEndAt,
    location: [data.venueName, data.venueAddress].filter(Boolean).join(" - "),
    details: data.invitationText,
  });
  const schedule = theme.schedule?.length ? theme.schedule : DEFAULT_SCHEDULE;
  const showMap =
    features?.map !== false && !!(data.venueName || data.venueAddress || data.mapUrl);
  const query = encodeURIComponent(
    data.mapUrl || [data.venueName, data.venueAddress].filter(Boolean).join(" ") || "",
  );

  useEffect(() => {
    if (!auto || complete) return;
    const t = window.setTimeout(() => setLit((n) => n + 1), 260);
    return () => window.clearTimeout(t);
  }, [auto, lit, complete]);

  useEffect(() => {
    if (!complete || open) return;
    const t = window.setTimeout(() => setOpen(true), 1100);
    return () => window.clearTimeout(t);
  }, [complete, open]);

  const tapStar = (i: number) => {
    if (i === lit) setLit(lit + 1);
  };
  const reset = () => {
    setOpen(false);
    setAuto(false);
    setLit(0);
    setWished(false);
  };
  const revealAll = () => {
    setLit(HEART.length);
    setOpen(true);
  };

  const heartPath = `M ${HEART.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#e9e6ff]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes sn-twinkle { 0%,100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes sn-shoot {
          0% { transform: translate(0,0) rotate(-35deg); opacity: 0; }
          4% { opacity: 1; }
          14% { transform: translate(-260px,180px) rotate(-35deg); opacity: 0; }
          100% { transform: translate(-260px,180px) rotate(-35deg); opacity: 0; }
        }
        @keyframes sn-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes sn-pulse { 0%,100% { r: 3.2; opacity: .9; } 50% { r: 6.5; opacity: 0; } }
        @keyframes sn-glow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        @keyframes sn-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes sn-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        className={`relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden transition-[background] duration-[2000ms] ${
          open
            ? "bg-[linear-gradient(180deg,#060a1f_0%,#141a3d_35%,#2a1745_75%,#3b1d4f_100%)]"
            : "bg-[linear-gradient(180deg,#03051a_0%,#060a1f_50%,#0d1235_100%)]"
        }`}
      >
        {/* Sky */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {SKY.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                boxShadow: s.size > 1.8 ? "0 0 6px rgba(255,255,255,0.8)" : undefined,
                animation: `sn-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
          {[
            { top: "6%", left: "92%", delay: "1s" },
            { top: "22%", left: "100%", delay: "5.5s" },
            { top: "48%", left: "96%", delay: "9s" },
          ].map((s, i) => (
            <span
              key={i}
              className="absolute h-px w-24 bg-gradient-to-l from-transparent via-white to-white"
              style={{ top: s.top, left: s.left, animation: `sn-shoot 11s linear ${s.delay} infinite` }}
            />
          ))}
          <div className="absolute -left-10 top-20 h-64 w-64 rounded-full bg-[#7b68d9]/20 blur-3xl" />
          <div className="absolute -right-16 top-[55%] h-72 w-72 rounded-full bg-[#d9759a]/15 blur-3xl" />
        </div>

        <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-[#060a1f]/60 px-5 backdrop-blur-md">
          <span className={`font-display text-xl font-bold ${goldText}`}>{monogram}</span>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b9a8ff]">
            <Moon className="h-3.5 w-3.5 fill-[#f2d38a] text-[#f2d38a]" />
            Starry Night
          </span>
        </header>

        <main className="relative flex flex-col pb-28">
          {/* Constellation ritual */}
          <section className="relative px-5 pt-6 text-center">
            <div className="absolute left-6 top-4 h-14 w-14 rounded-full bg-[#fff1c9] shadow-[0_0_40px_10px_rgba(242,211,138,0.35)]">
              <span className="absolute -right-1 -top-1 h-12 w-12 rounded-full bg-[#060a1f]" />
            </div>

            <p className="text-[12px] tracking-[0.2em] text-[#b9a8ff]">
              {open ? "ستاره‌هایمان به هم رسید" : "زیر یک آسمان"}
            </p>
            <h1 className={`mt-2 font-display text-[40px] font-bold leading-tight ${goldText}`}>
              {data.partnerOneName}
              <span className="mx-2 text-[#b9a8ff] [-webkit-text-fill-color:#b9a8ff]">&</span>
              {data.partnerTwoName}
            </h1>

            <div className="relative mx-auto mt-6 aspect-square w-[86%]">
              <div
                className={`absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(242,211,138,0.28)_0%,rgba(185,168,255,0.12)_45%,transparent_70%)] blur-xl transition-opacity duration-1000 ${
                  complete ? "opacity-100" : "opacity-0"
                }`}
              />
              <svg viewBox="0 0 100 100" className="relative h-full w-full overflow-visible">
                <defs>
                  <radialGradient id="sn-star" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="45%" stopColor="#fff1c9" />
                    <stop offset="100%" stopColor="#f2d38a" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="sn-line" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fff1c9" />
                    <stop offset="100%" stopColor="#b9a8ff" />
                  </linearGradient>
                </defs>

                <path
                  d={heartPath}
                  fill="url(#sn-star)"
                  className={`transition-opacity duration-1000 ${complete ? "opacity-20" : "opacity-0"}`}
                />
                <path
                  d={heartPath}
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity={complete ? 0 : 0.08}
                  strokeWidth="0.4"
                  strokeDasharray="1 1.5"
                />

                {HEART.map(([x, y], i) => {
                  if (i === 0 || i > lit - 1) return null;
                  const [px, py] = HEART[i - 1];
                  return (
                    <line
                      key={`l-${i}`}
                      x1={px}
                      y1={py}
                      x2={x}
                      y2={y}
                      stroke="url(#sn-line)"
                      strokeWidth="0.7"
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray="1"
                      style={{ animation: "sn-draw .45s ease-out both", filter: "drop-shadow(0 0 1.5px #fff1c9)" }}
                    />
                  );
                })}
                {complete ? (
                  <line
                    x1={HEART[HEART.length - 1][0]}
                    y1={HEART[HEART.length - 1][1]}
                    x2={HEART[0][0]}
                    y2={HEART[0][1]}
                    stroke="url(#sn-line)"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    style={{ animation: "sn-draw .45s ease-out both", filter: "drop-shadow(0 0 1.5px #fff1c9)" }}
                  />
                ) : null}

                {HEART.map(([x, y], i) => {
                  const on = i < lit;
                  const next = i === lit && !complete;
                  return (
                    <g key={`s-${i}`}>
                      {next ? (
                        <circle cx={x} cy={y} r="3.2" fill="none" stroke="#f2d38a" strokeWidth="0.5" style={{ animation: "sn-pulse 1.4s ease-out infinite" }} />
                      ) : null}
                      <circle cx={x} cy={y} r={on ? 4.5 : 3} fill="url(#sn-star)" opacity={on ? 1 : 0.35} className="transition-all duration-500" />
                      <circle cx={x} cy={y} r={on ? 1.3 : 0.9} fill={on ? "#ffffff" : "#c9c4ee"} className="transition-all duration-500" />
                      <circle
                        cx={x}
                        cy={y}
                        r="7"
                        fill="transparent"
                        className={next ? "cursor-pointer" : ""}
                        onClick={() => tapStar(i)}
                        role={next ? "button" : undefined}
                        aria-label={next ? `ستاره‌ی ${(i + 1).toLocaleString("fa-IR")}` : undefined}
                      />
                    </g>
                  );
                })}

                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`font-display transition-opacity duration-1000 ${complete ? "opacity-100" : "opacity-0"}`}
                  fill="#fff1c9"
                  fontSize="11"
                  fontWeight="700"
                  style={{ animation: complete ? "sn-glow 2.4s ease-in-out infinite" : undefined }}
                >
                  {monogram}
                </text>
              </svg>
            </div>

            {!open ? (
              <div className="mt-2 flex flex-col items-center gap-3">
                <p className="flex items-center gap-1.5 text-[13px] text-[#c9c4ee]">
                  <Hand className="h-4 w-4 animate-bounce text-[#f2d38a]" />
                  {lit === 0
                    ? "ستاره‌ی چشمک‌زن را لمس کن"
                    : complete
                      ? "قلب کامل شد…"
                      : `${(HEART.length - lit).toLocaleString("fa-IR")} ستاره‌ی دیگر تا کامل شدن قلب`}
                </p>
                <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#f2d38a] to-[#b9a8ff] transition-all duration-500"
                    style={{ width: `${(lit / HEART.length) * 100}%` }}
                  />
                </div>
                {!complete ? (
                  <button
                    type="button"
                    onClick={() => setAuto(true)}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] text-[#f2d38a] backdrop-blur transition hover:bg-white/10"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    قلب را برایم بکش
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Revealed content */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-12 px-5 transition-all duration-1000 ease-out ${
              open
                ? "mt-6 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            {/* Moon portrait + invitation */}
            <section className="flex flex-col items-center text-center" style={{ animation: open ? "sn-rise 1s ease-out both" : undefined }}>
              <div className="relative h-52 w-52">
                <div
                  className="absolute -inset-3 rounded-full border border-dashed border-[#f2d38a]/30"
                  style={{ animation: "sn-spin 40s linear infinite" }}
                >
                  <Star className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 fill-[#f2d38a] text-[#f2d38a]" />
                </div>
                <div className="absolute inset-0 rounded-full shadow-[0_0_60px_8px_rgba(242,211,138,0.35)]" />
                <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-[#f2d38a]/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141a3d]/70 via-transparent to-[#fff1c9]/10" />
                </div>
              </div>
              <p className="mt-7 font-display text-[21px] leading-10 text-[#fff1c9]">
                {theme.poeticLine}
              </p>
              <p className="mt-4 max-w-[320px] text-[13px] leading-7 text-[#c9c4ee]">
                {data.invitationText ||
                  "ستاره‌های ما سال‌ها در آسمان دنبال هم گشتند تا امشب به هم برسند. خوشحال می‌شویم در این شب روشن، کنارمان باشید."}
              </p>
            </section>

            {/* Star map */}
            <section className={`relative overflow-hidden p-6 text-center ${glass}`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#b9a8ff]">
                The night our stars aligned
              </p>
              <div className="relative mx-auto mt-5 aspect-square w-[70%]">
                <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
                  <circle cx="50" cy="50" r="48" fill="#0b1030" stroke="#f2d38a" strokeOpacity="0.6" strokeWidth="0.6" />
                  {[38, 26, 14].map((r) => (
                    <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.4" />
                  ))}
                  {[0, 30, 60, 90, 120, 150].map((a) => (
                    <line
                      key={a}
                      x1="50"
                      y1="2"
                      x2="50"
                      y2="98"
                      stroke="#ffffff"
                      strokeOpacity="0.06"
                      strokeWidth="0.4"
                      transform={`rotate(${a} 50 50)`}
                    />
                  ))}
                  {SKY.slice(0, 40).map((s, i) => {
                    const dx = s.x - 50;
                    const dy = s.y - 50;
                    if (dx * dx + dy * dy > 44 * 44) return null;
                    return <circle key={i} cx={s.x} cy={s.y} r={s.size * 0.35} fill="#ffffff" opacity="0.7" />;
                  })}
                  <g transform="translate(22 22) scale(0.56)">
                    <path d={heartPath} fill="none" stroke="#f2d38a" strokeWidth="1" />
                    {HEART.map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="1.8" fill="#fff1c9" />
                    ))}
                  </g>
                </svg>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-white/5 px-2 py-3">
                  <p className="text-[10px] text-[#b9a8ff]">{parts.weekday || "روز"}</p>
                  <p className={`mt-0.5 font-display text-3xl font-bold ${goldText}`}>{parts.day || "—"}</p>
                  <p className="text-[11px] text-[#c9c4ee]">{parts.month}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 px-2 py-3">
                  <Clock className="h-4 w-4 text-[#f2d38a]" />
                  <p className="mt-1 font-display text-xl font-bold text-[#fff1c9]">{startTime || "—"}</p>
                  <p className="text-[10px] text-[#c9c4ee]">آغاز جشن</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 px-2 py-3">
                  <MapPin className="h-4 w-4 text-[#f2d38a]" />
                  <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-[#fff1c9]">
                    {data.venueName || "به‌زودی"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#9a95c8]">{dayFa}</p>
            </section>

            {/* Music */}
            {features?.music !== false ? (
              <section className={`flex items-center gap-4 p-3 pl-5 ${glass} !rounded-full`}>
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  aria-label="پخش موسیقی"
                  className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fff1c9] to-[#d8a948] text-[#141a3d] shadow-[0_0_24px_rgba(242,211,138,0.45)] transition active:scale-90"
                >
                  {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-[#fff1c9]">
                    <Music2 className="h-3.5 w-3.5 text-[#b9a8ff]" />
                    {theme.musicTitle}
                  </p>
                  <div className="mt-2 flex h-4 items-end gap-[3px]" dir="ltr">
                    {[3, 6, 4, 8, 5, 9, 6, 4, 7, 5, 8, 3, 6, 4].map((h, i) => (
                      <span
                        key={i}
                        className={`w-[3px] rounded-full bg-[#b9a8ff] ${playing ? "animate-pulse" : "opacity-40"}`}
                        style={{ height: h * 2, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {/* Countdown */}
            {features?.countdown !== false && data.eventStartAt ? (
              <section>
                <SectionTitle kicker="Countdown" title="تا آن شب پرستاره" />
                <Countdown
                  eventStartAt={data.eventStartAt}
                  className="[&_div]:rounded-3xl [&_div]:border-white/10 [&_div]:bg-white/[0.06] [&_div]:py-4 [&_div]:backdrop-blur [&_p:first-child]:font-display [&_p:first-child]:text-[30px] [&_p:first-child]:text-[#fff1c9] [&_p:first-child]:[text-shadow:0_0_14px_rgba(242,211,138,0.6)] [&_p:last-child]:text-[11px] [&_p:last-child]:text-[#b9a8ff] [&_p:last-child]:opacity-100"
                />
              </section>
            ) : null}

            {/* Orbit schedule */}
            <section id="schedule" className="scroll-mt-20">
              <SectionTitle kicker="Orbit of the night" title="مدار جشن" />
              <div className="relative pr-8">
                <span className="absolute bottom-4 right-[11px] top-4 w-px bg-gradient-to-b from-[#f2d38a] via-[#b9a8ff]/50 to-transparent" />
                <div className="flex flex-col gap-4">
                  {schedule.map((item, i) => {
                    const c = ORBIT_COLORS[i % ORBIT_COLORS.length];
                    return (
                      <div key={`${item.time}-${item.title}`} className="relative">
                        <span
                          className="absolute -right-[33px] top-4 h-6 w-6 rounded-full"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${c} 45%, #141a3d 100%)`,
                            boxShadow: `0 0 16px ${c}`,
                          }}
                        />
                        <div className={`p-4 ${glass}`}>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[15px] font-bold text-[#fff1c9]">{item.title}</h4>
                            <span
                              className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#060a1f]"
                              style={{ backgroundColor: c }}
                            >
                              {item.time}
                            </span>
                          </div>
                          {item.description ? (
                            <p className="mt-1.5 text-[13px] leading-6 text-[#c9c4ee]">{item.description}</p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Venue */}
            {showMap ? (
              <section id="location" className="scroll-mt-20">
                <SectionTitle kicker="Where the stars meet" title={data.venueName || "محل جشن"} />
                <div className={`overflow-hidden ${glass}`}>
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_60%,#2a1745_0%,#0b1030_70%)]">
                    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(185,168,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(185,168,255,0.35)_1px,transparent_1px)] [background-size:26px_26px]" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#fff1c9] to-[#d8a948] text-[#141a3d] shadow-[0_0_34px_rgba(242,211,138,0.6)]">
                      <Heart className="h-6 w-6 fill-current" />
                    </span>
                  </div>
                  <div className="p-4">
                    {data.venueAddress ? (
                      <p className="text-center text-[13px] leading-6 text-[#c9c4ee]">{data.venueAddress}</p>
                    ) : null}
                    {timeFa ? <p className="mt-1 text-center text-[12px] text-[#9a95c8]">{timeFa}</p> : null}
                    {query ? (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[
                          { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                          { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                          { href: `https://www.google.com/maps/search/?api=1&query=${query}`, label: "گوگل" },
                        ].map((item, i) => (
                          <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-1 rounded-2xl py-2.5 text-xs font-semibold transition active:scale-95 ${
                              i === 0
                                ? "bg-gradient-to-br from-[#fff1c9] to-[#d8a948] text-[#141a3d]"
                                : "border border-white/15 bg-white/5 text-[#e9e6ff] hover:bg-white/10"
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
                        className="mt-2 flex items-center justify-center gap-1.5 rounded-2xl border border-[#b9a8ff]/30 py-2.5 text-xs font-semibold text-[#b9a8ff] transition hover:bg-white/5"
                      >
                        <CalendarDays className="h-4 w-4" />
                        افزودن به تقویم
                      </a>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {/* Dress code planets */}
            <section>
              <SectionTitle kicker="Dress code" title="رنگ‌های آسمان" />
              <div className={`p-5 text-center ${glass}`}>
                <p className="text-[13px] leading-7 text-[#c9c4ee]">{theme.dressCode}</p>
                <div className="mt-5 flex justify-center gap-5">
                  {PLANETS.map((p, i) => (
                    <div key={p.label} className="flex flex-col items-center gap-2">
                      <span className="relative h-12 w-12">
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `radial-gradient(circle at 32% 30%, ${p.from} 0%, ${p.to} 70%)`,
                            boxShadow: `0 0 18px ${p.to}80`,
                          }}
                        />
                        {i % 2 === 0 ? (
                          <span className="absolute left-1/2 top-1/2 h-3 w-16 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-[#fff1c9]/50" />
                        ) : null}
                      </span>
                      <span className="text-[11px] text-[#e9e6ff]">{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* RSVP */}
            {features?.rsvp !== false ? (
              <section id="rsvp" className="scroll-mt-20">
                <SectionTitle kicker="Make a wish" title="آرزویت را بفرست" />
                <div className={`p-5 ${glass}`}>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: true, label: "می‌آیم", Icon: Check },
                      { value: false, label: "نمی‌توانم", Icon: X },
                    ].map(({ value, label, Icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setAttending(value)}
                        className={`flex items-center justify-center gap-1.5 rounded-2xl py-3 text-sm font-bold transition ${
                          attending === value
                            ? "bg-gradient-to-br from-[#fff1c9] to-[#d8a948] text-[#141a3d] shadow-[0_0_20px_rgba(242,211,138,0.35)]"
                            : "border border-white/15 text-[#c9c4ee]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div
                    className={`mt-3 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 transition ${
                      attending ? "" : "pointer-events-none opacity-35"
                    }`}
                  >
                    <span className="text-[13px] text-[#e9e6ff]">تعداد همراهان</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[#f2d38a]"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-display text-xl font-bold text-[#fff1c9]">
                        {guests.toLocaleString("fa-IR")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(8, g + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2d38a] text-[#141a3d]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWished(true)}
                    className="relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-[#7b68d9] via-[#b9a8ff] to-[#d9759a] py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(185,168,255,0.8)]"
                  >
                    <Sparkles className="h-4 w-4" />
                    {wished ? "آرزویت به ستاره‌ها رسید!" : "پاسخ را با یک ستاره‌ی دنباله‌دار بفرست"}
                    {wished ? (
                      <span
                        className="absolute h-px w-20 bg-gradient-to-l from-transparent via-white to-white"
                        style={{ top: "30%", left: "90%", animation: "sn-shoot 3s linear 0s 1" }}
                      />
                    ) : null}
                  </button>
                </div>
              </section>
            ) : null}

            {/* Blessing + footer */}
            <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#2a1745] via-[#141a3d] to-[#0b1030] p-7 text-center ring-1 ring-[#f2d38a]/25">
              <Moon className="mx-auto h-7 w-7 fill-[#f2d38a] text-[#f2d38a]" />
              <p className="mt-3 font-display text-lg leading-9 text-[#fff1c9]">{theme.blessingLine}</p>
            </section>

            <button
              type="button"
              onClick={reset}
              className="mx-auto flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-[#c9c4ee] transition hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              دوباره ستاره‌ها را وصل کن
            </button>

            <footer className="pb-6 text-center">
              <p className={`font-display text-3xl font-bold ${goldText}`}>{couple}</p>
              <p className="mt-2 text-[11px] tracking-[0.2em] text-[#9a95c8]">
                زیر یک آسمان، برای همیشه
              </p>
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-white/10 bg-[#060a1f]/80 px-2 backdrop-blur-xl">
          {[
            { href: "#", label: "آسمان", Icon: Star, active: true },
            { href: "#schedule", label: "مدار", Icon: Clock },
            { href: "#location", label: "مکان", Icon: MapPin },
            { href: "#rsvp", label: "آرزو", Icon: Sparkles },
          ].map(({ href, label, Icon, active }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#") revealAll();
              }}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] ${
                active ? "font-semibold text-[#f2d38a]" : "text-[#9a95c8] hover:text-[#e9e6ff]"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "fill-current" : ""}`} />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

