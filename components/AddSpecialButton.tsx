"use client"

import { useState } from "react";
import { AddSpecialDialog } from "./AddSpecialDialog";

export default function AddSpecialButton  (){
    const[isDishModalOpen,setIsDishModalOpen] = useState(false)

    return <div>
        <button onClick={()=>{
            setIsDishModalOpen(true)
        }} className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105">
                Add Today's Special
              </button>

              <AddSpecialDialog isOpen={isDishModalOpen} onClose={()=>{setIsDishModalOpen(false)}} />
    </div>

}