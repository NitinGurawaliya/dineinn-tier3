"use client";

import { useState, useEffect } from "react";
import EditMenu from "@/components/EditMenu";
import GenerateQRCode from "@/components/QrCode";
import UserRestaurantCard from "@/components/ProfileCard";
import AnalyticsDashboard from "@/components/AnalyticsComponent";
import ManageCustomers from "@/components/manage-customers";
import GalleryManager from "@/components/GalleryManager";
import AddSpecialButton from "@/components/AddSpecialButton";
import GalleryUploadButton from "@/components/GalleryUploadButton";
import VisitorCountCard from "@/components/VisitorCountCard";
import OrdersBoard from "@/components/OrdersBoard";

interface DashboardContentProps {
  section?: string;
  dashboardData: any;
}

export default function DashboardContent({ section, dashboardData }: DashboardContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(section);

  useEffect(() => {
    if (section !== currentSection) {
      setIsLoading(true);
      // Small delay to show loading state
      const timer = setTimeout(() => {
        setCurrentSection(section);
        setIsLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [section, currentSection]);

  let content;
  
  switch (currentSection) {
    case "edit-menu":
      content = <EditMenu menuData={dashboardData.menu} />;
      break;
    case "generate-qr":
      content = <GenerateQRCode />;
      break;
    case "orders":
      content = <OrdersBoard />;
      break;
    case "edit-profile":
      content = <UserRestaurantCard restaurantData={dashboardData.restaurant} />;
      break;
    case "analytics":
      content = <AnalyticsDashboard 
        qrAnalyticsData={dashboardData.qrAnalytics} 
        dishViewData={dashboardData.dishAnalytics}
      />
      break;
    case "my-customers":
      content = <ManageCustomers customers={dashboardData.customers} />
      break;
    case "gallery":
      content = <GalleryManager galleryData={dashboardData.gallery} />
      break;
    default:
      content = (
        <div className="container mx-auto px-6 py-8">
          <div className="mt-8">
            <div className="flex flex-col items-center justify-center text-center rounded-lg p-6 mb-8">
                <h2 className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800">
                Welcome, {dashboardData.restaurant.user?.name || 'Owner'}!
                </h2>
                <p className="mt-4 text-2xl sm:text-xl md:text-2xl text-gray-800">
                to {dashboardData.restaurant.restaurantName}
                </p>
            </div>

            {/* Visitor Count Card */}
            <div className="max-w-md mx-auto mb-8">
              <VisitorCountCard 
                qrScans={dashboardData.qrAnalytics?.totalScans || 0}
                todayScans={dashboardData.qrAnalytics?.todayScans || 0}
              />
            </div>

            <div className="flex mt-4 justify-center gap-4">
              <AddSpecialButton />
              <GalleryUploadButton />
            </div>
          </div>
        </div>
      );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return content;
} 