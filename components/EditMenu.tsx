"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import axios from "axios"
import { ChefHatIcon, Trash2Icon, Plus, Filter } from "lucide-react"
import { AddDishDialog } from "./AddDishDialog"
import { AddCategoryDialog } from "./AddCategoryDialog"
import DashboardDishesCard from "./dashboard-dish-card"

interface Category {
  id: number
  name: string
  restaurantId: number
}

interface Dish {
  id: number
  name: string
  price: number
  description: string
  image: string
  categoryId: number
  type: string
  restaurantId: number
}

interface MenuData {
  id: number
  name: string
  dishes: Dish[]
}

interface EditMenuProps {
  menuData?: MenuData[]
}

export default function EditMenu({ menuData = [] }: EditMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [isDishModalOpen, setIsDishModalOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  // Memoized filtered dishes
  const filteredDishes = useMemo(() => {
    if (selectedCategoryId === null) return dishes
    return dishes.filter((dish) => dish.categoryId === selectedCategoryId)
  }, [dishes, selectedCategoryId])

  // Memoized category stats
  const categoryStats = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      dishCount: dishes.filter((dish) => dish.categoryId === category.id).length,
    }))
  }, [categories, dishes])

  // Memoized menu statistics
  const menuStats = useMemo(() => {
    const totalDishes = dishes.length
    const avgPrice = totalDishes > 0 ? Math.round(dishes.reduce((sum, dish) => sum + dish.price, 0) / totalDishes) : 0

    return {
      totalCategories: categories.length,
      totalDishes,
      displayedDishes: filteredDishes.length,
      avgPrice,
    }
  }, [categories.length, dishes, filteredDishes.length])

  useEffect(() => {
    const allCategories = menuData.map((category) => ({
      id: category.id,
      name: category.name,
      restaurantId: 1,
    }))

    const allDishes = menuData.flatMap((category) =>
      category.dishes.map((dish) => ({
        ...dish,
        categoryId: category.id,
      })),
    )

    setCategories(allCategories)
    setDishes(allDishes)
  }, [menuData])

  const handleCategorySelect = useCallback((categoryId: number | null) => {
    setSelectedCategoryId(categoryId)
  }, [])

  const handleDeleteDish = useCallback(async (dish: Dish) => {
    const confirmDelete = confirm(`Are you sure you want to delete ${dish.name} from your menu?`)
    if (!confirmDelete) return

    setIsDeleting(dish.id)
    try {
      await axios.delete(`/api/menu/dishes/${dish.id}`)
      setDishes((prev) => prev.filter((d) => d.id !== dish.id))
      // Show success message (you might want to use a toast instead)
      alert(`${dish.name} has been deleted successfully.`)
    } catch (error) {
      console.error("Error deleting dish:", error)
      alert("Failed to delete the dish. Please try again.")
    } finally {
      setIsDeleting(null)
    }
  }, [])

  const handleDialogClose = useCallback(() => {
    setIsDishModalOpen(false)
    setIsCategoryDialogOpen(false)
    // Trigger resize event for any layout adjustments
    setTimeout(() => window.dispatchEvent(new Event("resize")), 100)
  }, [])

  const handleCategorySubmit = useCallback((category: { name: string }) => {
    console.log("Submitted category:", category)
    // TODO: Implement category creation logic
  }, [])

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Edit Menu</h1>
                <p className="mt-2 text-sm text-gray-600">Manage your restaurant's dishes and categories</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => setIsCategoryDialogOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
                <Button onClick={() => setIsDishModalOpen(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Dish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Statistics */}
        {categories.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Menu Overview</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{menuStats.totalCategories}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{menuStats.totalDishes}</div>
                  <div className="text-sm text-gray-600">Total Dishes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{menuStats.displayedDishes}</div>
                  <div className="text-sm text-gray-600">{selectedCategoryId ? "Filtered" : "Showing"}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₹{menuStats.avgPrice}</div>
                  <div className="text-sm text-gray-600">Avg Price</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter Section */}
        {categories.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  variant={selectedCategoryId === null ? "default" : "outline"}
                  onClick={() => handleCategorySelect(null)}
                  className="flex items-center gap-2"
                >
                  All Dishes
                  <Badge variant="secondary">{menuStats.totalDishes}</Badge>
                </Button>

                {categoryStats.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? "default" : "outline"}
                    onClick={() => handleCategorySelect(category.id)}
                    className="flex items-center gap-2"
                  >
                    {category.name}
                    <Badge variant="secondary">{category.dishCount}</Badge>
                  </Button>
                ))}
              </div>

              {selectedCategory && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <p className="text-sm text-blue-800">
                    Showing <span className="font-semibold">{filteredDishes.length}</span> dishes from{" "}
                    <span className="font-semibold">{selectedCategory.name}</span> category
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dishes Grid Section */}
        <Card>
          <CardContent className="p-6">
            {filteredDishes.length === 0 ? (
              <div className="py-12 text-center">
                <ChefHatIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-600">
                  {selectedCategoryId ? "No dishes in this category" : "No dishes found"}
                </h3>
                <p className="mb-4 text-gray-500">
                  {selectedCategoryId
                    ? "Add some dishes to this category to get started."
                    : "Start by adding your first dish to the menu."}
                </p>
                <Button onClick={() => setIsDishModalOpen(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Dish
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 ">
                {filteredDishes.map((dish) => (
                  <div key={dish.id} className="group relative">
                    <DashboardDishesCard {...dish} />
                    <button
                      onClick={() => handleDeleteDish(dish)}
                      disabled={isDeleting === dish.id}
                      className="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white shadow-md transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 group-hover:scale-110"
                      aria-label={`Delete ${dish.name}`}
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddDishDialog isOpen={isDishModalOpen} onClose={handleDialogClose} />
      <AddCategoryDialog isOpen={isCategoryDialogOpen} onClose={handleDialogClose} onSubmit={handleCategorySubmit} />
    </div>
  )
}
