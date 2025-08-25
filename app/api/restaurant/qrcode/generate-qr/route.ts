import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import QRCode from "qrcode";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if ((authResult as any).error) {
    return NextResponse.json({ msg: "Not authenticated" }, { status: 401 });
  }

  const restaurantId = req.cookies.get("userId")?.value;
  if (!restaurantId) {
    return NextResponse.json({ msg: "Restaurant ID is required" }, { status: 400 });
  }

  const restaurantDetail = await prisma.restaurantDetail.findUnique({
    where: { id: parseInt(restaurantId) },
  });
  if (!restaurantDetail) {
    return NextResponse.json({ msg: "Restaurant not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");
  const tablesParam = searchParams.get("tables"); // comma separated
  const range = searchParams.get("range"); // e.g., 1-20

  const sub = restaurantDetail.subdomain;
  const forcedLocal = searchParams.get("local") === "1";
  const hdrHost = req.headers.get("host") || "localhost:3000";
  const proto = (req.headers.get("x-forwarded-proto") || (hdrHost.includes(":") ? "http" : "https"));

  // Build base URL for QR depending on environment/flag
  let baseUrl: string;
  const isLocalHost = /localhost|127\.0\.0\.1|lvh\.me|nip\.io/i.test(hdrHost);
  if (forcedLocal || isLocalHost) {
    // Local testing: keep host as-is and use path-based subdomain
    baseUrl = `${proto}://${hdrHost}/menu/${sub}`;
  } else {
    // Production: use subdomain style
    baseUrl = `https://${sub}.dineinn.shop/menu/${sub}`;
  }

  const parseTables = (): string[] => {
    if (table) return [String(table)];
    if (tablesParam) {
      return tablesParam
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
    if (range) {
      const m = range.match(/^(\d+)-(\d+)$/);
      if (m) {
        const start = parseInt(m[1], 10);
        const end = parseInt(m[2], 10);
        if (start > 0 && end >= start && end - start < 1000) {
          const list: string[] = [];
          for (let i = start; i <= end; i++) list.push(String(i));
          return list;
        }
      }
    }
    return [];
  };

  try {
    const tableList = parseTables();
    if (tableList.length === 0) {
      // fallback: generic QR to menu without table number
      const qrCodeUrl = await QRCode.toDataURL(baseUrl);
      return NextResponse.json({ qrCodeUrl, restaurantDetail, baseUrl }, { status: 200 });
    }

    const qrCodes: { tableNo: string; url: string; qrCodeUrl: string }[] = [];
    for (const t of tableList) {
      const url = `${baseUrl}?t=${encodeURIComponent(t)}`;
      const qrCodeUrl = await QRCode.toDataURL(url);
      qrCodes.push({ tableNo: t, url, qrCodeUrl });
    }
    return NextResponse.json({ restaurantDetail, baseUrl, qrCodes }, { status: 200 });
  } catch (err) {
    console.error("QR generation error", err);
    return NextResponse.json({ msg: "Failed to generate QR code(s)" }, { status: 500 });
  }
}
