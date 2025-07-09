"use client";

import Link from "next/link";
import { ChefHat, QrCode, Users, Star, ArrowRight } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { userTypeDetector, UserType } from "@/lib/userTypeDetection";

// Force dynamic rendering since we use router and API calls
export const dynamic = 'force-dynamic';

function HomeContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [showManualSelection, setShowManualSelection] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuthAndUserType = async () => {
      try {
        // Check if user is already authenticated
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });
        
        if (response.ok) {
          // User is authenticated, redirect to dashboard
          router.push("/restaurant/dashboard");
          return;
        }

        // Use sophisticated detection
        const detectionResult = userTypeDetector.detectUserType();
        setUserType(detectionResult.type);
        setDetectionMethod(detectionResult.method);
        setConfidence(detectionResult.confidence);

        // Check if we should auto-redirect based on confidence
        if (userTypeDetector.shouldAutoRedirect(detectionResult)) {
          // Store the preference for future visits
          userTypeDetector.storeUserPreference(detectionResult.type);
          
          // Add a small delay to show the detection process
          setTimeout(() => {
            if (detectionResult.type === 'merchant') {
              router.push("/onboarding/auth/signin");
            } else if (detectionResult.type === 'viewer') {
              window.location.href = "https://zayka.store";
            }
          }, 1500); // 1.5 second delay to show the detection
        } else {
          // Low confidence, show manual selection
          setShowManualSelection(true);
        }

      } catch (error) {
        console.log("User not authenticated");
        // If detection fails, show manual selection
        setShowManualSelection(true);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndUserType();
  }, [router, searchParams]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show detection in progress
  if (userType && !showManualSelection) {
    const confidencePercentage = Math.round(confidence * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">
            {userType === 'merchant' 
              ? 'Detected: Restaurant Owner' 
              : 'Detected: Customer'
            }
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Confidence: {confidencePercentage}% • Method: {detectionMethod}
          </p>
          <p className="text-gray-600">
            {userType === 'merchant' 
              ? 'Redirecting to signin...' 
              : 'Redirecting to Zayka Store...'
            }
          </p>
          <button 
            onClick={() => setShowManualSelection(true)}
            className="mt-4 text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Not correct? Choose manually
          </button>
        </div>
      </div>
    );
  }

  // Show manual selection if detection failed or user clicked "not correct"
  if (showManualSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">DineInn</h1>
              </div>
            </div>
          </div>
        </header>

        {/* User Type Selection */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="text-blue-600"> DineInn</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose how you'd like to use DineInn
            </p>
          </div>

          {/* User Type Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Viewer Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <Users className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Customer</h3>
                <p className="text-gray-600 mb-6">
                  I want to browse restaurant menus and order food
                </p>
                <button 
                  onClick={() => {
                    setUserType('viewer');
                    userTypeDetector.storeUserPreference('viewer');
                    window.location.href = "https://zayka.store";
                  }}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
                >
                  Go to Zayka Store
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Merchant Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <ChefHat className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Restaurant Owner</h3>
                <p className="text-gray-600 mb-6">
                  I want to create digital menus and manage my restaurant
                </p>
                <button 
                  onClick={() => {
                    setUserType('merchant');
                    userTypeDetector.storeUserPreference('merchant');
                    router.push("/onboarding/auth/signin");
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                >
                  Sign In / Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">QR Code Menus</h3>
              <p className="text-gray-600">Generate beautiful QR codes for your menu that customers can scan instantly.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <ChefHat className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Menu Management</h3>
              <p className="text-gray-600">Easily add, edit, and organize your dishes with categories and descriptions.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Engagement</h3>
              <p className="text-gray-600">Collect reviews, manage customers, and build lasting relationships.</p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <div className="flex justify-center items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600">Trusted by 1000+ restaurants worldwide</p>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
