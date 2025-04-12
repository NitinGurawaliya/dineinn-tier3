import { RatingSchema } from "@/zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


// implement get rating posted by all the users for restaurants in stars and message optional 
// this also needs to implemented to show all the rating on the admin dashboard

export  async function POST(req:NextRequest){

    const body  = await req.json()

    const {success}  =  RatingSchema.safeParse(body)

    if(!success){
        return NextResponse.json({ msg: "Invalid data" }, { status: 401 });
    }
}