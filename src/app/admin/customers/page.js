import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getCustomers() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: { orders: { select: { totalAmount: true } } },
    orderBy: { createdAt: "desc" },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    orderCount: user.orders.length,
    totalSpent: user.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
  }));
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Customers
      </h1>
      <p className="text-sm text-ink-600 mb-6">{customers.length} registered customers</p>

      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden overflow-x-auto">
        {customers.length === 0 ? (
          <p className="text-sm text-ink-600 text-center py-16">
            No registered customers yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-left text-xs text-ink-600 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Total Spent</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-cream-100 last:border-0 hover:bg-cream-50">
                  <td className="px-5 py-3 font-medium text-ink-900">{customer.name}</td>
                  <td className="px-5 py-3 text-ink-700">{customer.email}</td>
                  <td className="px-5 py-3 text-ink-700">{customer.orderCount}</td>
                  <td className="px-5 py-3 text-ink-900 font-medium">
                    Rs. {customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-ink-600 text-xs">
                    {new Date(customer.createdAt).toLocaleDateString("en-US", {
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