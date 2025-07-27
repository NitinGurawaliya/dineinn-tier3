"use client";

import React, { useState } from "react";
import DashboardDishesCard from "./dashboard-dish-card";
import { Trash2Icon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

interface Dish {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  restaurantId: number;
  type: string;
}

interface CategoryWiseMenuProps {
  categories: Category[];
  dishes: Dish[];
  onDeleteDish: (id: number) => void;
}

export default function CategoryWiseMenu({ categories, dishes, onDeleteDish }: CategoryWiseMenuProps) {
  const [openCategories, setOpenCategories] = useState<number[]>(categories.map(c => c.id)); // All open by default

  const toggleCategory = (id: number) => {
    setOpenCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="mt-4 space-y-4">
      {categories.map(category => {
        const categoryDishes = dishes.filter(d => d.categoryId === category.id);
        if (categoryDishes.length === 0) return null;

        const isOpen = openCategories.includes(category.id);

        return (
          <div key={category.id} className="bg-gray-50 rounded-lg shadow-sm border">
            <div
              className="flex justify-between items-center p-3 cursor-pointer bg-gray-100 rounded-t-lg"
              onClick={() => toggleCategory(category.id)}
            >
              <h3 className="font-semibold text-lg">{category.name}</h3>
              {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </div>

            {isOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {categoryDishes.map(dish => (
                  <div key={dish.id} className="relative">
                    <DashboardDishesCard 
                      id={dish.id}
                      name={dish.name}
                      price={dish.price}
                      image={dish.image}
                      description={dish.description}
                      categoryId={dish.categoryId}
                      restaurantId={dish.restaurantId}
                      type={dish.type}
                    />
                    <button
                      onClick={async () => {
                        const confirmDelete = confirm(`Delete ${dish.name}?`);
                        if (confirmDelete) {
                          try {
                            await axios.delete(`/api/menu/dishes/${dish.id}`);
                            onDeleteDish(dish.id);
                          } catch (err) {
                            alert("Failed to delete dish");
                          }
                        }
                      }}
                      className="absolute top-1 right-1 p-2 rounded-full shadow-md bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
