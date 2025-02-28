"use client";

import { useRef } from "react";
import type React from "react";

interface Category {
  id: number;
  name: string;
  restaurantId: number;
}

interface CategoryProps {
  categories: Category[];
  onCategorySelect: (categoryId: number) => void;
}

const CategoryComponent: React.FC<CategoryProps> = ({ categories, onCategorySelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white border-b-2 border-gray-200 py-0 px-4 relative shadow-[0_4px_10px_-8px_rgba(0,0,0,0.1)]">
      {/* Hide scrollbar but allow scrolling */}
      <div className="overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-scroll whitespace-nowrap hide-scrollbar mr-8"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="flex-shrink-0 my-2 text-md font-serif font-light bg-white text-gray-600 py-2 px-4 rounded-3xl focus:text-violet-800"
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
