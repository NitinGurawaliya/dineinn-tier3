import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import QRCode from "qrcode";
import { authMiddleware } from "@/app/lib/middleware/authMiddleware";



export async function GET(req:NextRequest) {

      const authResult = await authMiddleware(req);
    
        if (authResult.error) {
            return authResult.error; 
        }

    const restaurantId = req.cookies.get("userId")?.value

     if (!restaurantId) {
            return NextResponse.json({ msg: "Menu ID is required" }, { status: 400 });
        }

        const restaurantDetail = await prisma.restaurantDetail.findUnique({
            where:{
                id:parseInt(restaurantId)
            }
        })

        const frontendUrl = `https://dine-inn.vercel.app/menu/${restaurantId}`

        QRCode.toDataURL(frontendUrl,function(err,url){
            if(err) {
                NextResponse.json({msg:"Failed to gen qr code "})
            }
    
            console.log(url);
            NextResponse.json({qrCodeUrl: url,restaurantDetail})
        })    
}