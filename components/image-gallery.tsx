"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface GalleryImages {
  id: number
  restaurantId: number
  imageUrl: string
}

interface RestaurantGalleryProps {
  images: GalleryImages[]
}

export default function RestaurantGallery({ images }: RestaurantGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openModal = (index: number) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      goToNextImage()
    } else if (e.key === "ArrowLeft") {
      goToPrevImage()
    } else if (e.key === "Escape") {
      closeModal()
    }
  }

  const currentImage = images[currentImageIndex]

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 gap-2 space-y-2">
    {images.map((image, index) => (
      <div
        key={image.id}
        className="break-inside-avoid mb-2 cursor-pointer overflow-hidden rounded-lg"
        onClick={() => openModal(index)}
      >
        <Image
          src={image.imageUrl || "/placeholder.svg"}
          alt={`Image ${index + 1}`}
          width={600}
          height={400}
          className="w-full h-auto object-cover rounded-md"
        />
      </div>
    ))}

     {/* Modal */}
     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-4xl p-0 bg-background/95 backdrop-blur-sm"
          onKeyDown={handleKeyDown}
          onInteractOutside={closeModal}
        >
          <div className="relative h-[80vh] w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50 bg-background/50 hover:bg-background/80 rounded-full"
              onClick={closeModal}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Full Image View */}
            <div className="relative h-full w-full">
              {currentImage && (
                <Image
                  src={currentImage.imageUrl || "/placeholder.svg"}
                  alt={`Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-background/50 hover:bg-background/80 rounded-full"
              onClick={goToPrevImage}
            >
              <ChevronLeft className="h-10 w-10" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-background/50 hover:bg-background/80 rounded-full"
              onClick={goToNextImage}
            >
              <ChevronRight className="h-10 w-10" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/70 px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  </div>


  
  )
}
