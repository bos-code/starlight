// app/(admin)/(shell)/products/page.tsx
// Product management page for admins.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../../../packages/auth/session';
import { can } from '../../../../../packages/auth/permissions';
import { db } from '../../../../../packages/db';
import { ProductImagePlaceholder } from '../../../../../components/ProductImagePlaceholder';

export const metadata = { title: 'Products — Starlite Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'products:read')) redirect('/admin');

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const search = params.search ?? '';
  const skip = (page - 1) * 50;

  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' as const } },
      { sku: { contains: search, mode: 'insensitive' as const } },
    ]
  } : {};

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      skip,
      take: 50,
      include: {
        category: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Product Catalogue</h1>
        <div className="admin-page-actions">
          {can(session.user.role, 'products:write') && (
            <a href="/admin/products/new" className="btn-primary">
              Add Product
            </a>
          )}
        </div>
      </header>

      <form method="GET" className="admin-filter-bar" aria-label="Search products">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search by name or SKU..."
          className="admin-search-input"
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="admin-table-container">
        <table className="admin-table" aria-label="Products">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">SKU</th>
              <th scope="col">Brand</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <ProductImagePlaceholder
                      categorySlug={p.category.slug}
                      className="h-10 w-10 shrink-0 rounded-md"
                      iconClassName="h-5 w-5"
                    />
                    <div>
                      <a href={`/admin/products/${p.id}`} className="admin-table-link" style={{ fontWeight: 600 }}>
                        {p.name}
                      </a>
                      <div className="admin-table-subtitle">{p.category.name}</div>
                    </div>
                  </div>
                </td>
                <td><code>{p.sku ?? '—'}</code></td>
                <td>{p.brand.name}</td>
                <td>
                  <span className={`badge badge--${p.isActive ? 'success' : 'default'}`}>
                    {p.isActive ? 'Active' : 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="admin-pagination" aria-label="Products pagination">
          {page > 1 && (
            <a href={`?page=${page - 1}&search=${search}`} className="admin-pagination-btn">
              ← Previous
            </a>
          )}
          <span className="admin-pagination-info">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a href={`?page=${page + 1}&search=${search}`} className="admin-pagination-btn">
              Next →
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
