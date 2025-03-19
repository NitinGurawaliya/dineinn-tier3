import { RatingSchema } from "@/zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


export  async function POST(req:NextRequest){

    const body  = await req.json()

    const {success}  =  RatingSchema.safeParse(body)

    if(!success){
        return NextResponse.json({ msg: "Invalid data" }, { status: 401 });
    }



    

    


}