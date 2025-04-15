"use client";

import React from "react";

interface AboutUsProps {
  restaurantName: string;
  weekdaysWorking: string;
  weekendWorking: string;
  contactNumber: string;
}

const AboutUsComponent: React.FC<AboutUsProps> = ({
  restaurantName,
  weekdaysWorking,
  weekendWorking,
  contactNumber,
}) => {
  return (
    <div className="px-6 py-4 text-gray-800">
      <h2 className="text-2xl font-bold mb-4">{restaurantName}</h2>
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Working Hours</h3>
        <ul className="space-y-1 text-sm">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
            <li key={day} className="flex justify-between border-b pb-1">
              <span>{day}</span>
              <span>{weekdaysWorking}</span>
            </li>
          ))}
          {["Saturday", "Sunday"].map((day) => (
            <li key={day} className="flex justify-between border-b pb-1">
              <span>{day}</span>
              <span>{weekendWorking}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Call us</h3>
        <p className="text-sm">📞 <a href={`tel:${contactNumber}`} className="underline">{contactNumber}</a></p>
      </div>
    </div>
  );
};

export default AboutUsComponent;
