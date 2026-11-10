"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  CalendarDays,
  Feather,
  MapPin,
  Music2,
  Navigation,
  RotateCcw,
  ScrollText,
  Stamp,
  Users,
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

const DEFAULT_COVER = "/images/templates/qajar-scroll-cover.jpg";

const LAPIS = "#14254a";
const WALNUT = "#2a1810";
const GOLD = "#c8a24a";
const PARCH = "#efe0bf";
const LAKI = "#8c1c13";
const TURQ = "#2a8d8a";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۰۰",
    title: "قدوم میهمانان",
    description: "پذیرایی با شربت بهارنارنج، چای قندپهلو و شیرینی نخودچی",
    icon: "cafe",
  },
  {
    time: "۱۹:۳۰",
    title: "خطبه‌ی عقد",
    description: "جاری شدن صیغه‌ی عقد بر سر سفره‌ی آینه و شمعدان",
    icon: "heart",
  },
  {
    time: "۲۱:۰۰",
    title: "ضیافت شام",
    description: "سفره‌ای به رسم قدیم با چلوکباب و شیرین‌پلو",
    icon: "dining",
  },
  {
    time: "۲۲:۳۰",
    title: "ساز و آواز",
    description: "نوای تار و تنبک و پایکوبی تا پاسی از شب",
    icon: "music",
  },
];

const SOFREH = [
  { name: "آینه و شمعدان", meaning: "روشنایی آینده" },
  { name: "نان سنگک", meaning: "برکت زندگی" },
  { name: "کاسه‌ی عسل", meaning: "شیرینی کام" },
  { name: "سکه‌ی طلا", meaning: "فراوانی و توانگری" },
  { name: "اسپند", meaning: "دوری از چشم‌زخم" },
  { name: "سبزه", meaning: "سرسبزی پیوند" },
];

const COLORS = [
  { color: LAPIS, label: "لاجوردی" },
  { color: TURQ, label: "فیروزه‌ای" },
  { color: LAKI, label: "لاکی" },
  { color: GOLD, label: "زرین" },
];

const BOTEH =
  "M30 4 C 50 10 57 36 45 52 C 35 64 13 62 7 49 C 2 37 12 27 22 29 C 30 31 31 41 24 44 C 31 35 35 18 30 4 Z";

function Boteh({ className = "", color = GOLD }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 64" className={className} aria-hidden>
      <path d={BOTEH} fill="none" stroke={color} strokeWidth="2.2" />
      <path d="M28 14 C 38 20 42 36 34 46" fill="none" stroke={color} strokeWidth="1.4" strokeDasharray="2 3" />
      <circle cx="21" cy="47" r="3" fill={color} />
    </svg>
  );
}

function Star8({ className = "", fill = "none", stroke = GOLD }: { className?: string; fill?: string; stroke?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden>
      <rect x="-32" y="-32" width="64" height="64" fill={fill} stroke={stroke} strokeWidth="3" />
      <rect x="-32" y="-32" width="64" height="64" fill={fill} stroke={stroke} strokeWidth="3" transform="rotate(45)" />
      <circle r="14" fill="none" stroke={stroke} strokeWidth="2.5" />
      <circle r="4" fill={stroke} />
    </svg>
  );
}

function Divider({ color = GOLD }: { color?: string }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <Boteh className="h-5 w-5 -scale-x-100" color={color} />
      <Star8 className="h-4 w-4" stroke={color} />
      <Boteh className="h-5 w-5" color={color} />
      <span className="h-px w-16" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}

function Roller() {
  return (
    <div className="relative z-20 mx-auto h-9 w-[94%]">
      <div className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,#8a6a3e_0%,#d9c08c_22%,#f6e8c8_45%,#cfb27c_72%,#7a5a30_100%)] shadow-[0_8px_16px_-6px_rgba(0,0,0,0.6)]" />
      <span className="absolute -left-4 top-1/2 h-12 w-7 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#3d2412,#7a4a26_45%,#3d2412)] ring-2 ring-[#c8a24a]" />
      <span className="absolute -right-4 top-1/2 h-12 w-7 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#3d2412,#7a4a26_45%,#3d2412)] ring-2 ring-[#c8a24a]" />
    </div>
  );
}

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", day: "", month: "", year: "" };
  try {
    const d = new Date(iso);
    const f = (o: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...o }).format(d);
    return {
      weekday: f({ weekday: "long" }),
      day: f({ day: "numeric" }),
      month: f({ month: "long" }),
      year: f({ year: "numeric" }),
    };
  } catch {
    return { weekday: "", day: "", month: "", year: "" };
  }
}

export function QajarScrollRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = `qs${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [stage, setStage] = useState<"rolled" | "unrolling" | "open">("rolled");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const [stamped, setStamped] = useState(false);
  const timer = useRef<number | null>(null);

  const rolled = stage === "rolled";
  const open = stage === "open";

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const breakSeal = () => {
    if (stage !== "rolled") return;
    setStage("unrolling");
    timer.current = window.setTimeout(() => setStage("open"), 1900);
  };

  const rollUp = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setStage("rolled");
    setStamped(false);
  };

  const theme: TemplateCustomization = {
    primaryColor: GOLD,
    secondaryColor: LAKI,
    backgroundColor: WALNUT,
    poeticLine: "«من از آن روز که دربند توام آزادم، پادشاهم که به دست تو اسیر افتادم»",
    blessingLine:
      "قدوم سبزتان چراغ این مجلس است؛ سایه‌تان بر سر این پیوند، مایه‌ی برکت و شادی.",
    dressCode:
      "پوشش رسمی با الهام از رنگ‌های ایران قدیم؛ لاجوردی، فیروزه‌ای، لاکی و زرین.",
    musicTitle: "نوای تار — بیات اصفهان",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const parts = datePartsOf(data.eventStartAt, data.timezone);
  const timeFa = formatEventTimeRange(data.eventStartAt, data.eventEndAt, data.timezone);
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
    features?.map !== false && !!(data.venueName || data.venueAddress || data.mapUrl);
  const query = encodeURIComponent(
    data.mapUrl || [data.venueName, data.venueAddress].filter(Boolean).join(" ") || "",
  );
  const fam1 = data.familyNames?.partnerOneFamily;
  const fam2 = data.familyNames?.partnerTwoFamily;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#3b2410]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes qs-glint { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
        @keyframes qs-stamp { 0% { transform: scale(2.4) rotate(-20deg); opacity: 0; } 60% { transform: scale(0.92) rotate(-6deg); opacity: 1; } 100% { transform: scale(1) rotate(-8deg); opacity: 1; } }
        @keyframes qs-sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes qs-flame { 0%,100% { transform: scaleY(1) translateY(0); } 50% { transform: scaleY(1.15) translateY(-1px); } }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[radial-gradient(120%_70%_at_50%_0%,#4a2c18_0%,#2a1810_55%,#1a0e08_100%)]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13]" aria-hidden>
          <defs>
            <pattern id={`${uid}-tile`} width="56" height="56" patternUnits="userSpaceOnUse">
              <g transform="translate(28 28)" fill="none" stroke={GOLD} strokeWidth="1">
                <rect x="-12" y="-12" width="24" height="24" />
                <rect x="-12" y="-12" width="24" height="24" transform="rotate(45)" />
                <circle r="4" />
              </g>
              <path d="M0 0 L8 0 M0 0 L0 8 M56 56 L48 56 M56 56 L56 48" stroke={GOLD} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${uid}-tile)`} />
        </svg>

        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#c8a24a]/25 bg-[#2a1810]/90 px-4 backdrop-blur">
          <span className="flex items-center gap-1.5 font-display text-sm text-[#e8cf8e]">
            <Boteh className="h-5 w-5" />
            قباله‌ی دعوت
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c8a24a]/70 bg-[#8c1c13] font-display text-[11px] text-[#f3e3b5]">
            {monogram}
          </span>
        </header>

        <main className="relative z-10 flex flex-col pb-28">
          <section className="px-6 pt-7 text-center text-[#e8cf8e]">
            <p className="font-display text-lg tracking-wide" style={{ animation: "qs-glint 4s ease-in-out infinite" }}>
              هُوَ المَحبوب
            </p>
            <div className="mt-3">
              <Divider />
            </div>
            <h1 className="mt-4 font-display text-[38px] leading-tight text-[#f3e3b5] [text-shadow:0_2px_0_#1a0e08]">
              {couple}
            </h1>
            <p className="mt-1 text-[12px] text-[#e8cf8e]/75">به رسم ایران قدیم، دعوتی از دل</p>
          </section>

          {/* Scroll */}
          <section className="relative mt-7 px-4">
            <Roller />

            <div
              inert={rolled}
              aria-hidden={rolled}
              className={`relative z-10 mx-auto w-[86%] overflow-hidden transition-[max-height,opacity] duration-[2000ms] ease-[cubic-bezier(0.45,0,0.2,1)] ${
                rolled ? "invisible max-h-0 opacity-0" : "max-h-[1700px] opacity-100"
              }`}
            >
              <div
                className="relative px-5 py-7 text-center"
                style={{
                  backgroundColor: PARCH,
                  backgroundImage:
                    "radial-gradient(circle at 20% 15%, rgba(139,94,40,0.12), transparent 40%), radial-gradient(circle at 85% 70%, rgba(139,94,40,0.14), transparent 45%), linear-gradient(180deg, rgba(90,60,20,0.25), transparent 6%, transparent 94%, rgba(90,60,20,0.25))",
                }}
              >
                <div className="relative border-[3px] border-double border-[#b08a3a] p-4">
                  <div className="absolute inset-1.5 border border-[#b08a3a]/50" aria-hidden />
                  {[
                    "-right-2 -top-2",
                    "-left-2 -top-2 -scale-x-100",
                    "-right-2 -bottom-2 -scale-y-100",
                    "-left-2 -bottom-2 -scale-100",
                  ].map((pos) => (
                    <Boteh key={pos} className={`absolute h-8 w-8 ${pos}`} color={LAKI} />
                  ))}

                  <p className="relative pt-2 text-[11px] tracking-[0.3em] text-[#8c1c13]">بِسمِ رَبِّ العِشق</p>
                  <div className="relative mx-auto mt-4 w-[70%]">
                    <div className="overflow-hidden rounded-t-full border-[3px] border-[#b08a3a] p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt=""
                        className="aspect-[3/4] w-full rounded-t-full object-cover sepia-[45%] saturate-[0.85]"
                      />
                    </div>
                    <Star8 className="absolute -bottom-4 left-1/2 h-9 w-9 -translate-x-1/2" fill={PARCH} stroke={LAKI} />
                  </div>

                  <p className="relative mt-8 font-display text-[17px] leading-9 text-[#5a3a14]">{theme.poeticLine}</p>
                  <div className="my-4">
                    <Divider color="#b08a3a" />
                  </div>
                  <p className="relative text-[13px] leading-8 text-[#4a2e10]">
                    {data.invitationText ||
                      "به میمنت و مبارکی، مجلس جشن پیوند فرزندانمان برپا می‌گردد. قدوم سبزتان را بر دیده منت نهاده، حضورتان را چراغ این مجلس می‌دانیم."}
                  </p>

                  <div className="relative mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div>
                      <p className="font-display text-[26px] leading-tight text-[#8c1c13]">{data.partnerOneName}</p>
                      {fam1 ? <p className="mt-0.5 text-[11px] text-[#6b4a20]">فرزند خانواده‌ی {fam1}</p> : null}
                    </div>
                    <Star8 className="h-7 w-7" stroke="#b08a3a" />
                    <div>
                      <p className="font-display text-[26px] leading-tight text-[#8c1c13]">{data.partnerTwoName}</p>
                      {fam2 ? <p className="mt-0.5 text-[11px] text-[#6b4a20]">فرزند خانواده‌ی {fam2}</p> : null}
                    </div>
                  </div>

                  <div className="relative mt-6 border-y border-[#b08a3a]/60 py-3 text-[13px] leading-8 text-[#4a2e10]">
                    {parts.day ? (
                      <p>
                        در روز فرخنده‌ی <b className="text-[#8c1c13]">{parts.weekday}</b>،{" "}
                        <b className="text-[#8c1c13]">
                          {parts.day} {parts.month}‌ماه {parts.year}
                        </b>{" "}
                        خورشیدی
                      </p>
                    ) : (
                      <p>تاریخ مجلس به‌زودی اعلام می‌گردد</p>
                    )}
                    {timeFa ? <p>{timeFa}</p> : null}
                    {data.venueName ? <p>در {data.venueName}</p> : null}
                  </div>

                  <div className="relative mt-5 flex items-end justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#6b4a20]">
                      <Music2 className="h-3.5 w-3.5" />
                      {theme.musicTitle}
                    </span>
                    <span className="flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-full border-2 border-dashed border-[#8c1c13]/70 font-display text-[11px] leading-tight text-[#8c1c13]/80">
                      مُهرِ
                      <br />
                      وصال
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative -mt-1">
              <Roller />
              {rolled ? (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                  <span className="absolute inset-y-[-6px] left-1/2 w-9 -translate-x-1/2 bg-[linear-gradient(90deg,#5e0f0a,#a8261b_50%,#5e0f0a)] shadow-md" />
                  <button
                    type="button"
                    onClick={breakSeal}
                    aria-label="شکستن مهر و گشودن طومار"
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c23a2c,#7a140d_70%)] font-display text-sm text-[#f3d9a0] shadow-[0_8px_18px_rgba(0,0,0,0.5),inset_0_-3px_6px_rgba(0,0,0,0.4)] ring-4 ring-[#7a140d]/40 transition hover:scale-105 active:scale-95"
                  >
                    <span className="absolute inset-1.5 rounded-full border border-dashed border-[#f3d9a0]/50" />
                    {monogram}
                  </button>
                </div>
              ) : null}
            </div>

            {rolled ? (
              <div className="mt-8 text-center">
                <p className="font-display text-[15px] text-[#e8cf8e]">مُهر را بشکن تا طومار گشوده شود</p>
                <p className="mt-1 text-[11px] text-[#e8cf8e]/60">قباله‌ی دعوت شما در این طومار پیچیده شده است</p>
              </div>
            ) : null}
          </section>

          {/* Revealed content */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-12 px-5 transition-all duration-1000 ease-out ${
              open
                ? "mt-12 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            {/* Sofreh-ye aghd */}
            <section className="text-center text-[#f3e3b5]">
              <p className="text-[11px] tracking-[0.3em] text-[#c8a24a]">سُفره‌ی عقد</p>
              <h2 className="mt-1 font-display text-2xl">نشانه‌های سفره‌ی ما</h2>
              <div className="mt-3">
                <Divider />
              </div>
              <div className="relative mx-auto mt-5 flex h-16 w-40 items-end justify-center gap-6" aria-hidden>
                {[0, 1].map((i) => (
                  <span key={i} className="relative flex flex-col items-center">
                    <span
                      className="h-4 w-2 rounded-full bg-[radial-gradient(circle_at_50%_70%,#fff3b0,#f0a020_60%,transparent_70%)]"
                      style={{ animation: `qs-flame ${1 + i * 0.3}s ease-in-out infinite`, transformOrigin: "bottom" }}
                    />
                    <span className="h-8 w-1.5 bg-[#f6ead0]" />
                    <span className="h-2 w-6 rounded-t-full bg-[#c8a24a]" />
                  </span>
                ))}
                <span className="absolute bottom-0 left-1/2 h-14 w-10 -translate-x-1/2 rounded-t-full border-2 border-[#c8a24a] bg-[linear-gradient(135deg,#9fb6d8,#e8f0fb_45%,#7a93ba)]" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {SOFREH.map((s) => (
                  <div
                    key={s.name}
                    className="flex flex-col items-center rounded-2xl border border-[#c8a24a]/30 bg-[#1a0e08]/50 px-2 py-3"
                  >
                    <Star8 className="h-9 w-9" fill="#8c1c13" stroke={GOLD} />
                    <p className="mt-2 font-display text-[14px] text-[#f3e3b5]">{s.name}</p>
                    <p className="mt-0.5 text-[10px] leading-5 text-[#e8cf8e]/70">{s.meaning}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section id="schedule" className="scroll-mt-20 text-[#f3e3b5]">
              <div className="text-center">
                <p className="text-[11px] tracking-[0.3em] text-[#c8a24a]">آیینِ مجلس</p>
                <h2 className="mt-1 font-display text-2xl">برنامه‌ی شب وصال</h2>
              </div>
              <ol className="relative mt-6 space-y-4">
                {schedule.map((item, i) => (
                  <li key={`${item.time}-${item.title}`} className="flex items-stretch gap-3">
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-t-full border border-[#c8a24a]/60 bg-[#8c1c13] px-1 pb-2 pt-4 text-center">
                      <span className="font-display text-sm text-[#f3e3b5]">{item.time}</span>
                      <span className="mt-1 text-[9px] text-[#e8cf8e]/70">
                        {["نخست", "دوم", "سوم", "چهارم", "پنجم", "ششم"][i] ?? ""}
                      </span>
                    </div>
                    <div className="flex-1 rounded-2xl border border-[#c8a24a]/25 bg-[#efe0bf] p-4 text-[#3b2410]">
                      <p className="font-display text-[17px] text-[#8c1c13]">{item.title}</p>
                      <p className="mt-1 text-[12px] leading-6 text-[#4a2e10]">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Countdown */}
            {showCountdown ? (
              <section className="relative rounded-[30px] border border-[#c8a24a]/50 bg-[#1a0e08]/70 px-4 pb-5 pt-8 text-center text-[#f3e3b5]">
                <Star8 className="absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2" fill={WALNUT} stroke={GOLD} />
                <h2 className="font-display text-2xl">تا شب وصال</h2>
                <Countdown
                  eventStartAt={data.eventStartAt!}
                  className="mt-4 [&>div]:rounded-t-full [&>div]:border-[#c8a24a]/40 [&>div]:bg-[#8c1c13]/80 [&>div]:pt-5 [&_p:first-child]:font-display [&_p:first-child]:text-3xl [&_p:first-child]:text-[#f3e3b5] [&_p:last-child]:text-[#e8cf8e]"
                />
              </section>
            ) : null}

            {/* Venue as old stamp */}
            {showMap ? (
              <section id="location" className="scroll-mt-20">
                <div className="text-center text-[#f3e3b5]">
                  <p className="text-[11px] tracking-[0.3em] text-[#c8a24a]">نشانیِ مجلس</p>
                  <h2 className="mt-1 font-display text-2xl">کجا گرد هم می‌آییم</h2>
                </div>
                <div
                  className="mx-auto mt-5 w-[92%] rotate-[-1.5deg] p-2"
                  style={{
                    backgroundImage: `radial-gradient(circle at 8px 8px, transparent 4px, ${PARCH} 4.5px)`,
                    backgroundSize: "16px 16px",
                  }}
                >
                  <div className="relative border-2 border-[#8c1c13]/70 bg-[#efe0bf] p-5 text-[#3b2410]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[11px] text-[#8c1c13]">
                          <MapPin className="h-3.5 w-3.5" />
                          پست عاشقانه
                        </p>
                        <p className="mt-1 font-display text-2xl leading-tight text-[#14254a]">
                          {data.venueName || "محل مجلس"}
                        </p>
                        {data.venueAddress ? (
                          <p className="mt-1 text-[12px] leading-6 text-[#4a2e10]">{data.venueAddress}</p>
                        ) : null}
                      </div>
                      <div className="relative flex h-20 w-20 shrink-0 rotate-12 flex-col items-center justify-center rounded-full border-2 border-[#14254a]/60 text-center text-[#14254a]/75">
                        <span className="absolute inset-1.5 rounded-full border border-[#14254a]/40" />
                        <span className="text-[9px]">{parts.month || "روز وصل"}</span>
                        <span className="font-display text-xl leading-none">{parts.day || "♥"}</span>
                        <span className="text-[9px]">{parts.year}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#8c1c13]/40 pt-2 text-[10px] text-[#6b4a20]">
                      <span>تمبر یادگاری · {couple}</span>
                      <span className="font-display text-sm text-[#8c1c13]">۱ عشق</span>
                    </div>
                  </div>
                </div>

                {query ? (
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                      { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                      { href: `https://www.google.com/maps/search/?api=1&query=${query}`, label: "گوگل" },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 rounded-full border border-[#c8a24a]/50 py-2.5 text-xs text-[#f3e3b5] transition hover:bg-[#c8a24a]/15"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
                {calendarHref ? (
                  <a
                    href={calendarHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-[#c8a24a] py-2.5 text-xs text-[#14254a] transition hover:bg-[#e8cf8e]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Dress code */}
            <section className="text-center text-[#f3e3b5]">
              <p className="text-[11px] tracking-[0.3em] text-[#c8a24a]">پوششِ مجلس</p>
              <h2 className="mt-1 font-display text-2xl">رنگ‌های کاشی و قلمکار</h2>
              <p className="mt-2 text-[13px] leading-7 text-[#e8cf8e]/80">{theme.dressCode}</p>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {COLORS.map((c) => (
                  <div key={c.label} className="flex flex-col items-center gap-1.5">
                    <Star8 className="h-14 w-14" fill={c.color} stroke={c.color === GOLD ? "#f3e3b5" : GOLD} />
                    <span className="text-[11px]">{c.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP */}
            {features?.rsvp !== false ? (
              <section id="rsvp" className="scroll-mt-20 rounded-[28px] border border-[#c8a24a]/40 bg-[#efe0bf] p-6 text-center text-[#3b2410]">
                <p className="text-[11px] tracking-[0.3em] text-[#8c1c13]">پاسخ به دعوت</p>
                <h2 className="mt-1 font-display text-2xl text-[#14254a]">قدم رنجه می‌فرمایید؟</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "با کمال میل حاضرم" },
                    { value: false, label: "با عرض پوزش، نه" },
                  ].map(({ value, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setAttending(value);
                        setStamped(false);
                      }}
                      className={`rounded-full border px-2 py-3 text-[13px] transition ${
                        attending === value
                          ? "border-[#14254a] bg-[#14254a] text-[#f3e3b5]"
                          : "border-[#b08a3a]/60 text-[#4a2e10]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className={`mt-3 flex items-center justify-between rounded-full border border-[#b08a3a]/60 px-5 py-2.5 transition ${attending ? "" : "pointer-events-none opacity-40"}`}>
                  <span className="flex items-center gap-1.5 text-[13px]">
                    <Users className="h-4 w-4 text-[#8c1c13]" />
                    شمار همراهان
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#14254a]/40 active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-5 font-display text-xl text-[#8c1c13]">{guests.toLocaleString("fa-IR")}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14254a] text-[#f3e3b5] active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="relative mt-6 flex min-h-[96px] items-center justify-center">
                  {stamped ? (
                    <div
                      className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-[3px] border-double border-[#8c1c13] text-center text-[#8c1c13]"
                      style={{ animation: "qs-stamp 0.6s cubic-bezier(0.2,0.8,0.2,1) both" }}
                    >
                      <span className="font-display text-[15px] leading-6">
                        {attending ? "حاضر" : "دلمان"}
                        <br />
                        {attending ? "می‌شوم" : "با شماست"}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStamped(true)}
                      className="flex items-center gap-2 rounded-full bg-[#8c1c13] px-6 py-3 text-sm text-[#f3e3b5] shadow-[0_10px_20px_-10px_rgba(140,28,19,0.9)] transition active:scale-95"
                    >
                      <Stamp className="h-4 w-4" />
                      {preview ? "مهر کن و بفرست" : "پاسخ را مهر کن"}
                    </button>
                  )}
                </div>
              </section>
            ) : null}

            {/* Blessing */}
            <section className="text-center text-[#f3e3b5]">
              <Divider />
              <p className="mt-5 font-display text-[28px] text-[#e8cf8e]" style={{ animation: "qs-glint 3s ease-in-out infinite" }}>
                مبارک باد
              </p>
              <p className="mt-3 font-display text-lg leading-9">{theme.blessingLine}</p>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[#c8a24a]">
                <Feather className="h-3.5 w-3.5" />
                {couple}
              </p>
            </section>

            <button
              type="button"
              onClick={rollUp}
              className="mx-auto flex items-center gap-1.5 rounded-full border border-[#c8a24a]/60 px-4 py-2 text-xs text-[#f3e3b5] active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              طومار را دوباره بپیچ
            </button>

            <footer className="pb-4 text-center text-[11px] tracking-[0.2em] text-[#c8a24a]/80">
              {couple} · به یادگار ایران قدیم
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#c8a24a]/25 bg-[#1a0e08]/92 px-2 backdrop-blur">
          {[
            { href: "#", label: "قباله", Icon: ScrollText },
            { href: "#schedule", label: "مجلس", Icon: Feather },
            { href: "#location", label: "نشانی", Icon: MapPin },
            { href: "#rsvp", label: "پاسخ", Icon: Stamp },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#" && !open) {
                  if (timer.current) window.clearTimeout(timer.current);
                  setStage("open");
                }
              }}
              className="flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] text-[#e8cf8e]/75 hover:text-[#f3e3b5]"
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
