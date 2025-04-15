import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rating, message, restaurantId } = body;

    if (!restaurantId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRating = await prisma.restaurantRating.create({
      data: {
        rating,
        message,
        restaurantId,
      },
    });

    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
