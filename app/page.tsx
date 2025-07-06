"use client";

import Link from "next/link";
import { ChefHat, QrCode, Users, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });
        
        if (response.ok) {
          // User is authenticated, redirect to dashboard
          router.push("/restaurant/dashboard");
          return;
        }
      } catch (error) {
        // User is not authenticated, stay on home page
        console.log("User not authenticated");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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
            <div className="flex space-x-4">
              <Link href="/onboarding/auth/signin">
                <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">
                  Sign In
                </button>
              </Link>
              <Link href="/onboarding/auth/signup">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Restaurant with
            <span className="text-blue-600"> Digital Menus</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create beautiful QR menus, manage your dishes, and engage with customers like never before. 
            Join thousands of restaurants already using DineInn.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/onboarding/auth/signup">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
                Start Free Trial
              </button>
            </Link>
            <Link href="/onboarding/auth/signin">
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold">
                Sign In
              </button>
            </Link>
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
