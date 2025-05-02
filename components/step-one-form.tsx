"use client"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type React from "react"
import { FaWhatsapp } from "react-icons/fa"
import { useEffect, useRef } from "react"

interface Props {
  formData: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCheckboxChange: (checked: boolean) => void

  onNext: () => void
}

export default function FormStepOne({
  formData,
  onChange,
  onCheckboxChange,
  onNext,
}: Props) {

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {


    // Focus the wrapper div instead of any input
    modalRef.current?.focus()
  }, [])

  return (
    <div
    ref={modalRef}
    tabIndex={-1}
    className=" bg-white rounded-3xl  outline-none"
  >
    <div className="p-6 space-y-4 rounded-3xl ">
        <span tabIndex={-1}></span>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">Confirm your WhatsApp number</h3>
      </div>

      <div className="space-y-6 pt-2">
        <Input className="text-teal-600" name="name" placeholder="Customer Name" value={formData.name} onChange={onChange} />
        <div className="relative ">
          <Input
            name="mobile"
            placeholder="WhatsApp Number"
            type="tel"
            value={formData.mobile}
            onChange={onChange}
            className="pl-9 text-teal-600"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">
            <FaWhatsapp />
          </div>
        </div>
        <Input className="text-teal-600" name="email" placeholder="Email (optional)" type="email" value={formData.email} onChange={onChange} />
        <Input className="text-teal-600" name="dob" placeholder="YYYY-MM-DD (optional)" value={formData.dob} onChange={onChange} />

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="terms"
            checked={formData.acceptPolicy}
            onCheckedChange={onCheckboxChange}
          />
          <label htmlFor="terms" className="text-sm font-medium leading-none">
            I accept the privacy policy.
          </label>
        </div>

        <p className="text-xs text-gray-500 pt-1">
          Yes, I would like to receive updates on WhatsApp/SMS/Email.
        </p>
{/* 
        <Button
          className="w-full bg-teal-500 active:bg-teal-700 hover:bg-teal-600 mt-4"
          onClick={() => {
            onNext();   // go to next step (if needed)
            onClose();  // close the modal
          }}
          disabled={!formData.name || !formData.mobile || !formData.acceptPolicy}>
          Confirm
        </Button> */}

      </div>
    </div>
  </div>
  )
}
