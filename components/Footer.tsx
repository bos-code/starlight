import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { businessSettings, categories } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-navy/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-steel">
            {businessSettings.legalName} has served Onitsha and dealers nationwide for{" "}
            {businessSettings.yearsInBusiness} years with power tools, hand tools, welding
            equipment, safety products and industrial supplies.
          </p>
          <div className="mt-5 space-y-2 text-sm text-brand-steel">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-brand-orange" />
              {businessSettings.address}, {businessSettings.state}, {businessSettings.country}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-orange" />
              {businessSettings.whatsappDisplay} &middot; {businessSettings.phoneDisplay}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-orange" />
              {businessSettings.email}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-white">
            Products
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-steel">
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link href={`/products?category=${cat.slug}`} className="hover:text-brand-orange">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-white">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-steel">
            <li><Link href="/about" className="hover:text-brand-orange">About Starlite</Link></li>
            <li><Link href="/dealer" className="hover:text-brand-orange">Dealer Portal</Link></li>
            <li><Link href="/products" className="hover:text-brand-orange">Full Catalogue</Link></li>
            <li><Link href="/quote" className="hover:text-brand-orange">Quote List</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-white">
            Support
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-steel">
            <li><span>Warranty &amp; Genuine Parts</span></li>
            <li><span>Bulk &amp; Dealer Pricing</span></li>
            <li><span>Delivery &amp; Pickup</span></li>
            <li><span>{businessSettings.hours}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-border/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-brand-steel-dim sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {businessSettings.legalName}. All rights reserved.</p>
          <p>Original tools. Dealer &amp; wholesale pricing available.</p>
        </div>
      </div>
    </footer>
  );
}
