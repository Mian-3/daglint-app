import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: { not: null } },
    include: { parent: true },
  });
}

async function getProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  };
}

export default async function EditProductPage({ params }) {
  const { productId } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProduct(productId),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-ink-900 mb-1">
        Edit Product
      </h1>
      <p className="text-sm text-ink-600 mb-6">{product.name}</p>

      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}