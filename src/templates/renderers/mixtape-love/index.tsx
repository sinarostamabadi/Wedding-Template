"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CalendarDays,
  CassetteTape,
  Check,
  FastForward,
  Heart,
  ListMusic,
  Mic,
  Navigation,
  Play,
  Radio,
  Rewind,
  Square,
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

const DEFAULT_COVER = "/images/templates/mixtape-love-cover.jpg";

const INK = "#22223b";
const PAPER = "#f6efe2";
const CORAL = "#ff6b5b";
const MINT = "#5ec2b0";
const YELLOW = "#ffd84d";
const LILAC = "#b8a4e3";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "اینترو: سلام و خوش‌آمد",
    description: "استقبال از مهمان‌ها با شربت خنک و یک پلی‌لیست آرام",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "تک‌آهنگ: بله‌ی بزرگ",
    description: "آیین عقد؛ همان لحظه‌ای که این نوار برایش ضبط شد",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "میان‌پرده: شام",
    description: "ضیافت شام، خنده و خاطره‌بازی با عزیزانمان",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "ترک مخفی: پیست رقص",
    description: "برش کیک و رقص تا وقتی که نوار به آخر برسد",
    icon: "music",
  },
];

const SHELLS = [
  { color: CORAL, label: "مرجانی" },
  { color: MINT, label: "نعنایی" },
  { color: YELLOW, label: "لیمویی" },
  { color: LILAC, label: "یاسی" },
];

const REQUESTS = ["عاشقانه‌ی آرام", "پاپ شاد", "سنتی و اصیل", "فقط رقص!"];

const VU = [0.2, 0.7, 0.35, 0.9, 0.5, 0.15, 0.6, 0.3];

const STATION = 100.5;

function Reel({ spinning, tape }: { spinning: boolean; tape: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`h-full w-auto ${spinning ? "animate-[spin_1.8s_linear_infinite]" : ""}`}
      aria-hidden
    >
      <circle cx="20" cy="20" r={tape} fill="#4a3a32" />
      <circle cx="20" cy="20" r="9" fill="#fffaf0" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <rect
          key={deg}
          x="19"
          y="11.5"
          width="2"
          height="3"
          rx="0.6"
          fill={INK}
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="3.2" fill={INK} />
    </svg>
  );
}

function Cassette({
  color = CORAL,
  spinning = false,
  label,
  className = "",
}: {
  color?: string;
  spinning?: boolean;
  label?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[1.58] rounded-[10%/16%] border-2 shadow-[0_14px_28px_-14px_rgba(34,34,59,0.7)] ${className}`}
      style={{ backgroundColor: color, borderColor: INK }}
    >
      {[
        "left-[3%] top-[5%]",
        "right-[3%] top-[5%]",
        "left-[3%] bottom-[5%]",
        "right-[3%] bottom-[5%]",
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} h-[5%] w-[3.2%] rounded-full bg-[#22223b]/60`}
        />
      ))}

      <div className="absolute inset-x-[8%] top-[9%] h-[60%] overflow-hidden rounded-[6%/10%] bg-[#fffaf0]">
        <div className="flex h-[12%] w-full">
          <span className="flex-1" style={{ backgroundColor: CORAL }} />
          <span className="flex-1" style={{ backgroundColor: YELLOW }} />
          <span className="flex-1" style={{ backgroundColor: MINT }} />
          <span className="flex-1" style={{ backgroundColor: LILAC }} />
        </div>
        {label ? (
          <div className="absolute inset-x-0 top-[13%] h-[28%] px-[5%]">{label}</div>
        ) : null}
        <div className="absolute left-1/2 top-[46%] flex h-[40%] w-[64%] -translate-x-1/2 items-center justify-between rounded-full bg-[#22223b] px-[5%] py-[2.5%]">
          <Reel spinning={spinning} tape={18} />
          <span className="mx-[3%] h-[55%] flex-1 rounded-sm bg-[#4a3a32]/80" />
          <Reel spinning={spinning} tape={12} />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-[20%] right-[20%] h-[22%] rounded-t-[14%_40%] border-2 border-b-0"
        style={{ borderColor: INK, backgroundColor: "rgba(34,34,59,0.12)" }}
      >
        <span className="absolute left-[22%] top-[38%] h-[30%] w-[7%] rounded-full bg-[#22223b]" />
        <span className="absolute right-[22%] top-[38%] h-[30%] w-[7%] rounded-full bg-[#22223b]" />
      </div>
    </div>
  );
}

export function MixtapeLoveRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [stage, setStage] = useState<"closed" | "loading" | "playing" | "open">(
    "closed",
  );
  const [counter, setCounter] = useState(0);
  const [side, setSide] = useState<"A" | "B">("A");
  const [freq, setFreq] = useState(96);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [request, setRequest] = useState(REQUESTS[0]);
  const timers = useRef<number[]>([]);

  const open = stage === "open";
  const loaded = stage !== "closed";
  const rolling = stage === "playing" || stage === "open";

  useEffect(() => {
    if (!rolling) return;
    const id = window.setInterval(() => setCounter((c) => (c + 1) % 1000), 90);
    return () => window.clearInterval(id);
  }, [rolling]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const playTape = () => {
    if (stage !== "closed") return;
    setStage("loading");
    timers.current.push(
      window.setTimeout(() => setStage("playing"), 850),
      window.setTimeout(() => setStage("open"), 2500),
    );
  };

  const rewind = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setStage("closed");
    setCounter(0);
    setSide("A");
  };

  const theme: TemplateCustomization = {
    primaryColor: CORAL,
    secondaryColor: MINT,
    backgroundColor: PAPER,
    poeticLine: "«هر ترانه‌ای که دوست داشتم، یک جایی وسطش اسم تو بود»",
    blessingLine:
      "این نوار بدون صدای خنده‌ی شما کامل نمی‌شود؛ بیایید آخرین ترکش را با هم ضبط کنیم.",
    dressCode:
      "حال‌وهوای دهه‌ی هفتاد و هشتاد! رنگ‌های شاد پاستلی، پیراهن گل‌دار یا هر چیزی که با رنگ یکی از این کاست‌ها جور باشد.",
    musicTitle: "میکس‌تیپ ما — ساید A",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const dayFa = formatEventDay(data.eventStartAt, data.timezone);
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
  const half = Math.ceil(schedule.length / 2);
  const tracks = side === "A" ? schedule.slice(0, half) : schedule.slice(half);
  const trackOffset = side === "A" ? 0 : half;
  const showCountdown = features?.countdown !== false && !!data.eventStartAt;
  const showMap =
    features?.map !== false &&
    !!(data.venueName || data.venueAddress || data.mapUrl);
  const query = encodeURIComponent(
    data.mapUrl ||
      [data.venueName, data.venueAddress].filter(Boolean).join(" ") ||
      "",
  );
  const tuned = Math.abs(freq - STATION) < 0.8;
  const needle = ((freq - 88) / 20) * 100;

  const tapeLabel = (
    <div className="flex h-full items-center justify-between gap-1">
      <span className="font-display text-[clamp(14px,5vw,22px)] font-bold leading-none text-[#ff6b5b]">
        A
      </span>
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate font-display text-[clamp(11px,3.6vw,16px)] font-bold leading-tight text-[#22223b]">
          {data.partnerOneName} ♥ {data.partnerTwoName}
        </p>
        <p className="text-[clamp(5px,1.6vw,8px)] font-bold uppercase tracking-[0.25em] text-[#22223b]/60">
          Mixtape · For You
        </p>
      </div>
      <span className="text-[clamp(6px,1.8vw,9px)] font-black text-[#22223b]/70">
        C-60
      </span>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#22223b]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes mt-vu { 0%,100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
        @keyframes mt-float { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-6px) rotate(-2deg); } }
        @keyframes mt-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        @keyframes mt-wave { from { background-position: 0 0; } to { background-position: 40px 0; } }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#f6efe2] [background-image:linear-gradient(rgba(34,34,59,0.07)_1px,transparent_1px)] [background-size:100%_28px]">
        <span className="pointer-events-none absolute inset-y-0 right-9 w-px bg-[#ff6b5b]/35" />

        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b-2 border-[#22223b] bg-[#f6efe2]/95 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em]">
            <CassetteTape className="h-4 w-4 text-[#ff6b5b]" />
            Love Mixtape
          </span>
          <span className="rotate-3 rounded-md border-2 border-[#22223b] bg-[#ffd84d] px-2.5 py-0.5 font-display text-sm font-bold shadow-[2px_2px_0_#22223b]">
            {monogram}
          </span>
        </header>

        <main className="relative flex flex-col pb-28">
          <section className="px-5 pt-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#ff6b5b]">
              Side A · Love Songs
            </p>
            <h1 className="mt-2 font-display text-[34px] font-bold leading-tight">
              {couple}
            </h1>
            <p className="mx-auto mt-1 max-w-[290px] text-xs leading-6 text-[#4b4a63]">
              این نوار را با عشق برایت ضبط کرده‌ایم؛ بگذارش توی دستگاه و Play را
              بزن.
            </p>
          </section>

          {/* Tape deck */}
          <section className="mt-6 px-5">
            <div
              className={`transition-[padding] duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                loaded ? "pt-0" : "pt-[54%]"
              }`}
            >
              <div className="relative rounded-[28px] border-2 border-[#22223b] bg-[#3a3a5c] p-4 shadow-[6px_6px_0_#22223b]">
                <div className="mb-3 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.25em] text-[#f6efe2]/80">
                  <span>Stereo Cassette Deck</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`h-2 w-2 rounded-full ${rolling ? "bg-[#ff6b5b]" : "bg-[#f6efe2]/25"}`}
                      style={{ animation: rolling ? "mt-blink 1s steps(2) infinite" : undefined }}
                    />
                    {rolling ? "Play" : "Stop"}
                  </span>
                </div>

                <div className="relative mx-auto w-[86%]">
                  <div
                    className={`relative z-0 transition-transform duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      loaded ? "translate-y-0 rotate-0" : "-translate-y-[112%]"
                    }`}
                    style={{ animation: loaded ? undefined : "mt-float 3.2s ease-in-out infinite" }}
                  >
                    <Cassette spinning={rolling} label={tapeLabel} />
                  </div>
                  <div className="pointer-events-none absolute -inset-2 z-10 rounded-2xl border-2 border-[#22223b] bg-gradient-to-br from-white/25 via-white/5 to-transparent" />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 items-end gap-[3px] rounded-md bg-[#22223b] px-2 py-1.5" aria-hidden>
                    {VU.map((d, i) => (
                      <span
                        key={i}
                        className="h-full w-1.5 origin-bottom rounded-sm bg-gradient-to-t from-[#5ec2b0] via-[#ffd84d] to-[#ff6b5b]"
                        style={{
                          transform: rolling ? undefined : "scaleY(0.15)",
                          animation: rolling ? `mt-vu ${0.5 + d * 0.6}s ease-in-out ${d}s infinite` : undefined,
                        }}
                      />
                    ))}
                  </div>
                  <div className="rounded-md border border-[#f6efe2]/20 bg-black px-2.5 py-1 font-mono text-lg tracking-[0.2em] text-[#ffd84d] [text-shadow:0_0_8px_rgba(255,216,77,0.7)]" dir="ltr">
                    {String(counter).padStart(3, "0")}
                  </div>
                  <div className="ms-auto flex gap-1.5" dir="ltr">
                    {[
                      { Icon: Rewind, key: "rw", label: "عقب", starts: false },
                      { Icon: Play, key: "play", label: "پخش", starts: true },
                      { Icon: FastForward, key: "ff", label: "جلو", starts: true },
                      { Icon: Square, key: "stop", label: "توقف", starts: false },
                    ].map(({ Icon, key, label, starts }) => (
                      <button
                        key={key}
                        type="button"
                        aria-label={label}
                        onClick={() => (starts ? playTape() : rewind())}
                        className={`flex h-9 w-8 items-center justify-center rounded-b-md border-2 border-[#22223b] transition ${
                          key === "play" && rolling
                            ? "translate-y-1 bg-[#ff6b5b] text-[#f6efe2] shadow-none"
                            : "bg-[#f6efe2] text-[#22223b] shadow-[0_4px_0_#22223b] active:translate-y-1 active:shadow-none"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {!loaded ? (
              <div className="mt-7 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={playTape}
                  className="flex items-center gap-2.5 rounded-full border-2 border-[#22223b] bg-[#ff6b5b] px-6 py-3 text-sm font-black text-[#f6efe2] shadow-[4px_4px_0_#22223b] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22223b] active:translate-y-0.5 active:shadow-[2px_2px_0_#22223b]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  کاست را بگذار و Play کن
                </button>
                <span className="text-[11px] text-[#4b4a63]">
                  دعوت‌نامه روی ساید A ضبط شده است
                </span>
              </div>
            ) : !open ? (
              <p className="mt-6 text-center text-xs font-bold text-[#4b4a63]" style={{ animation: "mt-blink 1.2s ease-in-out infinite" }}>
                {stage === "loading" ? "در حال جا انداختن کاست…" : "در حال پخش… صدا را زیاد کن ♪"}
              </p>
            ) : null}
          </section>

          {/* Revealed content */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-10 px-5 transition-all duration-1000 ease-out ${
              open
                ? "mt-10 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            {/* J-card */}
            <section className="relative flex overflow-hidden rounded-xl border-2 border-[#22223b] bg-[#fffaf0] shadow-[6px_6px_0_#5ec2b0]">
              <div className="flex w-9 shrink-0 items-center justify-center border-l-2 border-dashed border-[#22223b]/40 bg-[#ff6b5b]">
                <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.3em] text-[#f6efe2] [writing-mode:vertical-rl]">
                  {monogram} · Mixtape Vol.1
                </span>
              </div>
              <div className="min-w-0 flex-1 p-5">
                <div className="relative mx-auto w-[62%] rotate-[-3deg] bg-white p-2 pb-7 shadow-[0_10px_24px_-10px_rgba(34,34,59,0.55)]">
                  <span className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[4deg] bg-[#ffd84d]/80" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt=""
                    className="aspect-square w-full object-cover saturate-[1.1] sepia-[15%]"
                  />
                  <p className="absolute inset-x-0 bottom-1.5 text-center font-display text-sm font-bold">
                    ما دوتا ♥
                  </p>
                </div>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#ff6b5b]">
                  J-Card · یادداشت داخل کاست
                </p>
                <p className="mt-2 font-display text-xl leading-9">{theme.poeticLine}</p>
                <p className="mt-2 text-[13px] leading-7 text-[#3b3a55]">
                  {data.invitationText ||
                    "سال‌ها برای هم آهنگ فرستادیم؛ حالا وقتش رسیده آهنگ زندگی‌مان را با هم بخوانیم. خوشحال می‌شویم در این جشن کنارمان باشید."}
                </p>
                <dl className="mt-4 divide-y divide-dashed divide-[#22223b]/30 border-y-2 border-[#22223b] text-[13px]">
                  <div className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b4a63]">
                      Recorded on
                    </dt>
                    <dd className="font-bold">{dayFa}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b4a63]">
                      Play time
                    </dt>
                    <dd className="font-bold">{timeFa || "به‌زودی"}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Now playing strip */}
            <section className="flex items-center gap-3 rounded-full border-2 border-[#22223b] bg-[#22223b] py-2 pe-5 ps-2 text-[#f6efe2]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff6b5b]">
                <CassetteTape className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#ffd84d]">
                  Now Playing
                </p>
                <p className="truncate text-sm font-bold">{theme.musicTitle}</p>
              </div>
              <span
                className="h-5 w-16 opacity-80 [background-image:repeating-linear-gradient(90deg,#5ec2b0_0_2px,transparent_2px_5px)] [mask-image:linear-gradient(90deg,transparent,#000_20%,#000_80%,transparent)]"
                style={{ animation: open ? "mt-wave 1.4s linear infinite" : undefined }}
                aria-hidden
              />
            </section>

            {/* Tracklist with flip */}
            <section id="schedule" className="scroll-mt-20">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-2xl font-bold">
                  <ListMusic className="h-5 w-5 text-[#ff6b5b]" />
                  ترک‌های شب
                </h3>
                <div className="flex rounded-full border-2 border-[#22223b] p-0.5 text-[11px] font-black" dir="ltr">
                  {(["A", "B"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSide(s)}
                      className={`rounded-full px-3 py-1 transition ${
                        side === s ? "bg-[#22223b] text-[#ffd84d]" : ""
                      }`}
                    >
                      SIDE {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="[perspective:900px]">
                <div
                  className="mx-auto w-[58%] transition-transform duration-700 [transform-style:preserve-3d]"
                  style={{ transform: side === "B" ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                  <Cassette
                    color={side === "A" ? CORAL : MINT}
                    spinning={open}
                    className="[backface-visibility:visible]"
                    label={
                      <p
                        className="text-center font-display text-[clamp(10px,3vw,14px)] font-bold"
                        style={{ transform: side === "B" ? "scaleX(-1)" : undefined }}
                      >
                        Side {side}
                      </p>
                    }
                  />
                </div>
              </div>

              <ol className="mt-5 rounded-xl border-2 border-[#22223b] bg-[#fffaf0] px-4">
                {tracks.map((item, i) => (
                  <li
                    key={`${side}-${item.time}-${item.title}`}
                    className="flex items-start gap-3 border-b border-dashed border-[#22223b]/30 py-3.5 last:border-b-0"
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#22223b] font-display text-sm font-bold"
                      style={{ backgroundColor: side === "A" ? YELLOW : LILAC }}
                    >
                      {(trackOffset + i + 1).toLocaleString("fa-IR")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold">{item.title}</p>
                      <p className="mt-0.5 text-[12px] leading-6 text-[#4b4a63]">
                        {item.description}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-[#22223b] px-2 py-0.5 font-mono text-xs text-[#ffd84d]">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-center text-[11px] text-[#4b4a63]">
                {side === "A"
                  ? "کاست را برگردان تا ساید B را ببینی ↺"
                  : "ساید B؛ بهترین‌ها را برای آخر نگه داشتیم ✦"}
              </p>
            </section>

            {/* Countdown as tape counter */}
            {showCountdown ? (
              <section className="rounded-2xl border-2 border-[#22223b] bg-[#3a3a5c] p-4 shadow-[6px_6px_0_#ffd84d]">
                <div className="mb-3 flex items-center justify-between text-[#f6efe2]">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffd84d]">
                    Tape Counter
                  </span>
                  <span className="text-[11px] font-bold">تا پخش زنده</span>
                </div>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="[&>div]:rounded-lg [&>div]:border-2 [&>div]:border-[#22223b] [&>div]:bg-[linear-gradient(180deg,#1b1b2e_0%,#2c2c44_49%,#11111c_51%,#22223b_100%)] [&>div]:py-3 [&_p:first-child]:font-mono [&_p:first-child]:text-[26px] [&_p:first-child]:text-[#f6efe2] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#ffd84d]"
                />
              </section>
            ) : null}

            {/* FM radio venue */}
            {showMap ? (
              <section id="location" className="scroll-mt-20">
                <div className="overflow-hidden rounded-[22px] border-2 border-[#22223b] bg-[#5ec2b0] shadow-[6px_6px_0_#22223b]">
                  <div className="flex items-center gap-3 p-4">
                    <div
                      className="h-16 w-16 shrink-0 rounded-full border-2 border-[#22223b] bg-[#3a3a5c] [background-image:radial-gradient(#22223b_1.4px,transparent_1.6px)] [background-size:6px_6px]"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Radio className="h-3.5 w-3.5" />
                        Live On Air
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold leading-tight">
                        {data.venueName || "محل برگزاری"}
                      </p>
                      {data.venueAddress ? (
                        <p className="mt-0.5 text-[12px] leading-5">{data.venueAddress}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="border-t-2 border-[#22223b] bg-[#fffaf0] px-4 pb-4 pt-3">
                    <div className="relative h-10 rounded-md border-2 border-[#22223b] bg-[#22223b] px-2" dir="ltr">
                      <div className="flex h-full items-end justify-between pb-1 font-mono text-[9px] text-[#f6efe2]/70">
                        {[88, 92, 96, 100, 104, 108].map((f) => (
                          <span key={f}>{f}</span>
                        ))}
                      </div>
                      <span
                        className="absolute top-1 h-5 w-[2px] -translate-x-1/2 bg-[#ffd84d]"
                        style={{ left: `${((STATION - 88) / 20) * 100}%` }}
                        aria-hidden
                      />
                      <span
                        className="absolute inset-y-0.5 w-[3px] -translate-x-1/2 rounded-full bg-[#ff6b5b] shadow-[0_0_8px_#ff6b5b] transition-[left] duration-150"
                        style={{ left: `${needle}%` }}
                        aria-hidden
                      />
                    </div>
                    <input
                      type="range"
                      min={88}
                      max={108}
                      step={0.1}
                      value={freq}
                      onChange={(e) => setFreq(Number(e.target.value))}
                      aria-label="تنظیم موج رادیو"
                      dir="ltr"
                      className="mt-3 w-full accent-[#ff6b5b]"
                    />
                    <p
                      className={`mt-1 text-center text-[12px] font-bold ${tuned ? "text-[#2f8f80]" : "text-[#4b4a63]"}`}
                    >
                      {tuned
                        ? "♥ موج عشق پیدا شد! منتظرت هستیم."
                        : `FM ${freq.toFixed(1)} · خش‌خش… موج را روی ۱۰۰٫۵ تنظیم کن`}
                    </p>
                  </div>
                </div>

                {query ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                      { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                      {
                        href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                        label: "گوگل",
                      },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-lg border-2 border-[#22223b] bg-[#fffaf0] py-2.5 text-xs font-bold transition hover:bg-[#ffd84d]"
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
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#22223b] bg-[#22223b] py-2.5 text-xs font-bold text-[#f6efe2] transition hover:bg-[#ff6b5b]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Dress code as colored shells */}
            <section>
              <h3 className="font-display text-2xl font-bold">کاست‌های رنگی</h3>
              <p className="mt-1 text-[13px] leading-7 text-[#4b4a63]">{theme.dressCode}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {SHELLS.map((s, i) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center gap-1.5"
                    style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
                  >
                    <Cassette color={s.color} className="w-full" />
                    <span className="text-[12px] font-bold">{s.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP request line */}
            {features?.rsvp !== false ? (
              <section
                id="rsvp"
                className="scroll-mt-20 rounded-2xl border-2 border-[#22223b] bg-[#fffaf0] p-5 shadow-[6px_6px_0_#b8a4e3]"
              >
                <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-[#ff6b5b]">
                  <Mic className="h-3.5 w-3.5" />
                  Request Line
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold">اعلام حضور و درخواست آهنگ</h3>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "حتماً میام!", Icon: Check },
                    { value: false, label: "این بار نه", Icon: X },
                  ].map(({ value, label, Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAttending(value)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#22223b] py-3 text-[13px] font-bold transition ${
                        attending === value ? "bg-[#22223b] text-[#ffd84d]" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>

                <div
                  className={`transition ${attending ? "" : "pointer-events-none opacity-35"}`}
                >
                  <div className="mt-3 flex items-center justify-between rounded-lg border-2 border-dashed border-[#22223b]/40 px-4 py-3">
                    <span className="text-[13px] font-bold">تعداد نفرات</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#22223b] font-bold active:scale-90"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-display text-xl font-bold">
                        {guests.toLocaleString("fa-IR")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(8, g + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#22223b] bg-[#ffd84d] font-bold active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-[12px] font-bold">برای پیست رقص چه آهنگی بگذاریم؟</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {REQUESTS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRequest(r)}
                        className={`rounded-full border-2 border-[#22223b] px-3 py-1.5 text-[12px] font-bold transition ${
                          request === r
                            ? "bg-[#ff6b5b] text-[#f6efe2] shadow-[2px_2px_0_#22223b]"
                            : "bg-transparent"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {preview ? (
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-full border-2 border-[#22223b] bg-[#5ec2b0] py-3.5 text-sm font-black shadow-[4px_4px_0_#22223b]">
                    <Mic className="h-4 w-4" />
                    ارسال درخواست
                  </div>
                ) : (
                  <a
                    href="#rsvp"
                    className="mt-5 flex items-center justify-center gap-2 rounded-full border-2 border-[#22223b] bg-[#5ec2b0] py-3.5 text-sm font-black shadow-[4px_4px_0_#22223b]"
                  >
                    <Mic className="h-4 w-4" />
                    ارسال درخواست
                  </a>
                )}
              </section>
            ) : null}

            {/* Blessing sticky note */}
            <section className="relative mx-auto w-[88%] rotate-[-2deg] bg-[#ffd84d] p-6 text-center shadow-[0_14px_24px_-12px_rgba(34,34,59,0.6)]">
              <span className="absolute -top-3 left-1/2 h-5 w-20 -translate-x-1/2 rotate-[-3deg] bg-white/60" />
              <Heart className="mx-auto h-6 w-6 fill-[#ff6b5b] text-[#ff6b5b]" />
              <p className="mt-2 font-display text-lg font-bold leading-8">
                {theme.blessingLine}
              </p>
              <p className="mt-3 text-[11px] font-bold">— {couple}</p>
            </section>

            <button
              type="button"
              onClick={rewind}
              className="mx-auto flex items-center gap-1.5 rounded-full border-2 border-[#22223b] bg-[#fffaf0] px-4 py-2 text-xs font-bold shadow-[3px_3px_0_#22223b] active:translate-y-0.5"
            >
              <Rewind className="h-3.5 w-3.5 fill-current" />
              نوار را به اول برگردان
            </button>

            <footer className="pb-4 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#4b4a63]">
              Recorded with ♥ · {couple} · Side A & B
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t-2 border-[#22223b] bg-[#f6efe2]/95 px-2 backdrop-blur">
          {[
            { href: "#", label: "کاست", Icon: CassetteTape, active: true },
            { href: "#schedule", label: "ترک‌ها", Icon: ListMusic },
            { href: "#location", label: "رادیو", Icon: Radio },
            { href: "#rsvp", label: "درخواست", Icon: Mic },
          ].map(({ href, label, Icon, active }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#" && !open) {
                  timers.current.forEach((t) => window.clearTimeout(t));
                  timers.current = [];
                  setStage("open");
                }
              }}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] font-bold ${
                active ? "text-[#ff6b5b]" : "text-[#4b4a63] hover:text-[#22223b]"
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
