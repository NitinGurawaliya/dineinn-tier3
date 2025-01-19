import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { signinSchema } from "@/zod";
import { sign } from "jsonwebtoken";

export async function POST(res:NextResponse,req:NextRequest){
    const body = await res.json();

    const {success} =  signinSchema.safeParse(body)

    if(!success){
        return NextResponse.json({msg:"Invalid data "},{status:401})
    }

    const findUser = await prisma.user.findUnique({
        where:{
            email:body.email,
            password:body.password
        }
    })

    if(!findUser){
        return NextResponse.json({msg:"You have no account"},{status:409})
    }

    const token = sign({id:findUser.id},process.env.NEXTAUTH_SECRET as string,{expiresIn:'6h'})

    const response = NextResponse.json({token,userId:findUser.id})
    response.cookies.set("token",token,{httpOnly:true,path:'/'})

    return response


}