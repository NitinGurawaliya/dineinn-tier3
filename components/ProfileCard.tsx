"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Edit2, Facebook, Instagram, MapPin, Phone, QrCode, Save, Upload, User } from "lucide-react"
import { REQUEST_URL } from "@/config"

interface RestaurantDetail {
  id: number
  restaurantName: string
  contactNumber: string
  location: string
  weekendWorking: string
  weekdaysWorking: string
  logo: string
  instagram: string
  facebook: string
  qrScans: number
}
interface UserData {
  name: string
  email: string
  password: string
}

export default function UserRestaurantCard() {
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null)
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/restaurant/details`, {
          credentials: "include",
        })
        const data = await res.json()
        setRestaurant(data.restaurantDetail)
        setUser(data.user)
      } catch (err) {
        console.error("Failed to fetch data", err)
      }
    }

    fetchData()
  }, [])

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/restaurant/details`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...restaurant,
          user: { ...user },
        }),
      })

      if (!res.ok) throw new Error("Failed to update")
      const result = await res.json()
      console.log("Update successful", result)
    } catch (err) {
      console.error("Error saving changes", err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mt-0">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="h-40 bg-gradient-to-r from-primary/20 to-primary/10 relative">
            <Button size="sm" variant="secondary" className="absolute right-4 bottom-4 gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Change Cover
            </Button>
          </div>

          <div className="px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row -mt-12 sm:-mt-16 mb-6">
              <div className="relative group z-10">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-md">
                  <AvatarImage src={restaurant?.logo} alt="Logo" />
                  <AvatarFallback className="text-2xl bg-primary/10">HP</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="relative w-full max-w-xs">
                    <Input
                      value={restaurant?.restaurantName || ""}
                      onChange={(e) => setRestaurant(prev => prev ? { ...prev, restaurantName: e.target.value } : null)}
                      className="text-xl font-bold h-auto py-2 px-3 pr-9 border-dashed focus-visible:ring-primary"
                    />
                    <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Badge variant="secondary" className="flex gap-1 items-center text-xs">
                      <QrCode className="h-3 w-3" />
                      {restaurant?.qrScans} Scans
                    </Badge>
                  </div>
                </div>
                <div className="relative w-full max-w-md">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 min-w-4 mr-1.5 text-muted-foreground" />
                    <Input
                      value={restaurant?.location || ""}
                      onChange={(e) => setRestaurant(prev => prev ? { ...prev, location: e.target.value } : null)}
                      className="text-sm h-8 py-1 px-2 border-dashed focus-visible:ring-primary"
                    />
                    <Edit2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <CardContent className="px-0 pt-6 pb-0">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      User Information
                    </h3>
                  </div>
                  <div className="space-y-4 pl-1">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                      <Input
                        value={user?.name || ""}
                        onChange={(e) => setUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="border-dashed h-9 focus-visible:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                      <Input
                        value={user?.email || ""}
                        onChange={(e) => setUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                        className="border-dashed h-9 focus-visible:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Password</label>
                      <Input
                        value={user?.password || ""}
                        onChange={(e) => setUser(prev => prev ? { ...prev, password: e.target.value } : null)}
                        className="border-dashed h-9 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Contact Information
                    </h3>
                  </div>
                  <div className="space-y-4 pl-1">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                      <Input
                        value={restaurant?.contactNumber || ""}
                        onChange={(e) => setRestaurant(prev => prev ? { ...prev, contactNumber: e.target.value } : null)}
                        className="border-dashed h-9 focus-visible:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Instagram</label>
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 text-muted-foreground absolute left-3" />
                        <Input
                          value={restaurant?.instagram || ""}
                          onChange={(e) => setRestaurant(prev => prev ? { ...prev, instagram: e.target.value } : null)}
                          className="border-dashed h-9 pl-9 focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Facebook</label>
                      <div className="flex items-center">
                        <Facebook className="h-4 w-4 text-muted-foreground absolute left-3" />
                        <Input
                          value={restaurant?.facebook || ""}
                          onChange={(e) => setRestaurant(prev => prev ? { ...prev, facebook: e.target.value } : null)}
                          className="border-dashed h-9 pl-9 focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Working Hours
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pl-1">
                  <div className="relative p-4 rounded-md border border-dashed bg-muted/20">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="w-full">
                        <p className="text-sm font-medium mb-2">Weekdays</p>
                        <Input
                          value={restaurant?.weekdaysWorking || ""}
                          onChange={(e) => setRestaurant(prev => prev ? { ...prev, weekdaysWorking: e.target.value } : null)}
                          className="text-sm border-dashed h-8 focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative p-4 rounded-md border border-dashed bg-muted/20">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="w-full">
                        <p className="text-sm font-medium mb-2">Weekends</p>
                        <Input
                          value={restaurant?.weekendWorking || ""}
                          onChange={(e) => setRestaurant(prev => prev ? { ...prev, weekendWorking: e.target.value } : null)}
                          className="text-sm border-dashed h-8 focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-10 mb-6">
                <Button variant="outline">Cancel</Button>
                <Button className="gap-1.5 px-4" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  )
}
