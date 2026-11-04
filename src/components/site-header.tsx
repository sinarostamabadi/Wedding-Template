import Link from "next/link";
import { BRAND, ORDER_URL } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
      <Link
        href="/templates"
        className="font-display text-xl tracking-tight text-deep-sage"
      >
        {BRAND.name}
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/templates"
          className="rounded-full px-4 py-2 text-charcoal/75 transition hover:bg-white/70 hover:text-charcoal"
        >
          قالب‌ها
        </Link>
        {ORDER_URL ? (
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-deep-sage px-4 py-2 text-ivory transition hover:bg-deep-sage/90"
          >
            سفارش کارت
          </a>
        ) : null}
      </nav>
    </header>
  );
}
