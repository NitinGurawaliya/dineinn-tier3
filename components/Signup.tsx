"use client";

import { REQUEST_URL } from "@/config";
import axios from "axios";
import { useState } from "react";

export default function SignupComponent() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function signupHandler() {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/signup", {
        name,
        password,
        email,
      });

      const data = res.data.token;
      console.log("Signed up successfully:", data);

      // You can redirect or show success message here
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex justify-center items-start">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-4 mt-4">
        <div className="flex flex-col items-center mb-6">
          <img
            className="w-44 h-44"
            src="https://res.cloudinary.com/dixjcb4on/image/upload/v1745653811/dishes_image/logo_zayka.jpg"
            alt="DineInn Logo"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Create a New Account
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="terms"
              className="ml-2 text-sm text-gray-600 dark:text-gray-400"
            >
              I accept the{" "}
              <a
                href="#"
                className="text-primary-600 hover:underline dark:text-primary-500"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="/onboarding/auth/signin"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign in
            </a>
          </p>

          <button
            onClick={signupHandler}
            disabled={loading}
            className="w-full py-2.5 mt-4 rounded-lg text-white font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 ease-in-out shadow-md disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
