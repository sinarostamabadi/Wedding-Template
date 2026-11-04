"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowDown,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Frown,
  Gift,
  Heart,
  LockOpen,
  MapPin,
  Music2,
  Navigation,
  PartyPopper,
  RotateCcw,
  Send,
  Share2,
  Shirt,
  Smile,
  Sparkles,
  Utensils,
  Wine,
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

const DEFAULT_COVER = "/images/templates/midnight-rose-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۳۰",
    title: "پذیرایی خوش‌آمدگویی و شربت زعفران",
    description:
      "استقبال از میهمانان گرامی با شربت زعفران، ماکتیل‌های دست‌ساز و نوای زهی ویولنسل.",
    icon: "cafe",
  },
  {
    time: "۱۹:۴۵",
    title: "آیین عقد در کنار سفره نور و آینه",
    description:
      "پیمان پیوند و سوگند عشق در کنار سفره عقد مزین به کریستال و نقره‌کوب.",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافت شام سلطنتی",
    description:
      "خوراک‌های اصیل درباری ایرانی، بوفه بین‌الملل و میز دسرهای فرانسوی.",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰",
    title: "برش کیک، رقص و نورافشانی",
    description: "رقص عروس و داماد، پایکوبی شبانه و آتش‌بازی در آسمان شب.",
    icon: "music",
  },
];

const SWATCHES = [
  { color: "#0f172a", label: "سرمه‌ای سلطنتی", en: "Midnight Navy" },
  { color: "#f2ca50", label: "شامپاینی طلایی", en: "Champagne" },
  { color: "#e8b4a0", label: "رزگلد کوتور", en: "Rose Gold" },
  { color: "#f8f5ee", label: "عاجی اشرافی", en: "Royal Ivory" },
];

const NODE_STYLES = [
  "bg-gradient-to-br from-[#e8b4a0] via-[#f2ca50] to-[#b77c68] text-[#0d131f]",
  "bg-gradient-to-br from-[#f2ca50] to-[#855e1a] text-[#0d131f]",
  "border border-[#e8b4a0]/30 bg-gradient-to-br from-[#243557] to-[#121c32] text-[#e8b4a0]",
  "bg-gradient-to-br from-[#b77c68] to-[#592c1e] text-[#dde2f4]",
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

const frosted =
  "border border-[#e8b4a0]/20 bg-[#161c28]/80 shadow-[0_12px_32px_rgba(4,8,18,0.6)] backdrop-blur-xl";
const roseText =
  "bg-[linear-gradient(135deg,#f7d6cb_0%,#e8b4a0_35%,#d4957e_60%,#f9ded5_100%)] bg-clip-text text-transparent";
const roseButton =
  "bg-gradient-to-l from-[#b77c68] via-[#e8b4a0] to-[#f2ca50] text-[#0d131f]";

function RoseLine({ className = "" }: { className?: string }) {
  return (
    <span
      className={`h-px bg-[linear-gradient(90deg,transparent_0%,rgba(232,180,160,0.7)_50%,transparent_100%)] ${className}`}
    />
  );
}

function SectionTitle({
  kicker,
  title,
  Icon,
}: {
  kicker: string;
  title: string;
  Icon: typeof Clock;
}) {
  return (
    <div className="mb-4 flex items-center justify-between px-1">
      <div>
        <span className="text-[11px] tracking-[0.2em] text-[#e8b4a0]">
          {kicker}
        </span>
        <h3 className="mt-0.5 text-lg font-bold text-[#dde2f4]">{title}</h3>
      </div>
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8b4a0]/30 bg-[#e8b4a0]/10 text-[#e8b4a0]">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

export function MidnightRoseRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [open, setOpen] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);

  const theme: TemplateCustomization = {
    primaryColor: "#e8b4a0",
    secondaryColor: "#f2ca50",
    backgroundColor: "#0d131f",
    poeticLine:
      "«زهی بزم و زهی می و زهی ساقی که ما داریم، زهی شادی و آبادی که در دولتسرا داریم»",
    blessingLine:
      "باارزش‌ترین هدیه، حضور پرمهر و دعای خیر شما در آغاز این پیوند است.",
    dressCode:
      "پوشش رسمی (Black-Tie). خوشحال می‌شویم با پالت هارمونیک بزم سلطنتی همراه باشید.",
    musicTitle: "نغمه اختصاصی پیوند",
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
      className="relative min-h-screen overflow-x-hidden text-[#dde2f4]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--mr-rose": theme.primaryColor || "#e8b4a0",
          "--mr-gold": theme.secondaryColor || "#f2ca50",
        } as CSSProperties
      }
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#0d131f]">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#e8b4a0]/20 bg-[#0d131f]/85 px-4 backdrop-blur-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8b4a0]/30 bg-[#e8b4a0]/10 text-[color:var(--mr-rose)]">
            <Music2 className="h-5 w-5" />
          </span>
          <div className="flex flex-col items-center">
            <span
              className={`font-display text-lg font-bold tracking-[0.25em] ${roseText}`}
            >
              {monogram}
            </span>
            <span
              dir="ltr"
              className="-mt-0.5 text-[9px] uppercase tracking-[0.3em] text-[#e8b4a0]/75"
            >
              Royal Wedding
            </span>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8b4a0]/20 bg-white/5 text-[#e8b4a0]/90">
            <Share2 className="h-[18px] w-[18px]" />
          </span>
        </header>

        <main className="flex flex-col pb-24">
          {/* Envelope theater */}
          <section className="relative flex flex-col items-center overflow-hidden px-4 pb-6 pt-4">
            <div className="mb-6 flex max-w-sm flex-col items-center text-center">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#e8b4a0]/30 bg-[#242a37] px-3.5 py-1 text-[11px] font-medium tracking-wide text-[#e8b4a0] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                کارت دعوت آنباکسینگ شاهانه
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight">
                جشن پیوند <span className={roseText}>{couple}</span>
              </h1>
              <p
                dir="ltr"
                className="mt-1 font-display text-xs italic tracking-widest text-[#e8b4a0]/80"
              >
                {data.partnerOneName} &amp; {data.partnerTwoName} • A Royal
                Celebration
              </p>
            </div>

            <div className="relative flex h-[510px] w-full max-w-[360px] items-center justify-center [perspective:1600px]">
              <div className="relative flex h-[400px] w-full items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_50%_15%,#1a2236_0%,#101626_55%,#080d1a_100%)] shadow-[0_24px_60px_-12px_rgba(4,8,18,0.95),0_0_0_1px_rgba(232,180,160,0.25)]">
                <div className="pointer-events-none absolute inset-2.5 rounded-2xl border border-dashed border-[#e8b4a0]/20" />
                <div className="pointer-events-none absolute inset-4 rounded-xl border border-[#f2ca50]/15" />

                {/* Invitation card */}
                <div
                  className={`absolute flex h-[470px] w-[88%] flex-col items-center overflow-hidden rounded-2xl border border-[#e8b4a0]/40 bg-[linear-gradient(165deg,#161c28_0%,#0d131f_50%,#111827_100%)] p-4 text-center transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                    open
                      ? "z-[35] -translate-y-[145px] -rotate-[0.5deg] scale-[1.03] opacity-100 shadow-[0_35px_70px_-15px_rgba(0,0,0,0.85)]"
                      : "invisible z-10 translate-y-10 scale-90 opacity-0"
                  }`}
                >
                  <div className="flex w-full items-center justify-between px-2 pt-0.5 opacity-90">
                    <span className="text-xs text-[#e8b4a0]">✦</span>
                    <span className="text-[10px] font-medium tracking-[0.2em] text-[#e8b4a0]">
                      بسم‌الله الرحمن الرحیم
                    </span>
                    <span className="text-xs text-[#e8b4a0]">✦</span>
                  </div>
                  <div className="relative mt-2.5 h-48 w-36 shrink-0 overflow-hidden rounded-b-2xl rounded-t-full border-2 border-[#e8b4a0]/50 bg-[#070b13] shadow-[0_14px_30px_rgba(0,0,0,0.85)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d131f]/85 via-transparent to-transparent" />
                  </div>
                  <h2 className={`mt-2 text-lg font-extrabold ${roseText}`}>
                    {couple}
                  </h2>
                  <span
                    dir="ltr"
                    className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8b4a0]/90"
                  >
                    {data.partnerOneName} &amp; {data.partnerTwoName}
                  </span>
                  <p className="mt-2 px-1 text-[11.5px] italic leading-5 text-[#d0c5af]">
                    {theme.poeticLine}
                  </p>
                  <div className="mt-auto flex w-full items-center justify-around rounded-xl border border-[#e8b4a0]/20 bg-[#242a37]/90 px-3 py-2">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-[#e8b4a0]">
                        تاریخ جشن پیوند
                      </span>
                      <span className="text-[11px] font-bold">
                        {dayFa || "به‌زودی"}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-[#e8b4a0]/30" />
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-[#e8b4a0]">
                        محل ضیافت
                      </span>
                      <span className="text-[11px] font-bold">
                        {data.venueName || "اعلام می‌شود"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pocket */}
                <div
                  className={`absolute inset-x-0 bottom-0 z-20 flex h-44 flex-col items-center justify-end rounded-b-3xl border-t border-[#e8b4a0]/40 bg-gradient-to-t from-[#080d1a] via-[#101626] to-[#1a2236] pb-4 shadow-[0_-8px_25px_rgba(0,0,0,0.65)] transition-opacity duration-700 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="mb-2 h-1 w-12 rounded-full bg-[#e8b4a0]/35" />
                  <span
                    dir="ltr"
                    className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e8b4a0]/90"
                  >
                    Royal Monogram Archive
                  </span>
                </div>

                {/* Flap */}
                <div
                  className={`absolute inset-x-0 top-0 z-30 h-48 origin-top border-t border-[#e8b4a0]/30 bg-gradient-to-b from-[#1e273d] via-[#141b2c] to-[#0c1220] shadow-[0_15px_35px_rgba(0,0,0,0.7)] transition-transform duration-700 [backface-visibility:hidden] ${
                    open ? "[transform:rotateX(-180deg)]" : ""
                  }`}
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                >
                  <div
                    className="pointer-events-none absolute inset-x-4 top-2 h-40 opacity-40"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background:
                        "linear-gradient(180deg, rgba(232,180,160,0.75) 0%, transparent 80%)",
                    }}
                  />
                </div>

                {/* Wax seal */}
                <div
                  className={`absolute top-36 z-40 flex flex-col items-center transition-all duration-500 ${
                    open ? "pointer-events-none rotate-[20deg] scale-125 opacity-0" : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-label="گشودن پاکت دعوت"
                    onClick={() => setOpen(true)}
                    className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f7d6cb] via-[#d4957e] to-[#804f3d] p-1 shadow-[0_10px_28px_rgba(212,149,126,0.55),inset_0_2px_5px_rgba(255,255,255,0.6),inset_0_-3px_6px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95"
                  >
                    <span className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/25 bg-gradient-to-tl from-[#7a4939] via-[#bf836f] to-[#ffded4] shadow-inner">
                      <span className="font-display text-base font-extrabold leading-none tracking-wider text-[#0d131f]">
                        {monogram}
                      </span>
                      <LockOpen className="mt-0.5 h-3 w-3 text-[#0d131f] opacity-90 transition-transform group-hover:rotate-45" />
                    </span>
                    <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#e8b4a0] opacity-35" />
                  </button>
                  <span className="mt-2 flex items-center gap-1.5 rounded-full border border-[#e8b4a0]/35 bg-[#242a37]/95 px-3 py-1 text-[11px] font-medium text-[#e8b4a0] shadow-xl backdrop-blur">
                    برای گشودن پاکت لمس کنید
                  </span>
                </div>
              </div>
            </div>

            {open ? (
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 rounded-full border border-[#e8b4a0]/30 bg-[#242a37]/90 px-4 py-2 text-xs font-medium text-[#d0c5af] shadow-md transition hover:text-[#e8b4a0] active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  بستن پاکت
                </button>
                <a
                  href="#ceremony-details"
                  className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold shadow-lg active:scale-95 ${roseButton}`}
                >
                  <ArrowDown className="h-4 w-4" />
                  مشاهده برنامه و ثبت حضور
                </a>
              </div>
            ) : null}
          </section>

          {/* Unveiled content */}
          <div
            inert={!open}
            className={`flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open
                ? "translate-y-0 opacity-100"
                : "pointer-events-none max-h-0 translate-y-8 overflow-hidden opacity-0"
            }`}
          >
            {showMusic ? (
              <section className="mb-6 px-4">
                <div
                  className={`flex items-center justify-between rounded-2xl p-3.5 ${frosted}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${roseButton}`}
                    >
                      <Music2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-bold">
                        {theme.musicTitle}
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#e8b4a0]" />
                      </p>
                      <p
                        dir="ltr"
                        className="text-left font-display text-[11px] tracking-wide text-[#e8b4a0]/80"
                      >
                        Royal Symphony • Nocturne in Rose Gold
                      </p>
                    </div>
                  </div>
                  <div className="flex h-6 items-end gap-1 px-2 opacity-60">
                    {[2, 4, 3, 5, 2].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 animate-pulse rounded-full bg-[#e8b4a0]"
                        style={{
                          height: `${h * 4}px`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {showCountdown ? (
              <section
                id="ceremony-details"
                className="mb-8 flex scroll-mt-20 flex-col items-center px-4"
              >
                <div className="mb-4 w-full text-center">
                  <div className="mb-1.5 flex items-center justify-center gap-2">
                    <RoseLine className="w-8" />
                    <span className="text-[11px] font-medium tracking-[0.2em] text-[#e8b4a0]">
                      شمارش معکوس تا آغاز جشن وصال
                    </span>
                    <RoseLine className="w-8" />
                  </div>
                  <h3 className="text-lg font-bold">{dayFa}</h3>
                </div>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="w-full [&_div]:rounded-2xl [&_div]:border [&_div]:border-[#e8b4a0]/25 [&_div]:bg-[#161c28]/80 [&_div]:shadow-[0_12px_32px_rgba(4,8,18,0.6)] [&_p:first-child]:font-display [&_p:first-child]:text-2xl [&_p:first-child]:font-bold [&_p:first-child]:text-[#e8b4a0] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#d0c5af]"
                />
              </section>
            ) : (
              <span id="ceremony-details" />
            )}

            <section className="mb-8 px-4">
              <SectionTitle
                kicker="برنامه زمان‌بندی جشن"
                title="ساعت‌شمار بزم باشکوه"
                Icon={CalendarDays}
              />
              <div className="relative flex flex-col gap-3.5 pr-3">
                <div className="absolute bottom-4 right-4 top-4 w-px bg-gradient-to-b from-[#e8b4a0] via-[#f2ca50]/40 to-transparent" />
                {schedule.map((item, index) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <div
                      key={`${item.time}-${item.title}`}
                      className="relative flex items-start gap-3.5"
                    >
                      <span
                        className={`relative z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-lg ${
                          NODE_STYLES[index % NODE_STYLES.length]
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className={`flex-1 rounded-2xl p-4 ${frosted}`}>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold">{item.title}</h4>
                          <span className="shrink-0 rounded-full border border-[#e8b4a0]/20 bg-[#e8b4a0]/15 px-2 py-0.5 text-xs font-semibold text-[#e8b4a0]">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#d0c5af]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {showMap ? (
              <section id="location" className="mb-8 scroll-mt-20 px-4">
                <div className={`rounded-2xl p-4 ${frosted}`}>
                  <SectionTitle
                    kicker="نشانی و مسیریابی"
                    title={data.venueName || "محل برگزاری"}
                    Icon={MapPin}
                  />
                  <div className="relative flex h-44 items-end overflow-hidden rounded-xl border border-[#e8b4a0]/30 bg-gradient-to-br from-[#1a2236] to-[#080d1a] p-3">
                    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(232,180,160,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(232,180,160,0.35)_1px,transparent_1px)] [background-size:22px_22px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg ${roseButton}`}
                      >
                        <MapPin className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] via-[#0d131f]/40 to-transparent" />
                    {data.venueAddress ? (
                      <span className="relative z-10 flex items-center gap-1.5 text-xs font-bold text-white">
                        <Navigation className="h-3.5 w-3.5 text-[#e8b4a0]" />
                        {data.venueAddress}
                      </span>
                    ) : null}
                  </div>
                  {query ? (
                    <div className="mt-3 grid grid-cols-4 gap-2">
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
                          label: "گوگل‌مپ",
                        },
                      ].map((item, i) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 text-xs font-medium transition active:scale-95 ${
                            i === 0
                              ? `font-bold shadow-md ${roseButton}`
                              : "border border-[#e8b4a0]/20 bg-[#242a37]"
                          }`}
                        >
                          <Navigation
                            className={`h-4 w-4 ${i === 0 ? "" : "text-[#e8b4a0]"}`}
                          />
                          {item.label}
                        </a>
                      ))}
                      {calendarHref ? (
                        <a
                          href={calendarHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-[#e8b4a0]/20 bg-[#242a37] py-2.5 text-xs font-medium transition active:scale-95"
                        >
                          <CalendarDays className="h-4 w-4 text-[#e8b4a0]" />
                          تقویم
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            <section className="mb-8 px-4">
              <div className={`rounded-2xl p-4 ${frosted}`}>
                <div className="mb-2 flex items-center gap-2 px-1">
                  <Shirt className="h-5 w-5 text-[#e8b4a0]" />
                  <h3 className="text-base font-bold">
                    پالت پیشنهادی لباس مهمانان
                  </h3>
                </div>
                <p className="mb-4 px-1 text-xs leading-relaxed text-[#d0c5af]">
                  {theme.dressCode}
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {SWATCHES.map((item) => (
                    <div key={item.en} className="flex flex-col items-center">
                      <span
                        className="mb-1.5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#e8b4a0]/40 text-[10px] text-[#804f3d] shadow-lg"
                        style={{ backgroundColor: item.color }}
                      >
                        ✦
                      </span>
                      <span className="text-[11px] font-semibold">
                        {item.label}
                      </span>
                      <span
                        dir="ltr"
                        className="font-display text-[9px] text-[#d0c5af]"
                      >
                        {item.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {features?.rsvp !== false ? (
              <section id="rsvp" className="mb-8 scroll-mt-20 px-4">
                <div
                  className={`flex flex-col rounded-2xl border-[#e8b4a0]/30 p-5 ${frosted}`}
                >
                  <div className="mb-4 text-center">
                    <span className="text-[11px] tracking-[0.2em] text-[#e8b4a0]">
                      تأیید حضور در جشن پیوند
                    </span>
                    <h3 className="mt-0.5 text-lg font-bold">
                      اعلام حضور (RSVP)
                    </h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: true, label: "حضور دارم", Icon: Smile },
                        { value: false, label: "امکان حضور ندارم", Icon: Frown },
                      ].map(({ value, label, Icon }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAttending(value)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border border-[#e8b4a0]/25 p-3 text-xs shadow-sm transition ${
                            attending === value
                              ? `font-bold ${roseButton}`
                              : "bg-[#1a202c]"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                    <div
                      className={`flex items-center justify-between rounded-xl border border-[#e8b4a0]/20 bg-[#1a202c] p-3 transition ${
                        attending ? "" : "pointer-events-none opacity-30"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold">تعداد همراهان</p>
                        <p className="text-[10px] text-[#d0c5af]">
                          مجموع نفرات همراه شما
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8b4a0]/30 bg-[#242a37] font-bold active:scale-90"
                        >
                          −
                        </button>
                        <span className="px-1 text-base font-bold text-[#e8b4a0]">
                          {guests.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.min(8, g + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8b4a0] font-bold text-[#0d131f] shadow-sm active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {preview ? (
                      <div
                        className={`flex h-12 items-center justify-center gap-2 rounded-xl text-xs font-bold shadow-lg ${roseButton}`}
                      >
                        <Send className="h-4 w-4" />
                        ثبت نهایی و ارسال پاسخ
                      </div>
                    ) : (
                      <a
                        href="#rsvp"
                        className={`flex h-12 items-center justify-center gap-2 rounded-xl text-xs font-bold shadow-lg ${roseButton}`}
                      >
                        <Send className="h-4 w-4" />
                        ثبت نهایی و ارسال پاسخ
                      </a>
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            <section className="mb-10 px-4">
              <div className={`rounded-2xl p-5 ${frosted}`}>
                <div className="mb-2 flex items-center gap-2 px-1">
                  <Gift className="h-5 w-5 text-[#e8b4a0]" />
                  <h3 className="text-base font-bold">هدیه و یادبود پیوند</h3>
                </div>
                <p className="mb-4 px-1 text-xs leading-relaxed text-[#d0c5af]">
                  {theme.blessingLine}
                </p>
                <div className="relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl border border-[#e8b4a0]/40 bg-gradient-to-br from-[#1a233a] via-[#101726] to-[#251d2e] p-5 shadow-2xl">
                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#e8b4a0]/10 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <span className="flex h-6 w-8 items-center justify-center rounded bg-gradient-to-tr from-amber-400 to-yellow-200 shadow">
                      <CreditCard className="h-3.5 w-3.5 text-[#0d131f]" />
                    </span>
                    <span
                      className={`font-display text-sm font-extrabold ${roseText}`}
                    >
                      {monogram}
                    </span>
                  </div>
                  <div className="relative text-center">
                    <p className="text-sm font-bold tracking-wide text-[#e8b4a0]">
                      {couple}
                    </p>
                    <p className="mt-1 text-[10px] text-[#d0c5af]">
                      {data.invitationText ||
                        "حضور شما زیباترین هدیه برای ماست"}
                    </p>
                  </div>
                  <RoseLine className="relative w-full" />
                </div>
              </div>
            </section>

            <footer className="flex flex-col items-center px-4 pb-8 text-center">
              <div className="mb-2 flex items-center gap-2 text-[#e8b4a0] opacity-60">
                <RoseLine className="w-12" />
                <Heart className="h-3.5 w-3.5" />
                <RoseLine className="w-12" />
              </div>
              <span
                className={`font-display text-base font-bold tracking-widest ${roseText}`}
              >
                {monogram}
              </span>
              <p className="mt-1 text-xs text-[#d0c5af]">
                با آرزوی شادی و مهر همیشگی در دل‌هایتان
              </p>
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#e8b4a0]/20 bg-[#0d131f]/90 px-2 shadow-2xl backdrop-blur-xl">
          {[
            { href: "#", label: "دعوتنامه", Icon: Heart, active: true },
            { href: "#ceremony-details", label: "زمان‌بندی", Icon: Clock },
            { href: "#location", label: "مسیریابی", Icon: MapPin },
            { href: "#rsvp", label: "ثبت حضور", Icon: CheckCircle2 },
          ].map(({ href, label, Icon, active }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#") setOpen(true);
              }}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] transition-colors ${
                active
                  ? "font-bold text-[#e8b4a0]"
                  : "text-[#d0c5af] hover:text-[#e8b4a0]"
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
