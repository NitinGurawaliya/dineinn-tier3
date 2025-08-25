import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const auth = await authMiddleware(req);
  if ((auth as any).error) {
    return NextResponse.json({ msg: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const body = await req.json();
    const { status } = body || {};

    const allowed = ["ACCEPTED", "IN_PROGRESS", "READY", "SERVED", "CANCELLED"]; 
    if (!allowed.includes(status)) {
      return NextResponse.json({ msg: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    return NextResponse.json({ order: updated }, { status: 200 });
  } catch (error) {
    console.error("Update order status error", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}


