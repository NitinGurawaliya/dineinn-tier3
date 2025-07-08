"use client";

import { useState, useEffect } from "react";
import { Trash2, Image as ImageIcon, Upload } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import DashboardGallery from "@/components/DashboardGallery";
import { GalleryUploadDialog } from "@/components/GalleryUploadDialog";

interface GalleryImage {
  id: number;
  imageUrl: string;
}

interface GalleryManagerProps {
  galleryData?: GalleryImage[];
}

export default function GalleryManager({ galleryData = [] }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(galleryData);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    setImages(galleryData);
  }, [galleryData]);

  const handleDelete = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeletingId(imageId);
    try {
      await axios.delete(`/api/restaurant/images/${imageId}`, {
        withCredentials: true
      });
      
      // Remove the image from the local state
      setImages(images.filter(img => img.id !== imageId));
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh the images after upload by refetching from the parent
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Images</h2>
          <p className="text-sm text-gray-500 mt-1">{images.length} image{images.length !== 1 ? 's' : ''}</p>
        </div>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Gallery Images</h3>
          <p className="text-gray-500 mb-6">Upload some images to showcase your restaurant.</p>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Your First Image
          </Button>
        </div>
             ) : (
         <DashboardGallery 
           images={images} 
           onDelete={handleDelete}
           deletingId={deletingId}
         />
       )}

      <GalleryUploadDialog 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
} 