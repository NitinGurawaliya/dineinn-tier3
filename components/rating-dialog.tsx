"use client"

import { useState } from "react"
import { Heart, MessageCircle, SmilePlus, Star } from "lucide-react"
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
import { cn } from "@/lib/utils"

export function RatingDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [message, setMessage] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)

  const ratingLabels = ["", "Not great", "Could be better", "Good", "Great", "Amazing!"]

  const handleSubmit = () => {
    console.log({ rating, message })
    setSubmitted(true)
    setTimeout(() => {
      setRating(0)
      setMessage("")
      setSubmitted(false)
      setOpen(false)
    }, 2500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "max-w-[350px] border rounded-xl p-0 overflow-hidden shadow-lg",
          "animate-in slide-in-from-bottom duration-600",
        )}
      >
        {!submitted ? (
          <div className="flex flex-col">
            <div className="bg-teal-500 p-4 text-white">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-lg font-medium text-center">
                  <span className="flex items-center justify-center gap-1.5">
                    <SmilePlus className="h-5 text-md w-5" />
                    How was your meal?
                  </span>
                </DialogTitle>
                <DialogDescription className="text-center text-white/90 text-xs">
                  Your feedback helps us improve
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-4">
              <div className="flex flex-col items-center justify-center py-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform duration-150 hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          (hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="h-5 mt-1 text-center text-sm font-medium">
                  {(hoverRating || rating) > 0 && (
                    <span className="text-teal-600 animate-in fade-in duration-200">
                      {ratingLabels[hoverRating || rating]}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 relative">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px] text-sm resize-none border-teal-100 focus-visible:ring-teal-500 pl-8"
                />
                <MessageCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-teal-400" />
              </div>

              <DialogFooter className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRating(0)
                    setMessage("")
                  }}
                  className="h-8 text-md border-gray-200"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="h-12 text-md bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Submit
                </Button>
              </DialogFooter>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-teal-500 text-white animate-in fade-in duration-300">
            <Heart className="h-12 w-12 mb-3 animate-pulse" />
            <h3 className="text-lg font-medium text-center">Thanks for your feedback!</h3>
            <p className="text-white/90 text-center mt-1 text-sm">Your rating means a lot to us</p>

            <div className="mt-3 flex gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-amber-300 text-amber-300" />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
