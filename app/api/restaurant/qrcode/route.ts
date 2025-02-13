import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import QRCode from "qrcode";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";

export async function GET(req: NextRequest) {
    console.log("hi from route");
    
    const authResult = await authMiddleware(req);

    if (authResult.error) {
        return NextResponse.json(authResult.error, { status: 401 });
    }

    const restaurantId = req.cookies.get("userId")?.value;

    if (!restaurantId) {
        return NextResponse.json({ msg: "Menu ID is required" }, { status: 400 });
    }

    const restaurantDetail = await prisma.restaurantDetail.findUnique({
        where: {
            id: parseInt(restaurantId),
        },
    });

    if (!restaurantDetail) {
        return NextResponse.json({ msg: "Restaurant not found" }, { status: 404 });
    }

    const frontendUrl = `https://dineinn-tier2.vercel.app/restaurant/menu/home/${restaurantId}`;

    try {
        const qrCodeUrl = await QRCode.toDataURL(frontendUrl);
        return NextResponse.json({ qrCodeUrl, restaurantDetail }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ msg: "Failed to generate QR code" }, { status: 500 });
    }
}
