"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CategoryComponent from "@/components/CategoryBar";
import DishesCard from "@/components/DishesCard";
import axios from "axios";
import HamburgerMenu from "@/components/HambergerMenu";
import { Button } from "@/components/ui/button";
import { PencilIcon, Search } from "lucide-react";
import Link from "next/link";

interface RestaurantDetails {
  restaurantName: string;
  weekdaysWorking: string;
  weekendWorking: string;
  location: string;
  contactNumber: string;
  logo: string;
}

interface Category {
  id: number;
  name: string;
  restaurantId: number;
}

interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
  categoryId: number;
  restaurantId: number;
}

export default function RestaurantMenuPage() {
  const params = useParams();
  const { id } = params;

  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [logo, setLogo] = useState("");
  const [restaurantData, setRestaurantData] = useState<RestaurantDetails | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/menu/${id}`);
        const menuData = res.data;

        setRestaurantData(menuData);
        setLogo(menuData.logo);
        setCategories(menuData.categories);
        setDishes(menuData.dishes);
        setFilteredDishes(menuData.dishes);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    if (id) fetchMenuData(); // Ensure `id` is available before making API call
  }, [id]);

  const handleCategorySelect = (categoryId: number) => {
    const filtered = dishes.filter((dish) => dish.categoryId === categoryId);
    setFilteredDishes(filtered);
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between w-full bg-stone-500 items-center mt-0 p-2 mb-0">
        <HamburgerMenu
          restaurantName={restaurantData?.restaurantName ?? "Loading..."}
          weekdaysWorking={restaurantData?.weekdaysWorking ?? ""}
          weekendWorking={restaurantData?.weekendWorking ?? ""}
          contactNumber={restaurantData?.contactNumber ?? ""}
        />
        
        <Link  href={`https://9e67-2409-40d7-1001-1f8e-79c7-b29b-1406-7a58.ngrok-free.app/restaurant/menu/${id}/feedback`}>
          <Button className="rounded-2xl  flex items-center gap-2 px-4 ">
            <PencilIcon size={18} />
            <span>Feedback</span>
          </Button>
        </Link>
      </div>

      <div className="flex w-full h-14  bg-center rounded-lg items-center px-4">
        <Search className="text-black mr-2 h-12" />
        <input className="w-full text-black h-14  bg-white focus:outline-none px-2" placeholder="Search dishes..." />
      </div>

      <div className="flex w-full h-40 bg-[url('https://res.cloudinary.com/dixjcb4on/image/upload/v1739046120/dishes_image/res%20image.jpg')] bg-cover bg-center  items-center">
      </div>


      <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />

      <div className="grid grid-cols-1 bg-gray-100 p-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredDishes.map((dish) => (
          <DishesCard
            key={dish.id}
            id={dish.id}
            name={dish.name}
            price={dish.price}
            image={dish.image}
            categoryId={dish.categoryId}
            restaurantId={dish.restaurantId}
          />
        ))}
      </div>
    </div>
  );
}
