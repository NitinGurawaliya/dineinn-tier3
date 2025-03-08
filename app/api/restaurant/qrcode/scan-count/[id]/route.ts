import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { REQUEST_URL } from "@/config";

export async function GET(req:NextRequest,context:{params:{id:string}}) {
    const restaurantId =  context.params.id;

    if(!restaurantId){
        return NextResponse.json({msg:'No restaurant'},{status:400})
    }

    try {
        await prisma.restaurantDetail.update({
            where: { id: parseInt(restaurantId) },
            data: { qrScans: { increment: 1 } },
        });


        return NextResponse.json({msg:"Increment success"},{status:200})

    } catch (error) {
        return NextResponse.json({ msg: "Failed to track QR scan", error }, { status: 500 });
    }
    }
