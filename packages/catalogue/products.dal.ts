// packages/catalogue/products.dal.ts
// Data Access Layer for the product catalogue.
// All product reads and writes go through this module.
// Never bypass this layer with direct Prisma calls in routes/actions.

import { db } from '../db';
import { writeAuditLog } from '../security/audit';
import type { AvailabilityStatus, PriceVisibility, Prisma } from '@prisma/client';

// ─── Allowed filter / sort keys ──────────────────────────────────────────────
// Validate against this before building any Prisma query. Never trust user input.

const ALLOWED_SORT_FIELDS = new Set([
  'name',
  'createdAt',
  'updatedAt',
  'sku',
]);

const ALLOWED_SORT_ORDERS = new Set(['asc', 'desc']);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductFilters {
  search?: string;
  brandSlug?: string;
  categorySlug?: string;
  availability?: AvailabilityStatus;
  priceVisibility?: PriceVisibility;
  voltage?: string;
  powerSource?: string;
  productType?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResult {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    model: string | null;
    shortDescription: string | null;
    availability: AvailabilityStatus;
    priceVisibility: PriceVisibility;
    isFeatured: boolean;
    brand: { name: string; slug: string } | null;
    category: { name: string; slug: string } | null;
    primaryImage: { thumbnailUrl: string | null; cardUrl: string | null; altText: string | null } | null;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

// ─── Public reads ─────────────────────────────────────────────────────────────

/**
 * Returns paginated published products for the public catalogue.
 * All filter keys are validated against an allowlist.
 */
export async function getPublishedProducts(
  filters: ProductFilters = {},
): Promise<ProductListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  // Validate sort fields
  const sortBy =
    filters.sortBy && ALLOWED_SORT_FIELDS.has(filters.sortBy)
      ? filters.sortBy
      : 'createdAt';
  const sortOrder =
    filters.sortOrder && ALLOWED_SORT_ORDERS.has(filters.sortOrder)
      ? filters.sortOrder
      : 'desc';

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    ...(filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { sku: { contains: filters.search, mode: 'insensitive' } },
            { model: { contains: filters.search, mode: 'insensitive' } },
            { shortDescription: { contains: filters.search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(filters.brandSlug ? { brand: { slug: filters.brandSlug } } : {}),
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.availability ? { availability: filters.availability } : {}),
    ...(filters.priceVisibility ? { priceVisibility: filters.priceVisibility } : {}),
    ...(filters.voltage ? { voltage: filters.voltage } : {}),
    ...(filters.powerSource ? { powerSource: filters.powerSource } : {}),
    ...(filters.productType ? { productType: filters.productType } : {}),
    ...(filters.isFeatured !== undefined ? { isFeatured: filters.isFeatured } : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        model: true,
        shortDescription: true,
        availability: true,
        priceVisibility: true,
        isFeatured: true,
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
        images: {
          where: { isPrimary: true, fileStatus: 'ACTIVE' },
          take: 1,
          select: { thumbnailUrl: true, cardUrl: true, altText: true },
        },
      },
    }),
    db.product.count({ where }),
  ]);

  return {
    products: products.map((p) => ({
      ...p,
      primaryImage: p.images[0] ?? null,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Returns a single published product by slug with full detail.
 */
export async function getPublishedProductBySlug(slug: string) {
  return db.product.findFirst({
    where: { slug, isPublished: true },
    include: {
      brand: { select: { name: true, slug: true, logoUrl: true } },
      category: { select: { name: true, slug: true } },
      specifications: { orderBy: { sortOrder: 'asc' } },
      images: {
        where: { fileStatus: 'ACTIVE' },
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
      },
      documents: {
        where: { fileStatus: 'ACTIVE' },
        select: { id: true, name: true, type: true },
      },
      relatedFrom: {
        include: {
          to: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                where: { isPrimary: true, fileStatus: 'ACTIVE' },
                take: 1,
                select: { thumbnailUrl: true, altText: true },
              },
            },
          },
        },
        take: 6,
      },
    },
  });
}

// ─── Admin reads ──────────────────────────────────────────────────────────────

export async function adminGetProducts(filters: ProductFilters & { includeUnpublished?: boolean } = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 50));
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    ...(filters.includeUnpublished ? {} : { isPublished: true }),
    ...(filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { sku: { contains: filters.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        isPublished: true,
        isFeatured: true,
        availability: true,
        brand: { select: { name: true } },
        category: { select: { name: true } },
        updatedAt: true,
      },
    }),
    db.product.count({ where }),
  ]);

  return { products, total, page, totalPages: Math.ceil(total / limit) };
}

// ─── Writes (admin only) ──────────────────────────────────────────────────────

export interface CreateProductInput {
  name: string;
  slug: string;
  sku?: string;
  model?: string;
  brandId?: string;
  categoryId?: string;
  shortDescription?: string;
  fullDescription?: string;
  features?: string[];
  applications?: string[];
  packageContents?: string[];
  voltage?: string;
  powerSource?: string;
  platform?: string;
  productType?: string;
  detailUrl?: string;
  priceVisibility?: PriceVisibility;
  availability?: AvailabilityStatus;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export async function createProduct(
  data: CreateProductInput,
  actorId: string,
  requestId?: string,
) {
  const product = await db.product.create({
    data: {
      ...data,
      isPublished: false,
    },
  });

  await writeAuditLog({
    actorId,
    action: 'PRODUCT_CREATED',
    resourceType: 'Product',
    resourceId: product.id,
    newValue: { name: product.name, slug: product.slug },
    requestId,
  });

  return product;
}

export async function publishProduct(
  productId: string,
  actorId: string,
  requestId?: string,
) {
  const product = await db.product.update({
    where: { id: productId },
    data: { isPublished: true, publishedAt: new Date() },
  });

  await writeAuditLog({
    actorId,
    action: 'PRODUCT_PUBLISHED',
    resourceType: 'Product',
    resourceId: productId,
    requestId,
  });

  return product;
}

export async function softDeleteProduct(
  productId: string,
  actorId: string,
  requestId?: string,
) {
  // Soft delete: unpublish rather than destroy
  const product = await db.product.update({
    where: { id: productId },
    data: { isPublished: false },
  });

  await writeAuditLog({
    actorId,
    action: 'PRODUCT_DELETED',
    resourceType: 'Product',
    resourceId: productId,
    requestId,
  });

  return product;
}
