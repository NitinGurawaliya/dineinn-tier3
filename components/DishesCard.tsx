  "use client";

  import type React from "react";
  import { useInView } from "framer-motion";
  import { useRef, useState, useEffect } from "react";
  import { CardContent } from "@/components/ui/card";
  import { Star, Share2, ArrowBigUpDashIcon } from "lucide-react";
  import DishDetailsModal from "./DishDetailsModal";
  import { NonVegLabel, VegLabel } from "./Foodlabel";

  interface DishCardProps {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    categoryId: number;
    restaurantId: number;
    rating?: number;
    reviewCount?: number;
    isVeg?: boolean;
    isNew?: boolean;
    type:string
    quantity?: number;
    onAdd?: () => void;
    onIncrement?: () => void;
    onDecrement?: () => void;
  }

  const DishesCard: React.FC<DishCardProps> = ({
    id,
    name,
    price,
    image,
    description,
    categoryId,
    type,
    restaurantId,
    rating = 4.5,
    reviewCount = 24,
    isVeg = true,
    isNew = false,
    quantity = 0,
    onAdd,
    onIncrement,
    onDecrement,
    
  }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-100px" });
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    useEffect(() => {
      if (isInView && !hasAnimated) {
        setHasAnimated(true);
      }
    }, [isInView, hasAnimated]);

    const handleCardClick = () => {
      setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
      setIsPopupOpen(false);
    };

    const handleReadMoreClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    const handleUpvote = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("Upvoted dish:", id);
    };

    const handleShare = (e: React.MouseEvent) => {
      e.stopPropagation();

      const message = `Check out amazing  ${name} at our restaurant! \n\nTry it now!`;
      const encodedMessage = encodeURIComponent(message);

      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");
    };

    return (
      <div className="pt-0">
        <div className="ml-6 mb-2">{type ==="VEG"?<VegLabel />:<NonVegLabel />}</div>
        <div
          className="flex flex-row-reverse bg-white mt-0 rounded-lg h-full w-full cursor-pointer relative overflow-hidden"
          onClick={handleCardClick}
          ref={ref}
        >
          <img
            src={image || "/placeholder.svg"}
            className="w-44 h-44 object-cover rounded-xl bg-white"
            alt={name}
          />

          <CardContent className="bg-white flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-md font-bold tracking-wide">{name}</h3>
              
            </div>

            <div className="text-sm pt-2 mb-4 text-gray-700 text-muted-foreground">
              {isDescriptionExpanded ? description : description.split(" ").slice(0, 8).join(" ")}
              {description.split(" ").length > 8 && !isDescriptionExpanded && (
                <button className="text-primary font-medium ml-1" onClick={handleReadMoreClick}>
                  <div className="font-bold text-gray-800">... read more</div>
                </button>
              )}
              {isDescriptionExpanded && (
                <button className="text-primary font-medium ml-1" onClick={handleReadMoreClick}>
                  <div className="font-bold text-gray-800">... show less</div>
                </button>
              )}
            </div>


            <div className="mt-8 text-center flex items-center justify-between">
            <span className="text-md font-bold text-black">₹{price}</span>

            {quantity <= 0 ? (
              <button
                className="bg-black text-white px-3 py-1 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd && onAdd();
                }}
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  className="border rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecrement && onDecrement();
                  }}
                >
                  -
                </button>
                <span className="min-w-4 text-black">{quantity}</span>
                <button
                  className="border rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIncrement && onIncrement();
                  }}
                >
                  +
                </button>
              </div>
            )}

              {/* <button
                className="flex items-center justify-center border rounded-full p-1.5 hover:bg-gray-50"
                onClick={handleUpvote}
              >
                <ArrowBigUpDashIcon />
              </button> */}
              {/* <button
                className="flex items-center flex-none ml-2 justify-center border rounded-full  hover:bg-gray-50"
                onClick={handleShare}
              >
                <Share2 />
              </button> */}
            </div>
          </CardContent>
        </div>

        <DishDetailsModal
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          dish={{ id, name, price, image, description, categoryId, restaurantId }}
        />
      </div>
    );
  };

  export default DishesCard;