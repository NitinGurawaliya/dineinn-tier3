"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export function RatingDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [rating, setRating] = useState<number>(0)
  const [message, setMessage] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log({ rating, message })
    setSubmitted(true)

    // Reset form after 2 seconds and close dialog
    setTimeout(() => {
      setRating(0)
      setMessage("")
      setSubmitted(false)
      setOpen(false)
    }, 2000)
  }

  const handleReset = () => {
    setRating(0)
    setMessage("")
    setSubmitted(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Rate this restaurant</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Rate your experience</DialogTitle>
              <DialogDescription>Please share your feedback about our restaurant.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <Star
                      className={`h-8 w-8 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="Share your thoughts (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleSubmit} disabled={rating === 0}>
                Submit
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <h3 className="text-xl font-semibold">Thank you for your feedback!</h3>
            <div className="mt-4 flex">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

