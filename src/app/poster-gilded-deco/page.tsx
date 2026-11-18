import type { Metadata } from "next";

export const metadata: Metadata = { title: "poster" };

const GOLD = "#c9a227";

function Fan() {
  const count = 13;
  const mid = (count - 1) / 2;
  const pearls = Array.from({ length: count }, (_, i) => {
    const rad = (((i - mid) * 13.2) * Math.PI) / 180;
    return { x: 150 + Math.sin(rad) * 152, y: 168 - Math.cos(rad) * 152 };
  });

  return (
    <svg viewBox="0 0 300 172" className="w-[380px]" aria-hidden>
      <defs>
        <linearGradient id="poster-blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf6dc" />
          <stop offset="20%" stopColor="#f0d99a" />
          <stop offset="46%" stopColor="#d4b04a" />
          <stop offset="72%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8f6f1f" />
        </linearGradient>
      </defs>
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`rotate(${(i - mid) * 13.2} 150 168)`}>
          <path d="M148 168 L137 8 L163 8 L152 168 Z" fill="url(#poster-blade)" />
          <path d="M137 8 L163 8 L161.5 15 L138.5 15 Z" fill="#fdf6dc" opacity="0.45" />
        </g>
      ))}
      {pearls.map((pearl) => (
        <circle key={`${pearl.x}-${pearl.y}`} cx={pearl.x} cy={pearl.y} r="2.4" fill="#fdf3cf" />
      ))}
      <path
        d="M4.3 142.3 A 148 148 0 0 1 295.7 142.3"
        fill="none"
        stroke="rgba(201,162,39,0.55)"
        strokeWidth="0.9"
      />
    </svg>
  );
}

export default function PosterPage() {
  return (
    <div
      dir="rtl"
      className="relative flex flex-col items-center justify-between overflow-hidden bg-[#0b0a09] px-10 py-10"
      style={{ width: 600, height: 800 }}
    >
      <style>{`
        .poster-foil {
          background-image: linear-gradient(100deg,#8a6a1f 0%,#c9a227 14%,#f9efc9 30%,#fffdf4 36%,#f2dfa4 44%,#c9a227 60%,#8a6a1f 78%,#c9a227 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* sunburst */}
      <div
        className="pointer-events-none absolute -top-[260px] left-1/2 h-[1050px] w-[1050px] -translate-x-1/2 rounded-full"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 50%, rgba(201,162,39,0.22) 0deg 0.3deg, transparent 0.3deg 8deg)",
          maskImage:
            "radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 66%)",
          WebkitMaskImage:
            "radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 66%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 38%, transparent 18%, rgba(11,10,9,0.55) 60%, #0b0a09 86%)",
        }}
        aria-hidden
      />

      {/* frame */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,transparent,#c9a227,transparent)]" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-[linear-gradient(90deg,transparent,#c9a227,transparent)]" />

      <p className="relative z-10 pt-2 text-[10px] uppercase tracking-[0.5em] text-[#c9a227]/85">
        The Golden Age
      </p>

      <div className="relative z-10 flex flex-col items-center">
        <Fan />

        <span className="relative -mt-3 flex h-[64px] w-[64px] items-center justify-center">
          <span className="absolute inset-0 rotate-45 border border-[#c9a227]/70" />
          <span className="absolute inset-[5px] rotate-45 border border-[#c9a227]/25" />
          <span className="absolute inset-[10px] rotate-45 bg-[linear-gradient(150deg,#1b1713,#0b0a09_60%,#171310)]" />
          <span className="relative font-display text-[15px] text-[#f4e3b0]">ع&amp;س</span>
        </span>

        <h1 className="mt-6 flex flex-col items-center font-display text-[46px] leading-[1.2]">
          <span className="poster-foil inline-block px-2">علی</span>
          <span className="flex items-center gap-3 text-[#c9a227]">
            <span className="h-px w-9 bg-[#c9a227]/45" />
            <span className="font-sans text-[10px] tracking-[0.4em]">و</span>
            <span className="h-px w-9 bg-[#c9a227]/45" />
          </span>
          <span className="poster-foil inline-block px-2">سارا</span>
        </h1>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 pb-1">
        <span className="flex items-center gap-2">
          <span className="h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.6))]" />
          <svg viewBox="0 0 20 20" className="h-2 w-2" aria-hidden>
            <path d="M10 1 L19 10 L10 19 L1 10 Z" fill={GOLD} />
          </svg>
          <span className="h-px w-10 bg-[linear-gradient(270deg,transparent,rgba(201,162,39,0.6))]" />
        </span>
        <p className="font-display text-[15px] text-[#f7f0e1]/85">۳۱ اردیبهشت ۱۴۰۶</p>
        <p className="text-[9px] uppercase tracking-[0.36em] text-[#c9a227]/70">
          Save the Date · Tehran
        </p>
      </div>
    </div>
  );
}
