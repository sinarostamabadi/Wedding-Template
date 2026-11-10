"use client";

import {
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coffee,
  Feather,
  Flame,
  Gem,
  Heart,
  MapPin,
  Music2,
  Navigation,
  RotateCcw,
  Sparkles,
  Star,
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

const DEFAULT_COVER = "/images/templates/mirror-hall-cover.jpg";

const GOLD = "#e6c66e";
const CRYSTAL = "#dfe6ee";

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۸:۳۰",
    title: "ورود به تالار آینه",
    description: "پذیرایی با گلاب و شربت، زیر نور چراغ‌های بلور",
    icon: "cafe",
  },
  {
    time: "۲۰:۰۰",
    title: "سفره‌ی عقد و آینه‌ی بهشت",
    description: "پیمان پیوند، همراه با نوا و گل‌باران",
    icon: "heart",
  },
  {
    time: "۲۱:۳۰",
    title: "ضیافت شب",
    description: "شام تشریفاتی در نور چراغ‌های تالار",
    icon: "dining",
  },
  {
    time: "۲۳:۰۰",
    title: "رقص اول و جشن",
    description: "شادی تا پاسی از شب، زیر درخشش لوسترها",
    icon: "music",
  },
];

const PALETTE = [
  { color: "#dfe6ee", label: "بلور" },
  { color: "#e6c66e", label: "طلایی" },
  { color: "#3d2b52", label: "شبانه" },
  { color: "#f2ead6", label: "عاجی" },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** مسیر طاقی آینه — لبه‌ی درونی قاب */
const ARCH =
  "M26 370 L26 134 C26 64 74 36 150 28 C226 36 274 64 274 134 L274 370 Z";

/** شبکه‌ی تراشه‌های آینه — مثل آینه‌کاری ایرانی، تراشه‌به‌تراشه */
const FACETS = (() => {
  const rand = seeded(7717);
  const cols = 5;
  const rows = 8;
  const X0 = 30;
  const X1 = 270;
  const Y0 = 34;
  const Y1 = 366;
  const nodes: { x: number; y: number }[][] = [];
  for (let r = 0; r <= rows; r += 1) {
    const row: { x: number; y: number }[] = [];
    for (let c = 0; c <= cols; c += 1) {
      const inner = r > 0 && r < rows && c > 0 && c < cols;
      row.push({
        x: X0 + ((X1 - X0) * c) / cols + (inner ? (rand() - 0.5) * 18 : 0),
        y: Y0 + ((Y1 - Y0) * r) / rows + (inner ? (rand() - 0.5) * 18 : 0),
      });
    }
    nodes.push(row);
  }
  const tris: { points: string; shade: number; g: number; delay: number }[] =
    [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const a = nodes[r][c];
      const b = nodes[r][c + 1];
      const d = nodes[r + 1][c + 1];
      const e = nodes[r + 1][c];
      const t1 = rand();
      const t2 = rand();
      tris.push({
        points: `${a.x},${a.y} ${b.x},${b.y} ${d.x},${d.y}`,
        shade: t1,
        g: t1 < 0.45 ? 0 : t1 < 0.75 ? 1 : 2,
        delay: rand() * 850,
      });
      tris.push({
        points: `${a.x},${a.y} ${d.x},${d.y} ${e.x},${e.y}`,
        shade: t2,
        g: t2 < 0.45 ? 0 : t2 < 0.75 ? 1 : 2,
        delay: rand() * 850,
      });
    }
  }
  return tris;
})();

const SPARKS = (() => {
  const rand = seeded(1155);
  return Array.from({ length: 16 }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 1.6 + rand() * 2.4,
    duration: 2.6 + rand() * 3.2,
    delay: -rand() * 6,
    bright: rand() > 0.6,
  }));
})();

const RAYS = [
  { left: "6%", width: 120, rotate: -16, delay: "0s" },
  { left: "26%", width: 90, rotate: -6, delay: "0.8s" },
  { left: "52%", width: 130, rotate: 5, delay: "0.4s" },
  { left: "74%", width: 95, rotate: 14, delay: "1.2s" },
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

function mapsLinks(query: string) {
  const q = encodeURIComponent(query);
  return {
    neshan: `https://neshan.org/maps/search/${q}`,
    balad: `https://balad.ir/search?query=${q}`,
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
}

/** ستاره‌ی هشت‌پر خاتم‌کاری */
function Star8({
  size = 40,
  className = "",
  children,
}: {
  size?: number;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-[18%] bg-[linear-gradient(135deg,#f0dca0,#b3924e)] shadow-[0_0_16px_rgba(233,200,124,0.35)]" />
      <span className="absolute inset-0 rotate-45 rounded-[18%] bg-[linear-gradient(135deg,#f0dca0,#b3924e)] shadow-[0_0_16px_rgba(233,200,124,0.35)]" />
      {children ? (
        <span className="relative z-10 grid h-[64%] w-[64%] place-items-center rounded-full bg-[#241a30] text-[color:var(--mh-gold)]">
          {children}
        </span>
      ) : null}
    </span>
  );
}

/** آینه‌ی بزرگ تالار با تراشه‌های بلور و قاب خاتم */
function Mirror({
  uid,
  litCount,
  monogram,
}: {
  uid: string;
  litCount: number;
  monogram: string;
}) {
  const hallLit = litCount >= 3;
  const dim = (f: { shade: number }) => 0.1 + f.shade * 0.08;
  const bright = (f: { shade: number }) => 0.5 + f.shade * 0.42;

  return (
    <svg
      viewBox="0 0 300 400"
      aria-hidden
      className="h-auto w-full overflow-visible"
    >
      <defs>
        <pattern id={`${uid}-kh`} width="13" height="13" patternUnits="userSpaceOnUse">
          <rect width="13" height="13" fill="#241a30" />
          <g fill="#caa54e">
            <rect x="3.5" y="3.5" width="6" height="6" />
            <rect x="3.5" y="3.5" width="6" height="6" transform="rotate(45 6.5 6.5)" />
          </g>
        </pattern>
        <linearGradient id={`${uid}-f0`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef3f8" />
          <stop offset="1" stopColor="#c3cfdd" />
        </linearGradient>
        <linearGradient id={`${uid}-f1`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dce4ee" />
          <stop offset="1" stopColor="#a9b8ca" />
        </linearGradient>
        <linearGradient id={`${uid}-f2`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e7bb" />
          <stop offset="1" stopColor="#d3b264" />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6f35" />
          <stop offset="0.5" stopColor="#e9c87c" />
          <stop offset="1" stopColor="#9a7b3d" />
        </linearGradient>
        <radialGradient id={`${uid}-warm`} cx="0.5" cy="0.55" r="0.65">
          <stop offset="0" stopColor="#ffe9b0" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#ffdf9e" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffdf9e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff8dc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff8dc" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff8dc" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={ARCH} />
        </clipPath>
      </defs>

      {/* درون‌ی آینه: تراشه‌های بلور */}
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="0" y="0" width="300" height="400" fill="#171126" />
        {FACETS.map((f, i) => (
          <polygon
            key={i}
            points={f.points}
            fill={`url(#${uid}-f${f.g})`}
            stroke="#2a2138"
            strokeWidth="0.6"
            style={{
              opacity:
                dim(f) +
                (litCount / 3) * (bright(f) - dim(f)),
              transition: `opacity 1100ms cubic-bezier(0.22,1,0.36,1) ${f.delay}ms`,
            }}
          />
        ))}
        {/* نور گرمِ شمع‌ها روی آینه */}
        <ellipse
          cx="150"
          cy="210"
          rx="95"
          ry="115"
          fill={`url(#${uid}-warm)`}
          style={{
            opacity: 0.14 + (litCount / 3) * 0.6,
            transition: "opacity 900ms ease",
          }}
        />
        {/* موج درخشش پس از افروختن همه‌ی شمع‌ها */}
        {hallLit ? (
          <rect
            className="mh-sweep"
            x="-150"
            y="0"
            width="130"
            height="400"
            fill={`url(#${uid}-sheen)`}
          />
        ) : null}
        {/* نشانِ زوج در قلب آینه */}
        <g
          style={{
            opacity: hallLit ? 1 : 0,
            transition: "opacity 900ms ease 500ms",
          }}
        >
          <circle cx="150" cy="200" r="36" fill="#1c1526" opacity="0.8" />
          <circle
            cx="150"
            cy="200"
            r="36"
            fill="none"
            stroke="#e6c66e"
            strokeWidth="1.4"
            opacity="0.9"
          />
          <circle
            cx="150"
            cy="200"
            r="30"
            fill="none"
            stroke="#e6c66e"
            strokeWidth="0.6"
            opacity="0.5"
          />
          <text
            x="150"
            y="209"
            textAnchor="middle"
            style={{ fontFamily: "Amiri, serif", fontSize: 24 }}
            fill="#f0dca0"
          >
            {monogram}
          </text>
        </g>
      </g>

      {/* قاب خاتم‌کاری */}
      <path d={ARCH} fill="none" stroke={`url(#${uid}-kh)`} strokeWidth="18" />
      <path
        d="M17 379 L17 130 C17 56 72 27 150 19 C228 27 283 56 283 130 L283 379 Z"
        fill="none"
        stroke="#caa54e"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <path
        d="M34 362 L34 138 C34 72 76 45 150 37 C224 45 266 72 266 138 L266 362 Z"
        fill="none"
        stroke="#f4e3ae"
        strokeWidth="0.8"
        opacity="0.5"
      />
      {/* پنج‌های خاتم روی قاب */}
      {[
        [26, 92],
        [274, 92],
        [26, 224],
        [274, 224],
        [26, 330],
        [274, 330],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#e9c87c" stroke="#8a6f35" strokeWidth="1" />
      ))}
      {/* گره‌ی هشت‌پرِ سر طاق */}
      <g fill="#e9c87c">
        <rect x="144" y="3" width="12" height="12" rx="1.5" />
        <rect x="144" y="3" width="12" height="12" rx="1.5" transform="rotate(45 150 9)" />
      </g>
      {/* پایه‌ی آینه */}
      <rect x="96" y="372" width="108" height="9" rx="4" fill={`url(#${uid}-gold)`} />
      <rect x="120" y="381" width="60" height="5" rx="2.5" fill={`url(#${uid}-gold)`} opacity="0.8" />
    </svg>
  );
}

/** شمع‌دان طلایی سفره‌ی عقد */
function Candle({
  uid,
  lit,
  tall = false,
  onLight,
}: {
  uid: string;
  lit: boolean;
  tall?: boolean;
  onLight: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="افروختن شمع"
      aria-pressed={lit}
      disabled={lit}
      onClick={onLight}
      className={`group relative flex flex-col items-center outline-none transition-transform duration-300 ${
        tall ? "w-[92px]" : "w-[80px]"
      } ${lit ? "cursor-default" : "hover:-translate-y-1 active:translate-y-0"}`}
    >
      <svg viewBox="0 0 90 150" className={tall ? "h-[150px]" : "h-[124px]"}>
        <defs>
          <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8a6f35" />
            <stop offset="0.5" stopColor="#e9c87c" />
            <stop offset="1" stopColor="#9a7b3d" />
          </linearGradient>
          <radialGradient id={`${uid}-halo`}>
            <stop offset="0" stopColor="#ffd98a" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#ffcf7a" stopOpacity="0.22" />
            <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-flame`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.5" stopColor="#ffc85e" />
            <stop offset="1" stopColor="#e88a2e" />
          </linearGradient>
        </defs>

        {/* هاله‌ی نور */}
        <circle
          cx="45"
          cy="40"
          r="42"
          fill={`url(#${uid}-halo)`}
          className={lit ? "mh-halo" : "opacity-0"}
          style={{ transition: "opacity 700ms ease" }}
        />

        {/* شعله */}
        {lit ? (
          <g
            className="mh-flicker"
            style={{ transformOrigin: "45px 50px", transformBox: "view-box" }}
          >
            <path
              d="M45 22 C53 32 51 44 45 49 C39 44 37 32 45 22 Z"
              fill={`url(#${uid}-flame)`}
            />
            <path d="M45 32 C48 37 47.5 43 45 46 C42.5 43 42 37 45 32 Z" fill="#fff7d6" opacity="0.9" />
          </g>
        ) : (
          <path d="M45 44 L45 49" stroke="#7a6a58" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* موم شمع */}
        <rect x="33" y="48" width="24" height="34" rx="6" fill="#f2ead6" />
        <path d="M33 54 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 v28 h-24 z" fill="#f7f1df" opacity="0.8" />

        {/* پیاله، ساقه و پایه */}
        <path d="M28 84 h34 l-6 10 h-22 z" fill={`url(#${uid}-gold)`} />
        <rect x="41" y="93" width="8" height="28" rx="3" fill={`url(#${uid}-gold)`} />
        <rect x="36" y="104" width="18" height="4" rx="2" fill={`url(#${uid}-gold)`} />
        <ellipse cx="45" cy="128" rx="26" ry="7" fill={`url(#${uid}-gold)`} />
        <ellipse cx="45" cy="126" rx="20" ry="5" fill="#3a2d1a" opacity="0.35" />
      </svg>

      {!lit ? (
        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-[#b7a9c6]/70 transition-colors group-hover:text-[color:var(--mh-gold)]">
          <Flame className="h-3 w-3" />
          بیفروزید
        </span>
      ) : null}
    </button>
  );
}

export function MirrorHallRenderer({
  data,
  customization,
  features,
  preview,
}: TemplateRendererProps) {
  const uid = useId().replace(/:/g, "");
  const [lit, setLit] = useState<boolean[]>([false, false, false]);
  const litCount = lit.filter(Boolean).length;
  const hallLit = litCount >= 3;

  const theme: TemplateCustomization = {
    primaryColor: "#e6c66e",
    secondaryColor: "#dfe6ee",
    backgroundColor: "#191321",
    poeticLine:
      "«سال‌ها دل طلبِ جامِ جم از ما می‌کرد، و آنچه خود داشت ز بیگانه تمنا می‌کرد»",
    dressCode:
      "پوشش رسمی شب با تم بلور و طلایی. خواهشمندیم بانوان محترم به احترام عروس، از لباس کاملاً سفید پرهیز نمایند.",
    blessingLine: "حضور گرمِ شما، روشن‌ترین چراغِ این تالار است",
    musicTitle: "نوای سه‌تار و عود",
    schedule: DEFAULT_SCHEDULE,
    ...customization,
  };

  const couple = coupleLabel(data.partnerOneName, data.partnerTwoName);
  const monogram = coupleMonogram(data.partnerOneName, data.partnerTwoName);
  const cover = data.coverImageUrl || data.gallery?.[0] || DEFAULT_COVER;
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
  const schedule = theme.schedule?.length ? theme.schedule : DEFAULT_SCHEDULE;
  const showCountdown = features?.countdown !== false && !!data.eventStartAt;
  const showMap =
    features?.map !== false &&
    !!(data.venueName || data.venueAddress || data.mapUrl);
  const showMusic = features?.music !== false;
  const locationQuery =
    data.mapUrl ||
    [data.venueName, data.venueAddress].filter(Boolean).join(" ") ||
    "";
  const links = locationQuery ? mapsLinks(locationQuery) : null;

  const lightCandle = (i: number) => {
    if (lit[i]) return;
    setLit((prev) => prev.map((v, j) => (j === i ? true : v)));
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden font-sans text-[#e9e4ef]"
      style={
        {
          backgroundColor: theme.backgroundColor,
          "--mh-gold": theme.primaryColor || GOLD,
          "--mh-crystal": theme.secondaryColor || CRYSTAL,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes mh-twinkle { 0%,100% { opacity: .18; transform: scale(.72); } 50% { opacity: .95; transform: scale(1.12); } }
        @keyframes mh-flicker { 0%,100% { transform: scaleY(1); opacity: 1; } 35% { transform: scaleY(1.12); opacity: .92; } 65% { transform: scaleY(.9); opacity: .97; } }
        @keyframes mh-halo { 0%,100% { opacity: .8; } 50% { opacity: 1; } }
        @keyframes mh-sweep { 0% { transform: translateX(0); } 55%,100% { transform: translateX(450px); } }
        @keyframes mh-vu { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        @keyframes mh-ray { 0%,100% { opacity: .7; transform: rotate(var(--mh-rot,0deg)) scaleX(1); } 50% { opacity: 1; transform: rotate(var(--mh-rot,0deg)) scaleX(1.12); } }
      `}</style>

      {/* فضای تالار: درخشش گنبد، اشعه‌ها و غبار درخشان */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-48 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,200,124,0.24),transparent_65%)] blur-2xl"
          style={{ opacity: 0.35 + litCount * 0.22, transition: "opacity 1200ms ease" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#0e0a14]/90 to-transparent"
        />
        {RAYS.map((r, i) => (
          <span
            key={`ray-${i}`}
            className="mh-ray absolute -top-24 h-[420px] rounded-[50%]"
            style={
              {
                left: r.left,
                width: r.width,
                background:
                  "linear-gradient(180deg, rgba(246,229,179,0.16), transparent 70%)",
                "--mh-rot": `${r.rotate}deg`,
                transform: `rotate(${r.rotate}deg)`,
                animationDelay: r.delay,
                opacity: litCount > 0 ? 0.08 + litCount * 0.09 : 0,
                transition: "opacity 1200ms ease",
              } as CSSProperties
            }
          />
        ))}
        <div style={{ opacity: 0.45 + litCount * 0.18, transition: "opacity 1200ms ease" }}>
          {SPARKS.map((s, i) => (
            <span
              key={`spark-${i}`}
              className="absolute rounded-full bg-[#f2e8cf]"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                opacity: s.bright ? 0.8 : 0.35,
                boxShadow: s.bright ? "0 0 7px 1.5px rgba(246,236,212,.5)" : "none",
                animation: `mh-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-md flex-col">
        {/* سربرگ چسبان — پس از روشن شدن تالار */}
        <header
          className={`sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#e6c66e]/10 bg-[#191321]/80 px-4 backdrop-blur-xl transition-all duration-700 ${
            hallLit
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-full opacity-0"
          }`}
        >
          <Star8 size={34}>
            <Gem className="h-3.5 w-3.5" />
          </Star8>
          <div className="flex flex-col items-center">
            <span className="font-display text-xl tracking-widest text-[color:var(--mh-gold)]">
              {monogram}
            </span>
            <span className="-mt-1 text-[10px] font-medium tracking-[0.22em] text-[#b7a9c6]">
              تالار آینه
            </span>
          </div>
          <Star8 size={34}>
            <Flame className="h-3.5 w-3.5" />
          </Star8>
        </header>

        {/* صحنه‌ی گشودن: آینه‌ی تالار و شمع‌های سفره‌ی عقد */}
        <section className="relative overflow-hidden">
          <div className="flex flex-col items-center px-5 pb-8 pt-12 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e6c66e]/25 bg-[#e6c66e]/[0.08] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[color:var(--mh-gold)]">
              <Gem className="h-3.5 w-3.5" />
              دعوت‌نامه‌ی تالار آینه
            </span>
            <h1 className="mt-4 font-display text-3xl leading-snug text-[#f2ead6]">
              جشن پیوندِ{" "}
              <span className="text-[color:var(--mh-gold)]">{couple}</span>
            </h1>
            <p className="mt-1.5 text-xs tracking-wide text-[#b7a9c6]">
              شبی درخشان در تالارِ آینه و نور
            </p>

            {/* آینه‌ی بزرگ */}
            <div
              className="relative mt-7 w-[290px] transition-transform duration-1000"
              style={{ transform: hallLit ? "scale(1)" : "scale(0.97)" }}
            >
              <Mirror uid={uid} litCount={litCount} monogram={monogram} />
              {/* بازتاب آینه روی زمین */}
              <div
                className="mx-auto mt-1 h-6 w-[70%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(233,200,124,0.28),transparent_70%)] blur-[6px]"
                style={{ opacity: 0.15 + litCount * 0.28, transition: "opacity 900ms ease" }}
              />
            </div>

            {/* شمع‌های سفره‌ی عقد */}
            <div className="mt-4 flex items-end justify-center gap-4">
              <Candle uid={`${uid}-c0`} lit={lit[0]} onLight={() => lightCandle(0)} />
              <Candle uid={`${uid}-c1`} lit={lit[1]} tall onLight={() => lightCandle(1)} />
              <Candle uid={`${uid}-c2`} lit={lit[2]} onLight={() => lightCandle(2)} />
            </div>

            {/* راهنما یا دکمه‌های پس از روشن شدن */}
            <div
              className={`relative z-10 mt-5 flex justify-center transition-all duration-500 ${
                hallLit ? "pointer-events-none -translate-y-2 opacity-0" : "opacity-100"
              }`}
            >
              <span className="flex animate-bounce items-center gap-1.5 rounded-full border border-[#e6c66e]/25 bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-[color:var(--mh-gold)] backdrop-blur">
                <Flame className="h-3.5 w-3.5" />
                برای روشن کردن تالار، شمع‌ها را بیفروزید
              </span>
            </div>

            {hallLit ? (
              <div className="relative z-10 mt-4 flex animate-[fade-up_0.7s_cubic-bezier(0.22,1,0.36,1)_both] items-center justify-center gap-3">
                <a
                  href="#ceremony-details"
                  className="flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#f0dca0,#c8a24e)] px-5 py-2.5 text-sm font-semibold text-[#221a08] shadow-[0_10px_26px_rgba(233,200,124,0.35)] transition hover:brightness-105"
                >
                  <ArrowDown className="h-4 w-4" />
                  مشاهده جزئیات جشن
                </a>
                <button
                  type="button"
                  onClick={() => setLit([false, false, false])}
                  className="flex items-center gap-1.5 rounded-full border border-[#e6c66e]/30 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-[#c3bdd3] backdrop-blur transition hover:text-[#f2ead6]"
                >
                  <RotateCcw className="h-4 w-4" />
                  خاموش کردن شمع‌ها
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* نامه‌ی تالار — پس از روشن شدن شمع‌ها */}
        <div
          className={`flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hallLit
              ? "translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 translate-y-6 overflow-hidden opacity-0"
          }`}
        >
          {/* پرتره‌ی زوج در قاب خاتم و شعر */}
          <section className="flex flex-col items-center px-5 pt-8 text-center">
            <div className="relative w-full max-w-[290px]">
              <span className="absolute -top-6 left-1/2 z-10 -translate-x-1/2">
                <Star8 size={52}>
                  <span className="font-display text-base font-bold tracking-widest">
                    {monogram}
                  </span>
                </Star8>
              </span>
              <div className="rounded-t-full border-[3px] border-[#caa54e]/60 bg-[#241a30] p-2 shadow-[0_18px_44px_rgba(0,0,0,0.4)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-full ring-1 ring-[#f4e3ae]/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={couple}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241a30]/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-3 text-center">
                    <p className="font-display text-xl text-[#f2ead6]">{couple}</p>
                    <p className="mt-0.5 text-[10px] font-semibold tracking-[0.22em] text-[color:var(--mh-gold)]">
                      جشنِ پیوند
                    </p>
                  </div>
                </div>
              </div>
              <span className="absolute -bottom-1 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#e6c66e]/40 bg-[#241a30]">
                <Star className="h-3 w-3 text-[color:var(--mh-gold)]" />
              </span>
              <span className="absolute -bottom-1 left-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#e6c66e]/40 bg-[#241a30]">
                <Star className="h-3 w-3 text-[color:var(--mh-gold)]" />
              </span>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[color:var(--mh-gold)]">
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#e6c66e]/70" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#e6c66e]/70" />
            </div>
            <p className="mt-4 max-w-sm font-display text-[1.45rem] leading-[2.1rem] text-[color:var(--mh-gold)]">
              {theme.poeticLine}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-8 text-[#c3bdd3]">
              {data.invitationText ||
                "شما با کمال مهر و افتخار به تالار پیوند ما فراخوانده شده‌اید"}
            </p>
          </section>

          {/* موسیقی تالار */}
          {showMusic ? (
            <section className="px-5 pt-8">
              <div className="flex items-center justify-between rounded-2xl border border-[#e6c66e]/15 bg-white/[0.04] p-3.5 backdrop-blur-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f0dca0,#b3924e)] text-[#241a30] shadow-[0_8px_22px_rgba(233,200,124,0.3)]">
                    <Music2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#f2ead6]">
                      {theme.musicTitle}
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e6c66e]" />
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#b7a9c6]">
                      نوازندگانِ شبِ ما
                    </p>
                  </div>
                </div>
                <div className="flex h-6 items-end gap-1 px-1">
                  {[3, 5, 4, 6, 3].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 origin-bottom rounded-full bg-[#e6c66e]/70"
                      style={{
                        height: `${h * 4}px`,
                        animation: `mh-vu ${1 + i * 0.17}s ease-in-out ${i * 0.11}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {/* تاریخ و شمارش معکوس */}
          {showCountdown ? (
            <section
              id="ceremony-details"
              className="flex scroll-mt-20 flex-col items-center px-5 pt-8 text-center"
            >
              <div className="mb-2 flex items-center gap-2 text-[color:var(--mh-gold)]">
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#e6c66e]/70" />
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] font-semibold tracking-[0.18em]">
                  تا روشن شدن چراغ‌های پیوند
                </span>
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#e6c66e]/70" />
              </div>
              <p className="font-display text-xl text-[#f2ead6]">{dayLabel}</p>
              {timeLabel ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#b7a9c6]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {timeLabel}
                </p>
              ) : null}
              <Countdown
                eventStartAt={data.eventStartAt!}
                className="mt-4 w-full [&_div]:rounded-xl [&_div]:border [&_div]:border-[#e6c66e]/20 [&_div]:bg-white/[0.05] [&_div]:backdrop-blur-sm [&_p:first-child]:font-display [&_p:first-child]:text-[22px] [&_p:first-child]:font-semibold [&_p:first-child]:text-[color:var(--mh-gold)] [&_p:last-child]:text-[10px] [&_p:last-child]:text-[#b7a9c6]"
              />
              {calendarHref ? (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#e6c66e]/25 bg-[#e6c66e]/[0.06] px-4 py-2 text-xs font-medium text-[color:var(--mh-gold)] transition hover:bg-[#e6c66e]/[0.12]"
                >
                  <CalendarDays className="h-4 w-4" />
                  افزودن به تقویم گوگل و اپل
                </a>
              ) : null}
            </section>
          ) : (
            <span id="ceremony-details" />
          )}

          {/* برنامه‌ی شبِ تالار */}
          <section className="px-5 pt-9">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-[color:var(--mh-gold)]">
                برنامه‌ی شبِ تالار
              </h2>
              <span className="rounded-full border border-[#e6c66e]/20 bg-[#e6c66e]/[0.07] px-2.5 py-1 text-[10px] font-semibold text-[#b7a9c6]">
                از غروب تا سپیده‌دم
              </span>
            </div>
            <div className="relative rounded-2xl border border-[#e6c66e]/15 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="absolute bottom-6 right-[41px] top-6 w-px bg-[repeating-linear-gradient(180deg,rgba(233,200,124,0.5)_0_6px,transparent_6px_12px)]" />
              <div className="flex flex-col gap-6">
                {schedule.map((item) => {
                  const Icon = scheduleIcon(item.icon);
                  return (
                    <div
                      key={`${item.time}-${item.title}`}
                      className="relative z-10 flex items-start gap-4"
                    >
                      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] rotate-45 border border-[#e6c66e]/40 bg-[#241a30] shadow-[0_0_16px_rgba(233,200,124,0.16)]">
                        <Icon className="h-[18px] w-[18px] -rotate-45 text-[color:var(--mh-gold)]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-sm font-semibold text-[#f2ead6]">
                            {item.title}
                          </h3>
                          <span className="shrink-0 rounded-full bg-[#e6c66e]/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-[color:var(--mh-gold)]">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-6 text-[#b7a9c6]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* محل برگزاری */}
          {showMap ? (
            <section id="location" className="scroll-mt-20 px-5 pt-9">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-[color:var(--mh-gold)]">
                  محل برگزاری
                </h2>
                {data.venueName ? (
                  <span className="text-xs font-medium text-[#b7a9c6]">
                    {data.venueName}
                  </span>
                ) : null}
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#e6c66e]/15 bg-white/[0.04] backdrop-blur-sm">
                <div className="relative flex h-40 items-end justify-start bg-[linear-gradient(140deg,#241a30_0%,#3d2b52_60%,#574070_100%)] p-3">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 30%, rgba(246,229,179,.14) 0%, transparent 22%), radial-gradient(circle at 72% 22%, rgba(246,229,179,.12) 0%, transparent 18%), radial-gradient(circle at 42% 68%, rgba(246,229,179,.1) 0%, transparent 20%)",
                    }}
                  />
                  <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#191321]/70 px-3 py-1.5 text-[11px] font-semibold text-[color:var(--mh-gold)] ring-1 ring-[#e6c66e]/30 backdrop-blur">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.venueName || "محل مراسم"}
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div>
                    {data.venueName ? (
                      <h3 className="text-sm font-semibold text-[#f2ead6]">
                        {data.venueName}
                      </h3>
                    ) : null}
                    {data.venueAddress ? (
                      <p className="mt-1 text-xs leading-6 text-[#b7a9c6]">
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
                          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#e6c66e]/15 bg-[#191321]/60 p-2.5 text-[#f2ead6] transition hover:border-[#e6c66e]/40 hover:bg-[#241a30]"
                        >
                          <Navigation className="h-4 w-4 text-[color:var(--mh-gold)]" />
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

          {/* پوشش مهمانان */}
          <section className="px-5 pt-9">
            <div className="rounded-2xl border border-[#e6c66e]/15 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Star8 size={40} className="mt-0.5 shrink-0">
                  <Gem className="h-4 w-4" />
                </Star8>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#f2ead6]">
                    پوشش مهمانان (Dress Code)
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#b7a9c6]">
                    {theme.dressCode}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {PALETTE.map((s) => (
                      <span
                        key={s.label}
                        className="flex items-center gap-1.5 rounded-full bg-[#191321]/60 px-2.5 py-1 text-[10px] text-[#c3bdd3] ring-1 ring-white/10"
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full ring-1 ring-white/25"
                          style={{ backgroundColor: s.color }}
                        />
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* اعلام حضور */}
          {features?.rsvp !== false ? (
            <section id="rsvp" className="scroll-mt-20 px-5 pt-9">
              <div className="relative overflow-hidden rounded-2xl border border-[#e6c66e]/25 bg-[linear-gradient(165deg,rgba(233,200,124,0.1),rgba(255,255,255,0.03))] p-5 text-center backdrop-blur-sm">
                <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#e6c66e]/15 blur-2xl" />
                <Star8 size={48} className="mx-auto mb-3">
                  <Feather className="h-4 w-4" />
                </Star8>
                <h2 className="font-display text-xl text-[color:var(--mh-gold)]">
                  اعلام حضور در شبِ پیوند
                </h2>
                <p className="mt-1.5 text-xs leading-6 text-[#b7a9c6]">
                  آیا نورِ حضورتان را در تالارِ ما خواهیم داشت؟
                </p>
                {preview ? (
                  <div className="mt-4 flex flex-col gap-2.5 text-right">
                    <div className="flex w-full items-center justify-between rounded-xl border border-[#e6c66e]/40 bg-[#e6c66e]/10 p-3.5">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-[color:var(--mh-gold)]" />
                        <span className="text-sm font-semibold text-[#f2ead6]">
                          با افتخار همراه شما هستیم
                        </span>
                      </div>
                      <span className="h-4 w-4 rounded-full border border-[#e6c66e]/60 bg-[#e6c66e]" />
                    </div>
                    <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <div className="flex items-center gap-2.5">
                        <XCircle className="h-5 w-5 text-[#b7a9c6]" />
                        <span className="text-sm font-medium text-[#c3bdd3]">
                          متأسفانه امکان حضور ندارم
                        </span>
                      </div>
                      <span className="h-4 w-4 rounded-full border border-white/25" />
                    </div>
                  </div>
                ) : (
                  <a
                    href="#rsvp"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f0dca0,#c8a24e)] py-3.5 text-sm font-semibold text-[#221a08] shadow-[0_12px_28px_rgba(233,200,124,0.35)] transition hover:brightness-105"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    ثبت و تأیید نهایی حضور
                  </a>
                )}
              </div>
            </section>
          ) : null}

          {/* دعای پایانی */}
          <footer className="flex flex-col items-center gap-3 px-5 pb-28 pt-10 text-center">
            <Star8 size={56}>
              <Flame className="h-5 w-5" />
            </Star8>
            <p className="max-w-sm font-display text-xl leading-relaxed text-[color:var(--mh-gold)]">
              {theme.blessingLine}
            </p>
            <p className="text-xs text-[#b7a9c6]">
              چشم‌انتظارِ دیدارِ روی ماهتان هستیم
            </p>
            <div className="mt-2 flex items-center gap-2 text-[#c3bdd3]">
              <span className="h-px w-8 bg-[#e6c66e]/30" />
              <Sparkles className="h-3.5 w-3.5 text-[#e6c66e]/70" />
              <span className="text-sm font-semibold">{couple}</span>
              <Sparkles className="h-3.5 w-3.5 text-[#e6c66e]/70" />
              <span className="h-px w-8 bg-[#e6c66e]/30" />
            </div>
          </footer>
        </div>
      </div>

      {/* منوی پایین */}
      {hallLit ? (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-16 w-full max-w-md items-center justify-around border-t border-[#e6c66e]/15 bg-[#120d1a]/90 px-2 backdrop-blur-xl">
          {[
            { href: "#ceremony-details", label: "جزئیات جشن", icon: Sparkles },
            { href: "#location", label: "مکان", icon: MapPin },
            { href: "#rsvp", label: "اعلام حضور", icon: Feather },
          ].map((item) => (
            <a
              key={item.href}
              href={preview ? undefined : item.href}
              className="flex min-h-[44px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[10px] font-medium text-[#b7a9c6] transition hover:text-[color:var(--mh-gold)]"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}




