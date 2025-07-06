import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, email, dob, restaurantId } = body;

    if (!mobile || !restaurantId) {
      return NextResponse.json({ msg: "Mobile and Restaurant ID are required" }, { status: 400 });
    }

    // Check if customer exists by mobile number
    let customer = await prisma.customer.findUnique({
      where: { mobile },
      include: {
        restaurant: true,
      },
    });

    if (!customer) {
      // Create new customer and link to restaurant
      customer = await prisma.customer.create({
        data: {
          name,
          mobile,
          email,
          DOB: dob ? new Date(dob) : undefined,
          restaurant: {
            connect: { id: restaurantId },
          },
        },
        include: {
          restaurant: true,
        },
      });
    } else {
      // Customer exists, check if already linked to this restaurant
      const isLinkedToRestaurant = customer.restaurant.some(
        (restaurant) => restaurant.id === restaurantId
      );

      if (!isLinkedToRestaurant) {
        // Link existing customer to the new restaurant
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            restaurant: {
              connect: { id: restaurantId },
            },
          },
          include: {
            restaurant: true,
          },
        });
      }
    }

    const token = sign(
      { id: customer.id },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "365d" } // Valid for 1 year
    );

    const response = NextResponse.json({ msg: "Authenticated", customer });

    response.cookies.set("user_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 7 days
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Authenticate user
  const authResult = await authMiddleware(req);
  if (authResult.error) {
    return authResult.error;
  }

  // Get restaurant ID from cookie
  const restaurantId = req.cookies.get("userId")?.value;

  if (!restaurantId) {
    return NextResponse.json({ msg: "Restaurant ID not found in cookies" }, { status: 400 });
  }

  try {
    // Fetch customers linked to the restaurant
    const customers = await prisma.customer.findMany({
      where: {
        restaurant: {
          some: {
            id: parseInt(restaurantId),
          },
        },
      },
      select: {
        id: true,
        name: true,
        mobile: true,
        email: true,
        DOB: true,
      },
    });

    return NextResponse.json({customers});
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}


