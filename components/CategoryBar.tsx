"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react" // Added import for React

interface Category {
  id: number
  name: string
  restaurantId: number
}

interface CategoryProps {
  categories: Category[]
  onCategorySelect: (categoryId: number) => void
}

const CategoryComponent: React.FC<CategoryProps> = ({ categories, onCategorySelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="bg-slate-400 rounded-xl mt-6 p-4 relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-purple-600 p-2 rounded-full shadow-lg hover:bg-purple-100 transition-colors duration-300 z-10"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="overflow-x-auto hide-scrollbar">
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="flex-shrink-0 text-md ml-8 bg-white text-purple-700 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-purple-50 hover:text-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-purple-600 p-2 rounded-full shadow-lg hover:bg-purple-100 transition-colors duration-300 z-10"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}

export default CategoryComponent

