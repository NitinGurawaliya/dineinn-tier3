"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

interface RestaurantDetails {
  restaurantName: string;
  weekdaysWorking: string;
  weekendWorking: string;
  contactNumber: string;
}

const HamburgerMenu: React.FC<RestaurantDetails> = ({
  restaurantName,
  weekdaysWorking,
  weekendWorking,
  contactNumber,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mt-4"  ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-8 w-8" />}
      </button>

      {/* Menu Content */}
      {isOpen && (
        <div className="fixed top-0 right-0 w-full h-full bg-white shadow-lg p-6 z-50 rounded-l-lg">
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-black"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

          {/* Restaurant Name */}
          <h2 className="text-2xl mt-4  ml-6 mb-10 font-bold text-black">{restaurantName}</h2>

          {/* Call Button */}
          <a href={`tel:${contactNumber}`} className="text-black mt-4 underline decoration-2 underline-offset-4 ml-8 mb-10 flex items-center gap-2">
            📞 Call us
          </a>


          {/* Opening Hours */}
          <div className="mt-4">
            <h3 className="text-lg mb-4 ml-8 font-normal text-black">Opening hours</h3>
            <ul className="mt-2 ml-10 space-y-1">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <li key={day} className="grid grid-cols-2 p-2 text-black text-sm w-full">
                  <span>{day}</span>
                  <span>{weekdaysWorking}</span>
                </li>
              ))}
              {["Saturday", "Sunday"].map((day) => (
                <li key={day} className="grid grid-cols-2 p-2 text-black text-sm w-full">
                  <span>{day}</span>
                  <span>{weekendWorking}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
