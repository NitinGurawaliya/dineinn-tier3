import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// Create order (guest) or list orders by sessionId (guest)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurantId, tableNo, items, notes, sessionId, customerId } = body || {};

    if (!restaurantId || !tableNo || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ msg: "restaurantId, tableNo and items are required" }, { status: 400 });
    }

    // Fetch dishes to compute totals and validate ownership
    const dishIds: number[] = items.map((i: any) => Number(i.dishId)).filter(Boolean);
    const quantitiesById: Record<number, number> = {};
    for (const it of items) {
      const dId = Number(it.dishId);
      const qty = Number(it.quantity || 0);
      if (!dId || qty <= 0) {
        return NextResponse.json({ msg: "Invalid dishId/quantity" }, { status: 400 });
      }
      quantitiesById[dId] = (quantitiesById[dId] || 0) + qty;
    }

    const dishes = await prisma.dishes.findMany({
      where: { id: { in: dishIds }, restaurantId: Number(restaurantId) },
      select: { id: true, name: true, price: true },
    });

    if (dishes.length !== dishIds.length) {
      return NextResponse.json({ msg: "Some dishes are invalid for this restaurant" }, { status: 400 });
    }

    // Compute totals
    const lineItems = dishes.map((d) => {
      const qty = quantitiesById[d.id] || 0;
      const lineTotal = Number((d.price * qty).toFixed(2));
      return {
        dishId: d.id,
        nameSnapshot: d.name,
        priceSnapshot: d.price,
        quantity: qty,
        lineTotal,
      };
    });

    const subtotal = Number(lineItems.reduce((s, li) => s + li.lineTotal, 0).toFixed(2));
    const tax = Number((subtotal * 0).toFixed(2)); // no tax for now; adjust if needed
    const total = Number((subtotal + tax).toFixed(2));

    // Determine authenticated customer from HTTP-only cookie if present
    let customerIdFromToken: number | null = null;
    const token = req.cookies.get("user_token")?.value;
    if (token && process.env.NEXTAUTH_SECRET) {
      try {
        const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        if (decoded?.id) customerIdFromToken = Number(decoded.id);
      } catch {}
    }

    if (!customerIdFromToken) {
      return NextResponse.json({ msg: "Please register to place an order" }, { status: 401 });
    }

    const order = await prisma.order.create({
      data: {
        restaurantId: Number(restaurantId),
        sessionId: sessionId || req.cookies.get("guest_session_id")?.value || null,
        customerId: customerIdFromToken,
        tableNo: String(tableNo),
        subtotal,
        tax,
        total,
        notes: notes || null,
        items: {
          create: lineItems,
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ orderId: order.id, status: order.status, total: order.total }, { status: 201 });
  } catch (error) {
    console.error("Create order error", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // Prefer authenticated customer orders if user_token present
    let customerIdFromToken: number | null = null;
    const token = req.cookies.get("user_token")?.value;
    if (token && process.env.NEXTAUTH_SECRET) {
      try {
        const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        if (decoded?.id) customerIdFromToken = Number(decoded.id);
      } catch {}
    }

    let where: any = {};
    if (customerIdFromToken) {
      where.customerId = customerIdFromToken;
    } else {
      const sessionId = searchParams.get("sessionId") || req.cookies.get("guest_session_id")?.value;
      if (!sessionId) {
        return NextResponse.json({ orders: [] }, { status: 200 });
      }
      where.sessionId = sessionId;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("List orders error", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}


