import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { cookies } from "next/headers";

export async function POST(req:NextRequest,context:{params:{id:string}}) {
    const {id} = context.params
    console.log("Dish view API called for dish ID:", id);
    try {
        // Create a DishView record for audit/history
        const dishView = await prisma.dishView.create({
            data:{
                dishId:parseInt(id)
            }
        });
        console.log("DishView record created:", dishView);

        // Increment the running total in the Dishes table
        const updatedDish = await prisma.dishes.update({
            where: { id: parseInt(id) },
            data: { viewsCount: { increment: 1 } },
        });
        console.log("Dishes.viewsCount incremented. New value:", updatedDish.viewsCount);

        return NextResponse.json({dishView, viewsCount: updatedDish.viewsCount});
    } catch (error) {
        console.error("Error recording dish view or incrementing viewsCount:", error);
        return NextResponse.json({ msg: "Error recording dish view", error }, { status: 500 });
    }
}
