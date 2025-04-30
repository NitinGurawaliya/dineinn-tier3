"use client"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"

interface Props {
  mobile: string
  onBack: () => void
  onClose: () => void // Can be removed if not needed anymore
  onVerify: () => void
}

export default function FormStepTwo({ mobile, onBack, onVerify }: Props) {
  return (
    <div className="p-6 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800">Enter OTP</h3>
          <p className="text-sm text-gray-500">We've sent a 4-digit code to {mobile}</p>
        </div>
      </div>

      <div className="flex justify-center py-6">
        <InputOTP maxLength={4} className="gap-2">
          <InputOTPGroup>
            {[0, 1, 2, 3].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button className="w-full bg-teal-500 hover:bg-teal-600" onClick={onVerify}>
        Verify
      </Button>

      <button className="text-sm text-center w-full text-teal-600 hover:text-teal-700" onClick={onBack}>
        Go back
      </button>
    </div>
  )
}
