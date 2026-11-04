"use client";

import type { CSSProperties } from "react";
import { CalendarDays, CheckCircle2, MapPin, XCircle } from "lucide-react";
import { Countdown } from "@/templates/shared/countdown";
import {
  coupleLabel,
  formatEventDay,
  formatEventTimeRange,
  googleCalendarUrl,
} from "@/templates/shared/format";
import type {
  TemplateCustomization,
  TemplateRendererProps,
  TemplateScheduleItem,
} from "@/templates/types";

const DEFAULT_COVER = "/images/templates/moonlit-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۳۰",
    title: "ورود مهمانان",
    description: "پذیرایی آغازین در فضای باز",
  },
  {
    time: "۲۰:۰۰",
    title: "مراسم پیوند",
    description: "آغاز رسمی جشن زیر نور مهتاب",
  },
  {
    time: "۲۱:۱۵",
    title: "ضیافت شام",
    description: "شام مشترک و برش کیک",
  },
  {
    time: "۲۲:۳۰",
    title: "رقص و خاطره",
    description: "موسیقی زنده تا پایان شب",
  },
];

function mapsLinks(query: string) {
  const q = encodeURIComponent(query);
  return {
    neshan: `https://neshan.org/maps/search/${q}`,
    balad: `https://balad.ir/search?query=${q}`,
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
}

export function MoonlitInkRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const theme: TemplateCustomization = {
    primaryColor: "#F2EEE6",
    secondaryColor: "#A8B5C4",
    backgroundColor: "#0C1218",
    poeticLine: "شب از شبستان چشم تو آغاز می‌شود",
    dressCode: "لباس شب، رنگ‌های تیره یا صدفی. لطفاً از رنگ سفید کامل پرهیز کنید.",
    blessingLine: "حضور شما، نور کامل این شب است",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
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
  const showMap =
    features?.map !== false && !!(data.venueName || data.venueAddress);

  return (
    <div
      dir="rtl"
      className="relative isolate min-h-screen overflow-hidden text-[color:var(--mi-ink)]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          color: theme.primaryColor,
          "--mi-ink": theme.primaryColor,
          "--mi-mist": theme.secondaryColor,
          "--mi-bg": theme.backgroundColor,
        } as CSSProperties
      }
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,181,196,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,238,230,0.35)_0%,rgba(242,238,230,0.08)_45%,transparent_70%)] blur-sm animate-[fade-up_1.4s_ease_both]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(242,238,230,0.35)_1px,transparent_1px)] [background-size:3px_3px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      <div className="relative mx-auto flex w-full max-w-md flex-col px-5 pb-20 pt-14">
        {/* Hero */}
        <header className="flex flex-col items-center text-center animate-[fade-up_0.9s_cubic-bezier(0.22,1,0.36,1)_both]">
          <p className="mb-8 text-[11px] font-medium tracking-[0.35em] text-[color:var(--mi-mist)] uppercase">
            Moonlit Invitation
          </p>

          <div className="relative mb-8 w-full max-w-[280px]">
            <div className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(168,181,196,0.28),transparent_70%)] blur-md" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[color:var(--mi-mist)]/30 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={couple}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1218]/75 via-transparent to-[#0C1218]/20" />
              </div>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-4 text-[color:var(--mi-mist)]/70">
            <span className="h-px w-10 bg-current" />
            <span className="h-2 w-2 rounded-full border border-current" />
            <span className="h-px w-10 bg-current" />
          </div>

          <h1 className="font-display text-5xl leading-[1.25] md:text-6xl">
            <span className="block">{data.partnerOneName}</span>
            <span className="my-3 block font-sans text-sm tracking-[0.4em] text-[color:var(--mi-mist)]">
              و
            </span>
            <span className="block">{data.partnerTwoName}</span>
          </h1>

          <p className="mt-8 max-w-md font-display text-xl leading-10 text-[color:var(--mi-mist)] md:text-2xl">
            {theme.poeticLine}
          </p>
          <p className="mt-5 max-w-lg text-sm leading-8 text-[color:var(--mi-ink)]/75">
            {data.invitationText ||
              "با مهر فراوان، شما را به شب پیوندمان دعوت می‌کنیم."}
          </p>
        </header>

        {/* Date band */}
        <section
          className="mt-14 rounded-2xl border border-[color:var(--mi-mist)]/20 bg-white/[0.03] px-5 py-6 text-center backdrop-blur-sm animate-[fade-up_0.9s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center justify-center gap-2 text-[color:var(--mi-mist)]">
            <CalendarDays className="h-4 w-4" />
            <p className="text-sm font-medium">{dayLabel}</p>
          </div>
          {timeLabel ? (
            <p className="mt-2 text-xs text-[color:var(--mi-ink)]/65">{timeLabel}</p>
          ) : null}

          {showCountdown ? (
            <Countdown
              eventStartAt={data.eventStartAt!}
              className="mt-6 [&_div]:rounded-xl [&_div]:border [&_div]:border-[color:var(--mi-mist)]/20 [&_div]:bg-white/[0.04] [&_p:first-child]:font-display [&_p:first-child]:text-2xl [&_p:first-child]:text-[color:var(--mi-ink)] [&_p:last-child]:text-[color:var(--mi-mist)]"
            />
          ) : null}

          {calendarHref ? (
            <a
              href={calendarHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[color:var(--mi-mist)]/35 px-4 py-2.5 text-xs text-[color:var(--mi-mist)] transition hover:border-[color:var(--mi-ink)]/50 hover:text-[color:var(--mi-ink)]"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              افزودن به تقویم
            </a>
          ) : null}
        </section>

        {/* Schedule */}
        <section
          className="mt-14 animate-[fade-up_0.9s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ animationDelay: "220ms" }}
        >
          <h2 className="font-display text-2xl text-[color:var(--mi-ink)]">
            گذر شب
          </h2>
          <p className="mt-2 text-sm text-[color:var(--mi-mist)]">
            برنامه زمانی مراسم
          </p>

          <ol className="mt-8 space-y-0">
            {schedule.map((item, index) => (
              <li
                key={`${item.time}-${item.title}`}
                className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-[color:var(--mi-mist)]/15 py-5 first:border-t-0"
              >
                <div className="pt-0.5 text-left font-display text-lg text-[color:var(--mi-mist)] tabular-nums">
                  {item.time}
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.2em] text-[color:var(--mi-mist)]/70">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-base font-medium text-[color:var(--mi-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-[color:var(--mi-ink)]/60">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Venue */}
        {showMap ? (
          <section
            className="mt-14 rounded-2xl border border-[color:var(--mi-mist)]/20 bg-white/[0.03] p-6 animate-[fade-up_0.9s_cubic-bezier(0.22,1,0.36,1)_both]"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[color:var(--mi-mist)]" />
              <div>
                <h2 className="font-display text-2xl">محل برگزاری</h2>
                {data.venueName ? (
                  <p className="mt-3 text-base text-[color:var(--mi-ink)]">
                    {data.venueName}
                  </p>
                ) : null}
                {data.venueAddress ? (
                  <p className="mt-2 text-sm leading-7 text-[color:var(--mi-ink)]/65">
                    {data.venueAddress}
                  </p>
                ) : null}
                {links ? (
                  <div className="mt-5 flex flex-wrap gap-3 text-xs">
                    {[
                      { href: links.neshan, label: "نشان" },
                      { href: links.balad, label: "بلد" },
                      { href: links.google, label: "Google Maps" },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[color:var(--mi-mist)]/30 px-3 py-2 text-[color:var(--mi-mist)] transition hover:border-[color:var(--mi-ink)]/40 hover:text-[color:var(--mi-ink)]"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* RSVP */}
        {features?.rsvp !== false ? (
          <section
            className="mt-14 text-center animate-[fade-up_0.9s_cubic-bezier(0.22,1,0.36,1)_both]"
            style={{ animationDelay: "380ms" }}
          >
            <h2 className="font-display text-2xl">اعلام حضور</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[color:var(--mi-ink)]/65">
              لطفاً حضور یا عدم حضور خود را اعلام کنید تا میزبانی‌مان کامل شود.
            </p>

            {preview ? (
              <div className="mx-auto mt-6 flex max-w-md flex-col gap-3">
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[color:var(--mi-ink)] px-4 py-3 text-sm font-medium text-[color:var(--mi-bg)]">
                  <CheckCircle2 className="h-4 w-4" />
                  با افتخار حاضر می‌شوم
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl border border-[color:var(--mi-mist)]/30 px-4 py-3 text-sm text-[color:var(--mi-mist)]">
                  <XCircle className="h-4 w-4" />
                  متأسفانه نمی‌توانم بیایم
                </div>
              </div>
            ) : (
              <a
                href="#rsvp"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[color:var(--mi-ink)] px-6 py-3 text-sm font-medium text-[color:var(--mi-bg)] transition hover:opacity-90"
              >
                <CheckCircle2 className="h-4 w-4" />
                ثبت پاسخ
              </a>
            )}
          </section>
        ) : null}

        {/* Closing */}
        <footer className="mt-16 border-t border-[color:var(--mi-mist)]/15 pt-10 text-center">
          <p className="text-xs leading-6 text-[color:var(--mi-mist)]">
            {theme.dressCode}
          </p>
          <p className="mt-6 font-display text-xl text-[color:var(--mi-ink)]">
            {theme.blessingLine}
          </p>
          <p className="mt-3 text-sm text-[color:var(--mi-mist)]">{couple}</p>
        </footer>
      </div>
    </div>
  );
}
