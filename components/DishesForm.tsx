"use client"

import axios from "axios"
import { useEffect, useState } from "react"

interface Category {
    id: number
    name: string
    restaurantId: number
}

const DishesForm = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
    const [dishData, setDishData] = useState<{ [key: number]: { name: string; price: string } }>({})

    useEffect(() => {
        async function getCategory() {
            try {
                const res = await axios.get<{ allCategories: Category[] }>("http://localhost:3000/api/menu/category", {
                    withCredentials: true
                })
                setCategories(res.data.allCategories)
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }
        getCategory()
    }, [])

    const toggleCategory = (categoryId: number) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
    }

    const handleInputChange = (categoryId: number, field: string, value: string) => {
        setDishData({
            ...dishData,
            [categoryId]: {
                ...dishData[categoryId],
                [field]: value
            }
        })
    }

    const handleSubmit = async (categoryId: number) => {
        const dish = dishData[categoryId]
        if (!dish?.name || !dish?.price) {
            alert("Please enter dish name and price")
            return
        }

        try {
            const res = await axios.post(`http://localhost:3000/api/menu/dishes/${categoryId}`, {
                name: dish.name,
                price: parseFloat(dish.price),
                image: "default-image.jpg" // Placeholder for image
            }, {
                withCredentials: true
            })

            console.log("Dish added:", res.data)
            alert("Dish added successfully!")
            setDishData({ ...dishData, [categoryId]: { name: "", price: "" } })  // Clear inputs after submission
        } catch (error) {
            console.error("Error adding dish:", error)
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="space-y-4">
                {categories.map((category) => (
                    <div key={category.id} className="border p-4 rounded-md shadow-md">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <button 
                                className="text-blue-500 font-semibold"
                                onClick={() => toggleCategory(category.id)}
                            >
                                {expandedCategory === category.id ? "▲" : "▼"}
                            </button>
                        </div>

                        {expandedCategory === category.id && (
                            <div className="mt-4 space-y-2">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Dish Name"
                                    value={dishData[category.id]?.name || ""}
                                    onChange={(e) => handleInputChange(category.id, "name", e.target.value)}
                                    className="p-2 border rounded-md w-full"
                                />

                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={dishData[category.id]?.price || ""}
                                    onChange={(e) => handleInputChange(category.id, "price", e.target.value)}
                                    className="p-2 border rounded-md w-full"
                                />

                                <button 
                                    onClick={() => handleSubmit(category.id)} 
                                    className="bg-green-500 text-white p-2 rounded-md w-full"
                                >
                                    Add Dish
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DishesForm
