"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
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

const IRAN_MAP = "/images/templates/carpet-iran-map.jpg";
/** عکس زوج در طاق؛ کاور گالری همان فرش‌نقشه است */
const DEFAULT_COVER = "/images/templates/desert-rose-cover.jpg";

const IVORY = "#f3eee6";
const CRIMSON = "#8b1e2d";
const NAVY = "#1a2744";
const GOLD = "#c4a35a";
const CREAM = "#faf6f0";
const TERRACOTTA = "#b85c38";

const TILES = [
  { color: "#8b1e2d", label: "لاکیِ فرش", en: "Carpet Lacquer" },
  { color: "#1a2744", label: "لاجوردِ کاشان", en: "Kashan Lapis" },
  { color: "#c4a35a", label: "زرِ کارگاه", en: "Loom Gold" },
  { color: "#b85c38", label: "حناییِ اصفهان", en: "Isfahan Henna" },
  { color: "#2f5a3a", label: "زیتونیِ تبریز", en: "Tabriz Olive" },
  { color: "#f3eee6", label: "شیریِ پشم", en: "Wool Ivory" },
] as const;

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "ورود به سرای فرش",
    description: "استقبال با گلاب و نقل، نوای سنتور در میان نقش‌های لاکی",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "پیمان زیر طاقِ آزادی",
    description: "جاری شدن خطبه‌ی عقد در فضایی آراسته به فرش دستباف",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "ضیافتِ هفت‌رنگ",
    description: "شام ایرانی با میزهایی به رنگ کاشی و عطر زعفران",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "رقص روی نقشه‌ی عشق",
    description: "نخستین رقص و شادی تا پاسی از شب زیر نور فانوس‌های زرین",
    icon: "music",
  },
];

const STORY = [
  {
    tag: "آغاز",
    title: "نخستین گره",
    text: "مثل دار قالی، نگاه‌مان از یک نقطه شروع شد و کم‌کم نقشِ مشترکمان پیدا شد.",
  },
  {
    tag: "بافت",
    title: "هر استان، یک رنگ از ما",
    text: "با هم سفر کردیم، خندیدیم و فهمیدیم خانه همان‌جایی‌ست که دستت در دست من است.",
  },
  {
    tag: "نقشِ کامل",
    title: "ایرانِ دو نفره",
    text: "حالا می‌خواهیم این فرشِ عشق را با شما پهن کنیم؛ بیایید روی نقشه‌ی شادی‌مان قدم بگذارید.",
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

/** قابِ تزئینیِ فرش با حاشیهٔ چندلایه */
function CarpetFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: CREAM,
        boxShadow:
          "0 28px 60px -24px rgba(26,39,68,0.28), inset 0 0 0 1px rgba(196,163,90,0.35)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          border: `10px solid ${CRIMSON}`,
          outline: `3px solid ${GOLD}`,
          outlineOffset: "-16px",
          boxShadow: `inset 0 0 0 22px ${NAVY}14`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-5 top-3 z-10 flex h-2 justify-between"
        aria-hidden
      >
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="h-2 w-2 rotate-45"
            style={{
              backgroundColor: i % 2 === 0 ? GOLD : CRIMSON,
              opacity: 0.85,
            }}
          />
        ))}
      </div>
      <div className="relative z-0 p-5 pt-6">{children}</div>
    </div>
  );
}

/** طاقِ آزادی‌وار بالای عکس زوج */
function AzadiArch({
  cover,
  couple,
  opened,
}: {
  cover: string;
  couple: string;
  opened: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <svg
        viewBox="0 0 300 70"
        className="absolute -top-1 left-0 right-0 z-20 w-full"
        aria-hidden
      >
        <path
          d="M 20 68 V 38 Q 20 8, 150 8 Q 280 8, 280 38 V 68"
          fill="none"
          stroke={GOLD}
          strokeWidth="2.2"
        />
        <path
          d="M 32 68 V 40 Q 32 18, 150 18 Q 268 18, 268 40 V 68"
          fill="none"
          stroke={CRIMSON}
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <circle cx="150" cy="14" r="4" fill={GOLD} />
      </svg>
      <motion.div
        className="overflow-hidden"
        style={{
          borderRadius: "120px 120px 18px 18px",
          border: `1.5px solid ${GOLD}`,
          backgroundColor: CREAM,
        }}
        initial={false}
        animate={{
          filter: opened ? "saturate(1.05)" : "saturate(0.85) brightness(0.92)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={couple}
          className="aspect-[3/3.6] w-full object-cover"
        />
      </motion.div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export function CarpetIranRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const reduceMotion = useReducedMotion();
  const [unrolled, setUnrolled] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [tileIdx, setTileIdx] = useState(0);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [rsvpDone, setRsvpDone] = useState(false);

  const theme: TemplateCustomization = {
    primaryColor: CRIMSON,
    secondaryColor: GOLD,
    backgroundColor: IVORY,
    poeticLine:
      "«دو تار دل روی یک دار؛ نقشی که تا ابد از هم جدا نمی‌شود»",
    blessingLine: "قدم‌تان روی فرشِ شادی ما، زیباترین گره این نقش است.",
    dressCode:
      "پوشش رسمی ایرانی؛ لاکی، لاجورد، زرِ کارگاه، حنایی و شیریِ پشم. الهام از فرش و کاشی هفت‌رنگ.",
    musicTitle: "فرشِ ایران · سنتور و کمانچه",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const mapSrc = IRAN_MAP;
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

  const unroll = () => {
    if (!unrolled) setUnrolled(true);
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-clip font-sans"
      style={
        {
          backgroundColor: IVORY,
          color: NAVY,
          "--ci-crimson": CRIMSON,
          "--ci-gold": GOLD,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes ci-foil {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .ci-title {
          background-image: linear-gradient(100deg, ${CRIMSON} 0%, ${GOLD} 40%, ${NAVY} 70%, ${CRIMSON} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ci-foil 10s linear infinite;
        }
        .ci-grain {
          background-image:
            radial-gradient(circle at 20% 10%, rgba(196,163,90,0.12) 0%, transparent 40%),
            radial-gradient(circle at 85% 30%, rgba(139,30,45,0.08) 0%, transparent 42%),
            radial-gradient(circle at 50% 90%, rgba(26,39,68,0.06) 0%, transparent 45%);
        }
      `}</style>

      <div className="ci-grain relative mx-auto w-full max-w-md overflow-x-clip">
        {/* Sticky toolbar */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-xl"
          style={{
            borderColor: `${GOLD}55`,
            backgroundColor: `${IVORY}ee`,
          }}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full border font-display text-[11px]"
              style={{
                borderColor: GOLD,
                backgroundColor: CREAM,
                color: CRIMSON,
              }}
            >
              {monogram}
            </span>
            <span
              className="text-[10px] font-semibold tracking-[0.22em]"
              style={{ color: CRIMSON }}
            >
              فرشِ ایران
            </span>
            {showMusic ? (
              <button
                type="button"
                onClick={() => setPlayingMusic((p) => !p)}
                aria-label={playingMusic ? "توقف موسیقی" : "پخش موسیقی"}
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{
                  borderColor: GOLD,
                  backgroundColor: CREAM,
                  color: CRIMSON,
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
          </div>
        </header>

        <main className="relative z-10 px-4 pb-28">
          {/* Hero */}
          <section className="flex flex-col items-center pt-7 pb-8 text-center">
            <motion.span
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10.5px]"
              style={{
                borderColor: `${GOLD}66`,
                backgroundColor: CREAM,
                color: CRIMSON,
              }}
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: GOLD }} />
              به نامِ ایران و پیوندِ جاودان
            </motion.span>

            {/* Carpet map unroll */}
            <motion.div
              className="relative mt-5 w-full"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CarpetFrame className="rounded-[22px]">
                <button
                  type="button"
                  onClick={() => setUnrolled((v) => !v)}
                  aria-expanded={unrolled}
                  aria-label={
                    unrolled ? "جمع کردن فرش‌نقشه" : "پهن کردن فرش‌نقشه‌ی ایران"
                  }
                  className="relative block w-full overflow-hidden rounded-[14px] text-right"
                >
                  <motion.div
                    className="origin-top overflow-hidden"
                    initial={false}
                    animate={{
                      clipPath: unrolled
                        ? "inset(0% 0% 0% 0%)"
                        : "inset(0% 0% 62% 0%)",
                      filter: unrolled
                        ? "brightness(1) saturate(1.05)"
                        : "brightness(0.92) saturate(0.95)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 18,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mapSrc}
                      alt="فرش‌نقشه‌ی ایران"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: "3 / 4.1" }}
                    />
                  </motion.div>

                  {/* Fold shadow when rolled */}
                  <AnimatePresence>
                    {!unrolled ? (
                      <motion.div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[64%]"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(26,39,68,0.15) 35%, rgba(243,238,230,0.92) 78%)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    ) : null}
                  </AnimatePresence>

                  <div className="absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2">
                    <motion.span
                      className="flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg"
                      style={{
                        borderColor: GOLD,
                        background: `radial-gradient(circle at 30% 28%, #e8c878, ${CRIMSON} 70%)`,
                        color: CREAM,
                      }}
                      whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      animate={
                        unrolled
                          ? { scale: 0.82, opacity: 0.9 }
                          : { scale: 1, opacity: 1 }
                      }
                    >
                      <span className="flex flex-col items-center leading-none">
                        <span className="text-[9px] tracking-wider opacity-90">
                          IRAN
                        </span>
                        <span className="mt-0.5 font-display text-[13px] font-bold">
                          {monogram}
                        </span>
                      </span>
                    </motion.span>
                    <span
                      className="rounded-full border px-3 py-1 text-[10px] text-white backdrop-blur-md"
                      style={{
                        borderColor: "rgba(255,255,255,0.35)",
                        backgroundColor: "rgba(26,39,68,0.55)",
                      }}
                    >
                      {unrolled
                        ? "فرش پهن شد · لمس برای جمع کردن"
                        : "مهر را لمس کن تا فرش‌نقشه‌ی ایران پهن شود"}
                    </span>
                  </div>
                </button>
              </CarpetFrame>
            </motion.div>

            <h1 className="mt-6 flex flex-col items-center font-display text-[42px] leading-[1.18]">
              <span className="ci-title px-2">{data.partnerOneName}</span>
              <span className="my-1 flex items-center gap-3">
                <span className="h-px w-10" style={{ backgroundColor: GOLD }} />
                <Heart
                  className="h-4 w-4 fill-current"
                  style={{ color: CRIMSON }}
                />
                <span className="h-px w-10" style={{ backgroundColor: GOLD }} />
              </span>
              <span className="ci-title px-2">{data.partnerTwoName}</span>
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

            <AnimatePresence>
              {unrolled ? (
                <motion.div
                  className="mt-5 flex flex-col items-center opacity-55"
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
                  type="button"
                  onClick={unroll}
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
                  پهن کردن فرشِ دعوت
                </motion.button>
              )}
            </AnimatePresence>
          </section>

          {/* Revealed content */}
          <div
            inert={!unrolled}
            aria-hidden={!unrolled}
            className={`transition-all duration-1000 ease-out ${
              unrolled
                ? "translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            <motion.div
              className="flex flex-col gap-12"
              variants={stagger}
              initial="hidden"
              animate={unrolled ? "show" : "hidden"}
            >
              {/* Couple under Azadi arch */}
              <motion.section variants={fadeUp} className="pt-2">
                <AzadiArch cover={cover} couple={couple} opened={unrolled} />
                <p
                  className="mx-auto mt-4 max-w-[290px] text-center font-display text-[19px] leading-8"
                  style={{ color: CRIMSON }}
                >
                  {theme.poeticLine}
                </p>
              </motion.section>

              {/* Letter */}
              <motion.section
                id="invitation"
                className="scroll-mt-20"
                variants={fadeUp}
              >
                <SectionHeader
                  en="The Loom Letter"
                  title="نامه‌ای روی تار و پود"
                  description="خوشحالیم که زیباترین شب زندگی‌مان را در کنار شما جشن می‌گیریم"
                />
                <CarpetFrame className="mt-4 rounded-[26px]">
                  <p
                    className="text-center text-[13px] leading-8"
                    style={{ color: `${NAVY}cc` }}
                  >
                    {data.invitationText ||
                      "با مهر و افتخار، شما را به جشن پیوندمان روی فرشِ عشق دعوت می‌کنیم؛ شبی که بی نقشِ حضور شما کامل نیست."}
                  </p>
                  {families ? (
                    <p
                      className="mt-3 text-center text-[11.5px] font-medium"
                      style={{ color: GOLD }}
                    >
                      به میزبانی خانواده‌های {families}
                    </p>
                  ) : null}

                  <div className="mt-5 space-y-2">
                    {STORY.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border px-3.5 py-3"
                        style={{
                          borderColor: `${GOLD}55`,
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
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-[12px]"
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
                </CarpetFrame>
              </motion.section>

              {/* Countdown */}
              {showCountdown ? (
                <motion.section variants={fadeUp}>
                  <SectionHeader en="Save The Date" title="تقویمِ روزِ پیوند" />
                  <div
                    className="mt-4 rounded-[24px] border p-4"
                    style={{
                      borderColor: `${GOLD}55`,
                      backgroundColor: CREAM,
                    }}
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

              {/* Schedule */}
              <motion.section
                id="schedule"
                className="scroll-mt-20"
                variants={fadeUp}
              >
                <SectionHeader
                  en="Night Weave"
                  title="نقشه‌ی شبِ رؤیایی"
                  description="از ورود تا رقص روی فرشِ عشق"
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
                          borderColor: `${CRIMSON}28`,
                          backgroundColor: CREAM,
                        }}
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: `${CRIMSON}14`,
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

              {/* Location */}
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
                    style={{
                      borderColor: `${GOLD}55`,
                      backgroundColor: CREAM,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${NAVY}10`, color: NAVY }}
                      >
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-display text-[22px]">
                          {data.venueName || "عمارت یاس سفید"}
                        </h3>
                        <p
                          className="mt-1 text-[12.5px]"
                          style={{ color: `${NAVY}99` }}
                        >
                          {data.venueAddress ||
                            "تهران، نیاوران، خیابان یاسمن"}
                        </p>
                      </div>
                    </div>
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

              {/* Haft-rang palette */}
              <motion.section variants={fadeUp}>
                <SectionHeader en="Haft-Rang" title="پالتِ هفت‌رنگ و پوشش" />
                <p
                  className="mt-3 text-center text-[12.5px] leading-7"
                  style={{ color: `${NAVY}aa` }}
                >
                  {theme.dressCode}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {TILES.map((tile, idx) => {
                    const active = tileIdx === idx;
                    return (
                      <button
                        key={tile.en}
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
                            borderColor: `${NAVY}22`,
                          }}
                        />
                        <span className="mt-1.5 block text-[10.5px] font-medium">
                          {tile.label}
                        </span>
                        <span
                          className="mt-0.5 block text-[8.5px] uppercase tracking-wider"
                          style={{ color: `${NAVY}77` }}
                        >
                          {tile.en}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p
                  className="mt-3 text-center text-[11.5px] leading-6"
                  style={{ color: CRIMSON }}
                >
                  پیشنهاد امروز: {TILES[tileIdx].label} — هماهنگ با نقش‌های فرش
                </p>
              </motion.section>

              {/* RSVP */}
              {features?.rsvp !== false ? (
                <motion.section
                  id="rsvp"
                  className="scroll-mt-20"
                  variants={fadeUp}
                >
                  <SectionHeader
                    en="RSVP"
                    title="اعلام حضور روی فرش"
                    description="پاسختان را با مهرِ لاکی برای ما بفرستید"
                  />
                  <CarpetFrame className="mt-4 rounded-[26px]">
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
                            : "دل‌تان با ماست و نقشش روی فرش ما ماند"}
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
                                  attending === opt.v ? GOLD : `${GOLD}40`,
                                backgroundColor:
                                  attending === opt.v
                                    ? `${CRIMSON}12`
                                    : IVORY,
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
                            background: `linear-gradient(135deg, ${CRIMSON}, ${TERRACOTTA})`,
                          }}
                        >
                          <Feather className="h-4 w-4" />
                          {preview
                            ? "گره زدن حضور روی فرش"
                            : "ثبت اعلام حضور"}
                        </button>
                      </>
                    )}
                  </CarpetFrame>
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
                  {couple} · carpet of iran
                </p>
              </motion.section>
            </motion.div>
          </div>
        </main>

        <AnimatePresence>
          {unrolled ? (
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
                  backgroundColor: `${CREAM}f0`,
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
