import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


export async function GET(req:NextRequest,res:NextResponse) {

    console.log("from menu router")

    console.log("Auth Middleware Cookies:", req.cookies.get("userId")?.value);


    const authResult = await authMiddleware(req);
    if(authResult.error){
        return authResult.error;
    }

    const userId = req.cookies.get("userId")?.value;
    console.log(userId)

    if(!userId){
        return NextResponse.json({msg:"no user id"})
    }

    console.log("this is response from",userId);

    const response = await prisma.restaurantDetail.findUnique({
        where:{
            id:parseInt(userId)
        },
        select:{
            logo:true,
            restaurantName:true,
            weekdaysWorking:true,
            weekendWorking:true,
            instagram:true,
            facebook:true,
            categories:true,
            dishes:true,

        }
    })

    return NextResponse.json(response)
}