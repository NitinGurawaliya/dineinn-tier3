import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const categoryId = params.id; 

    if (!categoryId) {
        return NextResponse.json({ msg: "This category donot ID is required" }, { status: 400 });
    }

    const response = await prisma.category.findUnique({
        where:{
            id:parseInt(categoryId)
        },
        select:{
            dishes:true
        }
    })
    
    console.log("id from category filter route", categoryId);

    return NextResponse.json({ response});
}
