import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import EditMenu from "@/components/EditMenu";
import GenerateQRCode from "@/components/QrCode";
import { redirect } from "next/navigation";
import MenuPage from "@/components/MyMenu";

async function getData() {
  try {
    const cookieHeader = cookies().toString();
    const res = await fetch("http://localhost:3000/api/menu", {
      headers: { Cookie: cookieHeader },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch data");

    return res.json();
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}

export default async function Dashboard({ searchParams }: { searchParams: { section?: string } }) {
  const details = await getData();
  if (!details) return <p className="text-center text-red-500">Error loading data</p>;

  let content;
  switch (searchParams.section) {
    case "my-menu":
      content = <MenuPage />;
      break;
    case "edit-menu":
      content = <EditMenu />;
      break;
    case "generate-qr":
      content = <GenerateQRCode />;
      break;
    default:
      content = (
        <main className="flex-1 overflow-x-hidden overflow-y-auto ">
        <div className="container mx-auto px-6 py-8">
          <div className="mt-8">
            <div className="flex flex-col items-center justify-center text-center rounded-lg p-6 mb-8">
                <h2 className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800">
                Welcome, Nitin!
                </h2>
                <p className="mt-4 text-2xl sm:text-xl md:text-2xl text-gray-800">
                to {details.restaurantName}
                </p>
            </div>


            <div className="flex mt-4 justify-center">
              <button className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105">
                Add Today's Special
              </button>
            </div>
          </div>
        </div>
      </main>
    
      );
  }

  return (
    <div>
      <Navbar id={details.id} restaurantName={details.restaurantName} logo={details.logo} />
   
        {/* Sidebar */}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">{content}</main>
     
    </div>
  );
}
