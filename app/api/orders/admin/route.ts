import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  // If not authenticated, auth.error is a NextResponse; standardize to 401
  if ((auth as any).error) {
    return NextResponse.json({ msg: "Not authenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = Number(searchParams.get("restaurantId"));
    const status = searchParams.get("status") as
      | "PLACED"
      | "ACCEPTED"
      | "IN_PROGRESS"
      | "READY"
      | "SERVED"
      | "CANCELLED"
      | null;

    if (!restaurantId) {
      return NextResponse.json({ msg: "restaurantId is required" }, { status: 400 });
    }

    const where: any = { restaurantId };
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Admin list orders error", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}


