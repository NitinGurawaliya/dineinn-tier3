"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import CategoryComponent from "@/components/CategoryBar"
import DishesCard from "@/components/DishesCard"
import axios from "axios"
import HamburgerMenu from "@/components/HambergerMenu"
import { Button } from "@/components/ui/button"
import { ArrowBigDown, ChefHatIcon, PencilIcon, Search } from "lucide-react"
import Link from "next/link"
import { RatingDialog } from "@/components/rating-dialog"

interface RestaurantDetails {
  restaurantName: string
  weekdaysWorking: string
  weekendWorking: string
  location: string
  contactNumber: string
  logo: string
}

interface GalleryImages {
  id: number
  restaurantId: number
  imageUrl: string
}

interface Category {
  id: number
  name: string
  restaurantId: number
}

interface Dish {
  id: number
  name: string
  description: string
  price: number
  image: string
  categoryId: number
  restaurantId: number
  type?:string
}

export default function RestaurantMenuPage() {
  const params = useParams()
  const { id } = params

  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([])
  const [logo, setLogo] = useState("")
  const [restaurantData, setRestaurantData] = useState<RestaurantDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [galleryImages, setGalleryImages] = useState<GalleryImages[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isForward, setIsForward] = useState(true) // Track direction (forward/backward)
  // const [showRatingDialog, setShowRatingDialog] = useState(false);
  const dishesContainerRef = useRef<HTMLDivElement>(null)
  const categoryBarRef = useRef<HTMLDivElement>(null)

  // Inside your component
  const [showScrollText, setShowScrollText] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = dishes.filter((dish) => dish.name.toLowerCase().includes(query))
    setFilteredDishes(filtered)
  }

  useEffect(() => {
    if (galleryImages.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (isForward) {
          // Move forward until last image
          if (prevIndex < galleryImages.length - 1) {
            return prevIndex + 1
          } else {
            setIsForward(false) // Switch to backward mode
            return prevIndex - 1
          }
        } else {
          // Move backward until first image
          if (prevIndex > 0) {
            return prevIndex - 1
          } else {
            setIsForward(true) // Switch to forward mode
            return prevIndex + 1
          }
        }
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [galleryImages, isForward])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollText(false)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/menu/${id}`)
        const menuData = res.data

        setRestaurantData(menuData)
        setLogo(menuData.logo)
        setCategories(menuData.categories)
        setDishes(menuData.dishes)
        setFilteredDishes(menuData.dishes)
        setGalleryImages(menuData.galleryImages)
      } catch (error) {
        console.error("Error fetching menu data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchMenuData() // Ensure `id` is available before making API call
  }, [id])

  
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowRatingDialog(true);
  //   }, 10000); // Open after 5 seconds

  //   return () => clearTimeout(timer); // Cleanup on unmount
  // }, []);

  const handleCategorySelect = (categoryId: number, headerHeight = 0) => {
    // First filter the dishes
    const filtered = dishes.filter((dish) => dish.categoryId === categoryId)
    setFilteredDishes(filtered)

    // Then scroll with a more reliable approach
    setTimeout(() => {
      // Get the dishes container
      const dishesContainer = document.getElementById("dishes-container")
      if (!dishesContainer) return

      // Calculate the total offset
      const categoryBar = document.getElementById("category-bar")
      const isSticky = categoryBar?.classList.contains("fixed")

      // Get the actual header height (including any other fixed elements)
      const totalHeaderHeight = isSticky ? headerHeight || categoryBar?.offsetHeight || 0 : 0

      // Get the top position of the dishes container
      const containerRect = dishesContainer.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const containerTop = containerRect.top + scrollTop

      // Scroll to position with offset - add more padding to prevent hiding first dish
      window.scrollTo({
        top: containerTop - totalHeaderHeight - 80, // Increased padding from 15 to 80
        behavior: "smooth",
      })
    }, 150) // Slightly longer timeout to ensure DOM updates
  }

  return (
    <div className="bg-white">
      <div className="flex justify-between w-full bg-stone-500 items-center mt-0 p-2 mb-0">
        <HamburgerMenu
          restaurantName={restaurantData?.restaurantName ?? "Loading..."}
          weekdaysWorking={restaurantData?.weekdaysWorking ?? ""}
          weekendWorking={restaurantData?.weekendWorking ?? ""}
          contactNumber={restaurantData?.contactNumber ?? ""}
        />

        <Link href={`https://dineinn.shop/restaurant/menu/${id}/feedback`}>
          <Button className="rounded-2xl flex items-center gap-2 px-4 ">
            <PencilIcon size={18} />
            <span>Feedback</span>
          </Button>
        </Link>
      </div>

      <div className="flex w-full h-14 bg-center rounded-lg items-center px-4">
        <Search className="text-black mr-2 h-12" />
        <input
          className="w-full text-black h-14 bg-white focus:outline-none px-2"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="relative w-full h-40 overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {galleryImages.map((image, index) => (
            <img
              key={index}
              src={image.imageUrl || "/placeholder.svg"}
              alt={`Gallery Image ${index}`}
              className="w-full h-40 object-cover flex-shrink-0"
              style={{ minWidth: "100%" }}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-40">
          <ChefHatIcon size={80} className="animate-spin flex text-gray-900" />
        </div>
      ) : (
        <>
          <div ref={categoryBarRef} id="category-bar">
            <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
          </div>
          <div
            id="dishes-container"
            ref={dishesContainerRef}
            className="grid grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            {filteredDishes.map((dish) => (
              <div key={dish.id} className="relative pb-4" data-category-id={dish.categoryId}>
                <DishesCard

                  id={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  image={dish.image}
                  categoryId={dish.categoryId}
                  restaurantId={dish.restaurantId}
                  type={dish.type ||"VEG"}
                />
                {/* Dotted Line */}
                <div className="w-[calc(100%-44px)] mx-auto border-t-2 border-dotted border-gray-300 mt-1"></div>
              </div>
            ))}
          </div>

        </>
      )}
      {showScrollText && (
        <div className="fixed bottom-2 transform -translate-x-1/2 flex items-center ml-40 justify-center font-semibold text-lg text-black opacity-80 animate-bounce">
          <ArrowBigDown />
          Scroll Here
        </div>
      )}
    </div>
  )
}

