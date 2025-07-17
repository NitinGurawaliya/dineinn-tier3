"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { REQUEST_URL } from "@/config";

const RestaurantOnboardingForm = () => {
    const [restaurantName, setRestaurantName] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const [subdomainError, setSubdomainError] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState("");
    const [weekdaysWorking, setWeekdaysWorking] = useState("");
    const [weekendWorking, setWeekendWorking] = useState("");
    const [logo, setLogo] = useState<File | null>(null); // Handle logo as File or null
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRestaurantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setRestaurantName(name);
        // Auto-generate subdomain from restaurant name
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .replace(/--+/g, '-');
        setSubdomain(slug);
    };
    const validateSubdomain = (value: string) => {
        const reserved = ["www", "api", "admin", "mail", "ftp", "blog"];
        if (reserved.includes(value)) return "This subdomain is reserved";
        if (!/^[a-z0-9-]+$/.test(value)) return "Subdomain can only contain lowercase letters, numbers, and hyphens";
        if (value.length < 3 || value.length > 63) return "Subdomain must be between 3 and 63 characters";
        return null;
    };
    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSubdomain(value);
        setSubdomainError(validateSubdomain(value) || "");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // If files is null, file will be undefined
        if (file) {
            setLogo(file);
        }
    };

    const submitRestaurantDetails = async () => {
        setLoading(true);
        setSubdomainError("");
        const error = validateSubdomain(subdomain);
        if (error) {
            setSubdomainError(error);
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("restaurantName", restaurantName);
        formData.append("subdomain", subdomain);
        formData.append("contactNumber", contactNumber);
        formData.append("location", location);
        formData.append("weekdaysWorking", weekdaysWorking);
        formData.append("weekendWorking", weekendWorking);
        formData.append("instagram", instagram);
        formData.append("facebook", facebook);

        // Handle logo upload (if there's a logo)
        if (logo) {
            formData.append("logo", logo);
        }

        try {
            const response = await axios.post(`/api/restaurant/onboarding`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            setMessage("Restaurant details submitted successfully!");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // Handle Axios error
                console.error("Error submitting restaurant details:", error.response?.data);
                setMessage(error.response?.data?.msg || "Something went wrong!");
            } else {
                // Handle non-Axios error (e.g., network error)
                console.error("Unexpected error:", error);
                setMessage("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Restaurant Onboarding</h2>
            {message && <p className="text-center mb-4 text-red-500">{message}</p>}
            <div className="space-y-4">
                <input
                    type="text"
                    name="restaurantName"
                    placeholder="Restaurant Name"
                    value={restaurantName}
                    onChange={handleRestaurantNameChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="subdomain"
                      value={subdomain}
                      onChange={handleSubdomainChange}
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="restaurant-name"
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                      .dineinn.shop
                    </span>
                  </div>
                  {subdomainError && (
                    <p className="mt-1 text-sm text-red-600">{subdomainError}</p>
                  )}
                </div>
                <input
                    type="text"
                    name="contactNumber"
                    placeholder="Contact Number"
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="weekdaysWorking"
                    placeholder="Weekdays Working Hours"
                    onChange={(e) => setWeekdaysWorking(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="weekendWorking"
                    placeholder="Weekend Working Hours"
                    onChange={(e) => setWeekendWorking(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    name="instagram"
                    placeholder="Instagram Profile Link"
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    name="facebook"
                    placeholder="Facebook Profile Link"
                    onChange={(e) => setFacebook(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
                <button
                    type="submit"
                    onClick={submitRestaurantDetails}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default RestaurantOnboardingForm;
