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

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

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
    const subdomain = formData.get("subdomain") as string
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

    // Validate subdomain
    const reserved = ["www", "api", "admin", "mail", "ftp", "blog"];
    if (reserved.includes(subdomain)) {
        return NextResponse.json({ msg: "This subdomain is reserved" }, { status: 400 });
    }
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
        return NextResponse.json({ msg: "Subdomain can only contain lowercase letters, numbers, and hyphens" }, { status: 400 });
    }
    if (subdomain.length < 3 || subdomain.length > 63) {
        return NextResponse.json({ msg: "Subdomain must be between 3 and 63 characters" }, { status: 400 });
    }
    // Check if subdomain is already taken
    const existingSubdomain = await prisma.restaurantDetail.findUnique({ where: { subdomain: subdomain } });
    if (existingSubdomain) {
        return NextResponse.json({ msg: "Subdomain already taken" }, { status: 409 });
    }
    // Check if restaurantName is already taken
    const existingName = await prisma.restaurantDetail.findUnique({ where: { restaurantName: restaurantName } });
    if (existingName) {
        return NextResponse.json({ msg: "Restaurant name already taken" }, { status: 409 });
    }

    try {
        const restaurantDetails = await prisma.restaurantDetail.create({
            data: {
               
                restaurantName,
                subdomain,
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
