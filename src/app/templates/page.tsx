import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { TemplateGallery } from "@/components/template-gallery";

export const metadata: Metadata = {
  title: "قالب‌ها",
  description: "مجموعه قالب‌های حرفه‌ای کارت دعوت دیجیتال عروسی",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-4">
        <div className="max-w-2xl">
          <p className="text-sm text-muted-gold">کارت دعوت دیجیتال عروسی</p>
          <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">
            قالب‌ها
          </h1>
          <p className="mt-3 leading-8 text-charcoal/70">
            هر قالب را با پیش‌نمایش زنده ببینید.
            ساخت و شخصی‌سازی کارت توسط تیم ما انجام می‌شود.
          </p>
        </div>
        <TemplateGallery />
      </section>
    </main>
  );
}
