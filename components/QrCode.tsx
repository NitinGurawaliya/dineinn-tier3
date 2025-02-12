import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Button } from "./ui/button";

interface QrData {
  qrCodeUrl: string;
  restaurantDetail: {
    restaurantName: string;
    contactNumber: string;
    location: string;
  };
}

export default async function GenerateQRCode() {
  let qrData: QrData | null = null;
  const cookieHeader = cookies().toString();

  try {
    const res = await axios.get("https://dineinn-tier2.vercel.app/api/restaurant/qrcode", {
      headers: { Cookie: cookieHeader },
      withCredentials: true,
    });

    qrData = res.data;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Internal error" }, { status: 501 });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      {/* Container for Both Cards */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-6xl space-y-6 md:space-y-0">
        
        {/* Left Card (QR Code & Details) */}
        <div className="bg-white shadow-md border-gray-100 border p-8 rounded-lg flex flex-col items-center w-full md:w-1/3 md:mr-36">
          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-red-800 text-center">
            {qrData?.restaurantDetail.restaurantName}
          </h2>
          <h1 className="text-md md:text-xl font-extrabold text-black font-mono drop-shadow-lg text-center">
            📍 {qrData?.restaurantDetail.location}
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold my-6 text-gray-800 text-center">
            SCAN ME FOR MENU
          </h2>

          {/* QR Code */}
          <div className="flex justify-center">
            <img
              src={qrData?.qrCodeUrl}
              alt="Restaurant Menu QR Code"
              className="w-64 h-64 object-contain mb-4"
            />
          </div>

          <h1 className="text-md md:text-xl font-extrabold text-black font-mono drop-shadow-lg text-center mt-4">
            📞 {qrData?.restaurantDetail.contactNumber}
          </h1>
        </div>

        {/* Right Card (Buttons) */}
        <div className="bg-white p-8 rounded-lg border-gray-300 border-2 flex flex-col items-center w-full md:w-1/3 md:ml-12">
          <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-4">
            Manage QR Code
          </h3>

          {/* Buttons */}
          <Button className="px-6 text-lg py-3 w-full bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105">
            Download QR Code
          </Button>

          <Button className="px-6 text-lg py-3 w-full mt-2 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105">
            Order Printed QR
          </Button>
        </div>
      </div>
    </div>
  );
}
