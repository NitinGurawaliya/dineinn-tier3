import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, email, dob, restaurantId } = body;

    if (!mobile || !restaurantId) {
      return NextResponse.json({ msg: "Mobile and Restaurant ID are required" }, { status: 400 });
    }

    // Check if customer already exists
    let customer = await prisma.customer.findUnique({
      where: { mobile },
    });

    // If not, create customer
    if (!customer) {
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
      });
    }

    // Create a JWT token with just the customer ID
    const token = sign(
      { id: customer.id },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "365d" } // Valid for 1 year
    );

    const response = NextResponse.json({ msg: "Authenticated", customer });

    // Set token cookie only
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
