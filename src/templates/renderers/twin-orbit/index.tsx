"use client";

import { useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowUpLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Coffee,
  Feather,
  Heart,
  MapPin,
  Minus,
  Music2,
  Pause,
  Play,
  Plus,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import { Countdown } from "@/templates/shared/countdown";
import {
  coupleLabel,
  coupleMonogram,
  formatEventTimeRange,
  googleCalendarUrl,
} from "@/templates/shared/format";
import type {
  TemplateCustomization,
  TemplateRendererProps,
  TemplateScheduleItem,
} from "@/templates/types";

const TwinOrbitScene = dynamic(
  () => import("./scene").then((m) => m.TwinOrbitScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0a0610]">
        <span className="h-10 w-10 animate-pulse rounded-full bg-[#e8a0b0]/35" />
      </div>
    ),
  },
);

const DEFAULT_COVER = "/images/templates/twin-orbit-cover.jpg";

const ROSE = "#e8a0b0";
const GOLD = "#d4b07a";
const NIGHT = "#0a0610";
const FOAM = "#f5e6d3";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "ورود به مدارِ عشق",
    description: "استقبال با نور شمع، موسیقی زنده و نوشیدنی‌های لطیف",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "پیمان زیر ستاره‌ها",
    description: "لحظه‌ی عهد و تلاقی دو حلقه در میان کهکشانِ نگاه‌ها",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافتِ نور",
    description: "شام رمانتیک با میزهای آراسته به طلایی و رز پودری",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "مدارِ رقص",
    description: "نخستین رقص ما و چرخش تا نیمه‌شب زیر بارش ستاره",
    icon: "music",
  },
];

const STORY = [
  {
    title: "جاذبهٔ اول",
    text: "میان همه‌ی کهکشان‌ها، یک نگاه کافی بود تا مدارمان یکی شود.",
  },
  {
    title: "هم‌مدار",
    text: "با هم خندیدیم، با هم رؤیا بافتیم و فهمیدیم خانه همان جایی‌ست که دستت در دست من است.",
  },
  {
    title: "عهدِ ستاره‌ای",
    text: "حالا می‌خواهیم این نور را با شما قسمت کنیم؛ بیایید در مدارِ شادی‌مان بچرخید.",
  },
] as const;

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

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", day: "", month: "", year: "" };
  try {
    const date = new Date(iso);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...options }).format(date);
    return {
      weekday: format({ weekday: "long" }),
      day: format({ day: "numeric" }),
      month: format({ month: "long" }),
      year: format({ year: "numeric" }),
    };
  } catch {
    return { weekday: "", day: "", month: "", year: "" };
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

export function TwinOrbitRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const reduceMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [rsvpDone, setRsvpDone] = useState(false);

  const theme: TemplateCustomization = {
    primaryColor: ROSE,
    secondaryColor: GOLD,
    backgroundColor: NIGHT,
    poeticLine: "«دو قلب در یک مدار؛ تا ابد، بی‌انتها»",
    blessingLine: "حضور شما، درخشان‌ترین ستاره‌ی این شب است.",
    dressCode:
      "شیک و رمانتیک؛ رز پودری، شامپاینی طلایی، سرمه‌ای شب و مشکی مخملی.",
    musicTitle: "مدارِ دو قلب · پیانو و زهی",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const parts = datePartsOf(data.eventStartAt, data.timezone);
  const timeRange = formatEventTimeRange(
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
  const showMusic = features?.music !== false;
  const query = encodeURIComponent(
    data.mapUrl ||
      [data.venueName, data.venueAddress].filter(Boolean).join(" ") ||
      "",
  );
  const families = [
    data.familyNames?.partnerOneFamily,
    data.familyNames?.partnerTwoFamily,
  ]
    .filter(Boolean)
    .join(" و ");

  const openOrbit = () => {
    if (!opened) setOpened(true);
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans"
      style={
        {
          backgroundColor: NIGHT,
          color: FOAM,
          "--to-rose": ROSE,
          "--to-gold": GOLD,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes to-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .to-title {
          background-image: linear-gradient(100deg, ${ROSE} 0%, ${GOLD} 40%, ${FOAM} 70%, ${ROSE} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: to-shimmer 9s linear infinite;
        }
      `}</style>

      <div className="relative mx-auto w-full max-w-md overflow-x-clip">
        {/* 3D celestial stage */}
        <section className="relative h-[72vh] min-h-[420px] w-full">
          <TwinOrbitScene opened={opened} onOpen={openOrbit} />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0610]/30 via-transparent to-[#0a0610]" />

          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-display"
              style={{
                borderColor: `${GOLD}88`,
                backgroundColor: "rgba(10,6,16,0.55)",
                color: GOLD,
                backdropFilter: "blur(10px)",
              }}
            >
              {monogram}
            </span>
            {showMusic ? (
              <button
                type="button"
                onClick={() => setPlayingMusic((p) => !p)}
                aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border"
                style={{
                  borderColor: `${GOLD}88`,
                  backgroundColor: "rgba(10,6,16,0.55)",
                  color: ROSE,
                  backdropFilter: "blur(10px)",
                }}
              >
                {playingMusic ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-[0.5px]" />
                )}
              </button>
            ) : (
              <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
            )}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-6 z-10 px-5 text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 100 }}
          >
            <p
              className="mx-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px]"
              style={{
                borderColor: `${GOLD}55`,
                backgroundColor: "rgba(10,6,16,0.5)",
                color: ROSE,
                backdropFilter: "blur(12px)",
              }}
            >
              <Heart className="h-3 w-3 fill-current" />
              به نامِ عشق و مدارِ جاودان
            </p>

            <h1 className="mt-3 font-display text-[42px] leading-[1.15]">
              <span className="to-title block">{data.partnerOneName}</span>
              <span className="my-1 inline-flex items-center gap-2 text-[16px]" style={{ color: GOLD }}>
                <span className="h-px w-8 bg-current opacity-60" />
                ♥
                <span className="h-px w-8 bg-current opacity-60" />
              </span>
              <span className="to-title block">{data.partnerTwoName}</span>
            </h1>

            <p className="mt-2 text-[12px] opacity-85">
              {parts.day && parts.month
                ? `${parts.weekday} · ${parts.day} ${parts.month} ${parts.year}`
                : "تاریخ به‌زودی اعلام می‌شود"}
            </p>
            <p className="mt-0.5 text-[11px] opacity-65">
              {data.venueName || "عمارت یاس سفید"}
              {timeRange ? ` · ${timeRange}` : ""}
            </p>

            <AnimatePresence>
              {!opened ? (
                <motion.button
                  type="button"
                  key="cta"
                  onClick={openOrbit}
                  className="pointer-events-auto mx-auto mt-4 flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12px] font-medium shadow-lg"
                  style={{
                    borderColor: `${GOLD}77`,
                    background:
                      "linear-gradient(135deg, rgba(232,160,176,0.25), rgba(212,176,122,0.2))",
                    color: FOAM,
                    backdropFilter: "blur(14px)",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                  whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
                  <Sparkles className="h-3.5 w-3.5" style={{ color: GOLD }} />
                  گویِ بلورین را لمس کن تا مدار باز شود
                </motion.button>
              ) : (
                <motion.div
                  key="hint"
                  className="mt-4 flex flex-col items-center opacity-70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                >
                  <span className="text-[8.5px] uppercase tracking-[0.32em]">
                    ورق بزنید
                  </span>
                  <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Revealed content */}
        <div
          inert={!opened}
          aria-hidden={!opened}
          className={`relative z-10 transition-all duration-1000 ease-out ${
            opened
              ? "translate-y-0 opacity-100"
              : "invisible pointer-events-none max-h-0 translate-y-12 overflow-hidden opacity-0"
          }`}
        >
          <motion.div
            className="flex flex-col gap-12 px-4 pb-28 pt-4"
            variants={stagger}
            initial="hidden"
            animate={opened ? "show" : "hidden"}
          >
            {/* Couple photo card */}
            <motion.section variants={fadeUp} className="relative">
              <div
                className="overflow-hidden rounded-[28px] border p-2 shadow-[0_30px_80px_-30px_rgba(232,160,176,0.45)]"
                style={{ borderColor: `${GOLD}44`, backgroundColor: "#140e18" }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={couple}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0610] via-transparent to-transparent" />
                  <p className="absolute inset-x-4 bottom-4 text-center font-display text-[22px]">
                    {theme.poeticLine}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Invitation letter */}
            <motion.section id="invitation" className="scroll-mt-16" variants={fadeUp}>
              <SectionLabel en="Stellar Letter" title="نامه‌ای از مدارِ ما" />
              <div
                className="mt-4 rounded-[26px] border p-5"
                style={{
                  borderColor: `${GOLD}40`,
                  background:
                    "linear-gradient(165deg, rgba(245,230,211,0.08), rgba(232,160,176,0.06))",
                }}
              >
                <p className="text-center text-[13px] leading-8 opacity-90">
                  {data.invitationText ||
                    "با قلبی سرشار از مهر، شما را به چرخش در مدارِ پیوندمان دعوت می‌کنیم؛ شبی که بی نورِ حضورتان کامل نیست."}
                </p>
                {families ? (
                  <p
                    className="mt-3 text-center text-[11.5px]"
                    style={{ color: GOLD }}
                  >
                    به میزبانی خانواده‌های {families}
                  </p>
                ) : null}

                <div className="mt-5 space-y-2.5">
                  {STORY.map((item) => (
                    <motion.div
                      key={item.title}
                      variants={fadeUp}
                      className="rounded-2xl border px-3.5 py-3"
                      style={{
                        borderColor: `${ROSE}33`,
                        backgroundColor: "rgba(10,6,16,0.45)",
                      }}
                    >
                      <p className="font-display text-[17px]" style={{ color: ROSE }}>
                        {item.title}
                      </p>
                      <p className="mt-1 text-[12px] leading-6 opacity-75">
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {showMusic ? (
                  <button
                    type="button"
                    onClick={() => setPlayingMusic((p) => !p)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-[12px]"
                    style={{ borderColor: `${GOLD}55`, color: GOLD }}
                  >
                    {playingMusic ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    {theme.musicTitle}
                  </button>
                ) : null}
              </div>
            </motion.section>

            {/* Countdown */}
            {showCountdown ? (
              <motion.section variants={fadeUp}>
                <SectionLabel en="Orbit Countdown" title="شمارش تا دیدار" />
                <div
                  className="mt-4 rounded-[24px] border p-4"
                  style={{ borderColor: `${GOLD}40`, backgroundColor: "#120c16" }}
                >
                  <Countdown
                    eventStartAt={data.eventStartAt!}
                    className="[&>div]:rounded-2xl [&>div]:border [&>div]:border-[#d4b07a]/35 [&>div]:bg-white/[0.04] [&>div]:py-3 [&_p:first-child]:font-display [&_p:first-child]:text-[24px] [&_p:last-child]:text-[10px] [&_p]:text-[#f5e6d3]"
                  />
                </div>
              </motion.section>
            ) : null}

            {/* Schedule */}
            <motion.section id="schedule" className="scroll-mt-16" variants={fadeUp}>
              <SectionLabel
                en="Night Orbit"
                title="مدارِ شبِ رؤیایی"
                description="از ورود تا رقص زیر ستاره‌ها"
              />
              <ul className="mt-4 space-y-2.5">
                {schedule.map((item, idx) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <motion.li
                      key={`${item.time}-${idx}`}
                      variants={fadeUp}
                      className="flex gap-3 rounded-2xl border p-3.5"
                      style={{
                        borderColor: `${ROSE}30`,
                        backgroundColor: "rgba(20,14,24,0.85)",
                      }}
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${ROSE}22`, color: ROSE }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10.5px]" style={{ color: GOLD }}>
                          {item.time}
                        </p>
                        <p className="mt-0.5 font-medium text-[13.5px]">
                          {item.title}
                        </p>
                        {item.description ? (
                          <p className="mt-1 text-[11.5px] leading-6 opacity-70">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.section>

            {/* Location */}
            {showMap ? (
              <motion.section id="location" className="scroll-mt-16" variants={fadeUp}>
                <SectionLabel en="Destination" title="نشانیِ مدارِ جشن" />
                <div
                  className="mt-4 rounded-[24px] border p-5"
                  style={{ borderColor: `${GOLD}40`, backgroundColor: "#120c16" }}
                >
                  <h3 className="font-display text-[22px]">
                    {data.venueName || "عمارت یاس سفید"}
                  </h3>
                  <p className="mt-1 text-[12.5px] opacity-70">
                    {data.venueAddress || "تهران، نیاوران، خیابان یاسمن"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      {
                        href: `https://neshan.org/maps/search?q=${query}`,
                        label: "نشان",
                      },
                      {
                        href: `https://balad.ir/search?q=${query}`,
                        label: "بلد",
                      },
                      {
                        href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                        label: "گوگل‌مپ",
                      },
                    ].map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px]"
                        style={{ borderColor: `${GOLD}55`, color: GOLD }}
                      >
                        <MapPin className="h-3 w-3" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                  {calendarHref ? (
                    <a
                      href={calendarHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-[11.5px]"
                      style={{ color: ROSE }}
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      ثبت یادآور در تقویم گوگل
                      <ArrowUpLeft className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
              </motion.section>
            ) : null}

            {/* Dress code */}
            <motion.section variants={fadeUp}>
              <SectionLabel en="Dress Code" title="پالت و پوشش" />
              <p className="mt-3 text-center text-[12.5px] leading-7 opacity-80">
                {theme.dressCode}
              </p>
              <div className="mt-4 flex justify-center gap-2.5">
                {["#e8a0b0", "#d4b07a", "#f5e6d3", "#1a2744", "#0a0610"].map(
                  (c) => (
                    <span
                      key={c}
                      className="h-9 w-9 rounded-full border shadow-md"
                      style={{
                        backgroundColor: c,
                        borderColor: `${GOLD}66`,
                      }}
                    />
                  ),
                )}
              </div>
            </motion.section>

            {/* RSVP */}
            {features?.rsvp !== false ? (
              <motion.section id="rsvp" className="scroll-mt-16" variants={fadeUp}>
                <SectionLabel
                  en="RSVP"
                  title="اعلام حضور در مدار"
                  description="پاسختان را با مهر برای ما بفرستید"
                />
                <div
                  className="mt-4 rounded-[26px] border p-5"
                  style={{ borderColor: `${ROSE}40`, backgroundColor: "#120c16" }}
                >
                  {rsvpDone ? (
                    <motion.div
                      className="flex flex-col items-center py-4 text-center"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <Check className="h-8 w-8" style={{ color: GOLD }} />
                      <p className="mt-3 font-display text-[20px]">
                        حضورتان در مدار ثبت شد
                      </p>
                      <p className="mt-1 text-[12px] opacity-70">
                        {attending
                          ? `${guests.toLocaleString("fa-IR")} نفر · بی‌صبرانه منتظرتانیم`
                          : "دل‌تان با ماست و نورش به مدار ما می‌رسد"}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        {(
                          [
                            { v: true, label: "با افتخار می‌آیم" },
                            { v: false, label: "دلم همراهِ شماست" },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setAttending(opt.v)}
                            className="flex-1 rounded-2xl border py-2.5 text-[11.5px] transition"
                            style={{
                              borderColor:
                                attending === opt.v ? GOLD : `${ROSE}33`,
                              backgroundColor:
                                attending === opt.v
                                  ? `${ROSE}28`
                                  : "transparent",
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {attending ? (
                        <div className="mt-4 flex items-center justify-between rounded-2xl border px-3 py-2.5"
                          style={{ borderColor: `${GOLD}33` }}
                        >
                          <span className="inline-flex items-center gap-1.5 text-[12px] opacity-80">
                            <Users className="h-3.5 w-3.5" />
                            تعداد همراهان
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="کاهش همراهان"
                              onClick={() => setGuests((v) => Math.max(1, v - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${ROSE}25` }}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center font-medium">
                              {guests.toLocaleString("fa-IR")}
                            </span>
                            <button
                              type="button"
                              aria-label="افزایش همراهان"
                              onClick={() => setGuests((v) => Math.min(8, v + 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full"
                              style={{ backgroundColor: ROSE, color: NIGHT }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setRsvpDone(true)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[12.5px] font-semibold text-[#0a0610]"
                        style={{
                          background: `linear-gradient(135deg, ${ROSE}, ${GOLD})`,
                        }}
                      >
                        <Feather className="h-4 w-4" />
                        {preview
                          ? "ثبت حضور در مدارِ عشق"
                          : "ارسال اعلام حضور"}
                      </button>
                    </>
                  )}
                </div>
              </motion.section>
            ) : null}

            <motion.section variants={fadeUp} className="pb-4 text-center">
              <Heart
                className="mx-auto h-5 w-5 fill-current"
                style={{ color: ROSE }}
              />
              <p className="mx-auto mt-3 max-w-[280px] font-display text-[20px] leading-9">
                {theme.blessingLine}
              </p>
              <p
                className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.34em] opacity-55"
              >
                {couple} · twin orbit
              </p>
            </motion.section>
          </motion.div>
        </div>

        {/* Floating nav */}
        <AnimatePresence>
          {opened ? (
            <motion.nav
              className="fixed bottom-4 left-0 right-0 z-40 mx-auto w-[calc(100%-2rem)] max-w-[390px]"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
            >
              <div
                className="flex h-14 items-center justify-around rounded-full border px-2 shadow-xl backdrop-blur-2xl"
                style={{
                  backgroundColor: "rgba(18,12,22,0.82)",
                  borderColor: `${GOLD}44`,
                }}
              >
                {(
                  [
                    { href: "#invitation", label: "نامه", Icon: Feather },
                    { href: "#schedule", label: "مدار", Icon: Clock },
                    { href: "#location", label: "جشن", Icon: MapPin },
                    { href: "#rsvp", label: "حضور", Icon: Heart },
                  ] as const
                ).map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] opacity-85 transition hover:opacity-100"
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: ROSE }} />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SectionLabel({
  en,
  title,
  description,
}: {
  en: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2">
        <span className="h-px w-8" style={{ backgroundColor: `${GOLD}88` }} />
        <span
          className="text-[9px] uppercase tracking-[0.34em]"
          style={{ color: GOLD }}
        >
          {en}
        </span>
        <span className="h-px w-8" style={{ backgroundColor: `${GOLD}88` }} />
      </div>
      <h2 className="mt-2 font-display text-[26px] leading-tight">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-[280px] text-[12px] leading-6 opacity-65">
          {description}
        </p>
      ) : null}
    </div>
  );
}
