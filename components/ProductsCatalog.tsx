"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, X } from "lucide-react";
import { brands, categories, industries, products } from "@/lib/data";
import type { AvailabilityStatus } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type SortKey = "featured" | "name-asc" | "name-desc";

const availabilityOptions: { value: AvailabilityStatus; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

function useVoltageFacets() {
  return useMemo(() => {
    const known = ["12V", "16V", "20V"];
    const counts = new Map<string, number>();
    for (const p of products) {
      const bucket = p.voltage && known.includes(p.voltage) ? p.voltage : "Others";
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    }
    return [...known, "Others"]
      .filter((v) => counts.has(v))
      .map((v) => ({ value: v, count: counts.get(v)! }));
  }, []);
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-brand-border py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-white">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </div>
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
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityStatus[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const voltageFacets = useVoltageFacets();

  function toggle<T>(list: T[], value: T, setList: (v: T[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.categoryId)) {
        return false;
      }
      if (selectedBrands.length && !selectedBrands.includes(p.brandId)) {
        return false;
      }
      if (
        selectedIndustries.length &&
        !selectedIndustries.some((id) => p.industryIds.includes(id))
      ) {
        return false;
      }
      if (selectedVoltages.length) {
        const bucket = p.voltage && ["12V", "16V", "20V"].includes(p.voltage) ? p.voltage : "Others";
        if (!selectedVoltages.includes(bucket)) return false;
      }
      if (selectedAvailability.length && !selectedAvailability.includes(p.availabilityStatus)) {
        return false;
      }
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
  }, [selectedCategories, selectedBrands, selectedIndustries, selectedVoltages, selectedAvailability, search, sort]);

  const categoryFacets = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        count: products.filter((p) => p.categoryId === c.id).length,
      })),
    []
  );
  const brandFacets = useMemo(
    () =>
      brands.map((b) => ({
        ...b,
        count: products.filter((p) => p.brandId === b.id).length,
      })),
    []
  );

  const activeFilterChips = [
    ...selectedCategories.map((id) => ({
      key: `cat-${id}`,
      label: categories.find((c) => c.id === id || c.slug === id)?.name ?? id,
      clear: () => toggle(selectedCategories, id, setSelectedCategories),
    })),
    ...selectedBrands.map((id) => ({
      key: `brand-${id}`,
      label: brands.find((b) => b.id === id || b.slug === id)?.name ?? id,
      clear: () => toggle(selectedBrands, id, setSelectedBrands),
    })),
    ...selectedIndustries.map((id) => ({
      key: `ind-${id}`,
      label: industries.find((i) => i.id === id || i.slug === id)?.name ?? id,
      clear: () => toggle(selectedIndustries, id, setSelectedIndustries),
    })),
    ...selectedVoltages.map((v) => ({
      key: `volt-${v}`,
      label: v,
      clear: () => toggle(selectedVoltages, v, setSelectedVoltages),
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
    setSelectedAvailability([]);
    setSearch("");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center gap-2 text-xs text-brand-steel-dim">
        <span>Home</span>
        <span>/</span>
        <span className="text-brand-white">Products</span>
      </div>

      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            Full Catalogue
          </p>
          <h1 className="mt-1 font-heading text-3xl font-bold uppercase text-brand-white">
            Product Catalogue
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-steel">
          <LayoutGrid className="h-4 w-4" />
          {filtered.length} products found
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-brand-border bg-brand-surface p-5">
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
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-brand-border py-20 text-center text-brand-steel">
              No products match these filters yet.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
