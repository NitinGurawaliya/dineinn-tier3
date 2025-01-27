"use client";

import { useState } from "react";

const RestaurantOnboardingForm = () => {
   
    const[restaurantName,setRestaurantName] = useState("")
    const[contactNumber,setContactNumber] = useState("")
    const[location,setLocation] = useState("");
    const [WeekdaysWorking,setWeekdaysWorking]= useState("")
    const[WeekendWorking,setWeekendWorking]  = useState("")
    const[Logo,setLogo] = useState("");
    const[Instagram,setInstagram] = useState("")
    const[Facebook,setFacebook]= useState("")

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    

    const submitRestaurantDetails = async () => {
        const response = await fetch("/api/restaurant/onboarding", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",  // Important to send cookies
            body: JSON.stringify({
                restaurantName,
                contactNumber,
                location,
                WeekdaysWorking,
                WeekendWorking,
                Logo,
                Instagram,
                Facebook,
            }),
        });
    
        const data = await response.json();
        console.log("Response:", data);
    };
    

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Restaurant Onboarding</h2>
            {message && <p className="text-center mb-4 text-red-500">{message}</p>}
            <div  className="space-y-4">
                <input
                    type="text"
                    name="restaurantName"
                    placeholder="Restaurant Name"
                    onChange={(e)=>{
                        setRestaurantName(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="contactNumber"
                    placeholder="Contact Number"
                    onChange={(e)=>{
                        setContactNumber(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    onChange={(e)=>{
                        setLocation(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="WeekdaysWorking"
                    placeholder="Weekdays Working Hours"
                    onChange={(e)=>{
                        setWeekdaysWorking(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="WeekendWorking"
                    placeholder="Weekend Working Hours"
                    onChange={(e)=>{
                        setWeekendWorking(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="Logo"
                    placeholder="Logo URL"
                    onChange={(e)=>{
                        setLogo(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    name="Instagram"
                    placeholder="Instagram Profile Link"
                    onChange={(e)=>{
                        setInstagram(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
                <input
                    type="text"
                    name="Facebook"
                    placeholder="Facebook Profile Link"
                    onChange={(e)=>{
                        setFacebook(e.target.value)
                    }}
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
