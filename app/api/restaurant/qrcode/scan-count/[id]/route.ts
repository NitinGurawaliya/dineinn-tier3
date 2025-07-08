import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { REQUEST_URL } from "@/config";

export async function GET(req:NextRequest,context:{params:{id:string}}) {
    const restaurantId = context.params.id;

    if(!restaurantId){
        return NextResponse.json({msg:'No restaurant'},{status:400})
    }

    // Verify that the restaurant exists and is accessible
    const restaurant = await prisma.restaurantDetail.findUnique({
        where: { id: parseInt(restaurantId) }
    });

    if (!restaurant) {
        return NextResponse.json({msg:'Restaurant not found'},{status:404})
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day

        // Update or create daily QR scan record
        const dailyScan = await prisma.dailyQRScan.upsert({
            where: {
                restaurantId_scanDate: {
                    restaurantId: parseInt(restaurantId),
                    scanDate: today
                }
            },
            update: {
                scanCount: {
                    increment: 1
                }
            },
            create: {
                restaurantId: parseInt(restaurantId),
                scanDate: today,
                scanCount: 1
            }
        });

        // Also update the total QR scans count
        await prisma.restaurantDetail.update({
            where: { id: parseInt(restaurantId) },
            data: { qrScans: { increment: 1 } },
        });

        return NextResponse.json({msg:"QR scan tracked successfully", dailyScan},{status:200})

    } catch (error) {
        console.error("Error tracking QR scan:", error);
        return NextResponse.json({ msg: "Failed to track QR scan", error }, { status: 500 });
    }
}
