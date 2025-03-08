import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
){ 

    const id = context.params.id; 

    console.log("id is ", id);

    if (!id) {
        return NextResponse.json({ msg:"is not available" },{status:401})
    }

    try {
        const menu = await prisma.restaurantDetail.findUnique({
            where: { id: Number(id) }, // Convert ID to number
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
            },
        });

        if (!menu) {
            return NextResponse.json({ msg: "Menu not found" }, { status: 404 });
             
        }

        return NextResponse.json(menu, { status: 200 });
         
    } catch (error) {
        console.error("Error fetching menu:", error);
         NextResponse.json({ msg: "Internal server error" }, { status: 500 });
         return
    }
}
