import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateShipping } from "@/lib/orderCalculations";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${timestamp}${random}`;
}

export async function POST(request) {
  const session = await auth();

  try {
    const body = await request.json();
    const { fullName, email, phone, addressLine, city, postalCode, notes } = body;

    if (!fullName?.trim() || !phone?.trim() || !addressLine?.trim() || !city?.trim() || !postalCode?.trim()) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Get the cart items — logged-in users use their saved cart
    let cartItems = [];

    if (session?.user) {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: { items: { include: { product: true } } },
      });

      if (cart) {
        cartItems = cart.items;
      }
    }

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    // Validate stock and calculate server-side pricing (never trust the client)
    for (const item of cartItems) {
      if (!item.product.isActive) {
        return NextResponse.json(
          { error: `${item.product.name} is no longer available.` },
          { status: 400 }
        );
      }
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${item.product.name}.` },
          { status: 400 }
        );
      }
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const shippingAmount = calculateShipping(subtotal);
    const totalAmount = subtotal + shippingAmount;
    const orderNumber = generateOrderNumber();

    // Create the order, order items, reduce stock, and clear the cart — all in one transaction
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

      if (session?.user) {
        const cart = await tx.cart.findUnique({
          where: { userId: session.user.id },
        });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

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