"use client"

import { REQUEST_URL } from "@/config"
import axios from "axios"
import { useState } from "react"
import { useToast } from "@/components/ui/toast"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const CategoryForm = () => {
    const [category, setCategory] = useState("")
    const [loading, setLoading] = useState(false)
    const { addToast } = useToast()

    async function categoryHandler() {
        if (!category.trim()) {
            addToast({
                type: "error",
                title: "Category name required",
                message: "Please enter a category name"
            })
            return
        }

        if (category.trim().length < 2) {
            addToast({
                type: "error",
                title: "Category name too short",
                message: "Category name must be at least 2 characters"
            })
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(`/api/menu/category`, {
                category: category.trim()
            }, {
                withCredentials: true
            })

            addToast({
                type: "success",
                title: "Category added successfully",
                message: `"${category.trim()}" has been added to your menu`
            })

            setCategory("") // Reset form
        } catch (error) {
            console.error("Error submitting category:", error)
            addToast({
                type: "error",
                title: "Failed to add category",
                message: "Please try again or check your connection"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            categoryHandler()
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
            
            <div className="flex gap-3">
                <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter category name (e.g., Appetizers, Main Course)"
                    className="flex-1"
                    disabled={loading}
                />
                <Button 
                    onClick={categoryHandler}
                    disabled={loading || !category.trim()}
                    className="min-w-[120px]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </>
                    )}
                </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
                Categories help organize your menu items for better customer experience
            </p>
        </div>
    )
}

export default CategoryForm