"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Camera, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: number
  imageUrl: string
}

interface DashboardGalleryProps {
  images: GalleryImage[]
  onDelete: (imageId: number) => void
  deletingId: number | null
}

export default function DashboardGallery({ images, onDelete, deletingId }: DashboardGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isButtonColorChanged, setIsButtonColorChanged] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isModalOpen) {
      // Reset to initial color when modal opens
      setIsButtonColorChanged(false)

      // Change color after 1 second
      timer = setTimeout(() => {
        setIsButtonColorChanged(true)
      }, 1000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isModalOpen, currentImageIndex])

  const openModal = (index: number) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
    setIsLoading(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const goToNextImage = () => {
    setIsLoading(true)
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToPrevImage = () => {
    setIsLoading(true)
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX)
    if (touchStart - touchEnd > 100) {
      goToNextImage()
    }
    if (touchStart - touchEnd < -100) {
      goToPrevImage()
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleDelete = (imageId: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      onDelete(imageId)
      if (isModalOpen) {
        closeModal()
      }
    }
  }

  const currentImage = images[currentImageIndex]

  return (
    <div className="space-y-8">
      {/* Image Grid with Delete Buttons */}
      <div className="columns-2 sm:columns-3 md:columns-4 gap-2 space-y-2">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="break-inside-avoid mb-2 cursor-pointer overflow-hidden rounded-lg group relative"
            onClick={() => openModal(index)}
          >
            <div className="relative">
              <Image
                src={image.imageUrl || "/placeholder.svg"}
                alt={`Restaurant image ${index + 1}`}
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-md"></div>
              
              {/* Delete button on top right */}
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(image.id)
                }}
                disabled={deletingId === image.id}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              >
                {deletingId === image.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal with Delete Button */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-5xl p-0 bg-black/95 backdrop-blur-sm border-none"
          onKeyDown={handleKeyDown}
          onInteractOutside={closeModal}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-[85vh] w-full flex flex-col">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-4 top-4 z-50 rounded-full text-white border transition-all duration-1000",
                isButtonColorChanged
                  ? "bg-white/30 hover:bg-white/50 border-white/50"
                  : "bg-black/50 hover:bg-black/80 border-white/20",
              )}
              onClick={closeModal}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Delete button in modal */}
            <Button
              variant="destructive"
              size="icon"
              onClick={() => currentImage && handleDelete(currentImage.id)}
              disabled={currentImage ? deletingId === currentImage.id : false}
              className={cn(
                "absolute left-4 top-4 z-50 rounded-full text-white border transition-all duration-1000",
                isButtonColorChanged
                  ? "bg-red-500/30 hover:bg-red-500/50 border-red-500/50"
                  : "bg-red-600/50 hover:bg-red-600/80 border-red-400/20",
              )}
            >
              {currentImage && deletingId === currentImage.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </Button>

            {/* Main image container */}
            <div className="relative flex-1 w-full">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
                </div>
              )}

              {currentImage && (
                <Image
                  src={currentImage.imageUrl || "/placeholder.svg"}
                  alt={`Image ${currentImageIndex + 1}`}
                  fill
                  className={cn(
                    "object-contain transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  sizes="100vw"
                  onLoad={handleImageLoad}
                  priority
                />
              )}
            </div>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full h-12 w-12 text-white border transition-all duration-1000",
                isButtonColorChanged
                  ? "bg-white/30 hover:bg-white/50 border-white/50"
                  : "bg-black/50 hover:bg-black/80 border-white/20",
              )}
              onClick={goToPrevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full h-12 w-12 text-white border transition-all duration-1000",
                isButtonColorChanged
                  ? "bg-white/30 hover:bg-white/50 border-white/50"
                  : "bg-black/50 hover:bg-black/80 border-white/20",
              )}
              onClick={goToNextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Image counter and thumbnails */}
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-4">
              <div
                className={cn(
                  "px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-1000",
                  isButtonColorChanged ? "bg-white/30" : "bg-black/70",
                )}
              >
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Thumbnails row */}
              <div className="hidden md:flex gap-2 px-4 overflow-x-auto max-w-full">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setIsLoading(true)
                      setCurrentImageIndex(idx)
                    }}
                    className={cn(
                      "h-16 w-16 relative rounded-md overflow-hidden transition-all duration-200",
                      currentImageIndex === idx ? "ring-2 ring-white scale-105" : "opacity-70 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img.imageUrl || "/placeholder.svg"}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 