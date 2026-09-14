import { prisma } from "@/lib/prisma";
import StockUpdater from "@/components/admin/StockUpdater";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { stock: "asc" },
  });
  return products;
}

export default async function AdminInventoryPage() {
  const products = await getProducts();

  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 5).length;

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Inventory
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        Track and update stock levels across all products.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <p className="text-xs text-ink-600 mb-2">Total Products</p>
          <p className="text-xl font-semibold text-ink-900">{products.length}</p>
        </div>
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            <p className="text-xs text-ink-600">Low Stock (&lt; 5)</p>
          </div>
          <p className="text-xl font-semibold text-orange-600">{lowStock}</p>
        </div>
        <div className="bg-white border border-cream-200 rounded-xl p-5">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <p className="text-xs text-ink-600">Out of Stock</p>
          </div>
          <p className="text-xl font-semibold text-red-600">{outOfStock}</p>
        </div>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-200 text-left text-xs text-ink-600 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Current Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-cream-100 last:border-0 hover:bg-cream-50">
                <td className="px-5 py-3 font-medium text-ink-900">{product.name}</td>
                <td className="px-5 py-3 text-ink-600 text-xs">{product.sku}</td>
                <td className="px-5 py-3 text-ink-700">{product.stock}</td>
                <td className="px-5 py-3">
                  {product.stock === 0 ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  ) : product.stock < 5 ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <StockUpdater productId={product.id} currentStock={product.stock} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}