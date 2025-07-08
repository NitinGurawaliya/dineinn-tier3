"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Image } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface GalleryUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GalleryUploadDialog({ isOpen, onClose, onSuccess }: GalleryUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedFile) {
      alert("Please select an image");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await axios.post(`/api/restaurant/images`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        alert("Image uploaded successfully!");
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onSuccess?.(); // Call onSuccess callback if provided
        onClose();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={dialogRef} className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Gallery Image</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              Choose Image
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              {previewUrl ? (
                <div className="space-y-2">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Image className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">Click to select an image</p>
                  <p className="text-xs text-gray-500">Supports: JPG, PNG, GIF</p>
                </div>
              )}
            </div>
          </div>
      
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!selectedFile || loading}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </Button>
        </form>
      </div>
    </div>
  );
} 