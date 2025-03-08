"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { CardContent } from "@/components/ui/card"
import DishDetailsModal from "./DishDetailsModal"

interface DishCardProps {
  id: number
  name: string
  price: number
  image: string
  description: string
  categoryId: number
  restaurantId: number
}

const DishesCard: React.FC<DishCardProps> = ({ id, name, price, image, description, categoryId, restaurantId }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px" })
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const handleCardClick = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  return (
    <>
      <motion.div
        ref={ref}
        key={id}
        initial={{ opacity: 0, y: 30 }}
        animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex bg-white mt-0 rounded-lg h-full p-1 overflow-hidden w-full cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Right side - Content */}
        <CardContent className="bg-white flex-1">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium tracking-wide mb-1">{name}</h3>
            </div>

            <p className="text-sm pt-2 mb-6 text-gray-500 text-muted-foreground line-clamp-2">{description}</p>

            <span className="text-lg font-normal text-black">₹{price}</span>
          </div>
        </CardContent>
        <div className="relative">
          <img src={image || "/placeholder.svg"} className="w-40 h-40 object-cover ml-3 rounded-xl bg-white" alt={name} />
        </div>
      </motion.div>

      <DishDetailsModal
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        dish={{ id, name, price, image, description, categoryId, restaurantId }}
      />
    </>
  )
}

export default DishesCard

