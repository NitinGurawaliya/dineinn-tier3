import { cloudinary } from "@/app/lib/cloudinaryConfig";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req:NextRequest) {

    const authResponse  = await authMiddleware(req);
    if(authResponse.error){
        return authResponse.error
    }

    const restaurantId = req.cookies.get("userId")?.value;

    if (!restaurantId) {
        return NextResponse.json({ msg: "User ID or Restaurant ID not found" }, { status: 400 });
    }

    try {
        
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if(!file){
            return NextResponse.json({msg:"No image provided "},{status:500})
        }

        const buffer = await file.arrayBuffer();
        const base64String = Buffer.from(buffer).toString("base64");

        const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64String}`, {
            folder: "dishes_image",
            public_id: file.name.split(".")[0],
        });

        const imageUrl = uploadResponse.secure_url;

        const galleryimages = await prisma.restaurantGallery.create({
            data:{
                restaurantId:parseInt(restaurantId),
                imageUrl

            }
        })

        console.log("this is image",imageUrl)

        return NextResponse.json({galleryimages},{status:200})

        
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ msg: "Error uploading image" }, { status: 500 });
    }


}


