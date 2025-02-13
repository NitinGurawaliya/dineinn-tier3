"use server";

import axios from "axios";

export async function getQRCode() {
  try {
    const res = await axios.get("https://dineinn-tier2.vercel.app/api/restaurant/qrcode", {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching QR code:", error);
    return null;
  }
}
