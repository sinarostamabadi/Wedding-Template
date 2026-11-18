import fs from "fs";

const path =
  "C:/Users/ZBOOK/Desktop/wedding-templates/src/templates/renderers/pars-waltz/index.tsx";
let s = fs.readFileSync(path, "utf8");

const renames = [
  ["MagnoliaWaltzRenderer", "ParsWaltzRenderer"],
  ["magnolia-waltz-cover.jpg", "pars-waltz-cover.jpg"],
  ["RomanticMood", "CourtMood"],
  ["BLUSH_IVORY", "LIMESTONE"],
  ["VINTAGE_ROSE", "ROYAL_LAPIS"],
  ["CHAMPAGNE_GOLD", "ACHAEMENID_GOLD"],
  ["RomanticSectionHeader", "CourtSectionHeader"],
  ["ConservatoryFloralArch", "ApadanaPortico"],
  ["BotanicalWaxSeal", "FaravaharSeal"],
  ["MagnoliaBranchSvg", "BullCapitalColumn"],
  ["BOUQUET_WISHES", "COURT_OFFERINGS"],
  ["FALLING_PETALS", "FALLING_LOTUSES"],
  ["PETAL_SWATCHES", "COURT_SWATCHES"],
  ["bouquetId", "offeringId"],
  ["setBouquetId", "setOfferingId"],
  ["selectedBouquet", "selectedOffering"],
];

for (const [a, b] of renames) s = s.split(a).join(b);

// CSS prefixes
s = s.split("mw-").join("pw-");
s = s.split("--pw-rose").join("--pw-lapis");
s = s.split("\"--pw-rose\"").join("\"--pw-lapis\"");
s = s.split("mood.rose").join("mood.lapis");
s = s.split("rose:").join("lapis:");
s = s.split("rose,").join("lapis,");
s = s.split("  rose,").join("  lapis,");
s = s.split("{ rose,").join("{ lapis,");
s = s.split("rose }").join("lapis }");
s = s.split("rose: string").join("lapis: string");

// Remove Flower2 from imports if present, keep Sparkles
s = s.replace(/\n\s*Flower2,/, "");
s = s.split("Flower2").join("Sparkles");

// Deduplicate Sparkles in import
s = s.replace(
  /import \{([\s\S]*?)\} from "lucide-react";/,
  (m, body) => {
    const names = [
      ...new Set(
        body
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    ];
    return `import {\n  ${names.join(",\n  ")}\n} from "lucide-react";`;
  },
);

fs.writeFileSync(path, s);
console.log("pass1 ok", s.length);
