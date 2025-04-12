"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram, MapPin, Phone, MessageCircle, InstagramIcon } from "lucide-react"
import { REQUEST_URL } from "@/config"
import { useEffect } from "react"
import axios from "axios"

interface RestaurantHomePageProps {
    id: string,
    restaurantName: string,
    instagram: string,
    location: string,
    whatsapp: string,
    contactNumber: string,
    logo: string
}
//bg-[#ceccc9]
const   HomePage: React.FC<RestaurantHomePageProps> = ({ restaurantName, id, instagram, location, whatsapp, contactNumber, logo }) => {

    useEffect(()=>{
        async function name() {
            console.log("hello from home page")
        const res  = await axios.get(`/api/restaurant/qrcode/scan-count/${id}`)
        console.log(res.data.msg)
        }
        name()
    },[id]) 
    return (
        <main className="flex min-h-screen flex-col items-center bg-white  px-4 py-8">
            {/* Logo Section */}
            <div className="relative  w-52 h-52 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
                <Image 
                    src={logo} 
                    alt={`${restaurantName} Logo`} 
                    layout="fill" 
                    objectFit="contain" 
                    priority 
                />
            </div>

            {/* Welcome Text */}
            <h1 className="text-4xl font-bold mt-14 mb-12 text-center">
                Welcome to
                <br />
                {restaurantName}
            </h1>

            {/* Social Icons */}
            <div className="flex justify-center mt-2 gap-8 mb-12">
                <Link
                href={instagram}
                className="flex flex-col items-center text-black hover:opacity-75 transition-opacity"
                target="_blank"
                >
                <InstagramIcon className="w-7 h-7" />
                <span className="sr-only">{instagram}</span>
                <div className="text-sm mt-1">Our Socials</div>
                </Link>
                <Link href="#" className="flex flex-col items-center text-black hover:opacity-75 transition-opacity">
                    <MapPin className="w-7 h-7" />
                    <span className="sr-only">{location}</span>
                    <div className="text-sm mt-1">Directions</div>
                </Link>
                <Link href={`https://wa.me/${whatsapp}`} className="flex flex-col items-center text-black hover:opacity-75 transition-opacity" target="_blank">
                    <MessageCircle className="w-7 h-7" />
                    <span className="sr-only">{whatsapp}</span>
                    <div className="text-sm mt-1">Whatsapp</div>

                </Link>
                <Link href={`tel:${contactNumber}`} className= "flex flex-col items-center text-black hover:opacity-75 transition-opacity">
                    <Phone className="w-7 h-7" />
                    <span className="sr-only">{contactNumber}</span>
                    <div className="text-sm mt-1">Call us </div>
                </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col mt-4 gap-6 w-full max-w-md">
                <Link
                    href={`https://dineinn.shop/restaurant/menu/${id}`}
                    className="border-2 border-black px-8 py-4 text-center hover:bg-black hover:text-white transition-colors"
                >
                    VIEW DINE INN MENU
                </Link>
                <Link
                    href="#"
                    className="border-2 border-black px-8 py-4 text-center hover:bg-black hover:text-white transition-colors"
                >
                    RATE OUR RESTAURANT
                </Link>
            </div>
        </main>
    )
}

export default HomePage;
