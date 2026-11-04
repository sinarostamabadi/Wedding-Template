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
  Sparkles,
  Utensils,
  XCircle,
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

const DEFAULT_COVER = "/images/templates/persian-editorial-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۹:۰۰",
    title: "پذیرایی اولیه و خوش‌آمدگویی",
    description: "سرو نوشیدنی‌های سنتی و پذیرایی آغازین",
    icon: "cafe",
  },
  {
    time: "۲۰:۳۰",
    title: "مراسم عقد و خطبه پیوند",
    description: "جشن سفره عقد همراه با نوای سنتی",
    icon: "heart",
  },
  {
    time: "۲۱:۳۰",
    title: "شام تشریفاتی و برش کیک",
    description: "ضیافت شام و لحظه برش کیک عروسی",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰",
    title: "موسیقی زنده و ثبت یادبود",
    description: "شادی و ثبت خاطرات شبانه",
    icon: "music",
  },
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

function mapsLinks(query: string) {
  const q = encodeURIComponent(query);
  return {
    neshan: `https://neshan.org/maps/search/${q}`,
    balad: `https://balad.ir/search?query=${q}`,
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
}

export function PersianEditorialHauteRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const theme: TemplateCustomization = {
    primaryColor: "#1b3b32",
    secondaryColor: "#755a21",
    backgroundColor: "#fcf9f3",
    poeticLine: "«تو تمنای من و یار من و جان منی...»",
    dressCode:
      "لباس کاملاً رسمی و بلک تای (Black Tie). خواهشمندیم بانوان محترم به احترام عروس، از پوشیدن رنگ سفید پرهیز نمایند.",
    blessingLine: "حضور پرمهرتان، زیباترین هدیه آغاز زندگیمان است",
    musicTitle: "موسیقی پیشواز جشن",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || DEFAULT_COVER;
  const dayLabel = formatEventDay(data.eventStartAt, data.timezone);
  const timeLabel = formatEventTimeRange(
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
  const locationQuery =
    data.mapUrl ||
    [data.venueName, data.venueAddress].filter(Boolean).join(" ") ||
    "";
  const links = locationQuery ? mapsLinks(locationQuery) : null;
  const schedule = theme.schedule?.length ? theme.schedule : DEFAULT_SCHEDULE;
  const showCountdown = features?.countdown !== false && !!data.eventStartAt;
  const showMap = features?.map !== false && !!(data.venueName || data.venueAddress);
  const showMusic = features?.music !== false;

  return (
    <div
      dir="rtl"
      className="relative overflow-hidden text-[#1c1c18]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--pe-primary": theme.primaryColor,
          "--pe-secondary": theme.secondaryColor,
          "--pe-bg": theme.backgroundColor,
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#fed892]/30 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-md flex-col gap-8 px-4 pb-16 pt-8">
        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          <div className="relative mb-6 w-full max-w-[320px] overflow-hidden rounded-t-full rounded-b-xl bg-[#f6f3ed] p-2 shadow-[0_18px_40px_rgba(27,59,50,0.12)] md:max-w-[380px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={couple}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--pe-primary)]/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-4 px-4 text-center text-[#fffcf7]">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffdea4]">
                  Bespoke Union
                </p>
                <p className="font-display text-2xl">{couple}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white p-1 shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#fed892]/35 text-[color:var(--pe-primary)]">
              <span className="font-display text-xl tracking-widest">
                {monogram}
              </span>
            </div>
          </div>

          <p className="max-w-md font-display text-2xl leading-relaxed text-[color:var(--pe-primary)] md:text-3xl">
            {theme.poeticLine}
          </p>
          <p className="mt-3 max-w-lg text-[0.95rem] leading-8 text-[#414845]">
            {data.invitationText ||
              "شما با کمال مهر و افتخار به این جشن باشکوه پیوند آسمانی فراخوانده شده‌اید"}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-[color:var(--pe-secondary)]/70">
            <span className="h-px w-12 bg-[#e6c27e]" />
            <Sparkles className="h-4 w-4" />
            <span className="h-px w-12 bg-[#e6c27e]" />
          </div>
        </section>

        {/* Music bar (visual) */}
        {showMusic ? (
          <div className="rounded-xl bg-white/90 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--pe-primary)] text-white shadow-md">
                  <Music2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--pe-secondary)]">
                    {theme.musicTitle}
                  </p>
                  <p className="truncate text-sm font-semibold text-[#1c1c18]">
                    قطعه پیش‌فرض مراسم
                  </p>
                </div>
              </div>
              <div className="flex h-5 items-end gap-1 px-2">
                <span className="h-3 w-1 animate-pulse rounded-full bg-[#e6c27e]" />
                <span className="h-5 w-1 rounded-full bg-[color:var(--pe-secondary)]" />
                <span className="h-2 w-1 rounded-full bg-[color:var(--pe-primary)]" />
                <span className="h-4 w-1 rounded-full bg-[color:var(--pe-secondary)]" />
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#f0eee8]">
              <div className="h-full w-2/5 rounded-full bg-[color:var(--pe-secondary)]" />
            </div>
          </div>
        ) : null}

        {/* Date + countdown */}
        <section className="flex flex-col items-center rounded-xl bg-[#f6f3ed] p-5 text-center shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-[color:var(--pe-secondary)]">
            <CalendarDays className="h-5 w-5" />
            <span className="text-sm font-semibold">{dayLabel}</span>
          </div>
          {timeLabel ? (
            <p className="mb-4 text-sm text-[#414845]">{timeLabel}</p>
          ) : null}

          {showCountdown ? (
            <Countdown
              eventStartAt={data.eventStartAt!}
              className="mb-4 w-full max-w-sm [&_div]:rounded-lg [&_div]:border-0 [&_div]:bg-white [&_div]:shadow-sm [&_p:first-child]:font-display [&_p:first-child]:text-[color:var(--pe-primary)]"
            />
          ) : null}

          {calendarHref ? (
            <a
              href={calendarHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ebe8e2] px-4 py-2.5 text-xs font-semibold text-[color:var(--pe-primary)] transition hover:bg-[#e5e2dc]"
            >
              <CalendarDays className="h-4 w-4" />
              افزودن به تقویم گوگل و اپل
            </a>
          ) : null}
        </section>

        {/* Schedule */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-[color:var(--pe-primary)]">
              برنامه زمانی مراسم
            </h2>
            <span className="rounded-full bg-[#ffdea4]/40 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--pe-secondary)]">
              دقیق و هماهنگ
            </span>
          </div>

          <div className="relative space-y-6 rounded-xl bg-white p-5 shadow-sm">
            <div className="absolute bottom-8 top-8 right-9 w-0.5 bg-[#ebe8e2]" />
            {schedule.map((item) => {
              const Icon = scheduleIcon(item.icon);
              return (
                <div key={`${item.time}-${item.title}`} className="relative z-10 flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c7eadd] text-[color:var(--pe-primary)] shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-[color:var(--pe-primary)]">
                        {item.title}
                      </span>
                      <span className="shrink-0 text-xs font-medium text-[color:var(--pe-secondary)]">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-6 text-[#414845]">
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
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-[color:var(--pe-primary)]">
                محل برگزاری
              </h2>
              {data.venueName ? (
                <span className="text-xs font-medium text-[color:var(--pe-secondary)]">
                  {data.venueName}
                </span>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="relative flex h-44 items-end justify-start bg-[linear-gradient(135deg,#1b3b32,#45655a,#755a21)] p-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[color:var(--pe-primary)] shadow-md backdrop-blur">
                  <MapPin className="h-3.5 w-3.5 text-[color:var(--pe-secondary)]" />
                  <span className="text-[11px] font-semibold">
                    {data.venueName || "محل مراسم"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div>
                  {data.venueName ? (
                    <h3 className="text-sm font-semibold text-[color:var(--pe-primary)]">
                      {data.venueName}
                    </h3>
                  ) : null}
                  {data.venueAddress ? (
                    <p className="mt-1 text-xs leading-6 text-[#414845]">
                      {data.venueAddress}
                    </p>
                  ) : null}
                </div>
                {links ? (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { href: links.neshan, label: "مسیریابی با نشان" },
                      { href: links.balad, label: "مسیریابی با بلد" },
                      { href: links.google, label: "Google Maps" },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1 rounded-lg bg-[#f6f3ed] p-2.5 text-[color:var(--pe-primary)] transition hover:bg-[#ebe8e2]"
                      >
                        <Navigation className="h-4 w-4 text-[color:var(--pe-secondary)]" />
                        <span className="text-center text-[10px] leading-4">
                          {item.label}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* RSVP visual (preview / anchor) */}
        {features?.rsvp !== false ? (
          <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-md">
            <div>
              <h2 className="font-display text-2xl text-[color:var(--pe-primary)]">
                اعلام حضور در ضیافت
              </h2>
              <p className="mt-1 text-xs leading-6 text-[#414845]">
                آیا افتخار میزبانی از شما در این شب خاطره‌انگیز را خواهیم داشت؟
              </p>
            </div>

            {preview ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex w-full items-center justify-between rounded-xl bg-[color:var(--pe-primary)] p-3.5 text-white shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      با افتخار همراه شما هستیم
                    </span>
                  </div>
                  <span className="h-4 w-4 rounded-full bg-[color:var(--pe-secondary)]" />
                </div>
                <div className="flex w-full items-center justify-between rounded-xl bg-[#f0eee8] p-3.5 text-[#1c1c18]">
                  <div className="flex items-center gap-2.5">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      متأسفانه امکان حضور ندارم
                    </span>
                  </div>
                  <span className="h-4 w-4 rounded-full bg-[#c1c8c4]" />
                </div>
              </div>
            ) : (
              <a
                href="#rsvp"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--pe-primary)] py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
              >
                <CheckCircle2 className="h-5 w-5" />
                ثبت و تایید نهایی حضور
              </a>
            )}
          </section>
        ) : null}

        {/* Dress code + blessing */}
        <section className="space-y-4 rounded-xl bg-[#f6f3ed] p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fed892] text-[color:var(--pe-secondary)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[color:var(--pe-primary)]">
                تم پوشش میهمانان (Dress Code)
              </h3>
              <p className="mt-0.5 text-xs leading-6 text-[#414845]">
                {theme.dressCode}
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-white p-4 text-center">
            <div className="flex justify-center text-[color:var(--pe-secondary)]">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <p className="font-display text-xl text-[color:var(--pe-primary)]">
              {theme.blessingLine}
            </p>
            <p className="text-xs text-[#414845]">
              با نهایت اشتیاق چشم‌انتظار دیدار روی ماهتان هستیم
            </p>
            <p className="pt-1 text-sm font-semibold text-[color:var(--pe-secondary)]">
              {couple}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
