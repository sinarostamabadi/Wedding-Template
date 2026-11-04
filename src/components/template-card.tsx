"use client";

import Link from "next/link";
import { sampleInvitation, type TemplateEntry } from "@/lib/templates";
import { getTemplateDefinition } from "@/templates/registry";

export function TemplateCard({ template }: { template: TemplateEntry }) {
  const definition = getTemplateDefinition(template.key);
  if (!definition) return null;
  const Renderer = definition.Renderer;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(41,39,37,0.07)] ring-1 ring-champagne/45 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(41,39,37,0.11)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f4efe8]">
        <div
          aria-hidden
          inert
          className="pointer-events-none absolute inset-0 origin-top scale-[0.92] [&_.fixed]:hidden"
        >
          <Renderer
            preview
            data={sampleInvitation}
            customization={definition.defaultCustomization}
            features={{
              countdown: true,
              map: true,
              rsvp: true,
              music: true,
              gallery: false,
              guestMessage: false,
            }}
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
        <Link
          href={`/templates/${template.slug}`}
          className="absolute inset-0 z-10 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-deep-sage/35"
          aria-label={`پیش‌نمایش ${template.name}`}
        />
      </div>

      <div className="space-y-2 border-t border-champagne/30 px-4 py-3.5">
        <h3 className="font-display text-xl text-charcoal">{template.name}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-charcoal/60">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {template.categoryLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-[#f4efe8] px-2 py-0.5 text-[11px] text-charcoal/65"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="pt-1">
          <Link
            href={`/templates/${template.slug}`}
            className="block rounded-xl bg-deep-sage px-3 py-2 text-center text-sm text-ivory transition hover:bg-deep-sage/90"
          >
            پیش‌نمایش
          </Link>
        </div>
      </div>
    </article>
  );
}
