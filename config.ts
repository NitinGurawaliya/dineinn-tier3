export const REQUEST_URL ="https://dineinn-tier2-iota.vercel.app"

//https://dineinn-tier2.vercel.app

//https://dineinn-tier2-iota.vercel.app/
//http://localhost:3000





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





