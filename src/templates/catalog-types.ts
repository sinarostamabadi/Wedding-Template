import type { TemplateCustomization } from "./types";

export type TemplateCatalogItem = {
  key: string;
  name: string;
  version: string;
  description: string;
  categorySlugs: string[];
  isFree: boolean;
  price: number;
  thumbnailGradient: string;
  defaultCustomization: TemplateCustomization;
};
