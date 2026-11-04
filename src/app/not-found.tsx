import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-3xl text-charcoal">صفحه پیدا نشد</p>
      <Link
        href="/templates"
        className="rounded-xl bg-deep-sage px-5 py-2.5 text-sm text-ivory"
      >
        بازگشت به قالب‌ها
      </Link>
    </main>
  );
}
