import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCarousel from "@/components/ProductCarousel";
import HeroSlider from "@/components/HeroSlider";
import CategoryShowcase from "@/components/CategoryShowcase";
import { ArrowRight } from "lucide-react";

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

async function getNewArrivals() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
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
  return prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
  });
}

export default async function Home() {
  const [featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
  ]);

  return (
    <div>
      <HeroSlider
        slides={[
          {
            image: "/hero.jpg",
            ctaText: "Shop Now",
            ctaLink: "/shop",
          },
          ...categories.slice(0, 3).map((cat) => ({
            image: cat.imageUrl,
            eyebrow: "New Arrivals",
            title: cat.name,
            subtitle: `Discover our latest ${cat.name.toLowerCase()} collection, curated for you.`,
            ctaText: `Shop ${cat.name}`,
            ctaLink: `/shop?category=${cat.slug}`,
          })),
        ]}
      />

      <CategoryShowcase parentCategories={categories} />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-600 mb-2">
              Handpicked
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-ink-900">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-ink-900 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductCarousel products={featuredProducts} />

        <Link
          href="/shop"
          className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm font-medium text-ink-900 border border-cream-200 rounded-md py-3"
        >
          View All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-600 mb-2">
              Just Landed
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-ink-900">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-ink-900 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductCarousel products={newArrivals} />
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
            className="bg-ink-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}