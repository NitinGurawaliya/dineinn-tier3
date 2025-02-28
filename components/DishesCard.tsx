
// "use client"
// import { motion, useInView } from "framer-motion";
// import { Heart } from "lucide-react";
// import { useRef, useState, useEffect } from "react";

// interface DishCardProps {
//     id: number;
//     name: string;
//     price: number;
//     image: string;
//     categoryId: number;
//     restaurantId: number;
// }

// const DishesCard: React.FC<DishCardProps> = ({ id, name, price, image }) => {
//     const ref = useRef(null);
//     const isInView = useInView(ref, { margin: "-100px" });
//     const [hasAnimated, setHasAnimated] = useState(false);

//     useEffect(() => {
//         if (isInView && !hasAnimated) {
//             setHasAnimated(true);
//         }
//     }, [isInView, hasAnimated]);

//     return (
//         <motion.div
//             ref={ref}
//             key={id}
//             initial={{ opacity: 0, y: 30 }}
//             animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
//             transition={{ duration: 1, ease: "easeOut" }}
//             className="flex bg-white mt-0 rounded-lg h-full overflow-hidden w-full border shadow-md"
//         >
//             <img src={image} className="w-40 h-40 bg-gray-300" alt={name} />

//             {/* Text Section */}
//             <div className="p-2 bg-gray-50 flex-1">
//                 {/* Dish Name & Veg Icon */}
//                 <div className="flex items-start justify-between">
//                     <h2 className="text-lg font-medium">{name}</h2>
//                     <div className="w-3 h-3 border border-green-600 rounded-sm"></div>
//                 </div>

//                 <p className="text-gray-600 text-sm mt-2 mb-8">
//                     A French-style hearty soup made with fresh broccoli served with crunchy almond slivers.
//                 </p>

//                 {/* Price */}
//                 <div className="mt-2 text-red-600 w-16 px-2 rounded-lg text-lg font-semibold">
//                     ₹{price}
//                 </div>
                    
//             </div>
           
//         </motion.div>
//     );
// };

// export default DishesCard;









"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Heart, ThumbsUp } from "lucide-react"
import { CardContent } from "@/components/ui/card"
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
      className="flex bg-white mt-0 rounded-lg h-full overflow-hidden w-full border shadow-md"
    >
      <img src={image} className="w-40 h-40 bg-white" alt={name} />

      {/* Right side - Content */}
      <CardContent className="p-2 bg-white flex-1">
        <div>
          <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-medium tracking-wide mb-1">{name}</h3>
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

          <p className="text-xs text-muted-foreground line-clamp-2">
            Fresh Atlantic salmon grilled to perfection and topped with our signature lemon butter sauce.
          </p>
        </div>

        <div className="mt-4">
          <Separator className="mb-4" />

          <div className="flex justify-between items-center">
          <span className="text-lg mr-4 font-bold text-amber-500">₹{price}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`group flex items-center gap-1 transition-colors ${
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
          </div>
        </div>
      </CardContent>
    </motion.div>
  )
}

export default DishesCard
