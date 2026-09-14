import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { position: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({ ...p, price: Number(p.price) }));
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
            Products
          </h1>
          <p className="text-sm text-ink-600">{products.length} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-ink-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-200 text-left text-xs text-ink-600 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-cream-100 last:border-0 hover:bg-cream-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cream-100 rounded-md overflow-hidden shrink-0">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-ink-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-700">{product.category?.name || "—"}</td>
                <td className="px-5 py-3 text-ink-900">Rs. {product.price.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={product.stock === 0 ? "text-red-600" : product.stock < 5 ? "text-orange-600" : "text-ink-700"}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      product.isActive ? "bg-green-100 text-green-800" : "bg-cream-100 text-ink-600"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex items-center gap-1 text-xs text-ink-600 hover:text-ink-900"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}