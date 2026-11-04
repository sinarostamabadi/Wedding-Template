"use client";

import type { CSSProperties } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Gift,
  MapPin,
  Navigation,
  Share2,
  XCircle,
} from "lucide-react";
import { Countdown } from "@/templates/shared/countdown";
import {
  coupleLabel,
  formatEventDay,
  googleCalendarUrl,
} from "@/templates/shared/format";
import type {
  TemplateCustomization,
  TemplateRendererProps,
  TemplateScheduleItem,
} from "@/templates/types";

const DEFAULT_COVER = "/images/templates/desert-rose-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۵:۳۰ عصر",
    title: "پذیرایی بدو ورود و نوشیدنی غروب",
    description: "استقبال با نوشیدنی و نوای سازهای زهی",
  },
  {
    time: "۶:۳۰ عصر",
    title: "مراسم عقد و پیوند در ساعت طلایی",
    description: "سوگند عشق هم‌زمان با غروب آفتاب",
    icon: "heart",
  },
  {
    time: "۸:۰۰ شب",
    title: "شام فاخر و جشن زیر ستارگان",
    description: "ضیافت شام، برش کیک و پایکوبی",
    icon: "dining",
  },
  {
    time: "۱۱:۰۰ شب",
    title: "افترپارتی و بدرقه آتشین",
    description: "آتش‌بازی و بدرقه عروس و داماد",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#B77F6E", label: "رزگلد متالیک" },
  { color: "#D4A373", label: "ماسه گرم" },
  { color: "#A65B48", label: "تراکوتا" },
  { color: "#29221F", label: "مشکی شب" },
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

function FoilFringe({
  placement,
  className = "",
}: {
  placement: "top" | "bottom";
  className?: string;
}) {
  const mask =
    placement === "top"
      ? "linear-gradient(to bottom, black 30%, transparent 100%)"
      : "linear-gradient(to top, black 35%, transparent 100%)";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 h-24 opacity-80 ${
        placement === "top" ? "top-0" : "bottom-0 h-16"
      } ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent, transparent 5px, #b88270 5px, #d8aba0 6.5px, transparent 6.5px, transparent 12px)",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}

export function DesertRoseStationeryRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const theme: TemplateCustomization = {
    primaryColor: "#2B2625",
    secondaryColor: "#B77F6E",
    backgroundColor: "#FDFBF7",
    poeticLine: "همراه با عشق بی‌پایان",
    blessingLine: "جشن آغاز همسفری ما",
    dressCode:
      "کد لباس: رسمی شیک کویری (Black Tie Optional). طیف رزگلد، ماسه و تراکوتا پیشنهاد می‌شود.",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
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
      className="relative min-h-screen overflow-x-hidden text-[#332B29]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--dr-rose": theme.secondaryColor || "#B77F6E",
          "--dr-ink": theme.primaryColor || "#2B2625",
        } as CSSProperties
      }
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#FDFBF7] shadow-[0_0_60px_rgba(0,0,0,0.25)]">
        {/* Top utility bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#EAE3DC] bg-[#FAF8F5]/90 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-[11px] tracking-wider text-[#6E5D57]">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[color:var(--dr-rose)] border-t-transparent [animation-duration:6s]" />
            <span className="uppercase">Desert Sunset</span>
          </div>
          <span className="rounded border border-[color:var(--dr-rose)]/40 px-2 py-0.5 text-[11px] uppercase tracking-widest text-[#A3928B]">
            FA / EN
          </span>
        </header>

        <main className="flex-1 pb-24">
          {/* Envelope + hero stationery card */}
          <section className="relative overflow-hidden bg-gradient-to-b from-[#241f1e] via-[#2d2624] to-[#FAF8F5] px-4 pb-8 pt-6">
            <div className="relative mx-auto w-full max-w-[370px]">
              {/* Kraft envelope peek */}
              <div className="pointer-events-none absolute -left-3 -top-3 z-0 h-56 w-40 -rotate-[14deg]">
                <div
                  className="relative h-full w-full overflow-hidden rounded-tl-[36px] border border-[#d6a593]/40 shadow-2xl"
                  style={{
                    background:
                      "linear-gradient(145deg, #cb9f8a 0%, #b88673 35%, #c89883 60%, #9f6957 100%)",
                    boxShadow:
                      "inset 0 0 40px rgba(0,0,0,0.18), 0 16px 36px -10px rgba(0,0,0,0.45)",
                  }}
                >
                  <div
                    className="absolute inset-2 rounded-tl-[28px] border border-white/10 opacity-95 shadow-inner"
                    style={{
                      backgroundColor: "#111",
                      backgroundImage:
                        "radial-gradient(#ffffff 2px, transparent 2px)",
                      backgroundSize: "15px 15px",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/15" />
                </div>
              </div>

              {/* Invitation plate */}
              <article
                className="relative z-10 overflow-hidden rounded-2xl border border-[#e5dcd3] shadow-[0_20px_45px_-8px_rgba(0,0,0,0.45)]"
                style={{
                  backgroundColor: "#FAF8F5",
                  backgroundImage:
                    "radial-gradient(#d3c5b4 0.65px, transparent 0.65px), radial-gradient(#d3c5b4 0.65px, #FAF8F5 0.65px)",
                  backgroundSize: "26px 26px",
                  backgroundPosition: "0 0, 13px 13px",
                }}
              >
                <div className="relative m-2 overflow-hidden rounded-xl border border-[#d8b5a5]/70 bg-[#FDFBF8]/95 p-4 sm:p-5">
                  <FoilFringe placement="top" />

                  <header className="relative z-10 pb-3 pt-2 text-center" dir="ltr">
                    <p className="mb-1 font-display text-xs italic uppercase tracking-[0.25em] text-[#936c5f]">
                      Join Us for the Celebration
                    </p>
                    <p
                      className="mb-2.5 text-xs tracking-wider text-[#8c6759]"
                      dir="rtl"
                    >
                      به شادمانی آغاز پیوند ما
                    </p>
                    <h1 className="font-display text-[27px] font-light uppercase leading-tight tracking-[0.16em] text-[#2A2321]">
                      {data.partnerOneName} &amp; {data.partnerTwoName}
                    </h1>
                    <p
                      className="mt-1 text-sm font-light tracking-wide text-[#775345]"
                      dir="rtl"
                    >
                      {couple}
                    </p>
                    <div className="mt-2.5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#78665f]">
                      <span>{dateEn || dayFa || "Date TBA"}</span>
                      {data.venueName ? (
                        <>
                          <span className="h-1 w-1 rounded-full bg-[color:var(--dr-rose)]" />
                          <span className="max-w-[140px] truncate">
                            {data.venueName}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </header>

                  <div className="relative z-10 my-3 overflow-hidden rounded-lg border border-[#dfcebe] shadow-md">
                    <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-[#EAE2D8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-2.5 px-3 text-center"
                        dir="rtl"
                      >
                        <span className="text-[11px] font-light tracking-widest text-white/95 drop-shadow">
                          {theme.poeticLine || "عشق، افق روشن فردای ماست"}
                        </span>
                      </div>
                    </div>
                    <FoilFringe placement="bottom" className="opacity-75" />
                  </div>

                  <footer className="relative z-10 pb-1 pt-2 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <span className="h-px w-7 bg-[#CFA092]" />
                      <span className="h-1.5 w-1.5 rotate-45 bg-[color:var(--dr-rose)]" />
                      <span className="h-px w-7 bg-[#CFA092]" />
                    </div>
                    {dayFa ? (
                      <p className="font-display text-lg font-semibold tracking-wide text-[color:var(--dr-ink)]">
                        {dayFa}
                      </p>
                    ) : null}
                    {dateEn ? (
                      <p className="mt-0.5 text-[11px] font-light uppercase tracking-widest text-[#7E6E67]">
                        {dateEn}
                      </p>
                    ) : null}
                    {(data.venueName || data.venueAddress) && (
                      <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-[#907a70]">
                        <MapPin className="h-3 w-3 text-[color:var(--dr-rose)]" />
                        {[data.venueName, data.venueAddress]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                  </footer>

                  <FoilFringe placement="bottom" className="opacity-40" />
                </div>
              </article>
            </div>
          </section>

          {/* Greeting */}
          <section className="px-6 py-8 text-center">
            <span className="mb-1 block font-display text-lg italic text-[color:var(--dr-rose)]">
              {theme.poeticLine}
            </span>
            <h2 className="mb-3 font-display text-2xl font-semibold tracking-wide text-[color:var(--dr-ink)]">
              {theme.blessingLine}
            </h2>
            <div className="mx-auto mb-4 h-[1.5px] w-12 bg-[#CFA092]" />
            <p className="mx-auto max-w-xs text-sm font-light leading-relaxed text-[#665751]">
              {data.invitationText ||
                "در غروب طلایی کویر و زیر آسمان پرستاره، پیوند جاودانه‌مان را جشن می‌گیریم. حضور گرم شما زیباترین یادگار این شب خواهد بود."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {calendarHref ? (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E4BEB2] bg-white px-4 py-2 text-xs font-medium text-[color:var(--dr-ink)] shadow-sm transition hover:bg-[#FBF0EC]"
                >
                  <CalendarDays className="h-3.5 w-3.5 text-[color:var(--dr-rose)]" />
                  تقویم
                </a>
              ) : null}
              {showMap ? (
                <a
                  href="#location"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E4BEB2] bg-white px-4 py-2 text-xs font-medium text-[color:var(--dr-ink)] shadow-sm transition hover:bg-[#FBF0EC]"
                >
                  <MapPin className="h-3.5 w-3.5 text-[color:var(--dr-rose)]" />
                  لوکیشن
                </a>
              ) : null}
            </div>
          </section>

          {/* Countdown */}
          {showCountdown ? (
            <section className="relative mx-5 mb-8 overflow-hidden rounded-2xl border border-[#EBE3DA] bg-white/80 p-6 text-center shadow-sm">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--dr-rose)]">
                شمارش معکوس تا آغاز لحظه وصال
              </p>
              <Countdown
                eventStartAt={data.eventStartAt!}
                className="[&_div]:rounded-xl [&_div]:border [&_div]:border-stone-200 [&_div]:bg-[#F7F4F0] [&_p:first-child]:font-display [&_p:first-child]:text-2xl [&_p:first-child]:font-bold [&_p:first-child]:text-[color:var(--dr-ink)] [&_p:last-child]:text-[10px] [&_p:last-child]:uppercase [&_p:last-child]:tracking-wider [&_p:last-child]:text-stone-500"
              />
            </section>
          ) : null}

          {/* Timeline */}
          <section className="px-6 py-6">
            <div className="mb-6 text-center">
              <span className="text-xs uppercase tracking-[0.25em] text-[#CFA092]">
                برنامه روز مراسم
              </span>
              <h3 className="mt-1 font-display text-2xl font-medium text-[color:var(--dr-ink)]">
                گاه‌شمار جشن
              </h3>
              <div className="mx-auto mt-2 h-px w-8 bg-[#CFA092]" />
            </div>
            <div className="relative mr-3 space-y-6 border-r-2 border-[#F4DDD5] pr-5">
              {schedule.map((item, index) => (
                <div key={`${item.time}-${item.title}`} className="relative">
                  <span
                    className={`absolute -right-[27px] top-1 h-3.5 w-3.5 rounded-full ${
                      index === 1
                        ? "bg-[color:var(--dr-rose)] ring-4 ring-[#FBF0EC]"
                        : "border-2 border-[color:var(--dr-rose)] bg-white"
                    }`}
                  />
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="font-display text-lg font-medium text-[color:var(--dr-ink)]">
                      {item.title}
                    </h4>
                    <span
                      className="shrink-0 text-xs font-semibold text-[color:var(--dr-rose)]"
                      dir="ltr"
                    >
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-light leading-relaxed text-[#7A6B65]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Venue */}
          {showMap ? (
            <section
              id="location"
              className="mx-5 mb-8 scroll-mt-24 rounded-2xl border border-stone-200/80 bg-[#F7F4F0] p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBF0EC] text-[color:var(--dr-rose)]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[color:var(--dr-ink)]">
                    مکان برگزاری مراسم
                  </h3>
                  <p className="text-xs text-[#7C6C66]">
                    {[data.venueName, data.venueAddress]
                      .filter(Boolean)
                      .join(" • ") || "محل برگزاری به‌زودی اعلام می‌شود"}
                  </p>
                </div>
              </div>
              {data.venueAddress ? (
                <p className="mb-4 text-xs leading-relaxed text-[#6B5C56]">
                  آدرس: {data.venueAddress}
                </p>
              ) : null}
              {query ? (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                      label: "گوگل مپ",
                    },
                    {
                      href: `https://waze.com/ul?q=${query}`,
                      label: "ویز",
                    },
                    {
                      href: `https://maps.apple.com/?q=${query}`,
                      label: "اپل مپ",
                    },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-white p-2.5 text-center shadow-sm transition hover:border-[#CFA092]"
                    >
                      <Navigation className="mb-1 h-4 w-4 text-[color:var(--dr-rose)]" />
                      <span className="text-[11px] font-medium text-stone-700">
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {/* Dress code */}
          <section className="mb-6 px-6 py-6">
            <div className="mb-5 text-center">
              <span className="text-xs uppercase tracking-[0.2em] text-[#CFA092]">
                پوشش میهمانان
              </span>
              <h3 className="mt-1 font-display text-2xl font-medium text-[color:var(--dr-ink)]">
                کد لباس: رسمی شیک کویری
              </h3>
              <p className="mt-1 text-xs text-[#7F6E68]">
                Black Tie Optional &amp; Desert Sunset Hues
              </p>
            </div>
            <p className="mx-auto mb-4 max-w-xs text-center text-xs leading-relaxed text-[#6B5A54]">
              {theme.dressCode}
            </p>
            <div className="flex items-center justify-center gap-3">
              {SWATCHES.map((item) => (
                <div key={item.label} className="text-center">
                  <div
                    className="mx-auto h-11 w-11 rounded-full border-2 border-white shadow-md ring-1 ring-stone-200"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="mt-1 block text-[10px] text-stone-600">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* RSVP */}
          {features?.rsvp !== false ? (
            <section
              id="rsvp"
              className="relative mx-5 mb-8 overflow-hidden rounded-3xl border border-[#F4DDD5] bg-white p-6 shadow-xl"
            >
              <div className="mb-6 text-center">
                <span className="font-display text-sm italic text-[color:var(--dr-rose)]">
                  اعلام حضور
                </span>
                <h3 className="font-display text-2xl font-semibold text-[color:var(--dr-ink)]">
                  پاسخ به دعوتنامه (RSVP)
                </h3>
                <p className="mt-1 text-xs font-light text-[#8C7B75]">
                  لطفاً ما را از حضور خود مطلع فرمایید.
                </p>
              </div>
              {preview ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-[#B77F6E] bg-[#FBF0EC]/60 px-4 py-3 text-xs font-medium text-[color:var(--dr-ink)]">
                    <CheckCircle2 className="h-4 w-4 text-[color:var(--dr-rose)]" />
                    با کمال میل می‌آیم
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-[#F7F4F0] px-4 py-3 text-xs font-medium text-stone-600">
                    <XCircle className="h-4 w-4" />
                    متأسفانه مقدور نیست
                  </div>
                  <div
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #CFA092 0%, #B77F6E 40%, #D8ABA0 70%, #9E6454 100%)",
                      boxShadow: "0 8px 24px -4px rgba(183, 127, 110, 0.4)",
                    }}
                  >
                    ارسال پاسخ و تأیید نهایی
                  </div>
                </div>
              ) : (
                <a
                  href="#rsvp"
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white shadow-lg transition hover:opacity-95"
                  style={{
                    background:
                      "linear-gradient(135deg, #CFA092 0%, #B77F6E 40%, #D8ABA0 70%, #9E6454 100%)",
                    boxShadow: "0 8px 24px -4px rgba(183, 127, 110, 0.4)",
                  }}
                >
                  ارسال پاسخ و تأیید نهایی
                </a>
              )}
            </section>
          ) : null}

          {/* Gift note */}
          <section className="border-t border-stone-200 px-6 py-6 text-center text-xs text-[#82716B]">
            <p className="mb-1 font-display text-base italic text-[color:var(--dr-ink)]">
              بزرگ‌ترین هدیه، حضور پرمهر شماست
            </p>
            <p className="mx-auto max-w-xs font-light leading-relaxed">
              چنانچه مایل به همراهی در آغاز این مسیر هستید، می‌توانید به لیست
              هدایای زوج سر بزنید.
            </p>
            <span className="mt-3 inline-flex items-center gap-2 border-b border-[#E4BEB2] pb-0.5 font-medium text-[color:var(--dr-rose)]">
              <Gift className="h-3.5 w-3.5" />
              مشاهده لیست هدایای عروسی
            </span>
          </section>
        </main>

        {/* Sticky bottom bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-md items-center justify-between border-t border-[#E8DFD8] bg-[#FAF8F5]/95 px-6 py-2.5 shadow-2xl backdrop-blur-lg">
          {features?.rsvp !== false ? (
            preview ? (
              <span
                className="ml-3 flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #CFA092 0%, #B77F6E 40%, #D8ABA0 70%, #9E6454 100%)",
                }}
              >
                پاسخ به دعوتنامه
              </span>
            ) : (
              <a
                href="#rsvp"
                className="ml-3 flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #CFA092 0%, #B77F6E 40%, #D8ABA0 70%, #9E6454 100%)",
                }}
              >
                پاسخ به دعوتنامه
              </a>
            )
          ) : (
            <span className="flex-1" />
          )}
          <div className="flex items-center gap-2 text-stone-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-[color:var(--dr-rose)] shadow-sm">
              <Share2 className="h-3.5 w-3.5" />
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}
