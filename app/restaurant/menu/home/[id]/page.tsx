import type { RestaurantDetails } from './RestaurantMenuClient';

export const revalidate = 60 * 60 * 24; 

import RestaurantMenuClient from './RestaurantMenuClient';
import { cookies } from 'next/headers';
import prisma from '@/app/lib/prisma';
import jwt from 'jsonwebtoken'; // If you get a type error, install @types/jsonwebtoken

interface PageProps {
  params: { id: string };
}

export default async function RestaurantMenuPage({ params }: PageProps) {
  const { id } = params;

  // Fetch menu/restaurant data server-side
  const menuData = await prisma.restaurantDetail.findUnique({
    where: { id: Number(id) },
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

  if (!menuData) {
    // Optionally render a 404 or fallback UI
    return <div>Restaurant not found</div>;
  }

  // Check for user_token cookie and validate
  let showRegistrationPopup = true;
  const cookieStore = cookies();
  const token = cookieStore.get('user_token')?.value;
  if (token && process.env.NEXTAUTH_SECRET) {
    try {
      jwt.verify(token, process.env.NEXTAUTH_SECRET);
      showRegistrationPopup = false;
    } catch (e) {
      showRegistrationPopup = true;
    }
  }

  return (
    <RestaurantMenuClient
      menuData={menuData as unknown as RestaurantDetails}
      showRegistrationPopup={showRegistrationPopup}
    />
  );
}
