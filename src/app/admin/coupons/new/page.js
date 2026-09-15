import CouponForm from "@/components/admin/CouponForm";

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Add New Coupon
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        Create a discount code customers can apply at checkout.
      </p>

      <CouponForm />
    </div>
  );
}