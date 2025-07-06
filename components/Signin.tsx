"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function SigninComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });
        
        if (response.ok) {
          // User is already authenticated, redirect to dashboard or intended page
          const redirectTo = searchParams.get("redirect") || "/restaurant/dashboard";
          router.push(redirectTo);
        }
      } catch (error) {
        // User is not authenticated, stay on signin page
        console.log("User not authenticated");
      }
    };

    checkAuth();
  }, [router, searchParams]);

  async function signinHandler() {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/signin", { email, password });
      const token = res.data.token;

      console.log("Signed in successfully:", token);

      // Redirect to intended page or dashboard
      const redirectTo = searchParams.get("redirect") || "/restaurant/dashboard";
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Signin failed:", error);
      if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else {
        setError("Failed to sign in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      signinHandler();
    }
  };

  return (
    <div className="bg-white border-black-2  dark:bg-gray-900 min-h-screen flex justify-center items-start">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-4 mt-4">
        <div className="flex flex-col items-center mb-6">
          <img
            className="w-44 h-44"
            src="https://res.cloudinary.com/dixjcb4on/image/upload/v1745653811/dishes_image/logo_zayka.jpg"
            alt="DineInn Logo"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Sign In to Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={signinHandler}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <a
                href="/onboarding/auth/signup"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
