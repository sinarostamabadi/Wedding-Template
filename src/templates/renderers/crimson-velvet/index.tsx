"use client";

import { useState, type CSSProperties } from "react";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Compass,
  Diamond,
  Gift,
  Hourglass,
  MailCheck,
  MailOpen,
  MapPin,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Shirt,
  Sparkles,
  UserCheck,
  Volume2,
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

const DEFAULT_COVER = "/images/templates/crimson-velvet-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۳۰",
    title: "استقبال سلطنتی و پذیرایی آغازین",
    description: "پذیرایی با شربت انار دست‌چین، نوشیدنی‌های زعفرانی و آوای چنگ زنده",
    icon: "cafe",
  },
  {
    time: "۱۹:۴۵",
    title: "آیین پیمان و خطبه عقد",
    description: "پیرامون سفره اصیل نقره‌کوب و کریستال در عمارت آینه‌خانه",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافت شام شاهانه",
    description: "سرو غذاهای اصیل تشریفاتی به همراه منوی درباری و نوشیدنی‌های نفیس",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰",
    title: "برش کیک، والس و نورافشانی باغ",
    description: "رقص زیر باران شمع، موسیقی ارکسترال و نمایش آتش‌بازی شبانه",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#420a12", label: "زرشکی درباری" },
  { color: "#dfb76c", label: "طلایی شامپاینی" },
  { color: "#7a3834", label: "رز اسموکی" },
  { color: "#1a0306", label: "مشکی مخملی" },
];

const panel = "rounded-xl bg-[#360d13] shadow-md";

export function CrimsonVelvetRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [stage, setStage] = useState<"closed" | "opening" | "open">(
    "closed",
  );
  const open = stage === "open";
  const sealed = stage === "closed";
  const openEnvelope = () => {
    if (stage !== "closed") return;
    setStage("opening");
    window.setTimeout(() => setStage("open"), 650);
  };
  const [playing, setPlaying] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);

  const theme: TemplateCustomization = {
    primaryColor: "#fdd385",
    secondaryColor: "#dfb76c",
    backgroundColor: "#2c050b",
    poeticLine:
      "«زهی عشق زهی عشق که ما راست خدایا، چه نغزست و چه خوبست و چه زیباست خدایا»",
    blessingLine:
      "ارزشمندترین پیشکش، گرمای قدم‌های شماست؛ حضورتان بزم ما را کامل می‌کند.",
    dressCode:
      "کد پوشش: Black Tie و شب رسمی. بانوان: لباس شب بلند · آقایان: تاکسیدو یا کت‌وشلوار تیره.",
    musicTitle: "نغمه عاشقانه شب پیوند",
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
      className="relative min-h-screen overflow-x-hidden text-[#ffdadb]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--cv-gold": theme.primaryColor || "#fdd385",
          "--cv-gold-deep": theme.secondaryColor || "#dfb76c",
        } as CSSProperties
      }
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#2c050b]">
        <header className="sticky top-0 z-50 flex h-20 items-center justify-between bg-[#250207]/85 px-4 shadow-[0_4px_24px_rgba(223,183,108,0.06)] backdrop-blur-xl">
          <div className="flex items-center gap-1 text-[color:var(--cv-gold)]">
            <span className="flex h-11 w-11 items-center justify-center">
              <Volume2 className="h-5 w-5" />
            </span>
            <span className="flex h-11 w-11 items-center justify-center">
              <Share2 className="h-5 w-5" />
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display text-xl font-semibold tracking-widest text-[color:var(--cv-gold)]">
              {monogram}
            </span>
            <span
              dir="ltr"
              className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--cv-gold-deep)]"
            >
              Royal Wedding
            </span>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--cv-gold)] text-[#412d00] shadow-[0_0_12px_rgba(223,183,108,0.25)]">
            <Sparkles className="h-4 w-4" />
          </span>
        </header>

        <main className="flex flex-col gap-10 px-5 pb-28">
          <header className="flex flex-col items-center gap-2 pt-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#491b21] px-3 py-1 text-[11px] tracking-widest text-[color:var(--cv-gold)] shadow-inner">
              <Sparkles className="h-3.5 w-3.5" />
              بِسمِ ربِّ العِشق
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h1 className="font-display text-[28px] font-medium leading-9 tracking-wide text-[color:var(--cv-gold)]">
              جشن پیوند {couple}
            </h1>
            <p
              dir="ltr"
              className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#eac175]"
            >
              {data.partnerOneName} &amp; {data.partnerTwoName} · A Royal Union
            </p>
          </header>

          {/* Envelope stage */}
          <section className="relative mx-auto flex w-full flex-col items-center">
            <div
              className={`w-full transition-all duration-700 ease-in-out ${
                open
                  ? "pointer-events-none max-h-0 scale-90 overflow-hidden opacity-0"
                  : "max-h-[420px] scale-100 opacity-100"
              }`}
            >
            <div className="relative aspect-[4/3] w-full rounded-lg bg-[#250207] shadow-[0_16px_40px_-8px_rgba(15,2,4,0.8),0_2px_12px_rgba(223,183,108,0.18)] [perspective:1200px]">
              <div className="absolute inset-2 overflow-hidden rounded-lg bg-[#3b1117] opacity-90">
                <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(45deg,#dfb76c_1px,transparent_1px),linear-gradient(-45deg,#dfb76c_1px,transparent_1px)] [background-size:22px_22px]" />
              </div>

              <div className="pointer-events-none absolute inset-0 z-20">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-[#360d13]/95 shadow-md [clip-path:polygon(0_0,100%_50%,0_100%)]" />
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[#491b21]/95 shadow-md [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#360d13]/95 shadow-lg [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
              </div>

              <div
                className={`absolute inset-x-0 top-0 z-30 h-1/2 origin-top bg-[#491b21] shadow-xl transition-all duration-700 ease-in-out [clip-path:polygon(0_0,100%_0,50%_100%)] ${
                  sealed ? "" : "opacity-0 [transform:rotateX(-110deg)]"
                }`}
              >
                <div className="h-full w-full bg-gradient-to-b from-[#eac175]/10 to-transparent" />
              </div>

              <button
                type="button"
                aria-label="گشودن پاکت دعوتنامه"
                onClick={openEnvelope}
                className={`absolute left-1/2 top-1/2 z-40 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-[color:var(--cv-gold-deep)] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_16px_rgba(223,183,108,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 ${
                  sealed ? "" : "pointer-events-none scale-0 opacity-0"
                }`}
              >
                <span className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-[#250207]">
                  <span className="font-display text-base font-bold leading-tight tracking-widest text-[color:var(--cv-gold)]">
                    {monogram}
                  </span>
                  <span className="text-[9px] text-[#ffdea5]">مهر وصال</span>
                </span>
              </button>
            </div>
            </div>

            {/* Invitation card — hidden until the envelope is opened */}
            <div
              inert={!open}
              aria-hidden={!open}
              className={`w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                open
                  ? "max-h-[900px] translate-y-0 scale-100 opacity-100"
                  : "invisible max-h-0 translate-y-10 scale-95 overflow-hidden opacity-0"
              }`}
            >
              <div className="flex flex-col overflow-hidden rounded-xl border border-[#dfb76c]/20 bg-[#56262b] p-4 shadow-2xl">
                <div className="relative flex min-h-[420px] w-full flex-col items-center justify-end overflow-hidden rounded-t-full border border-[#dfb76c]/30 bg-[#491b21] p-2 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt=""
                    className="absolute inset-0 h-full w-full rounded-t-full object-cover object-top brightness-95 contrast-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#250207] via-[#250207]/30 to-transparent" />
                  <div className="relative z-10 rounded-full border border-[#dfb76c]/20 bg-[#250207]/70 px-4 py-2 text-center shadow-lg backdrop-blur-md">
                    <p className="font-display text-xl font-semibold text-[color:var(--cv-gold)]">
                      {couple}
                    </p>
                    <p className="text-[11px] tracking-wide text-[#eac175]">
                      {data.venueName || "محل جشن"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 pt-3 text-center">
                  <p className="text-xs font-medium tracking-wider text-[color:var(--cv-gold)]">
                    {dayFa || "به‌زودی"}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[color:var(--cv-gold)]">
                    <span className="h-px w-6 bg-[#dfb76c]/40" />
                    <Diamond className="h-3.5 w-3.5" />
                    <span className="h-px w-6 bg-[#dfb76c]/40" />
                  </div>
                  <p className="line-clamp-2 text-sm leading-6 text-[#d1c5b4]">
                    {data.invitationText ||
                      "با حضور پرمهر خویش، بزم وصل ما را تا عرش خاطره‌ها پرفروغ سازید."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStage("closed")}
                className="mx-auto mt-4 flex items-center gap-1.5 rounded-full bg-[#491b21] px-4 py-2 text-xs text-[#d1c5b4] shadow transition hover:text-[color:var(--cv-gold)] active:scale-95"
              >
                <RotateCcw className="h-4 w-4" />
                بستن پاکت
              </button>
            </div>

            {sealed ? (
              <div className="mt-5 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={openEnvelope}
                  className="flex items-center gap-2 rounded-full bg-[color:var(--cv-gold)] px-5 py-2.5 text-[13px] font-semibold tracking-wider text-[#412d00] shadow-[0_4px_20px_rgba(223,183,108,0.25)] transition hover:bg-[#ffdea5] active:scale-95"
                >
                  <MailOpen className="h-[18px] w-[18px]" />
                  برای گشودن پاکت لمس کنید
                </button>
                <span className="flex items-center gap-1.5 text-[10px] tracking-wider text-[#d1c5b4]">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[color:var(--cv-gold)]" />
                  حاوی کارت اختصاصی، جزئیات ضیافت و تأیید حضور
                </span>
              </div>
            ) : null}
          </section>

          {/* Revealed content */}
          <div
            inert={!open}
            className={`flex flex-col gap-10 transition-all duration-1000 ease-out ${
              open
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -mt-10 max-h-0 translate-y-8 overflow-hidden opacity-0"
            }`}
          >
            <section
              className={`relative flex flex-col items-center gap-3 overflow-hidden p-6 text-center ${panel}`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dfb76c]/20 text-[color:var(--cv-gold)]">
                <BookOpen className="h-[18px] w-[18px]" />
              </span>
              <blockquote className="font-display text-xl leading-loose text-[color:var(--cv-gold)]">
                {theme.poeticLine}
              </blockquote>
              <p className="text-[10px] tracking-widest text-[#eac175]">
                — حضرت مولانا
              </p>
            </section>

            {showMusic ? (
              <section className="flex items-center justify-between rounded-xl bg-[#3b1117] p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--cv-gold)] text-[#412d00] shadow-md transition active:scale-90"
                    aria-label="پخش موسیقی"
                  >
                    {playing ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>
                  <div>
                    <h2 className="font-display text-base text-[color:var(--cv-gold)]">
                      {theme.musicTitle}
                    </h2>
                    <p
                      dir="ltr"
                      className="text-right text-[10px] tracking-wider text-[#d1c5b4]"
                    >
                      Royal Symphony in Nocturne
                    </p>
                  </div>
                </div>
                <div className="flex h-6 items-end gap-1 px-2">
                  {[2, 5, 3, 6, 4].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-[color:var(--cv-gold)]/40 ${
                        playing ? "animate-pulse" : ""
                      }`}
                      style={{ height: `${h * 4}px` }}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {showCountdown ? (
              <section
                id="ceremony-details"
                className="flex scroll-mt-24 flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2 text-[color:var(--cv-gold)]">
                  <Hourglass className="h-5 w-5" />
                  <h2 className="font-display text-xl font-semibold">
                    شمارش معکوس تا جشن وصال
                  </h2>
                </div>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="w-full [&_div]:rounded-lg [&_div]:bg-[#491b21] [&_div]:shadow-md [&_p:first-child]:font-display [&_p:first-child]:text-[26px] [&_p:first-child]:text-[color:var(--cv-gold)] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#d1c5b4]"
                />
              </section>
            ) : (
              <span id="ceremony-details" />
            )}

            <section id="schedule" className={`scroll-mt-24 space-y-4 p-5 ${panel}`}>
              <div className="flex items-center gap-2 pb-2 text-[color:var(--cv-gold)]">
                <CalendarDays className="h-[22px] w-[22px]" />
                <h2 className="font-display text-xl font-semibold">
                  زمان‌بندی آیین جشن سلطنتی
                </h2>
              </div>
              <div className="space-y-4">
                {schedule.map((item, index) => {
                  const highlight = index === 1;
                  const last = index === schedule.length - 1;
                  return (
                    <div
                      key={`${item.time}-${item.title}`}
                      className="flex items-start gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold shadow ${
                            highlight
                              ? "bg-[color:var(--cv-gold)] text-[#412d00]"
                              : "bg-[#56262b] text-[color:var(--cv-gold)]"
                          }`}
                        >
                          {item.time}
                        </span>
                        {!last ? (
                          <span className="h-10 w-0.5 bg-[#dfb76c]/20" />
                        ) : null}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3
                          className={`text-base font-semibold ${
                            highlight ? "text-[color:var(--cv-gold)]" : ""
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm leading-6 text-[#d1c5b4]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {showMap ? (
              <section
                id="location"
                className={`scroll-mt-24 space-y-4 p-5 ${panel}`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-[22px] w-[22px] shrink-0 text-[color:var(--cv-gold)]" />
                  <div>
                    <h2 className="font-display text-xl font-semibold text-[color:var(--cv-gold)]">
                      {data.venueName || "مکان جشن و تشریفات"}
                    </h2>
                    {data.venueAddress ? (
                      <p className="text-[11px] tracking-wide text-[#d1c5b4]">
                        {data.venueAddress}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="relative flex h-44 items-end overflow-hidden rounded-lg bg-gradient-to-br from-[#491b21] to-[#250207] p-3 shadow-inner">
                  <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(223,183,108,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(223,183,108,0.4)_1px,transparent_1px)] [background-size:22px_22px]" />
                  <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--cv-gold)] text-[#412d00] shadow-lg">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div className="relative flex w-full items-center justify-between rounded-md bg-[#250207]/80 p-2 backdrop-blur-md">
                    <span className="text-[11px] text-[color:var(--cv-gold)]">
                      {data.venueName || "محل برگزاری"} · پارکینگ اختصاصی مهیاست
                    </span>
                    <MailCheck className="h-4 w-4 text-[color:var(--cv-gold)]" />
                  </div>
                </div>
                {query ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`https://neshan.org/maps/search/${query}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded bg-[#491b21] px-3 py-2.5 text-xs font-medium text-[color:var(--cv-gold)] shadow transition hover:bg-[#5b2a2f]"
                    >
                      <Navigation className="h-4 w-4" />
                      مسیریابی نشان / بلد
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${query}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded bg-[#491b21] px-3 py-2.5 text-xs font-medium text-[color:var(--cv-gold)] shadow transition hover:bg-[#5b2a2f]"
                    >
                      <Compass className="h-4 w-4" />
                      Google Maps
                    </a>
                  </div>
                ) : null}
                {calendarHref ? (
                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded bg-[#56262b] py-2.5 text-xs font-medium transition hover:text-[color:var(--cv-gold)]"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    افزودن تاریخ به تقویم تلفن همراه
                  </a>
                ) : null}
              </section>
            ) : null}

            <section className={`space-y-3 p-5 text-center ${panel}`}>
              <div className="flex items-center justify-center gap-2 text-[color:var(--cv-gold)]">
                <Shirt className="h-5 w-5" />
                <h2 className="font-display text-xl font-semibold">
                  راهنمای پوشش مهمانان گرامی
                </h2>
              </div>
              <p className="text-sm leading-6 text-[#d1c5b4]">
                {theme.dressCode}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {SWATCHES.map((item) => (
                  <span
                    key={item.label}
                    className="flex items-center gap-1.5 rounded-full bg-[#491b21] px-3 py-1.5 text-[11px] shadow"
                  >
                    <span
                      className="h-3 w-3 rounded-full shadow-sm ring-1 ring-[#dfb76c]/30"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </section>

            {features?.rsvp !== false ? (
              <section
                id="rsvp"
                className="scroll-mt-24 space-y-4 rounded-xl bg-[#3b1117] p-6 shadow-xl"
              >
                <div className="space-y-1 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-[#eac175]">
                    RSVP · تأیید حضور
                  </span>
                  <h2 className="font-display text-xl font-semibold text-[color:var(--cv-gold)]">
                    اعلام و ثبت حضور در ضیافت
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "با کمال افتخار حضور می‌یابم" },
                    { value: false, label: "متأسفانه امکان حضور ندارم" },
                  ].map(({ value, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAttending(value)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg p-3 text-center text-[11px] shadow transition ${
                        attending === value
                          ? "bg-[#491b21] text-[color:var(--cv-gold)] ring-1 ring-[#dfb76c]/50"
                          : "bg-[#360d13] text-[#d1c5b4]"
                      }`}
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded-full border-2 ${
                          attending === value
                            ? "border-[color:var(--cv-gold)] bg-[color:var(--cv-gold)] shadow-[inset_0_0_0_2px_#491b21]"
                            : "border-[#9a8f7f]"
                        }`}
                      />
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  className={`flex items-center justify-between rounded-lg bg-[#360d13] p-3 shadow transition ${
                    attending ? "" : "pointer-events-none opacity-30"
                  }`}
                >
                  <span className="text-sm">تعداد همراهان (نفرات):</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#491b21] text-lg text-[color:var(--cv-gold)] active:scale-95"
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-display text-xl text-[color:var(--cv-gold)]">
                      {guests.toLocaleString("fa-IR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#491b21] text-lg text-[color:var(--cv-gold)] active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
                {preview ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--cv-gold)] py-3.5 text-[13px] font-semibold tracking-wider text-[#412d00] shadow-[0_4px_20px_rgba(223,183,108,0.3)]">
                    <UserCheck className="h-5 w-5" />
                    تأیید نهایی و ارسال پاسخ به میزبان
                  </div>
                ) : (
                  <a
                    href="#rsvp"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--cv-gold)] py-3.5 text-[13px] font-semibold tracking-wider text-[#412d00] shadow-[0_4px_20px_rgba(223,183,108,0.3)] transition hover:bg-[#ffdea5]"
                  >
                    <UserCheck className="h-5 w-5" />
                    تأیید نهایی و ارسال پاسخ به میزبان
                  </a>
                )}
              </section>
            ) : null}

            <section className={`space-y-3 p-5 text-center ${panel}`}>
              <div className="flex items-center justify-center gap-2 text-[color:var(--cv-gold)]">
                <Gift className="h-5 w-5" />
                <h2 className="font-display text-xl font-semibold">
                  هدیه و یادبود پیوند
                </h2>
              </div>
              <p className="mx-auto max-w-xs text-sm leading-6 text-[#d1c5b4]">
                {theme.blessingLine}
              </p>
            </section>

            <footer className="space-y-2 pb-6 pt-2 text-center opacity-80">
              <div className="flex items-center justify-center gap-2 text-[color:var(--cv-gold)]">
                <span className="h-px w-10 bg-[color:var(--cv-gold)]/30" />
                <span className="font-display text-base">{monogram}</span>
                <span className="h-px w-10 bg-[color:var(--cv-gold)]/30" />
              </div>
              <p className="text-[11px] text-[#d1c5b4]">
                با تشکر از همراهی و آرزوی شادکامی برای تمامی میهمانان گرامی
              </p>
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-20 max-w-md items-center justify-around bg-[#250207]/90 px-4 shadow-[0_-4px_24px_rgba(37,2,7,0.8)] backdrop-blur-xl">
          {[
            { href: "#", label: "دعوتنامه", Icon: MailCheck, active: true },
            { href: "#schedule", label: "زمان‌بندی", Icon: CalendarCheck },
            { href: "#location", label: "مسیریابی", Icon: Navigation },
            { href: "#rsvp", label: "ثبت حضور", Icon: UserCheck },
          ].map(({ href, label, Icon, active }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#") setStage("open");
              }}
              className={`flex min-h-[44px] min-w-[56px] flex-col items-center justify-center gap-1 text-[10px] transition-all ${
                active
                  ? "scale-105 text-[color:var(--cv-gold)]"
                  : "text-[#d1c5b4] hover:text-[color:var(--cv-gold)]"
              }`}
            >
              <Icon className="h-[22px] w-[22px]" />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
