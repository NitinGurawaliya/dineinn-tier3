import DishesForm from "@/components/DishesForm";

// Force dynamic rendering since this page may use client-side features
export const dynamic = 'force-dynamic';

export default function DishesPage(){
    return <div>
        <DishesForm />
    </div>
}