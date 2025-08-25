"use client";

import { useEffect, useMemo, useState } from "react";

type OrderItem = {
  id: string;
  nameSnapshot: string;
  quantity: number;
  lineTotal: number | string;
};

type Order = {
  id: string;
  tableNo: string;
  status: "PLACED" | "ACCEPTED" | "IN_PROGRESS" | "READY" | "SERVED" | "CANCELLED";
  total: number | string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersBoard() {
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PLACED" | "ACCEPTED" | "IN_PROGRESS" | "READY" | "SERVED" | "CANCELLED"
  >("ALL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch dashboard to get restaurant id
    const init = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) return;
        const data = await res.json();
        setRestaurantId(data?.restaurant?.id || data?.restaurant?.restaurantId || null);
      } catch {}
    };
    init();
  }, []);

  const loadOrders = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const url = new URL(location.origin + "/api/orders/admin");
      url.searchParams.set("restaurantId", String(restaurantId));
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      const res = await fetch(url.toString());
      const data = await res.json();
      setOrders((data.orders || []).map((o: any) => ({ ...o, createdAt: o.createdAt || "" })));
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    const id = setInterval(loadOrders, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, statusFilter]);

  const updateStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      await loadOrders();
    } catch {}
  };

  const statuses: Order["status"][] = [
    "PLACED",
    "ACCEPTED",
    "IN_PROGRESS",
    "READY",
    "SERVED",
    "CANCELLED",
  ];

  const nextStatuses: Record<Order["status"], Order["status"][]> = {
    PLACED: ["ACCEPTED", "CANCELLED"],
    ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["READY", "CANCELLED"],
    READY: ["SERVED", "CANCELLED"],
    SERVED: [],
    CANCELLED: [],
  };

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-black">Orders</h1>
        <div className="ml-auto flex gap-2">
          <select
            className="border rounded px-2 py-1 text-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="border rounded px-3 py-1" onClick={loadOrders} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-gray-700">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((o) => (
            <div key={o.id} className="border rounded-lg p-3 bg-white">
              <div className="flex justify-between items-center">
                <div className="font-medium text-black">#{o.id.slice(-6)}</div>
                <div className="text-sm">{new Date(o.createdAt).toLocaleTimeString()}</div>
              </div>
              <div className="text-sm mt-1">Table: <span className="font-semibold">{o.tableNo}</span></div>
              <div className="text-sm mt-2 space-y-1">
                {o.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.nameSnapshot} x {it.quantity}</span>
                    <span>₹{Number(it.lineTotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t mt-2 pt-2 text-black">
                <span>Status: {o.status}</span>
                <span>Total: ₹{Number(o.total).toFixed(2)}</span>
              </div>
              {nextStatuses[o.status].length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {nextStatuses[o.status].map((ns) => (
                    <button
                      key={ns}
                      className="border rounded px-3 py-1"
                      onClick={() => updateStatus(o.id, ns)}
                    >
                      Mark {ns.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


