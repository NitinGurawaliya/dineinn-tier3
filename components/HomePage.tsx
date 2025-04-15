"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, MessageCircle, InstagramIcon, Star } from "lucide-react"
import { useEffect } from "react"
import axios from "axios"

interface RestaurantHomePageProps {
  id: string
  restaurantName: string
  instagram: string
  location: string
  whatsapp: string
  contactNumber: string
  logo: string
  averageRating: number
  totalRatings: number
}

const HomePage: React.FC<RestaurantHomePageProps> = ({
  restaurantName,
  id,
  instagram,
  location,
  whatsapp,
  contactNumber,
  logo,
  averageRating,
  totalRatings,
}) => {
  useEffect(() => {
    async function name() {
      console.log("hello from home page")
      const res = await axios.get(`/api/restaurant/qrcode/scan-count/${id}`)
      console.log(res.data.msg)
    }
    name()
  }, [id])

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative w-5 h-5">
          <Star className="absolute w-5 h-5 text-yellow-400" />
          <div className="absolute w-2.5 h-5 overflow-hidden">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="w-5 h-5 text-yellow-400" />)
    }

    return stars
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-4 py-8">
      {/* Logo Section */}
      <div className="relative w-52 h-52 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
        <Image
          src={logo || "/placeholder.svg"}
          alt={`${restaurantName} Logo`}
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>

      {/* Rating Badge */}
      <div className="mt-4 flex flex-col items-center">
        <div className="flex items-center gap-1">{renderStars(averageRating)}</div>
        <div className="text-sm font-medium mt-1">
          {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-4xl font-bold mt-8 mb-12 text-center">
        Welcome to
        <br />
        {restaurantName}
      </h1>

      {/* Social Icons */}
      <div className="flex justify-center mt-2 gap-8 mb-12">
        <Link
          href={`https://www.instagram.com/${instagram}/`}
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
        <Link
          href={`https://wa.me/${whatsapp}`}
          className="flex flex-col items-center text-black hover:opacity-75 transition-opacity"
          target="_blank"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="sr-only">{whatsapp}</span>
          <div className="text-sm mt-1">Whatsapp</div>
        </Link>
        <Link
          href={`tel:${contactNumber}`}
          className="flex flex-col items-center text-black hover:opacity-75 transition-opacity"
        >
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

export default HomePage
