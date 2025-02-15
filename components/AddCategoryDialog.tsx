import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { REQUEST_URL } from '@/config'

interface AddCategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (category: { name: string }) => void
}

export function AddCategoryDialog({ isOpen, onClose, onSubmit }: AddCategoryDialogProps) {
  const[category,setCategory] = useState("")
  const[loading,setLoading] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit =async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const res = await axios.post(`${REQUEST_URL}/api/menu/category`,{
      category:category
    },{
      withCredentials:true
    })
    setCategory('') // Reset the input after submission
    onClose()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div ref={dialogRef} className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Category</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={category}
                className='mt-2'
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {loading?"Adding Category":"Add Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
