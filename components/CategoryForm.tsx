"use client"

import axios from "axios"

import { useState } from "react"

const CategoryForm = ()=>{
    const[category,setCategory] = useState("")

    async function categoryHandler() {
        try {
            const res = await axios.post("http://localhost:3000/api/menu/category", {
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