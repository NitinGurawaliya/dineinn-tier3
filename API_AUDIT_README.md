# API Integration Audit

This document lists all backend API endpoints, their CRUD support, a short description, and whether they are integrated in the frontend.

| API Route Path | CRUD Supported | Description | Frontend Integrated? |
|---------------|:-------------:|-------------|:--------------------:|
| `/api/user` | C R U D | User management | [ ] |
| `/api/user/review` | C R U D | User reviews | [ ] |
| `/api/restaurant/announcements` | C R U D | Restaurant announcements | [ ] |
| `/api/restaurant/rating` | C R U D | Restaurant ratings | [ ] |
| `/api/restaurant/images` | C R U D | Restaurant images | [ ] |
| `/api/restaurant/details` | C R U D | Restaurant details | [ ] |
| `/api/restaurant/qrcode/scan-count/[id]` | R | QR scan count by ID | [ ] |
| `/api/restaurant/qrcode/generate-qr` | C | Generate QR code | [ ] |
| `/api/restaurant/onboarding` | C | Restaurant onboarding | [ ] |
| `/api/menu` | C R U D | Menu management | [ ] |
| `/api/menu/filter/category/[id]` | R | Filter menu by category | [ ] |
| `/api/menu/analytics/dish` | R | Dish analytics | [ ] |
| `/api/menu/analytics/dish/[id]` | R | Dish analytics by ID | [ ] |
| `/api/menu/generate/images` | C | Generate menu images | [ ] |
| `/api/menu/[id]` | R U D | Menu item by ID | [ ] |
| `/api/menu/dishes/[id]` | C R U D | Dish by ID | [ ] |
| `/api/menu/category` | C R U D | Menu categories | [ ] |
| `/api/whatsapp/send-message` | C | Send WhatsApp message | [ ] |
| `/api/whatsapp/send-bulk-message` | C | Send bulk WhatsApp messages | [ ] |

---

- **C** = Create
- **R** = Read
- **U** = Update
- **D** = Delete

**Instructions:**
- Mark the `Frontend Integrated?` column with `[x]` for each API that is connected to your frontend.
- Use this table to identify which APIs are not yet integrated and plan your work accordingly. 