"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { brands, categories, getBrand, getCategory, industries, products } from "@/lib/data";
import type { AvailabilityStatus, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { StatusBadge } from "./StatusBadge";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { ProductCompareModal, ProductCompareTray } from "./ProductCompare";
import { SectionMarker } from "./brand/SectionMarker";
import { useQuote } from "@/lib/quote-context";
import { buildProductEnquiryUrl } from "@/lib/whatsapp";

type SortKey = "featured" | "name-asc" | "name-desc";
type ViewMode = "grid" | "list";

const availabilityOptions: { value: AvailabilityStatus; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "price_on_request", label: "Confirm Availability" },
];

const MAX_COMPARE = 4;

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="border-b border-brand-border py-4 first:pt-0 last:border-b-0" open={defaultOpen}>
      <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-brand-white">
        {title}
      </summary>
      <div className="mt-3 max-h-56 space-y-2.5 overflow-y-auto pr-1">{children}</div>
    </details>
  );
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-brand-steel hover:text-brand-white">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-brand-border bg-brand-surface text-brand-orange accent-brand-orange"
        />
        {label}
      </span>
      <span className="text-xs text-brand-steel-dim">{count}</span>
    </label>
  );
}

function ProductListRow({
  product,
  compareChecked,
  onToggleCompare,
}: {
  product: Product;
  compareChecked: boolean;
  onToggleCompare: (id: string) => void;
}) {
  const { addItem } = useQuote();
  const brand = getBrand(product.brandId);
  const category = getCategory(product.categoryId);
  const displaySpecs = product.specs.filter((s) => s.label !== "Feature").slice(0, 3);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-brand-border bg-brand-surface p-4 sm:flex-row sm:items-center">
      <Link href={`/products/${product.slug}`} className="shrink-0">
        <ProductImagePlaceholder
          categorySlug={category?.slug ?? ""}
          className="h-24 w-24 rounded-lg"
          iconClassName="h-8 w-8"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
            {brand?.name}
          </span>
          <span className="font-mono-meta text-[10px] text-brand-steel-dim">{product.sku}</span>
          <StatusBadge status={product.availabilityStatus} />
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 font-heading text-base font-semibold text-brand-white hover:text-brand-orange">
            {product.name}
          </h3>
        </Link>
        {displaySpecs.length > 0 && (
          <p className="mt-1 text-xs text-brand-steel">
            {displaySpecs.map((s) => `${s.label}: ${s.value}`).join(" · ")}
          </p>
        )}
        <label className="mt-2 flex w-fit items-center gap-2 text-xs text-brand-steel">
          <input
            type="checkbox"
            checked={compareChecked}
            onChange={() => onToggleCompare(product.id)}
            className="h-3.5 w-3.5 rounded border-brand-border bg-brand-graphite accent-brand-orange"
          />
          Compare
        </label>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <a
          href={buildProductEnquiryUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-brand-steel hover:text-emerald-400"
          aria-label={`Ask about ${product.name} on WhatsApp`}
        >
          <WhatsAppIcon className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={() => addItem(product.id)}
          className="rounded-lg border border-brand-orange px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-orange transition hover:bg-brand-orange hover:text-brand-graphite"
        >
          Add to Quote
        </button>
      </div>
    </div>
  );
}

export function ProductsCatalog() {
  const searchParams = useSearchParams();

  const initialCategorySlug = searchParams.get("category");
  const initialBrandSlug = searchParams.get("brand");
  const initialIndustrySlug = searchParams.get("industry");

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = initialCategorySlug ? categories.find((c) => c.slug === initialCategorySlug) : undefined;
    return cat ? [cat.id] : [];
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    if (!initialBrandSlug || initialBrandSlug === "all") return [];
    const brand = brands.find((b) => b.slug === initialBrandSlug);
    return brand ? [brand.id] : [];
  });
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(() => {
    const industry = initialIndustrySlug ? industries.find((i) => i.slug === initialIndustrySlug) : undefined;
    return industry ? [industry.id] : [];
  });
  const [selectedVoltages, setSelectedVoltages] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedPowerSources, setSelectedPowerSources] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityStatus[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  function toggle<T>(list: T[], value: T, setList: (v: T[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < MAX_COMPARE ? [...prev, id] : prev
    );
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.categoryId)) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brandId)) return false;
      if (selectedIndustries.length && !selectedIndustries.some((id) => p.industryIds.includes(id))) {
        return false;
      }
      if (selectedVoltages.length && !selectedVoltages.includes(p.voltage ?? "")) return false;
      if (selectedProductTypes.length && !selectedProductTypes.includes(p.productType ?? "")) return false;
      if (selectedPowerSources.length && !selectedPowerSources.includes(p.powerSource ?? "")) return false;
      if (selectedAvailability.length && !selectedAvailability.includes(p.availabilityStatus)) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.sku.toLowerCase().includes(q) &&
          !p.model.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    if (sort === "name-asc") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "featured") result = [...result].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

    return result;
  }, [
    selectedCategories,
    selectedBrands,
    selectedIndustries,
    selectedVoltages,
    selectedProductTypes,
    selectedPowerSources,
    selectedAvailability,
    search,
    sort,
  ]);

  const categoryFacets = useMemo(
    () => categories.map((c) => ({ ...c, count: products.filter((p) => p.categoryId === c.id).length })),
    []
  );
  const brandFacets = useMemo(
    () => brands.map((b) => ({ ...b, count: products.filter((p) => p.brandId === b.id).length })),
    []
  );
  const voltageFacets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      if (p.powerSource !== "Cordless (Battery)" || !p.voltage) continue;
      counts.set(p.voltage, (counts.get(p.voltage) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
      .map(([value, count]) => ({ value, count }));
  }, []);
  const productTypeFacets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      if (!p.productType) continue;
      counts.set(p.productType, (counts.get(p.productType) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count }));
  }, []);
  const powerSourceFacets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      if (!p.powerSource) continue;
      counts.set(p.powerSource, (counts.get(p.powerSource) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count }));
  }, []);

  const activeFilterChips = [
    ...selectedCategories.map((id) => ({
      key: `cat-${id}`,
      label: categories.find((c) => c.id === id)?.name ?? id,
      clear: () => toggle(selectedCategories, id, setSelectedCategories),
    })),
    ...selectedBrands.map((id) => ({
      key: `brand-${id}`,
      label: brands.find((b) => b.id === id)?.name ?? id,
      clear: () => toggle(selectedBrands, id, setSelectedBrands),
    })),
    ...selectedIndustries.map((id) => ({
      key: `ind-${id}`,
      label: industries.find((i) => i.id === id)?.name ?? id,
      clear: () => toggle(selectedIndustries, id, setSelectedIndustries),
    })),
    ...selectedVoltages.map((v) => ({
      key: `volt-${v}`,
      label: v,
      clear: () => toggle(selectedVoltages, v, setSelectedVoltages),
    })),
    ...selectedProductTypes.map((v) => ({
      key: `type-${v}`,
      label: v,
      clear: () => toggle(selectedProductTypes, v, setSelectedProductTypes),
    })),
    ...selectedPowerSources.map((v) => ({
      key: `power-${v}`,
      label: v,
      clear: () => toggle(selectedPowerSources, v, setSelectedPowerSources),
    })),
    ...selectedAvailability.map((a) => ({
      key: `avail-${a}`,
      label: availabilityOptions.find((o) => o.value === a)?.label ?? a,
      clear: () => toggle(selectedAvailability, a, setSelectedAvailability),
    })),
  ];

  function clearAll() {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedIndustries([]);
    setSelectedVoltages([]);
    setSelectedProductTypes([]);
    setSelectedPowerSources([]);
    setSelectedAvailability([]);
    setSearch("");
  }

  const compareProducts = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center gap-2 text-xs text-brand-steel-dim">
        <span>Home</span>
        <span>/</span>
        <span className="text-brand-white">Products</span>
      </div>

      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <SectionMarker index="Catalogue" label={`${filtered.length} of ${products.length} products`} />
          <h1 className="mt-2 font-heading text-3xl font-bold uppercase text-brand-white">
            Product Catalogue
          </h1>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-brand-border p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
              view === "grid" ? "bg-brand-orange text-brand-graphite" : "text-brand-steel hover:text-brand-white"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="List view"
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
              view === "list" ? "bg-brand-orange text-brand-graphite" : "text-brand-steel hover:text-brand-white"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-brand-border bg-brand-surface p-5 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-white">
              Filter Products
            </h2>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-brand-orange hover:underline"
            >
              Clear all
            </button>
          </div>

          <FilterGroup title="Categories">
            {categoryFacets.map((c) => (
              <CheckboxRow
                key={c.id}
                label={c.name}
                count={c.count}
                checked={selectedCategories.includes(c.id)}
                onChange={() => toggle(selectedCategories, c.id, setSelectedCategories)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Brand">
            {brandFacets.map((b) => (
              <CheckboxRow
                key={b.id}
                label={b.name}
                count={b.count}
                checked={selectedBrands.includes(b.id)}
                onChange={() => toggle(selectedBrands, b.id, setSelectedBrands)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Product Type" defaultOpen={false}>
            {productTypeFacets.map((t) => (
              <CheckboxRow
                key={t.value}
                label={t.value}
                count={t.count}
                checked={selectedProductTypes.includes(t.value)}
                onChange={() => toggle(selectedProductTypes, t.value, setSelectedProductTypes)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Power Source">
            {powerSourceFacets.map((p) => (
              <CheckboxRow
                key={p.value}
                label={p.value}
                count={p.count}
                checked={selectedPowerSources.includes(p.value)}
                onChange={() => toggle(selectedPowerSources, p.value, setSelectedPowerSources)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Voltage">
            {voltageFacets.map((v) => (
              <CheckboxRow
                key={v.value}
                label={v.value}
                count={v.count}
                checked={selectedVoltages.includes(v.value)}
                onChange={() => toggle(selectedVoltages, v.value, setSelectedVoltages)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Availability">
            {availabilityOptions.map((o) => (
              <CheckboxRow
                key={o.value}
                label={o.label}
                count={products.filter((p) => p.availabilityStatus === o.value).length}
                checked={selectedAvailability.includes(o.value)}
                onChange={() => toggle(selectedAvailability, o.value, setSelectedAvailability)}
              />
            ))}
          </FilterGroup>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, brand, model, SKU..."
              className="w-full rounded-lg border border-brand-border bg-brand-surface px-3.5 py-2.5 text-sm text-brand-white placeholder:text-brand-steel-dim focus:border-brand-orange focus:outline-none sm:max-w-xs"
            />
            <label className="flex items-center gap-2 text-sm text-brand-steel">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-brand-border bg-brand-surface px-3 py-2.5 text-sm text-brand-white focus:border-brand-orange focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </label>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange"
                >
                  {chip.label}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-brand-border py-20 text-center text-brand-steel">
              No products match these filters yet.
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  compareChecked={compareIds.includes(product.id)}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((product) => (
                <ProductListRow
                  key={product.id}
                  product={product}
                  compareChecked={compareIds.includes(product.id)}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductCompareTray
        products={compareProducts}
        onRemove={(id) => setCompareIds((prev) => prev.filter((c) => c !== id))}
        onClear={() => setCompareIds([])}
        onOpen={() => setCompareModalOpen(true)}
      />
      {compareModalOpen && (
        <ProductCompareModal products={compareProducts} onClose={() => setCompareModalOpen(false)} />
      )}
    </div>
  );
}
