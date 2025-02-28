"use client"

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Heart, ThumbsUp, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DishCardProps {
    id: number;
    name: string;
    price: number;
    image: string;
    categoryId: number; // Add this line
    restaurantId: number;
}

const DishCard: React.FC<DishCardProps> = ({ id, name, price, image }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-100px" });
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [upvotes, setUpvotes] = useState(42);
    const [hasUpvoted, setHasUpvoted] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [isInView, hasAnimated]);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleUpvote = () => {
        if (hasUpvoted) {
            setUpvotes(upvotes - 1);
        } else {
            setUpvotes(upvotes + 1);
        }
        setHasUpvoted(!hasUpvoted);
    };

    return (
        <motion.div
            ref={ref}
            key={id}
            initial={{ opacity: 0, y: 30 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex bg-white mt-0 rounded-lg h-full overflow-hidden w-full border shadow-md p-4"
        >
            <img src={image} className="w-40 h-40 bg-gray-300" alt={name} />

            <CardContent className="flex-1 px-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-medium mb-1">{name}</h2>
                    <p className="text-gray-600 text-sm mb-3">
                        Random delicious words with mouthwatering flavors and exotic spices.
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-xl  font-semibold text-red-600">₹{price}</div>
                    <div className="flex gap-2">
                        <button
                            className={`group flex items-center gap-1 transition-colors p-1 border rounded-md ${hasUpvoted ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-600"}`}
                            onClick={handleUpvote}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-xs font-medium tabular-nums">{upvotes}</span>
                        </button>
                        
                        {/* <button
                            className="group flex items-center gap-1 transition-colors p-1 border rounded-md bg-blue-500 text-white"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-xs font-medium">Add Review</span>
                        </button> */}
                    </div>
                </div>
            </CardContent>

            <button
                className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isFavorite ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"}`}
                onClick={handleFavorite}
            >
                <Heart className="h-5 w-5" />
            </button>
        </motion.div>
    );
};

export default DishCard;