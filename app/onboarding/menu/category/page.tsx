import CategoryForm from "@/components/CategoryForm";

// Force dynamic rendering since this page may use client-side features
export const dynamic = 'force-dynamic';

export default function CategoryPage(){
    return <div>
        <CategoryForm/> 
    </div>
}