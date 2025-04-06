import { Circle } from "lucide-react"
import { Triangle } from "lucide-react"

export function VegLabel() {
  return (
    <div className="flex items-center justify-center w-4 h-4 border border-green-600 bg-white">
      <Circle size={2} className="w-2 h-2 fill-green-600 text-green-600" />
    </div>
  )
}



export function NonVegLabel() {
  return (
    <div className="flex items-center justify-center w-6 h-6 border border-red-800 bg-white">
      <Triangle  className=" w-3 h-3 fill-red-800 text-red-800" />
    </div>
  )
}

