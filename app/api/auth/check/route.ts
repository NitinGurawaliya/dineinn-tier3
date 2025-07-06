import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
    
    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Token is valid
    return NextResponse.json({ 
      authenticated: true, 
      userId: (decoded as any).id 
    }, { status: 200 });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
} 