const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

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

  const men = await prisma.category.create({
    data: { name: "Men", slug: "men", imageUrl: "https://picsum.photos/seed/men-parent/900/1100" },
  });
  const women = await prisma.category.create({
    data: { name: "Women", slug: "women", imageUrl: "https://picsum.photos/seed/women-parent/900/1100" },
  });
  const kids = await prisma.category.create({
    data: { name: "Kids", slug: "kids", imageUrl: "https://picsum.photos/seed/kids-parent/900/1100" },
  });

  // Men children
  const shoes = await prisma.category.create({
    data: { name: "Sneakers", slug: "shoes", description: "Everyday Wear", imageUrl: "https://picsum.photos/seed/shoes-cat/900/1100", parentId: men.id },
  });
  const watches = await prisma.category.create({
    data: { name: "Watches", slug: "watches", description: "Timepieces", imageUrl: "https://picsum.photos/seed/watches-cat/900/1100", parentId: men.id },
  });
  const poloShirts = await prisma.category.create({
    data: { name: "Polo Shirts", slug: "polo-shirts", description: "Smart Casual", imageUrl: "https://picsum.photos/seed/polo-cat/900/1100", parentId: men.id },
  });
  const casualShirts = await prisma.category.create({
    data: { name: "Casual Shirts", slug: "casual-shirts", description: "Everyday Basics", imageUrl: "https://picsum.photos/seed/shirts-cat/900/1100", parentId: men.id },
  });

  // Women children
  const bags = await prisma.category.create({
    data: { name: "Bags", slug: "bags", description: "Stylish Carry", imageUrl: "https://picsum.photos/seed/bags-cat/900/1100", parentId: women.id },
  });
  const accessories = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories", description: "Everyday Essentials", imageUrl: "https://picsum.photos/seed/accessories-cat/900/1100", parentId: women.id },
  });
  const dresses = await prisma.category.create({
    data: { name: "Dresses", slug: "dresses", description: "Occasion Wear", imageUrl: "https://picsum.photos/seed/dresses-cat/900/1100", parentId: women.id },
  });
  const footwear = await prisma.category.create({
    data: { name: "Footwear", slug: "womens-footwear", description: "Everyday Comfort", imageUrl: "https://picsum.photos/seed/womens-shoes-cat/900/1100", parentId: women.id },
  });

  // Kids children
  const kidsShoes = await prisma.category.create({
    data: { name: "Kids Sneakers", slug: "kids-sneakers", description: "Playtime Ready", imageUrl: "https://picsum.photos/seed/kids-shoes/900/1100", parentId: kids.id },
  });
  const kidsBags = await prisma.category.create({
    data: { name: "Kids Backpacks", slug: "kids-backpacks", description: "School Ready", imageUrl: "https://picsum.photos/seed/kids-bags/900/1100", parentId: kids.id },
  });
  const kidsClothing = await prisma.category.create({
    data: { name: "Kids Clothing", slug: "kids-clothing", description: "Everyday Comfort", imageUrl: "https://picsum.photos/seed/kids-clothing/900/1100", parentId: kids.id },
  });
  const kidsToys = await prisma.category.create({
    data: { name: "Kids Toys", slug: "kids-toys", description: "Playtime Fun", imageUrl: "https://picsum.photos/seed/kids-toys/900/1100", parentId: kids.id },
  });

  const products = [
    { name: "Classic Runner Sneakers", slug: "classic-runner-sneakers", description: "A versatile everyday sneaker built for comfort and durability, featuring a breathable mesh upper and cushioned sole.", shortDescription: "Comfortable everyday sneakers.", price: 4999, compareAtPrice: 6499, sku: "SHOE-001", stock: 25, isFeatured: true, categoryId: shoes.id, images: ["shoe1-a", "shoe1-b"] },
    { name: "Urban Leather Boots", slug: "urban-leather-boots", description: "Genuine leather boots designed for the modern city dweller.", shortDescription: "Premium leather boots.", price: 8999, compareAtPrice: null, sku: "SHOE-002", stock: 12, isFeatured: false, categoryId: shoes.id, images: ["shoe2-a"] },
    { name: "Classic Analog Watch", slug: "classic-analog-watch", description: "A timeless analog watch with a stainless steel case and genuine leather strap.", shortDescription: "Timeless analog watch.", price: 7999, compareAtPrice: 9999, sku: "WATCH-001", stock: 15, isFeatured: true, categoryId: watches.id, images: ["watch1-a", "watch1-b"] },
    { name: "Sport Digital Watch", slug: "sport-digital-watch", description: "A rugged digital watch built for active lifestyles.", shortDescription: "Rugged sport digital watch.", price: 3999, compareAtPrice: null, sku: "WATCH-002", stock: 4, isFeatured: false, categoryId: watches.id, images: ["watch2-a"] },
    { name: "Classic Pique Polo", slug: "classic-pique-polo", description: "A classic pique polo shirt, breathable and perfect for smart-casual looks.", shortDescription: "Classic pique polo.", price: 2499, compareAtPrice: 2999, sku: "POLO-001", stock: 30, isFeatured: true, categoryId: poloShirts.id, images: ["polo1-a"] },
    { name: "Slim Fit Polo", slug: "slim-fit-polo", description: "A modern slim-fit polo shirt made from soft cotton blend fabric.", shortDescription: "Modern slim-fit polo.", price: 2799, compareAtPrice: null, sku: "POLO-002", stock: 22, isFeatured: false, categoryId: poloShirts.id, images: ["polo2-a"] },
    { name: "Everyday Casual Shirt", slug: "everyday-casual-shirt", description: "A comfortable everyday shirt suitable for both work and weekend wear.", shortDescription: "Comfortable everyday shirt.", price: 2999, compareAtPrice: 3499, sku: "SHIRT-001", stock: 28, isFeatured: true, categoryId: casualShirts.id, images: ["shirt1-a"] },
    { name: "Checked Flannel Shirt", slug: "checked-flannel-shirt", description: "A cozy checked flannel shirt, perfect for cooler days.", shortDescription: "Cozy checked flannel shirt.", price: 3299, compareAtPrice: null, sku: "SHIRT-002", stock: 16, isFeatured: false, categoryId: casualShirts.id, images: ["shirt2-a"] },
    { name: "Minimalist Canvas Backpack", slug: "minimalist-canvas-backpack", description: "A spacious, minimalist backpack made from durable canvas.", shortDescription: "Everyday minimalist backpack.", price: 3499, compareAtPrice: 4299, sku: "BAG-001", stock: 40, isFeatured: true, categoryId: bags.id, images: ["bag1-a", "bag1-b"] },
    { name: "Leather Crossbody Bag", slug: "leather-crossbody-bag", description: "A compact crossbody bag crafted from premium leather.", shortDescription: "Compact leather crossbody bag.", price: 5499, compareAtPrice: null, sku: "BAG-002", stock: 18, isFeatured: false, categoryId: bags.id, images: ["bag2-a"] },
    { name: "Polarized Sunglasses", slug: "polarized-sunglasses", description: "UV-protected polarized sunglasses with a lightweight, durable frame.", shortDescription: "UV-protected sunglasses.", price: 2499, compareAtPrice: 2999, sku: "ACC-001", stock: 60, isFeatured: true, categoryId: accessories.id, images: ["acc1-a"] },
    { name: "Genuine Leather Belt", slug: "genuine-leather-belt", description: "A classic genuine leather belt with a durable metal buckle.", shortDescription: "Classic leather belt.", price: 1999, compareAtPrice: null, sku: "ACC-002", stock: 35, isFeatured: false, categoryId: accessories.id, images: ["acc2-a"] },
    { name: "Floral Summer Dress", slug: "floral-summer-dress", description: "A lightweight floral dress perfect for warm days.", shortDescription: "Lightweight floral dress.", price: 4499, compareAtPrice: 5499, sku: "DRESS-001", stock: 20, isFeatured: true, categoryId: dresses.id, images: ["dress1-a"] },
    { name: "Evening Wrap Dress", slug: "evening-wrap-dress", description: "An elegant wrap dress suitable for evening occasions.", shortDescription: "Elegant evening wrap dress.", price: 6499, compareAtPrice: null, sku: "DRESS-002", stock: 10, isFeatured: false, categoryId: dresses.id, images: ["dress2-a"] },
    { name: "Comfort Ballet Flats", slug: "comfort-ballet-flats", description: "Soft, comfortable ballet flats for everyday wear.", shortDescription: "Comfortable ballet flats.", price: 3299, compareAtPrice: 3999, sku: "WSHOE-001", stock: 26, isFeatured: true, categoryId: footwear.id, images: ["wshoe1-a"] },
    { name: "Classic Block Heels", slug: "classic-block-heels", description: "Elegant block heels offering comfort and style.", shortDescription: "Elegant block heels.", price: 4799, compareAtPrice: null, sku: "WSHOE-002", stock: 14, isFeatured: false, categoryId: footwear.id, images: ["wshoe2-a"] },
    { name: "Kids Light-Up Sneakers", slug: "kids-light-up-sneakers", description: "Fun light-up sneakers kids love, with durable soles for all-day play.", shortDescription: "Fun light-up sneakers for kids.", price: 2999, compareAtPrice: 3499, sku: "KID-SHOE-001", stock: 20, isFeatured: true, categoryId: kidsShoes.id, images: ["kidshoe1-a"] },
    { name: "Kids School Backpack", slug: "kids-school-backpack", description: "A durable, colorful backpack designed for school days.", shortDescription: "Colorful school backpack.", price: 2299, compareAtPrice: null, sku: "KID-BAG-001", stock: 30, isFeatured: false, categoryId: kidsBags.id, images: ["kidbag1-a"] },
    { name: "Kids Graphic T-Shirt Set", slug: "kids-graphic-tshirt-set", description: "A comfortable, fun graphic t-shirt set for everyday play.", shortDescription: "Fun graphic t-shirt set.", price: 1799, compareAtPrice: 2199, sku: "KID-CLO-001", stock: 34, isFeatured: true, categoryId: kidsClothing.id, images: ["kidclo1-a"] },
    { name: "Kids Building Blocks Set", slug: "kids-building-blocks-set", description: "A creative building blocks set that encourages imaginative play.", shortDescription: "Creative building blocks set.", price: 2599, compareAtPrice: null, sku: "KID-TOY-001", stock: 25, isFeatured: false, categoryId: kidsToys.id, images: ["kidtoy1-a"] },
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