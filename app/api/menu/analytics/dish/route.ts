import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";

export async function GET(req: NextRequest) {
    // Authenticate User
    const authResult = await authMiddleware(req);
    if (authResult.error) {
        return NextResponse.json(authResult.error, { status: 401 });
    }

    // Get user ID from cookies
    const userId = req.cookies.get("userId")?.value;
    if (!userId) {
        return NextResponse.json({ msg: "User ID not found" }, { status: 400 });
    }

    try {
        // Find the restaurant associated with the user
        const restaurant = await prisma.restaurantDetail.findUnique({
            where: { userId: parseInt(userId) },
            select: {
                id: true,
                restaurantName: true,
                dishes: {
                    select: {
                        id: true,
                        name: true,
                        views: {
                            select: {
                                id: true, 
                            },
                        },
                    },
                    
                },
            },
        });

        if (!restaurant) {
            return NextResponse.json({ msg: "Restaurant not found" }, { status: 404 });
        }

        const dishesWithViews = restaurant.dishes.map((dish:any) => ({
            id: dish.id,
            name: dish.name,
            views: dish.views.length, 
        }));

        return NextResponse.json({
            dishes: dishesWithViews,
        });
    } catch (error) {
        console.error("Error fetching dishes:", error);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
    }
}
