"use client"

import { useEffect, useRef, useState } from "react"

interface Category {
  id: number
  name: string
  restaurantId: number
}

interface CategoryComponentProps {
  categories: Category[]
  onCategorySelect: (categoryId: number, headerHeight: number) => void
}

export default function CategoryComponent({ categories, onCategorySelect }: CategoryComponentProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categories.length > 0 ? categories[0].id : null,
  )
  const [isSticky, setIsSticky] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)  // New ref
  const stickyThreshold = useRef<number>(0)

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id)
      const headerHeight = categoryRef.current?.offsetHeight || 0
      onCategorySelect(categories[0].id, headerHeight)
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
    const headerHeight = categoryRef.current?.offsetHeight || 0
    onCategorySelect(categoryId, headerHeight)

    // Scroll the clicked category to left
    const element = document.querySelector(`[data-category-id="${categoryId}"]`) as HTMLElement
    const scrollContainer = scrollContainerRef.current

    if (element && scrollContainer) {
      const elementLeft = element.offsetLeft
      scrollContainer.scrollTo({
        left: elementLeft - 16, // Adjusting a little padding
        behavior: "smooth",
      })
    }
  }

  return (
    <>
      <div
        ref={categoryRef}
        className={`bg-white w-full z-10 ${isSticky ? "fixed top-0 py-2 left-0 " : ""}`}
        id="category-bar"
      >
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-4 px-2 space-x-4 scrollbar-hide"
        >
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
      {/* Placeholder div to prevent layout shift when sticky */}
      {isSticky && <div style={{ height: `${categoryRef.current?.offsetHeight || 0}px` }}></div>}
    </>
  )
}