import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

async function getTopLevelCategories() {
  return prisma.category.findMany({ where: { parentId: null } });
}

export default async function NewCategoryPage() {
  const topLevelCategories = await getTopLevelCategories();

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Add New Category
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        Create a top-level group (like Men/Women/Kids) or a sub-category.
      </p>

      <CategoryForm topLevelCategories={topLevelCategories} />
    </div>
  );
}