"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import DishesCard from "./DishesCard";
import axios from "axios";
import { REQUEST_URL } from "@/config";
import { Edit2 } from "lucide-react";
import { AddDishDialog } from "./AddDishDialog";
import CategoryComponent from "./CategoryBar";
import { AddCategoryDialog } from "./AddCategoryDialog";

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

export default function EditMenu() {
  const [category, setCategory] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(`${REQUEST_URL}/api/menu`, {
          withCredentials: true,
        });
        setCategory(res.data.categories || []);
        setDishes(res.data.dishes || []);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    }
    getData();
  }, []);

  const handleAddDish = () => {
    setIsDishModalOpen(true);
  };

  

  const handleCategorySubmit = (category: { name: string }) => {
    // Handle the submitted category data here
    console.log("Submitted category:", category)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex border-gray-300 border-b p-2">
        <h2 className="text-3xl font-semibold mb-4">Edit Menu</h2>
        <Button onClick={() => setIsCategoryDialogOpen(true)} className="px-6 ml-10 text-lg py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
          Manage Category
        </Button>

        <Button
          onClick={()=>{setIsDishModalOpen(true)}}
          className="px-6 text-lg py-3 ml-4 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-200 hover:text-black"
        >
          Add Dishes
        </Button>
      </div>

       {/* {category && <CategoryComponent  categories={category} />} */}

      <div className="grid grid-cols-2 p-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {dishes.map((dish: Dish) => (
          <div key={dish.id} className="relative">
            <DishesCard {...dish} />

            <button className="absolute top-1 bg-red-600 right-1 p-2 rounded-full shadow-md hover:bg-red-700 text-white">
              <Edit2 size={18} />
            </button>
          </div>
        ))}
      </div>

     
      <AddDishDialog isOpen={isDishModalOpen} onClose={()=>{setIsDishModalOpen(false)}} />

      <AddCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSubmit={handleCategorySubmit}
      />
    </div>
  );
}
