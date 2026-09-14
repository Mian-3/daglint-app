import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: { parent: true, _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return categories;
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
            Categories
          </h1>
          <p className="text-sm text-ink-600">{categories.length} categories total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-ink-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-200 text-left text-xs text-ink-600 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Parent Group</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Products</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-cream-100 last:border-0 hover:bg-cream-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cream-100 rounded-md overflow-hidden shrink-0">
                      {cat.imageUrl && (
                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="font-medium text-ink-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-700">
                  {cat.parent ? cat.parent.name : <span className="text-ink-400">— Top Level —</span>}
                </td>
                <td className="px-5 py-3 text-ink-600 text-xs">{cat.slug}</td>
                <td className="px-5 py-3 text-ink-700">{cat._count.products}</td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/categories/${cat.id}`}
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