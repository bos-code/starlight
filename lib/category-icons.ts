import {
  BatteryCharging,
  Cog,
  Disc3,
  Droplets,
  Flame,
  Fuel,
  HardHat,
  Ruler,
  Sprout,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  "cordless-tools": BatteryCharging,
  "power-tools": Cog,
  "power-tools-accessories": Disc3,
  "hand-tools": Wrench,
  "small-construction-equipment": HardHat,
  "welding-machines": Flame,
  generators: Fuel,
  "water-pumps": Droplets,
  "air-tools": Wind,
  "measuring-tools": Ruler,
  "safety-products": HardHat,
  "garden-tools": Sprout,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? Wrench;
}
