

import CategoryComponent from "@/components/CategoryBar";
import DishesCard from "@/components/DishesCard";
import { REQUEST_URL } from "@/config";
import axios from "axios";
import { cookies } from "next/headers";
import { Button } from "./ui/button";
import { ChefHatIcon, Loader2Icon } from "lucide-react";

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
    description:string,
    categoryId: number;
    type:string;
    restaurantId: number;
}

interface MenuData {
    restaurantName: string;
    logo: string;
    categories: Category[];
    dishes: Dish[];
}

export default async function MenuPage() {
    let menuData: MenuData | null = null;

    try {
        const cookieHeader = cookies().toString();

        const res = await axios.get(`${REQUEST_URL}/api/menu`, {
            headers: {
              Cookie: cookieHeader, 
            },
            withCredentials: true,
          });

        const data = res.data;
        menuData = data; 

        console.log(menuData?.restaurantName); // "solan dhaba"
        console.log(menuData?.dishes); // Array of dish objects

    } catch (error) {
        console.error("Error fetching menu data:", error);
    }


    if(!menuData){
        return (
            <div className="flex  justify-center items-center my-40">
            <ChefHatIcon size={80} className="animate-spin flex text-gray-900" />
          </div>
        )
    }


    
    return (
        <div>
           
{/* 
             {menuData?.categories && <CategoryComponent  categories={menuData.categories} />} */}

            {/* Dishes List */}
            <div className="grid grid-cols-1 bg-gray-100 p-4 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                {menuData?.dishes.map((dish) => (
                    <DishesCard
                    key={dish.id}
                    id={dish.id}
                    name={dish.name}
                    description={dish.description}
                    price={dish.price}
                    image={dish.image}
                    type={dish.type}
                    categoryId={dish.categoryId}
                    restaurantId={dish.restaurantId}
                />
                
                ))}
            </div>
        </div>
    );
}
