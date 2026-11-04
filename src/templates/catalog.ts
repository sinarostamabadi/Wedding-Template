import type { TemplateCatalogItem } from "./catalog-types";

export type { TemplateCatalogItem } from "./catalog-types";

/** قالب‌ها یکی‌یکی اضافه می‌شوند. */
export const templateCatalog: TemplateCatalogItem[] = [
  {
    key: "persian-editorial-haute-v1",
    name: "ادیتوریال ایرانی",
    version: "1.0.0",
    description:
      "دعوت‌نامه لوکس ادیتوریال با قاب طاقی، مونوگرام طلایی، شمارش‌معکوس و برنامه مراسم.",
    categorySlugs: ["luxury", "classic", "traditional"],
    isFree: true,
    price: 0,
    thumbnailGradient: "linear-gradient(160deg,#1b3b32 0%,#fcf9f3 48%,#fed892 100%)",
    defaultCustomization: {
      primaryColor: "#1b3b32",
      secondaryColor: "#755a21",
      backgroundColor: "#fcf9f3",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«تو تمنای من و یار من و جان منی...»",
      dressCode:
        "لباس کاملاً رسمی و بلک تای (Black Tie). خواهشمندیم بانوان محترم به احترام عروس، از پوشیدن رنگ سفید پرهیز نمایند.",
      blessingLine: "حضور پرمهرتان، زیباترین هدیه آغاز زندگیمان است",
      musicTitle: "موسیقی پیشواز جشن",
    },
  },
  {
    key: "moonlit-ink-v1",
    name: "مهتاب",
    version: "1.0.0",
    description:
      "دعوت‌نامه شبانه با پس‌زمینه جوهر مشکی، تایپوگرافی مهتابی و چیدمان مینیمال شاعرانه.",
    categorySlugs: ["modern", "dark", "luxury"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#0C1218 0%,#1a2430 42%,#A8B5C4 100%)",
    defaultCustomization: {
      primaryColor: "#F2EEE6",
      secondaryColor: "#A8B5C4",
      backgroundColor: "#0C1218",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "شب از شبستان چشم تو آغاز می‌شود",
      dressCode:
        "لباس شب، رنگ‌های تیره یا صدفی. لطفاً از رنگ سفید کامل پرهیز کنید.",
      blessingLine: "حضور شما، نور کامل این شب است",
    },
  },
  {
    key: "desert-rose-stationery-v1",
    name: "رزگلد کویری",
    version: "1.0.0",
    description:
      "دعوت‌نامه کاغذی با پاکت کرافت، فویل رزگلد، عکس زوج در قلب کارت، شمارش‌معکوس و گاه‌شمار جشن.",
    categorySlugs: ["romantic", "luxury", "nature"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#241f1e 0%,#FDFBF7 48%,#B77F6E 100%)",
    defaultCustomization: {
      primaryColor: "#2B2625",
      secondaryColor: "#B77F6E",
      backgroundColor: "#FDFBF7",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "همراه با عشق بی‌پایان",
      blessingLine: "جشن آغاز همسفری ما",
      dressCode:
        "کد لباس: رسمی شیک کویری (Black Tie Optional). طیف رزگلد، ماسه و تراکوتا پیشنهاد می‌شود.",
    },
  },
  {
    key: "royal-suite-v1",
    name: "سوئیت سلطنتی",
    version: "1.0.0",
    description:
      "دعوت‌نامه پاکتی با فویل زمردی و طلایی، شعر حافظ، شمارش‌معکوس، گاه‌شمار و مسیریابی عمارت.",
    categorySlugs: ["luxury", "classic", "traditional"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#44645f 0%,#fcf9f4 48%,#c5a059 100%)",
    defaultCustomization: {
      primaryColor: "#775a19",
      secondaryColor: "#44645f",
      backgroundColor: "#fcf9f4",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«در ازل پرتو حسنت ز تجلی دم زد عشق پیدا شد و آتش به همه عالم زد»",
      blessingLine: "با مهر فراوان و مشتاق دیدار،",
      dressCode:
        "برای هماهنگی قاب‌های یادگاری، لباس رسمی و شیک با تم زمردی و شامپاینی پیشنهاد می‌شود.",
      musicTitle: "قطعه عاشقانه بهار و پیوند",
    },
  },
  {
    key: "stationery-arch-v1",
    name: "طاق کاغذی",
    version: "1.0.0",
    description:
      "دعوت‌نامه ادیتوریال با قاب طاقی زوج، تایپوگرافی دوستونه، شمارش‌معکوس و برنامه ساحلی.",
    categorySlugs: ["modern", "romantic", "minimal"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#ece4dc 0%,#fcf9f4 50%,#775a19 100%)",
    defaultCustomization: {
      primaryColor: "#775a19",
      secondaryColor: "#c5a059",
      backgroundColor: "#fcf9f4",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«بنام یگانگی پیوند عشق و وفاداری»",
      blessingLine: "با مهر و امید مشتاق حضور صمیمانه‌تان هستیم.",
      dressCode:
        "پوشش رسمی (Black Tie / Formal Chic). طیف نود، عاجی، زیتونی یا خاکی گرم. لطفاً سفید کامل را به عروس اختصاص دهید.",
      musicTitle: "نوای عاشقی (پیانوی اختصاصی مراسم)",
    },
  },
  {
    key: "emerald-seal-v1",
    name: "پاکت زمردی",
    version: "1.0.0",
    description:
      "پاکت سه‌بعدی زمردی با مهر طلایی؛ با لمس مهر، کارت بیرون می‌آید و جزئیات جشن نمایان می‌شود.",
    categorySlugs: ["luxury", "classic", "traditional"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#fcf9f4 0%,#44645f 50%,#c5a059 100%)",
    defaultCustomization: {
      primaryColor: "#775a19",
      secondaryColor: "#44645f",
      backgroundColor: "#fcf9f4",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«تو تمنای من و یار من و جان منی، پس بمان تا که نمانم به تمنای کسی»",
      blessingLine:
        "«بنمای رخ که باغ و گلستانم آرزوست، بگشای لب که قند فراوانم آرزوست»",
      dressCode:
        "پوشش رسمی شب با تم زمردی و طلایی. خواهشمندیم بانوان از لباس کاملاً سفید پرهیز کنند.",
      musicTitle: "نوای عاشقانه جشن",
    },
  },
  {
    key: "midnight-rose-v1",
    name: "شب سرمه‌ای",
    version: "1.0.0",
    description:
      "پاکت مخملی سرمه‌ای با مهر رزگلد؛ کارت تیره و طلایی با شعر، برنامه جشن، پالت لباس و اعلام حضور.",
    categorySlugs: ["luxury", "classic", "romantic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#1a2236 0%,#0d131f 50%,#e8b4a0 100%)",
    defaultCustomization: {
      primaryColor: "#e8b4a0",
      secondaryColor: "#f2ca50",
      backgroundColor: "#0d131f",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«زهی بزم و زهی می و زهی ساقی که ما داریم، زهی شادی و آبادی که در دولتسرا داریم»",
      blessingLine:
        "باارزش‌ترین هدیه، حضور پرمهر و دعای خیر شما در آغاز این پیوند است.",
      dressCode:
        "پوشش رسمی (Black-Tie). خوشحال می‌شویم با پالت هارمونیک بزم سلطنتی همراه باشید.",
      musicTitle: "نغمه اختصاصی پیوند",
    },
  },
  {
    key: "crimson-velvet-v1",
    name: "مخمل زرشکی",
    version: "1.0.0",
    description:
      "پاکت زرشکی با مهر طلایی و کارت طاقی بلند؛ کارت فقط پس از گشودن پاکت بیرون می‌آید.",
    categorySlugs: ["luxury", "traditional", "romantic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#491b21 0%,#2c050b 50%,#dfb76c 100%)",
    defaultCustomization: {
      primaryColor: "#fdd385",
      secondaryColor: "#dfb76c",
      backgroundColor: "#2c050b",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«زهی عشق زهی عشق که ما راست خدایا، چه نغزست و چه خوبست و چه زیباست خدایا»",
      blessingLine:
        "ارزشمندترین پیشکش، گرمای قدم‌های شماست؛ حضورتان بزم ما را کامل می‌کند.",
      dressCode:
        "کد پوشش: Black Tie و شب رسمی. بانوان: لباس شب بلند · آقایان: تاکسیدو یا کت‌وشلوار تیره.",
      musicTitle: "نغمه عاشقانه شب پیوند",
    },
  },
  {
    key: "turquoise-tile-v1",
    name: "کاشی فیروزه",
    version: "1.0.0",
    description:
      "پاکت فیروزه‌ای با نقش کاشی ایرانی و مهر ستاره‌ی طلایی؛ کارت عاجی با قاب طاقی، ستاره‌های ریزان و جزئیات کامل جشن.",
    categorySlugs: ["traditional", "luxury", "romantic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#f6f1e7 0%,#1f7a7a 55%,#c9a24e 100%)",
    defaultCustomization: {
      primaryColor: "#1f7a7a",
      secondaryColor: "#c9a24e",
      backgroundColor: "#f6f1e7",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«ما ز آغاز و ز انجام جهان بی‌خبریم، اول و آخر این کهنه کتاب افتاده‌ست»",
      blessingLine:
        "حضور گرمتان زیباترین هدیه است؛ دلمان می‌خواهد این شب را با شما جشن بگیریم.",
      dressCode:
        "پوشش رسمی و شیک با الهام از رنگ‌های کاشی ایرانی؛ فیروزه‌ای، طلایی، عاجی و لاجوردی.",
      musicTitle: "نوای سه‌تار باغ فیروزه",
    },
  },
  {
    key: "vinyl-love-v1",
    name: "صفحه‌ی گرام",
    version: "1.0.0",
    description:
      "دعوت‌نامه‌ای به شکل آلبوم موسیقی رترو؛ صفحه از کاور بیرون می‌آید و می‌چرخد، برنامه‌ی جشن فهرست قطعه‌هاست و محل جشن بلیت کنسرت.",
    categorySlugs: ["modern", "romantic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#f3ead7 0%,#e0a526 50%,#1b1712 100%)",
    defaultCustomization: {
      primaryColor: "#e0a526",
      secondaryColor: "#d9622b",
      backgroundColor: "#f3ead7",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«تو آن ترانه‌ای که هزار بار شنیدم و هنوز تازه‌ای»",
      blessingLine:
        "حضورتان زیباترین آهنگ این آلبوم است؛ بیایید این شب را با هم بنوازیم.",
      dressCode:
        "شیک و رنگی، با حال‌وهوای رترو! هر رنگی که با یکی از نسخه‌های این آلبوم جور باشد عالی است.",
      musicTitle: "Our Song — نسخه‌ی ویژه",
    },
  },
  {
    key: "love-chat-v1",
    name: "گفت‌وگوی عاشقانه",
    version: "1.0.0",
    description:
      "دعوت‌نامه به شکل چت در پیام‌رسان؛ از صفحه‌ی قفل گوشی با یک اعلان شروع می‌شود و زوج پیام‌به‌پیام خبر عروسی، لوکیشن، برنامه و نظرسنجی حضور را می‌فرستند.",
    categorySlugs: ["modern", "minimal"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#6d4aff 0%,#a35bff 50%,#ff6fa3 100%)",
    defaultCustomization: {
      primaryColor: "#6d4aff",
      secondaryColor: "#ff6fa3",
      backgroundColor: "#f3effa",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«هر کجا هستم، باشم؛ آسمان مال من است» — از امروز مال ما",
      blessingLine: "منتظرتیم! بدون تو این جشن یه چیزی کم داره.",
      dressCode:
        "رسمی ولی راحت؛ اگه یه چیز بنفش یا صورتی داشته باشی که دیگه عالیه.",
      musicTitle: "آهنگ ما",
    },
  },
  {
    key: "scratch-reveal-v1",
    name: "راز طلایی",
    version: "1.0.0",
    description:
      "کارت خراشیدنی؛ مهمان سه دایره‌ی طلایی «کِی، کجا، ساعت» را با انگشت خراش می‌دهد و بعد با انفجار کاغذرنگی، کل دعوت‌نامه نمایان می‌شود.",
    categorySlugs: ["modern", "romantic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#fde7e1 0%,#d46a7e 55%,#c9a050 100%)",
    defaultCustomization: {
      primaryColor: "#d46a7e",
      secondaryColor: "#c9a050",
      backgroundColor: "#fdf3ef",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«عشق آمد و شد چو خونم اندر رگ و پوست»",
      blessingLine: "حضور تو، شیرین‌ترین بخش این راز است.",
      dressCode: "شیک و رسمی؛ با رنگ‌های گرم و ملایم مثل رز و طلایی.",
      musicTitle: "ترانه‌ی ما",
    },
  },
  {
    key: "starry-night-v1",
    name: "شب پرستاره",
    version: "1.0.0",
    description:
      "آسمان شب با ستاره‌های چشمک‌زن و شهاب؛ مهمان ستاره‌ها را لمس می‌کند تا صورت‌فلکی قلب کامل شود، آسمان روشن می‌شود و دعوت‌نامه با نقشه‌ی ستاره‌ها و مدار جشن ظاهر می‌شود.",
    categorySlugs: ["luxury", "romantic", "modern"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#03051a 0%,#141a3d 45%,#2a1745 80%,#f2d38a 100%)",
    defaultCustomization: {
      primaryColor: "#f2d38a",
      secondaryColor: "#b9a8ff",
      backgroundColor: "#060a1f",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«ما ز بالاییم و بالا می‌رویم، ما ز دریاییم و دریا می‌رویم»",
      blessingLine:
        "در آسمان این شب، روشن‌ترین ستاره حضور توست. منتظرت هستیم.",
      dressCode:
        "پوشش رسمی شب؛ رنگ‌های آسمان شب مثل سرمه‌ای، یاسی، طلایی و صورتی ملایم.",
      musicTitle: "نوای کهکشان",
    },
  },
  {
    key: "mixtape-love-v1",
    name: "نوار کاست",
    version: "1.0.0",
    description:
      "میکس‌تیپ نوستالژیک دهه‌ی هفتاد؛ مهمان کاست را داخل ضبط می‌گذارد و Play می‌زند، قرقره‌ها می‌چرخند و دعوت‌نامه با ساید A و B، رادیوی FM و خط درخواست آهنگ پخش می‌شود.",
    categorySlugs: ["vintage", "romantic", "modern"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(160deg,#f6efe2 0%,#ffd84d 35%,#ff6b5b 70%,#3a3a5c 100%)",
    defaultCustomization: {
      primaryColor: "#ff6b5b",
      secondaryColor: "#5ec2b0",
      backgroundColor: "#f6efe2",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«هر ترانه‌ای که دوست داشتم، یک جایی وسطش اسم تو بود»",
      blessingLine:
        "این نوار بدون صدای خنده‌ی شما کامل نمی‌شود؛ بیایید آخرین ترکش را با هم ضبط کنیم.",
      dressCode:
        "حال‌وهوای دهه‌ی هفتاد و هشتاد! رنگ‌های شاد پاستلی، پیراهن گل‌دار یا هر چیزی که با رنگ یکی از این کاست‌ها جور باشد.",
      musicTitle: "میکس‌تیپ ما — ساید A",
    },
  },
  {
    key: "rose-bloom-v1",
    name: "شکوفه‌ی عشق",
    version: "1.0.0",
    description:
      "غنچه‌ی رز سرخی که با نگه داشتن قلب آرام‌آرام می‌شکفد؛ گلبرگ‌ها می‌بارند و نامه‌ی عاشقانه با عکس قلبی، قصه‌ی عشق، برنامه‌ی شب و ارسال قلب نمایان می‌شود.",
    categorySlugs: ["romantic", "floral", "luxury"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(160deg,#fff7f5 0%,#fde8ec 40%,#e8a0ae 70%,#b3123c 100%)",
    defaultCustomization: {
      primaryColor: "#b3123c",
      secondaryColor: "#c9a35a",
      backgroundColor: "#fff7f5",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«هرگز نمیرد آن که دلش زنده شد به عشق، ثبت است بر جریده‌ی عالم دوام ما»",
      blessingLine:
        "عشق ما با حضور شما کامل می‌شود؛ بیایید تا این شب را با گلبرگ و لبخند به خاطره‌ای همیشگی بدل کنیم.",
      dressCode:
        "پوشش رسمی و رمانتیک؛ رنگ‌های گل رز مثل سرخ، صورتی ملایم، شیری و طلایی را دوست داریم.",
      musicTitle: "ترانه‌ی عاشقانه‌ی ما",
    },
  },
];

