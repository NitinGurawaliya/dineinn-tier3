"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Clock, MapPin, Phone, Mail, Instagram, Facebook, Twitter, ExternalLink, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface AboutUsProps {
  restaurantName: string
  description?: string
  weekdaysWorking: string
  weekendWorking: string
  contactNumber: string
  email?: string
  location?: string
  mapUrl?: string
  instagram:string
  socialMedia?: {
    facebook?: string
    twitter?: string
  }
  specialAnnouncement?: string
}

const AboutUsComponent: React.FC<AboutUsProps> = ({
  restaurantName,
  description = "Experience the finest culinary delights in town. Our restaurant offers a unique blend of traditional and modern cuisine.",
  weekdaysWorking,
  weekendWorking,
  contactNumber,
  instagram,
  email = "contact@restaurant.com",
  location,
  mapUrl = "https://maps.google.com",
  socialMedia = {
    facebook: "https://facebook.com/restaurant",
    twitter: "https://twitter.com/restaurant",
  },
  specialAnnouncement,
}) => {
  const [currentDay, setCurrentDay] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const now = new Date()
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    setCurrentDay(days[now.getDay()])

    // Format current time
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    setCurrentTime(`${hours}:${minutes}`)

    // Check if restaurant is open
    const day = now.getDay()
    const currentHours = parseWorkingHours(day >= 1 && day <= 5 ? weekdaysWorking : weekendWorking)

    if (currentHours) {
      const currentTimeMinutes = now.getHours() * 60 + now.getMinutes()
      const openTimeMinutes =
        Number.parseInt(currentHours.open.split(":")[0]) * 60 + Number.parseInt(currentHours.open.split(":")[1])
      const closeTimeMinutes =
        Number.parseInt(currentHours.close.split(":")[0]) * 60 + Number.parseInt(currentHours.close.split(":")[1])

      setIsOpen(currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes)
    } else {
      setIsOpen(false)
    }
  }, [weekdaysWorking, weekendWorking])

  // Parse working hours in format like "9:00 AM - 10:00 PM"
  const parseWorkingHours = (hoursString: string) => {
    try {
      const [openTime, closeTime] = hoursString.split("-").map((time) => time.trim())
      return { open: convertTo24Hour(openTime), close: convertTo24Hour(closeTime) }
    } catch (e) {
      return null
    }
  }

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ")
    let [hours, minutes] = time.split(":")

    if (hours === "12") {
      hours = "00"
    }

    if (modifier === "PM") {
      hours = (Number.parseInt(hours, 10) + 12).toString()
    }

    return `${hours}:${minutes}`
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
        
      <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <CardTitle className="text-2xl font-bold text-amber-800">{restaurantName}</CardTitle>
    {instagram && (
      <a
        href={`https://www.instagram.com/${instagram}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-700 hover:text-amber-900"
      >
        <Instagram className="h-5 w-5" />
      </a>
    )}
  </div>
  {isOpen !== null && (
    <Badge
      variant={isOpen ? "default" : "outline"}
      className={isOpen ? "bg-green-500 hover:bg-green-600" : "text-red-500 border-red-500"}
    >
      {isOpen ? "Open Now" : "Closed"}
    </Badge>
  )}
</div>

        <CardDescription className="text-amber-700 mt-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {specialAnnouncement && (
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
            <p className="text-amber-800 text-sm font-medium">{specialAnnouncement}</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-lg">Working Hours</h3>
            <Badge variant="outline" className="ml-auto">
              <Calendar className="h-3 w-3 mr-1" />
              {currentTime}
            </Badge>
          </div>

          <div className="bg-amber-50/50 rounded-lg p-3">
            <ul className="space-y-2 text-sm">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <li
                  key={day}
                  className={`flex justify-between pb-1 ${
                    day === currentDay
                      ? "font-medium text-amber-900 bg-amber-100 p-1 rounded"
                      : "border-b border-amber-100"
                  }`}
                >
                  <span>{day}</span>
                  <span>{weekdaysWorking}</span>
                </li>
              ))}
              {["Saturday", "Sunday"].map((day) => (
                <li
                  key={day}
                  className={`flex justify-between pb-1 ${
                    day === currentDay
                      ? "font-medium text-amber-900 bg-amber-100 p-1 rounded"
                      : "border-b border-amber-100"
                  }`}
                >
                  <span>{day}</span>
                  <span>{weekendWorking}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-lg">Find Us</h3>
          </div>

          <p className="text-sm pl-7">{location}</p>

          <div className="pl-7">
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                View on Map <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-lg">Contact Us</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 pl-7">
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3" />
              <a href={`tel:${contactNumber}`} className="hover:underline">
                {contactNumber}
              </a>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <Mail className="h-3 w-3" />
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </div>
          </div>
        </div>
      </CardContent>

    
    </Card>
  )
}

export default AboutUsComponent
