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
     {/* Hero Section */}
<section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
  <img
    src="/hero.jpg"
    alt="Explore our new season collection"
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/10" />
  <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
    <Link
      href="/shop"
   className="inline-block bg-ink-900 text-white px-8 py-3.5 rounded-md text-sm font-medium hover:bg-black transition-colors shadow-lg"
    >
      Shop Now
    </Link>
  </div>
</section>

      {/* Featured Categories */}
    {/* Featured Categories */}
     {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-display font-semibold text-ink-900 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-cream-100"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-ink-900/30 flex items-end p-4">
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
          <h2 className="text-2xl font-display font-semibold text-ink-900">
            Featured Products
          </h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-ink-900 hover:text-black underline"
          >
            View All
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p className="text-ink-600 text-sm">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-cream-100 py-16 px-4 text-center">
        <h2 className="text-xl font-display font-semibold text-ink-900 mb-2">
          Stay in the loop
        </h2>
        <p className="text-ink-600 text-sm mb-6">
          Get updates on new arrivals and exclusive offers.
        </p>
        <form className="max-w-sm mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 border border-cream-200 rounded-md px-3 py-2 text-sm bg-white"
          />
          <button
            type="submit"
            className="bg-ink-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}