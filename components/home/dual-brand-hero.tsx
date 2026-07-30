import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Box,
  ClipboardList,
  Download,
  Headphones,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

const categories = [
  {
    title: "Angle Grinders",
    description: "Heavy duty performance",
    href: "/products?category=power-tools",
    position: "100% 0%",
  },
  {
    title: "Rotary Hammers",
    description: "Power through tough jobs",
    href: "/products?category=power-tools",
    position: "0% 100%",
  },
  {
    title: "Hand Tools",
    description: "Precision. Durability. Control.",
    href: "/products?category=hand-tools",
    position: "100% 100%",
  },
];

const promises = [
  { icon: ShieldCheck, title: "100% Genuine Products", detail: "Authentic quality you can trust" },
  { icon: Truck, title: "Fast & Reliable Delivery", detail: "Nationwide delivery network" },
  { icon: Headphones, title: "Expert Consultation", detail: "Get the right tools, always" },
  { icon: BadgeCheck, title: "Competitive Pricing", detail: "Best value for your business" },
];

const stats = [
  { icon: Box, value: "10,000+", label: "Products" },
  { icon: Users, value: "5,000+", label: "Happy Customers" },
  { icon: BadgeCheck, value: "25+", label: "Leading Brands" },
  { icon: MapPin, value: "20+", label: "States Served" },
];

export function DualBrandHero() {
  return (
    <section className="starlite-hero relative overflow-hidden border-b border-brand-ingco-yellow/70 bg-black">
      <Image
        src="/images/hero/starlite-workshop.png"
        alt=""
        fill
        preload
        sizes="100vw"
        className="starlite-hero__backdrop object-cover"
      />
      <div className="starlite-hero__shade absolute inset-0" />

      <div className="relative mx-auto grid max-w-[1536px] gap-4 px-4 pb-5 pt-5 sm:px-7 lg:grid-cols-[1.02fr_1fr] lg:px-8 lg:pb-6 lg:pt-4">
        <div className="flex min-w-0 flex-col justify-end lg:min-h-[760px]">
          <div className="max-w-[650px] px-2 pb-8 pt-10 sm:px-7 lg:pb-12 lg:pt-24">
            <p className="font-heading text-lg font-bold uppercase tracking-wide text-brand-ingco-yellow sm:text-xl">
              Industrial tools. Smarter procurement.
            </p>
            <h1 className="mt-2 font-heading text-[clamp(3.2rem,5.2vw,5.9rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.025em] text-white">
              Powering industries with premium tools.
              <span className="mt-2 block text-brand-ingco-yellow">Procurement made smart.</span>
            </h1>
            <div className="mt-7 h-1 w-14 bg-brand-ingco-yellow" />
            <p className="mt-5 max-w-[570px] text-base leading-7 text-white/85 sm:text-lg">
              Starlite Tools is your reliable partner for high-performance industrial
              tools and equipment. Explore a wide range of power tools, workshop
              essentials, competitive pricing, expert support, and seamless quotation.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="hero-button hero-button--primary">
                <ClipboardList className="h-5 w-5" />
                Request a quotation
              </Link>
              <Link href="/products" className="hero-button hero-button--outline">
                Explore catalogue
                <Download className="ml-auto h-5 w-5 sm:ml-4" />
              </Link>
            </div>
          </div>

          <div className="hero-glass-grid grid grid-cols-2 overflow-hidden rounded-xl border border-brand-ingco-yellow/55 bg-black/65 backdrop-blur-md sm:grid-cols-4">
            {promises.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex min-h-20 items-center gap-3 border-white/15 p-3 sm:border-r last:border-r-0">
                <Icon className="h-8 w-8 shrink-0 text-brand-ingco-yellow" strokeWidth={1.8} />
                <div>
                  <p className="font-heading text-sm font-bold text-white">{title}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-white/65">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 lg:pt-1">
          <article className="group relative min-h-[390px] overflow-hidden rounded-xl border border-brand-ingco-yellow/70 bg-[#111] sm:min-h-[445px]">
            <div
              className="absolute inset-0 bg-[url('/images/hero/industrial-tools-sprite.png')] bg-[length:200%_200%] bg-[position:0%_0%] bg-no-repeat transition duration-500 group-hover:scale-[1.025]"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
            <div className="relative flex h-full min-h-[390px] max-w-[48%] flex-col justify-center p-6 sm:min-h-[445px] sm:p-8">
              <p className="font-heading text-4xl font-extrabold uppercase text-white">INGCO</p>
              <h2 className="mt-1 font-heading text-3xl leading-none text-white">
                Professional
                <br />
                Power Tools
              </h2>
              <div className="my-6 h-1 w-10 bg-brand-ingco-yellow" />
              <p className="text-sm leading-5 text-white/85">
                Built for performance.
                <br />
                Designed for professionals.
              </p>
              <Link href="/products?brand=ingco" className="hero-button hero-button--compact mt-7">
                View range <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          <div className="grid gap-3 sm:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group overflow-hidden rounded-xl border border-white/35 bg-[#151515] transition hover:border-brand-ingco-yellow"
              >
                <div
                  className="aspect-[1.22] bg-[url('/images/hero/industrial-tools-sprite.png')] bg-[length:200%_200%] bg-no-repeat transition duration-500 group-hover:scale-[1.035]"
                  style={{ backgroundPosition: category.position }}
                />
                <div className="p-4 pt-2">
                  <h3 className="font-heading text-xl font-bold text-white">{category.title}</h3>
                  <p className="mt-1 text-xs text-white/65">{category.description}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3 font-heading text-sm font-bold uppercase text-brand-ingco-yellow">
                    View products <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-brand-ingco-yellow/40 bg-black/70 backdrop-blur-md sm:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 border-white/15 p-4 sm:border-r last:border-r-0">
                <Icon className="h-8 w-8 shrink-0 text-brand-ingco-yellow" strokeWidth={1.8} />
                <div>
                  <p className="font-heading text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-brand-ingco-yellow/60 bg-black/85">
        <div className="mx-auto flex max-w-[1536px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-5 text-center">
          <span className="font-heading text-lg uppercase italic tracking-wide text-white/70">
            Authorised partner of
          </span>
          <span className="hidden h-10 w-px bg-white/30 sm:block" />
          <span className="font-heading text-5xl font-extrabold text-brand-ingco-yellow">INGCO</span>
          <span className="font-heading text-lg tracking-wide text-white/75">
            Make The World In Your Hands
          </span>
        </div>
      </div>
      <p className="sr-only">
        Premium industrial tools, nationwide delivery, genuine products and expert support.
      </p>
    </section>
  );
}
