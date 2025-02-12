// EditMenu.tsx
"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

export default function EditMenu() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Burger", price: 120 },
    { id: 2, name: "Pizza", price: 250 },
  ]);

  const handleEdit = (id: number, field: string, value: string | number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="p-6  bg-white rounded-lg shadow-md">
      <div className="flex border-gray-300 border-b shadow-md">
        <h2 className="text-3xl font-semibold mb-4">Edit Menu</h2>
        <Button className="px-6  ml-10 text-lg py-3  bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105" >Add Category </Button>

        <Button className="px-6 text-lg py-3 ml-4  bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focusN:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105">Add Dishes </Button>
      </div>
      

    </div>
  );
}
