import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

async function getOrders(status) {
  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => ({ ...o, totalAmount: Number(o.totalAmount) }));
}

async function getStatusCounts() {
  const counts = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });
  const map = {};
  counts.forEach((c) => {
    map[c.status] = c._count;
  });
  return map;
}

export default async function AdminOrdersPage({ searchParams }) {
  const params = await searchParams;
  const status = params.status || "";

  const [orders, statusCounts, totalCount] = await Promise.all([
    getOrders(status),
    getStatusCounts(),
    prisma.order.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Orders
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        Manage and track all customer orders.
      </p>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 border-b border-cream-200 mb-6 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = tab.value === "" ? totalCount : statusCounts[tab.value] || 0;
          const isActive = status === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/orders?status=${tab.value}` : "/admin/orders"}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? "border-ink-900 text-ink-900"
                  : "border-transparent text-ink-600 hover:text-ink-900"
              }`}
            >
              {tab.label} ({count})
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-sm text-ink-600 text-center py-16">
            No orders found for this status.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-left text-xs text-ink-600 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-cream-100 last:border-0 hover:bg-cream-50 cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink-900 hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-ink-700">{order.fullName}</td>
                  <td className="px-5 py-4 text-ink-700">{order.items.length}</td>
                  <td className="px-5 py-4 font-medium text-ink-900">
                    Rs. {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        STATUS_COLORS[order.status] || "bg-cream-100 text-ink-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-600 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}