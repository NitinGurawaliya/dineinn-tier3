import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: { subdomain: string } }
) {
  const { subdomain } = context.params;

  try {
    const restaurant = await prisma.restaurantDetail.findUnique({
      where: { subdomain },
      select: {
        id: true,
        restaurantName: true,
        subdomain: true,
        logo: true,
        location: true,
        contactNumber: true,
        weekdaysWorking: true,
        weekendWorking: true,
        instagram: true,
        facebook: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({ msg: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(restaurant, { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurant by subdomain:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
} 