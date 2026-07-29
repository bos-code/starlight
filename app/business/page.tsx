import type { Metadata } from "next";
import { BusinessDesk } from "@/components/BusinessDesk";
import { brands, categories, products } from "@/lib/data";

export const metadata: Metadata = {
  title: "Business Desk Preview | Starlite Tools",
  description:
    "A V1 operations preview showing how Starlite can turn catalogue enquiries into trackable sales requests and a connected digital trade workflow.",
};

export default function BusinessPage() {
  return (
    <BusinessDesk
      productCount={products.length}
      categoryCount={categories.length}
      brandCount={brands.length}
    />
  );
}
