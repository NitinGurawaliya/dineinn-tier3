import FormModal from "@/components/OptFormModal";

interface RegistrationPopupProps {
  restaurantId?: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function RegistrationPopup({ restaurantId, open, setOpen }: RegistrationPopupProps) {
  if (!open) return null;
  return (
    <FormModal
      restaurantId={restaurantId}
      open={open}
      setOpen={setOpen}
      onSuccess={() => setOpen(false)}
    />
  );
}