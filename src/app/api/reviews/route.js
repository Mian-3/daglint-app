import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const session = await auth();

  try {
    const body = await request.json();
    const { productId, rating, title, comment, guestName } = body;

    const numericRating = parseInt(rating);

    if (!productId || !numericRating || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Please provide a valid rating between 1 and 5." },
        { status: 400 }
      );
    }

    if (!comment?.trim()) {
      return NextResponse.json(
        { error: "Please write a comment for your review." },
        { status: 400 }
      );
    }

    if (!session?.user && !guestName?.trim()) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    if (session?.user) {
      const existingReview = await prisma.review.findUnique({
        where: { productId_userId: { productId, userId: session.user.id } },
      });

      if (existingReview) {
        return NextResponse.json(
          { error: "You have already reviewed this product." },
          { status: 409 }
        );
      }
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session?.user?.id || null,
        guestName: session?.user ? null : guestName.trim(),
        rating: numericRating,
        title: title?.trim() || null,
        comment: comment.trim(),
        isApproved: true,
      },
    });

    return NextResponse.json({ message: "Review submitted.", review }, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}