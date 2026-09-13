import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ShopFilterBar from "@/components/ShopFilterBar";
import ProductGrid from "@/components/ProductGrid";

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
  return prisma.category.findMany({ where: { parentId: { not: null } } });
}

async function getActiveCategory(slug) {
  if (!slug) return null;
  return prisma.category.findUnique({ where: { slug } });
}

async function getProducts({ q, category, sort, availability }) {
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
    hasMore: totalCount > PAGE_SIZE,
  };
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const { q = "", category = "", sort = "featured", availability = "" } = params;

  const [categories, activeCategory, { products, totalCount, hasMore }] = await Promise.all([
    getCategories(),
    getActiveCategory(category),
    getProducts({ q, category, sort, availability }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <nav className="flex items-center justify-center gap-1.5 text-xs text-ink-600 mb-6">
        <Link href="/" className="hover:text-ink-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink-900 transition-colors">
          Shop
        </Link>
        {activeCategory && (
          <>
            <span>/</span>
            <span className="text-ink-900 font-medium">{activeCategory.name}</span>
          </>
        )}
      </nav>

      {activeCategory ? (
        <div className="relative mb-10 rounded-2xl overflow-hidden h-64 md:h-80">
          <img
            src={activeCategory.imageUrl}
            alt={activeCategory.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
            <p className="text-white/80 text-xs uppercase tracking-[0.3em] mb-2">
              Collection
            </p>
            <h1 className="text-4xl md:text-6xl font-display italic font-medium text-white tracking-tight">
              {activeCategory.name}
            </h1>
            {activeCategory.description && (
              <p className="text-white/85 text-sm mt-3 max-w-md">
                {activeCategory.description}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-600 mb-3">
            The Full Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-display italic font-medium text-ink-900 tracking-tight">
            Shop All
          </h1>
        </div>
      )}

      <ShopFilterBar categories={categories} totalCount={totalCount} />

      <ProductGrid initialProducts={products} initialHasMore={hasMore} />
    </div>
  );
}