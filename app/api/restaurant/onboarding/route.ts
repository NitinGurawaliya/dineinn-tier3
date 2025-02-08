import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { restaurantOnboardingSchema } from "@/zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export async function POST(req: NextRequest) {
    console.log("Handler initiated");

    const authResult = await authMiddleware(req);

    if (authResult.error) {
        return authResult.error; 
    }

    const userId = req.cookies.get("userId")?.value;

    console.log("Extracted userId from headers:", userId);

    if (!userId) {
        return NextResponse.json({ msg: "User ID not found" }, { status: 500 });
    }
    const formData = await req.formData();

    const restaurantName= formData.get("restaurantName") as string
    const contactNumber = formData.get("contactNumber") as string
    const location = formData.get("location") as string 
    const weekdaysWorking = formData.get("weekdaysWorking") as string 
    const weekendWorking = formData.get("weekendWorking") as string
    const file = formData.get("logo") as File
    const instagram = formData.get("instagram") as string
    const facebook = formData.get("facebook") as string 


    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString("base64");    

    const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64String}`, {
      folder: "dishes_image",
      public_id: file.name.split(".")[0],
    });

    const imageUrl = uploadResponse.secure_url;

    try {
        const restaurantDetails = await prisma.restaurantDetail.create({
            data: {
               
                restaurantName,
                contactNumber,
                location,
                weekdaysWorking,
                weekendWorking,
                logo:imageUrl,
                instagram,
                facebook,
                userId: parseInt(userId),
            },
        });

        return NextResponse.json(restaurantDetails, { status: 201 });
    } catch (dbError) {
        // Ensure dbError is an object before logging
        if (dbError instanceof Error) {
            console.error("Database error:", dbError.message);
        } else {
            console.error("Database error:", dbError);
        }
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
    }
}
