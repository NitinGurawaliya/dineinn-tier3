import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


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