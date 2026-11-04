"use client";

import type { CSSProperties } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Coffee,
  Heart,
  MapPin,
  Music2,
  Navigation,
  ParkingCircle,
  Utensils,
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

const DEFAULT_COVER = "/images/templates/stationery-arch-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "استقبال و نوشیدنی بهاری",
    description: "خوشامدگویی در تراس سبز عمارت همراه با موسیقی لایت",
    icon: "cafe",
  },
  {
    time: "۱۸:۴۵",
    title: "پیمان عقد و سفره عسل",
    description: "مراسم خطبه عقد بر سر سفره سپید در چشم‌انداز دریا",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "شام و ضیافت شاهانه",
    description: "بوفه مجلل ایرانی، مدیترانه‌ای و دسرهای فرانسوی",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰",
    title: "جشن و افترپارتی ساحلی",
    description: "آتش‌بازی ساحلی، رقص و پایکوبی تا سپیده‌دم",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#e3d7cb", label: "ماسی گرم", en: "Nude Sand" },
  { color: "#f4eee6", label: "عاجی ملایم", en: "Warm Ivory" },
  { color: "#959d8c", label: "مریم‌گلی", en: "Olive Sage" },
  { color: "#c98e77", label: "سفالی روشن", en: "Terracotta" },
];

function scheduleIcon(icon?: TemplateScheduleItem["icon"]) {
  switch (icon) {
    case "heart":
      return Heart;
    case "dining":
      return Utensils;
    case "music":
      return Music2;
    case "cafe":
    default:
      return Coffee;
  }
}

function latinMonthDay(iso?: string | null, timezone = "Asia/Tehran") {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const month = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      month: "long",
    })
      .format(d)
      .toUpperCase();
    const day = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      day: "numeric",
    }).format(d);
    const year = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
    }).format(d);
    const ordinal =
      day === "1" || day === "21" || day === "31"
        ? `${day}st`
        : day === "2" || day === "22"
          ? `${day}nd`
          : day === "3" || day === "23"
            ? `${day}rd`
            : `${day}th`;
    return { month, ordinal, year };
  } catch {
    return null;
  }
}

export function StationeryArchRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const theme: TemplateCustomization = {
    primaryColor: "#775a19",
    secondaryColor: "#c5a059",
    backgroundColor: "#fcf9f4",
    poeticLine: "«بنام یگانگی پیوند عشق و وفاداری»",
    blessingLine: "با مهر و امید مشتاق حضور صمیمانه‌تان هستیم.",
    dressCode:
      "پوشش رسمی (Black Tie / Formal Chic). طیف نود، عاجی، زیتونی یا خاکی گرم. لطفاً سفید کامل را به عروس اختصاص دهید.",
    musicTitle: "نوای عاشقی (پیانوی اختصاصی مراسم)",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const dayFa = formatEventDay(data.eventStartAt, data.timezone);
  const dateParts = latinMonthDay(data.eventStartAt, data.timezone);
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
          "--sa-gold": theme.primaryColor || "#775a19",
          "--sa-champagne": theme.secondaryColor || "#c5a059",
        } as CSSProperties
      }
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#fcf9f4]">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e5e2dd]/60 bg-[#fcf9f4]/85 px-5 py-3 backdrop-blur-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--sa-gold)]">
            <Music2 className="h-5 w-5" />
          </span>
          <div className="text-center">
            <p className="font-display text-sm tracking-wide text-[color:var(--sa-gold)]">
              Invitation Card
            </p>
            <p className="mt-0.5 text-[10px] tracking-widest text-[#cd9a85]">
              {couple}
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--sa-gold)] text-[10px] font-semibold text-white">
            {monogram}
          </div>
        </header>

        <main className="flex flex-col gap-5 px-5 pb-24 pt-4">
          {/* Stationery arch card */}
          <section className="relative overflow-hidden rounded-xl bg-[#ece4dc] p-4 text-[#2c2623] shadow-[0_22px_45px_-12px_rgba(44,38,35,0.18)]">
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply [background-image:radial-gradient(#2c2623_1px,transparent_1px)] [background-size:12px_12px]" />

            <div className="relative z-10 mb-4 flex flex-col items-center text-center">
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#dfd4c9] font-display text-sm text-[color:var(--sa-gold)] shadow-sm">
                {monogram}
              </div>
              <p className="mt-1 font-display text-[15px] leading-relaxed tracking-wide text-[#5a4e46]">
                {theme.poeticLine}
              </p>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#85766c]">
                Celebrating Love &amp; Union
              </span>
            </div>

            <div className="relative z-10 grid grid-cols-12 items-end gap-3">
              <div className="col-span-7 flex h-full flex-col justify-between space-y-3 pr-1">
                <div>
                  <h1 className="font-display text-[21px] font-normal uppercase leading-[26px] tracking-widest text-[#231e1a]">
                    <span className="block">{data.partnerOneName}</span>
                    <span className="block">&amp; {data.partnerTwoName}</span>
                  </h1>
                  <p className="mt-1 font-display text-base text-[color:var(--sa-gold)]">
                    {couple}
                  </p>
                </div>

                <div className="my-1 h-[1.5px] w-10 bg-[color:var(--sa-champagne)]/40" />

                <div className="space-y-0.5">
                  {dateParts ? (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6d5f57]">
                      {dateParts.month} /{" "}
                      <span className="font-display text-[15px] italic font-normal text-[color:var(--sa-gold)]">
                        {dateParts.ordinal}
                      </span>{" "}
                      / {dateParts.year}
                    </p>
                  ) : null}
                  {dayFa ? (
                    <p className="text-[11px] font-medium text-[#4d423c]">
                      {dayFa}
                    </p>
                  ) : null}
                </div>

                <p className="text-[11px] italic font-light leading-[18px] text-[#554a43]">
                  &ldquo;Together with our families, we invite you to celebrate
                  our union at sunset.&rdquo;
                </p>

                <div className="rounded-lg bg-[#e2d8cd]/80 p-2 text-right">
                  <p className="text-[11px] leading-[18px] text-[#2c2623]">
                    {data.invitationText || theme.blessingLine}
                  </p>
                </div>

                <div className="pt-1">
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-[#7e6d63]">
                    Venue &amp; Ceremony
                  </span>
                  <p className="font-display text-[13px] font-medium leading-snug text-[#2c2623]">
                    {data.venueName || "محل برگزاری"}
                  </p>
                  {data.venueAddress ? (
                    <span className="mt-0.5 block text-[9px] tracking-normal text-[#8e7e73]">
                      {data.venueAddress}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="col-span-5 flex flex-col items-center">
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-t-full bg-[#dfd6cd] shadow-[0_12px_24px_-6px_rgba(44,38,35,0.22)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2c2623]/25 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between border-t border-[#2c2623]/5 pt-2 text-center">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7a6b61]">
                Reception to Follow
              </span>
              <span className="flex items-center gap-1 text-[9px] font-semibold tracking-widest text-[#7a6b61]">
                <Heart className="h-3 w-3 fill-[color:var(--sa-champagne)] text-[color:var(--sa-champagne)]" />
                پذیرایی و جشن شام
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7a6b61]">
                Formal Attire
              </span>
            </div>
          </section>

          {/* Music */}
          <section className="flex items-center justify-between rounded-xl bg-[#f6f3ee] p-3 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--sa-gold)] text-white shadow">
                <Music2 className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-[13px] text-[#1c1c19]">
                  {theme.musicTitle}
                </p>
                <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-[#4e4639]">
                  Love Theme • {couple}
                </p>
              </div>
            </div>
            <div className="flex h-5 items-end gap-1 px-1">
              <span className="h-2 w-[3px] animate-pulse rounded-full bg-[color:var(--sa-gold)]/40" />
              <span className="h-4 w-[3px] animate-pulse rounded-full bg-[color:var(--sa-gold)] [animation-delay:150ms]" />
              <span className="h-3 w-[3px] animate-pulse rounded-full bg-[color:var(--sa-gold)]/70 [animation-delay:300ms]" />
              <span className="h-5 w-[3px] animate-pulse rounded-full bg-[color:var(--sa-gold)] [animation-delay:450ms]" />
            </div>
          </section>

          {/* Countdown */}
          {showCountdown ? (
            <section className="rounded-xl bg-[#f6f3ee] p-4 text-center shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--sa-gold)]">
                Countdown to Forever
              </span>
              <h3 className="mt-0.5 font-display text-xl text-[#1c1c19]">
                شمارش معکوس تا جشن وصال
              </h3>
              <Countdown
                eventStartAt={data.eventStartAt!}
                className="mt-3 [&_div]:rounded-lg [&_div]:border-0 [&_div]:bg-[#fcf9f4] [&_div]:shadow-[0_2px_8px_rgba(0,0,0,0.03)] [&_p:first-child]:font-display [&_p:first-child]:text-[28px] [&_p:first-child]:text-[color:var(--sa-gold)] [&_p:last-child]:text-[9px] [&_p:last-child]:uppercase [&_p:last-child]:text-[#4e4639]"
              />
              {calendarHref ? (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--sa-gold)]"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Add to Calendar
                </a>
              ) : null}
            </section>
          ) : null}

          {/* Schedule */}
          <section className="rounded-xl bg-[#f6f3ee] p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--sa-gold)]">
                  Itinerary
                </span>
                <h3 className="font-display text-xl text-[#1c1c19]">
                  برنامه زمان‌بندی جشن
                </h3>
              </div>
              <CalendarDays className="h-6 w-6 text-[color:var(--sa-gold)]" />
            </div>
            <div className="space-y-5">
              {schedule.map((item, index) => {
                const Icon = scheduleIcon(item.icon);
                const active = index === 1;
                return (
                  <div
                    key={`${item.time}-${item.title}`}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                        active
                          ? "bg-[color:var(--sa-gold)] text-white"
                          : "bg-[#ffdea5] text-[#261900]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 rounded-lg bg-[#fcf9f4] p-3 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display text-sm font-medium text-[#1c1c19]">
                          {item.title}
                        </h4>
                        <span className="shrink-0 text-[11px] font-semibold text-[color:var(--sa-gold)]">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#4e4639]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Venue */}
          {showMap ? (
            <section
              id="location"
              className="scroll-mt-24 rounded-xl bg-[#f6f3ee] p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--sa-gold)]">
                    Ceremony Venue
                  </span>
                  <h3 className="font-display text-xl text-[#1c1c19]">
                    نشانی و مسیریابی عمارت
                  </h3>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fcf9f4] text-[color:var(--sa-gold)] shadow-sm">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>

              <div className="relative mb-3 h-44 overflow-hidden rounded-lg bg-[#e5e2dd] shadow-inner">
                <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(119,90,25,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(119,90,25,0.12)_1px,transparent_1px)] [background-size:22px_22px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--sa-gold)] text-white shadow-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
                  <p className="font-display text-sm font-semibold">
                    {data.venueName || "محل برگزاری"}
                  </p>
                  {data.venueAddress ? (
                    <p className="text-[11px] text-white/90">
                      {data.venueAddress}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mb-3 space-y-1 rounded-lg bg-[#fcf9f4] p-3">
                <div className="flex items-center gap-1.5 text-[12px] text-[color:var(--sa-gold)]">
                  <ParkingCircle className="h-4 w-4" />
                  <span className="font-medium">
                    پارکینگ اختصاصی و ولت‌سرویس برای مهمانان مهیاست.
                  </span>
                </div>
              </div>

              {query ? (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      href: `https://waze.com/ul?q=${query}`,
                      label: "Waze",
                      solid: true,
                    },
                    {
                      href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                      label: "گوگل مپ",
                      solid: false,
                    },
                    {
                      href: `https://neshan.org/maps/search/${query}`,
                      label: "نشان",
                      solid: false,
                    },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider shadow-sm ${
                        item.solid
                          ? "bg-[color:var(--sa-gold)] text-white"
                          : "bg-[#fcf9f4] text-[#1c1c19]"
                      }`}
                    >
                      <Navigation className="h-4 w-4" />
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {/* Dress code */}
          <section className="rounded-xl bg-[#f6f3ee] p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--sa-gold)]">
                  Dress Code Inspiration
                </span>
                <h3 className="font-display text-xl text-[#1c1c19]">
                  پالت رنگی لباس مهمانان
                </h3>
              </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-[#4e4639]">
              {theme.dressCode}
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {SWATCHES.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className="h-12 w-12 rounded-full shadow-sm ring-1 ring-black/5"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[10px] font-semibold text-[#1c1c19]">
                    {item.en}
                  </span>
                  <span className="text-[9px] text-[#4e4639]">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RSVP */}
          {features?.rsvp !== false ? (
            <section
              id="rsvp"
              className="scroll-mt-24 rounded-xl bg-[#f6f3ee] p-4 shadow-md"
            >
              <div className="mb-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--sa-gold)]">
                  Kindly RSVP
                </span>
                <h3 className="mt-1 font-display text-xl text-[#1c1c19]">
                  اعلام حضور در جشن
                </h3>
              </div>
              {preview ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-[#ffdea5] bg-[#ffdea5] p-3 text-center text-sm text-[#261900]">
                      <CheckCircle2 className="h-5 w-5 text-[color:var(--sa-gold)]" />
                      حضور دارم
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-[#fcf9f4] p-3 text-center text-sm text-[#4e4639] shadow-sm">
                      <XCircle className="h-5 w-5" />
                      متأسفانه خیر
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center rounded-lg bg-[color:var(--sa-gold)] py-3 text-sm font-medium text-white shadow-md">
                    ثبت پاسخ نهایی
                  </div>
                </div>
              ) : (
                <a
                  href="#rsvp"
                  className="flex w-full items-center justify-center rounded-lg bg-[color:var(--sa-gold)] py-3 text-sm font-medium text-white shadow-md"
                >
                  ثبت پاسخ نهایی
                </a>
              )}
            </section>
          ) : null}

          <footer className="pb-2 pt-2 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--sa-gold)]/10 font-display text-xs text-[color:var(--sa-gold)]">
              {monogram}
            </div>
            <p className="font-display text-sm text-[#1c1c19]">{couple}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#7f7667]">
              With Love
            </p>
          </footer>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#e5e2dd]/80 bg-[#fcf9f4]/90 px-2 shadow-[0_-4px_20px_rgba(28,24,20,0.05)] backdrop-blur-xl">
          {[
            { href: "#", label: "دعوتنامه", active: true },
            { href: "#", label: "برنامه" },
            { href: "#location", label: "مسیریابی" },
            { href: "#rsvp", label: "پاسخ" },
          ].map((item) => (
            <a
              key={item.label}
              href={preview ? undefined : item.href}
              className={`flex min-w-[44px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                item.active
                  ? "text-[color:var(--sa-gold)]"
                  : "text-[#4e4639]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
