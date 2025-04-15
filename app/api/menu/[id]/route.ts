import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ msg: "ID is not available" }, { status: 401 });
  }

  try {
    const menu = await prisma.restaurantDetail.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        restaurantName: true,
        weekdaysWorking: true,
        weekendWorking: true,
        location: true,
        facebook: true,
        instagram: true,
        contactNumber: true,
        logo: true,
        categories: true,
        dishes: true,
        galleryImages: true,
        rating: true,
      },
    });

    if (!menu) {
      return NextResponse.json({ msg: "Menu not found" }, { status: 404 });
    }

    // Calculate average rating and count
    const ratings = menu.rating;
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? parseFloat(
            (
              ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
            ).toFixed(1)
          )
        : 0;

    return NextResponse.json(
      {
        averageRating,
        totalRatings,
        ...menu,
        
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { msg: "Internal server error from this API" },
      { status: 500 }
    );
  }
}
