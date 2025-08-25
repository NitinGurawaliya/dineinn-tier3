# Table Ordering System (QR → Cart → Order → Dashboard)

This document describes the end-to-end table ordering feature: a guest scans a table QR, browses the menu, adds items to a cart, places an order (no payments), and the order appears in the dashboard with the table number. Guests can view their own order history.

## Features
- Detect table number from the QR URL and store in a cookie
- Lightweight cart on the menu page with Add/Quantity controls per dish
- Checkout creates an order with items and totals
- Orders visible on the dashboard with table number and status updates
- Guests can view their orders via the Orders button

## Data Model (Prisma)
Added in `prisma/schema.prisma`:
- `Order` with fields: `restaurantId`, `sessionId`, `customerId?`, `tableNo`, `status`, `subtotal`, `tax`, `total`, `notes?`, timestamps
- `OrderItem` with `dishId`, `nameSnapshot`, `priceSnapshot`, `quantity`, `lineTotal`
- `OrderStatus` enum: `PLACED`, `ACCEPTED`, `IN_PROGRESS`, `READY`, `SERVED`, `CANCELLED`

Run migrations:
```
npx prisma generate
npx prisma migrate dev -n add_orders
```

## API Endpoints

Guest:
- `POST /api/orders` → Create an order: `{ restaurantId, tableNo, items: [{ dishId, quantity }], notes?, sessionId? }`
- `GET /api/orders?sessionId=...` → List orders by guest session

Dashboard (auth required):
- `GET /api/orders/admin?restaurantId=...&status=...` → List orders for a restaurant
- `PATCH /api/orders/:id/status` → Update order status

## Menu Page (Client)
Files updated:
- `app/menu/[subdomain]/SubdomainMenuClient.tsx`
  - Reads `t` query param → sets `table_no` cookie
  - Ensures `guest_session_id` cookie
  - Maintains cart in state + `localStorage` per restaurant
  - Renders Cart FAB (hidden when empty) and Orders button (bottom center)
  - Checkout posts to `/api/orders`
- `components/DishesCard.tsx`
  - Adds `Add` button and `+/-` quantity controls

## Dashboard
- Use `GET /api/orders/admin` to render orders with table numbers and update statuses with `PATCH /api/orders/:id/status`
- You can add a page at `app/restaurant/dashboard/orders/page.tsx` to display this data (poll every 5s)

## QR Format
Generate QRs pointing to: `https://{subdomain}.yourdomain.com/menu/{subdomain}?t={TABLE_NO}`

On load, the menu page stores `t` into `table_no` cookie for subsequent orders.

## Testing Checklist
- Scan a QR with `?t=12` → Menu loads and sets `table_no`
- Add dishes → Cart appears with correct item count and totals
- Place order → Success message; cart clears
- Dashboard lists the new order with `tableNo=12`
- Change statuses from the dashboard → Guest’s Orders modal shows updated statuses on refresh

## Notes
- Taxes are 0 for now; adjust server-side calculation as needed
- Payments are not integrated; out of scope


