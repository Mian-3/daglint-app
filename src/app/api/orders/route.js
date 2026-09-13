import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateShipping } from "@/lib/orderCalculations";

const GUEST_COOKIE = "guestId";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${timestamp}${random}`;
}

export async function POST(request) {
  const session = await auth();
  const guestId = request.cookies.get(GUEST_COOKIE)?.value;

  try {
    const body = await request.json();
    const { fullName, email, phone, addressLine, city, postalCode, notes } = body;

    if (!fullName?.trim() || !phone?.trim() || !addressLine?.trim() || !city?.trim() || !postalCode?.trim()) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    let cart = null;

    if (session?.user) {
      cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: { items: { include: { product: true } } },
      });
    } else if (guestId) {
      cart = await prisma.cart.findUnique({
        where: { guestId },
        include: { items: { include: { product: true } } },
      });
    }

    const cartItems = cart?.items || [];

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    for (const item of cartItems) {
      if (!item.product.isActive) {
        return NextResponse.json({ error: `${item.product.name} is no longer available.` }, { status: 400 });
      }
      if (item.product.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${item.product.name}.` }, { status: 400 });
      }
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const shippingAmount = calculateShipping(subtotal);
    const totalAmount = subtotal + shippingAmount;
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || null,
          subtotal,
          shippingAmount,
          totalAmount,
          fullName,
          email: email?.trim() || "",
          phone,
          addressLine,
          city,
          postalCode,
          notes: notes || null,
          paymentMethod: "COD",
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return NextResponse.json(
      { message: "Order placed successfully.", orderNumber: order.orderNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong while placing your order. Please try again." },
      { status: 500 }
    );
  }
}