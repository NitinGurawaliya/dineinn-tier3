import { cookies } from "next/headers";
import {Dashboard_Navbar} from "@/components/Navbar";
import EditMenu from "@/components/EditMenu";
import GenerateQRCode from "@/components/QrCode";
import MenuPage from "@/components/MyMenu";
import { REQUEST_URL } from "@/config";
import DashboardContent from "@/components/DashboardContent";

export const dynamic = "force-dynamic"; // Ensures SSR and disables static generation


async function getDashboardData() {
  try {
    const cookieHeader = cookies().toString();
    const res = await fetch(`${REQUEST_URL}/api/dashboard`, {
      headers: { Cookie: cookieHeader },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch dashboard data");

    return res.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

export default async function Dashboard({ searchParams }: { searchParams: { section?: string } }) {
  const dashboardData = await getDashboardData();
  if (!dashboardData) return <p className="text-center text-red-500">Error loading dashboard data</p>;

  return (
    <div className="dashboard-main">
      <Dashboard_Navbar 
        id={dashboardData.restaurant.id} 
        restaurantName={dashboardData.restaurant.restaurantName} 
        logo={dashboardData.restaurant.logo} 
      />
   
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <DashboardContent 
          section={searchParams.section} 
          dashboardData={dashboardData} 
        />
      </main>
     
    </div>
  );
}