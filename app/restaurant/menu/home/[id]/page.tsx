"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import CategoryComponent from "@/components/CategoryBar"
import DishesCard from "@/components/DishesCard"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { ArrowBigDown, ChefHatIcon, PencilIcon, Search } from "lucide-react"
import { RatingDialog } from "@/components/rating-dialog"
import {Navbar} from "@/components/Navbar"
import AboutUsComponent from "@/components/about-us"
import TabsComponent from "@/components/menu-navbar"
import RestaurantGallery from "@/components/image-gallery"
import BackToTop from "@/components/back-to-top"
import AnnouncementList from "@/components/updates-section"
import FormModal from "@/components/OptFormModal"

interface RestaurantDetails {
  restaurantName: string
  weekdaysWorking: string
  weekendWorking: string
  location: string
  contactNumber: string
  instagram:string
  logo: string
  id: number
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
  type?: string
}

interface Announcements{
  id:number,
  title:string,
  content:string,
  createdAt:string
}


export default function RestaurantMenuPage() {
  const params = useParams()
  const { id } = params

  const [activeTab, setActiveTab] = useState("Overview")

  const [categories, setCategories] = useState<Category[]>([])

  const [dishes, setDishes] = useState<Dish[]>([])
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([])
  const [restaurantData, setRestaurantData] = useState<RestaurantDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [galleryImages, setGalleryImages] = useState<GalleryImages[]>([])
  const[announcement,setAnnouncement] = useState<Announcements[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isForward, setIsForward] = useState(true)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [showScrollText, setShowScrollText] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const dishesContainerRef = useRef<HTMLDivElement>(null)
  const categoryBarRef = useRef<HTMLDivElement>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function name() {
      console.log("hello from home page")
      const res = await axios.get(`/api/restaurant/qrcode/scan-count/${id}`)
      console.log(res.data.msg)
    }
    name()
  }, [id])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true)
    }, 1000)
  
    return () => clearTimeout(timer)
  }, [])


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = dishes.filter((dish) => dish.name.toLowerCase().includes(query))
    setFilteredDishes(filtered)
  }

  useEffect(() => {
    if (galleryImages.length === 0) return
  
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.min(3, galleryImages.length))
    }, 2000)
  
    return () => clearInterval(interval)
  }, [galleryImages])
  

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollText(false)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/menu/${id}`)
        const menuData = res.data

        setRestaurantData(menuData)
        setCategories(menuData.categories)
        setDishes(menuData.dishes)
        setFilteredDishes(menuData.dishes)
        setGalleryImages(menuData.galleryImages)
        setAnnouncement(menuData.announcements)
      } catch (error) {
        console.error("Error fetching menu data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchMenuData()
  }, [id])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRatingDialog(true)
    }, 12000)

    return () => clearTimeout(timer)
  }, [])

  const handleCategorySelect = (categoryId: number, headerHeight = 0) => {
    const filtered = dishes.filter((dish) => dish.categoryId === categoryId)
    setFilteredDishes(filtered)

    setTimeout(() => {
      const dishesContainer = document.getElementById("dishes-container")
      if (!dishesContainer) return

      const categoryBar = document.getElementById("category-bar")
      const isSticky = categoryBar?.classList.contains("fixed")
      const totalHeaderHeight = isSticky ? headerHeight || categoryBar?.offsetHeight || 0 : 0

      const containerRect = dishesContainer.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const containerTop = containerRect.top + scrollTop

      window.scrollTo({
        top: containerTop - totalHeaderHeight - 80,
        behavior: "smooth",
      })
    }, 150)
  }

  return (
    <div className="bg-white">
        {restaurantData && (
        <Navbar restaurantName={restaurantData.restaurantName} logo={restaurantData.logo} id={""} />)}

        
      {/* Gallery Image Slider */}
      <div className="relative w-full h-52 overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {galleryImages.slice(0,3).map((image, index) => (
            <img
              key={index}
              src={image.imageUrl || "/placeholder.svg"}
              alt={`Gallery Image ${index}`}
              className="w-full h-52 object-cover flex-shrink-0"
              style={{ minWidth: "100%" }}
            />
          ))}
        </div>
      </div>

      {/* Search Bar */}
      {activeTab === "Menu" && (
        <div className="flex w-full h-14 bg-center rounded-lg items-center px-4">
          <Search className="text-black mr-2 h-12" />
          <input
            className="w-full text-black h-14 bg-white focus:outline-none px-2"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      )}


      {/* Tabs */}
      <TabsComponent
        tabs={[ "Overview","Menu","Gallery","Updates", "Reviews",]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Content Rendering */}
      {loading ? (
        <div className="flex justify-center items-center my-40">
          <ChefHatIcon size={80} className="animate-spin flex text-gray-900" />
        </div>
      ) : (
        <>
          {activeTab === "Menu" ? (
            <>
              <div ref={categoryBarRef} id="category-bar">
                <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
              </div>

              <div
                id="dishes-container"
                ref={dishesContainerRef}
                className="grid px-1 grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0"
              >
                {filteredDishes.map((dish) => (
                  <div key={dish.id} className="relative pb-0" data-category-id={dish.categoryId}>
                    <DishesCard {...dish} type={dish.type || "VEG"} />
                    <div className="w-[calc(100%-44px)] mx-auto border-t-2 border-dotted border-gray-300 mt-1"></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-2 text-lg text-gray-800">
              {activeTab === "Overview" && 
              <AboutUsComponent 
                instagram={restaurantData?.instagram ??""}
                location={restaurantData?.location??""}
                restaurantName={restaurantData?.restaurantName ?? "Loading..."}
                weekdaysWorking={restaurantData?.weekdaysWorking ?? ""}
                weekendWorking={restaurantData?.weekendWorking ?? ""}
                contactNumber={restaurantData?.contactNumber ?? ""} />}
                
              {activeTab === "Gallery" && <RestaurantGallery images={galleryImages}/>}
              {activeTab  ==="Updates"&&  <div className="min-h-screen ">
               <AnnouncementList updates={announcement} />
            </div>}
              {activeTab === "Reviews" && <p>See what others are saying!</p>}
            </div>
          )}
        </>
      )}


      {/* Scroll Text */}
      {showScrollText && activeTab === "Menu" && (
        <div className="fixed bottom-2 transform -translate-x-1/2 flex items-center ml-40 justify-center font-semibold text-lg text-black opacity-80 animate-bounce">
          <ArrowBigDown />
          Scroll Here
        </div>
      )}

      <FormModal restaurantId={restaurantData?.id} open={showForm} setOpen={setShowForm} />


      {/* Rating Dialog */}
      {/* {restaurantData && (
        <RatingDialog
          open={showRatingDialog}
          setOpen={setShowRatingDialog}
          restaurantId={restaurantData.id}
        />
      )} */}

      <BackToTop /> 
    </div>
  )
}
