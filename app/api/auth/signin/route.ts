import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { signinSchema } from "@/zod";
import { sign } from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { success } = signinSchema.safeParse(body);

    if (!success) {
        return NextResponse.json({ msg: "Invalid data" }, { status: 401 });
    }

    const findUser = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password,
        },
    });

    if (!findUser) {
        return NextResponse.json({ msg: "You have no account" }, { status: 409 });
    }

    // Set token expiration to 3 days
    const token = sign({ id: findUser.id }, process.env.NEXTAUTH_SECRET as string, {
        expiresIn: "3d", // Token valid for 3 days
    });

    const response = NextResponse.json({ token, userId: findUser.id });

    // Store cookies for 3 days (259200 seconds)
    response.cookies.set("token", token, {
        path: "/",
        maxAge: 3 * 24 * 60 * 60, // 3 days
        httpOnly: true, // Prevents access from frontend JavaScript
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
    });

    response.cookies.set("userId", findUser.id.toString(), {
        path: "/",
        maxAge: 3 * 24 * 60 * 60, // 3 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return response;
}
