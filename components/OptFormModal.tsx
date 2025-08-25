import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import FormStepOne from "./step-one-form"
import { FaSpinner } from "react-icons/fa" // Import a spinner icon

interface FormModalProps {
  open: boolean
  setOpen: (value: boolean) => void
  restaurantId?: number
  onSuccess?: () => void
}

export default function FormModal({ open, setOpen, restaurantId, onSuccess }: FormModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    acceptPolicy: false,
  })
  const [loading, setLoading] = useState(false) // Added loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptPolicy: checked }))
  }

  const handleNext = () => setStep(2)
  const handleBack = () => setStep(1)
  const handleClose = () => setOpen(false)

  // Handle form submission
  const handleSubmit = async () => {
    if (!restaurantId) {
      console.error("Restaurant ID is required")
      return
    }

    setLoading(true) // Set loading to true when the request starts

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          restaurantId, // Add the restaurantId to the request body
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create customer")
      }

      const customer = await response.json()
      console.log("Customer created:", customer)

      // Reset form and close modal
      setFormData({
        name: "",
        mobile: "",
        email: "",
        dob: "",
        acceptPolicy: false,
      })
      setStep(1)
      setOpen(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false) // Set loading to false once the request completes
    }
  }

  return (
    <div>
        <Sheet
        open={open}
        onOpenChange={(isOpen) => {
          if (isOpen) setOpen(true); // Do nothing on outside click (which tries to set isOpen=false)
        }}>
        <SheetContent side="bottom" className="p-0 rounded-t-xl max-h-[900px] border-t-teal-200">
          <FormStepOne
            formData={formData}
            onChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            onNext={handleNext}
          />
          <Button
            className="w-full mb-4 p-8 rounded-lg bg-teal-500 active:bg-teal-700 hover:bg-teal-600 mt-4"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.mobile || !formData.acceptPolicy || loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Confirm"}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  )
}
