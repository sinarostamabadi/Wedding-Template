import { templateCatalog } from "./catalog";
import { AuroraPrismRenderer } from "./renderers/aurora-prism";
import { CrimsonVelvetRenderer } from "./renderers/crimson-velvet";
import { DesertRoseStationeryRenderer } from "./renderers/desert-rose-stationery";
import { EmeraldSealRenderer } from "./renderers/emerald-seal";
import { GildedDecoRenderer } from "./renderers/gilded-deco";
import { HeartLocketRenderer } from "./renderers/heart-locket";
import { LoveChatRenderer } from "./renderers/love-chat";
import { MagnoliaWaltzRenderer } from "./renderers/magnolia-waltz";
import { MidnightRoseRenderer } from "./renderers/midnight-rose";
import { MirrorHallRenderer } from "./renderers/mirror-hall";
import { MoonlitInkRenderer } from "./renderers/moonlit-ink";
import { OrsiPalaceRenderer } from "./renderers/orsi-palace";
import { PersianEditorialHauteRenderer } from "./renderers/persian-editorial-haute";
import { PersepolisSealRenderer } from "./renderers/persepolis-seal";
import { QajarScrollRenderer } from "./renderers/qajar-scroll";
import { QartasRenderer } from "./renderers/qartas";
import { RoyalSuiteRenderer } from "./renderers/royal-suite";
import { ScratchRevealRenderer } from "./renderers/scratch-reveal";
import { SkyLanternsRenderer } from "./renderers/sky-lanterns";
import { SilkKnotRenderer } from "./renderers/silk-knot";
import { MixtapeLoveRenderer } from "./renderers/mixtape-love";
import { MoonlitGardenRenderer } from "./renderers/moonlit-garden";
import { RetroSixtiesRenderer } from "./renderers/retro-sixties";
import { RoseBloomRenderer } from "./renderers/rose-bloom";
import { StarryNightRenderer } from "./renderers/starry-night";
import { StationeryArchRenderer } from "./renderers/stationery-arch";
import { TurquoiseTileRenderer } from "./renderers/turquoise-tile";
import { VinylLoveRenderer } from "./renderers/vinyl-love";
import { AryaParadiseRenderer } from "./renderers/arya-paradise";
import { CarpetIranRenderer } from "./renderers/carpet-iran";
import { InkBloomRenderer } from "./renderers/ink-bloom";
import { LoveLoomRenderer } from "./renderers/love-loom";
import { ParsWaltzRenderer } from "./renderers/pars-waltz";
import { PearlSilkRenderer } from "./renderers/pearl-silk";
import { TwinOrbitRenderer } from "./renderers/twin-orbit";
import { WisteriaTerraceRenderer } from "./renderers/wisteria-terrace";
import { YadegariDiaryRenderer } from "./renderers/yadegari-diary";
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
  "moonlit-garden-v1": MoonlitGardenRenderer,
  "mirror-hall-v1": MirrorHallRenderer,
  "qartas-v1": QartasRenderer,
  "sky-lanterns-v1": SkyLanternsRenderer,
  "heart-locket-v1": HeartLocketRenderer,
  "qajar-scroll-v1": QajarScrollRenderer,
  "retro-sixties-v1": RetroSixtiesRenderer,
  "persepolis-seal-v1": PersepolisSealRenderer,
  "gilded-deco-v1": GildedDecoRenderer,
  "orsi-palace-v1": OrsiPalaceRenderer,
  "silk-knot-v1": SilkKnotRenderer,
  "aurora-prism-v1": AuroraPrismRenderer,
  "magnolia-waltz-v1": MagnoliaWaltzRenderer,
  "yadegari-diary-v1": YadegariDiaryRenderer,
  "pearl-silk-v1": PearlSilkRenderer,
  "wisteria-terrace-v1": WisteriaTerraceRenderer,
  "ink-bloom-v1": InkBloomRenderer,
  "arya-paradise-v1": AryaParadiseRenderer,
  "pars-waltz-v1": ParsWaltzRenderer,
  "twin-orbit-v1": TwinOrbitRenderer,
  "carpet-iran-v1": CarpetIranRenderer,
  "love-loom-v1": LoveLoomRenderer,
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
