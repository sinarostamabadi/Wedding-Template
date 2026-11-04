"use client";

import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  Disc3,
  Heart,
  ListMusic,
  MapPin,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Ticket,
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

const DEFAULT_COVER = "/images/templates/vinyl-love-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "مقدمه: خوش آمدید",
    description: "استقبال، نوشیدنی خنک و موسیقی زنده‌ی آکوستیک",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "قطعه‌ی اصلی: بله گفتن",
    description: "آیین عقد و لحظه‌ای که برایش سال‌ها صبر کردیم",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "میان‌پرده: شام",
    description: "ضیافت شام و گفت‌وگو کنار دوستان و خانواده",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "قطعه‌ی پایانی: تا صبح برقص",
    description: "برش کیک، دی‌جی و پیست رقص تا آخرین آهنگ",
    icon: "music",
  },
];

const PRESSINGS = [
  { color: "#1b1712", label: "مشکی کلاسیک" },
  { color: "#e0a526", label: "خردلی" },
  { color: "#7a2e2a", label: "شرابی" },
  { color: "#2f6f6a", label: "سبزآبی" },
];

const NOTES = [
  { left: 18, delay: 0, char: "♪" },
  { left: 30, delay: 1.1, char: "♫" },
  { left: 12, delay: 2.2, char: "♩" },
  { left: 36, delay: 3.1, char: "♪" },
];

const BARCODE = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 4, 1, 2, 2, 1];

function VinylDisc({
  color = "#141110",
  label,
  className = "",
  spinning = false,
}: {
  color?: string;
  label?: ReactNode;
  className?: string;
  spinning?: boolean;
}) {
  return (
    <div
      className={`relative aspect-square rounded-full shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] ${className} ${
        spinning ? "animate-[spin_3.6s_linear_infinite]" : ""
      }`}
      style={{
        backgroundColor: color,
        backgroundImage:
          "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0 1px, transparent 1px 4px)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgba(255,255,255,0.18)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,0.12)_220deg,transparent_260deg)]" />
      {label ? (
        <div className="absolute inset-[31%] flex items-center justify-center rounded-full">
          {label}
        </div>
      ) : null}
      <span className="absolute left-1/2 top-1/2 h-[4%] w-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f3ead7]" />
    </div>
  );
}

export function VinylLoveRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const open = stage === "open";
  const pulled = stage !== "closed";
  const playRecord = () => {
    if (stage !== "closed") return;
    setStage("opening");
    window.setTimeout(() => setStage("open"), 900);
  };

  const theme: TemplateCustomization = {
    primaryColor: "#e0a526",
    secondaryColor: "#d9622b",
    backgroundColor: "#f3ead7",
    poeticLine: "«تو آن ترانه‌ای که هزار بار شنیدم و هنوز تازه‌ای»",
    blessingLine:
      "حضورتان زیباترین آهنگ این آلبوم است؛ بیایید این شب را با هم بنوازیم.",
    dressCode:
      "شیک و رنگی، با حال‌وهوای رترو! هر رنگی که با یکی از نسخه‌های این آلبوم جور باشد عالی است.",
    musicTitle: "Our Song — نسخه‌ی ویژه",
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
  const showCountdown = features?.countdown !== false && !!data.eventStartAt;
  const showMap =
    features?.map !== false &&
    !!(data.venueName || data.venueAddress || data.mapUrl);
  const query = encodeURIComponent(
    data.mapUrl ||
      [data.venueName, data.venueAddress].filter(Boolean).join(" ") ||
      "",
  );

  const recordLabel = (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[radial-gradient(circle,#f0b93a_0%,#e0a526_60%,#c98d16_100%)] text-center text-[#1b1712]">
      <span className="text-[6px] font-bold uppercase tracking-[0.2em] opacity-70">
        Side A
      </span>
      <span className="font-display text-[13px] font-bold leading-tight">
        {monogram}
      </span>
      <span className="text-[6px] tracking-widest opacity-70">33⅓ RPM</span>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#1b1712]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes vl-note {
          0% { transform: translateY(0) rotate(-8deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-140px) rotate(14deg); opacity: 0; }
        }
        @keyframes vl-bar { from { width: 4%; } to { width: 100%; } }
        @keyframes vl-wiggle { 0%,100% { transform: rotate(-12deg); } 50% { transform: rotate(-4deg); } }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#f3ead7] [background-image:radial-gradient(rgba(27,23,18,0.06)_1px,transparent_1px)] [background-size:6px_6px]">
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b-2 border-[#1b1712] bg-[#f3ead7]/95 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em]">
            <Disc3 className="h-4 w-4 text-[#d9622b]" />
            Love Records
          </span>
          <span className="rounded-full border-2 border-[#1b1712] px-2.5 py-0.5 font-display text-sm font-bold">
            {monogram}
          </span>
        </header>

        <main className="flex flex-col pb-28">
          {/* Hero */}
          <section className="px-5 pt-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d9622b]">
              New Release · آلبوم تازه
            </p>
            <h1 className="mt-2 font-display text-[34px] font-bold leading-tight">
              {couple}
            </h1>
            <p className="mt-1 text-xs text-[#5c5248]">
              آلبوم مشترک زندگی‌مان منتشر می‌شود؛ شما دعوتید.
            </p>
          </section>

          {/* Sleeve + record */}
          <section className="relative mt-7 px-5">
            <div className="relative mx-auto aspect-square w-[66%]">
              {/* record (fully hidden behind sleeve until pulled) */}
              <div
                className={`absolute inset-[3%] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  pulled ? "-translate-x-[36%]" : "translate-x-0"
                }`}
              >
                <VinylDisc
                  className="h-full w-full"
                  spinning={pulled}
                  label={recordLabel}
                />
                {open
                  ? NOTES.map((n, i) => (
                      <span
                        key={i}
                        className="pointer-events-none absolute top-[20%] font-display text-2xl text-[#d9622b]"
                        style={{
                          left: `${n.left}%`,
                          animation: `vl-note 4.2s ease-out ${n.delay}s infinite`,
                        }}
                      >
                        {n.char}
                      </span>
                    ))
                  : null}
              </div>

              {/* sleeve */}
              <div
                className={`absolute inset-0 z-10 overflow-hidden border-2 border-[#1b1712] bg-[#1b1712] shadow-[8px_8px_0_#1b1712] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  pulled ? "translate-x-[24%]" : "translate-x-0"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt=""
                  className="h-full w-full object-cover opacity-90 contrast-110 grayscale-[35%] sepia-[35%]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b1712]/85 via-transparent to-[#d9622b]/25 mix-blend-multiply" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                  <span className="bg-[#f3ead7] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.25em]">
                    LP · Vol. 1
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#f3ead7]">
                    Stereo
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 text-[#f3ead7]">
                  <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-[#e0a526]">
                    The Wedding Album
                  </p>
                  <p className="mt-0.5 font-display text-2xl font-bold leading-tight">
                    {data.partnerOneName} ♥ {data.partnerTwoName}
                  </p>
                </div>
                <span
                  className="absolute left-3 top-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#d9622b] text-center text-[8px] font-black leading-tight text-[#f3ead7] shadow-md"
                  style={{ animation: "vl-wiggle 3s ease-in-out infinite" }}
                >
                  Limited
                  <br />
                  Edition
                </span>
                {/* sleeve opening edge */}
                <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/60 to-transparent" />
              </div>
            </div>

            {!pulled ? (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={playRecord}
                  className="group flex items-center gap-2.5 border-2 border-[#1b1712] bg-[#e0a526] px-6 py-3 text-sm font-black shadow-[4px_4px_0_#1b1712] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1b1712] active:translate-y-0.5 active:shadow-[2px_2px_0_#1b1712]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  صفحه را بیرون بکش و پخش کن
                </button>
                <span className="text-[11px] text-[#5c5248]">
                  جزئیات جشن روی این صفحه ضبط شده است
                </span>
              </div>
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
            {/* Now playing */}
            <section className="border-2 border-[#1b1712] bg-[#1b1712] p-4 text-[#f3ead7] shadow-[6px_6px_0_#d9622b]">
              <div className="flex items-center gap-3">
                <VinylDisc className="h-12 w-12 shrink-0" spinning label={null} />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#e0a526]">
                    Now Playing
                  </p>
                  <p className="truncate text-sm font-bold">{theme.musicTitle}</p>
                </div>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#f3ead7]/15">
                <div
                  className="h-full rounded-full bg-[#e0a526]"
                  style={{ animation: open ? "vl-bar 40s linear infinite" : undefined }}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-6 text-[#f3ead7]/80">
                <SkipForward className="h-4 w-4" />
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0a526] text-[#1b1712]">
                  <Pause className="h-4 w-4 fill-current" />
                </span>
                <SkipBack className="h-4 w-4" />
              </div>
            </section>

            {/* Liner notes */}
            <section className="relative border-2 border-[#1b1712] bg-[#fbf6ea] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d9622b]">
                Liner Notes · یادداشت آلبوم
              </p>
              <p className="mt-3 font-display text-xl leading-9">{theme.poeticLine}</p>
              <p className="mt-3 text-[13px] leading-7 text-[#3d352d]">
                {data.invitationText ||
                  "بعد از سال‌ها تمرین، بالاخره آلبوم مشترکمان را منتشر می‌کنیم. اولین اجرای زنده‌اش بدون شما کامل نیست."}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-px border-2 border-[#1b1712] bg-[#1b1712] text-center">
                <div className="bg-[#fbf6ea] p-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#5c5248]">
                    Release Date
                  </p>
                  <p className="mt-1 text-[13px] font-bold leading-5">{dayFa}</p>
                </div>
                <div className="bg-[#fbf6ea] p-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#5c5248]">
                    Showtime
                  </p>
                  <p className="mt-1 text-[13px] font-bold leading-5">
                    {timeFa || "به‌زودی"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div className="flex h-8 items-end gap-[2px]" aria-hidden>
                  {BARCODE.map((w, i) => (
                    <span
                      key={i}
                      className="h-full bg-[#1b1712]"
                      style={{ width: w }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#5c5248]">
                  CAT. NO. LOVE-001
                </span>
              </div>
            </section>

            {/* Tracklist */}
            <section id="schedule" className="scroll-mt-20">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-2xl font-bold">
                  <ListMusic className="h-5 w-5 text-[#d9622b]" />
                  فهرست قطعه‌ها
                </h3>
                <span className="border-2 border-[#1b1712] px-2 py-0.5 text-[10px] font-black">
                  SIDE A
                </span>
              </div>
              <ol className="border-y-2 border-[#1b1712]">
                {schedule.map((item, i) => (
                  <li
                    key={`${item.time}-${item.title}`}
                    className="flex items-start gap-3 border-b border-dashed border-[#1b1712]/30 py-3.5 last:border-b-0"
                  >
                    <span className="mt-0.5 w-6 font-display text-xl font-bold text-[#d9622b]">
                      {(i + 1).toLocaleString("fa-IR")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold">{item.title}</p>
                      <p className="mt-0.5 text-[12px] leading-6 text-[#5c5248]">
                        {item.description}
                      </p>
                    </div>
                    <span className="shrink-0 bg-[#1b1712] px-2 py-0.5 font-mono text-xs text-[#e0a526]">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Countdown as LED display */}
            {showCountdown ? (
              <section className="border-2 border-[#1b1712] bg-[#2a241d] p-4 shadow-[6px_6px_0_#1b1712]">
                <div className="mb-3 flex items-center justify-between text-[#f3ead7]">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e0a526]">
                    Countdown
                  </span>
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full ${i === 0 ? "animate-pulse bg-[#d9622b]" : "bg-[#f3ead7]/20"}`}
                      />
                    ))}
                  </span>
                </div>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="[&_div]:rounded-md [&_div]:border-[#e0a526]/25 [&_div]:bg-black [&_div]:py-3 [&_p:first-child]:font-mono [&_p:first-child]:text-[26px] [&_p:first-child]:text-[#ffb938] [&_p:first-child]:[text-shadow:0_0_10px_rgba(255,185,56,0.7)] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#f3ead7]"
                />
              </section>
            ) : null}

            {/* Concert ticket */}
            {showMap ? (
              <section id="location" className="scroll-mt-20">
                <div className="relative flex overflow-hidden border-2 border-[#1b1712] bg-[#d9622b] text-[#f3ead7] shadow-[6px_6px_0_#1b1712]">
                  <div className="flex-1 p-4">
                    <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-[#1b1712]">
                      <Ticket className="h-3.5 w-3.5" />
                      Live At
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold leading-tight">
                      {data.venueName || "محل برگزاری"}
                    </p>
                    {data.venueAddress ? (
                      <p className="mt-1 text-[12px] leading-5 opacity-90">
                        {data.venueAddress}
                      </p>
                    ) : null}
                  </div>
                  <div className="relative flex w-24 flex-col items-center justify-center border-r-2 border-dashed border-[#1b1712]/50 bg-[#e0a526] p-2 text-center text-[#1b1712]">
                    <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#f3ead7]" />
                    <span className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-[#f3ead7]" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Admit
                    </span>
                    <span className="font-display text-3xl font-bold">
                      {guests.toLocaleString("fa-IR")}
                    </span>
                    <span className="text-[9px] font-bold">نفر</span>
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
                        className="flex items-center justify-center gap-1 border-2 border-[#1b1712] bg-[#fbf6ea] py-2.5 text-xs font-bold transition hover:bg-[#e0a526]"
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
                    className="mt-2 flex items-center justify-center gap-1.5 border-2 border-[#1b1712] bg-[#1b1712] py-2.5 text-xs font-bold text-[#f3ead7] transition hover:bg-[#2f6f6a]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Dress code as colored pressings */}
            <section>
              <h3 className="font-display text-2xl font-bold">نسخه‌های رنگی</h3>
              <p className="mt-1 text-[13px] leading-7 text-[#5c5248]">
                {theme.dressCode}
              </p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {PRESSINGS.map((p) => (
                  <div key={p.label} className="flex flex-col items-center gap-1.5">
                    <VinylDisc
                      color={p.color}
                      className="w-full"
                      label={<span className="h-full w-full rounded-full bg-[#f3ead7]" />}
                    />
                    <span className="text-[11px] font-bold">{p.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP */}
            {features?.rsvp !== false ? (
              <section
                id="rsvp"
                className="scroll-mt-20 border-2 border-[#1b1712] bg-[#fbf6ea] p-5 shadow-[6px_6px_0_#2f6f6a]"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2f6f6a]">
                  Reserve Your Seat
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold">اعلام حضور</h3>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "حتماً میام!", Icon: Check },
                    { value: false, label: "این بار نه", Icon: X },
                  ].map(({ value, label, Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAttending(value)}
                      className={`flex items-center justify-center gap-1.5 border-2 border-[#1b1712] py-3 text-[13px] font-bold transition ${
                        attending === value
                          ? "bg-[#1b1712] text-[#e0a526]"
                          : "bg-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  className={`mt-3 flex items-center justify-between border-2 border-dashed border-[#1b1712]/40 px-4 py-3 transition ${
                    attending ? "" : "pointer-events-none opacity-35"
                  }`}
                >
                  <span className="text-[13px] font-bold">تعداد بلیت</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center border-2 border-[#1b1712] font-bold active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-display text-xl font-bold">
                      {guests.toLocaleString("fa-IR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center border-2 border-[#1b1712] bg-[#e0a526] font-bold active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
                {preview ? (
                  <div className="mt-4 flex items-center justify-center gap-2 border-2 border-[#1b1712] bg-[#2f6f6a] py-3.5 text-sm font-black text-[#f3ead7] shadow-[4px_4px_0_#1b1712]">
                    <Ticket className="h-4 w-4" />
                    رزرو صندلی
                  </div>
                ) : (
                  <a
                    href="#rsvp"
                    className="mt-4 flex items-center justify-center gap-2 border-2 border-[#1b1712] bg-[#2f6f6a] py-3.5 text-sm font-black text-[#f3ead7] shadow-[4px_4px_0_#1b1712]"
                  >
                    <Ticket className="h-4 w-4" />
                    رزرو صندلی
                  </a>
                )}
              </section>
            ) : null}

            <section className="border-2 border-[#1b1712] bg-[#e0a526] p-5 text-center">
              <Heart className="mx-auto h-6 w-6 fill-[#d9622b] text-[#d9622b]" />
              <p className="mt-2 font-display text-lg font-bold leading-8">
                {theme.blessingLine}
              </p>
            </section>

            <button
              type="button"
              onClick={() => setStage("closed")}
              className="mx-auto flex items-center gap-1.5 border-2 border-[#1b1712] bg-[#fbf6ea] px-4 py-2 text-xs font-bold shadow-[3px_3px_0_#1b1712] active:translate-y-0.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              صفحه را به کاور برگردان
            </button>

            <footer className="pb-4 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#5c5248]">
              ℗ Love Records · {couple} · All hearts reserved
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t-2 border-[#1b1712] bg-[#f3ead7]/95 px-2 backdrop-blur">
          {[
            { href: "#", label: "آلبوم", Icon: Disc3, active: true },
            { href: "#schedule", label: "قطعه‌ها", Icon: ListMusic },
            { href: "#location", label: "اجرا", Icon: MapPin },
            { href: "#rsvp", label: "بلیت", Icon: Ticket },
          ].map(({ href, label, Icon, active }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#") setStage("open");
              }}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] font-bold ${
                active ? "text-[#d9622b]" : "text-[#5c5248] hover:text-[#1b1712]"
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
