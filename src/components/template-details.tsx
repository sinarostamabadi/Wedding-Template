import { Check } from "lucide-react";
import { ORDER_URL } from "@/lib/brand";
import { commonFeatures, type TemplateEntry } from "@/lib/templates";

export function TemplateDetails({ template }: { template: TemplateEntry }) {
  const palette = [
    template.defaultCustomization.primaryColor,
    template.defaultCustomization.secondaryColor,
    template.defaultCustomization.backgroundColor,
  ]
    .filter(Boolean) as string[];
  const uniquePalette = [...new Set(palette)];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-charcoal">
          {template.name}
        </h1>
        <p className="mt-2 text-sm leading-7 text-charcoal/65">
          {template.description}
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-charcoal/50">دسته‌بندی</p>
        <div className="flex flex-wrap gap-1.5">
          {template.categoryLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-[#f4efe8] px-2.5 py-1 text-xs text-charcoal/70"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-charcoal/50">پالت رنگی</p>
        <div className="flex gap-2">
          {uniquePalette.map((color) => (
            <span
              key={color}
              title={color}
              className="h-9 w-9 rounded-full border-2 border-white shadow ring-1 ring-black/5"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {template.highlights.length ? (
        <div>
          <p className="mb-2 text-xs font-medium text-charcoal/50">ویژگی‌های خاص</p>
          <ul className="space-y-1.5">
            {template.highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-charcoal/80"
              >
                <Check className="h-4 w-4 shrink-0 text-muted-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="mb-2 text-xs font-medium text-charcoal/50">امکانات</p>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {commonFeatures.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-charcoal/75"
            >
              <Check className="h-4 w-4 shrink-0 text-deep-sage" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        {ORDER_URL ? (
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-champagne/70 bg-white px-4 py-3 text-center text-sm text-charcoal transition hover:border-muted-gold"
          >
            سفارش این قالب
          </a>
        ) : null}
      </div>
    </div>
  );
}
