import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 8;

function buildOrderBy(sort) {
  switch (sort) {
    case "newest":
      return { createdAt: "desc" };
    case "price-low":
      return { price: "asc" };
    case "price-high":
      return { price: "desc" };
    case "featured":
    default:
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "featured";
  const availability = searchParams.get("availability") || "";
  const page = Math.max(1, parseInt(searchParams.get("page")) || 1);

  const where = {
    isActive: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(availability === "in-stock" ? { stock: { gt: 0 } } : {}),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const normalizedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  }));

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return NextResponse.json({
    products: normalizedProducts,
    totalCount,
    totalPages,
    currentPage: page,
    hasMore: page < totalPages,
  });
}