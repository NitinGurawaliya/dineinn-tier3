import type { Metadata } from "next";

import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Zayka Digital Restaurant Menus",
  description: "Transform your restaurant with digital QR menus. Manage dishes, engage customers, and grow your business with DineInn's comprehensive restaurant management platform.",
  keywords: "restaurant menu, QR code menu, digital menu, restaurant management, food ordering",
  authors: [{ name: "DineInn Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Zayka Digital Restaurant Menus",
    description: "Create beautiful QR menus and manage your restaurant efficiently",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://watch-dog-pi.vercel.app/track.js" data-site="3d522349-235b-4f32-9130-61dccd87f008"></script>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
