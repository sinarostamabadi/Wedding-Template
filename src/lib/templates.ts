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
  "moonlit-garden-v1": "/images/templates/moonlit-garden-cover.jpg",
  "mirror-hall-v1": "/images/templates/mirror-hall-cover.jpg",
  "qartas-v1": "/images/templates/qartas-cover.jpg",
  "sky-lanterns-v1": "/images/templates/sky-lanterns-cover.jpg",
  "heart-locket-v1": "/images/templates/heart-locket-cover.jpg",
  "qajar-scroll-v1": "/images/templates/qajar-scroll-cover.jpg",
  "retro-sixties-v1": "/images/templates/retro-sixties-cover.jpg",
  "persepolis-seal-v1": "/images/templates/persepolis-seal-cover.jpg",
  "yadegari-diary-v1": "/images/templates/yadegari-diary-cover.jpg",
  "gilded-deco-v1": "/images/templates/gilded-deco-cover.jpg",
  "orsi-palace-v1": "/images/templates/orsi-palace-cover.jpg",
  "silk-knot-v1": "/images/templates/silk-knot-cover.jpg",
  "aurora-prism-v1": "/images/templates/aurora-prism-cover.jpg",
  "magnolia-waltz-v1": "/images/templates/magnolia-waltz-cover.jpg",
  "pearl-silk-v1": "/images/templates/pearl-silk-cover.jpg",
  "wisteria-terrace-v1": "/images/templates/wisteria-terrace-cover.jpg",
  "ink-bloom-v1": "/images/templates/ink-bloom-cover.jpg",
  "arya-paradise-v1": "/images/templates/arya-paradise-cover.jpg",
  "pars-waltz-v1": "/images/templates/pars-waltz-cover.jpg",
  "twin-orbit-v1": "/images/templates/twin-orbit-cover.jpg",
  "carpet-iran-v1": "/images/templates/carpet-iran-cover.jpg",
  "love-loom-v1": "/images/templates/love-loom-cover.jpg",
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
  "moonlit-garden-v1": [
    "دروازه‌ی طلایی باغ که با لمس مهر ماه می‌گشاید",
    "ماه طلایی، شب‌تاب‌های شناور و گلبرگ‌های یاس",
    "کارت‌های شیشه‌ای تیره با تایپوگرافی حافظ و شمارش معکوس",
  ],
  "mirror-hall-v1": [
    "روشن کردن سه شمعِ سفره‌ی عقد و درخشش تدریجی تالار",
    "آینه‌ی تراشه‌تراشه با موج نور و قاب خاتم‌کاری",
    "قاب طاقی عکس زوج با گره‌ی هشت‌پر و منوی شبانه",
  ],
  "qartas-v1": [
    "جلدِ لاکی شنگرف که با لمس گره، ورق می‌خورد و باز می‌شود",
    "ورق‌خوردن سه‌بعدی دو مرحله‌ای: بسم‌الله و شعر، سپس شمسه‌ی عکس زوج",
    "پالت نسخه‌های خطی ایرانِ قدیم؛ لاجورد، شنگرف، طلایی و کاغذ کرم",
  ],
  "sky-lanterns-v1": [
    "فانوسِ آویزان زوج را بیفروزید و با رهایش، آسمان پر از فانوس شو",
    "پروازِ سه‌بعدی فانوس اصلی به سوی آسمان با درخشش تدریجی",
    "پالت شبِ لاجوردی با درخششِ کهربایی و مرجانی و قاب عکس زوج",
  ],
  "heart-locket-v1": [
    "آویز قلبی که مثل یک آویز واقعی روی لولا باز می‌شود",
    "عکس زوج در قاب قلبی با درخشش و انفجار نور",
    "حکاکی نام و تاریخ روی درِ آویز و پاسخ با قفل قلب",
  ],
  "qajar-scroll-v1": [
    "طوماری که با شکستن مهر موم باز می‌شود",
    "قباله با تذهیب طلایی، بته‌جقه و قاب طاقی",
    "سفره‌ی عقد، تمبر یادگاری و پاسخ مهرشده",
  ],
  "retro-sixties-v1": [
    "تلویزیون چوبی با برفک و نوار رنگی قبل از پخش دعوت‌نامه",
    "کوپن‌های جشن، تقویم ورقی و عکس کداکی با تاریخ نارنجی",
    "پیکان عروس گل‌زده، تلفن قرصی و ریسه‌های رنگی",
  ],
  "persepolis-seal-v1": [
    "مهر استوانه‌ای هخامنشی که روی لوح گلی غلتانده می‌شود",
    "خط میخی، فروهر بالدار، گل‌نقش و ستون‌های تخت جمشید",
    "سه پیمان کهن، معنای اوستایی ماه و آتشدان گواهی",
  ],
  "yadegari-diary-v1": [
    "دفتر یادگاری گلدار با قفل و کلیدی که می‌چرخد و جلدش باز می‌شود",
    "نامه‌ی «ملالی نیست جز دوری شما»، عکس چسب‌خورده و گل خشک لای دفتر",
    "نامه‌ی قلبی تاشده، کارت پستال با تمبر و برگه‌ی یادگاری مهمان",
  ],
  "pearl-silk-v1": [
    "پاکت حریری پودری با قفل و رشته‌ی مروارید که باز می‌شود",
    "کنار رفتن حریر و درخشش عکس زوج با نور مرواریدی",
    "پالت رزکوارتز و شامپاینی با پاسخ مرواریدی",
  ],
  "wisteria-terrace-v1": [
    "تراس رمانتیک با خوشه‌های آویزان ویستریا و منگوله‌ی طلایی",
    "کنار رفتن پرده‌ی بنفش و نمایان شدن عکس زوج",
    "سوییچر سه‌حال‌وهوا، فصل‌های عاشقی، عهدنامه و هدیه‌ی شکوفه",
  ],
  "ink-bloom-v1": [
    "حوض آب با چکاندن قطره و شکوفایی جوهر در آب",
    "بیرون آمدن عکس زوج از دل جوهر و برگه‌های کاغذ شناور",
    "ثبت حضور با نگه‌داشتن انگشت و نقش بستن اثر انگشت",
  ],
  "arya-paradise-v1": [
    "دروازه‌ی لاجوردی پردیس با مهرِ زرینِ گل‌نقش که باز می‌شود",
    "سروهای آریایی، چهار گاه شب و تقویم پیمان",
    "سوییچر سه‌حال‌وهوا و پیشکشِ نیلوفر و انار برای RSVP",
  ],
  "pars-waltz-v1": [
    "دروازه‌ی آپادانا با ستون گاوسر و مهرِ فروهرِ زرین",
    "ساختار رسمی والسِ مگنولیا با تم کاملاً هخامنشی",
    "سه‌حال‌وهوای بارگاه، گاه‌های شب و پیشکشِ نیلوفر برای RSVP",
  ],
  "twin-orbit-v1": [
    "صحنه‌ی سه‌بعدی Three.js با گوی بلورین و صورت‌فلکی قلب",
    "دو حلقه‌ی درهم‌تنیده و باز شدن مدار با لمس",
    "انیمیشن‌های Motion برای نامه، برنامه و RSVP",
  ],
  "carpet-iran-v1": [
    "فرش‌نقشه‌ی ایران با پهن‌شدن انیمیشنی و مهر زرین",
    "طاق آزادی‌وار برای عکس زوج و قاب حاشیهٔ فرش",
    "پالت هفت‌رنگ استان‌ها و RSVP با تم قالی ایرانی",
  ],
  "love-loom-v1": [
    "عکس زوج در طاق آزادی با قاب فرش لاکی",
    "حاشیه فرش، روبان لاکی و نوار هفت‌رنگ",
    "پهن‌شدن تار و پود با Motion و RSVP کارگاهی",
  ],
  "gilded-deco-v1": [
    "بادبزن طلاییِ سیزده‌پره که با لمس می‌گشاید و می‌بندد",
    "کارت عاجی با قاب طاقی، فویل طلایی و مونوگرام لوزی",
    "تایم‌لاین شب جشن و پاسخ با مهر طلایی",
  ],
  "orsi-palace-v1": [
    "پنجره‌ی اُرسیِ سه‌لَت با شیشه‌های هفت‌رنگ که به بالا می‌لغزد",
    "تغییر تابش نور تالار بین آفتاب صبح، طلایی عصر و مهتاب شب",
    "حوض فیروزه‌ای آرزوها با موج آب برای ثبت حضور و دعای خیر",
  ],
  "silk-knot-v1": [
    "رشته‌ی ابریشمِ سرنوشت که با لمس گره می‌خورد و کاغذ کالک را کنار می‌زند",
    "سوییچر ۳ بافت کاغذ ملموس (کتان خام، حریر رز، سنگ مهتاب) و دست‌نوشته شخصی",
    "کارت پاسخ با مهر برجستهٔ خشک (Blind Emboss) و واژهٔ یادگار",
  ],
  "aurora-prism-v1": [
    "منشورِ بلورینِ شیشه‌ای (Liquid Glass) با هم‌گراییِ دو مدارِ نور",
    "سوییچر ۳ هاله‌ی نوری (رزکوارتز، صدف مهتابی، یاقوت مدرن) و کاروسل فصل‌های آشنایی",
    "صدور کارتِ ورودِ بلورینِ هولوگرافیک (Crystal Guest Pass) پس از ثبت حضور",
  ],
  "magnolia-waltz-v1": [
    "طاقِ گلخانه‌ی بلورین با شاخه‌های گل مگنولیا، بارش گلبرگ و روبان ابریشمی موم‌مهر",
    "تب‌های عاشقانه‌ی «فصل‌های عاشقی» و «عهدنامه‌ی عروس و داماد» به همراه تقویم قلب‌دار",
    "سوییچر ۳ حال‌وهوای باغ (سپیده‌دم رز، باغ طلایی، شمع و مخمل) و ثبت حضور با مهر رزگلد",
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

/** فعلاً از لیست قالب‌ها پنهان؛ پیش‌نمایش مستقیم با URL هنوز کار می‌کند */
export const hiddenFromListKeys = new Set([
  "orsi-palace-v1", // ارسیِ هفت‌رنگ
  "gilded-deco-v1", // عصر طلایی
  "mirror-hall-v1", // تالار آینه
  "carpet-iran-v1", // فرشِ ایران
  "twin-orbit-v1", // مدارِ دو قلب
]);

export const listedTemplates = templates.filter(
  (item) => !hiddenFromListKeys.has(item.key),
);

export function getTemplateBySlug(slug: string) {
  return templates.find((item) => item.slug === slug);
}

export const usedCategories = categories.filter((category) =>
  listedTemplates.some((t) => t.categorySlugs.includes(category.slug)),
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
