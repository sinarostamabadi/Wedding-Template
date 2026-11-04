export const BRAND = {
  name: "دعوت‌نامه دیجیتال",
  nameEn: "Digital Invitation",
} as const;

/** لینک سفارش (اختیاری) — در Vercel با NEXT_PUBLIC_ORDER_URL تنظیم کنید */
export const ORDER_URL = process.env.NEXT_PUBLIC_ORDER_URL || "";
