import type { ReactNode } from "react";

export function TemplatesShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8">
      <div
        role="status"
        className="rounded-2xl border border-champagne/50 bg-white px-5 py-3.5 text-center shadow-[0_8px_22px_rgba(41,39,37,0.06)]"
      >
        <p className="font-display text-lg text-charcoal md:text-xl">
          عمارت شب‌های رویایی
        </p>
      </div>
      {children}
    </div>
  );
}
