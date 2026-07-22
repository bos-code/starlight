import { getCategoryIcon } from "@/lib/category-icons";

export function ProductImagePlaceholder({
  categorySlug,
  categoryName,
  className = "",
  iconClassName = "h-12 w-12",
}: {
  categorySlug: string;
  categoryName?: string;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = getCategoryIcon(categorySlug);
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-navy-light via-brand-navy to-brand-graphite-light ${className}`}
    >
      <div className="grid-texture absolute inset-0 opacity-40" />
      <Icon className={`relative text-brand-steel/70 ${iconClassName}`} strokeWidth={1.25} />
      {categoryName ? (
        <span className="absolute bottom-2 left-2 right-2 truncate text-center text-[10px] font-medium uppercase tracking-wider text-brand-steel/60">
          {categoryName}
        </span>
      ) : null}
    </div>
  );
}
