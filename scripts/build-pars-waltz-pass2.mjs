import fs from "fs";

const path =
  "C:/Users/ZBOOK/Desktop/wedding-templates/src/templates/renderers/pars-waltz/index.tsx";
let s = fs.readFileSync(path, "utf8");

// --- theme constants block ---
const themeBlock = `const DEFAULT_COVER = "/images/templates/pars-waltz-cover.jpg";

const LIMESTONE = "#ebe4d4";
const ROYAL_LAPIS = "#1a3568";
const ACHAEMENID_GOLD = "#c9a84a";

type CourtMood = "dawn" | "sunset" | "candlelight";

const MOODS: Record<
  CourtMood,
  {
    label: string;
    bg: string;
    cardBg: string;
    ink: string;
    muted: string;
    lapis: string;
    gold: string;
    sage: string;
    petalA: string;
    petalB: string;
    border: string;
    isDark: boolean;
  }
> = {
  dawn: {
    label: "سپیده‌دمِ پارسه",
    bg: "#ebe4d4",
    cardBg: "#f7f1e4",
    ink: "#1f1810",
    muted: "#6b5a45",
    lapis: "#1a3568",
    gold: "#c9a84a",
    sage: "#2f5a3a",
    petalA: "#c9a84a",
    petalB: "#8b6914",
    border: "rgba(201, 168, 74, 0.42)",
    isDark: false,
  },
  sunset: {
    label: "غروبِ آپادانا",
    bg: "#f0dcc0",
    cardBg: "#faf0dc",
    ink: "#2a180c",
    muted: "#7a5640",
    lapis: "#243f72",
    gold: "#d4ae4a",
    sage: "#3a6544",
    petalA: "#d4843b",
    petalB: "#a85a22",
    border: "rgba(212, 174, 74, 0.45)",
    isDark: false,
  },
  candlelight: {
    label: "شبِ آتشکده",
    bg: "#0f0c0a",
    cardBg: "#1a1410",
    ink: "#f3e6d0",
    muted: "#c4b09a",
    lapis: "#6f93d6",
    gold: "#e0b973",
    sage: "#5a8f6a",
    petalA: "#e0b973",
    petalB: "#c9a84a",
    border: "rgba(224, 185, 115, 0.38)",
    isDark: true,
  },
};

const DEFAULT_SCHEDULE: TemplateScheduleItem[] = [
  {
    time: "۱۷:۳۰",
    title: "گاهِ نخست · ورود به بارگاه",
    description:
      "استقبال رسمی با گلاب و نقل، نوای چنگ و نی در سایه‌ی ستون‌های آپادانا",
    icon: "cafe",
  },
  {
    time: "۱۹:۰۰",
    title: "گاهِ دوم · پیمان در تالار ستون‌ها",
    description:
      "جاری شدن خطبه‌ی عقد میان سرستون‌های گاوسر و نقش‌های نیلوفر هخامنشی",
    icon: "heart",
  },
  {
    time: "۲۰:۳۰",
    title: "گاهِ سوم · ضیافتِ شاهانه",
    description:
      "شام رسمی در میان تخت‌سنگ‌های زرین، فانوس‌های لاجوردی و عطر زعفران",
    icon: "dining",
  },
  {
    time: "۲۲:۰۰",
    title: "گاهِ چهارم · والسِ پارسه",
    description:
      "نخستین رقص کنار شعله‌ی آتشکده و ستارگان شبِ تختِ جمشید",
    icon: "music",
  },
];

const LOVE_STORY = [
  {
    tag: "طلوع",
    title: "نگاهی چون نقشِ زرین بر سنگِ پارسه",
    text: "در میان روزهای عادی، نگاهی آمد که مثل مهرِ هخامنشی بر دل نشست و دیگر محو نشد.",
  },
  {
    tag: "هم‌قدم",
    title: "دو ستون زیر یک سقفِ آسمان",
    text: "با هم خندیدیم، با هم رؤیا بافتیم و فهمیدیم خانه همان‌جاست که دستت در دست من است.",
  },
  {
    tag: "عهد",
    title: "پیمانی به استواریِ تخت جمشید",
    text: "کنار حوضِ نیلوفر قولِ همیشگی دادیم و حالا می‌خواهیم این شادی را در بارگاهِ عشق با شما قسمت کنیم.",
  },
] as const;

const COURT_SWATCHES = [
  {
    color: "#1a3568",
    label: "لاجوردِ شاهی",
    en: "Royal Lapis",
    tip: "لاجورد عمیق، رنگ رسمی بارگاه؛ برای کت‌وشلوار و اکسسوری آقایان ایده‌آل است.",
  },
  {
    color: "#c9a84a",
    label: "زرِ هخامنشی",
    en: "Achaemenid Gold",
    tip: "طلاییِ کهنه و درخشان، هماهنگ با جزئیات سنگی و مهرِ فروهر.",
  },
  {
    color: "#2a9d8f",
    label: "فیروزه‌ی پارسه",
    en: "Pars Turquoise",
    tip: "فیروزهٔ ایرانی برای شال، جواهر و جزئیات ظریفِ پوشش بانوان.",
  },
  {
    color: "#8b3a2a",
    label: "سفالِ تخت‌جمشید",
    en: "Terracotta",
    tip: "سفالی گرم و باستانی؛ انتخابی اصیل برای لباس شب و کراوات.",
  },
  {
    color: "#1a1410",
    label: "سرویِ شب",
    en: "Cypress Noir",
    tip: "سیاهِ سروی و سرمه‌ای تیره برای استایل کلاسیک و کاملاً رسمی.",
  },
];

const COURT_OFFERINGS = [
  { id: "lotus", label: "نیلوفر آبی (پاکی و عشقِ آسمانی)", icon: "❀" },
  { id: "cypress", label: "شاخه‌ی سرو (جاودانگیِ آریایی)", icon: "†" },
  { id: "pomegranate", label: "انارِ زرین (برکت و شادی)", icon: "✦" },
] as const;

const FALLING_LOTUSES = [
  { left: "8%", delay: "0s", dur: "11s", size: 13, rot: 25 },
  { left: "22%", delay: "2.4s", dur: "13s", size: 10, rot: -40 },
  { left: "38%", delay: "4.8s", dur: "10.5s", size: 14, rot: 60 },
  { left: "56%", delay: "1.3s", dur: "12.2s", size: 11, rot: -20 },
  { left: "74%", delay: "3.6s", dur: "11.8s", size: 13, rot: 45 },
  { left: "89%", delay: "0.7s", dur: "12.8s", size: 10, rot: -55 },
];
`;

s = s.replace(
  /const DEFAULT_COVER =[\s\S]*?const FALLING_LOTUSES = \[[\s\S]*?\];\n/,
  themeBlock,
);

const bullFn = `/** سرستونِ گاوسرِ هخامنشی (SVG) */
function BullCapitalColumn({
  className = "",
  gold,
  lapis,
  sage,
  flip = false,
}: {
  className?: string;
  gold: string;
  lapis: string;
  sage: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 160"
      className={\`\${className} \${flip ? "-scale-x-100" : ""}\`}
      aria-hidden
    >
      <rect x="26" y="48" width="12" height="100" rx="2" fill={gold} fillOpacity="0.55" />
      <rect x="24" y="48" width="16" height="6" rx="1" fill={gold} />
      <path
        d="M 8 46 C 8 22, 28 10, 32 10 C 36 10, 56 22, 56 46 L 48 46 C 48 30, 38 22, 32 22 C 26 22, 16 30, 16 46 Z"
        fill={lapis}
        fillOpacity="0.92"
        stroke={gold}
        strokeWidth="1.2"
      />
      <ellipse cx="18" cy="38" rx="10" ry="7" fill={gold} fillOpacity="0.85" />
      <ellipse cx="46" cy="38" rx="10" ry="7" fill={gold} fillOpacity="0.85" />
      <circle cx="32" cy="34" r="3.5" fill={gold} />
      <path
        d="M 20 148 H 44 L 40 156 H 24 Z"
        fill={sage}
        fillOpacity="0.7"
        stroke={gold}
        strokeWidth="0.8"
      />
      {/* نوار نیلوفر روی ستون */}
      <path
        d="M 26 70 Q 32 64, 38 70 Q 32 76, 26 70 Z"
        fill={gold}
        fillOpacity="0.7"
      />
      <path
        d="M 26 90 Q 32 84, 38 90 Q 32 96, 26 90 Z"
        fill={gold}
        fillOpacity="0.55"
      />
    </svg>
  );
}
`;

s = s.replace(
  /\/\*\* شاخه‌ی[\s\S]*?function BullCapitalColumn\([\s\S]*?\n\}\n\n/,
  bullFn + "\n",
);

const sealFn = `/** مهرِ زرینِ فروهر */
function FaravaharSeal({
  monogram,
  lapis,
  gold,
  size = 76,
}: {
  monogram: string;
  lapis: string;
  gold: string;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full select-none"
      style={{
        width: size,
        height: size,
        backgroundImage: \`radial-gradient(circle at 32% 28%, #e8d5a0 0%, \${gold} 48%, #6a4e12 100%)\`,
        boxShadow:
          "0 12px 26px -8px rgba(80, 50, 10, 0.65), inset 0 2px 5px rgba(255, 255, 255, 0.45), inset 0 -4px 8px rgba(45, 30, 8, 0.55)",
      }}
    >
      <span
        className="absolute inset-[5px] rounded-full border"
        style={{ borderColor: \`\${lapis}99\` }}
      />
      <span
        className="absolute inset-[9px] rounded-full border border-dashed"
        style={{ borderColor: \`\${lapis}55\` }}
      />
      <span className="relative flex flex-col items-center leading-none" style={{ color: lapis }}>
        <svg viewBox="0 0 48 28" className="h-4 w-7" aria-hidden>
          <path
            d="M 4 14 Q 14 4, 24 14 Q 34 4, 44 14 Q 34 18, 24 14 Q 14 18, 4 14 Z"
            fill={lapis}
            fillOpacity="0.9"
          />
          <circle cx="24" cy="12" r="3.2" fill={gold} stroke={lapis} strokeWidth="0.8" />
          <path d="M 24 15 V 24" stroke={lapis} strokeWidth="1.2" />
          <path d="M 18 20 H 30" stroke={lapis} strokeWidth="1" />
        </svg>
        <span className="mt-0.5 font-display text-[12px] font-bold tracking-wider">
          {monogram}
        </span>
      </span>
    </span>
  );
}
`;

s = s.replace(
  /\/\*\* مهرِ[\s\S]*?function FaravaharSeal\([\s\S]*?\n\}\n\n/,
  sealFn + "\n",
);

const headerFn = `/** عنوان رسمی هر بخش با نشانِ نیلوفر */
function CourtSectionHeader({
  subtitleEn,
  title,
  description,
  lapis,
  gold,
  muted,
}: {
  subtitleEn: string;
  title: string;
  description?: string;
  lapis: string;
  gold: string;
  muted: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2.5">
        <span
          className="h-px w-10"
          style={{
            backgroundImage: \`linear-gradient(90deg, transparent, \${gold})\`,
          }}
        />
        <Sparkles className="h-3.5 w-3.5" style={{ color: lapis }} />
        <span
          className="text-[9px] uppercase tracking-[0.36em]"
          style={{ color: gold }}
        >
          {subtitleEn}
        </span>
        <Sparkles className="h-3.5 w-3.5" style={{ color: lapis }} />
        <span
          className="h-px w-10"
          style={{
            backgroundImage: \`linear-gradient(270deg, transparent, \${gold})\`,
          }}
        />
      </div>
      <h2 className="mt-2.5 font-display text-[28px] leading-tight">{title}</h2>
      {description ? (
        <p
          className="mt-1.5 max-w-[295px] text-[12px] leading-6"
          style={{ color: muted }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
`;

s = s.replace(
  /\/\*\* عنوان[\s\S]*?function CourtSectionHeader\([\s\S]*?\n\}\n\n/,
  headerFn + "\n",
);

const porticoFn = `/** دروازه‌ی آپادانا با روبانِ شاهی و مهرِ فروهر */
function ApadanaPortico({
  uid,
  unsealed,
  onToggleSeal,
  cover,
  couple,
  monogram,
  mood,
}: {
  uid: string;
  unsealed: boolean;
  onToggleSeal: () => void;
  cover: string;
  couple: string;
  monogram: string;
  mood: (typeof MOODS)[CourtMood];
}) {
  return (
    <div className="relative mx-auto mt-2 flex w-full max-w-[330px] flex-col items-center">
      <BullCapitalColumn
        className="pointer-events-none absolute -right-1 top-10 z-30 h-44 w-12 drop-shadow-sm"
        gold={mood.gold}
        lapis={mood.lapis}
        sage={mood.sage}
      />
      <BullCapitalColumn
        className="pointer-events-none absolute -left-1 top-10 z-30 h-44 w-12 drop-shadow-sm"
        gold={mood.gold}
        lapis={mood.lapis}
        sage={mood.sage}
        flip
      />

      <div
        className="relative w-[288px] overflow-hidden p-3 transition-all duration-700"
        style={{
          borderRadius: "18px 18px 28px 28px",
          backgroundColor: mood.cardBg,
          border: \`1.5px solid \${mood.gold}\`,
          boxShadow: mood.isDark
            ? "0 28px 65px -20px rgba(0,0,0,0.85), 0 0 40px -15px rgba(201,168,74,0.22)"
            : "0 26px 60px -22px rgba(80, 50, 20, 0.28), inset 0 0 24px rgba(201, 168, 74, 0.14)",
        }}
      >
        {/* کنگره‌ی هخامنشی */}
        <div className="absolute inset-x-3 top-1.5 z-20 flex h-3 justify-between px-0.5" aria-hidden>
          {Array.from({ length: 11 }, (_, i) => (
            <span
              key={i}
              className="w-2.5 rounded-[1px]"
              style={{ backgroundColor: mood.gold, opacity: 0.8 }}
            />
          ))}
        </div>

        {/* قاب عکس زوج */}
        <div
          className="relative mt-3 aspect-[3/3.85] w-full overflow-hidden rounded-[12px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={couple}
            className="h-full w-full object-cover transition-all duration-1000 ease-out"
            style={{
              transform: unsealed ? "scale(1.02)" : "scale(1.1)",
              filter: unsealed
                ? "contrast(1.03) saturate(1.05)"
                : "brightness(0.88) saturate(0.95) blur(3px)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(26,53,104,0.22) 0%, transparent 40%, rgba(31,24,16,0.72) 100%)",
            }}
          />

          <div
            onClick={onToggleSeal}
            role="button"
            tabIndex={0}
            aria-expanded={unsealed}
            aria-label={unsealed ? "بستن فرمانِ بارگاه" : "گشودن مهرِ فروهر"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleSeal();
              }
            }}
            className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-end pb-5 transition-all duration-1000"
            style={{
              backgroundColor: unsealed
                ? "rgba(235, 228, 212, 0.0)"
                : "rgba(235, 228, 212, 0.55)",
              backdropFilter: unsealed ? "blur(0px)" : "blur(6px)",
              WebkitBackdropFilter: unsealed ? "blur(0px)" : "blur(6px)",
            }}
          >
            {/* روبان شاهی لاجوردی */}
            <div
              className={\`pointer-events-none absolute inset-x-0 bottom-[66px] h-7 transition-all duration-700 \${
                unsealed ? "scale-x-0 opacity-0" : "scale-x-100 opacity-95"
              }\`}
              style={{
                backgroundImage: \`linear-gradient(180deg, \${mood.lapis}, #0f2448)\`,
                boxShadow: "0 4px 12px rgba(26,53,104,0.35)",
              }}
            />

            <div
              className={\`transition-all duration-700 \${
                unsealed ? "scale-75 opacity-95" : "scale-100 hover:scale-105"
              }\`}
            >
              <FaravaharSeal
                monogram={monogram}
                lapis={mood.isDark ? "#1a1410" : "#1a3568"}
                gold={mood.gold}
                size={68}
              />
            </div>

            <span className="mt-2 rounded-full border border-white/35 bg-black/40 px-3.5 py-1 text-[10px] text-white backdrop-blur-md">
              {unsealed
                ? "مهرِ فروهر گشوده شد · لمس برای بستن"
                : "برای گشودنِ فرمان، مهرِ فروهر را لمس کنید"}
            </span>
          </div>
        </div>

        {/* نوار نیلوفر پایین قاب */}
        <svg viewBox="0 0 260 18" className="mt-2 w-full" aria-hidden>
          <defs>
            <linearGradient id={\`\${uid}-lotus-band\`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={mood.gold} stopOpacity="0.2" />
              <stop offset="50%" stopColor={mood.gold} stopOpacity="0.95" />
              <stop offset="100%" stopColor={mood.gold} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M 10 9 Q 40 2, 70 9 Q 100 16, 130 9 Q 160 2, 190 9 Q 220 16, 250 9"
            fill="none"
            stroke={\`url(#\${uid}-lotus-band)\`}
            strokeWidth="1.4"
          />
        </svg>
      </div>
    </div>
  );
}
`;

s = s.replace(
  /\/\*\* دروازه‌ی[\s\S]*?function ApadanaPortico\([\s\S]*?\n\}\n\nexport function ParsWaltzRenderer/,
  porticoFn + "\nexport function ParsWaltzRenderer",
);

// Fix remaining Apadana if old comment still there
if (s.includes("طاقِ گلخانه‌ی") || s.includes("MagnoliaBranch") || s.includes("petalA={mood.petalA}")) {
  // try old header comment pattern from magnolia leftover
  s = s.replace(
    /\/\*\* طاقِ[\s\S]*?function ApadanaPortico\([\s\S]*?\n\}\n\nexport function ParsWaltzRenderer/,
    porticoFn + "\nexport function ParsWaltzRenderer",
  );
}

// Default offering id
s = s.replace(
  'useState<(typeof COURT_OFFERINGS)[number]["id"]>("rose")',
  'useState<(typeof COURT_OFFERINGS)[number]["id"]>("lotus")',
);

// Theme defaults in renderer
s = s.replace(
  /poeticLine:\s*\n\s*"«مرا عهدیست[\s\S]*?musicTitle: "والسِ مگنولیا · سولوی ویولن و پیانو"/,
  `poeticLine:
      "«در بارگاهِ دل، دو ستون زیر یک سقف روییدند و سایه‌شان تا ابد یکی شد»",
    blessingLine:
      "حضور شما، فرخنده‌ترین نقشِ این بارگاه است.",
    dressCode:
      "پوشش رسمیِ شاهانه (Court Formal)؛ لاجورد، زرِ هخامنشی، فیروزه، سفال و سروی تیره.",
    musicTitle: "والسِ پارسه · چنگ و نیِ آپادانا"`,
);

// Fix rose= props on CourtSectionHeader
s = s.split("rose={mood.lapis}").join("lapis={mood.lapis}");
s = s.split("rose={mood.").join("lapis={mood.");

// Fix FaravaharSeal rose= leftover
s = s.split("rose={").join("lapis={");

// CSS title gradient uses lapis
s = s.replace(
  /pw-rose-foil/g,
  "pw-gold-foil",
);
s = s.replace(
  /background-image: linear-gradient\(100deg, \$\{mood\.lapis\} 0%, \$\{mood\.gold\} 38%, \$\{mood\.ink\} 68%, \$\{mood\.lapis\} 100%\);/,
  "background-image: linear-gradient(100deg, ${mood.lapis} 0%, ${mood.gold} 40%, ${mood.ink} 70%, ${mood.gold} 100%);",
);

// CSS vars
s = s.replace(
  '"--pw-lapis": mood.lapis,\n          "--pw-gold": mood.gold,',
  '"--pw-lapis": mood.lapis,\n          "--pw-gold": mood.gold,',
);

fs.writeFileSync(path, s);
console.log("pass2 ok", s.length);
console.log("has rose param leftover:", /\$\{rose\}|rose=|rose,|rose:/.test(s));
console.log("has Magnolia leftover:", /مگنولیا|Magnolia|Flower2|Botanical/.test(s));
