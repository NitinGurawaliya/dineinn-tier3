import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
    // Explicitly await params if needed
    const params = await Promise.resolve(context.params);
    const { id } = params;

    const authResult = await authMiddleware(req);
    if (authResult.error) {
        return authResult.error;
    }

    const { name, price, image } = await req.json();

    const restaurantId = req.headers.get("restaurantId")
    const userId = req.headers.get("userId")

    if (!userId || !restaurantId) {
        return NextResponse.json({ msg: "User ID or Restaurant ID not found" }, { status: 400 });
    }


    console.log(`Dish: ${name}, Price: ${price}, Image: ${image}`);

    const dish = await prisma.dishes.create({
        data:{
            name:name,
            price:price,
            image:image,
            categoryId:parseInt(id),
            restaurantId:parseInt(restaurantId),
            


        }
    })

    return NextResponse.json({
        dish
    });
}
