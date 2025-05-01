import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma" // Adjust the import path to your prisma client

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, mobile, email, dob, restaurantId } = body

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        mobile,
        email,
        DOB: dob ? new Date(dob) : undefined,
        restaurant: {
          connect: {
            id: restaurantId,
          },
        },
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
