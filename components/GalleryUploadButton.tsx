"use client"

import { useState } from "react";
import { GalleryUploadDialog } from "@/components/GalleryUploadDialog";

export default function GalleryUploadButton() {
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)

    return <div>
        <button onClick={() => {
            setIsGalleryModalOpen(true)
        }} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105">
            Add Gallery Images
        </button>

        <GalleryUploadDialog isOpen={isGalleryModalOpen} onClose={() => { setIsGalleryModalOpen(false) }} />
    </div>
} 