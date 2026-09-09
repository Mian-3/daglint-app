import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getOrder(orderNumber) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) return null;

  return {
    ...order,
    subtotal: Number(order.subtotal),
    shippingAmount: Number(order.shippingAmount),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
}

export default async function OrderConfirmationPage({ params }) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-display font-semibold mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-ink-600 text-sm">
          Thank you, {order.fullName}. Your order has been received.
        </p>
      </div>

      <div className="border border-cream-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-cream-200">
          <div>
            <p className="text-xs text-ink-600 uppercase tracking-wide">
              Order Number
            </p>
            <p className="font-semibold">{order.orderNumber}</p>
          </div>
          <span className="text-xs font-medium bg-cream-100 px-3 py-1 rounded-full">
            {order.status}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-ink-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-cream-200 pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-ink-600">Subtotal</span>
            <span>Rs. {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-600">Shipping</span>
            <span>
              {order.shippingAmount === 0
                ? "Free"
                : `Rs. ${order.shippingAmount.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-cream-200">
            <span>Total</span>
            <span>Rs. {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="border border-cream-200 rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-sm mb-3">Shipping To</h2>
        <p className="text-sm text-ink-600">{order.fullName}</p>
        <p className="text-sm text-ink-600">{order.phone}</p>
        <p className="text-sm text-ink-600">
          {order.addressLine}, {order.city}, {order.postalCode}
        </p>
        <p className="text-sm text-ink-600 mt-2">
          Payment Method: Cash on Delivery
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="inline-block bg-ink-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-black"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}