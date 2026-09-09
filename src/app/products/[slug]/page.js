import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions";
import { Star } from "lucide-react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} productName={product.name} />

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
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </p>

          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          <ProductActions product={product} />

          <div className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-xl font-bold mb-6">
          Reviews ({product.reviews.length})
        </h2>

        {product.reviews.length === 0 ? (
          <p className="text-sm text-gray-500">
            No reviews yet. Be the first to review this product.
          </p>
        ) : (
          <div className="space-y-6 max-w-2xl">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.user.name}</span>
                </div>
                {review.title && (
                  <p className="text-sm font-semibold mb-1">{review.title}</p>
                )}
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
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
    </div>
  );
}