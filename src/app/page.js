import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  }));
}

async function getCategories() {
  return prisma.category.findMany({ take: 4 });
}

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Premium Products, Delivered to You
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Discover our curated collection of shoes, bags, watches, and
          accessories built for everyday life.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-gray-100"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <span className="text-white font-semibold">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/shop" className="text-sm font-medium underline">
            View All
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Stay in the loop</h2>
        <p className="text-gray-600 text-sm mb-6">
          Get updates on new arrivals and exclusive offers.
        </p>
        <form className="max-w-sm mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}