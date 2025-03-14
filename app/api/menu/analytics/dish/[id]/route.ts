import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { error } from "console";
import { cookies } from "next/headers";


export async function POST(req:NextRequest,context:{params:{id:string}}) {
    const {id} = context.params

    console.log(id)

    const dishView = await prisma.dishView.create({
        data:{
            dishId:parseInt(id)
        }
    })

    return NextResponse.json({dishView})
}
