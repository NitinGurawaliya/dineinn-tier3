"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"

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
  const [isSticky, setIsSticky] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const stickyThreshold = useRef<number>(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (categoryRef.current) {
        if (stickyThreshold.current === 0) {
          stickyThreshold.current = categoryRef.current.offsetTop
        }
        setIsSticky(window.scrollY > stickyThreshold.current)
      }
    }

    window.addEventListener("scroll", handleScroll)

    if (categoryRef.current) {
      stickyThreshold.current = categoryRef.current.offsetTop
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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
    <div className={`bg-white w-full z-10 transition-all duration-200 ${isSticky ? "fixed top-0 left-0 shadow-md" : ""}`} ref={categoryRef}>
      <div className="relative flex items-center bg-white border-b-2 border-gray-200 px-4 py-2 shadow-sm">
        
        <div ref={scrollContainerRef} className="flex overflow-x-auto hide-scrollbar space-x-4 mx-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="flex-shrink-0 text-lg font-serif font-light bg-white text-gray-600 py-2 px-4 rounded-3xl focus:text-violet-800"
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </div>
        
      </div>
      {isSticky && <div style={{ height: "56px" }}></div>}
    </div>
  )
}

export default CategoryComponent