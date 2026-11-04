"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowDown,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  Lock,
  MapPin,
  Music2,
  Navigation,
  PartyPopper,
  RotateCcw,
  Sparkles,
  Utensils,
  Wine,
  XCircle,
} from "lucide-react";
import { Countdown } from "@/templates/shared/countdown";
import {
  coupleLabel,
  coupleMonogram,
  formatEventDay,
  googleCalendarUrl,
} from "@/templates/shared/format";
import type {
  TemplateCustomization,
  TemplateRendererProps,
  TemplateScheduleItem,
} from "@/templates/types";

const DEFAULT_COVER = "/images/templates/emerald-seal-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "استقبال و نوشیدنی خوش‌آمدگویی",
    description: "شربت‌های سنتی زعفرانی و اجرای کوارتت زهی در باغ",
    icon: "cafe",
  },
  {
    time: "۱۹:۱۵",
    title: "خطبه عقد و سفره نورانی",
    description: "آیین سنتی عقد کنار سفره آیینه و شمعدان",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافت باشکوه شام شاهانه",
    description: "خوراک‌های اصیل درباری، بوفه بین‌الملل و دسرخان",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰",
    title: "برش کیک و نورافشانی آسمان",
    description: "رقص عروس و داماد، پایکوبی و آتش‌بازی",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#1b3832", label: "زمردی" },
  { color: "#c5a059", label: "طلایی" },
  { color: "#d8a48f", label: "رزگلد" },
  { color: "#1c1c19", label: "مشکی" },
];

const NODE_STYLES = [
  "from-[#775a19] to-[#5b430c]",
  "from-[#c5a059] to-[#775a19]",
  "from-[#44645f] to-[#28413d]",
  "from-[#7e5443] to-[#5c3729]",
];

function scheduleIcon(icon?: TemplateScheduleItem["icon"]) {
  switch (icon) {
    case "heart":
      return Heart;
    case "dining":
      return Utensils;
    case "music":
      return PartyPopper;
    case "cafe":
    default:
      return Wine;
  }
}

const cardSurface =
  "border border-[#c5a059]/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(252,249,244,0.92)_100%)] shadow-[0_10px_30px_-5px_rgba(119,90,25,0.06),0_1px_3px_rgba(0,0,0,0.02)]";

function GoldLine({ className = "" }: { className?: string }) {
  return (
    <span
      className={`h-px bg-[linear-gradient(90deg,transparent_0%,rgba(197,160,89,0.6)_50%,transparent_100%)] ${className}`}
    />
  );
}

export function EmeraldSealRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [open, setOpen] = useState(false);

  const theme: TemplateCustomization = {
    primaryColor: "#775a19",
    secondaryColor: "#44645f",
    backgroundColor: "#fcf9f4",
    poeticLine:
      "«تو تمنای من و یار من و جان منی، پس بمان تا که نمانم به تمنای کسی»",
    blessingLine:
      "«بنمای رخ که باغ و گلستانم آرزوست، بگشای لب که قند فراوانم آرزوست»",
    dressCode:
      "پوشش رسمی شب با تم زمردی و طلایی. خواهشمندیم بانوان از لباس کاملاً سفید پرهیز کنند.",
    musicTitle: "نوای عاشقانه جشن",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const dayFa = formatEventDay(data.eventStartAt, data.timezone);
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

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#1c1c19]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--es-gold": theme.primaryColor || "#775a19",
          "--es-emerald": theme.secondaryColor || "#44645f",
        } as CSSProperties
      }
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#fcf9f4]">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-[#fcf9f4]/80 px-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--es-gold)]/5 text-[color:var(--es-gold)]">
            <Music2 className="h-5 w-5" />
          </span>
          <div className="flex flex-col items-center">
            <span className="font-display text-2xl tracking-wide text-[color:var(--es-gold)]">
              {monogram}
            </span>
            <span className="-mt-1 text-xs font-semibold uppercase tracking-widest text-[#4e4639]">
              Invitation
            </span>
          </div>
          <span className="h-8 w-8 rounded-full bg-[color:var(--es-gold)]" />
        </header>

        <main className="flex flex-col pb-24">
          {/* Envelope theater */}
          <section className="relative flex flex-col items-center overflow-hidden px-5 pb-4 pt-4">
            <div className="mb-6 flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--es-gold)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--es-gold)] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                دعوت‌نامه رسمی دیجیتال
              </span>
              <h1 className="mt-2 font-display text-xl font-medium tracking-wide">
                جشن پیوند {couple}
              </h1>
              <p className="mt-0.5 text-sm text-[#4e4639]">
                {data.partnerOneName} &amp; {data.partnerTwoName} • Royal
                Wedding
              </p>
            </div>

            <div className="relative flex h-[480px] w-full max-w-[380px] items-center justify-center [perspective:1400px]">
              <div className="relative flex h-[320px] w-full items-center justify-center rounded-2xl bg-gradient-to-b from-[color:var(--es-emerald)] to-[#2c4743] shadow-[0_24px_50px_-12px_rgba(28,40,36,0.35)]">
                <div className="absolute inset-2 rounded-xl bg-[#263e3a] opacity-90 shadow-inner" />

                {/* Invitation card */}
                <div
                  className={`absolute z-10 flex h-[420px] w-[92%] flex-col items-center overflow-hidden rounded-xl bg-white p-4 text-center shadow-[0_20px_45px_rgba(0,0,0,0.18)] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open
                      ? "z-30 -translate-y-24 scale-100 opacity-100"
                      : "invisible translate-y-10 scale-90 opacity-0"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-1.5 rounded-lg bg-[#c5a059]/10" />
                  <div className="relative flex w-full items-center justify-between px-2 pt-1 opacity-70">
                    <span className="text-xs text-[color:var(--es-gold)]">✦</span>
                    <span className="text-[11px] font-semibold tracking-widest text-[color:var(--es-gold)]">
                      بسم الله الرحمن الرحیم
                    </span>
                    <span className="text-xs text-[color:var(--es-gold)]">✦</span>
                  </div>
                  <div className="relative mt-2 h-36 w-28 overflow-hidden rounded-b-lg rounded-t-full bg-[#f0ede9] shadow-[0_8px_20px_rgba(119,90,25,0.2)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#775a19]/30 via-transparent to-transparent" />
                  </div>
                  <h2 className="relative mt-2.5 font-display text-xl font-semibold text-[color:var(--es-gold)]">
                    {couple}
                  </h2>
                  <span className="relative -mt-0.5 text-[11px] uppercase tracking-[0.2em] text-[#4e4639]">
                    {data.partnerOneName} &amp; {data.partnerTwoName}
                  </span>
                  <p className="relative mt-2 px-3 font-display text-[15px] italic leading-6 text-[#7e5443]">
                    {theme.poeticLine}
                  </p>
                  <div className="relative mt-auto flex w-full items-center justify-around rounded-lg bg-[#f6f3ee] px-3 py-1.5">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#4e4639]">تاریخ مراسم</span>
                      <span className="text-xs font-semibold text-[color:var(--es-gold)]">
                        {dayFa || "به‌زودی"}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-[#d1c5b4]/50" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#4e4639]">مکان</span>
                      <span className="text-xs font-semibold text-[color:var(--es-gold)]">
                        {data.venueName || "اعلام می‌شود"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom pocket */}
                <div
                  className={`absolute inset-x-0 bottom-0 z-20 flex h-40 flex-col items-center justify-end rounded-b-2xl bg-gradient-to-t from-[#203632] to-[#2a4641] pb-4 shadow-[0_-4px_16px_rgba(0,0,0,0.2)] transition-opacity duration-700 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="mb-1 h-1 w-16 rounded-full bg-[#c5a059]/30" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#ffdea5] opacity-60">
                    Royal Seal
                  </span>
                </div>

                {/* Flap */}
                <div
                  className={`absolute inset-x-0 top-0 z-30 h-44 origin-top bg-gradient-to-b from-[#243d38] to-[#1c322d] shadow-[0_12px_24px_rgba(0,0,0,0.3)] transition-transform duration-700 [backface-visibility:hidden] ${
                    open ? "[transform:rotateX(180deg)]" : ""
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                >
                  <div
                    className="absolute inset-x-4 top-2 h-36 opacity-30"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background:
                        "linear-gradient(180deg, #c5a059 0%, transparent 80%)",
                    }}
                  />
                </div>

                {/* Wax seal */}
                <div
                  className={`absolute top-32 z-40 flex flex-col items-center transition-all duration-500 ${
                    open ? "pointer-events-none scale-50 opacity-0" : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-label="گشودن پاکت دعوت"
                    onClick={() => setOpen(true)}
                    className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e9c176] via-[#c5a059] to-[#775a19] p-1 shadow-[0_10px_25px_rgba(119,90,25,0.6)] transition-transform hover:scale-105 active:scale-95"
                  >
                    <span className="flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-tl from-[#775a19] via-[#c5a059] to-[#ffdea5] shadow-inner">
                      <span className="font-display text-base font-bold leading-none tracking-widest text-[#261900]">
                        {monogram}
                      </span>
                      <Lock className="mt-0.5 h-3 w-3 text-[#261900] opacity-80" />
                    </span>
                    <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#ffdea5] opacity-25" />
                  </button>
                  <span className="mt-2.5 flex animate-bounce items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[color:var(--es-gold)] shadow-md backdrop-blur">
                    برای گشودن پاکت لمس کنید
                  </span>
                </div>
              </div>
            </div>

            {open ? (
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 rounded-full bg-[#ebe8e3] px-4 py-2 text-sm font-medium text-[#4e4639] shadow-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  بستن پاکت
                </button>
                <a
                  href="#ceremony-details"
                  className="flex items-center gap-1.5 rounded-full bg-[color:var(--es-gold)] px-4 py-2 text-sm font-medium text-white shadow-md"
                >
                  <ArrowDown className="h-4 w-4" />
                  مشاهده جزئیات جشن
                </a>
              </div>
            ) : null}
          </section>

          {/* Unveiled content */}
          <div
            className={`flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open
                ? "translate-y-0 opacity-100"
                : "pointer-events-none max-h-0 translate-y-6 overflow-hidden opacity-0"
            }`}
          >
            <section className="mb-6 px-5">
              <div
                className={`flex items-center justify-between rounded-2xl p-3.5 ${cardSurface}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#775a19] via-[#c5a059] to-[#775a19] text-white shadow-md">
                    <Music2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="flex items-center gap-1 text-xs font-semibold">
                      {theme.musicTitle}
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--es-gold)]" />
                    </p>
                    <p className="text-[11px] tracking-wider text-[#4e4639]">
                      Secret Garden • Nocturne
                    </p>
                  </div>
                </div>
                <div className="flex h-5 items-end gap-1 px-2 opacity-40">
                  {[2, 4, 3, 5, 2].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-[color:var(--es-gold)]"
                      style={{ height: `${h * 4}px` }}
                    />
                  ))}
                </div>
              </div>
            </section>

            {showCountdown ? (
              <section
                id="ceremony-details"
                className="mb-8 flex scroll-mt-20 flex-col items-center px-5"
              >
                <div className="mb-3 w-full text-center">
                  <div className="mb-1 flex items-center justify-center gap-2">
                    <GoldLine className="w-8" />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--es-gold)]">
                      شمارش معکوس تا آغاز پیوند
                    </span>
                    <GoldLine className="w-8" />
                  </div>
                  <h3 className="mt-1 font-display text-xl font-medium">
                    در انتظار دیدار گرم شما هستیم
                  </h3>
                </div>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="w-full [&_div]:rounded-2xl [&_div]:border [&_div]:border-[#c5a059]/30 [&_div]:bg-white [&_div]:shadow-[0_10px_30px_-5px_rgba(119,90,25,0.06)] [&_p:first-child]:font-display [&_p:first-child]:text-[28px] [&_p:first-child]:font-semibold [&_p:first-child]:text-[color:var(--es-gold)] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#4e4639]"
                />
                {calendarHref ? (
                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--es-gold)]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : (
              <span id="ceremony-details" />
            )}

            <section className="mb-8 px-5">
              <div
                className={`flex flex-col items-center rounded-2xl border-[#775a19]/20 p-6 text-center ${cardSurface}`}
              >
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--es-gold)]/10 text-[color:var(--es-gold)] shadow-inner">
                  <Heart className="h-5 w-5" />
                </span>
                <p className="font-display text-[22px] leading-loose">
                  {theme.blessingLine}
                </p>
                <GoldLine className="my-3 w-20" />
                <span className="text-xs text-[#4e4639]">
                  {data.invitationText ||
                    "حضرت مولانا • به یمن حضور پرمهرتان در آغاز فصلی نو"}
                </span>
              </div>
            </section>

            <section className="mb-8 px-5">
              <div className="mb-4 flex items-center justify-between px-1">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--es-gold)]">
                    برنامه شب خاطره‌انگیز
                  </span>
                  <h3 className="mt-0.5 font-display text-xl font-medium">
                    زمان‌بندی مراسم
                  </h3>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--es-gold)]/10 text-[color:var(--es-gold)]">
                  <Clock className="h-5 w-5" />
                </span>
              </div>
              <div className="relative flex flex-col gap-3.5 pr-3">
                <div className="absolute bottom-4 right-5 top-4 w-px bg-gradient-to-b from-[#775a19] via-[#c5a059]/40 to-transparent" />
                {schedule.map((item, index) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <div
                      key={`${item.time}-${item.title}`}
                      className="relative flex items-start gap-3.5"
                    >
                      <span
                        className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md ${
                          NODE_STYLES[index % NODE_STYLES.length]
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className={`flex-1 rounded-2xl p-4 ${cardSurface}`}>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold">{item.title}</h4>
                          <span className="shrink-0 rounded-full bg-[color:var(--es-gold)]/10 px-2 py-0.5 text-xs font-semibold text-[color:var(--es-gold)]">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#4e4639]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {showMap ? (
              <section id="location" className="mb-8 scroll-mt-20 px-5">
                <div className={`space-y-3 rounded-2xl p-4 ${cardSurface}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--es-gold)]">
                        مکان برگزاری
                      </span>
                      <h3 className="font-display text-xl font-medium">
                        {data.venueName || "محل برگزاری"}
                      </h3>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--es-gold)]/10 text-[color:var(--es-gold)]">
                      <MapPin className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="relative flex h-44 items-end overflow-hidden rounded-xl border border-[#c5a059]/20 bg-gradient-to-br from-[#2c4743] to-[#1c322d] p-3">
                    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,222,165,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,222,165,0.25)_1px,transparent_1px)] [background-size:24px_24px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e9c176] to-[#775a19] text-white shadow-lg">
                        <MapPin className="h-5 w-5" />
                      </span>
                    </div>
                    {data.venueAddress ? (
                      <span className="relative rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[color:var(--es-gold)] shadow">
                        {data.venueAddress}
                      </span>
                    ) : null}
                  </div>
                  {query ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          href: `https://neshan.org/maps/search/${query}`,
                          label: "نشان",
                        },
                        {
                          href: `https://balad.ir/search?query=${query}`,
                          label: "بلد",
                        },
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
                          className={`flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-medium shadow-sm ${
                            i === 0
                              ? "bg-[color:var(--es-gold)] text-white"
                              : "bg-[#f0ede9] text-[#1c1c19]"
                          }`}
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            <section className="mb-8 px-5">
              <div className={`rounded-2xl p-5 text-center ${cardSurface}`}>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--es-gold)]">
                  Dress Code
                </span>
                <h3 className="font-display text-xl font-medium">
                  پوشش پیشنهادی
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#4e4639]">
                  {theme.dressCode}
                </p>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {SWATCHES.map((item) => (
                    <div key={item.label} className="flex flex-col items-center">
                      <span
                        className="mb-1.5 h-12 w-12 rounded-full border-2 border-white/80 shadow-md"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[11px] text-[#1c1c19]">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {features?.rsvp !== false ? (
              <section id="rsvp" className="mb-8 scroll-mt-20 px-5">
                <div className={`rounded-2xl p-5 ${cardSurface}`}>
                  <div className="mb-4 text-center">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--es-gold)]">
                      پاسخ شما
                    </span>
                    <h3 className="mt-0.5 font-display text-xl font-medium">
                      اعلام حضور (RSVP)
                    </h3>
                  </div>
                  {preview ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[color:var(--es-gold)] py-3 text-sm font-medium text-white shadow">
                          <CheckCircle2 className="h-4 w-4" />
                          حضور دارم
                        </div>
                        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-[#f0ede9] py-3 text-sm font-medium text-[#4e4639]">
                          <XCircle className="h-4 w-4" />
                          متأسفانه خیر
                        </div>
                      </div>
                      <div className="flex items-center justify-center rounded-xl bg-gradient-to-l from-[#775a19] to-[#c5a059] py-3.5 text-sm font-bold text-white shadow-lg">
                        ثبت پاسخ
                      </div>
                    </div>
                  ) : (
                    <a
                      href="#rsvp"
                      className="flex items-center justify-center rounded-xl bg-gradient-to-l from-[#775a19] to-[#c5a059] py-3.5 text-sm font-bold text-white shadow-lg"
                    >
                      ثبت پاسخ
                    </a>
                  )}
                </div>
              </section>
            ) : null}

            <footer className="px-5 pb-6 text-center">
              <p className="font-display text-base text-[color:var(--es-gold)]">
                با مهر و سپاس
              </p>
              <p className="font-display text-xl font-semibold">{couple}</p>
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#e5e2dd]/80 bg-[#fcf9f4]/90 px-2 backdrop-blur-xl">
          {[
            { href: "#", label: "دعوتنامه", Icon: Heart, active: true },
            { href: "#ceremony-details", label: "زمان‌بندی", Icon: Clock },
            { href: "#location", label: "لوکیشن", Icon: MapPin },
            { href: "#rsvp", label: "حضور", Icon: CheckCircle2 },
          ].map(({ href, label, Icon, active }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#") setOpen(true);
              }}
              className={`flex flex-col items-center gap-0.5 text-[11px] ${
                active
                  ? "font-semibold text-[color:var(--es-gold)]"
                  : "text-[#4e4639]"
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
