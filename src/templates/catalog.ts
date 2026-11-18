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
  {
    key: "moonlit-garden-v1",
    name: "باغ مهتاب",
    version: "1.0.0",
    description:
      "دعوت‌نامه‌ی شبانه با دروازه‌ی طلایی باغ ایرانی؛ مهر ماه را لمس کنید تا درها بگشایند و شبِ پیوند با شب‌تاب‌ها، گلبرگ‌های یاس و نوای بلبل آغاز شود.",
    categorySlugs: ["luxury", "romantic", "nature"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#0a1410 0%,#1d3b2a 48%,#e9c87c 100%)",
    defaultCustomization: {
      primaryColor: "#e9c87c",
      secondaryColor: "#a9c4b0",
      backgroundColor: "#0a1410",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«بنشین بر لب جوی و گذر عمر نظر کن»",
      blessingLine: "در باغ پیوند ما، زیباترین شکوفه، حضور شماست",
      dressCode:
        "پوشش رسمی شب با الهام از باغ ایرانی؛ طیف سبز یشمی، طلاییِ مهتاب، عاجی و گل‌بهی.",
      musicTitle: "نوای بلبل و تار",
    },
  },
  {
    key: "mirror-hall-v1",
    name: "تالار آینه",
    version: "1.0.0",
    description:
      "دعوت‌نامه‌ی آینه‌کاری ایرانی؛ شمع‌های سفره‌ی عقد را یکی‌یکی بیفروزید تا با هر شمع، تراشه‌های بلور تالار موجی از نور بگیرند و دعوت‌نامه در آینه نمایان شود.",
    categorySlugs: ["luxury", "traditional", "classic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(160deg,#191321 0%,#3d2b52 48%,#e6c66e 100%)",
    defaultCustomization: {
      primaryColor: "#e6c66e",
      secondaryColor: "#dfe6ee",
      backgroundColor: "#191321",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«سال‌ها دل طلبِ جامِ جم از ما می‌کرد، و آنچه خود داشت ز بیگانه تمنا می‌کرد»",
      blessingLine: "حضور گرمِ شما، روشن‌ترین چراغِ این تالار است",
      dressCode:
        "پوشش رسمی شب با تم بلور و طلایی. خواهشمندیم بانوان محترم به احترام عروس، از لباس کاملاً سفید پرهیز نمایند.",
      musicTitle: "نوای سه‌تار و عود",
    },
  },
  {
    key: "qartas-v1",
    name: "قرطاس",
    version: "1.0.0",
    description:
      "دعوت‌نامه به شکل نسخه‌ی خطی ایرانِ قدیم؛ جلدِ لاکی شنگرف را بگشایید، ورق بزنید و شعر حافظ، شمسه‌ی عکس زوج و جزئیات جشن را در قرطاسی تذهیب‌شده با پالت لاجورد و شنگرف بخوانید.",
    categorySlugs: ["traditional", "classic", "vintage"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(160deg,#16214e 0%,#26336e 45%,#b23a2e 100%)",
    defaultCustomization: {
      primaryColor: "#d9b45b",
      secondaryColor: "#26336e",
      backgroundColor: "#16214e",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«بده ساقی می باقی که در جنت نخواهی یافت»",
      blessingLine: "حضور شما، نگارین‌ترین ورقِ این دیوان است",
      dressCode:
        "پوشش رسمی با الهام از نسخه‌های خطی ایران؛ طیف لاجوردی، شنگرف، طلایی و کرم. لطفاً از لباس کاملاً سفید پرهیز کنید.",
      musicTitle: "نوای تار و کمانچه",
    },
  },
  {
    key: "sky-lanterns-v1",
    name: "شبِ فانوس",
    version: "1.0.0",
    description:
      "دعوت‌نامه‌ی شبِ رهاییِ فانوس‌ها؛ فانوسِ آویزانِ زوج را بیفروزید و رها کنید تا در آن لحظه، آسمان پر از فانوس‌های شناور شود و دعوت‌نامه در نورِ کهربایی گشوده گردد.",
    categorySlugs: ["romantic", "luxury", "dark"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#101a3c 0%,#1c2c5e 48%,#ffb347 100%)",
    defaultCustomization: {
      primaryColor: "#ffb347",
      secondaryColor: "#101a3c",
      backgroundColor: "#101a3c",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«هزار فانوس برمی‌داریم، سوی آسمانِ آرزو»",
      blessingLine: "حضور شما، روشن‌ترین فانوسِ این آسمان است",
      dressCode:
        "پوشش رسمی شب با تمِ شبِ فانوس؛ طیف لاجوردی، کهربایی، مرجانی و کرم. لطفاً از لباس کاملاً سفید پرهیز کنید.",
      musicTitle: "نوای تار و آوازِ شب",
    },
  },
  {
    key: "heart-locket-v1",
    name: "آویزِ دل",
    version: "1.0.0",
    description:
      "آویز قلب رزگلدی که از زنجیر تاب می‌خورد؛ قفلش را باز کنید تا درِ آویز روی لولا بچرخد، عکس زوج در قاب قلبی بدرخشد و نام و تاریخ روی درِ آویز حک شده باشد.",
    categorySlugs: ["romantic", "luxury", "classic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#2f1020 0%,#6b2b3c 48%,#e8a184 100%)",
    defaultCustomization: {
      primaryColor: "#e8a184",
      secondaryColor: "#c96f6a",
      backgroundColor: "#2f1020",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«دو قلب که به هم گره خوردند، ابدی شدند»",
      blessingLine: "حضور شما، درخشان‌ترین نگینِ این آویز است",
      dressCode:
        "پوشش رسمی با پالتِ عاشقانه؛ طیف شرابیِ عمیق، رزگلد، پودری و مرجانی. لطفاً از لباس کاملاً سفید پرهیز کنید.",
      musicTitle: "نوای پیانوی عاشقانه",
    },
  },
  {
    key: "qajar-scroll-v1",
    name: "قباله‌ی قجری",
    version: "1.0.0",
    description:
      "طوماری به سبک ایران قدیم با مهر موم لاکی؛ با شکستن مهر، قباله‌ی دعوت با تذهیب طلایی و بته‌جقه باز می‌شود و سفره‌ی عقد، تمبر یادگاری و پاسخ مهرشده نمایان می‌شود.",
    categorySlugs: ["traditional", "vintage", "luxury"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#1a0e08 0%,#2a1810 40%,#8c1c13 72%,#c8a24a 100%)",
    defaultCustomization: {
      primaryColor: "#c8a24a",
      secondaryColor: "#8c1c13",
      backgroundColor: "#2a1810",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«من از آن روز که دربند توام آزادم، پادشاهم که به دست تو اسیر افتادم»",
      blessingLine:
        "قدوم سبزتان چراغ این مجلس است؛ سایه‌تان بر سر این پیوند، مایه‌ی برکت و شادی.",
      dressCode:
        "پوشش رسمی با الهام از رنگ‌های ایران قدیم؛ لاجوردی، فیروزه‌ای، لاکی و زرین.",
      musicTitle: "نوای تار — بیات اصفهان",
    },
  },
  {
    key: "retro-sixties-v1",
    name: "عروسی دهه‌ی شصت",
    version: "1.0.0",
    description:
      "نوستالژی دهه‌ی شصت ایران؛ تلویزیون چوبی را روشن کنید تا بعد از برفک و نوار رنگی، دعوت‌نامه پخش شود. با کوپن‌های جشن، تقویم ورقی، پیکان عروس، تلفن قرصی و ریسه‌های رنگی.",
    categorySlugs: ["vintage", "traditional", "modern"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(160deg,#efe6d2 0%,#d9a441 38%,#c4562b 70%,#4a3426 100%)",
    defaultCustomization: {
      primaryColor: "#c4562b",
      secondaryColor: "#d9a441",
      backgroundColor: "#efe6d2",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«گل اومد بهار اومد، میرم به پیشوازش؛ عروس خانم قشنگه، داماد نمی‌شه نازش»",
      blessingLine:
        "مبارک باشه ایشالا! قدمتون روی چشم؛ مثل همون عروسی‌های قدیمی، با صفا و بی‌ریا منتظرتونیم.",
      dressCode:
        "حال‌وهوای دهه‌ی شصت! کت‌وشلوار ساده، پیراهن یقه‌دار و رنگ‌های گرم مثل قهوه‌ای، خردلی، یشمی و آجری.",
      musicTitle: "نوار «مبارک بادا» — سمت الف",
    },
  },
  {
    key: "persepolis-seal-v1",
    name: "لوح پارسه",
    version: "1.0.0",
    description:
      "ایران باستان و هخامنشی؛ مهر استوانه‌ای را روی لوح گِلی بغلتانید تا نام زوج با خط میخی نقش ببندد، لوح پخته شود و فرمان پیوند با سه پیمان کهن، ستون‌های تخت جمشید و آتشدان گواهی گشوده شود.",
    categorySlugs: ["traditional", "luxury", "classic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#efe5cf 0%,#c9a13b 40%,#9c4a2a 70%,#1f3a6b 100%)",
    defaultCustomization: {
      primaryColor: "#c9a13b",
      secondaryColor: "#1f3a6b",
      backgroundColor: "#e8dcc4",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«به نام خداوند جان و خرد، کزین برتر اندیشه برنگذرد»",
      blessingLine: "شاد زی و دیر زی! حضور شما، فرخنده‌ترین گواه پیمان ماست.",
      dressCode:
        "پوشش رسمی با الهام از کاشی‌های لعابی شوش و تخت جمشید؛ لاجوردی، فیروزه‌ای، زرین و سفالی.",
      musicTitle: "نوای چنگ و نی",
    },
  },
  {
    key: "gilded-deco-v1",
    name: "عصر طلایی",
    version: "1.0.0",
    description:
      "آرت‌دکوی عصر طلایی؛ بادبزن طلاییِ سیزده‌پره با لمس شما می‌گشاید، کارت عاجی با قاب طاقی و مونوگرام، تایم‌لاین شب جشن و پاسخ با مهر طلایی.",
    categorySlugs: ["luxury", "classic", "dark", "modern"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#0b0a09 0%,#c9a227 42%,#f4e3b0 68%,#1d1915 100%)",
    defaultCustomization: {
      primaryColor: "#c9a227",
      secondaryColor: "#8a6a1f",
      backgroundColor: "#0b0a09",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«درخشش یک عمر، در یک شبِ طلایی»",
      blessingLine:
        "طلایی‌ترین شب زندگی‌مان را با حضورتان کامل کنید؛ جای شما همیشه در خاطره‌ی این شب می‌درخشد.",
      dressCode:
        "پوشش رسمی با درخششی از عصر طلایی: مشکی، طلایی، زمردی و عاجی. لطفاً از پوشش تمام‌سفید پرهیز کنید.",
      musicTitle: "گرامافون · نوای جاز تهران",
    },
  },
  {
    key: "orsi-palace-v1",
    name: "ارسیِ هفت‌رنگ",
    version: "1.0.0",
    description:
      "عمارت ایرانی با پنجره‌ی اُرسیِ متحرک و شیشه‌های هفت‌رنگ؛ با لمس چفت طلایی، اُرسی بالا می‌رود، پرتوهای یاقوتی و زمردی بر تالار می‌تابد و حوض فیروزه آرزوی مهمانان را ثبت می‌کند.",
    categorySlugs: ["luxury", "traditional", "romantic", "classic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#140d09 0%,#c82846 32%,#e59a28 58%,#1e8c8a 82%,#d4a84f 100%)",
    defaultCustomization: {
      primaryColor: "#d4a84f",
      secondaryColor: "#1e8c8a",
      backgroundColor: "#140d09",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«رواقِ منظرِ چشمِ من آشیانه‌ی توست، کرم نما و فرود آ که خانه خانه‌ی توست»",
      blessingLine:
        "در پناهِ نورِ هفت‌رنگ و طاقِ بلندِ عشق، قدومِ پرمهرتان روشنایی‌بخشِ شبِ پیوندِ ماست.",
      dressCode:
        "پوشش رسمی شب با الهام از شیشه‌های هفت‌رنگِ اُرسی؛ طیف یاقوتی، زمردی، کهربایی، لاجوردی و حریری عاجی.",
      musicTitle: "سنتور و تار · چهارمضرابِ نارنجستان",
    },
  },
  {
    key: "silk-knot-v1",
    name: "گرهِ ابریشم",
    version: "1.0.0",
    description:
      "نئومینیمالیسم عاشقانه روی کاغذ کتان با لفافِ کالکِ مات؛ رشته‌ی ابریشم سرخ را لمس کنید تا گرهِ ابدی بسته شود، لفاف کنار برود و دعوت‌نامه با تایپوگرافی مجسمه‌گونه و مهر برجستهٔ خشک نمایان شود.",
    categorySlugs: ["minimal", "romantic", "modern", "luxury"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#f6f2ec 0%,#e6d2c9 45%,#b86456 78%,#1d1816 100%)",
    defaultCustomization: {
      primaryColor: "#b86456",
      secondaryColor: "#8c7a6b",
      backgroundColor: "#f6f2ec",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«در سادگیِ بودنِ با تو، تمامِ جهان خلاصه شده است»",
      blessingLine:
        "حضورِ آرام و پرمهرِ شما، زیباترین سطرِ کتابِ زندگیِ ماست.",
      dressCode:
        "مینیمال و شاعرانه (Minimal Formal)؛ پارچه‌های لطیف با تناژهای رز خاکی، پودری، سنگی، زیتونی مات و اسپرسو.",
      musicTitle: "سولوی پیانو و ویلنسل · قطعهٔ ابریشم",
    },
  },
  {
    key: "aurora-prism-v1",
    name: "منشورِ بلورین",
    version: "1.0.0",
    description:
      "دعوت‌نامهٔ مدرن و عاشقانه با شیشه‌های مایع (Liquid Glass) و هاله‌های شفق؛ با لمس منشور، دو مدارِ نورِ زوج هم‌گرا می‌شوند، قصهٔ آشنایی ورق می‌خورد و کارتِ ورودِ بلورین صادر می‌گردد.",
    categorySlugs: ["modern", "romantic", "luxury", "dark"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#120b18 0%,#2b1938 38%,#f4a6b8 72%,#f5d69b 100%)",
    defaultCustomization: {
      primaryColor: "#f4a6b8",
      secondaryColor: "#f5d69b",
      backgroundColor: "#120b18",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«دو مدارِ سرگردان بودیم؛ در جاذبه‌ی عشق به یک ستاره بدل شدیم»",
      blessingLine:
        "درخششِ این شب با حضورِ پرمهرِ شما به ابدیت پیوند می‌خورد.",
      dressCode:
        "استایل رسمی و مدرنِ شب (Modern Black-Tie & Glamour)؛ طیف رزکوارتز، شامپاینی، یاسی بلورین و مخمل شب.",
      musicTitle: "سمفونیِ شفق · پیانو و زهیِ مدرن",
    },
  },
  {
    key: "magnolia-waltz-v1",
    name: "والسِ مگنولیا",
    version: "1.0.0",
    description:
      "گلخانه‌ی بلورین با شاخه‌های شکوفای مگنولیا و بارش گلبرگ‌های رز؛ با لمس مهرِ مومِ رزگلد، روبان ابریشمی باز می‌شود و نامه‌ی عاشقانه، عهدنامه‌ی عروس و داماد و تقویم قلب‌دار نمایان می‌گردد.",
    categorySlugs: ["romantic", "floral", "luxury", "classic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#fcf7f4 0%,#f4cfd6 42%,#c79d59 74%,#732235 100%)",
    defaultCustomization: {
      primaryColor: "#b5566a",
      secondaryColor: "#c79d59",
      backgroundColor: "#fcf7f4",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«مرا عهدیست با جانان که تا جان در بدن دارم، هوادارانِ کویش را چو جانِ خویشتن دارم»",
      blessingLine:
        "در باغِ زندگیِ ما، زیباترین شکوفه، لبخند و حضورِ پرمهرِ شماست.",
      dressCode:
        "پوشش رسمی و رمانتیک (Garden Formal)؛ طیف رز پودری، شامپاینی، شرابی مخملی، سبز مریم‌گلی و مشکی رسمی.",
      musicTitle: "والسِ مگنولیا · سولوی ویولن و پیانو",
    },
  },
  {
    key: "yadegari-diary-v1",
    name: "دفتر یادگاری",
    version: "1.0.0",
    description:
      "عاشقانه‌ی دهه‌ی شصت؛ کلید قفل دفتر یادگاری گلدار را بچرخانید تا جلدش باز شود و نامه‌ی «ملالی نیست جز دوری شما»، عکس چسب‌خورده، گل خشک لای دفتر، نامه‌ی قلبی تاشده، کارت پستال و برگه‌ی یادگاری مهمان پیدا شود.",
    categorySlugs: ["romantic", "vintage", "traditional"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(160deg,#f7e6dc 0%,#e58a9a 38%,#b8475a 68%,#1f3c88 100%)",
    defaultCustomization: {
      primaryColor: "#b8475a",
      secondaryColor: "#1f3c88",
      backgroundColor: "#f4e1d6",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«دلم را لای این دفتر گذاشتم، به یادگار، برای تو»",
      blessingLine:
        "این دفتر را نگه دار؛ روزی که موهایمان سپید شد، با هم ورقش می‌زنیم",
      dressCode:
        "حال‌وهوای عاشقانه‌ی دهه‌ی شصت؛ صورتی چرک، زرشکی، کرم و یشمی. پیراهن گلدار و کت‌وشلوار ساده، خیلی هم عالی!",
      musicTitle: "نوار ترانه‌های عاشقانه‌ی قدیمی",
    },
  },
  {
    key: "pearl-silk-v1",
    name: "مروارید و حریر",
    version: "1.0.0",
    description:
      "پاکت حریری پودری با قفل مرواریدی؛ گره مروارید را باز کنید تا حریر کنار برود، عکس زوج بدرخشد و دعوت‌نامه‌ای لطیف با پالت رزکوارتز و شامپاینی نمایان شود.",
    categorySlugs: ["romantic", "luxury", "floral"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(160deg,#fff8f4 0%,#f3d6dc 40%,#c47884 72%,#d4b896 100%)",
    defaultCustomization: {
      primaryColor: "#c47884",
      secondaryColor: "#d4b896",
      backgroundColor: "#f7ece8",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«تو را در حریر دل پیچیدم، با مرواریدِ نگاهت گره زدم»",
      blessingLine: "حضور شما، درخشان‌ترین مروارید این شب است",
      dressCode:
        "پوشش رسمی و لطیف؛ پودری، رزکوارتز، عاجی و شامپاینی. لطفاً از لباس کاملاً سفید پرهیز کنید.",
      musicTitle: "والس آرام پیانو و ویولن",
    },
  },
  {
    key: "wisteria-terrace-v1",
    name: "تراسِ ویستریا",
    version: "1.0.0",
    description:
      "تراس رمانتیک با خوشه‌های آویزان ویستریا؛ منگوله‌ی طلایی را لمس کنید تا پرده‌ی بنفش کنار برود، عکس زوج بدرخشد و نامه‌ی عاشقانه با سوییچر حال‌وهوا، فصل‌های عشق و عهدنامه نمایان شود.",
    categorySlugs: ["romantic", "floral", "luxury", "classic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#f7f4fb 0%,#e4d4f5 38%,#8b6bb0 70%,#c4a46a 100%)",
    defaultCustomization: {
      primaryColor: "#8b6bb0",
      secondaryColor: "#c4a46a",
      backgroundColor: "#f7f4fb",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«زیر سایه‌بان بنفش ویستریا، قول دادیم که همیشه هم‌قدمِ هم بمانیم»",
      blessingLine: "حضور شما، زیباترین خوشه‌ی آویخته‌ی این تراس است",
      dressCode:
        "پوشش رسمی و رمانتیک (Garden Formal)؛ طیف یاسی پودری، شامپاینی، بنفش مخملی، سبز باغ و مشکی رسمی.",
      musicTitle: "نکتورن ویستریا · پیانو و ویولن",
    },
  },
  {
    key: "ink-bloom-v1",
    name: "شکوفایی جوهر",
    version: "1.0.0",
    description:
      "حوض آبی آرام؛ یک قطره جوهر بچکانید تا در آب شکوفا شود، عکس زوج از دلِ جوهر بیرون بیاید و برگه‌های کاغذِ خیس با دعوت، تاریخ، موج‌های شب و اثر انگشت حضور روی آب شناور شوند.",
    categorySlugs: ["modern", "romantic", "luxury", "dark"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#e7eef4 0%,#8b3a4a 42%,#1a2744 78%,#b89a5a 100%)",
    defaultCustomization: {
      primaryColor: "#1a2744",
      secondaryColor: "#8b3a4a",
      backgroundColor: "#d9e2ea",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«دو قطره که در یک حوض افتادند و دیگر از هم جدا نشدند»",
      blessingLine: "اثر انگشت حضورتان، زیباترین لکهٔ این کاغذ است",
      dressCode:
        "پوشش آزادِ شاعرانه؛ لاجورد، شرابی جوهر، زیتونی مرکب و طلایی کهنه. سفید مطلق نپوشید.",
      musicTitle: "صدای آب و پیانو",
    },
  },
  {
    key: "arya-paradise-v1",
    name: "پردیسِ آریایی",
    version: "1.0.0",
    description:
      "باغ بهشتی آریایی با سرو و دروازه‌ی لاجوردی؛ مهرِ زرینِ گل‌نقش را لمس کنید تا درها باز شوند، عکس زوج بدرخشد و فرمان عاشقانه با چهار گاه شب، تقویم پیمان و پیشکشِ نیلوفر نمایان شود.",
    categorySlugs: ["traditional", "romantic", "luxury", "classic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#f3e9d5 0%,#c9a13b 35%,#1e3a6e 70%,#2a9d8f 100%)",
    defaultCustomization: {
      primaryColor: "#1e3a6e",
      secondaryColor: "#c9a13b",
      backgroundColor: "#f3e9d5",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«در پردیسِ دل، دو سرو کنار یک جوی روییدند و سایه‌شان تا ابد یکی شد»",
      blessingLine: "حضور شما، فرخنده‌ترین نقشِ این پردیس است",
      dressCode:
        "پوشش رسمی با الهام از باغ‌های آریایی؛ لاجورد، زرین، فیروزه، زعفرانی و سروی تیره.",
      musicTitle: "نوای چنگ و نی · چهارباغ",
    },
  },
  {
    key: "pars-waltz-v1",
    name: "والسِ پارسه",
    version: "1.0.0",
    description:
      "بارگاهِ رسمیِ هخامنشی با ستون‌های گاوسر، کنگره‌ی سنگی و مهرِ فروهر؛ روبانِ لاجوردی را بگشایید تا فرمان دعوت، گاه‌های شب، تقویم پیمان و پیشکشِ نیلوفر با همان رسمیتِ والسِ مگنولیا نمایان شود.",
    categorySlugs: ["traditional", "luxury", "classic", "romantic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#ebe4d4 0%,#c9a84a 35%,#1a3568 72%,#8b3a2a 100%)",
    defaultCustomization: {
      primaryColor: "#1a3568",
      secondaryColor: "#c9a84a",
      backgroundColor: "#ebe4d4",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«در بارگاهِ دل، دو ستون زیر یک سقف روییدند و سایه‌شان تا ابد یکی شد»",
      blessingLine: "حضور شما، فرخنده‌ترین نقشِ این بارگاه است.",
      dressCode:
        "پوشش رسمیِ شاهانه (Court Formal)؛ لاجورد، زرِ هخامنشی، فیروزه، سفال و سروی تیره.",
      musicTitle: "والسِ پارسه · چنگ و نیِ آپادانا",
    },
  },
  {
    key: "twin-orbit-v1",
    name: "مدارِ دو قلب",
    version: "1.0.0",
    description:
      "کهکشانِ سه‌بعدی با گوی بلورین، حلقه‌های درهم و صورت‌فلکی قلب؛ گوی را لمس کنید تا مدار باز شود و نامه، شمارش معکوس، برنامه شب و RSVP با انیمیشن‌های نرم Motion نمایان گردد.",
    categorySlugs: ["romantic", "luxury", "modern", "dark"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#0a0610 0%,#e8a0b0 42%,#d4b07a 72%,#f5e6d3 100%)",
    defaultCustomization: {
      primaryColor: "#e8a0b0",
      secondaryColor: "#d4b07a",
      backgroundColor: "#0a0610",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«دو قلب در یک مدار؛ تا ابد، بی‌انتها»",
      blessingLine: "حضور شما، درخشان‌ترین ستاره‌ی این شب است.",
      dressCode:
        "شیک و رمانتیک؛ رز پودری، شامپاینی طلایی، سرمه‌ای شب و مشکی مخملی.",
      musicTitle: "مدارِ دو قلب · پیانو و زهی",
    },
  },
  {
    key: "carpet-iran-v1",
    name: "فرشِ ایران",
    version: "1.0.0",
    description:
      "فرش‌نقشه‌ی ایران با نقش استان‌ها، حروف IRAN و طاق آزادی؛ مهر را لمس کنید تا فرش پهن شود و نامه، تقویم، نقشه‌ی شب و RSVP هفت‌رنگ با انیمیشن Motion نمایان گردد.",
    categorySlugs: ["traditional", "luxury", "classic", "romantic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#f3eee6 0%,#8b1e2d 35%,#1a2744 68%,#c4a35a 100%)",
    defaultCustomization: {
      primaryColor: "#8b1e2d",
      secondaryColor: "#c4a35a",
      backgroundColor: "#f3eee6",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine:
        "«دو تار دل روی یک دار؛ نقشی که تا ابد از هم جدا نمی‌شود»",
      blessingLine: "قدم‌تان روی فرشِ شادی ما، زیباترین گره این نقش است.",
      dressCode:
        "پوشش رسمی ایرانی؛ لاکی، لاجورد، زرِ کارگاه، حنایی و شیریِ پشم. الهام از فرش و کاشی هفت‌رنگ.",
      musicTitle: "فرشِ ایران · سنتور و کمانچه",
    },
  },

  {
    key: "love-loom-v1",
    name: "دارِ عشق",
    version: "1.0.0",
    description:
      "عکس عروس و داماد در طاق آزادی با قاب فرش و مهر زرین؛ حسِ ایران با حاشیه لاکی و نوار هفت‌رنگ، بدون نقشه در هیرو.",
    categorySlugs: ["traditional", "luxury", "classic", "romantic"],
    isFree: true,
    price: 0,
    thumbnailGradient:
      "linear-gradient(165deg,#f3eee6 0%,#8b1e2d 34%,#1a2744 68%,#c4a35a 100%)",
    defaultCustomization: {
      primaryColor: "#8b1e2d",
      secondaryColor: "#c4a35a",
      backgroundColor: "#f3eee6",
      showCountdown: true,
      showMap: true,
      showRsvp: true,
      poeticLine: "«دو تار روی یک دار؛ نقشی که تا ابد از هم جدا نمی‌شود»",
      blessingLine: "قدم‌تان روی این فرش، زیباترین گره‌ی نقش ماست.",
      dressCode:
        "پوشش رسمی ایرانی؛ لاکی، لاجورد، زرِ کارگاه، حنایی، فیروزه و شیری پشم.",
      musicTitle: "دارِ عشق · سنتور و کمانچه",
    },
  },
];
