import { templateCatalog } from "./catalog";
import { CrimsonVelvetRenderer } from "./renderers/crimson-velvet";
import { DesertRoseStationeryRenderer } from "./renderers/desert-rose-stationery";
import { EmeraldSealRenderer } from "./renderers/emerald-seal";
import { LoveChatRenderer } from "./renderers/love-chat";
import { MidnightRoseRenderer } from "./renderers/midnight-rose";
import { MoonlitInkRenderer } from "./renderers/moonlit-ink";
import { PersianEditorialHauteRenderer } from "./renderers/persian-editorial-haute";
import { RoyalSuiteRenderer } from "./renderers/royal-suite";
import { ScratchRevealRenderer } from "./renderers/scratch-reveal";
import { MixtapeLoveRenderer } from "./renderers/mixtape-love";
import { RoseBloomRenderer } from "./renderers/rose-bloom";
import { StarryNightRenderer } from "./renderers/starry-night";
import { StationeryArchRenderer } from "./renderers/stationery-arch";
import { TurquoiseTileRenderer } from "./renderers/turquoise-tile";
import { VinylLoveRenderer } from "./renderers/vinyl-love";
import type { TemplateDefinition, TemplateRendererProps } from "./types";
import type { ComponentType } from "react";

/** وقتی تم جدید می‌سازیم، Renderer آن را اینجا ثبت کن. */
export const templateRenderers: Record<
  string,
  ComponentType<TemplateRendererProps>
> = {
  "persian-editorial-haute-v1": PersianEditorialHauteRenderer,
  "moonlit-ink-v1": MoonlitInkRenderer,
  "desert-rose-stationery-v1": DesertRoseStationeryRenderer,
  "royal-suite-v1": RoyalSuiteRenderer,
  "stationery-arch-v1": StationeryArchRenderer,
  "emerald-seal-v1": EmeraldSealRenderer,
  "midnight-rose-v1": MidnightRoseRenderer,
  "crimson-velvet-v1": CrimsonVelvetRenderer,
  "turquoise-tile-v1": TurquoiseTileRenderer,
  "vinyl-love-v1": VinylLoveRenderer,
  "love-chat-v1": LoveChatRenderer,
  "scratch-reveal-v1": ScratchRevealRenderer,
  "starry-night-v1": StarryNightRenderer,
  "mixtape-love-v1": MixtapeLoveRenderer,
  "rose-bloom-v1": RoseBloomRenderer,
};

export const templateDefinitions: TemplateDefinition[] = templateCatalog.map(
  (item) => {
    const Renderer = templateRenderers[item.key];
    if (!Renderer) {
      throw new Error(`Renderer missing for template key: ${item.key}`);
    }
    return { ...item, Renderer };
  },
);

const registry = new Map(
  templateDefinitions.map((definition) => [definition.key, definition]),
);

export function getTemplateDefinition(key: string) {
  return registry.get(key);
}

export function listRegisteredTemplates() {
  return templateDefinitions;
}

export function getTemplateRenderer(key: string) {
  return registry.get(key)?.Renderer;
}
