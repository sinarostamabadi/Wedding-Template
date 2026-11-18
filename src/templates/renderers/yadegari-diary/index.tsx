"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  BookHeart,
  CalendarDays,
  Clock3,
  Heart,
  KeyRound,
  MapPin,
  Music2,
  Navigation,
  PenLine,
  RotateCcw,
} from "lucide-react";
import { Countdown } from "@/templates/shared/countdown";
import {
  coupleLabel,
  formatEventTimeRange,
  googleCalendarUrl,
} from "@/templates/shared/format";
import type {
  TemplateCustomization,
  TemplateRendererProps,
  TemplateScheduleItem,
} from "@/templates/types";

const DEFAULT_COVER = "/images/templates/yadegari-diary-cover.jpg";

const ROSE = "#b8475a";
const INK = "#1f3c88";
const RED_INK = "#c0392b";
const PAPER = "#fbf5e6";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "خوش‌آمد",
    description: "گلاب‌پاش دمِ در، شربت بیدمشک و شیرینی نارگیلی",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "سفره‌ی عقد",
    description: "آینه و شمعدان، و «بله»ای که سال‌ها منتظرش بودیم",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "شام عروسی",
    description: "باقالی‌پلو با ماهیچه، مثل عروسی‌های خانه‌ی مادربزرگ",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "رقص و ترانه",
    description: "ضبط صوت، نوارهای قدیمی و رقص دونفره زیر ریسه‌ها",
    icon: "music",
  },
];

const PENCILS = [
  { color: "#d98b95", label: "صورتی چرک" },
  { color: "#8e2a3b", label: "زرشکی" },
  { color: "#efe0c2", label: "کرم" },
  { color: "#6f8f6a", label: "یشمی" },
];

const LINED: CSSProperties = {
  backgroundColor: PAPER,
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0 27px, rgba(70,110,190,0.22) 27px 28px)",
  backgroundPosition: "0 18px",
};

const HEART_PATH =
  "M50 90 C22 70 4 54 4 33 C4 17 16 6 30 6 C39 6 46 11 50 19 C54 11 61 6 70 6 C84 6 96 17 96 33 C96 54 78 70 50 90 Z";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const FLOATERS = (() => {
  const rand = seeded(1360);
  return Array.from({ length: 14 }, () => ({
    left: rand() * 100,
    size: 10 + rand() * 14,
    duration: 9 + rand() * 8,
    delay: -rand() * 14,
    hue: rand() > 0.5 ? "#e58a9a" : "#f2b8c0",
  }));
})();

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  const empty = { weekday: "", day: "", month: "", year: "" };
  if (!iso) return empty;
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
    return empty;
  }
}

function HeartSticker({ className = "", color = "#e2566b", style }: { className?: string; color?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 96" className={className} style={style} aria-hidden>
      <path d={HEART_PATH} fill="#fff" transform="translate(-6 -5) scale(1.12)" />
      <path d={HEART_PATH} fill={color} />
      <ellipse cx="32" cy="28" rx="11" ry="6" fill="#fff" opacity="0.55" transform="rotate(-30 32 28)" />
    </svg>
  );
}

function Tape({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <span
      className={`pointer-events-none absolute h-5 w-16 bg-[#f1e2b3]/75 shadow-[0_1px_2px_rgba(0,0,0,0.12)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    />
  );
}

function PressedFlower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 120" className={className} aria-hidden>
      <path d="M30 118 C 28 90 34 70 30 44" stroke="#7d8a5a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 86 C 18 80 12 70 14 62 C 24 66 30 74 30 86 Z" fill="#9aa36f" opacity="0.8" />
      <path d="M31 72 C 42 68 48 58 46 50 C 37 54 31 62 31 72 Z" fill="#9aa36f" opacity="0.7" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="30" cy="26" rx="9" ry="15" fill="#c9707f" opacity="0.75" transform={`rotate(${a} 30 34)`} />
      ))}
      <circle cx="30" cy="34" r="5" fill="#d8a85a" />
    </svg>
  );
}

function Page({
  id,
  tilt = 0,
  className = "",
  children,
}: {
  id?: string;
  tilt?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-20 rounded-[4px] pb-7 pl-5 pr-10 pt-8 shadow-[0_16px_30px_-18px_rgba(90,40,30,0.6)] ${className}`}
      style={{ ...LINED, transform: `rotate(${tilt}deg)` }}
    >
      <span className="pointer-events-none absolute inset-y-0 right-6 w-px bg-[#e07a7a]/60" aria-hidden />
      <span className="pointer-events-none absolute inset-y-0 right-7 w-px bg-[#e07a7a]/35" aria-hidden />
      {children}
    </section>
  );
}

export function YadegariDiaryRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = `yd${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [stage, setStage] = useState<"locked" | "turning" | "opening" | "open">("locked");
  const [noteOpen, setNoteOpen] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestNote, setGuestNote] = useState("");
  const [signed, setSigned] = useState(false);
  const timers = useRef<number[]>([]);

  const open = stage === "open";
  const swung = stage === "opening" || stage === "open";
  const unlocked = stage !== "locked";

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const unlockDiary = () => {
    if (stage !== "locked") return;
    setStage("turning");
    timers.current.push(
      window.setTimeout(() => setStage("opening"), 900),
      window.setTimeout(() => setStage("open"), 2300),
    );
  };

  const closeDiary = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStage("locked");
    setNoteOpen(false);
    setSigned(false);
  };

  const forceOpen = () => {
    if (open) return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStage("open");
  };

  const theme: TemplateCustomization = {
    primaryColor: ROSE,
    secondaryColor: INK,
    backgroundColor: "#f4e1d6",
    poeticLine: "«دلم را لای این دفتر گذاشتم، به یادگار، برای تو»",
    dressCode:
      "حال‌وهوای عاشقانه‌ی دهه‌ی شصت؛ صورتی چرک، زرشکی، کرم و یشمی. پیراهن گلدار و کت‌وشلوار ساده، خیلی هم عالی!",
    blessingLine: "این دفتر را نگه دار؛ روزی که موهایمان سپید شد، با هم ورقش می‌زنیم",
    musicTitle: "نوار ترانه‌های عاشقانه‌ی قدیمی",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
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
  const fullDate = parts.day ? `${parts.weekday}، ${parts.day} ${parts.month} ${parts.year}` : "";

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#4a2b2b]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes yd-float { from { transform: translateY(0) rotate(-8deg); opacity: 0; } 12% { opacity: 0.8; } 88% { opacity: 0.8; } to { transform: translateY(-110vh) rotate(14deg); opacity: 0; } }
        @keyframes yd-turn { 0% { transform: rotate(0); } 60%,100% { transform: rotate(-90deg); } }
        @keyframes yd-pop { 0% { transform: scale(0) rotate(-20deg); opacity: 0; } 70% { transform: scale(1.2) rotate(6deg); opacity: 1; } 100% { transform: scale(1) rotate(-6deg); opacity: 1; } }
        @keyframes yd-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes yd-wiggle { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @keyframes yd-hearts { from { transform: translateY(0) scale(0.6); opacity: 1; } to { transform: translateY(-160px) scale(1.1); opacity: 0; } }
      `}</style>

      <div
        className="relative mx-auto flex min-h-screen w-full max-w-md flex-col"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(214,120,140,0.16) 0 3px, transparent 4px), radial-gradient(circle at 75% 75%, rgba(120,150,110,0.14) 0 2.5px, transparent 3.5px), linear-gradient(180deg,#f7e6dc,#f1d9cc)",
          backgroundSize: "34px 34px, 34px 34px, 100% 100%",
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {FLOATERS.map((f, i) => (
            <span
              key={i}
              className="absolute bottom-[-40px]"
              style={{
                left: `${f.left}%`,
                width: f.size,
                height: f.size,
                animation: `yd-float ${f.duration}s linear ${f.delay}s infinite`,
              }}
            >
              <svg viewBox="0 0 100 96" className="h-full w-full">
                <path d={HEART_PATH} fill={f.hue} />
              </svg>
            </span>
          ))}
        </div>

        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#b8475a]/15 bg-[#f7e6dc]/85 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 font-display text-[15px] text-[#8e2a3b]">
            <BookHeart className="h-4 w-4" />
            دفتر یادگاری
          </span>
          <span className="rounded-full border border-dashed border-[#b8475a]/50 px-3 py-1 text-[11px] text-[#8e2a3b]">
            سال ۱۳۶۸ · به یادگار
          </span>
        </header>

        <main className="relative z-10 flex flex-col pb-28">
          <section className="px-6 pt-7 text-center">
            <p className="text-[11px] tracking-[0.3em] text-[#b8475a]">♥ تقدیم به تو ♥</p>
            <h1 className="mt-2 font-display text-[38px] leading-tight" style={{ color: INK }}>
              {data.partnerOneName}
              <span className="mx-2" style={{ color: RED_INK }}>♥</span>
              {data.partnerTwoName}
            </h1>
            <p className="mt-1 text-[12px] text-[#8a5a5a]">قفل دفترمان را باز کن؛ برایت نوشته‌ایم</p>
          </section>

          {/* Diary */}
          <section className="relative mt-6 flex flex-col items-center">
            <div className="relative h-[350px] w-[262px] [perspective:1500px]">
              {swung ? (
                <div className="pointer-events-none absolute left-1/2 top-1/3 z-30" aria-hidden>
                  {Array.from({ length: 9 }, (_, i) => (
                    <span
                      key={i}
                      className="absolute h-5 w-5"
                      style={{
                        left: `${(i - 4) * 22}px`,
                        animation: `yd-hearts 1.6s ease-out ${i * 0.08}s both`,
                      }}
                    >
                      <svg viewBox="0 0 100 96" className="h-full w-full">
                        <path d={HEART_PATH} fill={i % 2 ? "#e2566b" : "#f2a0ad"} />
                      </svg>
                    </span>
                  ))}
                </div>
              ) : null}

              {/* first page (inside) */}
              <div
                className={`absolute inset-0 overflow-hidden rounded-l-[6px] rounded-r-[3px] shadow-[0_24px_40px_-20px_rgba(80,30,30,0.7)] transition-opacity duration-500 ${
                  swung ? "visible opacity-100" : "invisible opacity-0"
                }`}
                style={LINED}
                inert={!swung}
                aria-hidden={!swung}
              >
                <span className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-[#d9c9a8] to-transparent" aria-hidden />
                <div className="relative flex h-full flex-col items-center px-5 pt-6 text-center">
                  <p className="font-display text-[15px]" style={{ color: RED_INK }}>
                    به یادگار…
                  </p>
                  <PressedFlower className="absolute right-1 top-[118px] h-28 w-14 rotate-[-28deg] opacity-90" />
                  <div className="relative mt-3 rotate-[-3deg] bg-white p-2 pb-6 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.45)]">
                    <Tape className="-top-2 left-1/2 -ml-8" rotate={-4} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover} alt={couple} className="h-[150px] w-[150px] object-cover object-[50%_25%] sepia-[0.25]" />
                    <p className="absolute inset-x-0 bottom-1 text-center font-display text-[12px]" style={{ color: INK }}>
                      {couple}
                    </p>
                  </div>
                  <HeartSticker className="absolute left-5 top-28 h-8 w-8" style={{ transform: "rotate(-14deg)" }} />
                  <HeartSticker className="absolute bottom-5 left-6 h-6 w-6" color="#f08a9c" style={{ transform: "rotate(12deg)" }} />
                  <p className="mt-5 font-display text-[17px] leading-7" style={{ color: INK }}>
                    «تو که خواندی، دلت شاد؛
                    <br />
                    ما که نوشتیم، یادمان باد»
                  </p>
                </div>
              </div>

              {/* cover */}
              <div
                className={`absolute inset-0 origin-right [transform-style:preserve-3d] ${swung ? "pointer-events-none" : ""}`}
                style={{
                  transform: swung ? "rotateY(165deg)" : "rotateY(0deg)",
                  opacity: swung ? 0 : 1,
                  transition: "transform 1300ms cubic-bezier(0.3,0.8,0.25,1), opacity 500ms ease 800ms",
                }}
              >
                <button
                  type="button"
                  onClick={unlockDiary}
                  disabled={stage !== "locked"}
                  aria-label="باز کردن دفتر یادگاری"
                  className="absolute inset-0 cursor-pointer overflow-hidden rounded-l-[10px] rounded-r-[4px] bg-[linear-gradient(145deg,#cf6276,#a63b4f_55%,#7f2a3c)] shadow-[0_26px_44px_-18px_rgba(80,20,30,0.8),inset_0_0_0_1px_rgba(255,255,255,0.15)] [backface-visibility:hidden] disabled:cursor-default"
                >
                  <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden>
                    <defs>
                      <pattern id={`${uid}-flora`} width="44" height="44" patternUnits="userSpaceOnUse">
                        {[0, 72, 144, 216, 288].map((a) => (
                          <ellipse key={a} cx="22" cy="16" rx="4" ry="7" fill="#ffe3e8" transform={`rotate(${a} 22 22)`} />
                        ))}
                        <circle cx="22" cy="22" r="2.6" fill="#ffd28a" />
                        <circle cx="0" cy="0" r="2" fill="#ffe3e8" />
                        <circle cx="44" cy="44" r="2" fill="#ffe3e8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#${uid}-flora)`} />
                  </svg>
                  <span className="absolute inset-y-0 right-0 w-6 bg-[linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0.3))]" aria-hidden />
                  <span className="absolute inset-3 right-8 rounded-[8px] border-2 border-dashed border-[#ffd7de]/55" aria-hidden />

                  <span className="absolute left-1/2 top-[22%] flex w-[170px] -translate-x-1/2 flex-col items-center rounded-[50%] border-[3px] border-[#e2566b] bg-[#fffaf2] px-3 py-5 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.5)]">
                    <span className="font-display text-[22px] leading-none" style={{ color: INK }}>
                      دفتر یادگاری
                    </span>
                    <span className="mt-2 text-[12px]" style={{ color: RED_INK }}>
                      {couple}
                    </span>
                  </span>

                  <HeartSticker className="absolute left-6 top-8 h-9 w-9" style={{ transform: "rotate(-16deg)" }} />
                  <HeartSticker className="absolute bottom-16 right-12 h-7 w-7" color="#f6b7c2" style={{ transform: "rotate(10deg)" }} />
                  <HeartSticker className="absolute bottom-10 left-10 h-5 w-5" color="#ffd28a" style={{ transform: "rotate(-6deg)" }} />
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-[#ffe3e8]/80">
                    ✿ ۱۳۶۸ ✿
                  </span>
                </button>
              </div>

              {/* strap & lock */}
              <div
                className="absolute -left-3 top-1/2 z-20 -translate-y-1/2 transition-all duration-700"
                style={{
                  transform: swung ? "translate(-30px, 40px) rotate(-35deg)" : undefined,
                  opacity: swung ? 0 : 1,
                }}
                aria-hidden
              >
                <span className="block h-14 w-16 rounded-l-2xl bg-[linear-gradient(180deg,#8e2a3b,#6a1f2c)] shadow-[0_6px_12px_-4px_rgba(0,0,0,0.5)]" />
                <span className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#8a6a2a] bg-[radial-gradient(circle_at_35%_30%,#fff1b8,#d8b04a_55%,#9a7426)] shadow-[0_3px_6px_rgba(0,0,0,0.4)]">
                  <span
                    className="flex h-7 w-7 items-center justify-center"
                    style={{ animation: stage === "turning" ? "yd-turn 0.8s ease-in-out forwards" : undefined }}
                  >
                    <KeyRound className="h-5 w-5 text-[#5a3d10]" />
                  </span>
                </span>
              </div>
            </div>

            {open ? (
              <p className="mt-6 font-display text-[16px]" style={{ color: RED_INK, animation: "yd-rise 0.9s ease-out both" }}>
                ورق بزن، برایت نوشته‌ایم…
              </p>
            ) : (
              <div className="mt-7 flex flex-col items-center gap-2 text-center">
                {stage === "locked" ? (
                  <button
                    type="button"
                    onClick={unlockDiary}
                    className="flex items-center gap-2 rounded-full bg-[#8e2a3b] px-6 py-3 text-sm font-bold text-[#fff3ea] shadow-[0_12px_26px_-10px_rgba(142,42,59,0.8)] transition hover:brightness-110 active:scale-95"
                  >
                    <KeyRound className="h-4 w-4" />
                    کلید را بچرخان
                  </button>
                ) : (
                  <p className="font-display text-[15px] text-[#8e2a3b]">
                    {unlocked && !swung ? "تیک… قفل باز شد" : "دفتر باز می‌شود…"}
                  </p>
                )}
                {stage === "locked" ? (
                  <p className="text-[11px] text-[#8a5a5a]">یا روی جلد دفتر بزن</p>
                ) : null}
              </div>
            )}
          </section>

          {/* Revealed pages */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-10 px-5 transition-all duration-1000 ease-out ${
              open
                ? "mt-10 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            {/* Letter */}
            <Page id="letter" tilt={-0.8}>
              <Tape className="-top-2 left-8" rotate={-6} />
              <Tape className="-top-2 right-10" rotate={5} />
              <p className="font-display text-[19px] leading-7" style={{ color: INK }}>
                سلام،
              </p>
              <p className="text-[13.5px] leading-7" style={{ color: INK }}>
                امیدواریم که حالتان خوب باشد. اگر از احوالات ما خواسته باشید، ملالی نیست جز دوری شما.
              </p>
              <p className="mt-1 text-[13.5px] leading-7" style={{ color: INK }}>
                {data.invitationText ||
                  "با کمال مهر و افتخار، شما را به جشن پیوندمان دعوت می‌کنیم؛ شبی که بی حضور شما کامل نمی‌شود."}
              </p>
              <p className="mt-2 text-center font-display text-[19px] leading-7" style={{ color: RED_INK }}>
                {theme.poeticLine}
              </p>
              {families ? (
                <p className="mt-1 text-[12.5px] leading-7" style={{ color: INK }}>
                  به همراه خانواده‌های {families}
                </p>
              ) : null}
              <p className="mt-2 text-left font-display text-[16px] leading-7" style={{ color: INK }}>
                قربانت، {couple}
              </p>
              <HeartSticker className="absolute -bottom-3 left-4 h-9 w-9" style={{ transform: "rotate(-12deg)" }} />
            </Page>

            {/* Date */}
            <Page tilt={0.7} className="text-center">
              <p className="text-[12px] leading-7" style={{ color: RED_INK }}>
                روزی که توی تقویم قرمزش کردیم
              </p>
              <div className="relative mx-auto mt-2 h-40 w-44">
                <HeartSticker className="absolute inset-0 h-full w-full" color="#e2566b" />
                <div className="absolute inset-0 flex flex-col items-center justify-center pb-4 text-white">
                  <span className="text-[12px]">{parts.weekday}</span>
                  <span className="font-display text-[44px] leading-none">{parts.day || "♥"}</span>
                  <span className="text-[13px]">
                    {parts.month} {parts.year}
                  </span>
                </div>
              </div>
              {timeFa ? (
                <p className="mt-1 flex items-center justify-center gap-1.5 text-[13px] leading-7" style={{ color: INK }}>
                  <Clock3 className="h-4 w-4" />
                  {timeFa}
                </p>
              ) : null}
              <p className="flex items-center justify-center gap-1.5 text-[12px] leading-7 text-[#8a5a5a]">
                <Music2 className="h-3.5 w-3.5" />
                {theme.musicTitle}
              </p>
              {showCountdown ? (
                <>
                  <p className="mt-3 text-[12px] leading-7" style={{ color: RED_INK }}>
                    روزشماری تا آن شب
                  </p>
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="mt-1 [&>div]:rounded-none [&>div]:border-2 [&>div]:border-dashed [&>div]:border-[#1f3c88]/40 [&>div]:bg-white/60 [&_p:first-child]:font-display [&_p:first-child]:text-3xl [&_p:first-child]:text-[#1f3c88] [&_p:last-child]:text-[#c0392b]"
                  />
                </>
              ) : null}
              {calendarHref ? (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-[#1f3c88]/40 px-4 py-1.5 text-xs transition hover:bg-[#1f3c88]/5"
                  style={{ color: INK }}
                >
                  <CalendarDays className="h-4 w-4" />
                  توی تقویمت علامت بزن
                </a>
              ) : null}
            </Page>

            {/* Folded heart note */}
            <section className="flex flex-col items-center text-center">
              <p className="font-display text-[17px] text-[#8e2a3b]">یک نامه‌ی تاشده لای دفتر بود…</p>
              <button
                type="button"
                onClick={() => setNoteOpen((v) => !v)}
                aria-expanded={noteOpen}
                aria-label={noteOpen ? "تا کردن نامه" : "باز کردن نامه‌ی تاشده"}
                className="relative mt-4"
              >
                {noteOpen ? (
                  <span
                    className="block w-[280px] rotate-[-1.5deg] rounded-[4px] px-6 pb-6 pt-7 text-right shadow-[0_14px_28px_-16px_rgba(90,40,30,0.7)]"
                    style={{ ...LINED, backgroundColor: "#fde9ee", animation: "yd-rise 0.6s ease-out both" }}
                  >
                    <span className="block font-display text-[16px] leading-7" style={{ color: RED_INK }}>
                      قول‌های ما به هم:
                    </span>
                    {["همیشه اول سلام کنیم", "دعوامان هیچ‌وقت به فردا نکشد", "هر سال همین روز، این دفتر را با هم ورق بزنیم"].map(
                      (line, i) => (
                        <span key={line} className="block text-[13px] leading-7" style={{ color: INK }}>
                          {(i + 1).toLocaleString("fa-IR")}. {line}
                        </span>
                      ),
                    )}
                    <span className="mt-1 block text-left text-[12px] leading-7 text-[#8a5a5a]">— امضا: دو دلداده</span>
                  </span>
                ) : (
                  <span className="relative block h-28 w-32" style={{ animation: "yd-wiggle 2.4s ease-in-out infinite" }}>
                    <svg viewBox="0 0 100 96" className="h-full w-full drop-shadow-[0_8px_10px_rgba(120,40,50,0.35)]" aria-hidden>
                      <path d={HEART_PATH} fill="#fbe3e8" stroke="#d98b95" strokeWidth="1.5" />
                      <path d="M50 19 L50 90 M4 33 L50 60 L96 33" stroke="#d98b95" strokeWidth="1" fill="none" opacity="0.7" />
                      <path d={HEART_PATH} fill="#e2566b" transform="translate(43 52) scale(0.14)" />
                    </svg>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-[#8a5a5a]">بازش کن</span>
                  </span>
                )}
              </button>
            </section>

            {/* Schedule */}
            <Page id="schedule" tilt={-0.5}>
              <h2 className="font-display text-[22px] leading-7" style={{ color: RED_INK }}>
                برنامه‌ی آن شب
              </h2>
              <ol className="mt-1">
                {schedule.map((item, i) => (
                  <li key={`${item.time}-${item.title}`} className="relative py-[2px]">
                    <div className="flex items-center gap-2 leading-7">
                      <span className="relative shrink-0 px-1.5 text-[12px]" style={{ color: RED_INK }}>
                        <span className="absolute -inset-x-0.5 -inset-y-0.5 rounded-[50%] border-[1.5px] border-[#c0392b]/70" style={{ transform: `rotate(${i % 2 ? 4 : -5}deg)` }} />
                        {item.time}
                      </span>
                      <span className="font-display text-[17px]" style={{ color: INK }}>
                        {item.title}
                      </span>
                    </div>
                    <p className="pr-1 text-[12.5px] leading-7" style={{ color: INK }}>
                      {item.description}
                    </p>
                  </li>
                ))}
              </ol>
              <HeartSticker className="absolute -top-3 left-5 h-8 w-8" color="#f08a9c" style={{ transform: "rotate(14deg)" }} />
            </Page>

            {/* Postcard venue */}
            {showMap ? (
              <section
                id="location"
                className="relative scroll-mt-20 rotate-[0.8deg] rounded-[6px] border border-[#d9c9a8] bg-[#fffaf0] p-4 shadow-[0_16px_30px_-18px_rgba(90,40,30,0.6)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] tracking-[0.3em] text-[#8a5a5a]">کارت پستال</p>
                    <h2 className="mt-1 font-display text-[22px] leading-8" style={{ color: INK }}>
                      {data.venueName || "محل جشن"}
                    </h2>
                    {data.venueAddress ? (
                      <p className="mt-1 border-b border-dashed border-[#1f3c88]/30 pb-1 text-[12.5px] leading-7" style={{ color: INK }}>
                        {data.venueAddress}
                      </p>
                    ) : null}
                    <p className="mt-1 border-b border-dashed border-[#1f3c88]/30 pb-1 text-[12px] leading-7 text-[#8a5a5a]">
                      منتظرتیم، زود بیا!
                    </p>
                  </div>
                  <div className="relative shrink-0">
                    <div className="h-[74px] w-[60px] border-[3px] border-dotted border-[#e4d6b8] bg-white p-1 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.25)]">
                      <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(160deg,#f6c9cf,#d98b95)]">
                        <HeartSticker className="h-7 w-7" color="#b8475a" />
                        <span className="mt-1 text-[8px] text-white">پست ایران</span>
                      </div>
                    </div>
                    <span className="absolute -bottom-4 -left-6 flex h-14 w-14 rotate-[-14deg] items-center justify-center rounded-full border-2 border-[#c0392b]/50 text-center text-[8px] leading-3 text-[#c0392b]/70">
                      {parts.day ? `${parts.day} ${parts.month}` : "به یادگار"}
                    </span>
                  </div>
                </div>
                {query ? (
                  <div className="mt-5 grid grid-cols-3 gap-2">
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
                        className="flex items-center justify-center gap-1 rounded-full border-2 border-[#b8475a]/30 py-2 text-xs text-[#8e2a3b] transition hover:bg-[#b8475a]/10"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Pencils dress code */}
            <Page tilt={-0.6} className="text-center">
              <h2 className="font-display text-[22px] leading-7" style={{ color: RED_INK }}>
                با این مدادرنگی‌ها بیا
              </h2>
              <p className="mt-1 text-[12.5px] leading-7" style={{ color: INK }}>
                {theme.dressCode}
              </p>
              <div className="mt-4 flex items-end justify-center gap-5">
                {PENCILS.map((p, i) => (
                  <div key={p.label} className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 24 120" className="h-28 w-6" style={{ transform: `rotate(${i % 2 ? 4 : -4}deg)` }} aria-hidden>
                      <polygon points="12,0 4,22 20,22" fill="#f1d7b0" />
                      <polygon points="12,0 9,9 15,9" fill={p.color} />
                      <rect x="4" y="22" width="16" height="86" fill={p.color} />
                      <rect x="4" y="22" width="5" height="86" fill="#fff" opacity="0.22" />
                      <rect x="4" y="108" width="16" height="8" fill="#c9c9c9" />
                      <rect x="4" y="116" width="16" height="4" rx="2" fill="#e9a3ad" />
                    </svg>
                    <span className="text-[11px]" style={{ color: INK }}>
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
            </Page>

            {/* RSVP keepsake */}
            {features?.rsvp !== false ? (
              <Page id="rsvp" tilt={0.5}>
                <h2 className="flex items-center gap-2 font-display text-[22px] leading-7" style={{ color: RED_INK }}>
                  <PenLine className="h-5 w-5" />
                  یه یادگاری برامون بنویس
                </h2>
                {signed ? (
                  <div className="relative mt-2" style={{ animation: "yd-rise 0.6s ease-out both" }}>
                    <p className="font-display text-[17px] leading-7" style={{ color: INK }}>
                      {guestNote.trim() || (attending ? "حتماً میام! مبارکتون باشه ♥" : "دلم پیشتونه، ببخشید که نمی‌تونم بیام")}
                    </p>
                    <p className="text-[12.5px] leading-7" style={{ color: INK }}>
                      {attending ? `با ${guests.toLocaleString("fa-IR")} نفر میام` : "این بار نمی‌رسم"}
                    </p>
                    <p className="text-left font-display text-[16px] leading-7" style={{ color: INK }}>
                      به یادگار — {guestName.trim() || "یک دوست"}
                    </p>
                    <HeartSticker className="absolute -top-2 left-2 h-12 w-12" style={{ animation: "yd-pop 0.7s ease-out both" }} />
                    <button
                      type="button"
                      onClick={() => setSigned(false)}
                      className="mt-2 text-[12px] leading-7 underline decoration-dashed"
                      style={{ color: RED_INK }}
                    >
                      ویرایش یادگاری
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: true, label: "حتماً میام" },
                        { value: false, label: "نمی‌تونم بیام" },
                      ].map(({ value, label }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAttending(value)}
                          className={`rounded-full border-2 py-2 text-[13px] transition ${
                            attending === value
                              ? "border-[#8e2a3b] bg-[#8e2a3b] text-[#fff3ea]"
                              : "border-[#8e2a3b]/30 text-[#8e2a3b]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="اسمت…"
                      className="h-9 border-b-2 border-dashed border-[#1f3c88]/35 bg-transparent px-1 font-display text-[16px] outline-none placeholder:text-[#1f3c88]/40"
                      style={{ color: INK }}
                    />
                    <textarea
                      value={guestNote}
                      onChange={(e) => setGuestNote(e.target.value)}
                      placeholder="یه جمله‌ی یادگاری…"
                      rows={2}
                      className="resize-none bg-transparent px-1 font-display text-[16px] leading-7 outline-none placeholder:text-[#1f3c88]/40"
                      style={{ color: INK }}
                    />
                    <div className={`flex items-center justify-between transition ${attending ? "" : "pointer-events-none opacity-40"}`}>
                      <span className="text-[13px] leading-7" style={{ color: INK }}>
                        چند نفر میاین؟
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1f3c88]/40 active:scale-90"
                          style={{ color: INK }}
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-display text-xl" style={{ color: INK }}>
                          {guests.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.min(8, g + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f3c88] text-white active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSigned(true)}
                      className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#8e2a3b] py-3 text-sm font-bold text-[#fff3ea] shadow-[0_10px_22px_-10px_rgba(142,42,59,0.8)] active:scale-95"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                      {preview ? "امضا کن و برچسب بزن" : "امضا کن و بفرست"}
                    </button>
                  </div>
                )}
              </Page>
            ) : null}

            {/* Blessing */}
            <section className="text-center">
              <PressedFlower className="mx-auto h-24 w-12 rotate-[-8deg]" />
              <p className="mt-2 font-display text-[20px] leading-9 text-[#8e2a3b]">{theme.blessingLine}</p>
              {fullDate ? <p className="mt-2 text-[12px] text-[#8a5a5a]">{fullDate}</p> : null}
            </section>

            <button
              type="button"
              onClick={closeDiary}
              className="mx-auto flex items-center gap-1.5 rounded-full border-2 border-[#8e2a3b]/40 px-4 py-2 text-xs text-[#8e2a3b] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              بستن دفتر
            </button>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#b8475a]/20 bg-[#f7e6dc]/92 px-2 backdrop-blur">
          {[
            { href: "#letter", label: "نامه", Icon: BookHeart },
            { href: "#schedule", label: "برنامه", Icon: Clock3 },
            { href: "#location", label: "نشانی", Icon: MapPin },
            { href: "#rsvp", label: "یادگاری", Icon: PenLine },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => forceOpen()}
              className="flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] text-[#8a5a5a] hover:text-[#8e2a3b]"
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
