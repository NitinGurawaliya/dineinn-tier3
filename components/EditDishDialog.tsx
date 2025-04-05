"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  type: "VEG" | "NON_VEG";
}

interface EditDishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null; // Pass the selected dish to edit
  refreshDishes: () => void; // To refetch data after update
}

export function EditDishDialog({ isOpen, onClose, dish, refreshDishes }: EditDishDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"VEG" | "NON_VEG">("VEG");
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dish) {
      setName(dish.name);
      setDescription(dish.description);
      setPrice(String(dish.price));
      setType(dish.type);
    }
  }, [dish]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !dish) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !type) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/api/menu/dishes/${dish.id}`, {
        name,
        description,
        price,
        type,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Dish updated successfully!");
      refreshDishes();
      onClose();
    } catch (error) {
      console.error("Error updating dish:", error);
      alert("Failed to update dish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={dialogRef} className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Dish</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Dish Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as "VEG" | "NON_VEG")}
                className="w-full border p-2 rounded"
                required
              >
                <option value="VEG">VEG</option>
                <option value="NON_VEG">NON-VEG</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Dish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
