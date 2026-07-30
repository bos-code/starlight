import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const cataloguePath = resolve(root, "lib/ingco-catalogue.ts");
const outputPath = resolve(root, "lib/product-image-links.generated.json");
const imageDirectory = resolve(root, "public/images/catalogue");
const catalogue = await readFile(cataloguePath, "utf8");

const firstProductIndex = catalogue.indexOf('  {\n    id: "ingco-');
const productBlocks =
  firstProductIndex === -1
    ? []
    : catalogue
        .slice(firstProductIndex)
        .split(/\n(?=  \{\n    id: "ingco-)/)
        .filter((block) => block.startsWith('  {\n    id: "ingco-'));

function readStringField(block, field) {
  const match = block.match(
    new RegExp(`\\n\\s*${field}:\\s*"((?:\\\\.|[^"\\\\])*)"`),
  );
  return match ? JSON.parse(`"${match[1]}"`) : undefined;
}

const products = productBlocks.map((block) => ({
  name: readStringField(block, "name"),
  slug: readStringField(block, "slug"),
  sku: readStringField(block, "sku"),
}));

if (
  products.length === 0 ||
  products.some((product) => !product.name || !product.slug || !product.sku)
) {
  throw new Error(`Could not parse every INGCO product in ${cataloguePath}`);
}

const decodeHtml = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");

function productPageUrl({ slug, sku }) {
  const suffix = `-${sku.toLowerCase()}`;
  const productSlug = slug.endsWith(suffix) ? slug.slice(0, -suffix.length) : slug;
  return `https://www.ingco.com/product/${productSlug}/${encodeURIComponent(sku)}`;
}

function imageFromHtml(html, sku) {
  const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const preferred =
    imageTags.find((tag) => tag.includes(sku) && /alt=["']INGCO\b/i.test(tag)) ??
    imageTags.find(
      (tag) =>
        /class=["'][^"']*\bant-image-img\b/i.test(tag) &&
        /https:\/\/www\.ingco\.com\/(?:userfiles|website-center)\//i.test(tag),
    );

  if (!preferred) return undefined;

  const src = preferred.match(/\bsrc=["']([^"']+)["']/i)?.[1];
  return src ? decodeHtml(src) : undefined;
}

async function fetchImageLink(product) {
  const sourceUrl = productPageUrl(product);
  const response = await fetch(sourceUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; StarliteCatalogueImageAudit/1.0; +https://starlitetools.com)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const imageUrl = imageFromHtml(html, product.sku);

  if (!imageUrl) {
    throw new Error("product image not found");
  }

  const resolvedImageUrl = new URL(imageUrl, sourceUrl).toString();
  const imageHost = new URL(resolvedImageUrl).hostname;
  if (imageHost !== "www.ingco.com") {
    throw new Error(`unexpected image host ${imageHost}`);
  }

  return {
    imageUrl: resolvedImageUrl,
    sourceUrl,
    provider: "INGCO",
    match: "exact",
  };
}

const images = {};
const failures = [];
const concurrency = 10;
let cursor = 0;
let completed = 0;

async function worker() {
  while (cursor < products.length) {
    const index = cursor;
    cursor += 1;
    const product = products[index];

    try {
      images[product.sku] = await fetchImageLink(product);
    } catch (error) {
      failures.push({
        sku: product.sku,
        sourceUrl: productPageUrl(product),
        error: error instanceof Error ? error.message : String(error),
      });
    }

    completed += 1;
    if (completed % 20 === 0 || completed === products.length) {
      console.log(`Resolved ${completed}/${products.length} product pages`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

const sortedImages = Object.fromEntries(
  Object.entries(images).sort(([left], [right]) => left.localeCompare(right)),
);

await mkdir(imageDirectory, { recursive: true });

function extensionFor(contentType, imageUrl) {
  if (contentType.includes("image/png")) return "png";
  if (contentType.includes("image/webp")) return "webp";
  if (contentType.includes("image/gif")) return "gif";
  if (contentType.includes("image/jpeg")) return "jpg";

  const extension = new URL(imageUrl).pathname.split(".").pop()?.toLowerCase();
  return extension && ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
    ? extension.replace("jpeg", "jpg")
    : "jpg";
}

const imageEntries = Object.entries(sortedImages);
const downloadFailures = [];
let downloadCursor = 0;
let downloaded = 0;

async function downloadWorker() {
  while (downloadCursor < imageEntries.length) {
    const index = downloadCursor;
    downloadCursor += 1;
    const [sku, image] = imageEntries[index];

    try {
      const response = await fetch(image.imageUrl, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; StarliteCatalogueImageAudit/1.0; +https://starlitetools.com)",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const extension = extensionFor(
        response.headers.get("content-type") ?? "",
        image.imageUrl,
      );
      const fileName = `${sku.toLowerCase()}.${extension}`;
      await writeFile(
        resolve(imageDirectory, fileName),
        Buffer.from(await response.arrayBuffer()),
      );
      image.localPath = `/images/catalogue/${fileName}`;
    } catch (error) {
      downloadFailures.push({
        sku,
        imageUrl: image.imageUrl,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    downloaded += 1;
    if (downloaded % 20 === 0 || downloaded === imageEntries.length) {
      console.log(`Downloaded ${downloaded}/${imageEntries.length} product images`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => downloadWorker()));

const output = {
  _meta: {
    generatedAt: new Date().toISOString(),
    catalogueProducts: products.length,
    exactImages: Object.keys(sortedImages).length,
    localImages: Object.values(sortedImages).filter((image) => image.localPath).length,
    unresolved: failures.length + downloadFailures.length,
    disclaimer: "docs/IMAGE_USE_AND_ATTRIBUTION.md",
  },
  images: sortedImages,
  unresolved: failures.sort((left, right) => left.sku.localeCompare(right.sku)),
  downloadFailures: downloadFailures.sort((left, right) =>
    left.sku.localeCompare(right.sku),
  ),
};

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

console.log(
  `Wrote ${Object.keys(sortedImages).length} exact image links to ${outputPath}; ${downloadFailures.length} image downloads unresolved.`,
);
