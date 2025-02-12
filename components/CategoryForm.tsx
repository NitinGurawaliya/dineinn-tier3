"use client"

import axios from "axios"

import { useState } from "react"

const CategoryForm = ()=>{
    const[category,setCategory] = useState("")

    async function categoryHandler() {
        try {
            const res = await axios.post(`https://dineinn-tier2.vercel.app/api/menu/category`, {
                category: category  
            }, {
                withCredentials: true  
            });
    
            console.log(res.data);
        } catch (error) {
            console.error("Error submitting category:",error);
        }
    }
    

    return (
        
        <div>
            <input onChange={(e)=>{
                setCategory(e.target.value)
            }} />
            <button onClick={categoryHandler}>Submit category</button>
            
        </div>
    )

}

export default CategoryForm;