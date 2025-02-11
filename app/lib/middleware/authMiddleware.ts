import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function authMiddleware(req: NextRequest) {
  console.log("from middleware")
  const token = req.cookies.get("token")?.value; // Get token from cookies
  if (!token) {
    return { error: NextResponse.json({ msg: "Not authenticated" }, { status: 401 }) };
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
    console.log("Decoded token:", decoded);

    if (!decoded || typeof decoded !== "object") {
      console.error("Decoded token is invalid:", decoded);
      return { error: NextResponse.json({ msg: "Invalid token payload" }, { status: 401 }) };
    }

    const userId = (decoded as JwtPayload).id;
    const restaurantId = (decoded as JwtPayload).id;

    console.log("Decoded userId:", userId);

    // Attach `userId` to the request headers
    req.headers.set("userId", userId.toString());
    req.headers.set("restaurantId",restaurantId.toString())


    return { userId }; // Return userId for consistency
  } catch (error) {
    console.error("Token verification error:", error);
    return { error: NextResponse.json({ msg: "Invalid token" }, { status: 401 }) };
  }
}
