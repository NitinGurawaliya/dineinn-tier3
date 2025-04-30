import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import FormStepOne from "./step-one-form"
// import FormStepTwo from "./form-step-two"

interface FormModalProps {
  open: boolean
  setOpen: (value: boolean) => void
}

export default function FormModal({ open, setOpen }: FormModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    acceptPolicy: false,
  })

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
  const handleVerify = () => {
    setStep(1)
    setOpen(false)
    setFormData({ name: "", mobile: "", email: "", dob: "", acceptPolicy: false })
  }

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        
        <SheetContent side="bottom" className="p-0 rounded-t-xl max-h-[900px] border-t-teal-200">
        <FormStepOne
          formData={formData}
          onChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
          onClose={handleClose}
          onNext={handleNext}
        />
        </SheetContent>
      </Sheet>
    </div>
  )
}


{/* <FormStepTwo mobile={formData.mobile} onBack={handleBack} onClose={handleClose} onVerify={handleVerify} /> */}