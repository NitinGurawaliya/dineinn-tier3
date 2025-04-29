"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, Calendar } from "lucide-react"

interface Announcement {
  id: number
  title: string
  content: string
  createdAt: string
}

interface UpdatesListProps {
  updates: Announcement[]
}

export default function AnnouncementList({ updates }: UpdatesListProps) {
  // Function to check if announcement is recent (within last 24 hours)
  const isRecent = (dateString: string) => {
    const announcementDate = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - announcementDate.getTime())
    const diffHours = diffTime / (1000 * 60 * 60)
    return diffHours < 24
  }

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()

    // If today, show time only
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    // If yesterday
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    // Otherwise show date and time
    return (
      date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  // Animation variants for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70 } },
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm border border-slate-100">
      <div className="flex items-center mb-5">
        <Bell className="h-5 w-5 text-teal-600 mr-2" />
        <h2 className="text-xl font-medium text-slate-800">Announcements</h2>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {updates.map((update) => (
          <motion.div key={update.id} variants={item}>
            <Card className="overflow-hidden border border-slate-200 hover:border-teal-200 hover:shadow-md transition-all duration-200">
              <div className="h-1 bg-teal-500" />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-semibold text-slate-800">{update.title}</h3>
                  {isRecent(update.createdAt) && (
                    <Badge className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs">New</Badge>
                  )}
                </div>

                <p className="text-slate-600 text-sm mb-3">{update.content}</p>

                <div className="flex items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                  {new Date(update.createdAt).toDateString() === new Date().toDateString() ? (
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                  ) : (
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                  )}
                  {formatDate(update.createdAt)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
