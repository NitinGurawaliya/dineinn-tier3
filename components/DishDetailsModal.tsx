"use client";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface DishDetailsModalProps {
  dish: Dish | null;
  onClose: () => void;
}

const DishDetailsModal: React.FC<DishDetailsModalProps> = ({ dish, onClose }) => {
  if (!dish) return null; // Don't render if no dish is selected

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
      >
        <button onClick={onClose} className="absolute top-2 right-2">
          <X size={24} />
        </button>
        
        <img src={dish.image} className="w-full h-52 object-cover rounded-lg" alt={dish.name} />

        <h2 className="text-2xl font-bold mt-4">{dish.name}</h2>
        <p className="text-gray-600 my-2">{dish.description}</p>
        <span className="text-xl font-semibold text-black">₹{dish.price}</span>
      </motion.div>
    </div>
  );
};

export default DishDetailsModal;
