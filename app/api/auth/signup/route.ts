import { signupSchema } from "@/zod";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Force dynamic rendering since we set cookies
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { success } = signupSchema.safeParse(body);

    if (!success) {
      return NextResponse.json({ msg: "Invalid data sent" }, { status: 400 });
    }

    const findUnique = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (findUnique) {
      return NextResponse.json({ msg: "User already exists" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    const token = sign(
      { id: user.id },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({ 
      msg: "Signup successful",
      userId: user.id,
      token
    });

    response.cookies.set("token", token, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    response.cookies.set("userId", user.id.toString(), { 
      path: "/",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
