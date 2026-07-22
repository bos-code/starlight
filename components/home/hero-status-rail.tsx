import { MapPin, Handshake, Layers } from "lucide-react";
import { businessSettings } from "@/config/business";

const items = [
  { icon: MapPin, label: `${businessSettings.city} Supply Hub` },
  { icon: Handshake, label: "Dealer & Wholesale Welcome" },
  { icon: Layers, label: "Multi-Brand Supply" },
];

export function HeroStatusRail() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-brand-border/70 pt-6">
      {items.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-2 text-xs text-brand-steel">
          <Icon className="h-4 w-4 text-brand-orange" strokeWidth={1.75} />
          {label}
        </span>
      ))}
    </div>
  );
}
