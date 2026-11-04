import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { TemplateDetails } from "@/components/template-details";
import {
  getTemplateBySlug,
  sampleFeatures,
  sampleInvitation,
  templates,
} from "@/lib/templates";
import { getTemplateDefinition } from "@/templates/registry";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return { title: "پیش‌نمایش قالب" };
  return {
    title: `پیش‌نمایش ${template.name}`,
    description: template.description,
    openGraph: template.cover ? { images: [{ url: template.cover }] } : undefined,
  };
}

export default async function TemplatePreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();
  const definition = getTemplateDefinition(template.key);
  if (!definition) notFound();

  const Renderer = definition.Renderer;
  const others = templates.filter((t) => t.slug !== template.slug);

  return (
    <div className="min-h-screen md:bg-[#F4F0EA]">
      {/* Tablet top bar */}
      <div className="hidden border-b border-black/5 bg-[#fffcf7]/92 md:block xl:hidden">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/templates"
            className="flex items-center gap-1 text-sm text-charcoal/70 hover:text-charcoal"
          >
            <ArrowRight className="h-4 w-4" />
            قالب‌ها
          </Link>
          <p className="truncate text-sm font-medium text-deep-sage">
            {template.name}
          </p>
        </div>
      </div>

      {/* Desktop side panels */}
      <aside className="fixed right-8 top-6 bottom-6 z-40 hidden w-[320px] overflow-y-auto rounded-3xl bg-white/85 p-6 shadow-[0_18px_40px_rgba(41,39,37,0.08)] ring-1 ring-champagne/40 backdrop-blur xl:block 2xl:right-12 2xl:w-[360px]">
        <Link
          href="/templates"
          className="mb-5 inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-charcoal"
        >
          <ArrowRight className="h-4 w-4" />
          همه قالب‌ها
        </Link>
        <TemplateDetails template={template} />
      </aside>

      <aside className="fixed left-8 top-6 bottom-6 z-40 hidden w-[260px] overflow-y-auto rounded-3xl bg-white/85 p-5 shadow-[0_18px_40px_rgba(41,39,37,0.08)] ring-1 ring-champagne/40 backdrop-blur xl:block 2xl:left-12 2xl:w-[300px]">
        <p className="mb-3 text-xs font-medium text-charcoal/50">قالب‌های دیگر</p>
        <div className="space-y-2">
          {others.map((item) => (
            <Link
              key={item.slug}
              href={`/templates/${item.slug}`}
              className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[#f4efe8]"
            >
              <span
                className="h-14 w-11 shrink-0 rounded-lg bg-cover bg-center ring-1 ring-black/5"
                style={{
                  backgroundImage: item.cover
                    ? `url(${item.cover})`
                    : item.thumbnailGradient,
                }}
              />
              <span className="min-w-0">
                <span className="block truncate text-sm text-charcoal">
                  {item.name}
                </span>
                <span className="block truncate text-[11px] text-charcoal/50">
                  {item.categoryLabels.join("، ")}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Mobile floating actions */}
      <div className="fixed bottom-20 left-4 z-[60] flex flex-col gap-2 md:hidden">
        <Link
          href="/templates"
          aria-label="بازگشت"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/90 text-charcoal shadow-lg backdrop-blur"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="w-full overflow-x-hidden md:mx-auto md:min-h-screen md:max-w-md md:shadow-[0_0_60px_rgba(0,0,0,0.18)]">
        <Renderer
          preview
          data={sampleInvitation}
          customization={definition.defaultCustomization}
          features={sampleFeatures}
        />
      </div>
    </div>
  );
}
