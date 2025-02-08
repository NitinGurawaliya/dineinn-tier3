
// GenerateQRCode.tsx
"use client";
import React, { useState } from "react";
// import QRCode from "qrcode.react";

export default function GenerateQRCode() {
  const [url, setUrl] = useState("https://your-restaurant.com/menu");

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Generate QR Code</h2>
      {/* <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <div className="flex justify-center">
        <QRCode value={url} size={200} />
      </div> */}
    </div>
  );
}
