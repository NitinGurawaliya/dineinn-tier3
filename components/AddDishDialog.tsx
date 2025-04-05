"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { REQUEST_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  id: number;
  name: string;
}

interface AddDishDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddDishDialog({ isOpen, onClose }: AddDishDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("VEG");

  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getCategory() {
      try {
        const res = await axios.get(`/api/menu/category`, {
          withCredentials: true,
        });
        setCategories(res.data.allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    getCategory();
  }, []);

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!categoryId) {
      alert("Please select a category!");
      return;
    }

    if (!name || !price || !image || !type) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("image", image);
      formData.append("description", description);
      formData.append("type", type);

      const res = await axios.post(`/api/menu/dishes/${categoryId}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Dish added successfully!");
      setName("");
      setPrice("");
      setImage(null);
      setType("VEG");
      setCategoryId("");
      setLoading(false);
    } catch (error) {
      console.error("Error adding dish:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={dialogRef} className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Dish</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="name">Dish Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description">Add Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Dish Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full border p-2 rounded"
              >
                <option value="VEG">Veg</option>
                <option value="NON_VEG">Non-Veg</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              {loading ? "Adding Dish" : "Add Dish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
