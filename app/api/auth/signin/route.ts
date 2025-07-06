import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { signinSchema } from "@/zod";
import { sign } from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
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
            return NextResponse.json({ msg: "Invalid email or password" }, { status: 409 });
        }

        // Create token with longer expiration for PWA
        const token = sign({ id: findUser.id }, process.env.NEXTAUTH_SECRET as string, {
            expiresIn: "30d", // 30 days for better PWA experience
        });

        const response = NextResponse.json({ 
            token, 
            userId: findUser.id,
            msg: "Sign in successful"
        });

        // Set cookies with longer expiration
        response.cookies.set("token", token, {
            path: "/",
            maxAge: 30 * 24 * 60 * 60, // 30 days
            httpOnly: true, // Prevents access from frontend JavaScript
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
        });

        response.cookies.set("userId", findUser.id.toString(), {
            path: "/",
            maxAge: 30 * 24 * 60 * 60, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return response;
    } catch (error) {
        console.error("Signin error:", error);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
    }
}
