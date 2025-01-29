import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // Extract the 'id' from params
    const { id } = params;

    if (!id) {
        return NextResponse.json({ msg: "Menu ID is required" }, { status: 400 });
    }

    try {
        // Fetch the menu using Prisma
        const menu = await prisma.restaurantDetail.findUnique({
            where: {
                id: parseInt(id), // Convert to integer
            },
            select: {
                restaurantName: true,
                logo: true,
                categories: true,
                dishes: true,
            },
        });

        if (!menu) {
            return NextResponse.json({ msg: "Menu not found" }, { status: 404 });
        }

        return NextResponse.json(menu, { status: 200 });
    } catch (error) {
        console.error("Error fetching menu:", error);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
    }
}

