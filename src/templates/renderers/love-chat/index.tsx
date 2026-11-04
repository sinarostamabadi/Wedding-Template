"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BellRing,
  CalendarPlus,
  CheckCheck,
  ChevronUp,
  Heart,
  Lock,
  MapPin,
  MoreVertical,
  Navigation,
  Pause,
  Phone,
  Play,
  Send,
  Smile,
  Video,
} from "lucide-react";
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

const DEFAULT_COVER = "/images/templates/love-chat-cover.jpg";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  { time: "۱۸:۰۰", title: "پذیرایی و خوش‌آمد", description: "", icon: "cafe" },
  { time: "۱۹:۳۰", title: "مراسم عقد", description: "", icon: "heart" },
  { time: "۲۱:۰۰", title: "شام", description: "", icon: "dining" },
  { time: "۲۲:۳۰", title: "کیک و رقص", description: "", icon: "music" },
];

const SWATCHES = ["#6d4aff", "#ff6fa3", "#ffd6e5", "#1f1b2e"];
const WAVE = [4, 9, 6, 14, 10, 18, 12, 8, 16, 11, 6, 13, 9, 17, 7, 12, 5, 10, 14, 6, 9, 4];

type Msg = {
  key: string;
  from: "a" | "b" | "sys";
  time?: string;
  bare?: boolean;
  body: ReactNode;
};

function clockOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return "۱۹:۳۰";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return "۱۹:۳۰";
  }
}

function lockDateOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const weekday = new Intl.DateTimeFormat("fa-IR", { timeZone, weekday: "long" }).format(d);
    const day = new Intl.DateTimeFormat("fa-IR", { timeZone, day: "numeric" }).format(d);
    const month = new Intl.DateTimeFormat("fa-IR", { timeZone, month: "long" }).format(d);
    return `${weekday}، ${day} ${month}`;
  } catch {
    return "";
  }
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-1 py-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-[#9a8fb8]"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function LoveChatRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState(2);
  const [liked, setLiked] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const theme: TemplateCustomization = {
    primaryColor: "#6d4aff",
    secondaryColor: "#ff6fa3",
    backgroundColor: "#f3effa",
    poeticLine: "«هر کجا هستم، باشم؛ آسمان مال من است» — از امروز مال ما",
    blessingLine: "منتظرتیم! بدون تو این جشن یه چیزی کم داره.",
    dressCode: "رسمی ولی راحت؛ اگه یه چیز بنفش یا صورتی داشته باشی که دیگه عالیه.",
    musicTitle: "آهنگ ما",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const a = data.partnerOneName;
  const b = data.partnerTwoName;
  const couple = coupleLabel(a, b);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
  const dayFa = formatEventDay(data.eventStartAt, data.timezone);
  const timeFa = formatEventTimeRange(data.eventStartAt, data.eventEndAt, data.timezone);
  const clock = clockOf(data.eventStartAt, data.timezone);
  const calendarHref = googleCalendarUrl({
    title: data.title || `عروسی ${couple}`,
    startIso: data.eventStartAt,
    endIso: data.eventEndAt,
    location: [data.venueName, data.venueAddress].filter(Boolean).join(" - "),
    details: data.invitationText,
  });
  const schedule = theme.schedule?.length ? theme.schedule : DEFAULT_SCHEDULE;
  const showMap =
    features?.map !== false && !!(data.venueName || data.venueAddress || data.mapUrl);
  const query = encodeURIComponent(
    data.mapUrl || [data.venueName, data.venueAddress].filter(Boolean).join(" ") || "",
  );

  const messages: Msg[] = [
    { key: "day", from: "sys", body: "امروز" },
    { key: "hi", from: "a", time: "۲۰:۰۱", body: "سلام! یه خبر خیلی مهم داریم…" },
    {
      key: "news",
      from: "b",
      time: "۲۰:۰۱",
      body: (
        <span className="font-display text-[22px] font-bold leading-9">
          ما داریم ازدواج می‌کنیم!
        </span>
      ),
    },
    {
      key: "photo",
      from: "b",
      time: "۲۰:۰۲",
      bare: true,
      body: (
        <div className="w-[240px] overflow-hidden rounded-2xl rounded-bl-md bg-[#e9ddff] p-1 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" className="aspect-[4/5] w-full rounded-xl object-cover" />
          <p className="px-2 pb-1 pt-2 text-[13px] leading-6 text-[#2a2440]">
            {theme.poeticLine}
          </p>
        </div>
      ),
    },
    {
      key: "invite",
      from: "a",
      time: "۲۰:۰۳",
      body:
        data.invitationText ||
        "دوست داریم توی شروع زندگی مشترکمون کنارمون باشی. این دعوت‌نامه‌ی رسمی ماست.",
    },
    {
      key: "event",
      from: "a",
      time: "۲۰:۰۳",
      bare: true,
      body: (
        <div className="w-[250px] overflow-hidden rounded-2xl rounded-br-md bg-white shadow-sm">
          <div className="bg-gradient-to-l from-[#6d4aff] to-[#ff6fa3] px-4 py-3 text-white">
            <p className="text-[11px] opacity-90">رویداد</p>
            <p className="text-base font-bold">جشن عروسی {couple}</p>
          </div>
          <div className="space-y-1 px-4 py-3 text-[13px] text-[#2a2440]">
            <p className="font-semibold">{dayFa}</p>
            {timeFa ? <p className="text-[#6b6385]">{timeFa}</p> : null}
            {data.venueName ? <p className="text-[#6b6385]">{data.venueName}</p> : null}
          </div>
          {calendarHref ? (
            <a
              href={calendarHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 border-t border-[#efe9fb] py-2.5 text-[13px] font-semibold text-[#6d4aff]"
            >
              <CalendarPlus className="h-4 w-4" />
              افزودن به تقویم
            </a>
          ) : null}
        </div>
      ),
    },
    ...(showMap
      ? [
          {
            key: "loc",
            from: "b" as const,
            time: "۲۰:۰۴",
            bare: true,
            body: (
              <div className="w-[250px] overflow-hidden rounded-2xl rounded-bl-md bg-[#e9ddff] p-1 shadow-sm">
                <div className="relative h-32 overflow-hidden rounded-xl bg-[#dfe9e1] [background-image:linear-gradient(90deg,rgba(255,255,255,0.7)_2px,transparent_2px),linear-gradient(rgba(255,255,255,0.7)_2px,transparent_2px),linear-gradient(35deg,transparent_45%,#f6d58e_45%,#f6d58e_52%,transparent_52%)] [background-size:38px_38px,38px_38px,100%_100%]">
                  <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-[#ff6fa3] text-white shadow-lg ring-4 ring-white">
                    <Heart className="h-4 w-4 fill-current" />
                  </span>
                </div>
                <div className="px-2 pb-1 pt-2">
                  <p className="flex items-center gap-1 text-[13px] font-bold text-[#2a2440]">
                    <MapPin className="h-3.5 w-3.5 text-[#ff6fa3]" />
                    {data.venueName || "محل جشن"}
                  </p>
                  {data.venueAddress ? (
                    <p className="mt-0.5 text-[11px] leading-5 text-[#6b6385]">
                      {data.venueAddress}
                    </p>
                  ) : null}
                  {query ? (
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {[
                        { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                        { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                        {
                          href: `https://www.google.com/maps/search/?api=1&query=${query}`,
                          label: "گوگل",
                        },
                      ].map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 rounded-lg bg-white/80 py-1.5 text-[11px] font-semibold text-[#6d4aff]"
                        >
                          <Navigation className="h-3 w-3" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ),
          },
        ]
      : []),
    {
      key: "plan-q",
      from: "a",
      time: "۲۰:۰۵",
      body: "برنامه‌ی اون شب رو هم برات بفرستم؟",
    },
    {
      key: "plan",
      from: "b",
      time: "۲۰:۰۵",
      body: (
        <div className="min-w-[210px]">
          <p className="mb-2 text-[13px] font-bold">برنامه‌ی جشن</p>
          <ul className="space-y-1.5">
            {schedule.map((item) => (
              <li key={`${item.time}-${item.title}`} className="flex items-center gap-2 text-[13px]">
                <span className="rounded-md bg-white/70 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#6d4aff]">
                  {item.time}
                </span>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    ...(features?.music !== false
      ? [
          {
            key: "voice",
            from: "a" as const,
            time: "۲۰:۰۶",
            body: (
              <div className="flex min-w-[220px] items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  aria-label="پخش پیام صوتی"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6d4aff] text-white"
                >
                  {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                </button>
                <div className="flex-1">
                  <div className="flex h-6 items-center gap-[2px]" dir="ltr">
                    {WAVE.map((h, i) => (
                      <span
                        key={i}
                        className={`w-[3px] rounded-full ${
                          playing && i < 9 ? "bg-[#6d4aff]" : "bg-[#c9bfe6]"
                        } ${playing ? "animate-pulse" : ""}`}
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                  <p className="mt-0.5 text-[10px] text-[#6b6385]">
                    {theme.musicTitle} · ۰:۴۲
                  </p>
                </div>
              </div>
            ),
          },
        ]
      : []),
    ...(features?.countdown !== false && data.eventStartAt
      ? [
          {
            key: "count",
            from: "b" as const,
            time: "۲۰:۰۷",
            body: (
              <div className="w-[236px]">
                <p className="mb-2 text-[13px] font-bold">تا اون شب فقط مونده:</p>
                <Countdown
                  eventStartAt={data.eventStartAt}
                  className="gap-1.5 [&_div]:rounded-xl [&_div]:border-0 [&_div]:bg-white/80 [&_div]:px-1 [&_div]:py-2 [&_p:first-child]:text-lg [&_p:first-child]:font-bold [&_p:first-child]:text-[#6d4aff] [&_p:last-child]:text-[10px]"
                />
              </div>
            ),
          },
        ]
      : []),
    {
      key: "dress",
      from: "a",
      time: "۲۰:۰۸",
      body: (
        <div>
          <p className="text-[13px] leading-6">{theme.dressCode}</p>
          <div className="mt-2 flex gap-1.5">
            {SWATCHES.map((c) => (
              <span
                key={c}
                className="h-6 w-6 rounded-full ring-2 ring-white"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      ),
    },
    ...(features?.rsvp !== false
      ? [
          {
            key: "poll",
            from: "b" as const,
            time: "۲۰:۰۹",
            bare: true,
            body: (
              <div id="rsvp" className="w-[260px] scroll-mt-24 rounded-2xl rounded-bl-md bg-[#e9ddff] p-3 shadow-sm">
                <p className="text-[11px] text-[#6b6385]">نظرسنجی</p>
                <p className="mt-0.5 text-[14px] font-bold text-[#2a2440]">میای جشنمون؟</p>
                <div className="mt-3 space-y-2">
                  {[
                    { id: "yes" as const, label: "معلومه که میام!", pct: 92 },
                    { id: "no" as const, label: "متأسفانه نمی‌تونم", pct: 8 },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setVote(opt.id)}
                      className="relative block w-full overflow-hidden rounded-xl bg-white/70 px-3 py-2.5 text-right text-[13px] font-semibold text-[#2a2440]"
                    >
                      <span
                        className="absolute inset-y-0 right-0 bg-[#c9b6ff]/70 transition-all duration-700"
                        style={{ width: vote ? `${opt.pct}%` : "0%" }}
                      />
                      <span className="relative flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                              vote === opt.id ? "border-[#6d4aff] bg-[#6d4aff]" : "border-[#9a8fb8]"
                            }`}
                          >
                            {vote === opt.id ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                          </span>
                          {opt.label}
                        </span>
                        {vote ? (
                          <span className="text-[11px] text-[#6d4aff]">
                            {opt.pct.toLocaleString("fa-IR")}٪
                          </span>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>
                <div
                  className={`mt-3 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 transition ${
                    vote === "no" ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <span className="text-[12px] font-semibold text-[#2a2440]">چند نفر میاین؟</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#6d4aff] shadow-sm"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-bold text-[#6d4aff]">
                      {guests.toLocaleString("fa-IR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6d4aff] text-white shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-center text-[10px] text-[#6b6385]">
                  {vote ? "رأیت ثبت شد، ممنون!" : "برای دیدن نتیجه رأی بده"}
                </p>
              </div>
            ),
          },
        ]
      : []),
    {
      key: "bye",
      from: "a",
      time: "۲۰:۱۰",
      body: (
        <span className="flex items-center gap-2">
          {theme.blessingLine}
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            aria-label="پسندیدن"
            className="shrink-0"
          >
            <Heart
              className={`h-5 w-5 transition ${liked ? "scale-125 fill-[#ff6fa3] text-[#ff6fa3]" : "text-[#9a8fb8]"}`}
            />
          </button>
        </span>
      ),
    },
  ];

  const total = messages.length;
  const done = shown >= total;
  const nextFrom = messages[shown]?.from;

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => {
      setShown((n) => {
        if (n >= total) {
          window.clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [open, total]);

  useEffect(() => {
    if (!open || preview || shown < 3) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [open, preview, shown]);

  const openChat = () => {
    setShown(1);
    setOpen(true);
  };
  const lockPhone = () => {
    setOpen(false);
    setShown(0);
    setVote(null);
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#2a2440]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes lc-pop { from { transform: translateY(10px) scale(.96); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes lc-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-[#f3effa]">
        {/* Lock screen */}
        <section
          className={`absolute inset-0 z-30 flex min-h-screen flex-col items-center overflow-hidden text-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
          inert={open}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1f1b2e]/55 via-[#3b2a7a]/35 to-[#1f1b2e]/85" />

          <div className="relative mt-16 flex flex-col items-center">
            <Lock className="h-4 w-4 opacity-80" />
            <p className="mt-3 text-sm opacity-90">
              {lockDateOf(data.eventStartAt, data.timezone) || dayFa}
            </p>
            <p className="font-display text-[84px] font-bold leading-none tracking-tight drop-shadow-lg">
              {clock}
            </p>
          </div>

          <button
            type="button"
            onClick={openChat}
            className="relative mt-12 w-[88%] rounded-3xl bg-white/20 p-3.5 text-right shadow-2xl ring-1 ring-white/30 backdrop-blur-xl transition hover:bg-white/25 active:scale-[0.98]"
            style={{ animation: "lc-float 3s ease-in-out infinite" }}
          >
            <div className="flex items-center justify-between text-[11px] opacity-85">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#6d4aff] to-[#ff6fa3]">
                  <Heart className="h-3 w-3 fill-white" />
                </span>
                دعوت‌نامه
              </span>
              <span>الان</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white/60" />
              <div className="min-w-0">
                <p className="text-[15px] font-bold">{couple}</p>
                <p className="truncate text-[13px] opacity-90">یه خبر خیلی مهم داریم…</p>
              </div>
            </div>
            <p className="mt-2 flex items-center gap-1 text-[11px] opacity-75">
              <BellRing className="h-3 w-3" />
              ۱ پیام جدید
            </p>
          </button>

          <div className="relative mt-auto mb-10 flex flex-col items-center gap-2">
            <ChevronUp className="h-5 w-5 animate-bounce opacity-80" />
            <p className="text-sm font-medium">برای خواندن پیام، روی اعلان بزنید</p>
            <span className="mt-3 h-1.5 w-32 rounded-full bg-white/70" />
          </div>
        </section>

        {/* Chat */}
        <section
          inert={!open}
          aria-hidden={!open}
          className={`relative flex min-h-screen flex-col transition-opacity duration-500 ${
            open ? "opacity-100" : "invisible opacity-0"
          }`}
        >
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-gradient-to-l from-[#6d4aff] to-[#a35bff] px-3 text-white shadow-md">
            <button type="button" onClick={lockPhone} aria-label="بستن" className="p-1">
              <ArrowRight className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white/50" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold">{couple}</p>
              <p className="text-[11px] opacity-85">
                {done ? "آنلاین" : `${nextFrom === "b" ? b : a} در حال نوشتن…`}
              </p>
            </div>
            <Video className="h-5 w-5 opacity-90" />
            <Phone className="h-5 w-5 opacity-90" />
            <MoreVertical className="h-5 w-5 opacity-90" />
          </header>

          <div className="flex-1 space-y-2 px-3 pb-28 pt-4 [background-image:radial-gradient(rgba(109,74,255,0.08)_1.5px,transparent_1.5px)] [background-size:18px_18px]">
            {messages.slice(0, shown).map((m) => {
              if (m.from === "sys") {
                return (
                  <div key={m.key} className="flex justify-center py-1">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] text-[#6b6385] shadow-sm">
                      {m.body}
                    </span>
                  </div>
                );
              }
              const mine = m.from === "a";
              return (
                <div
                  key={m.key}
                  className={`flex ${mine ? "justify-start" : "justify-end"}`}
                  style={{ animation: "lc-pop .35s ease-out both" }}
                >
                  <div className="max-w-[82%]">
                    {m.bare ? (
                      m.body
                    ) : (
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-[14px] leading-7 shadow-sm ${
                          mine ? "rounded-br-md bg-white" : "rounded-bl-md bg-[#e9ddff]"
                        }`}
                      >
                        {m.body}
                      </div>
                    )}
                    <p
                      className={`mt-0.5 flex items-center gap-1 px-1 text-[10px] text-[#9a8fb8] ${
                        mine ? "justify-start" : "justify-end"
                      }`}
                    >
                      {mine ? a : b} · {m.time}
                      {!mine ? <CheckCheck className="h-3 w-3 text-[#6d4aff]" /> : null}
                    </p>
                  </div>
                </div>
              );
            })}

            {open && !done ? (
              <div className={`flex ${nextFrom === "b" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-2xl px-3 py-1.5 shadow-sm ${
                    nextFrom === "b" ? "rounded-bl-md bg-[#e9ddff]" : "rounded-br-md bg-white"
                  }`}
                >
                  <TypingDots />
                </div>
              </div>
            ) : null}

            {open && !done ? (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setShown(total)}
                  className="rounded-full bg-white/80 px-3 py-1 text-[11px] text-[#6d4aff] shadow-sm"
                >
                  نمایش همه‌ی پیام‌ها
                </button>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>
        </section>

        <div
          className={`fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-md items-center gap-2 border-t border-[#e6def8] bg-white/95 px-3 py-2.5 backdrop-blur transition-all duration-500 ${
            open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
          }`}
        >
          <Smile className="h-6 w-6 shrink-0 text-[#9a8fb8]" />
          <span className="flex-1 truncate rounded-full bg-[#f3effa] px-4 py-2.5 text-[13px] text-[#9a8fb8]">
            یه پیام تبریک برای {couple} بنویس…
          </span>
          <a
            href={preview ? undefined : "#rsvp"}
            aria-label="ارسال"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6d4aff] to-[#ff6fa3] text-white shadow-md"
          >
            <Send className="h-4 w-4 -scale-x-100" />
          </a>
        </div>
      </div>
    </div>
  );
}
