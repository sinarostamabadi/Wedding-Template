"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Gift,
  Hand,
  Heart,
  MapPin,
  Music2,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  UserCheck,
  Wand2,
  X,
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

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  { time: "۱۸:۰۰", title: "خوش‌آمدگویی", description: "نوشیدنی خنک و موسیقی زنده در باغ", icon: "cafe" },
  { time: "۱۹:۳۰", title: "مراسم عقد", description: "لحظه‌ای که منتظرش بودیم", icon: "heart" },
  { time: "۲۱:۰۰", title: "شام", description: "ضیافت شام کنار عزیزان", icon: "dining" },
  { time: "۲۲:۳۰", title: "جشن و رقص", description: "کیک، دی‌جی و شادی تا آخر شب", icon: "music" },
];

const SWATCHES = [
  { color: "#d46a7e", label: "رز" },
  { color: "#c9a050", label: "طلایی" },
  { color: "#f6dcd3", label: "بلاش" },
  { color: "#3d2530", label: "آلویی" },
];

const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 7) * 0.08,
  rot: (i * 53) % 360,
  color: ["#d46a7e", "#c9a050", "#f3c6cf", "#3d2530", "#e8cf8a"][i % 5],
  dx: ((i * 29) % 60) - 30,
  shape: i % 3,
}));

function timeOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function datePartsOf(iso?: string | null, timeZone = "Asia/Tehran") {
  if (!iso) return { weekday: "", dayMonth: "" };
  try {
    const d = new Date(iso);
    const f = (o: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("fa-IR", { timeZone, ...o }).format(d);
    return {
      weekday: f({ weekday: "long" }),
      dayMonth: `${f({ day: "numeric" })} ${f({ month: "long" })}`,
    };
  } catch {
    return { weekday: "", dayMonth: "" };
  }
}

/** Gold foil circle that is erased with pointer strokes. */
function ScratchSpot({
  label,
  revealed,
  onReveal,
  children,
}: {
  label: string;
  revealed: boolean;
  onReveal: () => void;
  children: ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const strokes = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = canvas.clientWidth;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, "#f3e0a8");
    g.addColorStop(0.35, "#c9a050");
    g.addColorStop(0.6, "#e8cf8a");
    g.addColorStop(1, "#a97d32");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 40; i++) {
      const x = ((i * 47) % 100) / 100 * size;
      const y = ((i * 71) % 100) / 100 * size;
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    const family = getComputedStyle(canvas).fontFamily || "sans-serif";
    ctx.fillStyle = "#5b3d12";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";
    ctx.font = `700 ${Math.round(size * 0.17)}px ${family}`;
    ctx.fillText(label, size / 2, size * 0.44);
    ctx.font = `500 ${Math.round(size * 0.1)}px ${family}`;
    ctx.fillText("خراش بده", size / 2, size * 0.64);
    ctx.globalCompositeOperation = "destination-out";
    setReady(true);
  }, [label]);

  const clearedRatio = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const { width, height } = canvas;
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let clear = 0;
    let total = 0;
    const r = width / 2;
    for (let y = 0; y < height; y += 6) {
      for (let x = 0; x < width; x += 6) {
        if ((x - r) ** 2 + (y - r) ** 2 > r * r) continue;
        total++;
        if (pixels[(y * width + x) * 4 + 3] < 40) clear++;
      }
    }
    return total ? clear / total : 0;
  }, []);

  const scratch = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.clientWidth / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    ctx.beginPath();
    ctx.arc(x, y, canvas.clientWidth * 0.11, 0, Math.PI * 2);
    ctx.fill();
    strokes.current++;
    if (strokes.current % 6 === 0 && clearedRatio() > 0.5) onReveal();
  };

  return (
    <div className="relative aspect-square w-full">
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-[#c9a050]/60 bg-white p-2 text-center shadow-inner transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
      <canvas
        ref={canvasRef}
        aria-label={`${label} — برای دیدن، خراش دهید`}
        className={`absolute inset-0 h-full w-full cursor-grab touch-none rounded-full shadow-[0_10px_22px_-10px_rgba(91,61,18,0.7)] transition-all duration-700 ${
          revealed ? "pointer-events-none scale-110 opacity-0" : "opacity-100"
        }`}
        onPointerDown={(e) => {
          drawing.current = true;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
          scratch(e);
        }}
        onPointerMove={scratch}
        onPointerUp={() => {
          drawing.current = false;
          if (clearedRatio() > 0.5) onReveal();
        }}
        onPointerCancel={() => {
          drawing.current = false;
        }}
      />
    </div>
  );
}

const card =
  "rounded-[28px] bg-white/85 shadow-[0_20px_44px_-24px_rgba(61,37,48,0.45)] ring-1 ring-[#f0d6cf]";

export function ScratchRevealRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const [spots, setSpots] = useState([false, false, false]);
  const [round, setRound] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(2);
  const open = spots.every(Boolean);

  const theme: TemplateCustomization = {
    primaryColor: "#d46a7e",
    secondaryColor: "#c9a050",
    backgroundColor: "#fdf3ef",
    poeticLine: "«عشق آمد و شد چو خونم اندر رگ و پوست»",
    blessingLine: "حضور تو، شیرین‌ترین بخش این راز است.",
    dressCode: "شیک و رسمی؛ با رنگ‌های گرم و ملایم مثل رز و طلایی.",
    musicTitle: "ترانه‌ی ما",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const dayFa = formatEventDay(data.eventStartAt, data.timezone);
  const parts = datePartsOf(data.eventStartAt, data.timezone);
  const startTime = timeOf(data.eventStartAt, data.timezone);
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

  const reveal = (i: number) =>
    setSpots((s) => (s[i] ? s : s.map((v, j) => (j === i ? true : v))));
  const reset = () => {
    setSpots([false, false, false]);
    setRound((r) => r + 1);
  };

  const spotItems = [
    {
      label: "کِی؟",
      content: (
        <>
          <span className="text-[10px] text-[#a0788a]">{parts.weekday || "روز"}</span>
          <span className="text-[13px] font-bold leading-5 text-[#3d2530]">
            {parts.dayMonth || dayFa}
          </span>
        </>
      ),
    },
    {
      label: "کجا؟",
      content: (
        <>
          <MapPin className="h-4 w-4 text-[#d46a7e]" />
          <span className="mt-0.5 line-clamp-2 text-[12px] font-bold leading-5 text-[#3d2530]">
            {data.venueName || "به‌زودی"}
          </span>
        </>
      ),
    },
    {
      label: "ساعت؟",
      content: (
        <>
          <Clock className="h-4 w-4 text-[#d46a7e]" />
          <span className="mt-0.5 font-display text-xl font-bold text-[#3d2530]">
            {startTime || "—"}
          </span>
        </>
      ),
    },
  ];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden text-[#3d2530]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <style>{`
        @keyframes sr-burst {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), 520px) rotate(540deg); opacity: 0; }
        }
        @keyframes sr-shine { 0% { transform: translateX(120%); } 100% { transform: translateX(-120%); } }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,#fde7e1_0%,#fdf3ef_55%)]">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-[#fdf3ef]/85 px-5 backdrop-blur-lg">
          <span className="font-display text-xl font-bold text-[#d46a7e]">{monogram}</span>
          <span className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.2em] text-[#a0788a]">
            <Sparkles className="h-3.5 w-3.5 text-[#c9a050]" />
            یک راز شیرین
          </span>
        </header>

        <main className="relative flex flex-col pb-28">
          {/* Hero + scratch ticket */}
          <section className="relative px-5 pt-6 text-center">
            <p className="text-[12px] text-[#a0788a]">ما یه خبر خوب داریم…</p>
            <h1 className="mt-2 font-display text-[40px] font-bold leading-tight text-[#3d2530]">
              {data.partnerOneName}
              <span className="mx-2 text-[#d46a7e]">&</span>
              {data.partnerTwoName}
            </h1>
            <p className="mt-1 text-sm text-[#7a5a66]">
              {open ? "حالا که فهمیدی، منتظرتیم!" : "سه راز رو خراش بده تا بفهمی کی و کجا"}
            </p>

            <div className={`relative mx-auto mt-6 overflow-hidden p-5 ${card}`}>
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
                <span
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ animation: open ? undefined : "sr-shine 3.5s ease-in-out infinite" }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.25em] text-[#c9a050]">
                <span>LOVE TICKET</span>
                <span>№ ۰۰۱</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3" key={round}>
                {spotItems.map((s, i) => (
                  <ScratchSpot
                    key={s.label}
                    label={s.label}
                    revealed={spots[i]}
                    onReveal={() => reveal(i)}
                  >
                    {s.content}
                  </ScratchSpot>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                {spots.map((v, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${v ? "w-6 bg-[#d46a7e]" : "w-1.5 bg-[#ead1ca]"}`}
                  />
                ))}
              </div>
            </div>

            {!open ? (
              <div className="mt-5 flex flex-col items-center gap-2">
                <p className="flex items-center gap-1.5 text-[12px] text-[#7a5a66]">
                  <Hand className="h-4 w-4 animate-bounce text-[#d46a7e]" />
                  با انگشت روی دایره‌های طلایی بکش
                </p>
                <button
                  type="button"
                  onClick={() => setSpots([true, true, true])}
                  className="flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-[12px] font-semibold text-[#d46a7e] shadow-sm ring-1 ring-[#f0d6cf] transition hover:bg-white"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  خراش خودکار
                </button>
              </div>
            ) : null}

            {open ? (
              <div className="pointer-events-none absolute inset-x-0 top-24 z-30 h-0">
                {CONFETTI.map((c, i) => (
                  <span
                    key={`${round}-${i}`}
                    className={`absolute top-0 ${c.shape === 0 ? "h-2.5 w-1.5" : c.shape === 1 ? "h-2 w-2 rounded-full" : "h-1.5 w-3"}`}
                    style={
                      {
                        left: `${c.left}%`,
                        backgroundColor: c.color,
                        transform: `rotate(${c.rot}deg)`,
                        "--dx": `${c.dx}px`,
                        animation: `sr-burst 2.4s cubic-bezier(.2,.7,.4,1) ${c.delay}s both`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            ) : null}
          </section>

          {/* Revealed content */}
          <div
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-8 px-5 transition-all duration-1000 ease-out ${
              open
                ? "mt-10 translate-y-0 opacity-100"
                : "invisible pointer-events-none max-h-0 translate-y-10 overflow-hidden opacity-0"
            }`}
          >
            <section className={`p-6 text-center ${card}`}>
              <Heart className="mx-auto h-6 w-6 fill-[#d46a7e] text-[#d46a7e]" />
              <p className="mt-3 font-display text-[22px] leading-10 text-[#3d2530]">
                {theme.poeticLine}
              </p>
              <p className="mt-3 text-[13px] leading-7 text-[#7a5a66]">
                {data.invitationText ||
                  "با کمال شوق، شما را به جشن آغاز زندگی مشترکمان دعوت می‌کنیم."}
              </p>
              <p className="mt-4 rounded-2xl bg-[#fdf3ef] px-3 py-2 text-[13px] font-semibold text-[#3d2530]">
                {dayFa}
              </p>
            </section>

            {features?.music !== false ? (
              <section className="flex items-center gap-3 rounded-full bg-[#3d2530] p-2 pl-5 text-white shadow-lg">
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  aria-label="پخش موسیقی"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d46a7e] transition active:scale-90"
                >
                  {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                </button>
                <Music2 className="h-4 w-4 text-[#e8cf8a]" />
                <span className="flex-1 truncate text-sm">{theme.musicTitle}</span>
              </section>
            ) : null}

            {features?.countdown !== false && data.eventStartAt ? (
              <section>
                <h3 className="mb-3 text-center font-display text-2xl font-bold">چقدر مونده؟</h3>
                <Countdown
                  eventStartAt={data.eventStartAt}
                  className="[&_div]:rounded-3xl [&_div]:border-0 [&_div]:bg-white/85 [&_div]:py-4 [&_div]:shadow-[0_14px_30px_-20px_rgba(61,37,48,0.5)] [&_p:first-child]:font-display [&_p:first-child]:text-[28px] [&_p:first-child]:text-[#d46a7e] [&_p:last-child]:text-[11px] [&_p:last-child]:text-[#7a5a66]"
                />
              </section>
            ) : null}

            <section id="schedule" className={`scroll-mt-20 p-5 ${card}`}>
              <h3 className="mb-4 font-display text-2xl font-bold">برنامه‌ی شب</h3>
              <div className="space-y-3">
                {schedule.map((item, i) => (
                  <div key={`${item.time}-${item.title}`} className="flex items-center gap-3">
                    <span
                      className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-[12px] font-bold ${
                        i % 2 ? "bg-[#fdf3ef] text-[#d46a7e]" : "bg-[#d46a7e] text-white"
                      }`}
                    >
                      {item.time}
                    </span>
                    <div>
                      <p className="text-[15px] font-bold">{item.title}</p>
                      {item.description ? (
                        <p className="text-[12px] leading-6 text-[#7a5a66]">{item.description}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {showMap ? (
              <section id="location" className={`scroll-mt-20 p-5 ${card}`}>
                <h3 className="font-display text-2xl font-bold">{data.venueName || "محل جشن"}</h3>
                {data.venueAddress ? (
                  <p className="mt-1 flex items-start gap-1.5 text-[13px] leading-6 text-[#7a5a66]">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#d46a7e]" />
                    {data.venueAddress}
                  </p>
                ) : null}
                {query ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { href: `https://neshan.org/maps/search/${query}`, label: "نشان" },
                      { href: `https://balad.ir/search?query=${query}`, label: "بلد" },
                      { href: `https://www.google.com/maps/search/?api=1&query=${query}`, label: "گوگل" },
                    ].map((item, i) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-1 rounded-2xl py-2.5 text-xs font-semibold transition active:scale-95 ${
                          i === 0 ? "bg-[#3d2530] text-white" : "bg-[#fdf3ef] text-[#3d2530]"
                        }`}
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
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-2xl border border-[#f0d6cf] py-2.5 text-xs font-semibold text-[#d46a7e]"
                  >
                    <CalendarDays className="h-4 w-4" />
                    افزودن به تقویم
                  </a>
                ) : null}
              </section>
            ) : null}

            <section className={`p-5 ${card}`}>
              <h3 className="font-display text-2xl font-bold">چی بپوشم؟</h3>
              <p className="mt-1 text-[13px] leading-7 text-[#7a5a66]">{theme.dressCode}</p>
              <div className="mt-4 flex gap-4">
                {SWATCHES.map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <span
                      className="h-11 w-11 rounded-full shadow-md ring-4 ring-white"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[11px] text-[#7a5a66]">{s.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {features?.rsvp !== false ? (
              <section id="rsvp" className={`scroll-mt-20 p-5 ${card}`}>
                <h3 className="font-display text-2xl font-bold">میای؟</h3>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { value: true, label: "حتماً!", Icon: Check },
                    { value: false, label: "نمی‌تونم", Icon: X },
                  ].map(({ value, label, Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setAttending(value)}
                      className={`flex items-center justify-center gap-1.5 rounded-2xl py-3 text-sm font-bold transition ${
                        attending === value ? "bg-[#d46a7e] text-white shadow-md" : "bg-[#fdf3ef] text-[#7a5a66]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  className={`mt-3 flex items-center justify-between rounded-2xl bg-[#fdf3ef] px-4 py-3 transition ${
                    attending ? "" : "pointer-events-none opacity-35"
                  }`}
                >
                  <span className="text-[13px] font-semibold">تعداد نفرات</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#d46a7e] shadow-sm"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-display text-xl font-bold">
                      {guests.toLocaleString("fa-IR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(8, g + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d46a7e] text-white shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                {preview ? (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#3d2530] py-3.5 text-sm font-bold text-white">
                    <UserCheck className="h-4 w-4" />
                    ثبت پاسخ
                  </div>
                ) : (
                  <a
                    href="#rsvp"
                    className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#3d2530] py-3.5 text-sm font-bold text-white"
                  >
                    <UserCheck className="h-4 w-4" />
                    ثبت پاسخ
                  </a>
                )}
              </section>
            ) : null}

            <section className="rounded-[28px] bg-gradient-to-br from-[#d46a7e] to-[#a8475b] p-6 text-center text-white shadow-lg">
              <Gift className="mx-auto h-6 w-6 text-[#f3e0a8]" />
              <p className="mt-2 font-display text-lg leading-8">{theme.blessingLine}</p>
            </section>

            <button
              type="button"
              onClick={reset}
              className="mx-auto flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-[#7a5a66] shadow-sm ring-1 ring-[#f0d6cf]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              دوباره خراش بده
            </button>

            <footer className="pb-4 text-center">
              <p className="font-display text-2xl text-[#d46a7e]">{couple}</p>
              <p className="mt-1 text-[11px] text-[#a0788a]">با عشق، منتظر دیدارتان هستیم</p>
            </footer>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-16 max-w-md items-center justify-around border-t border-[#f0d6cf] bg-white/90 px-2 backdrop-blur-xl">
          {[
            { href: "#", label: "راز", Icon: Sparkles, active: true },
            { href: "#schedule", label: "برنامه", Icon: Clock },
            { href: "#location", label: "مسیر", Icon: MapPin },
            { href: "#rsvp", label: "حضور", Icon: UserCheck },
          ].map(({ href, label, Icon, active }) => (
            <a
              key={label}
              href={preview ? undefined : href}
              onClick={() => {
                if (href !== "#") setSpots([true, true, true]);
              }}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] font-semibold ${
                active ? "text-[#d46a7e]" : "text-[#a0788a] hover:text-[#3d2530]"
              }`}
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
