import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { AnnouncementSchema } from "@/zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(req:NextRequest) {
try {
    
    const authResult = await authMiddleware(req);

    if (authResult.error) {
        return authResult.error;
    }

    const restaurantId = req.cookies.get("userId")?.value;

    if (!restaurantId) {
        return NextResponse.json({ msg: "User ID or Restaurant ID not found" }, { status: 400 });
    }

    const body = await req.json();

    const {success} = AnnouncementSchema.safeParse(body)

    if(!success){
        return NextResponse.json({msg:"Send valid data "},{status:400})
    }

    const announcement = await prisma.announcement.create({
        data:{
            title:body.title,
            content:body.content,
            restaurantId:parseInt(restaurantId)

        }
    })

    console.log("successfully created announcement")
    return NextResponse.json(announcement);



} catch (error) {
    console.log(error)
    return NextResponse.json({msg:"Internal server err"},{status:500})
}
    
}


export async function DELETE(req:NextRequest) {


    // Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) {
        return authResult.error;
    }

    const body = await req.json()

    const deleteAnnouncement = await prisma.announcement.delete({
        where:{
            id:parseInt(body.id)
        }
    })

    console.log(`Announcement with id ${body.id} is deleted`,deleteAnnouncement)

    return NextResponse.json({msg:"Announcement is deleted"})
    
}