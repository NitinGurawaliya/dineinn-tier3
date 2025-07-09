"use client";

import { ChefHat, X } from "lucide-react";
import { useState } from "react";

interface MerchantBannerProps {
  className?: string;
}

export default function MerchantBanner({ className = "" }: MerchantBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChefHat className="h-6 w-6" />
          <div>
            <p className="font-semibold">Are you a Restaurant Owner?</p>
            <p className="text-sm text-blue-100">
              Create digital menus and manage your restaurant with DineInn
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="https://yourdomain.com/?type=merchant"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
          >
            Get Started
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="text-blue-100 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 