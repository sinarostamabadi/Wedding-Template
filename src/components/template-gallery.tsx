"use client";

import { useState } from "react";
import { TemplateCard } from "@/components/template-card";
import { templates, usedCategories } from "@/lib/templates";

export function TemplateGallery() {
  const [category, setCategory] = useState<string | null>(null);
  const visible = category
    ? templates.filter((t) => t.categorySlugs.includes(category))
    : templates;

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm transition ${
      active
        ? "bg-deep-sage text-ivory"
        : "bg-white/60 text-charcoal/75 hover:bg-white"
    }`;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={chip(category === null)}
        >
          همه ({templates.length})
        </button>
        {usedCategories.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setCategory(item.slug)}
            className={chip(category === item.slug)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((template) => (
          <TemplateCard key={template.key} template={template} />
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-champagne p-10 text-center text-charcoal/70">
          قالبی در این دسته‌بندی پیدا نشد.
        </div>
      ) : null}
    </>
  );
}
