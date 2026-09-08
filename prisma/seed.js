const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data (order matters due to relations)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Shoes",
        slug: "shoes",
        description: "Premium footwear for every occasion.",
        imageUrl: "https://picsum.photos/seed/shoes-cat/600/400",
      },
    }),
    prisma.category.create({
      data: {
        name: "Bags",
        slug: "bags",
        description: "Stylish bags and backpacks.",
        imageUrl: "https://picsum.photos/seed/bags-cat/600/400",
      },
    }),
    prisma.category.create({
      data: {
        name: "Watches",
        slug: "watches",
        description: "Elegant timepieces.",
        imageUrl: "https://picsum.photos/seed/watches-cat/600/400",
      },
    }),
    prisma.category.create({
      data: {
        name: "Accessories",
        slug: "accessories",
        description: "Everyday essentials and add-ons.",
        imageUrl: "https://picsum.photos/seed/accessories-cat/600/400",
      },
    }),
  ]);

  const [shoes, bags, watches, accessories] = categories;

  const products = [
    {
      name: "Classic Runner Sneakers",
      slug: "classic-runner-sneakers",
      description:
        "A versatile everyday sneaker built for comfort and durability, featuring a breathable mesh upper and cushioned sole.",
      shortDescription: "Comfortable everyday sneakers.",
      price: 4999,
      compareAtPrice: 6499,
      sku: "SHOE-001",
      stock: 25,
      isFeatured: true,
      categoryId: shoes.id,
      images: ["shoe1-a", "shoe1-b"],
    },
    {
      name: "Urban Leather Boots",
      slug: "urban-leather-boots",
      description:
        "Genuine leather boots designed for the modern city dweller. Durable, water-resistant, and stylish.",
      shortDescription: "Premium leather boots.",
      price: 8999,
      compareAtPrice: null,
      sku: "SHOE-002",
      stock: 12,
      isFeatured: false,
      categoryId: shoes.id,
      images: ["shoe2-a"],
    },
    {
      name: "Minimalist Canvas Backpack",
      slug: "minimalist-canvas-backpack",
      description:
        "A spacious, minimalist backpack made from durable canvas with a padded laptop compartment.",
      shortDescription: "Everyday minimalist backpack.",
      price: 3499,
      compareAtPrice: 4299,
      sku: "BAG-001",
      stock: 40,
      isFeatured: true,
      categoryId: bags.id,
      images: ["bag1-a", "bag1-b"],
    },
    {
      name: "Leather Crossbody Bag",
      slug: "leather-crossbody-bag",
      description:
        "A compact crossbody bag crafted from premium leather, perfect for essentials on the go.",
      shortDescription: "Compact leather crossbody bag.",
      price: 5499,
      compareAtPrice: null,
      sku: "BAG-002",
      stock: 18,
      isFeatured: false,
      categoryId: bags.id,
      images: ["bag2-a"],
    },
    {
      name: "Classic Analog Watch",
      slug: "classic-analog-watch",
      description:
        "A timeless analog watch with a stainless steel case and genuine leather strap.",
      shortDescription: "Timeless analog watch.",
      price: 7999,
      compareAtPrice: 9999,
      sku: "WATCH-001",
      stock: 15,
      isFeatured: true,
      categoryId: watches.id,
      images: ["watch1-a", "watch1-b"],
    },
    {
      name: "Sport Digital Watch",
      slug: "sport-digital-watch",
      description:
        "A rugged digital watch built for active lifestyles, with a water-resistant design.",
      shortDescription: "Rugged sport digital watch.",
      price: 3999,
      compareAtPrice: null,
      sku: "WATCH-002",
      stock: 0,
      isFeatured: false,
      categoryId: watches.id,
      images: ["watch2-a"],
    },
    {
      name: "Polarized Sunglasses",
      slug: "polarized-sunglasses",
      description:
        "UV-protected polarized sunglasses with a lightweight, durable frame.",
      shortDescription: "UV-protected sunglasses.",
      price: 2499,
      compareAtPrice: 2999,
      sku: "ACC-001",
      stock: 60,
      isFeatured: true,
      categoryId: accessories.id,
      images: ["acc1-a"],
    },
    {
      name: "Genuine Leather Belt",
      slug: "genuine-leather-belt",
      description:
        "A classic genuine leather belt with a durable metal buckle, suitable for formal and casual wear.",
      shortDescription: "Classic leather belt.",
      price: 1999,
      compareAtPrice: null,
      sku: "ACC-002",
      stock: 35,
      isFeatured: false,
      categoryId: accessories.id,
      images: ["acc2-a"],
    },
  ];

  for (const p of products) {
    const { images, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((seed, index) => ({
            url: `https://picsum.photos/seed/${seed}/800/800`,
            altText: productData.name,
            position: index,
          })),
        },
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });