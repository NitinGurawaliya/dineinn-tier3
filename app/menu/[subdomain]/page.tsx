import SubdomainMenuClient from "./SubdomainMenuClient";
import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const revalidate = 60 * 60 * 24;

interface PageProps {
  params: { subdomain: string };
}

export default async function SubdomainMenuPage({ params }: PageProps) {
  const { subdomain } = params;

  // Fetch restaurant details by subdomain
  const restaurant = await prisma.restaurantDetail.findUnique({
    where: { subdomain },
    select: {
      id: true,
      restaurantName: true,
      weekdaysWorking: true,
      weekendWorking: true,
      location: true,
      instagram: true,
      contactNumber: true,
      logo: true,
      categories: true,
      dishes: true,
      galleryImages: true,
      announcements: true,
    },
  });

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  // Registration popup logic (same as /home/[id])
  let showRegistrationPopup = true;
  const cookieStore = cookies();
  const token = cookieStore.get("user_token")?.value;
  if (token && process.env.NEXTAUTH_SECRET) {
    try {
      jwt.verify(token, process.env.NEXTAUTH_SECRET);
      showRegistrationPopup = false;
    } catch (e) {
      showRegistrationPopup = true;
    }
  }

  return (
    <SubdomainMenuClient
      menuData={{
        ...restaurant,
        weekdaysWorking: restaurant.weekdaysWorking || '',
        weekendWorking: restaurant.weekendWorking || '',
        instagram: restaurant.instagram || '',
        logo: restaurant.logo || '',
        contactNumber: restaurant.contactNumber || '',
        location: restaurant.location || '',
        dishes: restaurant.dishes.map((dish: any) => ({
          ...dish,
          image: dish.image || '',
        })),
        announcements: restaurant.announcements.map((a: any) => ({
          ...a,
          createdAt: typeof a.createdAt === 'string' ? a.createdAt : a.createdAt?.toISOString?.() || '',
        })),
      }}
      showRegistrationPopup={showRegistrationPopup}
    />
  );
}