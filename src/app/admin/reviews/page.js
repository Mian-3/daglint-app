import { prisma } from "@/lib/prisma";
import ReviewActions from "@/components/admin/ReviewActions";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

async function getReviews() {
  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { name: true, slug: true } },
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Reviews
      </h1>
      <p className="text-sm text-ink-600 mb-6">{reviews.length} total reviews</p>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-ink-600 text-center py-16 bg-white border border-cream-200 rounded-xl">
            No reviews yet.
          </p>
        ) : (
          reviews.map((review) => {
            const reviewerName = review.user?.name || review.guestName || "Anonymous";
            return (
              <div
                key={review.id}
                className="bg-white border border-cream-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{review.product.name}</p>
                    <p className="text-xs text-ink-600">by {reviewerName}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                      review.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {review.isApproved ? "Visible" : "Hidden"}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-cream-200"
                      }`}
                    />
                  ))}
                </div>

                {review.title && (
                  <p className="text-sm font-semibold text-ink-900 mb-1">{review.title}</p>
                )}
                <p className="text-sm text-ink-600 mb-4">{review.comment}</p>

                <ReviewActions reviewId={review.id} isApproved={review.isApproved} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}