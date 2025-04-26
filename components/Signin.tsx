"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SigninComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function signinHandler() {
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/signin", { email, password });
      const token = res.data.token;

      console.log("Signed in successfully:", token);

      router.push("/restaurant/dashboard");
    } catch (error) {
      console.error("Signin failed:", error);
      alert("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
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

        <div className="space-y-5">
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

            <button
                onClick={signinHandler}
                disabled={loading}
                className="w-full py-2.5 mt-4 rounded-lg text-white font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 ease-in-out shadow-md disabled:opacity-50"
                >
                {loading ? "Signing In..." : "Sign In"}
            </button>


          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
