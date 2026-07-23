import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { businessCoordinates, businessSettings, buildDirectionsUrl, buildMapEmbedUrl } from "@/config/business";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { CopyAddressButton } from "./CopyAddressButton";
import { StarMark } from "./brand/StarMark";
import { SectionMarker } from "./brand/SectionMarker";

const fullAddress = `${businessSettings.address}, ${businessSettings.state}, ${businessSettings.country}`;

export function ContactMap() {
  return (
    <section id="support" className="bg-brand-graphite">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionMarker index="06" label="Get in Touch" />
          <h2 className="mt-2 font-heading text-3xl font-bold uppercase text-brand-white">
            Contact &amp; Location
          </h2>
          <p className="mt-3 max-w-md text-sm text-brand-steel">
            Our team is ready to assist with product enquiries, quotes and technical
            support.
          </p>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <div>
                  <p className="text-brand-white">{businessSettings.businessName}</p>
                  <p className="text-brand-steel">{fullAddress}</p>
                </div>
              </div>
              <CopyAddressButton address={fullAddress} className="shrink-0 pt-0.5" />
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
              <div>
                <p className="text-brand-white">{businessSettings.whatsappDisplay} (WhatsApp)</p>
                <p className="text-brand-white">{businessSettings.phoneDisplay}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
              <p className="text-brand-white">{businessSettings.email}</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
              <p className="text-brand-white">{businessSettings.hours}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${businessSettings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <a
              href={buildDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-white"
            >
              Get Directions
            </a>
            <a
              href={`mailto:${businessSettings.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-brand-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-white"
            >
              Email Sales
            </a>
          </div>
        </div>

        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-border sm:aspect-[16/11]">
            <iframe
              title={`Map — ${businessSettings.businessName}, ${businessSettings.city}`}
              src={buildMapEmbedUrl()}
              className="h-full w-full invert-[0.92] hue-rotate-180 contrast-[0.9] brightness-[0.85]"
              loading="lazy"
            />
            <a
              href={buildDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${businessSettings.businessName}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
            >
              <span className="flex flex-col items-center gap-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-graphite bg-brand-orange">
                  <StarMark className="h-4 w-4 text-brand-graphite" />
                </span>
                <span className="h-2 w-2 rotate-45 bg-brand-orange" />
              </span>
            </a>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-graphite/60 via-transparent to-transparent" />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-brand-steel-dim">
            <span>{fullAddress}</span>
            {!businessCoordinates.confirmed && (
              <span className="text-brand-amber">Approximate — pending confirmed coordinates</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
