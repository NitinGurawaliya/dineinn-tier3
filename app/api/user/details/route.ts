import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
export async function GET(req:NextRequest) {


    const authResult = await authMiddleware(req);
    if (authResult.error) {
        return authResult.error;
    }

    const userId = req.cookies.get("userId")?.value

    if(!userId){
        return NextResponse.json({msg:"no id given "})
    }

    console.log(userId);

    const user  = await prisma.user.findFirst({
        where:{
            id:parseInt(userId)
        },
        select:{
            name:true,
            email:true,
            password:true
        }
    })

    const restaurantDetail = await prisma.restaurantDetail.findFirst({
        where:{
            id:parseInt(userId)
        },
        select:{
            restaurantName:true,
            contactNumber:true,
            location:true,
            instagram:true,
            facebook:true,
            weekdaysWorking:true,
            weekendWorking:true,
            qrScans:true
        }
        
    })

    return NextResponse.json({user,restaurantDetail},{status:200})


    
}