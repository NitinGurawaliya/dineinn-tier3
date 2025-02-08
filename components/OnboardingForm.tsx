"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";

const RestaurantOnboardingForm = () => {
    const [restaurantName, setRestaurantName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState("");
    const [weekdaysWorking, setWeekdaysWorking] = useState("");
    const [weekendWorking, setWeekendWorking] = useState("");
    const [logo, setLogo] = useState<File | null>(null); // Handle logo as File or null
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // If files is null, file will be undefined
        if (file) {
            setLogo(file);
        }
    };

    const submitRestaurantDetails = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("restaurantName", restaurantName);
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
            const response = await axios.post("/api/restaurant/onboarding", formData, {
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
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
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
