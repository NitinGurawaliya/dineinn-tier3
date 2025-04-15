"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { ChefHatIcon, Trash2Icon } from "lucide-react";
import { AddDishDialog } from "./AddDishDialog";
import CategoryComponent from "./CategoryBar";
import { AddCategoryDialog } from "./AddCategoryDialog";
import DashboardDishesCard from "./dashboard-dish-card";

interface Category {
  id: number;
  name: string;
  restaurantId: number;
}

interface Dish {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  type: string;
  restaurantId: number;
}

export default function EditMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/menu`, {
          withCredentials: true,
        });
        setCategories(res.data.categories || []);
        setDishes(res.data.dishes || []);
        setFilteredDishes(res.data.dishes || []);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    const filtered = dishes.filter((dish) => dish.categoryId === categoryId);
    setFilteredDishes(filtered);
  };

  const handleCategorySubmit = (category: { name: string }) => {
    console.log("Submitted category:", category);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center my-40">
        <ChefHatIcon size={80} className="animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex border-gray-300 border-b p-2">
        <h2 className="text-3xl font-semibold mb-4">Edit Menu</h2>
        <Button
          onClick={() => setIsCategoryDialogOpen(true)}
          className="px-6 ml-10 text-lg py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700"
        >
          Manage Category
        </Button>
        <Button
          onClick={() => setIsDishModalOpen(true)}
          className="px-6 text-lg py-3 ml-4 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-200 hover:text-black"
        >
          Add Dishes
        </Button>
      </div>

      {/* Category Bar */}
      <CategoryComponent
        categories={categories}
        onCategorySelect={handleCategorySelect}
      />

      {/* Dishes */}
      <div className="grid grid-cols-1 bg-gray-100 p-4 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        {(filteredDishes.length > 0 ? filteredDishes : dishes).map((dish: Dish) => (
          <div key={dish.id} className="relative">
            <DashboardDishesCard {...dish} />
            <button
              onClick={async () => {
                const confirmDelete = confirm(`Are you sure you want to delete ${dish.name} from your menu?`);
                if (confirmDelete) {
                  try {
                    await axios.delete(`/api/menu/dishes/${dish.id}`);
                    alert(`${dish.name} has been deleted successfully.`);
                    setDishes((prev) => prev.filter((d) => d.id !== dish.id));
                    setFilteredDishes((prev) => prev.filter((d) => d.id !== dish.id));
                  } catch (error) {
                    console.error("Error deleting dish:", error);
                    alert("Failed to delete the dish. Please try again.");
                  }
                }
              }}
              className="absolute top-1 bg-red-600 right-1 p-2 rounded-full shadow-md hover:bg-red-700 text-white"
            >
              <Trash2Icon size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <AddDishDialog isOpen={isDishModalOpen} onClose={() => setIsDishModalOpen(false)} />
      <AddCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSubmit={handleCategorySubmit}
      />
    </div>
  );
}
