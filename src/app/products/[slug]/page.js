import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import { Star } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";
import { Accordion } from "@/components/Accordion";
import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";
import ShareButtons from "@/components/ShareButtons";
import MobileStickyBar from "@/components/MobileStickyBar";

export const dynamic = "force-dynamic";

async function getProduct(slug) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) return null;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    avgRating,
  };
}

async function getRelatedProducts(categoryId, excludeId) {
  const products = await prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    take: 4,
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
   <div className="max-w-7xl mx-auto px-4 py-10">
  <nav className="text-xs text-ink-600 mb-6 flex items-center gap-1.5">
    <Link href="/" className="hover:text-black">Home</Link>
    <span>/</span>
    <Link href="/shop" className="hover:text-black">Shop</Link>
    <span>/</span>
    <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-black">
      {product.category?.name}
    </Link>
    <span>/</span>
    <span className="text-ink-900 font-medium">{product.name}</span>
  </nav>
<div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10">     <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {product.category?.name}
          </p>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews.length} review
                {product.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold">
              Rs. {product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-gray-400 line-through">
                  Rs. {product.compareAtPrice.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm mb-4">
  {product.stock <= 0 ? (
    <span className="text-red-600 font-medium">Out of Stock</span>
  ) : product.stock < 5 ? (
    <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold bg-red-50 border border-red-200 rounded-full px-3 py-1 animate-soft-pulse">
      🔥 Only {product.stock} left in stock — order soon!
    </span>
  ) : (
    <span className="text-green-600 font-medium">
      In Stock ({product.stock} available)
    </span>
  )}
</p>

          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          <ProductActions product={product} />
     <div className="mt-6 pt-6 border-t border-cream-200 space-y-5">
  <TrustBadges />
  <ShareButtons productName={product.name} />
</div>

         <div className="mt-10">
  <Accordion
    items={[
      {
        title: "Description",
        content: product.description,
      },
     {
  title: "Shipping Information",
  content:
    product.shippingInfo ||
    "Orders are processed within 1-2 business days. Free shipping on orders over Rs. 1500, otherwise a flat Rs. 250 shipping fee applies. Delivery typically takes 3-5 business days depending on your location.",
},
{
  title: "Return Policy",
  content:
    product.returnPolicy ||
    "If you're not satisfied with your purchase, you can request a return within 7 days of delivery. The item must be unused and in its original packaging.",
},
    ]}
  />
</div>
        </div>
      </div>

      {/* Reviews */}
           {/* Reviews */}
      <div className="mt-16 border-t border-cream-200 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-display font-semibold text-ink-900">
              Customer Reviews
            </h2>
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(product.avgRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-cream-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-ink-600">
                  {product.avgRating.toFixed(1)} out of 5 ({product.reviews.length} review
                  {product.reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-10 max-w-xl">
          <ReviewForm productId={product.id} />
        </div>

        {product.reviews.length === 0 ? (
          <p className="text-sm text-ink-600">
            No reviews yet. Be the first to review this product.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
            {product.reviews.map((review) => {
              const reviewerName = review.user?.name || review.guestName || "Anonymous";
              const initial = reviewerName.charAt(0).toUpperCase();
              return (
                <div
                  key={review.id}
                  className="border border-cream-200 rounded-xl p-5 bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-ink-900 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{reviewerName}</p>
                      <p className="text-xs text-ink-600">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-cream-200"
                        }`}
                      />
                    ))}
                  </div>

                  {review.title && (
                    <p className="text-sm font-semibold text-ink-900 mb-1">{review.title}</p>
                  )}
                  <p className="text-sm text-ink-600 leading-relaxed">{review.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
      <MobileStickyBar product={product} />
      <div className="max-w-7xl mx-auto px-4 py-10 pb-20 md:pb-10"></div>
    </div>
  );
}