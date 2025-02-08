import type React from "react"
import { CustomSidebar } from "@/components/custom-sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-white">
          <CustomSidebar />
          <main className="flex-1 md:ml-64">{children}</main>
        </div>
      </body>
    </html>
  )
}

