import { templateCatalog } from "@/templates/catalog";
import type { TemplateCatalogItem } from "@/templates/catalog-types";
import type { InvitationRenderData } from "@/templates/types";

export const categories = [
  { name: "مینیمال", slug: "minimal" },
  { name: "لوکس", slug: "luxury" },
  { name: "رمانتیک", slug: "romantic" },
  { name: "گل‌دار", slug: "floral" },
  { name: "کلاسیک", slug: "classic" },
  { name: "مدرن", slug: "modern" },
  { name: "سنتی", slug: "traditional" },
  { name: "وینتیج", slug: "vintage" },
  { name: "تیره", slug: "dark" },
  { name: "طبیعت", slug: "nature" },
] as const;

const coverByKey: Record<string, string> = {
  "persian-editorial-haute-v1": "/images/templates/persian-editorial-cover.jpg",
  "moonlit-ink-v1": "/images/templates/moonlit-cover.jpg",
  "desert-rose-stationery-v1": "/images/templates/desert-rose-cover.jpg",
  "royal-suite-v1": "/images/templates/royal-suite-cover.jpg",
  "stationery-arch-v1": "/images/templates/stationery-arch-cover.jpg",
  "emerald-seal-v1": "/images/templates/emerald-seal-cover.jpg",
  "midnight-rose-v1": "/images/templates/midnight-rose-cover.jpg",
  "crimson-velvet-v1": "/images/templates/crimson-velvet-cover.jpg",
  "turquoise-tile-v1": "/images/templates/turquoise-tile-cover.jpg",
  "vinyl-love-v1": "/images/templates/vinyl-love-cover.jpg",
  "love-chat-v1": "/images/templates/love-chat-cover.jpg",
  "scratch-reveal-v1": "/images/templates/scratch-reveal-cover.jpg",
  "starry-night-v1": "/images/templates/starry-night-cover.jpg",
  "mixtape-love-v1": "/images/templates/mixtape-love-cover.jpg",
  "rose-bloom-v1": "/images/templates/rose-bloom-cover.jpg",
};

const highlightsByKey: Record<string, string[]> = {
  "persian-editorial-haute-v1": [
    "قاب طاقی عکس زوج",
    "مونوگرام طلایی",
    "برنامه مراسم با آیکون",
    "پخش موسیقی پیشواز",
  ],
  "moonlit-ink-v1": [
    "فضای شبانه و مهتابی",
    "تایپوگرافی شاعرانه",
    "مسیریابی نشان، بلد و گوگل",
  ],
  "desert-rose-stationery-v1": [
    "پاکت کرافت و فویل رزگلد",
    "عکس زوج در قلب کارت",
    "نوار پایین برای پاسخ سریع",
  ],
  "royal-suite-v1": [
    "پاکت زمردی و فویل طلایی",
    "شعر حافظ",
    "منوی پایین صفحه",
  ],
  "stationery-arch-v1": [
    "چیدمان دوستونه ادیتوریال",
    "قاب طاقی بلند",
    "برنامه با آیکون مراسم",
  ],
  "emerald-seal-v1": [
    "پاکت سه‌بعدی با مهر طلایی",
    "انیمیشن باز شدن پاکت",
    "نمایش جزئیات پس از گشودن",
  ],
  "midnight-rose-v1": [
    "پاکت مخملی سرمه‌ای با مهر رزگلد",
    "تم تیره شبانه با فویل طلایی",
    "اعلام حضور با تعداد همراهان",
  ],
  "crimson-velvet-v1": [
    "پاکت زرشکی با مهر طلایی وصال",
    "کارت طاقی بلند با عکس زوج",
    "شعر مولانا و پخش‌کننده موسیقی",
  ],
  "turquoise-tile-v1": [
    "نقش کاشی ایرانی و ستاره‌ی هشت‌پر",
    "مهر طلایی و ستاره‌های ریزان هنگام گشودن",
    "کارت عاجی با قاب طاقی و قاب تاریخ",
  ],
  "vinyl-love-v1": [
    "کاور آلبوم و صفحه‌ی گرام چرخان",
    "برنامه‌ی جشن به شکل فهرست قطعه‌ها",
    "محل جشن به شکل بلیت کنسرت",
  ],
  "love-chat-v1": [
    "شروع از صفحه‌ی قفل گوشی با اعلان پیام",
    "پیام‌های پشت‌سرهم با «در حال نوشتن…»",
    "اعلام حضور به شکل نظرسنجی چت",
  ],
  "scratch-reveal-v1": [
    "سه دایره‌ی طلایی واقعاً خراشیدنی",
    "انفجار کاغذرنگی بعد از کشف راز",
    "دکمه‌ی خراش خودکار و خراش دوباره",
  ],
  "starry-night-v1": [
    "آسمان زنده با ستاره‌های چشمک‌زن و شهاب",
    "وصل کردن ستاره‌ها تا کامل شدن صورت‌فلکی قلب",
    "نقشه‌ی ستاره‌ها، مدار جشن و سیاره‌های رنگ لباس",
  ],
  "mixtape-love-v1": [
    "کاستی که داخل ضبط می‌رود و قرقره‌هایش می‌چرخد",
    "برنامه‌ی جشن روی ساید A و B با برگرداندن کاست",
    "رادیوی FM قابل تنظیم و خط درخواست آهنگ",
  ],
  "rose-bloom-v1": [
    "غنچه‌ی رزی که با نگه داشتن قلب می‌شکفد",
    "باران گلبرگ و نامه‌ی عاشقانه با عکس قلبی",
    "قصه‌ی عشق و ارسال پاسخ با یک قلب تپنده",
  ],
};

export const commonFeatures = [
  "شمارش معکوس زنده",
  "برنامه زمان‌بندی جشن",
  "مسیریابی و نقشه",
  "کد پوشش و پالت رنگی",
  "اعلام حضور (RSVP)",
  "افزودن به تقویم",
];

export type TemplateEntry = TemplateCatalogItem & {
  slug: string;
  cover: string | null;
  highlights: string[];
  categoryLabels: string[];
};

function toEntry(item: TemplateCatalogItem): TemplateEntry {
  return {
    ...item,
    slug: item.key.replace(/-v\d+$/, ""),
    cover: coverByKey[item.key] ?? null,
    highlights: highlightsByKey[item.key] ?? [],
    categoryLabels: item.categorySlugs.map(
      (slug) => categories.find((c) => c.slug === slug)?.name ?? slug,
    ),
  };
}

export const templates: TemplateEntry[] = templateCatalog.map(toEntry);

export function getTemplateBySlug(slug: string) {
  return templates.find((item) => item.slug === slug);
}

export const usedCategories = categories.filter((category) =>
  templates.some((t) => t.categorySlugs.includes(category.slug)),
);

/** تاریخ ثابت تا HTML ایستا و کلاینت یکسان باشند */
export const sampleInvitation: InvitationRenderData = {
  partnerOneName: "علی",
  partnerTwoName: "سارا",
  invitationText: "با کمال مهر و افتخار شما را به جشن پیوندمان دعوت می‌کنیم.",
  eventStartAt: "2027-05-21T15:30:00.000Z",
  eventEndAt: "2027-05-21T20:30:00.000Z",
  timezone: "Asia/Tehran",
  venueName: "عمارت یاس سفید",
  venueAddress: "تهران، نیاوران، خیابان یاسمن",
};

export const sampleFeatures = {
  countdown: true,
  map: true,
  rsvp: true,
  music: true,
  gallery: false,
  guestMessage: true,
};
