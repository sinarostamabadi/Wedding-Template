# Wedding Templates Showcase

نمایش ایستای قالب‌های کارت دعوت دیجیتال (فقط فرانت‌اند، بدون بک‌اند).

## اجرا

```bash
npm install
npm run dev
```

## مسیرها

- `/templates` — لیست قالب‌ها با فیلتر دسته‌بندی
- `/templates/[slug]` — پیش‌نمایش کامل (دسکتاپ: ستون موبایل + پنل جزئیات، موبایل: تمام‌صفحه)
- `/templates/[slug]/details` — جزئیات قالب

## دیپلوی روی Vercel

پروژه را در گیت‌هاب push کنید و در Vercel ایمپورت کنید (Framework: Next.js). تنظیم خاصی لازم نیست.

متغیر اختیاری: `NEXT_PUBLIC_ORDER_URL` برای نمایش دکمه «سفارش».

## افزودن قالب جدید

1. Renderer را در `src/templates/renderers/<name>/index.tsx` بسازید.
2. در `src/templates/catalog.ts` و `src/templates/registry.ts` ثبت کنید.
3. کاور و ویژگی‌ها را در `src/lib/templates.ts` اضافه کنید.
