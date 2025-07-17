import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import FormModal from "@/components/OptFormModal";

interface RegistrationPopupProps {
  restaurantId?: number;
}

export default function RegistrationPopup({ restaurantId }: RegistrationPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check for user_token cookie
    const token = Cookies.get("user_token");
    setShow(!token);
  }, []);

  // When FormModal closes, do not show again
  const handleClose = (open: boolean) => {
    setShow(open);
  };

  if (!show) return null;

  return (
    <FormModal restaurantId={restaurantId} open={show} setOpen={handleClose} />
  );
} 