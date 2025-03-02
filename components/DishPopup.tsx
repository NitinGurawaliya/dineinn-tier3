"use client";

import { motion } from "framer-motion";

interface DishPopupProps {
  dish: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  onClose: () => void;
}

const DishPopup: React.FC<DishPopupProps> = ({ dish, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-4 shadow-lg rounded-t-2xl w-full max-w-lg"
      >
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-500 text-lg">
          ✖
        </button>
        <img src={dish.image} className="w-full h-40 object-cover rounded-lg mb-4" alt={dish.name} />
        <h2 className="text-xl font-bold">{dish.name}</h2>
        <p className="text-lg font-semibold text-gray-700">₹{dish.price}</p>
      </motion.div>
    </div>
  );
};

export default DishPopup;
