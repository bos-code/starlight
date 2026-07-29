import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  businessCoordinates,
  businessSettings,
  buildDirectionsUrl,
  buildMapEmbedUrl,
} from "@/config/business";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { CopyAddressButton } from "./CopyAddressButton";
import { StarMark } from "./brand/StarMark";
import { SectionMarker } from "./brand/SectionMarker";

const fullAddress = `${businessSettings.address}, ${businessSettings.state}, ${businessSettings.country}`;
const coordinateLabel = `${businessCoordinates.lat.toFixed(4)}° N / ${businessCoordinates.lng.toFixed(4)}° E`;

function MapRoadNetwork() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 720"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-70"
    >
      <g fill="#17201d" stroke="#303a36" strokeWidth="1">
        <path d="M45 70h170v95H45zM260 48h145v86H260zM455 76h190v120H455zM700 42h155v105H700zM910 72h220v95H910z" />
        <path d="M74 225h130v110H74zM260 205h180v92H260zM493 244h120v90H493zM765 210h150v118H765zM960 225h170v92H960z" />
        <path d="M40 420h190v92H40zM285 386h125v130H285zM470 430h170v104H470zM725 398h185v120H725zM970 410h160v112H970z" />
        <path d="M65 580h140v80H65zM255 566h185v102H255zM500 585h155v82H500zM720 560h130v112H720zM915 575h205v94H915z" />
      </g>

      <g fill="none" stroke="#6e7b75" strokeLinecap="square">
        <path d="M-40 615C130 570 215 480 350 445S610 405 760 310 1030 120 1250 90" strokeWidth="7" />
        <path d="M95-30C150 120 205 185 330 245S585 315 710 450 890 675 1030 760" strokeWidth="5" />
        <path d="M-20 175C170 210 320 165 470 230S735 365 895 320 1080 220 1230 250" strokeWidth="4" />
        <path d="M410-30C425 100 390 205 455 310S600 490 570 760" strokeWidth="3" />
        <path d="M835-20C815 135 850 220 790 345S675 570 735 760" strokeWidth="3" />
      </g>

      <g fill="none" stroke="#3f4c47" strokeWidth="2">
        <path d="M25 360h1135M225 0v720M660 0v720M1015 0v720" />
        <path d="M0 540h1200M0 115h1200" />
        <path d="M110 330l145 88 120-88 155 64 135-96 145 70 160-92 130 76" />
        <path d="M80 675l170-110 160 65 145-120 180 95 130-110 210 80" />
      </g>

      <path
        d="M-40 615C130 570 215 480 350 445S610 405 760 310 1030 120 1250 90"
        fill="none"
        stroke="#ff5a1f"
        strokeDasharray="12 14"
        strokeWidth="2"
        opacity="0.65"
      />

      <g fill="#8e9a94" fontFamily="monospace" fontSize="13" letterSpacing="3" opacity="0.6">
        <text x="72" y="200">OCHANJA</text>
        <text x="906" y="365">ONITSHA</text>
        <text x="840" y="548">MARKET ROUTE</text>
        <text x="276" y="690">BRIDGE CORRIDOR</text>
      </g>
    </svg>
  );
}

export function ContactMap() {
  return (
    <section id="support" className="border-b border-brand-border bg-brand-graphite-light">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid overflow-hidden border border-brand-border bg-brand-border lg:grid-cols-[0.78fr_1.22fr]">
          <div className="technical-grid relative bg-brand-graphite p-7 sm:p-10 lg:p-12">
            <SectionMarker index="06" label="Onitsha Supply Hub" />
            <h2 className="mt-3 max-w-md font-heading text-4xl font-extrabold uppercase leading-[0.96] text-brand-white">
              Find the hub.
              <br />
              <span className="text-brand-orange">Talk to the team.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-brand-steel">
              Visit the market location or contact sales directly for product enquiries,
              quote requests and technical assistance.
            </p>

            <div className="mt-8 divide-y divide-brand-border border-y border-brand-border">
              <div className="flex items-start justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                  <div>
                    <p className="font-heading text-base font-bold uppercase text-brand-white">
                      {businessSettings.businessName}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-brand-steel">
                      {fullAddress}
                    </p>
                  </div>
                </div>
                <CopyAddressButton address={fullAddress} className="shrink-0 pt-0.5" />
              </div>

              <div className="grid gap-4 py-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                  <div className="text-sm">
                    <p className="text-brand-white">{businessSettings.whatsappDisplay}</p>
                    <p className="text-brand-steel-dim">{businessSettings.phoneDisplay}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                  <p className="text-sm leading-relaxed text-brand-steel">
                    {businessSettings.hours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                <p className="text-sm text-brand-white">{businessSettings.email}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${businessSettings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp Sales
              </a>
              <a
                href={`mailto:${businessSettings.email}`}
                className="inline-flex items-center gap-2 border border-brand-border bg-brand-surface px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-orange"
              >
                Email Sales
              </a>
            </div>
          </div>

          <div className="relative min-h-[480px] overflow-hidden bg-brand-surface">
            <iframe
              title={`Map — ${businessSettings.businessName}, ${businessSettings.city}`}
              src={buildMapEmbedUrl()}
              className="absolute inset-0 h-full w-full border-0 grayscale invert-[0.9] sepia-[0.2] hue-rotate-[75deg] saturate-[0.35] contrast-[1.25] brightness-[0.55] opacity-80"
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />

            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(11,14,13,0.76)_0%,rgba(11,14,13,0.14)_42%,rgba(255,90,31,0.10)_100%)]" />
            <MapRoadNetwork />
            <div className="technical-grid pointer-events-none absolute inset-0 z-10 opacity-30 mix-blend-screen" />
            <div className="pointer-events-none absolute inset-3 z-10 border border-white/[0.08]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-brand-border bg-brand-graphite/88 px-5 py-3 backdrop-blur">
              <span className="font-mono-meta text-[9px] uppercase tracking-[0.16em] text-brand-orange">
                STL / Location 01
              </span>
              <span className="font-mono-meta text-[9px] uppercase tracking-[0.14em] text-brand-steel-dim">
                {coordinateLabel}
              </span>
            </div>

            <a
              href={buildDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get directions to ${businessSettings.businessName}`}
              className="group absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="relative flex h-16 w-16 items-center justify-center border border-brand-orange bg-brand-graphite shadow-[0_0_45px_rgba(255,90,31,0.35)] transition group-hover:scale-105">
                <span className="absolute inset-2 border border-brand-orange/35" />
                <StarMark className="relative h-7 w-7 text-brand-orange" />
              </span>
              <span className="mx-auto block h-3 w-3 -translate-y-1 rotate-45 border-b border-r border-brand-orange bg-brand-graphite" />
              <span className="absolute left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2 whitespace-nowrap border border-brand-border bg-brand-graphite/92 px-3 py-2 font-mono-meta text-[9px] uppercase tracking-[0.14em] text-brand-white backdrop-blur">
                Starlite / Onitsha Hub
              </span>
            </a>

            <div className="absolute inset-x-4 bottom-4 z-30 grid gap-px border border-brand-border bg-brand-border sm:grid-cols-[1fr_auto]">
              <div className="bg-brand-graphite/94 p-4 backdrop-blur">
                <p className="font-heading text-base font-bold uppercase text-brand-white">
                  Ochanja Market, Onitsha
                </p>
                <p className="mt-1 font-mono-meta text-[8px] uppercase tracking-[0.12em] text-brand-steel-dim">
                  {businessCoordinates.confirmed
                    ? "Confirmed storefront location"
                    : "Approximate hub pin / storefront coordinates pending"}
                </p>
              </div>
              <a
                href={buildDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-orange px-5 py-4 font-heading text-sm font-extrabold uppercase text-brand-graphite transition hover:brightness-110"
              >
                Open Directions
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
