/**
 * Central image manifest. Every image used across the site is declared here —
 * components should never hardcode an image path.
 *
 * `src: undefined` means no licensed asset has been supplied yet. The <ImageSlot>
 * component renders a designed placeholder in that case instead of a broken image.
 * Drop a real file into /public/images/... and set `src` to wire it up; no other
 * code needs to change.
 *
 * IMPORTANT: do not point `src` at a third-party domain (e.g. ingco.com) — that
 * would reproduce another company's copyrighted product photography on this site
 * without a license. Only use images Starlite has the rights to publish.
 */

export interface SiteImage {
  /** Path under /public, e.g. "/images/hero/storefront.webp". Undefined = use placeholder. */
  src?: string;
  alt: string;
}

export const siteImages = {
  hero: {
    starliteEnvironment: {
      src: undefined,
      alt: "Starlite Tools shop floor and warehouse in Onitsha",
    } satisfies SiteImage,
    ingcoFeaturedProduct: {
      src: undefined,
      alt: "Featured INGCO P20S cordless tool",
    } satisfies SiteImage,
  },
  industries: {
    construction: { src: undefined, alt: "Construction site using power tools" } satisfies SiteImage,
    weldingFabrication: { src: undefined, alt: "Welder fabricating steel" } satisfies SiteImage,
    carpentryWoodworking: { src: undefined, alt: "Carpenter working with wood tools" } satisfies SiteImage,
    electricalInstallation: { src: undefined, alt: "Electrician installing wiring" } satisfies SiteImage,
  },
  company: {
    storefront: { src: undefined, alt: "Starlite Tools storefront in Onitsha" } satisfies SiteImage,
    warehouse: { src: undefined, alt: "Starlite Tools warehouse and shelving" } satisfies SiteImage,
  },
  brands: {
    ingco: { src: undefined, alt: "INGCO" } satisfies SiteImage,
    total: { src: undefined, alt: "TOTAL Tools" } satisfies SiteImage,
    bosch: { src: undefined, alt: "BOSCH" } satisfies SiteImage,
    makita: { src: undefined, alt: "MAKITA" } satisfies SiteImage,
    dewalt: { src: undefined, alt: "DEWALT" } satisfies SiteImage,
  },
};
