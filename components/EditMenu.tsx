// EditMenu.tsx
"use client";
import React, { useState } from "react";

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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Menu</h2>
      {menuItems.map((item) => (
        <div key={item.id} className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={item.name}
            onChange={(e) => handleEdit(item.id, "name", e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            value={item.price}
            onChange={(e) => handleEdit(item.id, "price", parseInt(e.target.value))}
            className="border p-2 rounded w-1/4"
          />
        </div>
      ))}
    </div>
  );
}
