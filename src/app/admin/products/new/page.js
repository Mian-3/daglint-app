import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: { not: null } },
    include: { parent: true },
  });
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Add New Product
      </h1>
      <p className="text-sm text-ink-600 mb-6">
        Fill in the details below to add a new product to your store.
      </p>

      <ProductForm categories={categories} />
    </div>
  );
}