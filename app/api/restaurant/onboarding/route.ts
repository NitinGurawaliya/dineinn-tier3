import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { restaurantOnboardingSchema } from "@/zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
    console.log("Handler initiated");

    const authResult = await authMiddleware(req);

    if (authResult.error) {
        return authResult.error; 
    }

    const userId = req.cookies.get("userId")?.value;

    console.log("Extracted userId from headers:", userId);

    if (!userId) {
        return NextResponse.json({ msg: "User ID not found" }, { status: 500 });
    }

    const body = await req.json();
    console.log("Incoming request body:", body);

    const { success } = restaurantOnboardingSchema.safeParse(body);

    if (!success) {
        return NextResponse.json({ msg: "Invalid data sent" }, { status: 409 });
    }

    try {
        const restaurantDetails = await prisma.restaurantDetail.create({
            data: {
                restaurantName: body.restaurantName,
                contactNumber: body.contactNumber,
                location: body.location,
                weekdaysWorking: body.WeekdaysWorking,
                weekendWorking: body.WeekendWorking,
                logo: body.Logo,
                instagram: body.Instagram,
                facebook: body.Facebook,
                userId: parseInt(userId),
            },
        });

        return NextResponse.json(restaurantDetails, { status: 201 });
    } catch (dbError) {
        // Ensure dbError is an object before logging
        if (dbError instanceof Error) {
            console.error("Database error:", dbError.message);
        } else {
            console.error("Database error:", dbError);
        }
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
    }
}
