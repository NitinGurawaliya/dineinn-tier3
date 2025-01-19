import { signupSchema } from "@/zod";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

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
      { id: user.id, },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({token,userId:user.id});
    response.cookies.set("token", token, { httpOnly: true, path: "/" });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
