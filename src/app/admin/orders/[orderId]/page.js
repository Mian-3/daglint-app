import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

export const dynamic = "force-dynamic";

async function getOrder(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: { select: { name: true, email: true } } },
  });

  if (!order) return null;

  return {
    ...order,
    subtotal: Number(order.subtotal),
    shippingAmount: Number(order.shippingAmount),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
    items: order.items.map((i) => ({ ...i, price: Number(i.price) })),
  };
}

export default async function AdminOrderDetailPage({ params }) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm border-b border-cream-100 last:border-0 pb-3 last:pb-0">
                <span className="text-ink-700">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-ink-900">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-cream-200 mt-4 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Subtotal</span>
              <span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Shipping</span>
              <span>{order.shippingAmount === 0 ? "Free" : `Rs. ${order.shippingAmount.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-cream-100">
              <span>Total</span>
              <span>Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-cream-200 rounded-xl p-5 h-fit">
          <h2 className="font-semibold text-sm mb-3">Customer</h2>
          <p className="text-sm text-ink-900">{order.fullName}</p>
          <p className="text-sm text-ink-600">{order.phone}</p>
          {order.email && <p className="text-sm text-ink-600">{order.email}</p>}
          {order.user && (
            <p className="text-xs text-green-700 mt-1">Registered Customer</p>
          )}

          <h2 className="font-semibold text-sm mt-5 mb-2">Shipping Address</h2>
          <p className="text-sm text-ink-600">
            {order.addressLine}, {order.city}, {order.postalCode}
          </p>

          {order.notes && (
            <>
              <h2 className="font-semibold text-sm mt-5 mb-2">Notes</h2>
              <p className="text-sm text-ink-600">{order.notes}</p>
            </>
          )}

          <h2 className="font-semibold text-sm mt-5 mb-2">Payment Method</h2>
          <p className="text-sm text-ink-600">Cash on Delivery (COD)</p>
        </div>
      </div>
    </div>
  );
}