"use client";

import type { CSSProperties } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Gift,
  MapPin,
  Music2,
  Navigation,
  ParkingCircle,
  Quote,
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

const DEFAULT_COVER = "/images/templates/royal-suite-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۰۰ عصر",
    title: "استقبال و نوشیدنی بهاره",
    description: "فضای باز باغ، پذیرایی با نغمه‌های زنده",
  },
  {
    time: "۱۸:۳۰ عصر",
    title: "آیین پیوند و عقد عاطفی",
    description: "ایوان آینه عمارت زیر سفره سنتی",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰ شب",
    title: "ضیافت شام سلطنتی",
    description: "تالار مجلل، سلف‌سرویس ایرانی و مدیترانه‌ای",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰ تا بامداد",
    title: "پایکوبی و آتش‌بازی شبانه",
    description: "برش کیک و رقص نور در محوطه عمارت",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#44645f", label: "زمردی", en: "Emerald" },
  { color: "#c5a059", label: "شامپاینی", en: "Champagne" },
  { color: "#ffdea5", label: "طلایی متالیک", en: "Warm Gold" },
  { color: "#ebe8e3", label: "کرم مرواریدی", en: "Pearl Ivory" },
];

const TIMELINE_EN = [
  "Welcome Reception",
  "Aghd Ceremony",
  "Royal Dinner",
  "Celebration & Dance",
];

function latinDateLine(iso?: string | null, timezone = "Asia/Tehran") {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export function RoyalSuiteRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const theme: TemplateCustomization = {
    primaryColor: "#775a19",
    secondaryColor: "#44645f",
    backgroundColor: "#fcf9f4",
    poeticLine:
      "«در ازل پرتو حسنت ز تجلی دم زد عشق پیدا شد و آتش به همه عالم زد»",
    blessingLine: "با مهر فراوان و مشتاق دیدار،",
    dressCode:
      "برای هماهنگی قاب‌های یادگاری، لباس رسمی و شیک با تم زمردی و شامپاینی پیشنهاد می‌شود.",
    musicTitle: "قطعه عاشقانه بهار و پیوند",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const dayFa = formatEventDay(data.eventStartAt, data.timezone);
  const dateEn = latinDateLine(data.eventStartAt, data.timezone);
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
          "--rs-gold": theme.primaryColor || "#775a19",
          "--rs-emerald": theme.secondaryColor || "#44645f",
        } as CSSProperties
      }
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#fcf9f4]">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e5e2dd]/80 bg-[#fcf9f4]/85 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--rs-gold)]">
              <Music2 className="h-5 w-5" />
            </span>
            <span className="rounded-full px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4e4639]">
              FA / EN
            </span>
          </div>
          <div className="text-center">
            <p className="font-display text-sm tracking-wide text-[color:var(--rs-gold)]">
              Ceremony Overview
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#7f7667]">
              Royal Suite
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--rs-gold)] text-[10px] font-semibold text-white shadow-md">
            {monogram}
          </div>
        </header>

        <main className="flex flex-col gap-8 px-5 pb-24 pt-4">
          {/* Envelope card */}
          <section className="relative pt-1">
            <div className="rounded-xl bg-[#ebe8e3] p-1 shadow-2xl">
              <div className="rounded-lg bg-gradient-to-b from-[color:var(--rs-emerald)] via-[color:var(--rs-emerald)]/90 to-[#e5e2dd] p-2 shadow-inner">
                <article className="relative overflow-hidden rounded-lg bg-[#fcf9f4] p-4 shadow-2xl">
                  <div className="pointer-events-none absolute inset-2.5 rounded border border-[color:var(--rs-gold)]/25" />
                  <div className="pointer-events-none absolute inset-3 rounded border border-[color:var(--rs-gold)]/10" />

                  <div className="relative flex flex-col items-center pt-1 pb-2 text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#c5a059]/20 text-[color:var(--rs-gold)] shadow-sm">
                      <span className="font-display text-lg tracking-widest">
                        {monogram}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--rs-gold)]">
                      The Wedding Celebration
                    </span>
                  </div>

                  <div className="relative my-3 aspect-[4/5] w-full overflow-hidden rounded-lg shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <p className="absolute inset-x-3 bottom-3 text-center text-xs font-semibold uppercase tracking-widest text-[#ffdea5]">
                      به نام پیوند و عشق
                    </p>
                  </div>

                  <div className="space-y-1 py-2 text-center">
                    <h1 className="font-display text-[22px] font-semibold leading-tight text-[color:var(--rs-gold)]">
                      {couple}
                    </h1>
                    <p className="font-display text-base tracking-wider text-[#7f7667]">
                      {data.partnerOneName} &amp; {data.partnerTwoName}
                    </p>
                  </div>

                  <div className="mx-auto my-2 h-px w-16 bg-[color:var(--rs-gold)]/30" />

                  <div className="space-y-2 py-2 text-center">
                    {dayFa ? (
                      <p className="font-display text-base font-medium text-[#1c1c19]">
                        {dayFa}
                      </p>
                    ) : null}
                    {dateEn ? (
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7f7667]">
                        {dateEn}
                      </p>
                    ) : null}
                    {(data.venueName || data.venueAddress) && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f0ede9] px-3 py-1 text-sm font-medium text-[color:var(--rs-emerald)]">
                        <MapPin className="h-4 w-4 text-[color:var(--rs-gold)]" />
                        <span>{data.venueName || data.venueAddress}</span>
                      </div>
                    )}
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Poetry */}
          <section className="px-1 text-center">
            <div className="rounded-xl bg-[#f6f3ee] px-5 py-5 shadow-sm">
              <Quote className="mx-auto h-7 w-7 text-[color:var(--rs-gold)]/40" />
              <blockquote className="mt-1 font-display text-[22px] font-normal leading-relaxed text-[color:var(--rs-gold)]">
                {theme.poeticLine}
              </blockquote>
              <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-[#7f7667]">
                — حافظ شیرازی —
              </p>
            </div>
          </section>

          {/* Music + countdown */}
          <section className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-[#f0ede9] p-3 shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--rs-gold)] text-white shadow-md">
                  <Music2 className="h-4 w-4" />
                </span>
                <div className="min-w-0 text-right">
                  <p className="truncate text-sm font-semibold text-[#1c1c19]">
                    {theme.musicTitle}
                  </p>
                  <p className="truncate text-[11px] uppercase tracking-wider text-[#7f7667]">
                    {couple} Official Theme
                  </p>
                </div>
              </div>
              <div className="flex h-5 items-end gap-0.5 px-2">
                <span className="h-3 w-1 animate-pulse rounded-full bg-[color:var(--rs-gold)]/60" />
                <span className="h-5 w-1 animate-pulse rounded-full bg-[color:var(--rs-gold)] [animation-delay:75ms]" />
                <span className="h-2 w-1 animate-pulse rounded-full bg-[color:var(--rs-gold)]/40 [animation-delay:150ms]" />
              </div>
            </div>

            {showCountdown ? (
              <div className="rounded-xl bg-white p-4 shadow-md">
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[color:var(--rs-gold)]">
                  شمارش معکوس تا جشن پیوند
                </p>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="[&_div]:rounded-lg [&_div]:border-0 [&_div]:bg-[#c5a059]/10 [&_p:first-child]:font-display [&_p:first-child]:text-[28px] [&_p:first-child]:font-bold [&_p:first-child]:text-[color:var(--rs-gold)] [&_p:last-child]:text-[10px] [&_p:last-child]:uppercase [&_p:last-child]:text-[#7f7667]"
                />
                {calendarHref ? (
                  <div className="mt-4 flex gap-2">
                    <a
                      href={calendarHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#f0ede9] py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#1c1c19] shadow-sm"
                    >
                      <CalendarDays className="h-4 w-4 text-[color:var(--rs-gold)]" />
                      تقویم
                    </a>
                    {showMap ? (
                      <a
                        href="#location"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#f0ede9] py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#1c1c19] shadow-sm"
                      >
                        <MapPin className="h-4 w-4 text-[color:var(--rs-gold)]" />
                        لوکیشن
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>

          {/* Timeline */}
          <section className="space-y-4">
            <div className="space-y-1 text-center">
              <h2 className="font-display text-xl font-semibold text-[color:var(--rs-gold)]">
                برنامه جشن با شکوه
              </h2>
              <p className="text-[11px] font-semibold tracking-wider text-[#7f7667]">
                Wedding Day Itinerary
              </p>
            </div>
            <div className="relative space-y-4 pr-6 before:absolute before:right-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c5a059]/30">
              {schedule.map((item, index) => (
                <div key={`${item.time}-${item.title}`} className="relative">
                  <div className="absolute -right-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--rs-gold)] shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div className="space-y-1 rounded-xl bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold tracking-wide text-[color:var(--rs-gold)]">
                        {item.time}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7f7667]">
                        {TIMELINE_EN[index] || "Event"}
                      </span>
                    </div>
                    <p className="text-base font-medium text-[#1c1c19]">
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed text-[#4e4639]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Location */}
          {showMap ? (
            <section id="location" className="scroll-mt-24 space-y-4">
              <div className="space-y-1 text-center">
                <h2 className="font-display text-xl font-semibold text-[color:var(--rs-gold)]">
                  موقعیت و مسیریابی
                </h2>
                <p className="text-[11px] font-semibold tracking-wider text-[#7f7667]">
                  Venue &amp; Location Guide
                </p>
              </div>
              <div className="overflow-hidden rounded-xl bg-white shadow-md">
                <div className="relative h-44 bg-[#e5e2dd]">
                  <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(68,100,95,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(68,100,95,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--rs-gold)] text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-[#fcf9f4]/90 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--rs-gold)] shadow backdrop-blur">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.venueName || "محل برگزاری"}
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  {data.venueName ? (
                    <h3 className="font-display text-base font-bold text-[#1c1c19]">
                      {data.venueName}
                    </h3>
                  ) : null}
                  {data.venueAddress ? (
                    <p className="text-sm leading-relaxed text-[#4e4639]">
                      {data.venueAddress}
                    </p>
                  ) : null}
                  <div className="flex items-center gap-2 rounded-lg bg-[#f0ede9] p-2 text-sm text-[color:var(--rs-emerald)]">
                    <ParkingCircle className="h-[18px] w-[18px] shrink-0 text-[color:var(--rs-gold)]" />
                    <span>پارکینگ اختصاصی همراه با خدمات ولت برای مهمانان.</span>
                  </div>
                  {query ? (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        {
                          href: `https://waze.com/ul?q=${query}`,
                          label: "Waze",
                          className:
                            "bg-[color:var(--rs-gold)] text-white",
                        },
                        {
                          href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                          label: "Google",
                          className:
                            "bg-[color:var(--rs-emerald)] text-white",
                        },
                        {
                          href: `https://neshan.org/maps/search/${query}`,
                          label: "نشان",
                          className: "bg-[#ebe8e3] text-[#1c1c19]",
                        },
                      ].map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-1 rounded-lg py-2.5 text-[11px] font-semibold uppercase tracking-wider shadow ${item.className}`}
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {/* Dress code */}
          <section className="space-y-4">
            <div className="space-y-1 text-center">
              <h2 className="font-display text-xl font-semibold text-[color:var(--rs-gold)]">
                کد پوشش و پالت رنگی
              </h2>
              <p className="text-[11px] font-semibold tracking-wider text-[#7f7667]">
                Dress Code: Formal Elegance
              </p>
            </div>
            <div className="space-y-3 rounded-xl bg-white p-4 shadow-md">
              <p className="text-center text-sm leading-relaxed text-[#4e4639]">
                {theme.dressCode}
              </p>
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                {SWATCHES.map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <div
                      className="mb-1.5 h-12 w-12 rounded-full shadow-md ring-1 ring-black/5"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-[#1c1c19]">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7f7667]">
                      {item.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-24 space-y-4 pb-2">
              <div className="space-y-1 text-center">
                <h2 className="font-display text-xl font-semibold text-[color:var(--rs-gold)]">
                  پاسخ حضور در جشن (RSVP)
                </h2>
                <p className="text-[11px] font-semibold tracking-wider text-[#7f7667]">
                  Kindly Confirm Your Attendance
                </p>
              </div>
              <div className="space-y-3 rounded-xl bg-white p-4 shadow-lg">
                {preview ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[color:var(--rs-gold)] px-2 py-3 text-sm font-medium text-white shadow">
                        <CheckCircle2 className="h-4 w-4" />
                        با کمال افتخار بله
                      </div>
                      <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#f0ede9] px-2 py-3 text-sm font-medium text-[#4e4639]">
                        <XCircle className="h-4 w-4" />
                        متأسفانه خیر
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#775a19] to-[#c5a059] py-3.5 text-base font-bold text-white shadow-lg">
                      ثبت پاسخ نهایی حضور
                    </div>
                  </>
                ) : (
                  <a
                    href="#rsvp"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#775a19] to-[#c5a059] py-3.5 text-base font-bold text-white shadow-lg"
                  >
                    ثبت پاسخ نهایی حضور
                  </a>
                )}
              </div>
            </section>
          ) : null}

          {/* Gift + farewell */}
          <section className="space-y-4 pb-4 text-center">
            <div className="space-y-3 rounded-xl bg-[#f6f3ee] p-4">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#c7eae2]/50 text-[color:var(--rs-emerald)]">
                <Gift className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-[color:var(--rs-gold)]">
                هدیه به نوپایان زندگی
              </h3>
              <p className="text-sm leading-relaxed text-[#4e4639]">
                حضور پرمهر شما بزرگ‌ترین ارمغان این شب است. برای عزیزانی که
                تمایل به مشارکت دارند، کارت مجازی در نظر گرفته شده است.
              </p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="font-display text-base text-[color:var(--rs-gold)]">
                {theme.blessingLine}
              </p>
              <p className="font-display text-xl font-semibold text-[#1c1c19]">
                {couple}
              </p>
            </div>
          </section>
        </main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#e5e2dd]/80 bg-[#fcf9f4]/90 px-5 shadow-[0_-4px_20px_rgba(28,24,20,0.05)] backdrop-blur-xl">
          {[
            { href: "#", label: "دعوت‌نامه", active: true },
            { href: "#", label: "برنامه" },
            { href: "#location", label: "مسیریابی" },
            { href: "#rsvp", label: "پاسخ حضور" },
          ].map((item) => (
            <a
              key={item.label}
              href={preview ? undefined : item.href}
              className={`flex flex-col items-center justify-center text-[11px] ${
                item.active
                  ? "font-semibold text-[color:var(--rs-gold)]"
                  : "text-[#4e4639]"
              }`}
            >
              <span className="mb-0.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
