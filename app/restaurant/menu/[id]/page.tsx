"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CategoryComponent from "@/components/CategoryBar";
import DishesCard from "@/components/DishesCard";
import axios from "axios";
import HamburgerMenu from "@/components/HambergerMenu";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

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
    <div>
      <div className="flex justify-between items-center px-4 mb-6">
       
        <HamburgerMenu
          restaurantName={restaurantData?.restaurantName ?? "Loading..."}
          weekdaysWorking={restaurantData?.weekdaysWorking ?? ""}
          weekendWorking={restaurantData?.weekendWorking ?? ""}
          contactNumber={restaurantData?.contactNumber ?? ""}
        />

        <Button className="rounded-2xl mt-5 flex items-center gap-2 px-4 py-2">
          <PencilIcon size={18} />
          <span>Feedback</span>
        </Button>
      </div>

      <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />

      <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
