import { useEffect, useRef, useState } from "react"

interface TabsComponentProps {
  tabs: string[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function TabsComponent({ tabs, activeTab, setActiveTab }: TabsComponentProps) {
  return (
    <>
      <div className="w-full border-b-2 z-20 transition-all duration-300">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto whitespace-nowrap scrollbar-thin hide:scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-lg sm:text-base font-medium transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-white text-teal-500 "
                    : "bg-white text-gray-600 hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
