import type { Product } from "./types";

export interface ProductVisualAsset {
  src: string;
  label: string;
}

const visuals = {
  cordlessDrill: {
    src: "/images/tools/cordless-drill.webp",
    label: "Cordless drill product visual",
  },
  impactWrench: {
    src: "/images/tools/impact-wrench.webp",
    label: "Cordless impact wrench product visual",
  },
  cordlessBlower: {
    src: "/images/tools/cordless-blower.webp",
    label: "Cordless blower product visual",
  },
  grassTrimmer: {
    src: "/images/tools/grass-trimmer.webp",
    label: "Cordless grass trimmer product visual",
  },
  rotaryHammer: {
    src: "/images/tools/rotary-hammer.webp",
    label: "Rotary hammer product visual",
  },
  comboKit: {
    src: "/images/tools/combo-kit.webp",
    label: "Cordless combo kit product visual",
  },
  sprayGun: {
    src: "/images/tools/spray-gun.webp",
    label: "Cordless spray gun product visual",
  },
  angleGrinder: {
    src: "/images/tools/angle-grinder.webp",
    label: "Angle grinder product visual",
  },
  accessoriesKit: {
    src: "/images/tools/accessories-kit.webp",
    label: "Power tool accessories product visual",
  },
  handTools: {
    src: "/images/tools/hand-tools.webp",
    label: "Professional hand tools product visual",
  },
  plateCompactor: {
    src: "/images/tools/plate-compactor.webp",
    label: "Plate compactor product visual",
  },
  weldingMachine: {
    src: "/images/tools/welding-machine.webp",
    label: "Welding machine product visual",
  },
  generator: {
    src: "/images/tools/generator.webp",
    label: "Portable generator product visual",
  },
  waterPump: {
    src: "/images/tools/water-pump.webp",
    label: "Water pump product visual",
  },
  pneumaticWrench: {
    src: "/images/tools/pneumatic-wrench.webp",
    label: "Pneumatic impact wrench product visual",
  },
  laserLevel: {
    src: "/images/tools/laser-level.webp",
    label: "Laser measuring tool product visual",
  },
  safetyKit: {
    src: "/images/tools/safety-kit.webp",
    label: "Worksite safety equipment product visual",
  },
} satisfies Record<string, ProductVisualAsset>;

const categoryVisuals: Record<string, ProductVisualAsset> = {
  "cordless-tools": visuals.cordlessDrill,
  "power-tools": visuals.angleGrinder,
  "power-tools-accessories": visuals.accessoriesKit,
  "hand-tools": visuals.handTools,
  "small-construction-equipment": visuals.plateCompactor,
  "welding-machines": visuals.weldingMachine,
  generators: visuals.generator,
  "water-pumps": visuals.waterPump,
  "air-tools": visuals.pneumaticWrench,
  "measuring-tools": visuals.laserLevel,
  "safety-products": visuals.safetyKit,
  "garden-tools": visuals.grassTrimmer,
};

type ProductVisualInput = Pick<
  Product,
  "name" | "productType" | "powerSource" | "categoryId"
>;

/**
 * Resolves each catalogue record to the closest available original product
 * visualization. Exact product-type matches win, then the category image is used.
 * The UI labels these as reference visuals so they are never presented as official
 * manufacturer photography for a specific SKU.
 */
export function getProductVisual(
  product?: ProductVisualInput,
  categorySlug?: string,
): ProductVisualAsset {
  const search = `${product?.name ?? ""} ${product?.productType ?? ""}`.toLowerCase();

  if (categorySlug === "air-tools") return visuals.pneumaticWrench;
  if (/\bcombo\b|\bkit\b/.test(search) && categorySlug === "cordless-tools") {
    return visuals.comboKit;
  }
  if (/impact wrench|impact driver/.test(search)) return visuals.impactWrench;
  if (/blower|vacuum cleaner/.test(search)) return visuals.cordlessBlower;
  if (/grass trimmer|string trimmer|brush cutter|hedge trimmer|lawn mower/.test(search)) {
    return visuals.grassTrimmer;
  }
  if (/rotary hammer|demolition hammer|breaker|hammer drill/.test(search)) {
    return visuals.rotaryHammer;
  }
  if (/spray gun|paint sprayer/.test(search)) return visuals.sprayGun;
  if (/angle grinder|grinder|polisher|sander/.test(search)) return visuals.angleGrinder;
  if (/weld|inverter/.test(search)) return visuals.weldingMachine;
  if (/generator/.test(search)) return visuals.generator;
  if (/water pump|centrifugal pump/.test(search)) return visuals.waterPump;
  if (/laser|level|measuring/.test(search)) return visuals.laserLevel;
  if (/safety|helmet|goggle|glove|earmuff/.test(search)) return visuals.safetyKit;
  if (/compactor|rammer|construction equipment/.test(search)) return visuals.plateCompactor;
  if (/drill|screwdriver/.test(search)) return visuals.cordlessDrill;

  return categoryVisuals[categorySlug ?? ""] ?? visuals.handTools;
}

export function getCategoryVisual(categorySlug: string): ProductVisualAsset {
  return categoryVisuals[categorySlug] ?? visuals.handTools;
}

export { visuals as productVisuals };
