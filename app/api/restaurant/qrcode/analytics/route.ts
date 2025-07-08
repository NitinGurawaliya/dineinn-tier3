import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authResponse = await authMiddleware(req);
    if (authResponse.error) {
        return authResponse.error;
    }

    const userId = req.cookies.get("userId")?.value;

    if (!userId) {
        return NextResponse.json({ msg: "User ID not found" }, { status: 400 });
    }

    // Get the user's restaurant ID to ensure they own it
    const userRestaurant = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
            restaurantDetail: {
                select: { id: true, qrScans: true }
            }
        }
    });

    if (!userRestaurant?.restaurantDetail) {
        return NextResponse.json({ msg: "Restaurant not found or unauthorized" }, { status: 404 });
    }

    const restaurantId = userRestaurant.restaurantDetail.id;

    try {
        // Calculate the date range for the past 7 days
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7); // 7 days ago

        // Get real daily QR scan data for the past 7 days
        const dailyScans = await prisma.dailyQRScan.findMany({
            where: {
                restaurantId: restaurantId,
                scanDate: {
                    gte: sevenDaysAgo,
                    lt: today // Less than today (excludes today)
                }
            },
            orderBy: {
                scanDate: 'asc' // Oldest to newest
            }
        });

        // Create a map of existing scan data
        const scanMap = new Map();
        dailyScans.forEach((scan: any) => {
            const dateKey = scan.scanDate.toISOString().split('T')[0];
            scanMap.set(dateKey, scan.scanCount);
        });

        // Generate array of 7 days with real data or 0 for missing days
        const days = [];
        let totalScans = 0;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(sevenDaysAgo.getDate() + i);
            
            const dateKey = date.toISOString().split('T')[0];
            const scanCount = scanMap.get(dateKey) || 0;
            
            days.push({
                date: dateKey,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                count: scanCount
            });
            
            totalScans += scanCount;
        }

        return NextResponse.json({
            dailyScans: days,
            totalScans: totalScans,
            weekRange: {
                start: sevenDaysAgo.toISOString().split('T')[0],
                end: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Yesterday
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching QR analytics:", error);
        return NextResponse.json({ msg: "Error fetching QR analytics" }, { status: 500 });
    }
} 