"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  CalendarDays,
  Car,
  Navigation,
  Phone,
  Power,
  RotateCcw,
  Ticket,
  Tv,
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

const DEFAULT_COVER = "/images/templates/retro-sixties-cover.jpg";

const CREAM = "#efe6d2";
const MUSTARD = "#d9a441";
const BRICK = "#c4562b";
const OLIVE = "#5b6b3a";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "شربت و شیرینی",
    description: "شربت آلبالو، شیرینی دانمارکی و نقل، توی حیاط کنار حوض",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "عقد کنون",
    description: "پای سفره‌ی عقد، با قند سابیدن و «عروس رفته گل بچینه»",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "شام عروسی",
    description: "قیمه و زرشک‌پلو با مرغ، از دیگ‌های آشپز محل",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "بزن و برقص",
    description: "ضبط صوت و نوار «مبارک بادا»، تا خود صبح",
    icon: "music",
  },
];

const BARS = ["#e9e9e9", "#e8d33a", "#3fc6c9", "#3fbf4a", "#c63fc0", "#d23a3a", "#2f45c4"];
const BULBS = ["#e94b3c", "#f2c53d", "#3fae5a", "#3b7dd8", "#e86fb0"];
const BUTTONS = [
  { color: "#8a5a3a", label: "قهوه‌ای سوخته" },
  { color: MUSTARD, label: "خردلی" },
  { color: OLIVE, label: "یشمی" },
  { color: BRICK, label: "آجری" },
];

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  const empty = { weekday: "", day: "", month: "", year: "", mm: "", yy: "" };
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
      mm: f({ month: "2-digit" }),
      yy: f({ year: "2-digit" }),
    };
  } catch {
    return empty;
  }
}

function Riseh({ count = 11, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`relative h-10 ${className}`} aria-hidden>
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-6 w-full">
        <path d="M0 2 Q 50 22 100 2" fill="none" stroke="#2b2118" strokeWidth="0.6" />
      </svg>
      {Array.from({ length: count }, (_, i) => {
        const x = (i + 0.5) / count;
        const y = 2 + 40 * x * (1 - x);
        return (
          <span
            key={i}
            className="absolute h-3 w-2 -translate-x-1/2 rounded-b-full rounded-t-[40%]"
            style={{
              left: `${x * 100}%`,
              top: `${y * 1.2}px`,
              backgroundColor: BULBS[i % BULBS.length],
              boxShadow: `0 0 8px ${BULBS[i % BULBS.length]}`,
              animation: `rs-bulb 1.6s ease-in-out ${(i % 3) * 0.5}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

function Paykan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 100" className={className} aria-hidden>
      <path d="M18 62 L28 44 Q 34 36 46 36 L 78 36 L 96 18 Q 100 14 108 14 L 150 14 Q 158 14 162 20 L 176 36 L 196 38 Q 206 40 206 50 L 206 64 Q 206 70 200 70 L 22 70 Q 16 70 18 62 Z" fill="#f4efe4" stroke="#2b2118" strokeWidth="2" />
      <path d="M100 20 L 86 36 L 128 36 L 128 20 Z" fill="#9fc3d1" stroke="#2b2118" strokeWidth="1.5" />
      <path d="M134 20 L 134 36 L 168 36 L 158 22 Q 156 20 152 20 Z" fill="#9fc3d1" stroke="#2b2118" strokeWidth="1.5" />
      <rect x="18" y="52" width="190" height="4" fill="#b9b2a2" />
      <rect x="196" y="44" width="10" height="7" rx="2" fill="#f2c53d" stroke="#2b2118" />
      <rect x="16" y="48" width="8" height="6" rx="2" fill="#e94b3c" stroke="#2b2118" />
      {[56, 166].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="70" r="15" fill="#2b2118" />
          <circle cx={cx} cy="70" r="7" fill="#c9c2b2" />
          <circle cx={cx} cy="70" r="2" fill="#2b2118" />
        </g>
      ))}
      <path d="M200 46 Q 160 30 130 14" stroke="#e86fb0" strokeWidth="3" fill="none" />
      <path d="M22 50 Q 70 30 100 14" stroke="#e86fb0" strokeWidth="3" fill="none" />
      <path d="M200 50 Q 150 40 104 14" stroke="#fff" strokeWidth="2.4" fill="none" strokeDasharray="5 3" />
      {[
        [176, 34, "#e94b3c"],
        [184, 32, "#fff"],
        [180, 27, "#e86fb0"],
        [190, 36, "#f2c53d"],
        [170, 30, "#fff"],
      ].map(([cx, cy, c], i) => (
        <circle key={i} cx={cx as number} cy={cy as number} r="5" fill={c as string} stroke="#2b2118" strokeWidth="0.8" />
      ))}
      <rect x="92" y="54" width="36" height="12" rx="2" fill="#fff" stroke="#2b2118" />
      <text x="110" y="63.5" textAnchor="middle" fontSize="8" fill="#c4562b" fontWeight="bold">
        عروس ♥
      </text>
    </svg>
  );
}

function RotaryDial({ spinning }: { spinning: boolean }) {
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full" aria-hidden>
      <circle r="58" fill={BRICK} stroke="#2b2118" strokeWidth="2" />
      <g
        style={{
          transition: "transform 900ms cubic-bezier(0.3,0.7,0.2,1)",
          transform: spinning ? "rotate(300deg)" : "rotate(0deg)",
        }}
      >
        <circle r="48" fill="#f4efe4" stroke="#2b2118" strokeWidth="1.5" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = ((-60 - i * 28) * Math.PI) / 180;
          return (
            <circle key={i} cx={Math.cos(a) * 34} cy={Math.sin(a) * 34} r="8.5" fill={BRICK} stroke="#2b2118" strokeWidth="1" />
          );
        })}
      </g>
      {Array.from({ length: 10 }, (_, i) => {
        const a = ((-60 - i * 28) * Math.PI) / 180;
        return (
          <text key={i} x={Math.cos(a) * 34} y={Math.sin(a) * 34 + 3} textAnchor="middle" fontSize="9" fill="#2b2118" fontWeight="bold">
            {((i + 1) % 10).toLocaleString("fa-IR")}
          </text>
        );
      })}
      <circle r="17" fill="#f4efe4" stroke="#2b2118" strokeWidth="1.5" />
      <text y="4" textAnchor="middle" fontSize="10" fill={BRICK} fontWeight="bold">
        ♥
      </text>
      <path d="M40 30 L 52 22" stroke="#c9c2b2" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function RetroSixtiesRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = `rs${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [stage, setStage] = useState<"off" | "warming" | "static" | "bars" | "on">("off");
  const [open, setOpen] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [call, setCall] = useState<"idle" | "dialing" | "done">("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const powerOn = () => {
    if (stage !== "off") return;
    setStage("warming");
    timers.current.push(
      window.setTimeout(() => setStage("static"), 450),
      window.setTimeout(() => setStage("bars"), 1650),
      window.setTimeout(() => setStage("on"), 2350),
      window.setTimeout(() => setOpen(true), 3100),
    );
  };

  const powerOff = () => {
    clearTimers();
    setOpen(false);
    setStage("off");
    setCall("idle");
  };

  const dial = () => {
    if (call === "dialing") return;
    setCall("dialing");
    timers.current.push(window.setTimeout(() => setCall("done"), 1500));
  };

  const theme: TemplateCustomization = {
    primaryColor: BRICK,
    secondaryColor: MUSTARD,
    backgroundColor: CREAM,
    poeticLine: "«گل اومد بهار اومد، میرم به پیشوازش؛ عروس خانم قشنگه، داماد نمی‌شه نازش»",
    blessingLine:
      "مبارک باشه ایشالا! قدمتون روی چشم؛ مثل همون عروسی‌های قدیمی، با صفا و بی‌ریا منتظرتونیم.",
    dressCode:
      "حال‌وهوای دهه‌ی شصت! کت‌وشلوار ساده، پیراهن یقه‌دار و رنگ‌های گرم مثل قهوه‌ای، خردلی، یشمی و آجری.",
    musicTitle: "نوار «مبارک بادا» — سمت الف",
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
  const powered = stage !== "off";

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#2b2118]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes rs-bulb { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes rs-flicker { 0%,100% { opacity: 1; } 45% { opacity: 0.92; } 50% { opacity: 0.78; } 55% { opacity: 0.95; } }
        @keyframes rs-roll { from { background-position: 0 0; } to { background-position: 0 6px; } }
        @keyframes rs-warm { 0% { transform: scale(1, 0.01); opacity: 1; } 60% { transform: scale(1, 0.01); } 100% { transform: scale(1, 1); opacity: 1; } }
        @keyframes rs-drive { from { transform: translateX(-120%); } to { transform: translateX(0); } }
        @keyframes rs-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#efe6d2] [background-image:repeating-linear-gradient(90deg,rgba(74,52,38,0.05)_0_18px,transparent_18px_36px)]">
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b-4 border-double border-[#4a3426] bg-[#efe6d2]/95 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 font-display text-sm text-[#4a3426]">
            <Tv className="h-4 w-4 text-[#c4562b]" />
            عروسی به سبک دهه‌ی شصت
          </span>
          <span className="rounded-md bg-[#c4562b] px-2 py-0.5 font-display text-xs text-[#efe6d2]">
            {monogram}
          </span>
        </header>

        <main className="relative flex flex-col pb-28">
          <Riseh className="mx-3 mt-1" />

          <section className="px-5 pt-1 text-center">
            <p className="text-[11px] font-bold text-[#c4562b]">بینندگان عزیز، توجه فرمایید!</p>
            <h1 className="mt-1 font-display text-[36px] leading-tight text-[#4a3426]">{couple}</h1>
            <p className="mt-1 text-[12px] text-[#6b5444]">برنامه‌ی ویژه‌ی امشب: پخش زنده‌ی جشن عروسی</p>
          </section>

          {/* TV */}
          <section className="mt-[76px] px-5">
            <div className="relative mx-auto w-full max-w-[360px]">
              <div className="pointer-events-none absolute -top-14 left-1/2 h-16 w-40 -translate-x-1/2" aria-hidden>
                <span className="absolute bottom-0 left-1/2 h-14 w-[3px] origin-bottom -translate-x-1/2 -rotate-[28deg] rounded-full bg-[#7a7266]" />
                <span className="absolute bottom-0 left-1/2 h-14 w-[3px] origin-bottom -translate-x-1/2 rotate-[28deg] rounded-full bg-[#7a7266]" />
                <span className="absolute -bottom-1 left-1/2 h-4 w-10 -translate-x-1/2 rounded-t-full bg-[#2b2118]" />
              </div>

              <div className="relative rounded-[22px] border-[3px] border-[#2b2118] bg-[linear-gradient(135deg,#8a5a34,#6b4423_45%,#5a3519)] p-3.5 shadow-[0_18px_30px_-14px_rgba(43,33,24,0.8)] [background-image:repeating-linear-gradient(100deg,rgba(0,0,0,0.08)_0_2px,transparent_2px_9px),linear-gradient(135deg,#8a5a34,#6b4423_45%,#5a3519)]">
                <div className="flex gap-3">
                  <div className="relative aspect-[4/3] flex-1 overflow-hidden rounded-[18%/22%] border-4 border-[#1b1410] bg-[#2a2d2b] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
                    {stage === "warming" ? (
                      <div className="absolute inset-0 bg-white" style={{ animation: "rs-warm 450ms ease-out both" }} />
                    ) : null}

                    {stage === "static" ? (
                      <svg className="absolute inset-0 h-full w-full" aria-hidden>
                        <filter id={`${uid}-noise`}>
                          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2">
                            <animate attributeName="seed" values="1;7;3;9;5;2" dur="0.35s" repeatCount="indefinite" />
                          </feTurbulence>
                          <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="100%" height="100%" filter={`url(#${uid}-noise)`} />
                      </svg>
                    ) : null}

                    {stage === "bars" ? (
                      <div className="absolute inset-0 flex flex-col">
                        <div className="flex flex-[3]">
                          {BARS.map((c) => (
                            <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <div className="flex flex-1 items-center justify-center bg-[#111] text-[10px] font-bold tracking-widest text-white">
                          لطفاً گیرنده‌های خود را تنظیم نفرمایید
                        </div>
                      </div>
                    ) : null}

                    {stage === "on" ? (
                      <div className="absolute inset-0" style={{ animation: "rs-flicker 3s steps(8) infinite" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cover} alt="" className="h-full w-full object-cover grayscale contrast-125" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                        <span className="absolute right-2 top-2 rounded-sm bg-white/85 px-1.5 text-[9px] font-black text-black">
                          شبکه‌ی عشق
                        </span>
                        <p className="absolute inset-x-0 bottom-2 text-center font-display text-lg text-white [text-shadow:0_2px_4px_#000]">
                          {data.partnerOneName} و {data.partnerTwoName}
                        </p>
                      </div>
                    ) : null}

                    {stage === "off" ? (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.18),transparent_45%)]" />
                    ) : null}

                    <div
                      className="pointer-events-none absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.5)_0_1px,transparent_1px_3px)]"
                      style={{ animation: powered ? "rs-roll 0.4s linear infinite" : undefined }}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[18%/22%] shadow-[inset_0_0_24px_rgba(0,0,0,0.85)]" />
                  </div>

                  <div className="flex w-[22%] flex-col items-center gap-3 rounded-xl bg-[#3a2616]/60 py-3">
                    <button
                      type="button"
                      onClick={() => (powered ? powerOff() : powerOn())}
                      aria-label={powered ? "خاموش کردن تلویزیون" : "روشن کردن تلویزیون"}
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1b1410] bg-[radial-gradient(circle_at_35%_30%,#e8dcc4,#9a8d76)] shadow-[0_3px_0_#1b1410] transition active:translate-y-0.5 ${
                        powered ? "rotate-[120deg]" : ""
                      }`}
                    >
                      <span className="absolute top-1 h-3 w-1 rounded-full bg-[#1b1410]" />
                    </button>
                    <span className="h-8 w-8 rounded-full border-2 border-[#1b1410] bg-[radial-gradient(circle_at_35%_30%,#e8dcc4,#9a8d76)]" aria-hidden />
                    <div className="mt-auto flex w-[70%] flex-col gap-[3px]" aria-hidden>
                      {Array.from({ length: 6 }, (_, i) => (
                        <span key={i} className="h-[3px] rounded-full bg-[#1b1410]/70" />
                      ))}
                    </div>
                    <span
                      className={`h-2 w-2 rounded-full ${powered ? "bg-[#e94b3c] shadow-[0_0_6px_#e94b3c]" : "bg-[#3a2616]"}`}
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
              <div className="mx-auto flex w-[80%] justify-between" aria-hidden>
                <span className="h-5 w-2.5 -skew-x-12 rounded-b bg-[#2b2118]" />
                <span className="h-5 w-2.5 skew-x-12 rounded-b bg-[#2b2118]" />
              </div>
            </div>

            {!open ? (
              <div className="mt-5 flex flex-col items-center gap-2">
                {stage === "off" ? (
                  <>
                    <button
                      type="button"
                      onClick={powerOn}
                      className="flex items-center gap-2 rounded-lg border-2 border-[#2b2118] bg-[#c4562b] px-6 py-3 text-sm font-bold text-[#efe6d2] shadow-[3px_3px_0_#2b2118] transition active:translate-y-0.5 active:shadow-none"
                    >
                      <Power className="h-4 w-4" />
                      تلویزیون رو روشن کن
                    </button>
                    <span className="text-[11px] text-[#6b5444]">برنامه‌ی ویژه از کانال عشق پخش می‌شود</span>
                  </>
                ) : (
                  <p className="text-[12px] font-bold text-[#6b5444]">
                    {stage === "on" ? "در حال پخش…" : "یه لحظه… لامپ‌ها دارن گرم می‌شن"}
                  </p>
                )}
              </div>
            ) : null}
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
            {/* Announcement */}
            <section className="rounded-xl border-2 border-[#2b2118] bg-[#f7f1e3] p-5 shadow-[5px_5px_0_#d9a441]">
              <p className="inline-block rounded bg-[#2b2118] px-2 py-0.5 text-[10px] font-bold text-[#f2c53d]">
                اطلاعیه
              </p>
              <p className="mt-3 font-display text-[18px] leading-9 text-[#4a3426]">{theme.poeticLine}</p>
              <p className="mt-3 text-[13px] leading-8 text-[#3b2c20]">
                {data.invitationText ||
                  "با سلام و احترام؛ به اطلاع دوستان و آشنایان می‌رساند که مراسم عروسی فرزندانمان برگزار می‌شود. قدم‌تان روی چشم، حتماً تشریف بیاورید."}
              </p>
              {families ? (
                <p className="mt-3 text-[12px] text-[#6b5444]">از طرف خانواده‌های {families}</p>
              ) : null}
            </section>

            {/* Kodak photo + tear-off calendar */}
            <section className="grid grid-cols-2 items-start gap-4">
              <div className="rotate-[-4deg] bg-white p-2 pb-3 shadow-[0_10px_20px_-10px_rgba(43,33,24,0.7)]">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="" className="aspect-square w-full object-cover saturate-[0.7] sepia-[35%]" />
                  <span className="absolute bottom-1.5 left-1.5 font-mono text-[11px] font-bold text-[#ff8a1f] [text-shadow:0_0_4px_rgba(255,138,31,0.8)]">
                    {parts.yy ? `'${parts.yy} ${parts.mm} ${parts.day}` : "'۶۵"}
                  </span>
                </div>
                <p className="mt-2 text-center font-display text-[13px] text-[#4a3426]">یادگاری ما</p>
              </div>

              <div className="rotate-[3deg] overflow-hidden rounded-md border-2 border-[#2b2118] bg-white text-center shadow-[0_10px_20px_-10px_rgba(43,33,24,0.7)]">
                <div className="relative bg-[#c4562b] py-2 text-[#efe6d2]">
                  <div className="absolute inset-x-3 -top-1 flex justify-between" aria-hidden>
                    {Array.from({ length: 6 }, (_, i) => (
                      <span key={i} className="h-3 w-1.5 rounded-full bg-[#2b2118]" />
                    ))}
                  </div>
                  <p className="pt-1 font-display text-[15px]">{parts.month || "روز عروسی"}</p>
                  <p className="text-[10px] opacity-80">{parts.year}</p>
                </div>
                <p className="py-1 font-display text-[64px] leading-none text-[#2b2118]">{parts.day || "؟"}</p>
                <p className="border-t border-dashed border-[#2b2118]/40 py-1.5 text-[12px] font-bold text-[#c4562b]">
                  {parts.weekday}
                </p>
                <p className="pb-2 text-[10px] text-[#6b5444]">{timeFa}</p>
              </div>
            </section>

            {/* Coupons */}
            <section id="schedule" className="scroll-mt-20">
              <div className="text-center">
                <p className="text-[11px] font-bold text-[#c4562b]">دفترچه‌ی کوپن شادی</p>
                <h2 className="mt-1 font-display text-2xl text-[#4a3426]">کوپن‌های جشن</h2>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-0 rounded-md border-2 border-[#2b2118] bg-[#f5e7b8]">
                {schedule.map((item, i) => (
                  <div
                    key={`${item.time}-${item.title}`}
                    className={`relative p-3 ${i % 2 === 0 ? "border-l-2 border-dashed border-[#2b2118]/50" : ""} ${
                      i < schedule.length - 2 ? "border-b-2 border-dashed border-[#2b2118]/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#2b2118] px-1.5 text-[10px] font-bold text-[#f5e7b8]">
                        کوپن {(i + 1).toLocaleString("fa-IR")}
                      </span>
                      <span className="font-mono text-[12px] font-bold text-[#c4562b]">{item.time}</span>
                    </div>
                    <p className="mt-2 font-display text-[16px] text-[#4a3426]">{item.title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-[#5a4434]">{item.description}</p>
                    <span className="absolute bottom-2 left-2 rotate-[-14deg] rounded-full border border-[#5b6b3a]/60 px-1.5 text-[8px] font-bold text-[#5b6b3a]/80">
                      سهمیه: بی‌نهایت
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Countdown LCD */}
            {showCountdown ? (
              <section className="mx-auto w-full rounded-[28px] border-2 border-[#2b2118] bg-[linear-gradient(180deg,#5a5a5a,#2e2e2e)] p-4 shadow-[0_14px_24px_-14px_rgba(0,0,0,0.8)]">
                <div className="mb-2 flex items-center justify-between px-1 text-[9px] font-bold tracking-[0.2em] text-[#d9d9d9]">
                  <span>ALARM · CHRONOGRAPH</span>
                  <span className="text-[#f2c53d]">تا شب عروسی</span>
                </div>
                <div className="rounded-lg border-2 border-[#1b1b1b] bg-[#a9b59a] p-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]">
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-md [&>div]:border-0 [&>div]:bg-transparent [&>div]:py-2 [&_p:first-child]:font-mono [&_p:first-child]:text-[28px] [&_p:first-child]:text-[#1d2418] [&_p:last-child]:text-[10px] [&_p:last-child]:font-bold [&_p:last-child]:text-[#1d2418]/80"
                  />
                </div>
              </section>
            ) : null}

            {/* Venue with Paykan */}
            {showMap ? (
              <section id="location" className="scroll-mt-20">
                <div className="text-center">
                  <p className="text-[11px] font-bold text-[#c4562b]">ماشین عروس آماده‌ست!</p>
                  <h2 className="mt-1 font-display text-2xl text-[#4a3426]">به سوی خونه‌ی بخت</h2>
                </div>
                <div className="relative mt-4 overflow-hidden rounded-xl border-2 border-[#2b2118] bg-[linear-gradient(180deg,#bfe0e8_0%,#e9f3f2_62%,#7a7266_62%,#7a7266_100%)] pt-4">
                  <div
                    className="mx-auto w-[82%]"
                    style={{ animation: open ? "rs-drive 1.6s cubic-bezier(0.2,0.8,0.2,1) both" : undefined }}
                  >
                    <div style={{ animation: "rs-bounce 0.5s ease-in-out infinite" }}>
                      <Paykan className="w-full" />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-2 flex justify-around" aria-hidden>
                    {Array.from({ length: 6 }, (_, i) => (
                      <span key={i} className="h-1 w-6 bg-[#efe6d2]/80" />
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-xl border-2 border-[#2b2118] bg-[#f7f1e3] p-4 text-center">
                  <p className="font-display text-xl text-[#4a3426]">{data.venueName || "محل جشن"}</p>
                  {data.venueAddress ? (
                    <p className="mt-1 text-[12px] leading-6 text-[#5a4434]">{data.venueAddress}</p>
                  ) : null}
                </div>
                {query ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
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
                        className="flex items-center justify-center gap-1 rounded-lg border-2 border-[#2b2118] bg-[#f2c53d] py-2.5 text-xs font-bold text-[#2b2118] shadow-[2px_2px_0_#2b2118] active:translate-y-0.5 active:shadow-none"
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
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#2b2118] bg-[#5b6b3a] py-2.5 text-xs font-bold text-[#efe6d2]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    یادداشت توی تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Dress code buttons */}
            <section className="text-center">
              <p className="text-[11px] font-bold text-[#c4562b]">از خیاطی محل</p>
              <h2 className="mt-1 font-display text-2xl text-[#4a3426]">رنگ لباس‌ها</h2>
              <p className="mt-2 text-[13px] leading-7 text-[#5a4434]">{theme.dressCode}</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {BUTTONS.map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1.5">
                    <span
                      className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#2b2118] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]"
                      style={{ backgroundColor: b.color }}
                    >
                      <span className="grid grid-cols-2 gap-1.5">
                        {[0, 1, 2, 3].map((h) => (
                          <span key={h} className="h-2 w-2 rounded-full bg-[#efe6d2] ring-1 ring-[#2b2118]/50" />
                        ))}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold">{b.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP rotary phone */}
            {features?.rsvp !== false ? (
              <section id="rsvp" className="scroll-mt-20 rounded-xl border-2 border-[#2b2118] bg-[#f7f1e3] p-5 text-center shadow-[5px_5px_0_#5b6b3a]">
                <p className="text-[11px] font-bold text-[#c4562b]">زنگ بزن خبر بده</p>
                <h2 className="mt-1 font-display text-2xl text-[#4a3426]">میای عروسی؟</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "معلومه که میام!" },
                    { value: false, label: "شرمنده، نمی‌رسم" },
                  ].map(({ value, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setAttending(value);
                        setCall("idle");
                      }}
                      className={`rounded-lg border-2 border-[#2b2118] py-3 text-[13px] font-bold transition ${
                        attending === value ? "bg-[#2b2118] text-[#f2c53d]" : "bg-transparent"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className={`mt-3 flex items-center justify-between rounded-lg border-2 border-dashed border-[#2b2118]/40 px-4 py-2.5 transition ${attending ? "" : "pointer-events-none opacity-40"}`}>
                  <span className="text-[13px] font-bold">چند نفرین؟</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#2b2118] font-bold active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-5 font-display text-xl text-[#c4562b]">{guests.toLocaleString("fa-IR")}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#2b2118] bg-[#f2c53d] font-bold active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={dial}
                    aria-label="شماره گرفتن و فرستادن پاسخ"
                    className="h-32 w-32 shrink-0 rounded-full transition active:scale-95"
                  >
                    <RotaryDial spinning={call === "dialing"} />
                  </button>
                  <div className="min-w-0 text-right">
                    <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#4a3426]">
                      <Phone className="h-4 w-4 text-[#c4562b]" />
                      {call === "idle" ? "صفحه رو بچرخون" : call === "dialing" ? "بوق آزاد… دوووت…" : "الو؟ پیغامت رسید!"}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-[#5a4434]">
                      {call === "done"
                        ? attending
                          ? `قدمتون روی چشم؛ ${guests.toLocaleString("fa-IR")} نفر یادداشت شد.`
                          : "جاتون خیلی خالی می‌مونه."
                        : preview
                          ? "روی صفحه‌ی تلفن بزن تا جوابت برسه"
                          : "با یه چرخش، جوابت رو بفرست"}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            {/* Blessing */}
            <section className="relative overflow-hidden rounded-xl border-2 border-[#2b2118] bg-[#4a3426] px-5 pb-7 pt-2 text-center text-[#efe6d2]">
              <Riseh count={9} />
              <p className="mt-2 font-display text-[30px] text-[#f2c53d]">مبارک باشه!</p>
              <p className="mt-3 font-display text-lg leading-9">{theme.blessingLine}</p>
              <p className="mt-4 text-[11px] text-[#d9a441]">♪ {theme.musicTitle}</p>
            </section>

            <button
              type="button"
              onClick={powerOff}
              className="mx-auto flex items-center gap-1.5 rounded-lg border-2 border-[#2b2118] bg-[#f7f1e3] px-4 py-2 text-xs font-bold shadow-[2px_2px_0_#2b2118] active:translate-y-0.5 active:shadow-none"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              تلویزیون رو خاموش کن
            </button>

            <footer className="pb-4 text-center text-[11px] font-bold text-[#6b5444]">
              {couple} · ساخت ایران، با عشق دهه‌ی شصتی
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t-4 border-double border-[#4a3426] bg-[#efe6d2]/95 px-2 backdrop-blur">
          {[
            { href: "#", label: "تلویزیون", Icon: Tv },
            { href: "#schedule", label: "کوپن‌ها", Icon: Ticket },
            { href: "#location", label: "ماشین عروس", Icon: Car },
            { href: "#rsvp", label: "تلفن", Icon: Phone },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#" && !open) {
                  clearTimers();
                  setStage("on");
                  setOpen(true);
                }
              }}
              className="flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] font-bold text-[#6b5444] hover:text-[#c4562b]"
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
