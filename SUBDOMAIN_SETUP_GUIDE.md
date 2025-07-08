# Subdomain Setup Guide for DineInn Restaurant Menus

## Overview

This guide explains how to set up subdomains for your restaurant menu pages, allowing each restaurant to have their own custom subdomain (e.g., `restaurantname.yourdomain.com`) instead of using the current `/restaurant/menu/home/[id]` structure.

## Current Architecture

Currently, your restaurant menu pages are accessible via:
- `yourdomain.com/restaurant/menu/home/[restaurant_id]`
- Example: `yourdomain.com/restaurant/menu/home/1`

## Target Architecture

After implementation, restaurants will have custom subdomains:
- `restaurantname.yourdomain.com`
- Example: `solandhaba.yourdomain.com`

## Implementation Steps

### 1. Database Schema Updates

First, we need to add a `subdomain` field to the `RestaurantDetail` model:

```prisma
model RestaurantDetail {
  id              Int        @id @default(autoincrement())
  restaurantName  String
  subdomain       String     @unique  // Add this field
  contactNumber   String?
  location        String
  weekendWorking  String?
  weekdaysWorking String?
  logo            String?
  instagram       String?
  facebook        String?
  qrScans        Int         @default(0)
  userId          Int        @unique
  user            User       @relation(fields: [userId], references: [id])

  rating      RestaurantRating[]
  galleryImages   RestaurantGallery[]
  categories      Category[]
  dishes          Dishes[]  
  announcements   Announcement[]
  customer        Customer []
}
```

### 2. Create Database Migration

```bash
npx prisma migrate dev --name add_subdomain_field
```

### 3. Update Restaurant Onboarding Form

Add a subdomain input field to your restaurant onboarding form (`components/OnboardingForm.tsx`):

```tsx
// Add to your form state
const [subdomain, setSubdomain] = useState("");

// Add validation function
const validateSubdomain = (subdomain: string) => {
  const subdomainRegex = /^[a-z0-9-]+$/;
  if (!subdomainRegex.test(subdomain)) {
    return "Subdomain can only contain lowercase letters, numbers, and hyphens";
  }
  if (subdomain.length < 3 || subdomain.length > 63) {
    return "Subdomain must be between 3 and 63 characters";
  }
  return null;
};

// Add to your form JSX
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Subdomain
  </label>
  <div className="flex items-center">
    <input
      type="text"
      value={subdomain}
      onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
      placeholder="restaurant-name"
    />
    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
      .yourdomain.com
    </span>
  </div>
  {subdomainError && (
    <p className="mt-1 text-sm text-red-600">{subdomainError}</p>
  )}
</div>
```

### 4. Update API Routes

#### 4.1 Update Restaurant Onboarding API

Modify `app/api/restaurant/onboarding/route.ts`:

```typescript
// Add subdomain validation and storage
const { restaurantName, contactNumber, location, weekendWorking, weekdaysWorking, subdomain } = body;

// Validate subdomain
const subdomainRegex = /^[a-z0-9-]+$/;
if (!subdomainRegex.test(subdomain)) {
  return NextResponse.json({ msg: "Invalid subdomain format" }, { status: 400 });
}

// Check if subdomain is already taken
const existingRestaurant = await prisma.restaurantDetail.findUnique({
  where: { subdomain }
});

if (existingRestaurant) {
  return NextResponse.json({ msg: "Subdomain already taken" }, { status: 409 });
}

// Create restaurant with subdomain
const restaurant = await prisma.restaurantDetail.create({
  data: {
    restaurantName,
    subdomain,
    contactNumber,
    location,
    weekendWorking,
    weekdaysWorking,
    userId: parseInt(userId)
  }
});
```

#### 4.2 Create Subdomain Resolution API

Create `app/api/subdomain/[subdomain]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: { subdomain: string } }
) {
  const { subdomain } = context.params;

  try {
    const restaurant = await prisma.restaurantDetail.findUnique({
      where: { subdomain },
      select: {
        id: true,
        restaurantName: true,
        subdomain: true,
        logo: true,
        location: true,
        contactNumber: true,
        weekdaysWorking: true,
        weekendWorking: true,
        instagram: true,
        facebook: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({ msg: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json(restaurant, { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurant by subdomain:", error);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
```

### 5. Create Subdomain Middleware

Create `middleware/subdomain.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function subdomainMiddleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Skip for main domain and www
  if (subdomain === 'www' || subdomain === 'yourdomain' || subdomain === 'localhost') {
    return NextResponse.next();
  }

  // Check if this is a valid subdomain
  const url = request.nextUrl.clone();
  
  // If accessing root path on subdomain, redirect to menu page
  if (url.pathname === '/') {
    url.pathname = `/menu/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
```

### 6. Update Main Middleware

Update your existing `middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { subdomainMiddleware } from './middleware/subdomain'

// Define protected routes that require authentication
const protectedRoutes = [
  '/restaurant/dashboard',
  '/restaurant/menu',
  '/onboarding/details',
  '/onboarding/menu',
  '/restaurant/' // covers all /restaurant/*
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/onboarding/auth/signin',
  '/onboarding/auth/signup'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]

  // Handle subdomain requests
  if (subdomain && subdomain !== 'www' && subdomain !== 'yourdomain' && subdomain !== 'localhost') {
    return subdomainMiddleware(request)
  }

  const token = request.cookies.get('token')?.value

  // Debug logging
  console.log('MIDDLEWARE:', { pathname, token, subdomain })

  // If requesting an API route, skip middleware
  if (pathname.startsWith('/api')) return NextResponse.next()

  // If not authenticated and on a protected route, redirect to signin
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    console.log('Redirecting to signin from protected route')
    return NextResponse.redirect(new URL('/onboarding/auth/signin', request.url))
  }

  // If authenticated and on an auth page, redirect to dashboard
  if (token && (pathname === '/onboarding/auth/signin' || pathname === '/onboarding/auth/signup')) {
    console.log('Redirecting to dashboard from auth page')
    return NextResponse.redirect(new URL('/restaurant/dashboard', request.url))
  }

  // If authenticated and on home page, redirect to dashboard
  if (token && pathname === '/') {
    console.log('Redirecting to dashboard from home')
    return NextResponse.redirect(new URL('/restaurant/dashboard', request.url))
  }

  // If on a protected route and token exists, verify it
  if (protectedRoutes.some(route => pathname.startsWith(route)) && token) {
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      await jwtVerify(token, secret)
    } catch (error) {
      console.log('Token verification failed, redirecting to signin', error)
      return NextResponse.redirect(new URL('/onboarding/auth/signin', request.url))
    }
  }

  // Otherwise, allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
```

### 7. Create Subdomain Menu Page

Create `app/menu/[subdomain]/page.tsx`:

```typescript
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import CategoryComponent from "@/components/CategoryBar"
import DishesCard from "@/components/DishesCard"
import { ChefHatIcon, Search } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import AboutUsComponent from "@/components/about-us"
import TabsComponent from "@/components/menu-navbar"
import RestaurantGallery from "@/components/image-gallery"
import BackToTop from "@/components/back-to-top"
import AnnouncementList from "@/components/updates-section"
import FormModal from "@/components/OptFormModal"

interface RestaurantDetails {
  restaurantName: string
  weekdaysWorking: string
  weekendWorking: string
  location: string
  contactNumber: string
  instagram: string
  logo: string
  id: number
  subdomain: string
}

interface Category {
  id: number
  name: string
  restaurantId: number
}

interface Dish {
  id: number
  name: string
  description: string
  price: number
  image: string
  categoryId: number
  restaurantId: number
  type?: string
}

interface GalleryImages {
  id: number
  imageUrl: string
  restaurantId: number
}

interface Announcements {
  id: number
  title: string
  content: string
  createdAt: string
  restaurantId: number
}

export default function SubdomainMenuPage() {
  const params = useParams()
  const { subdomain } = params

  const [activeTab, setActiveTab] = useState("Overview")
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([])
  const [restaurantData, setRestaurantData] = useState<RestaurantDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [galleryImages, setGalleryImages] = useState<GalleryImages[]>([])
  const [announcement, setAnnouncement] = useState<Announcements[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [showScrollText, setShowScrollText] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = dishes.filter((dish) => dish.name.toLowerCase().includes(query))
    setFilteredDishes(filtered)
  }

  useEffect(() => {
    if (galleryImages.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.min(3, galleryImages.length))
    }, 2000)

    return () => clearInterval(interval)
  }, [galleryImages])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollText(false)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true)
      try {
        // First get restaurant details by subdomain
        const restaurantRes = await axios.get(`/api/subdomain/${subdomain}`)
        const restaurant = restaurantRes.data

        // Then get menu data using restaurant ID
        const menuRes = await axios.get(`/api/menu/${restaurant.id}`)
        const menuData = menuRes.data

        setRestaurantData({ ...restaurant, ...menuData })
        setCategories(menuData.categories)
        setDishes(menuData.dishes)
        setFilteredDishes(menuData.dishes)
        setGalleryImages(menuData.galleryImages)
        setAnnouncement(menuData.announcements)
      } catch (error) {
        console.error("Error fetching menu data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (subdomain) fetchMenuData()
  }, [subdomain])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRatingDialog(true)
    }, 12000)

    return () => clearTimeout(timer)
  }, [])

  const handleCategorySelect = (categoryId: number, headerHeight = 0) => {
    const filtered = dishes.filter((dish) => dish.categoryId === categoryId)
    setFilteredDishes(filtered)

    setTimeout(() => {
      const dishesContainer = document.getElementById("dishes-container")
      if (!dishesContainer) return

      const categoryBar = document.getElementById("category-bar")
      const isSticky = categoryBar?.classList.contains("fixed")
      const totalHeaderHeight = isSticky ? headerHeight || categoryBar?.offsetHeight || 0 : 0

      const containerRect = dishesContainer.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const containerTop = containerRect.top + scrollTop

      window.scrollTo({
        top: containerTop - totalHeaderHeight - 80,
        behavior: "smooth",
      })
    }, 150)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center my-40">
        <ChefHatIcon size={80} className="animate-spin flex text-gray-900" />
      </div>
    )
  }

  return (
    <div className="bg-white">
      {restaurantData && (
        <Navbar restaurantName={restaurantData.restaurantName} logo={restaurantData.logo} id={""} />
      )}

      {/* Gallery Image Slider */}
      <div className="relative w-full h-52 overflow-hidden">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {galleryImages.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image.imageUrl || "/placeholder.svg"}
              alt={`Gallery Image ${index}`}
              className="w-full h-52 object-cover flex-shrink-0"
              style={{ minWidth: "100%" }}
            />
          ))}
        </div>
      </div>

      {/* Search Bar */}
      {activeTab === "Menu" && (
        <div className="flex w-full h-14 bg-center rounded-lg items-center px-4">
          <Search className="text-black mr-2 h-12" />
          <input
            className="w-full text-black h-14 bg-white focus:outline-none px-2"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      )}

      {/* Tabs */}
      <TabsComponent
        tabs={["Overview", "Menu", "Gallery", "Updates", "Reviews"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Content Rendering */}
      {loading ? (
        <div className="flex justify-center items-center my-40">
          <ChefHatIcon size={80} className="animate-spin flex text-gray-900" />
        </div>
      ) : (
        <>
          {activeTab === "Menu" ? (
            <>
              <div id="category-bar">
                <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
              </div>

              <div
                id="dishes-container"
                className="grid px-1 grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0"
              >
                {filteredDishes.map((dish) => (
                  <div key={dish.id} className="relative pb-0" data-category-id={dish.categoryId}>
                    <DishesCard {...dish} type={dish.type || "VEG"} />
                    <div className="w-[calc(100%-44px)] mx-auto border-t-2 border-dotted border-gray-300 mt-1"></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-2 text-lg text-gray-800">
              {activeTab === "Overview" && (
                <AboutUsComponent
                  instagram={restaurantData?.instagram ?? ""}
                  location={restaurantData?.location ?? ""}
                  restaurantName={restaurantData?.restaurantName ?? "Loading..."}
                  weekdaysWorking={restaurantData?.weekdaysWorking ?? ""}
                  weekendWorking={restaurantData?.weekendWorking ?? ""}
                  contactNumber={restaurantData?.contactNumber ?? ""}
                />
              )}

              {activeTab === "Gallery" && <RestaurantGallery images={galleryImages} />}
              {activeTab === "Updates" && (
                <div className="min-h-screen ">
                  <AnnouncementList updates={announcement} />
                </div>
              )}
              {activeTab === "Reviews" && <p>See what others are saying!</p>}
            </div>
          )}
        </>
      )}

      {/* Scroll Text */}
      {showScrollText && activeTab === "Menu" && (
        <div className="fixed bottom-2 transform -translate-x-1/2 flex items-center ml-40 justify-center font-semibold text-lg text-black opacity-80 animate-bounce">
          Scroll Here
        </div>
      )}

      <FormModal restaurantId={restaurantData?.id} open={showForm} setOpen={setShowForm} />

      <BackToTop />
    </div>
  )
}
```

### 8. DNS Configuration (Namecheap)

#### 8.1 Wildcard DNS Record

In your Namecheap domain management:

1. Go to **Domain List** → **Manage** → **Advanced DNS**
2. Add a new **A Record**:
   - **Host**: `*` (wildcard)
   - **Value**: Your server IP address (or Vercel's IP)
   - **TTL**: Automatic

#### 8.2 Alternative: Individual Subdomain Records

For better performance, you can create individual A records for each restaurant:

1. **Host**: `restaurantname` (e.g., `solandhaba`)
2. **Value**: Your server IP address
3. **TTL**: Automatic

### 9. Vercel Configuration

#### 9.1 Environment Variables

Add to your Vercel environment variables:
```
DOMAIN=yourdomain.com
```

#### 9.2 Vercel.json (Optional)

Create `vercel.json` for custom domain handling:

```json
{
  "rewrites": [
    {
      "source": "/:subdomain*",
      "destination": "/api/subdomain/:subdomain*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 10. Update QR Code Generation

Update your QR code generation to use subdomains instead of the current URL structure:

```typescript
// In your QR code generation component
const generateQRCode = async (restaurantId: number, subdomain: string) => {
  const qrData = `https://${subdomain}.yourdomain.com`;
  
  try {
    const qrCode = await QRCode.toDataURL(qrData);
    return qrCode;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};
```

### 11. Testing

#### 11.1 Local Testing

For local testing, you can use tools like:
- **ngrok**: `ngrok http 3000`
- **localtunnel**: `npx localtunnel --port 3000`

#### 11.2 Subdomain Testing

Test your subdomains:
- `restaurantname.yourdomain.com`
- `another-restaurant.yourdomain.com`

### 12. Migration Strategy

#### 12.1 Database Migration

```bash
# Run the migration
npx prisma migrate dev --name add_subdomain_field

# Update existing restaurants with subdomains
npx prisma studio
```

#### 12.2 Gradual Rollout

1. Deploy the new subdomain system alongside the existing one
2. Update restaurant onboarding to include subdomain selection
3. Gradually migrate existing restaurants to subdomains
4. Update QR codes for existing restaurants
5. Eventually deprecate the old `/restaurant/menu/home/[id]` route

### 13. SEO Considerations

#### 13.1 Meta Tags

Update your menu pages to include proper meta tags:

```typescript
// In your subdomain menu page
export const metadata = {
  title: `${restaurantData?.restaurantName} - Menu`,
  description: `View the menu for ${restaurantData?.restaurantName}`,
  openGraph: {
    title: `${restaurantData?.restaurantName} - Menu`,
    description: `View the menu for ${restaurantData?.restaurantName}`,
    url: `https://${subdomain}.yourdomain.com`,
  },
};
```

#### 13.2 Sitemap Generation

Create a dynamic sitemap for all restaurant subdomains:

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const restaurants = await prisma.restaurantDetail.findMany({
    select: { subdomain: true, restaurantName: true }
  });

  const restaurantUrls = restaurants.map((restaurant) => ({
    url: `https://${restaurant.subdomain}.yourdomain.com`,
    lastModified: new Date(),
  }));

  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
    },
    ...restaurantUrls,
  ];
}
```

### 14. Security Considerations

#### 14.1 Subdomain Validation

Ensure subdomains are properly validated:

```typescript
const validateSubdomain = (subdomain: string) => {
  // Prevent reserved subdomains
  const reservedSubdomains = ['www', 'api', 'admin', 'mail', 'ftp', 'blog'];
  if (reservedSubdomains.includes(subdomain)) {
    return 'This subdomain is reserved';
  }

  // Validate format
  const subdomainRegex = /^[a-z0-9-]+$/;
  if (!subdomainRegex.test(subdomain)) {
    return 'Subdomain can only contain lowercase letters, numbers, and hyphens';
  }

  // Check length
  if (subdomain.length < 3 || subdomain.length > 63) {
    return 'Subdomain must be between 3 and 63 characters';
  }

  return null;
};
```

#### 14.2 Rate Limiting

Implement rate limiting for subdomain creation:

```typescript
// Using a library like express-rate-limit or similar
const rateLimit = require('express-rate-limit');

const subdomainCreationLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 subdomain creations per windowMs
  message: 'Too many subdomain creation attempts, please try again later.'
});
```

### 15. Monitoring and Analytics

#### 15.1 Subdomain Analytics

Track subdomain usage:

```typescript
// In your middleware
const trackSubdomainVisit = async (subdomain: string) => {
  try {
    await prisma.restaurantDetail.update({
      where: { subdomain },
      data: {
        qrScans: {
          increment: 1
        }
      }
    });
  } catch (error) {
    console.error('Error tracking subdomain visit:', error);
  }
};
```

#### 15.2 Error Monitoring

Set up error monitoring for subdomain issues:

```typescript
// Log subdomain resolution errors
if (!restaurant) {
  console.error(`Subdomain not found: ${subdomain}`);
  // Send to your error monitoring service
  // Sentry.captureException(new Error(`Subdomain not found: ${subdomain}`));
}
```

## Benefits of This Approach

1. **Better Branding**: Each restaurant gets their own branded URL
2. **Improved SEO**: Individual subdomains can rank separately
3. **Better UX**: Cleaner, more professional URLs
4. **Scalability**: Easy to add new restaurants without URL conflicts
5. **Analytics**: Better tracking per restaurant
6. **Marketing**: Easier to share and promote individual restaurant menus

## Cost Considerations

1. **DNS Management**: Wildcard DNS records are usually free
2. **SSL Certificates**: Most hosting providers include wildcard SSL
3. **Bandwidth**: Minimal additional cost
4. **Development Time**: One-time setup cost

## Timeline

- **Phase 1** (Week 1): Database schema updates and API development
- **Phase 2** (Week 2): Frontend updates and testing
- **Phase 3** (Week 3): DNS configuration and deployment
- **Phase 4** (Week 4): Migration of existing restaurants
- **Phase 5** (Week 5): Monitoring and optimization

This setup will give each restaurant their own professional subdomain while maintaining the existing functionality and improving the overall user experience. 