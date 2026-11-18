"use client";

import { useState, type CSSProperties } from "react";
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
import { AzadiPhotoArch } from "./ornaments";

const DEFAULT_COVER = "/images/templates/love-loom-cover.jpg";

const IVORY = "#f3eee6";
const CRIMSON = "#8b1e2d";
const NAVY = "#1a2744";
const GOLD = "#c4a35a";
const CREAM = "#faf6f0";
const HENNA = "#a8522e";

const LOOM_TILES = [
  { color: "#8b1e2d", label: "لاکی", tip: "رنگ غالب فرش‌های کاشان و قم" },
  { color: "#1a2744", label: "لاجورد", tip: "عمق شب و نقش‌های تبریز" },
  { color: "#c4a35a", label: "زرِ کارگاه", tip: "نخِ طلایی حاشیه و ترنج" },
  { color: "#a8522e", label: "حنایی", tip: "گرمای اصفهان و یزد" },
  { color: "#2a6b63", label: "فیروزه", tip: "ساحل و کاشی کرمان" },
  { color: "#f0e7d8", label: "شیری", tip: "پشم خام و زمینهٔ روشن" },
] as const;

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "گشودن دارِ مهر",
    description: "استقبال با گلاب و نقل، نوای سنتور کنار نقش‌های لاکی",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "پیمان زیر طاق",
    description: "خطبه‌ی عقد میان کنگره‌های زرین و عطر بهارنارنج",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "ضیافتِ هفت‌رنگ",
    description: "شام ایرانی روی میزهای آراسته به کاشی و زعفران",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "رقص روی تار و پود",
    description: "نخستین رقص و شادی تا نیمه‌شب زیر فانوس‌های کارگاه",
    icon: "music",
  },
];

const STORY = [
  {
    tag: "گرهٔ اول",
    title: "نگاهی که تار شد",
    text: "مثل دار قالی، از یک نگاه شروع شد و کم‌کم نقش مشترکمان پیدا شد.",
  },
  {
    tag: "پودِ روزها",
    title: "هر رنگ، یک خاطره",
    text: "با هم خندیدیم، سفر کردیم و فهمیدیم خانه همان‌جایی‌ست که دستت در دست من است.",
  },
  {
    tag: "نقشِ کامل",
    title: "دو نفر، یک ایرانِ کوچک",
    text: "حالا می‌خواهیم این فرشِ عشق را با شما پهن کنیم؛ قدم‌تان روی نقش ماست.",
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
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

export function LoveLoomRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const reduceMotion = useReducedMotion();

  const [woven, setWoven] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [tileIdx, setTileIdx] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [rsvpDone, setRsvpDone] = useState(false);

  const theme: TemplateCustomization = {
    primaryColor: CRIMSON,
    secondaryColor: GOLD,
    backgroundColor: IVORY,
    poeticLine: "«دو تار روی یک دار؛ نقشی که تا ابد از هم جدا نمی‌شود»",
    blessingLine: "قدم‌تان روی این فرش، زیباترین گره‌ی نقش ماست.",
    dressCode:
      "پوشش رسمی ایرانی؛ لاکی، لاجورد، زرِ کارگاه، حنایی، فیروزه و شیری پشم.",
    musicTitle: "دارِ عشق · سنتور و کمانچه",
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

  const weaveOpen = () => {
    if (!woven) setWoven(true);
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans"
      style={
        {
          backgroundColor: IVORY,
          color: NAVY,
          "--ll-crimson": CRIMSON,
          "--ll-gold": GOLD,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes ll-foil {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .ll-title {
          background-image: linear-gradient(100deg, ${CRIMSON} 0%, ${GOLD} 38%, ${NAVY} 68%, ${CRIMSON} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ll-foil 10s linear infinite;
        }
        .ll-wash {
          background-image:
            radial-gradient(circle at 18% 8%, rgba(196,163,90,0.14) 0%, transparent 42%),
            radial-gradient(circle at 88% 22%, rgba(139,30,45,0.09) 0%, transparent 40%),
            radial-gradient(circle at 50% 100%, rgba(26,39,68,0.06) 0%, transparent 48%);
        }
      `}</style>

      <div className="ll-wash relative mx-auto w-full max-w-md overflow-x-clip">
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-xl"
          style={{ borderColor: `${GOLD}55`, backgroundColor: `${IVORY}f0` }}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full border font-display text-[11px]"
              style={{ borderColor: GOLD, backgroundColor: CREAM, color: CRIMSON }}
            >
              {monogram}
            </span>
            <span
              className="text-[10px] font-semibold tracking-[0.28em]"
              style={{ color: CRIMSON }}
            >
              دارِ عشق
            </span>
            {showMusic ? (
              <button
                type="button"
                onClick={() => setPlayingMusic((p) => !p)}
                aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{ borderColor: GOLD, backgroundColor: CREAM, color: CRIMSON }}
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
          </div>
        </header>

        <main className="relative z-10 px-4 pb-28">
          <section className="flex flex-col items-center pt-7 pb-8 text-center">
            <motion.span
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10.5px]"
              style={{ borderColor: `${GOLD}66`, backgroundColor: CREAM, color: CRIMSON }}
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: GOLD }} />
              به نامِ ایران و پیوندِ جاودان
            </motion.span>

            {/* قهرمان: عکس عروس و داماد با طاق آزادی و قاب فرش */}
            <motion.div
              className="mt-5 w-full"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <AzadiPhotoArch
                src={cover}
                alt={couple}
                monogram={monogram}
                opened={woven}
                onToggle={() => setWoven((v) => !v)}
              />
            </motion.div>

            <h1 className="mt-6 flex flex-col items-center font-display text-[42px] leading-[1.16]">
              <span className="ll-title px-2">{data.partnerOneName}</span>
              <span className="my-1 flex items-center gap-3">
                <span className="h-px w-10" style={{ backgroundColor: GOLD }} />
                <Heart className="h-4 w-4 fill-current" style={{ color: CRIMSON }} />
                <span className="h-px w-10" style={{ backgroundColor: GOLD }} />
              </span>
              <span className="ll-title px-2">{data.partnerTwoName}</span>
            </h1>

            <p className="mt-3 text-[12.5px] font-medium">
              {parts.day && parts.month
                ? `${parts.weekday} · ${parts.day} ${parts.month} ${parts.year}`
                : "تاریخ به‌زودی اعلام می‌شود"}
            </p>
            <p className="mt-1 text-[11.5px]" style={{ color: `${NAVY}99` }}>
              {data.venueName || "عمارت یاس سفید"}
              {timeRange ? ` · ${timeRange}` : ""}
            </p>

            <AnimatePresence mode="wait">
              {woven ? (
                <motion.div
                  key="scroll"
                  className="mt-5 flex flex-col items-center"
                  style={{ color: CRIMSON }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.55 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-[8.5px] uppercase tracking-[0.3em]">
                    ورق بزنید
                  </span>
                  <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
                </motion.div>
              ) : (
                <motion.button
                  key="cta"
                  type="button"
                  onClick={weaveOpen}
                  className="mt-5 rounded-full border px-5 py-2.5 text-[12px] font-medium shadow-sm"
                  style={{
                    borderColor: `${GOLD}88`,
                    backgroundColor: CREAM,
                    color: CRIMSON,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                >
گشودن نامه با مهرِ زرین
                </motion.button>
              )}
            </AnimatePresence>
          </section>

          <div
            inert={!woven}
            aria-hidden={!woven}
            className={`transition-all duration-1000 ease-out ${
              woven
                ? "translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            <motion.div
              className="flex flex-col gap-12"
              variants={stagger}
              initial="hidden"
              animate={woven ? "show" : "hidden"}
            >
              <motion.section
                id="invitation"
                className="scroll-mt-20"
                variants={fadeUp}
              >
                <SectionHeader
                  en="Loom Letter"
                  title="نامه روی تار و پود"
                  description="افتخار داریم شب پیمانمان را کنار شما جشن بگیریم"
                />
                <p
                  className="mx-auto mt-3 max-w-[290px] text-center font-display text-[18px] leading-8"
                  style={{ color: CRIMSON }}
                >
                  {theme.poeticLine}
                </p>
                <div
                  className="relative mt-4 overflow-hidden rounded-[26px] border p-5"
                  style={{
                    borderColor: `${GOLD}66`,
                    backgroundColor: CREAM,
                    boxShadow: "0 22px 50px -28px rgba(26,39,68,0.22)",
                  }}
                >
                  <span
                    className="pointer-events-none absolute inset-2.5 rounded-[18px] border border-dashed"
                    style={{ borderColor: `${GOLD}45` }}
                  />
                  <p
                    className="relative z-10 text-center text-[13px] leading-8"
                    style={{ color: `${NAVY}cc` }}
                  >
                    {data.invitationText ||
                      "با مهر و افتخار شما را به جشن پیوندمان دعوت می‌کنیم؛ شبی که بی نقشِ حضور شما کامل نیست."}
                  </p>
                  {families ? (
                    <p
                      className="relative z-10 mt-3 text-center text-[11.5px] font-medium"
                      style={{ color: GOLD }}
                    >
                      به میزبانی خانواده‌های {families}
                    </p>
                  ) : null}

                  <div className="relative z-10 mt-5 space-y-2">
                    {STORY.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border px-3.5 py-3"
                        style={{
                          borderColor: `${CRIMSON}22`,
                          backgroundColor: IVORY,
                        }}
                      >
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: CRIMSON }}
                        >
                          {item.tag}
                        </span>
                        <p className="mt-0.5 font-display text-[17px]">
                          {item.title}
                        </p>
                        <p
                          className="mt-1 text-[12px] leading-6"
                          style={{ color: `${NAVY}99` }}
                        >
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {showMusic ? (
                    <button
                      type="button"
                      onClick={() => setPlayingMusic((p) => !p)}
                      className="relative z-10 mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-[12px]"
                      style={{ borderColor: `${GOLD}66`, color: CRIMSON }}
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

              {showCountdown ? (
                <motion.section variants={fadeUp}>
                  <SectionHeader en="Save The Date" title="تقویمِ روزِ پیوند" />
                  <div
                    className="mt-4 rounded-[24px] border p-4"
                    style={{ borderColor: `${GOLD}55`, backgroundColor: CREAM }}
                  >
                    <p
                      className="mb-2.5 text-center text-[10.5px]"
                      style={{ color: `${NAVY}88` }}
                    >
                      شمارش گره‌ها تا روز موعود
                    </p>
                    <Countdown
                      eventStartAt={data.eventStartAt!}
                      className="[&>div]:rounded-2xl [&>div]:border [&>div]:border-[#c4a35a]/40 [&>div]:bg-[#8b1e2d]/[0.04] [&>div]:py-3 [&_p:first-child]:font-display [&_p:first-child]:text-[24px] [&_p:first-child]:text-[#1a2744] [&_p:last-child]:text-[10px]"
                    />
                  </div>
                </motion.section>
              ) : null}

              <motion.section
                id="schedule"
                className="scroll-mt-20"
                variants={fadeUp}
              >
                <SectionHeader
                  en="Night Weave"
                  title="نقشه‌ی شبِ رؤیایی"
                  description="از گشودن دار تا رقص روی تار و پود"
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
                          borderColor: `${CRIMSON}24`,
                          backgroundColor: CREAM,
                        }}
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: `${CRIMSON}12`,
                            color: CRIMSON,
                          }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-[10.5px] font-medium"
                            style={{ color: GOLD }}
                          >
                            {item.time}
                          </p>
                          <p className="mt-0.5 text-[13.5px] font-medium">
                            {item.title}
                          </p>
                          {item.description ? (
                            <p
                              className="mt-1 text-[11.5px] leading-6"
                              style={{ color: `${NAVY}99` }}
                            >
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.section>

              {showMap ? (
                <motion.section
                  id="location"
                  className="scroll-mt-20"
                  variants={fadeUp}
                >
                  <SectionHeader
                    en="Destination"
                    title="نشانیِ سرای جشن"
                    description="مشتاق دیدار روی ماهتان روی فرشِ شادی هستیم"
                  />
                  <div
                    className="mt-4 rounded-[24px] border p-5"
                    style={{ borderColor: `${GOLD}55`, backgroundColor: CREAM }}
                  >
                    <h3 className="font-display text-[22px]">
                      {data.venueName || "عمارت یاس سفید"}
                    </h3>
                    <p
                      className="mt-1 text-[12.5px]"
                      style={{ color: `${NAVY}99` }}
                    >
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
                          style={{ borderColor: `${GOLD}66`, color: CRIMSON }}
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
                        style={{ color: NAVY }}
                      >
                        <CalendarDays className="h-3.5 w-3.5" />
                        ثبت یادآور در تقویم گوگل
                        <ArrowUpLeft className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                </motion.section>
              ) : null}

              <motion.section variants={fadeUp}>
                <SectionHeader en="Haft-Rang" title="پالتِ کارگاه و پوشش" />
                <p
                  className="mt-3 text-center text-[12.5px] leading-7"
                  style={{ color: `${NAVY}aa` }}
                >
                  {theme.dressCode}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {LOOM_TILES.map((tile, idx) => {
                    const active = tileIdx === idx;
                    return (
                      <button
                        key={tile.label}
                        type="button"
                        onClick={() => setTileIdx(idx)}
                        className="rounded-2xl border p-2.5 text-center transition"
                        style={{
                          borderColor: active ? GOLD : `${GOLD}40`,
                          backgroundColor: active ? `${GOLD}18` : CREAM,
                        }}
                      >
                        <span
                          className="mx-auto block h-9 w-9 rounded-md border shadow-sm"
                          style={{
                            backgroundColor: tile.color,
                            borderColor: `${NAVY}18`,
                          }}
                        />
                        <span className="mt-1.5 block text-[11px] font-medium">
                          {tile.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p
                  className="mt-3 text-center text-[11.5px] leading-6"
                  style={{ color: CRIMSON }}
                >
                  {LOOM_TILES[tileIdx].label}: {LOOM_TILES[tileIdx].tip}
                </p>
              </motion.section>

              {features?.rsvp !== false ? (
                <motion.section
                  id="rsvp"
                  className="scroll-mt-20"
                  variants={fadeUp}
                >
                  <SectionHeader
                    en="RSVP"
                    title="گره زدنِ حضور"
                    description="پاسختان را با مهرِ لاکی برای ما بفرستید"
                  />
                  <div
                    className="mt-4 rounded-[26px] border p-5"
                    style={{ borderColor: `${CRIMSON}33`, backgroundColor: CREAM }}
                  >
                    {rsvpDone ? (
                      <motion.div
                        className="flex flex-col items-center py-3 text-center"
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <Check className="h-8 w-8" style={{ color: CRIMSON }} />
                        <p className="mt-3 font-display text-[20px]">
                          حضورتان گره خورد
                        </p>
                        <p
                          className="mt-1 text-[12px]"
                          style={{ color: `${NAVY}99` }}
                        >
                          {attending
                            ? `${guests.toLocaleString("fa-IR")} نفر · بی‌صبرانه منتظرتانیم`
                            : "دل‌تان با ماست و نقشش روی فرش ماند"}
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
                              className="flex-1 rounded-2xl border py-2.5 text-[11.5px]"
                              style={{
                                borderColor:
                                  attending === opt.v ? GOLD : `${GOLD}40`,
                                backgroundColor:
                                  attending === opt.v ? `${CRIMSON}12` : IVORY,
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        {attending ? (
                          <div
                            className="mt-4 flex items-center justify-between rounded-2xl border px-3 py-2.5"
                            style={{ borderColor: `${GOLD}44` }}
                          >
                            <span className="inline-flex items-center gap-1.5 text-[12px]">
                              <Users className="h-3.5 w-3.5" />
                              تعداد همراهان
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                aria-label="کاهش همراهان"
                                onClick={() =>
                                  setGuests((v) => Math.max(1, v - 1))
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full"
                                style={{ backgroundColor: `${CRIMSON}14` }}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center font-medium">
                                {guests.toLocaleString("fa-IR")}
                              </span>
                              <button
                                type="button"
                                aria-label="افزایش همراهان"
                                onClick={() =>
                                  setGuests((v) => Math.min(8, v + 1))
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                                style={{ backgroundColor: CRIMSON }}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => setRsvpDone(true)}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[12.5px] font-semibold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${CRIMSON}, ${HENNA})`,
                          }}
                        >
                          <Feather className="h-4 w-4" />
                          {preview ? "گره زدن حضور روی دار" : "ثبت اعلام حضور"}
                        </button>
                      </>
                    )}
                  </div>
                </motion.section>
              ) : null}

              <motion.section variants={fadeUp} className="pb-6 text-center">
                <span
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border"
                  style={{ borderColor: GOLD, color: CRIMSON }}
                >
                  ♥
                </span>
                <p className="mx-auto mt-3 max-w-[290px] font-display text-[20px] leading-9">
                  {theme.blessingLine}
                </p>
                <p
                  className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.34em]"
                  style={{ color: `${NAVY}77` }}
                >
                  {couple} · love loom
                </p>
              </motion.section>
            </motion.div>
          </div>
        </main>

        <AnimatePresence>
          {woven ? (
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
                  backgroundColor: `${CREAM}f2`,
                  borderColor: `${GOLD}66`,
                }}
              >
                {(
                  [
                    { href: "#invitation", label: "نامه", Icon: Feather },
                    { href: "#schedule", label: "نقشه", Icon: Clock },
                    { href: "#location", label: "سرا", Icon: MapPin },
                    { href: "#rsvp", label: "حضور", Icon: Heart },
                  ] as const
                ).map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] opacity-85 transition hover:opacity-100"
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: CRIMSON }} />
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

function SectionHeader({
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
        <span className="h-px w-8" style={{ backgroundColor: `${GOLD}99` }} />
        <span
          className="text-[9px] uppercase tracking-[0.34em]"
          style={{ color: GOLD }}
        >
          {en}
        </span>
        <span className="h-px w-8" style={{ backgroundColor: `${GOLD}99` }} />
      </div>
      <h2 className="mt-2 font-display text-[26px] leading-tight">{title}</h2>
      {description ? (
        <p
          className="mt-1 max-w-[290px] text-[12px] leading-6"
          style={{ color: `${NAVY}99` }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
