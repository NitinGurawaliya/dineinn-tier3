import { cloudinary } from "@/app/lib/cloudinaryConfig";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResponse = await authMiddleware(req);
    if (authResponse.error) {
        return authResponse.error;
    }

    const restaurantId = req.cookies.get("userId")?.value;
    const imageId = params.id;

    if (!restaurantId) {
        return NextResponse.json({ msg: "User ID not found" }, { status: 400 });
    }

    if (!imageId) {
        return NextResponse.json({ msg: "Image ID not found" }, { status: 400 });
    }

    try {
        // First, get the image details to extract the Cloudinary public_id
        const galleryImage = await prisma.restaurantGallery.findFirst({
            where: {
                id: parseInt(imageId),
                restaurantId: parseInt(restaurantId)
            }
        });

        if (!galleryImage) {
            return NextResponse.json({ msg: "Image not found or unauthorized" }, { status: 404 });
        }

        // Extract public_id from the Cloudinary URL
        const urlParts = galleryImage.imageUrl.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `dishes_image/${filenameWithExtension.split('.')[0]}`;

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
            console.error("Error deleting from Cloudinary:", cloudinaryError);
            // Continue with database deletion even if Cloudinary fails
        }

        // Delete from database
        await prisma.restaurantGallery.delete({
            where: {
                id: parseInt(imageId)
            }
        });

        return NextResponse.json({ msg: "Image deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json({ msg: "Error deleting image" }, { status: 500 });
    }
} 