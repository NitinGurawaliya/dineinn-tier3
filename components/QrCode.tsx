"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { REQUEST_URL } from "@/config";

type QrBatch = { tableNo: string; url: string; qrCodeUrl: string };
interface QrDataSingle {
  qrCodeUrl: string;
  baseUrl: string;
  restaurantDetail: { restaurantName: string; contactNumber: string; location: string };
}
interface QrDataBatch {
  qrCodes: QrBatch[];
  baseUrl: string;
  restaurantDetail: { restaurantName: string; contactNumber: string; location: string };
}

export default function GenerateQRCode() {
  const [qrData, setQrData] = useState<QrDataSingle | null>(null);
  const [qrBatch, setQrBatch] = useState<QrDataBatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tableInput, setTableInput] = useState<string>(""); // e.g., "1,2,3" or range "1-20"

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const res = await axios.get(`/api/restaurant/qrcode/generate-qr`, {
          withCredentials: true,
        });
        if (res.data.qrCodes) setQrBatch(res.data);
        else setQrData(res.data);
      } catch (err) {
        console.error("Error fetching QR code:", err);
        setError("Failed to load QR code.");
      }
    };

    fetchQRCode();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-6xl space-y-6 md:space-y-0">
        
        {/* Left Card (QR Code & Details) */}
        <div className="bg-white shadow-md border-gray-100 border p-8 rounded-lg flex flex-col items-center w-full md:w-1/3 md:mr-36">
          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-red-800 text-center">
            {qrData?.restaurantDetail.restaurantName || qrBatch?.restaurantDetail.restaurantName || "Loading..."}
          </h2>
          <h1 className="text-md md:text-xl font-extrabold text-black font-mono drop-shadow-lg text-center">
            📍 {qrData?.restaurantDetail.location || qrBatch?.restaurantDetail.location || "Loading..."}
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold my-6 text-gray-800 text-center">
            SCAN ME FOR MENU
          </h2>

          {/* QR Code */}
          {qrBatch?.qrCodes ? (
            <div className="grid grid-cols-1 gap-6">
              {qrBatch.qrCodes.slice(0, 1).map((q) => (
                <div key={q.tableNo} className="flex flex-col items-center">
                  <div className="text-black font-semibold mb-2">Table #{q.tableNo}</div>
                  <img src={q.qrCodeUrl} alt={`QR Table ${q.tableNo}`} className="w-64 h-64 object-contain mb-2" />
                  <div className="text-xs text-gray-700 break-all">{q.url}</div>
                </div>
              ))}
            </div>
          ) : qrData?.qrCodeUrl ? (
            <img
              src={qrData.qrCodeUrl}
              alt="Restaurant Menu QR Code"
              className="w-64 h-64 object-contain mb-4"
            />
          ) : (
            <p className="text-gray-500">Generating QR Code...</p>
          )}

          <h1 className="text-md md:text-xl font-extrabold text-black font-mono drop-shadow-lg text-center mt-4">
            📞 {qrData?.restaurantDetail.contactNumber || qrBatch?.restaurantDetail.contactNumber || "Loading..."}
          </h1>
        </div>

        {/* Right Card (Buttons) */}
        <div className="bg-white p-8 rounded-lg border-gray-300 border-2 flex flex-col items-center w-full md:w-1/3 md:ml-12">
          <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-4">
            Manage QR Code
          </h3>

          <div className="w-full mb-3">
            <label className="block text-sm text-black mb-1">Tables (comma-separated) or Range (e.g., 1-20)</label>
            <input
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              placeholder="1,2,3 or 1-20"
              className="w-full border rounded px-3 py-2 text-black"
            />
          </div>
          <div className="flex w-full gap-2 mb-2">
            <Button
              className="px-3 py-2 w-1/2 bg-gray-800 text-white"
              onClick={async () => {
                try {
                  const params = new URLSearchParams();
                  if (/^\d+-\d+$/.test(tableInput.trim())) {
                    params.set("range", tableInput.trim());
                  } else if (tableInput.trim().length > 0) {
                    params.set("tables", tableInput.trim());
                  }
                  params.set("local", "1");
                  const res = await axios.get(`/api/restaurant/qrcode/generate-qr?${params.toString()}`, { withCredentials: true });
                  if (res.data.qrCodes) { setQrBatch(res.data); setQrData(null); }
                  else { setQrData(res.data); setQrBatch(null); }
                } catch {
                  setError("Failed to generate QR(s)");
                }
              }}
            >
              Generate
            </Button>
            <Button
              className="px-3 py-2 w-1/2 bg-gray-800 text-white"
              onClick={async () => {
                try {
                  const res = await axios.get(`/api/restaurant/qrcode/generate-qr?table=${encodeURIComponent(tableInput.trim() || '1')}&local=1`, { withCredentials: true });
                  if (res.data.qrCodes) { setQrBatch(res.data); setQrData(null); }
                  else { setQrData(res.data); setQrBatch(null); }
                } catch {
                  setError("Failed to generate QR");
                }
              }}
            >
              Single Table
            </Button>
          </div>

          {/* Buttons */}
          <Button
            className="px-6 text-lg py-3 w-full bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700"
            onClick={async () => {
              const makeDownload = (dataUrl: string, filename: string) => {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              };

              const composeLabeled = async (dataUrl: string, labelTop: string, labelBottom?: string) => {
                return new Promise<string>((resolve) => {
                  const img = new Image();
                  img.crossOrigin = 'anonymous';
                  img.onload = () => {
                    const padding = 24;
                    const textArea = 80;
                    const width = img.width + padding * 2;
                    const height = img.height + padding * 2 + textArea;
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d')!;
                    // background
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, width, height);
                    // qr image
                    ctx.drawImage(img, padding, padding);
                    // labels
                    ctx.fillStyle = '#000000';
                    ctx.textAlign = 'center';
                    ctx.font = 'bold 28px sans-serif';
                    ctx.fillText(labelTop, width / 2, img.height + padding + 32);
                    if (labelBottom) {
                      ctx.font = '14px sans-serif';
                      ctx.fillText(labelBottom, width / 2, img.height + padding + 56);
                    }
                    resolve(canvas.toDataURL('image/png'));
                  };
                  img.src = dataUrl;
                });
              };

              if (qrBatch?.qrCodes) {
                for (const q of qrBatch.qrCodes) {
                  const labeled = await composeLabeled(
                    q.qrCodeUrl,
                    `Table #${q.tableNo}`,
                    q.url
                  );
                  makeDownload(labeled, `table-${q.tableNo}.png`);
                }
              } else if (qrData?.qrCodeUrl) {
                const labeled = await composeLabeled(
                  qrData.qrCodeUrl,
                  (qrData.restaurantDetail.restaurantName || 'Menu'),
                  qrData.baseUrl
                );
                makeDownload(labeled, `menu-qr.png`);
              }
            }}
          >
            Download QR Code(s)
          </Button>

          <Button className="px-6 text-lg py-3 w-full mt-2 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105">
            Order Printed QR
          </Button>
        </div>
      </div>
    </div>
  );
}
