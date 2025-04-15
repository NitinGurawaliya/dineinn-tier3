import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { editRestaurantDetailsSchema } from "@/zod";
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

export async function PATCH(req: NextRequest) {
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.error;
    }
  
    const userId = req.cookies.get("userId")?.value;
  
    if (!userId) {
      return NextResponse.json({ msg: "no id given" });
    }
  
    const body = await req.json();
  
    // Validate using Zod schema
    const { success, data, error } = editRestaurantDetailsSchema.safeParse(body);
  
    if (!success) {
      return NextResponse.json({ msg: "invalid data sent", error: error?.format() });
    }
  
    const updated = await prisma.restaurantDetail.update({
      where: { id: parseInt(userId) },
      data: {
        ...(data.restaurantName && { restaurantName: data.restaurantName }),
        ...(data.contactNumber && { contactNumber: data.contactNumber }),
        ...(data.location && { location: data.location }),
        ...(data.weekendWorking && { weekendWorking: data.weekendWorking }),
        ...(data.weekdaysWorking && { weekdaysWorking: data.weekdaysWorking }),
        ...(data.logo && { logo: data.logo }),
        ...(data.instagram && { instagram: data.instagram }),
        ...(data.facebook && { facebook: data.facebook }),
      },
    });
  
    return NextResponse.json({ updatedRestaurant: updated }, { status: 200 });
  }