"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { REQUEST_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// interface Category {
//   id: number;
//   name: string;
// } 

interface AddDishDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAnnouncementDialog({ isOpen, onClose }: AddDishDialogProps) {
  const [title, setTitle] = useState("");
  const[content,setContent] = useState("")

  const [loading,setLoading] = useState(false)
  
  const dialogRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
  

    if (!title || !content) {
      alert("Please fill in all fields");
      return;
    }

    try { 
      const res = await axios.post(`/api/restaurant/announcements`, {
        title,
        content,
      }, {
        withCredentials: true,
       
      });

      alert("Dish added successfully!");
      setTitle("");
      setContent("");
      
      setLoading(false)
    } catch (error) {
      console.error("Error adding dish:", error);
    }

  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={dialogRef} className="bg-gray-100 rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add a Public Announcement</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
          <div className="space-y-4">
            
            <div>
              <Label htmlFor="name">Title</Label>
              <Input  id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Add a Message</Label>
              <Input  id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
      
            <Button onClick={handleSubmit} type="submit" className="w-full">
                {loading ?"Adding..": "Post announcement"}
            </Button>
          </div>
        </div>
      </div>
  );
}
