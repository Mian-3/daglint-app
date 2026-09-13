import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const GUEST_COOKIE = "guestId";

export async function POST(request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const guestId = request.cookies.get(GUEST_COOKIE)?.value;

  if (!guestId) {
    return NextResponse.json({ message: "Nothing to merge." });
  }

  try {
    const guestCart = await prisma.cart.findUnique({
      where: { guestId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      const response = NextResponse.json({ message: "Nothing to merge." });
      response.cookies.delete(GUEST_COOKIE);
      return response;
    }

    let userCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({ data: { userId: session.user.id } });
    }

    for (const guestItem of guestCart.items) {
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: { cartId: userCart.id, productId: guestItem.productId },
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
          },
        });
      }
    }

    // Delete the guest cart (cascades to its items)
    await prisma.cart.delete({ where: { id: guestCart.id } });

    const response = NextResponse.json({ message: "Cart merged." });
    response.cookies.delete(GUEST_COOKIE);
    return response;
  } catch (error) {
    console.error("Cart merge error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}