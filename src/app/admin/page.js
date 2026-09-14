import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DateRangeFilter from "@/components/admin/DateRangeFilter";
import { getDateRange, RANGE_LABELS } from "@/lib/dateRanges";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats(range, from, to) {
  const { start, end } = getDateRange(range, from, to);

  const dateFilter = { createdAt: { gte: start, lte: end } };

  const [
    ordersInRange,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    revenueResult,
  ] = await Promise.all([
    prisma.order.count({ where: dateFilter }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lt: 5 } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { ...dateFilter, status: { not: "CANCELLED" } },
    }),
  ]);

  const totalRevenue = Number(revenueResult._sum.totalAmount || 0);
  const avgOrderValue = ordersInRange > 0 ? totalRevenue / ordersInRange : 0;

  return {
    ordersInRange,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts,
    recentOrders: recentOrders.map((o) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
    })),
    totalRevenue,
    avgOrderValue,
  };
}

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function AdminDashboardPage({ searchParams }) {
  const params = await searchParams;
  const range = params.range || "month";
  const from = params.from || "";
  const to = params.to || "";

  const stats = await getStats(range, from, to);

  const cards = [
    {
      label: `Revenue (${RANGE_LABELS[range] || "This Month"})`,
      value: `Rs. ${stats.totalRevenue.toLocaleString()} PKR`,
      icon: DollarSign,
    },
    {
      label: `Orders (${RANGE_LABELS[range] || "This Month"})`,
      value: stats.ordersInRange,
      icon: ShoppingBag,
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
    },
    {
      label: "Active Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
    },
    {
      label: "Avg. Order Value",
      value: `Rs. ${Math.round(stats.avgOrderValue).toLocaleString()} PKR`,
      icon: DollarSign,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Dashboard
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        An overview of your store&apos;s performance.
      </p>

      <DateRangeFilter />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-cream-200 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ink-600">{card.label}</span>
                <Icon className="w-4 h-4 text-ink-600" />
              </div>
              <p className="text-xl md:text-2xl font-semibold text-ink-900">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-ink-600 hover:text-ink-900">
              View All
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-ink-600">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between text-sm border-b border-cream-100 last:border-0 pb-3 last:pb-0 hover:bg-cream-50 -mx-2 px-2 py-1 rounded"
                >
                  <div>
                    <p className="font-medium text-ink-900">{order.orderNumber}</p>
                    <p className="text-xs text-ink-600">
                      {order.fullName} · {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. {order.totalAmount.toLocaleString()}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        STATUS_COLORS[order.status] || "bg-cream-100 text-ink-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h2 className="font-semibold text-sm">Low Stock Alert</h2>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-ink-600">All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between text-sm hover:bg-cream-50 -mx-2 px-2 py-1 rounded"
                >
                  <span className="text-ink-900 truncate">{product.name}</span>
                  <span
                    className={`text-xs font-medium ${
                      product.stock === 0 ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}