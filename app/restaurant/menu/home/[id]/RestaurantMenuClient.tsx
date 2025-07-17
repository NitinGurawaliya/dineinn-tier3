"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import CategoryComponent from "@/components/CategoryBar";
import DishesCard from "@/components/DishesCard";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ChefHatIcon, PencilIcon, Search } from "lucide-react";
import { RatingDialog } from "@/components/rating-dialog";
import { Navbar } from "@/components/Navbar";
import AboutUsComponent from "@/components/about-us";
import TabsComponent from "@/components/menu-navbar";
import RestaurantGallery from "@/components/image-gallery";
import BackToTop from "@/components/back-to-top";
import AnnouncementList from "@/components/updates-section";
import RegistrationPopup from "@/components/RegistrationPopup";

interface RestaurantDetails {
  id: number;
  restaurantName: string;
  weekdaysWorking: string;
  weekendWorking: string;
  location: string;
  contactNumber: string;
  instagram: string;
  logo: string;
  categories: Category[];
  dishes: Dish[];
  galleryImages: GalleryImages[];
  announcements: Announcements[];
}

export type { RestaurantDetails };

interface GalleryImages {
  id: number;
  restaurantId: number;
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
  restaurantId: number;
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  restaurantId: number;
  type?: string;
}

interface Announcements {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface RestaurantMenuClientProps {
  menuData: RestaurantDetails;
  showRegistrationPopup: boolean;
}

export default function RestaurantMenuClient({ menuData, showRegistrationPopup }: RestaurantMenuClientProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [categories, setCategories] = useState<Category[]>(menuData.categories || []);
  const [dishes, setDishes] = useState<Dish[]>(menuData.dishes || []);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>(menuData.dishes || []);
  const [galleryImages, setGalleryImages] = useState<GalleryImages[]>(menuData.galleryImages || []);
  const [announcement, setAnnouncement] = useState<Announcements[]>(menuData.announcements || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showScrollText, setShowScrollText] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dishesContainerRef = useRef<HTMLDivElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function name() {
      if (!menuData.id) return;
      try {
        await axios.get(`/api/restaurant/qrcode/scan-count/${menuData.id}`);
      } catch {}
    }
    name();
  }, [menuData.id]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = dishes.filter((dish) => dish.name.toLowerCase().includes(query));
    setFilteredDishes(filtered);
  };

  useEffect(() => {
    if (galleryImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.min(3, galleryImages.length));
    }, 2000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollText(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRatingDialog(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (categoryId: number, headerHeight = 0) => {
    const filtered = dishes.filter((dish) => dish.categoryId === categoryId);
    setFilteredDishes(filtered);
    setTimeout(() => {
      const dishesContainer = document.getElementById("dishes-container");
      if (!dishesContainer) return;
      const categoryBar = document.getElementById("category-bar");
      const isSticky = categoryBar?.classList.contains("fixed");
      const totalHeaderHeight = isSticky ? headerHeight || categoryBar?.offsetHeight || 0 : 0;
      const containerRect = dishesContainer.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = containerRect.top + scrollTop;
      window.scrollTo({
        top: containerTop - totalHeaderHeight - 80,
        behavior: "smooth",
      });
    }, 150);
  };

  return (
    <div className="bg-white">
      {menuData && (
        <Navbar restaurantName={menuData.restaurantName} logo={menuData.logo} id={""} />
      )}
      {/* Gallery Image Slider */}
      <div className="relative w-full h-52 overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {galleryImages.slice(0, 3).map((image, index) => (
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
        tabs={["Overview", "Menu", "Gallery", "Updates"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Content Rendering */}
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
          {activeTab === "Overview" && (
            <AboutUsComponent
              instagram={menuData?.instagram ?? ""}
              location={menuData?.location ?? ""}
              restaurantName={menuData?.restaurantName ?? "Loading..."}
              weekdaysWorking={menuData?.weekdaysWorking ?? ""}
              weekendWorking={menuData?.weekendWorking ?? ""}
              contactNumber={menuData?.contactNumber ?? ""}
            />
          )}
          {activeTab === "Gallery" && <RestaurantGallery images={galleryImages} />}
          {activeTab === "Updates" && (
            <div className="min-h-screen ">
              <AnnouncementList updates={announcement} />
            </div>
          )}
          {activeTab === "Reviews" && <p>See what others are saying!</p>}
        </div>
      )}
      {/* Scroll Text */}
      {showScrollText && activeTab === "Menu" && (
        <div className="fixed bottom-2 transform -translate-x-1/2 flex items-center ml-40 justify-center font-semibold text-lg text-black opacity-80 animate-bounce">
          <ArrowBigDown />
          Scroll Here
        </div>
      )}
      {/* Registration Popup (only for unregistered users) */}
      {showRegistrationPopup && <RegistrationPopup restaurantId={menuData?.id} />}
      {/* <RatingDialog open={showRatingDialog} setOpen={setShowRatingDialog} restaurantId={menuData.id} /> */}
      <BackToTop />
    </div>
  );
} 