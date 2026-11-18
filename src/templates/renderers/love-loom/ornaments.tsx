"use client";

import type { ReactNode } from "react";

/** الگوها و نقش‌های فرش — همه‌چیز SVG دست‌ساز، بدون عکس آماده */

export function CarpetPatterns({ uid }: { uid: string }) {
  return (
    <defs>
      {/* لاکی کاشان */}
      <pattern
        id={`${uid}-lacquer`}
        width="18"
        height="18"
        patternUnits="userSpaceOnUse"
      >
        <rect width="18" height="18" fill="#7a1826" />
        <path
          d="M9 1.5 L16.5 9 L9 16.5 L1.5 9 Z"
          fill="none"
          stroke="#c4a35a"
          strokeWidth="0.7"
        />
        <circle cx="9" cy="9" r="1.6" fill="#f3eee6" />
        <path
          d="M9 4.2 L11.8 9 L9 13.8 L6.2 9 Z"
          fill="#9e2434"
          stroke="#c4a35a"
          strokeWidth="0.35"
        />
      </pattern>

      {/* لاجورد تبریز */}
      <pattern
        id={`${uid}-lapis`}
        width="16"
        height="14"
        patternUnits="userSpaceOnUse"
      >
        <rect width="16" height="14" fill="#15233d" />
        <path
          d="M8 1.2 L9.4 5.2 L13.6 5.2 L10.2 7.7 L11.5 11.7 L8 9.3 L4.5 11.7 L5.8 7.7 L2.4 5.2 L6.6 5.2 Z"
          fill="#c4a35a"
          fillOpacity="0.85"
        />
        <circle cx="8" cy="7" r="1.1" fill="#f3eee6" fillOpacity="0.55" />
      </pattern>

      {/* زرِ کارگاه */}
      <pattern
        id={`${uid}-gold`}
        width="22"
        height="12"
        patternUnits="userSpaceOnUse"
      >
        <rect width="22" height="12" fill="#d8b96a" />
        <path
          d="M2 6 C5 2, 8 2, 11 6 C8 10, 5 10, 2 6 Z"
          fill="#8b1e2d"
          fillOpacity="0.55"
        />
        <path
          d="M11 6 C14 2, 17 2, 20 6 C17 10, 14 10, 11 6 Z"
          fill="#1a2744"
          fillOpacity="0.35"
        />
        <circle cx="11" cy="6" r="1.2" fill="#faf6f0" />
      </pattern>

      {/* حنایی اصفهان */}
      <pattern
        id={`${uid}-henna`}
        width="14"
        height="14"
        patternUnits="userSpaceOnUse"
      >
        <rect width="14" height="14" fill="#a8522e" />
        <rect
          x="1"
          y="1"
          width="12"
          height="12"
          fill="none"
          stroke="#f3eee6"
          strokeWidth="0.55"
          strokeOpacity="0.55"
        />
        <path
          d="M7 2.5 C9.5 4.5, 9.5 7, 7 11 C4.5 7, 4.5 4.5, 7 2.5 Z"
          fill="#f3eee6"
          fillOpacity="0.75"
        />
        <circle cx="7" cy="6.2" r="1" fill="#7a1826" />
      </pattern>

      {/* فیروزه کرمان */}
      <pattern
        id={`${uid}-turquoise`}
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect width="20" height="20" fill="#2a6b63" />
        <circle
          cx="10"
          cy="10"
          r="6.5"
          fill="none"
          stroke="#c4a35a"
          strokeWidth="0.7"
        />
        <path
          d="M10 4.5 L11.2 8.2 L15 8.2 L12 10.5 L13.1 14.2 L10 12 L6.9 14.2 L8 10.5 L5 8.2 L8.8 8.2 Z"
          fill="#f3eee6"
          fillOpacity="0.7"
        />
      </pattern>

      {/* شیری پشم */}
      <pattern
        id={`${uid}-ivory`}
        width="12"
        height="12"
        patternUnits="userSpaceOnUse"
      >
        <rect width="12" height="12" fill="#f0e7d8" />
        <circle cx="3" cy="3" r="0.9" fill="#8b1e2d" fillOpacity="0.35" />
        <circle cx="9" cy="7" r="0.9" fill="#1a2744" fillOpacity="0.28" />
        <path
          d="M6 1.5 L7.2 4.5 L10.5 4.5 L7.9 6.4 L8.9 9.6 L6 7.8 L3.1 9.6 L4.1 6.4 L1.5 4.5 L4.8 4.5 Z"
          fill="#c4a35a"
          fillOpacity="0.55"
        />
      </pattern>

      <linearGradient id={`${uid}-silk`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#faf6f0" />
        <stop offset="45%" stopColor="#e8d9b8" />
        <stop offset="100%" stopColor="#f3eee6" />
      </linearGradient>

      <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="6"
          stdDeviation="5"
          floodColor="#1a2744"
          floodOpacity="0.22"
        />
      </filter>
    </defs>
  );
}

/** نقشه‌ی ایران با استان‌نمای فرش‌بافت (مسیر ساده‌شده‌ی دقیق‌نمای) */
export function IranCarpetMap({
  uid,
  className = "",
}: {
  uid: string;
  className?: string;
}) {
  /* سیلوئت خوانای ایران: شمال خزری، شرق خراسان، جنوب‌شرق مکران، خلیج فارس */
  const iran =
    "M 92 108 L 108 78 L 138 58 L 175 48 L 210 52 L 242 68 L 268 92 L 288 118 L 302 148 L 310 182 L 308 218 L 298 252 L 286 286 L 275 312 L 262 338 L 240 358 L 212 368 L 188 362 L 168 342 L 152 318 L 138 292 L 118 268 L 98 248 L 82 222 L 72 192 L 68 162 L 72 136 L 80 120 Z";

  return (
    <svg
      viewBox="0 0 360 420"
      className={className}
      role="img"
      aria-label="نقشه‌ی فرش‌بافت ایران"
    >
      <CarpetPatterns uid={uid} />
      <defs>
        <clipPath id={`${uid}-iran-clip`}>
          <path d={iran} />
        </clipPath>
      </defs>

      <ellipse
        cx="190"
        cy="392"
        rx="105"
        ry="9"
        fill="#1a2744"
        fillOpacity="0.12"
      />

      {/* دریای خزر (شمال) */}
      <path
        d="M 145 42 Q 190 28 235 48"
        fill="none"
        stroke="#2a6b63"
        strokeWidth="2"
        strokeOpacity="0.45"
        strokeLinecap="round"
      />
      <text
        x="190"
        y="36"
        textAnchor="middle"
        fill="#2a6b63"
        fontSize="7"
        fontFamily="Tahoma, sans-serif"
        opacity="0.7"
      >
        خزر
      </text>

      {/* خلیج فارس (جنوب) */}
      <path
        d="M 115 375 Q 165 392 220 378"
        fill="none"
        stroke="#1a2744"
        strokeWidth="1.6"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
      <text
        x="168"
        y="402"
        textAnchor="middle"
        fill="#1a2744"
        fontSize="6.5"
        fontFamily="Tahoma, sans-serif"
        opacity="0.55"
      >
        خلیج فارس
      </text>

      <g filter={`url(#${uid}-soft)`}>
        {/* لایه‌های استانی داخل کلیپ نقشه */}
        <g clipPath={`url(#${uid}-iran-clip)`}>
          <rect x="60" y="40" width="100" height="160" fill={`url(#${uid}-lapis)`} />
          <rect x="140" y="40" width="110" height="90" fill={`url(#${uid}-turquoise)`} />
          <rect x="140" y="110" width="100" height="130" fill={`url(#${uid}-lacquer)`} />
          <rect x="230" y="70" width="100" height="160" fill={`url(#${uid}-gold)`} />
          <rect x="180" y="220" width="130" height="140" fill={`url(#${uid}-henna)`} />
          <rect x="90" y="220" width="110" height="150" fill={`url(#${uid}-ivory)`} />
          <rect x="60" y="160" width="90" height="120" fill={`url(#${uid}-lacquer)`} />
          {/* خطوط استانی ظریف */}
          <path
            d="M140 58 V350 M220 70 V340 M100 160 H300 M120 230 H280 M160 290 H250"
            fill="none"
            stroke="#faf6f0"
            strokeWidth="1.4"
            strokeOpacity="0.75"
          />
        </g>

        {/* خط مرز سفید */}
        <path
          d={iran}
          fill="none"
          stroke="#faf6f0"
          strokeWidth="3.2"
        />
        <path
          d={iran}
          fill="none"
          stroke="#c4a35a"
          strokeWidth="1.4"
        />
      </g>

      {/* نشان تهران */}
      <circle cx="188" cy="155" r="5.5" fill="#c4a35a" />
      <circle cx="188" cy="155" r="2.4" fill="#faf6f0" />
      <text
        x="188"
        y="147"
        textAnchor="middle"
        fill="#8b1e2d"
        fontSize="9"
        fontFamily="Georgia, serif"
      >
        ♥
      </text>
    </svg>
  );
}

/** واژه‌ی IRAN با هندسه‌ی فرش و طاق آزادی در حرف A — بدون عکس */
export function IranWordmark({
  uid,
  className = "",
}: {
  uid: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 78"
      className={className}
      role="img"
      aria-label="IRAN"
    >
      <CarpetPatterns uid={`${uid}-wm`} />

      {/* I */}
      <rect
        x="12"
        y="8"
        width="32"
        height="62"
        rx="4"
        fill={`url(#${uid}-wm-lacquer)`}
        stroke="#c4a35a"
        strokeWidth="1.4"
      />
      <rect x="17" y="12" width="22" height="5" rx="1" fill="#faf6f0" fillOpacity="0.4" />
      <rect x="17" y="61" width="22" height="5" rx="1" fill="#faf6f0" fillOpacity="0.4" />

      {/* R */}
      <rect
        x="56"
        y="8"
        width="20"
        height="62"
        rx="2"
        fill={`url(#${uid}-wm-lapis)`}
        stroke="#c4a35a"
        strokeWidth="1.2"
      />
      <path
        d="M76 10 H102 Q118 10 118 30 Q118 48 102 48 H76 Z"
        fill={`url(#${uid}-wm-gold)`}
        stroke="#c4a35a"
        strokeWidth="1.2"
      />
      <path
        d="M84 46 V26 Q84 18 95 18 Q106 18 106 26 V46"
        fill="none"
        stroke="#1a2744"
        strokeWidth="1.5"
      />
      <path
        d="M76 48 L116 70"
        stroke="#8b1e2d"
        strokeWidth="6"
        strokeLinecap="butt"
      />

      {/* A — طاق آزادی */}
      <path
        d="M132 70 L162 8 L192 70 Z"
        fill={`url(#${uid}-wm-ivory)`}
        stroke="#c4a35a"
        strokeWidth="1.5"
      />
      <path
        d="M147 70 V40 Q147 26 162 26 Q177 26 177 40 V70"
        fill="#1a2744"
      />
      <path
        d="M153 70 V42 Q153 32 162 32 Q171 32 171 42 V70"
        fill="none"
        stroke="#c4a35a"
        strokeWidth="1.2"
      />
      <rect x="150" y="52" width="24" height="2.5" fill="#c4a35a" />
      <rect x="152" y="58" width="20" height="1.5" fill="#c4a35a" fillOpacity="0.7" />

      {/* N — موزاییک */}
      <rect
        x="208"
        y="8"
        width="20"
        height="62"
        rx="2"
        fill={`url(#${uid}-wm-henna)`}
        stroke="#c4a35a"
        strokeWidth="1.2"
      />
      <path d="M228 10 L278 68" stroke="#1a2744" strokeWidth="8" />
      <rect
        x="268"
        y="8"
        width="20"
        height="62"
        rx="2"
        fill={`url(#${uid}-wm-turquoise)`}
        stroke="#c4a35a"
        strokeWidth="1.2"
      />
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={232 + col * 10}
            y={14 + row * 10}
            width="8"
            height="8"
            fill={
              ["#8b1e2d", "#1a2744", "#c4a35a", "#2a6b63", "#a8522e", "#f0e7d8"][
                (row * 3 + col) % 6
              ]
            }
            stroke="#faf6f0"
            strokeWidth="0.45"
          />
        )),
      )}
    </svg>
  );
}

/** حاشیهٔ فرشِ چندلایه */
export function CarpetBorderFrame({
  uid,
  className = "",
  children,
}: {
  uid: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <CarpetPatterns uid={`${uid}-bd`} />
        <rect
          x="1.2"
          y="1.2"
          width="97.6"
          height="97.6"
          fill="none"
          stroke="#8b1e2d"
          strokeWidth="2.4"
        />
        <rect
          x="3.4"
          y="3.4"
          width="93.2"
          height="93.2"
          fill="none"
          stroke="#c4a35a"
          strokeWidth="0.8"
        />
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          fill="none"
          stroke="#1a2744"
          strokeWidth="0.45"
          strokeDasharray="1.2 1.2"
          strokeOpacity="0.45"
        />
      </svg>
      {/* گوشه‌های ترنج */}
      {(
        [
          "top-2 left-2",
          "top-2 right-2",
          "bottom-2 left-2",
          "bottom-2 right-2",
        ] as const
      ).map((pos) => (
        <span
          key={pos}
          className={`pointer-events-none absolute ${pos} h-3 w-3 rotate-45`}
          style={{ backgroundColor: "#c4a35a", opacity: 0.9 }}
          aria-hidden
        />
      ))}
      {children}
    </div>
  );
}

/** طاق آزادی‌وار برای قاب عکس */
export function AzadiPhotoArch({
  src,
  alt,
  monogram,
  opened,
  onToggle,
  className = "",
}: {
  src: string;
  alt: string;
  monogram: string;
  opened: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto w-full max-w-[300px] ${className}`}>
      <div
        className="relative overflow-hidden p-2.5 transition-shadow duration-700"
        style={{
          borderRadius: "140px 140px 22px 22px",
          backgroundColor: "#faf6f0",
          border: "1.5px solid #c4a35a",
          boxShadow: opened
            ? "0 26px 55px -22px rgba(80,40,30,0.28), inset 0 0 0 1px rgba(196,163,90,0.25)"
            : "0 22px 50px -24px rgba(80,40,30,0.22), inset 0 0 0 1px rgba(196,163,90,0.2)",
        }}
      >
        {/* طاق ظریف بالای قاب — بخشی از خود قاب، نه تزئین جدا */}
        <svg
          viewBox="0 0 276 36"
          className="pointer-events-none absolute inset-x-2.5 top-1.5 z-20 w-[calc(100%-20px)]"
          aria-hidden
        >
          <path
            d="M 8 34 V 18 Q 8 4, 138 4 Q 268 4, 268 18 V 34"
            fill="none"
            stroke="#c4a35a"
            strokeWidth="1.5"
          />
          <path
            d="M 16 34 V 19 Q 16 9, 138 9 Q 260 9, 260 19 V 34"
            fill="none"
            stroke="#8b1e2d"
            strokeWidth="0.9"
            strokeOpacity="0.55"
          />
          <circle cx="138" cy="7" r="2.4" fill="#c4a35a" />
        </svg>

        <div
          className="relative aspect-[3/3.85] w-full overflow-hidden"
          style={{ borderRadius: "128px 128px 16px 16px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-all duration-1000 ease-out"
            style={{
              transform: opened ? "scale(1.02)" : "scale(1.1)",
              filter: opened
                ? "contrast(1.03) saturate(1.05)"
                : "brightness(0.88) saturate(0.94) blur(3px)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(26,39,68,0.16) 0%, transparent 40%, rgba(26,39,68,0.7) 100%)",
            }}
          />

          {/* خط حاشیهٔ ظریف داخل عکس */}
          <div
            className="pointer-events-none absolute inset-2.5 z-10 rounded-[118px_118px_12px_12px] border"
            style={{ borderColor: "rgba(196,163,90,0.45)" }}
            aria-hidden
          />

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={opened}
            aria-label={opened ? "بستن مهر دعوت" : "گشودن مهر دعوت"}
            className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-end pb-5 transition-all duration-1000"
            style={{
              backgroundColor: opened
                ? "rgba(250,246,240,0)"
                : "rgba(243,238,230,0.5)",
              backdropFilter: opened ? "blur(0px)" : "blur(5px)",
              WebkitBackdropFilter: opened ? "blur(0px)" : "blur(5px)",
            }}
          >
            {/* روبان لاکی */}
            <span
              className="pointer-events-none absolute inset-x-0 bottom-[66px] h-6 transition-all duration-700"
              style={{
                backgroundImage: "linear-gradient(180deg, #9a2434, #6e1522)",
                boxShadow: "0 3px 10px rgba(110,21,34,0.28)",
                transform: opened ? "scaleX(0)" : "scaleX(1)",
                opacity: opened ? 0 : 0.95,
              }}
              aria-hidden
            />

            <span
              className="relative flex h-16 w-16 items-center justify-center rounded-full border transition-transform duration-700"
              style={{
                borderColor: "rgba(196,163,90,0.9)",
                background:
                  "radial-gradient(circle at 32% 28%, #f0d48a 0%, #c4a35a 42%, #8b1e2d 100%)",
                boxShadow:
                  "0 10px 22px -8px rgba(110,21,34,0.55), inset 0 2px 4px rgba(255,255,255,0.35)",
                transform: opened ? "scale(0.78)" : "scale(1)",
                color: "#faf6f0",
              }}
            >
              <span className="absolute inset-[4px] rounded-full border border-dashed" style={{ borderColor: "rgba(250,246,240,0.45)" }} />
              <span className="relative flex flex-col items-center leading-none">
                <span className="text-[7.5px] tracking-[0.2em] opacity-90">مهر</span>
                <span className="mt-0.5 font-display text-[13px] font-bold">{monogram}</span>
              </span>
            </span>

            <span className="mt-2 rounded-full border border-white/30 bg-black/40 px-3.5 py-1 text-[10px] text-white backdrop-blur-md">
              {opened
                ? "مهر گشوده شد · لمس برای بستن"
                : "مهر را لمس کنید تا عکس روشن شود"}
            </span>
          </button>
        </div>

        {/* نوار هفت‌رنگ خیلی باریک — فقط حس پالت ایرانی */}
        <div
          className="mt-2 flex h-1 w-full overflow-hidden rounded-full"
          aria-hidden
        >
          {["#8b1e2d", "#1a2744", "#c4a35a", "#a8522e", "#2a6b63", "#e8dcc8"].map(
            (c) => (
              <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
