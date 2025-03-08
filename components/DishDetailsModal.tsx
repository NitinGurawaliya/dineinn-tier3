"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { X, Heart, ThumbsUp, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DishDetailPopupProps {
  isOpen: boolean
  onClose: () => void
  dish: {
    id: number
    name: string
    price: number
    image: string
    description: string
    categoryId?: number
    restaurantId?: number
  }
}

export default function DishDetailPopup({ isOpen, onClose, dish }: DishDetailPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh]  overflow-auto">
        <div className="flex flex-col gap-4">
          {/* Image Section */}
          <div className="relative w-full h-64 overflow-hidden rounded-lg">
  <img 
    src={dish.image || "/placeholder.svg"} 
    alt={dish.name} 
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>


          {/* Dish Info */}
          <div className="">
            <div className="flex justify-between items-start">
              <DialogTitle className="text-xl font-bold">{dish.name}</DialogTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                ₹{dish.price}
              </Badge>
            </div>

            <DialogDescription className="mt-4 text-sm">{dish.description}</DialogDescription>
          </div>          
        </div>
      </DialogContent>
    </Dialog>
  )
}

