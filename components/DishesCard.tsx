




"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import {  Heart, ThumbsUp } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "@/components/ui/separator"

interface DishCardProps {
    id: number;
    name: string;
    price: number;
    image: string;
    categoryId: number;
    restaurantId: number;
}

const DishesCard: React.FC<DishCardProps> = ({ id, name, price, image }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [upvotes, setUpvotes] = useState(42)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  const ref = useRef(null)
  const isInView = useInView(ref, { margin: "-100px" })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const handleFavorite = () => setIsFavorite(!isFavorite)
  const handleUpvote = () => {
    setUpvotes(hasUpvoted ? upvotes - 1 : upvotes + 1)
    setHasUpvoted(!hasUpvoted)
  }

  return (
    <motion.div
      ref={ref}
      key={id}
      initial={{ opacity: 0, y: 30 }}
      animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex bg-white mt-0 rounded-lg h-full p-1 overflow-hidden w-full"
    >
      

      {/* Right side - Content */}
      <CardContent className="p-2 bg-white flex-1">
        <div>
          <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-medium tracking-wide mb-1">{name}</h3>
          </div>

          <span className="text-md  font-normal text-black">₹{price}</span>

          <p className="text-xs pt-2 text-gray-500 text-muted-foreground line-clamp-2">
            Fresh Atlantic salmon grilled to perfection and topped with our signature lemon butter sauce.
          </p>
        </div>

        <div className="mt-8  ">
         

          <div className="flex justify-start items-start">
          
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`group flex items-center mr-6 gap-1 transition-colors ${
                hasUpvoted ? "text-amber-600" : "text-muted-foreground"
              }`}
              onClick={handleUpvote}
            >
              <motion.div whileHover={{ scale: 1.1 }}>
                <ThumbsUp
                  className={`h-5 w-5 mr-2 transition-all ${
                    hasUpvoted ? "fill-amber-500" : "group-hover:text-amber-400"
                  }`}
                />
              </motion.div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`group flex items-center gap-0 transition-colors ${
                isFavorite ? "text-red-500" : "text-muted-foreground"
              }`}
              onClick={handleFavorite}
            >
              <motion.div whileHover={{ scale: 1.1 }}>
                <Heart
                  className={`h-4 w-4 transition-all ${
                    isFavorite ? "fill-red-500" : "group-hover:text-red-400"
                  }`}
                />
              </motion.div>
              <span className="text-sm ml-1 font-medium">{isFavorite ? "Saved" : "Save"}</span>
            </motion.button>
          </div>
        </div>
        
      </CardContent>
      <img src={image} className="w-40 h-40 ml-3 rounded-xl bg-white" alt={name} />
    </motion.div>
  )
}

export default DishesCard
