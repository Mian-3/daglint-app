import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

async function getTopLevelCategories() {
  return prisma.category.findMany({ where: { parentId: null } });
}

async function getCategory(id) {
  return prisma.category.findUnique({ where: { id } });
}

export default async function EditCategoryPage({ params }) {
  const { categoryId } = await params;
  const [topLevelCategories, category] = await Promise.all([
    getTopLevelCategories(),
    getCategory(categoryId),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Edit Category
      </h1>
      <p className="text-sm text-ink-600 mb-6">{category.name}</p>

      <CategoryForm topLevelCategories={topLevelCategories} initialData={category} />
    </div>
  );
}