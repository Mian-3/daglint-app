import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

function buildOrderBy(sort) {
  switch (sort) {
    case "newest":
      return { createdAt: "desc" };
    case "price-low":
      return { price: "asc" };
    case "price-high":
      return { price: "desc" };
    case "featured":
    default:
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
  }
}

async function getCategories() {
  return prisma.category.findMany();
}

async function getProducts({ q, category, sort, availability, page }) {
  const currentPage = Math.max(1, parseInt(page) || 1);

  const where = {
    isActive: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(availability === "in-stock" ? { stock: { gt: 0 } } : {}),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: buildOrderBy(sort),
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const normalizedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  }));

  return {
    products: normalizedProducts,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    currentPage,
  };
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const { q = "", category = "", sort = "featured", availability = "", page = "1" } = params;

  const [categories, { products, totalCount, totalPages, currentPage }] =
    await Promise.all([
      getCategories(),
      getProducts({ q, category, sort, availability, page }),
    ]);

  function buildPageLink(pageNum) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    if (sort) p.set("sort", sort);
    if (availability) p.set("availability", availability);
    p.set("page", pageNum);
    return `/shop?${p.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Shop</h1>
      <p className="text-sm text-gray-500 mb-8">
        {totalCount} {totalCount === 1 ? "product" : "products"} found
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
        <aside>
          <ShopFilters categories={categories} />
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm">
                No products found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Link
                        key={pageNum}
                        href={buildPageLink(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-md text-sm border ${
                          pageNum === currentPage
                            ? "bg-black text-white border-black"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}