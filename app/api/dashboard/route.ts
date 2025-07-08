import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authResult = await authMiddleware(req);
    if (authResult.error) {
        return authResult.error;
    }

    const userId = req.cookies.get("userId")?.value;

    if (!userId) {
        return NextResponse.json({ msg: "no user id" }, { status: 400 });
    }

    try {
        // First, get the user's restaurant details to ensure they own it
        const userRestaurant = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                restaurantDetail: {
                    select: {
                        id: true,
                        logo: true,
                        restaurantName: true,
                        weekdaysWorking: true,
                        weekendWorking: true,
                        instagram: true,
                        facebook: true,
                        qrScans: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!userRestaurant?.restaurantDetail) {
            return NextResponse.json({ msg: "Restaurant not found or unauthorized" }, { status: 404 });
        }

        const restaurantId = userRestaurant.restaurantDetail.id;

        // Fetch all dashboard data in parallel using the correct restaurant ID
        const [
            restaurantDetails,
            galleryImages,
            announcements,
            customers
        ] = await Promise.all([
            // Restaurant details (already fetched above)
            Promise.resolve(userRestaurant.restaurantDetail),
            
            // Gallery images
            prisma.restaurantGallery.findMany({
                where: { restaurantId: restaurantId },
                select: {
                    id: true,
                    imageUrl: true
                }
            }),
            
            // Announcements
            prisma.announcement.findMany({
                where: { restaurantId: restaurantId },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true
                }
            }),
            
            // Customers
            prisma.customer.findMany({
                where: { 
                    restaurant: {
                        some: {
                            id: restaurantId
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    mobile: true,
                    email: true,
                    DOB: true
                }
            })
        ]);

        // Fetch menu data (categories and dishes)
        const menuData = await prisma.restaurantDetail.findUnique({
            where: { id: restaurantId },
            select: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        dishes: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true,
                                description: true,
                                type: true
                            }
                        }
                    }
                }
            }
        });

        // Fetch QR analytics data
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Fetch daily scans for the last 7 days plus today (8 days)
        const dailyScans = await prisma.dailyQRScan.findMany({
            where: {
                restaurantId: restaurantId,
                scanDate: {
                    gte: sevenDaysAgo,
                    lte: today // Include today
                }
            },
            orderBy: {
                scanDate: 'asc'
            }
        });

        // Create a map of existing scan data
        const scanMap = new Map();
        dailyScans.forEach((scan: any) => {
            const dateKey = scan.scanDate.toISOString().split('T')[0];
            scanMap.set(dateKey, scan.scanCount);
        });

        // Generate array of 8 days (7 previous + today) with real data or 0 for missing days
        const qrAnalyticsDays = [];
        let totalScans = 0;
        let todayScanCount = 0;
        
        for (let i = 0; i < 8; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(sevenDaysAgo.getDate() + i);
            
            const dateKey = date.toISOString().split('T')[0];
            const scanCount = scanMap.get(dateKey) || 0;
            
            qrAnalyticsDays.push({
                date: dateKey,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                count: scanCount
            });
            
            totalScans += scanCount;
            if (i === 7) {
                todayScanCount = scanCount;
            }
        }

        // Fetch dish analytics data
        const dishAnalytics = await prisma.dishes.findMany({
            where: {
                restaurantId: restaurantId
            },
            select: {
                id: true,
                name: true,
                viewsCount: true
            },
            orderBy: {
                viewsCount: 'desc'
            },
            take: 10 // Top 10 most viewed dishes
        });

        // Transform dish analytics to include view count
        const transformedDishAnalytics = dishAnalytics.map(dish => ({
            id: dish.id,
            name: dish.name,
            views: dish.viewsCount
        }));

        return NextResponse.json({
            restaurant: restaurantDetails,
            gallery: galleryImages,
            announcements: announcements,
            customers: customers,
            menu: menuData?.categories || [],
            qrAnalytics: {
                dailyScans: qrAnalyticsDays,
                totalScans: totalScans,
                todayScans: todayScanCount,
                weekRange: {
                    start: sevenDaysAgo.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                }
            },
            dishAnalytics: transformedDishAnalytics
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ msg: "Error fetching dashboard data" }, { status: 500 });
    }
} 