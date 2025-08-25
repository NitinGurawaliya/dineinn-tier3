"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import CategoryComponent from "@/components/CategoryBar";
import DishesCard from "@/components/DishesCard";
import axios from "axios";
import { Search, ArrowBigDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import AboutUsComponent from "@/components/about-us";
import TabsComponent from "@/components/menu-navbar";
import RestaurantGallery from "@/components/image-gallery";
import BackToTop from "@/components/back-to-top";
import AnnouncementList from "@/components/updates-section";
import RegistrationPopup from "@/components/RegistrationPopup";

interface GalleryImages {
  id: number;
  restaurantId: number;
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
  restaurantId: number;
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  restaurantId: number;
  type?: string;
}

interface Announcements {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface RestaurantDetails {
  id: number;
  restaurantName: string;
  weekdaysWorking: string;
  weekendWorking: string;
  location: string;
  instagram: string;
  contactNumber: string;
  logo: string;
  categories: Category[];
  dishes: Dish[];
  galleryImages: GalleryImages[];
  announcements: Announcements[];
}

interface SubdomainMenuClientProps {
  menuData: RestaurantDetails;
  showRegistrationPopup: boolean;
}

export default function SubdomainMenuClient({ menuData, showRegistrationPopup }: SubdomainMenuClientProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [categories, setCategories] = useState<Category[]>(menuData.categories || []);
  const [dishes, setDishes] = useState<Dish[]>(menuData.dishes || []);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>(menuData.dishes || []);
  const [galleryImages, setGalleryImages] = useState<GalleryImages[]>(menuData.galleryImages || []);
  const [announcement, setAnnouncement] = useState<Announcements[]>(menuData.announcements || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScrollText, setShowScrollText] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dishesContainerRef = useRef<HTMLDivElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  type CartItem = { dishId: number; name: string; price: number; quantity: number };
  const [cart, setCart] = useState<Record<number, CartItem>>({});

  const cartKey = `cart:${menuData.id}`;

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return '';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift() || '';
    return '';
  };

  const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}`;
  };

  const ensureGuestSession = () => {
    let sid = getCookie('guest_session_id');
    if (!sid) {
      // simple uuid v4 generator
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      setCookie('guest_session_id', uuid, 60 * 60 * 24 * 365);
      sid = uuid;
    }
    return sid;
  };

  useEffect(() => {
    async function name() {
      if (!menuData.id) return;
      try {
        await axios.get(`/api/restaurant/qrcode/scan-count/${menuData.id}`);
      } catch {}
    }
    name();
  }, [menuData.id]);

  // Open registration once on entry if server indicated it's needed
  useEffect(() => {
    if (showRegistrationPopup) {
      const t = setTimeout(() => setRegistrationOpen(true), 1000);
      return () => clearTimeout(t);
    }
  }, [showRegistrationPopup]);

  // On mount: capture table query param t and store cookie, ensure guest session, load cart
  useEffect(() => {
    // capture table number from URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const t = url.searchParams.get('t');
      if (t) setCookie('table_no', t, 60 * 60 * 24 * 30);
    }
    ensureGuestSession();

    // load cart
    try {
      const raw = localStorage.getItem(cartKey);
      if (raw) setCart(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = dishes.filter((dish) => dish.name.toLowerCase().includes(query));
    setFilteredDishes(filtered);
  };

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev[dish.id];
      const nextQty = (existing?.quantity || 0) + 1;
      return {
        ...prev,
        [dish.id]: {
          dishId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: nextQty,
        },
      };
    });
  };

  const increment = (dishId: number) => {
    setCart((prev) => {
      const it = prev[dishId];
      if (!it) return prev;
      return { ...prev, [dishId]: { ...it, quantity: it.quantity + 1 } };
    });
  };

  const decrement = (dishId: number) => {
    setCart((prev) => {
      const it = prev[dishId];
      if (!it) return prev;
      const q = it.quantity - 1;
      if (q <= 0) {
        const { [dishId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dishId]: { ...it, quantity: q } };
    });
  };

  const clearCart = () => setCart({});

  const totalItems = Object.values(cart).reduce((s, it) => s + it.quantity, 0);
  const subtotal = Object.values(cart).reduce((s, it) => s + it.quantity * it.price, 0);

  const placeOrder = async (notes?: string) => {
    const tableNo = getCookie('table_no');
    if (!tableNo) {
      alert('Please scan the QR on your table to set your table number.');
      return;
    }
    const sessionId = getCookie('guest_session_id');
    const items = Object.values(cart).map((it) => ({ dishId: it.dishId, quantity: it.quantity }));
    if (items.length === 0) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId: menuData.id, tableNo, items, notes, sessionId }),
      });
      if (res.status === 401) {
        // not registered – open registration
        setRegistrationOpen(true);
        return;
      }
      if (!res.ok) throw new Error('Failed to place order');
      const data = await res.json();
      clearCart();
      setIsCartOpen(false);
      alert(`Order placed! ID: ${data.orderId}`);
    } catch (e) {
      alert('Could not place order. Please try again.');
    }
  };

  const loadOrders = async () => {
    try {
      const sessionId = getCookie('guest_session_id');
      const res = await fetch(`/api/orders?sessionId=${encodeURIComponent(sessionId)}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {}
  };

  useEffect(() => {
    if (galleryImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.min(3, galleryImages.length));
    }, 2000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollText(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategorySelect = (categoryId: number, headerHeight = 0) => {
    const filtered = dishes.filter((dish) => dish.categoryId === categoryId);
    setFilteredDishes(filtered);
    setTimeout(() => {
      const dishesContainer = document.getElementById("dishes-container");
      if (!dishesContainer) return;
      const categoryBar = document.getElementById("category-bar");
      const isSticky = categoryBar?.classList.contains("fixed");
      const totalHeaderHeight = isSticky ? headerHeight || categoryBar?.offsetHeight || 0 : 0;
      const containerRect = dishesContainer.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = containerRect.top + scrollTop;
      window.scrollTo({
        top: containerTop - totalHeaderHeight - 80,
        behavior: "smooth",
      });
    }, 150);
  };

  return (
    <div className="bg-white">
      {menuData && (
        <Navbar restaurantName={menuData.restaurantName} logo={menuData.logo} id={""} />
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
        tabs={["Overview", "Menu", "Gallery", "Updates"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Content Rendering */}
      {activeTab === "Menu" ? (
        <>
          <div ref={categoryBarRef} id="category-bar">
            <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
          </div>
          <div
            id="dishes-container"
            ref={dishesContainerRef}
            className="grid px-1 grid-cols-1 bg-white md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0"
          >
            {filteredDishes.map((dish) => {
              const qty = cart[dish.id]?.quantity || 0;
              return (
                <div key={dish.id} className="relative pb-0" data-category-id={dish.categoryId}>
                  <DishesCard
                    {...dish}
                    type={dish.type || "VEG"}
                    quantity={qty}
                    onAdd={() => addToCart(dish)}
                    onIncrement={() => increment(dish.id)}
                    onDecrement={() => decrement(dish.id)}
                  />
                  <div className="w-[calc(100%-44px)] mx-auto border-t-2 border-dotted border-gray-300 mt-1"></div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-2 text-lg text-gray-800">
          {activeTab === "Overview" && (
            <AboutUsComponent
              instagram={menuData?.instagram ?? ""}
              location={menuData?.location ?? ""}
              restaurantName={menuData?.restaurantName ?? "Loading..."}
              weekdaysWorking={menuData?.weekdaysWorking ?? ""}
              weekendWorking={menuData?.weekendWorking ?? ""}
              contactNumber={menuData?.contactNumber ?? ""}
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
      {/* Scroll Text */}
      {showScrollText && activeTab === "Menu" && (
        <div className="fixed bottom-2 transform -translate-x-1/2 flex items-center ml-40 justify-center font-semibold text-lg text-black opacity-80 animate-bounce">
          <ArrowBigDown />
          Scroll Here
        </div>
      )}
      {/* Registration Popup (open only when needed) */}
      <RegistrationPopup restaurantId={menuData?.id} open={registrationOpen} setOpen={setRegistrationOpen} />
      <BackToTop />

      {/* Cart Floating Button */}
      {totalItems > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed right-4 bottom-20 bg-black text-white rounded-full px-4 py-3 shadow-lg"
        >
          Cart ({totalItems})
        </button>
      )}

      {/* Orders Button */}
      <button
        onClick={async () => {
          await loadOrders();
          setIsOrdersOpen(true);
        }}
        className="fixed left-1/2 -translate-x-1/2 bottom-4 bg-white border text-black rounded-full px-4 py-2 shadow"
      >
        Orders
      </button>

      {/* Simple Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setIsCartOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[70vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <div className="text-lg font-semibold">Your Cart</div>
              <button onClick={() => setIsCartOpen(false)}>Close</button>
            </div>
            {Object.values(cart).length === 0 ? (
              <div className="text-gray-600">No items added.</div>
            ) : (
              <div className="space-y-3">
                {Object.values(cart).map((it) => (
                  <div key={it.dishId} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-600">₹{it.price} x {it.quantity}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="border rounded-full w-8 h-8" onClick={() => decrement(it.dishId)}>-</button>
                      <span>{it.quantity}</span>
                      <button className="border rounded-full w-8 h-8" onClick={() => increment(it.dishId)}>+</button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-black">
                  <div>Subtotal</div>
                  <div>₹{subtotal.toFixed(2)}</div>
                </div>
                <button
                  className="w-full bg-black text-white py-3 rounded-lg"
                  onClick={() => placeOrder()}
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {isOrdersOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setIsOrdersOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 max-h-[70vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <div className="text-lg font-semibold">Your Orders</div>
              <button onClick={() => setIsOrdersOpen(false)}>Close</button>
            </div>
            {orders.length === 0 ? (
              <div className="text-gray-600">No orders yet.</div>
            ) : (
              <div className="space-y-3">
                {orders.map((o: any) => (
                  <div key={o.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">#{o.id.slice(-6)} • Table {o.tableNo}</div>
                      <div className="text-sm">{o.status}</div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {o.items.map((it: any) => (
                        <div key={it.id} className="flex justify-between">
                          <span>{it.nameSnapshot} x {it.quantity}</span>
                          <span>₹{Number(it.lineTotal).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between text-black">
                      <span>Total</span>
                      <span>₹{Number(o.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 