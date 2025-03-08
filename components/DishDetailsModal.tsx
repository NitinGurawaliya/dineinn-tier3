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
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleUpvote = () => {
    setHasUpvoted(!hasUpvoted)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-auto">
        <DialogHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Image Section */}
          <div className="relative w-full h-64 overflow-hidden rounded-lg">
            <img src={dish.image || "/placeholder.svg"} alt={dish.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-3 right-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`bg-white p-2 rounded-full shadow-md ${isFavorite ? "text-red-500" : "text-gray-500"}`}
                onClick={handleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
              </motion.button>
            </div>
          </div>

          {/* Dish Info */}
          <div>
            <div className="flex justify-between items-start">
              <DialogTitle className="text-xl font-bold">{dish.name}</DialogTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                ₹{dish.price}
              </Badge>
            </div>

            <DialogDescription className="mt-4 text-sm">{dish.description}</DialogDescription>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`flex items-center gap-1 ${hasUpvoted ? "text-amber-600" : "text-muted-foreground"}`}
                onClick={handleUpvote}
              >
                <ThumbsUp className={`h-5 w-5 ${hasUpvoted ? "fill-amber-500" : ""}`} />
                <span className="text-sm font-medium">Like</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleDecrement} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={handleIncrement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">
            Add to Order • ₹{(dish.price * quantity).toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

