"use client"

import { useEffect, useRef, useState } from "react"

interface Category {
  id: number
  name: string
  restaurantId: number
}

interface CategoryComponentProps {
  categories: Category[]
  onCategorySelect: (categoryId: number) => void
}

export default function CategoryComponent({ categories, onCategorySelect }: CategoryComponentProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categories.length > 0 ? categories[0].id : null,
  )
  const [isSticky, setIsSticky] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const stickyThreshold = useRef<number>(0)

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id)
      onCategorySelect(categories[0].id)
    }
  }, [categories, selectedCategory, onCategorySelect])

  useEffect(() => {
    const handleScroll = () => {
      if (categoryRef.current) {
        if (stickyThreshold.current === 0) {
          stickyThreshold.current = categoryRef.current.offsetTop
        }

        const shouldBeSticky = window.scrollY > stickyThreshold.current
        setIsSticky(shouldBeSticky)
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

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId)
    onCategorySelect(categoryId)
  }

  return (
    <>
      <div ref={categoryRef} className={`bg-white w-full z-10 ${isSticky ? "fixed top-0 left-0 shadow-md" : ""}`}>
        <div className="flex overflow-x-auto py-4 px-2 scrollbar-hide">
          {categories.map((category) => (
            <div
              key={category.id}
              data-category-id={category.id}
              className={`px-4 py-2 mx-2 rounded-full cursor-pointer whitespace-nowrap ${
                selectedCategory === category.id ? "bg-stone-500 text-white" : "bg-gray-200 text-black"
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
      {isSticky && <div style={{ height: "56px" }}></div>}
    </>
  )
}
