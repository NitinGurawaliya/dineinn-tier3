Based on your project flow and explanation, here's a comprehensive list of APIs you need to implement for your restaurant menu system, including their purpose and a brief description:

---

### Authentication APIs
1. Signup API   # done
   - Endpoint: /api/auth/signup  
   - Method: POST  
   - Description: Allows users to create an account by providing their name, email, and password.

2. Login API   #done
   - Endpoint: /api/auth/login  
   - Method: POST  
   - Description: Authenticates a user with email and password, generates a JWT token, and sets a secure cookie.

3. Logout API  
   - Endpoint: /api/auth/logout  
   - Method: POST  
   - Description: Clears the authentication cookie to log out the user.

4. Get Authenticated User API  
   - Endpoint: /api/auth/me  
   - Method: GET  
   - Description: Retrieves the current authenticated user based on the JWT token in the cookie.

---

### Onboarding APIs
5. Add Restaurant Details API   # done
   - Endpoint: /api/restaurant  
   - Method: POST  
   - Description: Accepts restaurant details like name, logo, address, social links, and associates them with the authenticated user.

6. Edit details of restaurant 
    - Endpoint: /api/restaurant/details/edit
    - Method: PUT
    - Description: Allows to edit details of res like mobile num mail insta acc working hours location and etc.

6. Get Restaurant Details API     #done
   - Endpoint: /api/restaurant  
   - Method: GET  
   - Description: Fetches the details of the restaurant associated with the authenticated user.

---

### Menu Management APIs
7. Add Menu Category API    #done
   - Endpoint: /api/menu/category  
   - Method: POST  
   - Description: Creates a new category for dishes (e.g., starters, main course) with a name and associates it with the restaurant.

8. Get Menu Categories API     #done
   - Endpoint: /api/menu/category  
   - Method: GET  
   - Description: Retrieves all menu categories associated with the authenticated user’s restaurant.

9. Add Dishes to Category API    #done
   - Endpoint: /api/menu/dishes  
   - Method: POST  
   - Description: Adds dishes (name, price) to a specific category.

10. Fetch Menu with Dishes API  #for dashboard #done
    - Endpoint: /api/menu  
    - Method: GET  
    - Description: Retrieves the entire menu structure with categories and associated dishes for the authenticated user’s restaurant.

11. Edit Dish API  
    - Endpoint: /api/menu/dishes/:id  
    - Method: PATCH  
    - Description: Allows editing of dish details such as name, price, or tags.

12. Delete Dish API  
    - Endpoint: /api/menu/dishes/:id  
    - Method: DELETE  
    - Description: Deletes a specific dish from the menu.

13. Add more category or dishes 
    - Endpoint: /api/menu/edit/category or /dishes
    - Method: POST
    - Description: Add more dishes and category in an existing menu 

---

### AI Integration APIs   Will be done later
13. Generate Dish Image and Tags API  
    - Endpoint: /api/ai/generate  
    - Method: POST  
    - Description: Sends dish names and descriptions to an AI API to generate images and tags for each dish.

14. Preview Generated Data API  
    - Endpoint: /api/menu/preview  
    - Method: POST  
    - Description: Temporarily stores and previews dish images, names, prices, and tags before saving them to the database.

---

### Confirmation and Finalization APIs
15. Confirm and Save Menu API  
    - Endpoint: /api/menu/confirm  
    - Method: POST  
    - Description: Saves the final menu data (categories, dishes, images, and tags) to the database after user confirmation.

---

### Frontend Serving APIs    
16. Fetch Dynamic Restaurant Page Data API    #done
    - Endpoint: /api/restaurant/page  
    - Method: GET  
    - Description: Provides all necessary data (restaurant details, menu, logo, social links) to render the dynamically generated webpage.

---

### Filters and Search APIs
17. Filter Dishes by Category API    #done
    - Endpoint: /api/menu/filter/category  
    - Method: GET  
    - Description: Filters dishes based on category.

18. Filter Dishes by Price API  
    - Endpoint: /api/menu/filter/price  
    - Method: GET  
    - Description: Filters dishes within a specified price range.

19. Search Dishes by Name API  
    - Endpoint: /api/menu/search  
    - Method: GET  
    - Description: Searches for dishes by name.

---

### QR Code APIs
20. Generate QR Code API  
    - Endpoint: /api/qr/generate  
    - Method: POST  
    - Description: Generates a QR code for the dynamic restaurant webpage URL.

21. Get QR Code API  
    - Endpoint: /api/qr  
    - Method: GET  
    - Description: Fetches the generated QR code for the restaurant.

---

### Admin Tools (Optional)
22. Get All Restaurants API  
    - Endpoint: /api/admin/restaurants  
    - Method: GET  
    - Description: Fetches all restaurant details (admin-only API).

23. Delete Restaurant API  
    - Endpoint: /api/admin/restaurants/:id  
    - Method: DELETE  
    - Description: Deletes a restaurant and its associated data (admin-only API).

---

### Summary
These APIs cover the entire flow:
1. Authentication for users.  
2. Onboarding for restaurant details.  
3. Menu management with categories, dishes, AI-generated images, and tags.  
4. Filters and search for dynamic menus.  
5. QR code generation and serving.

With these APIs, you'll have a robust backend to support your Next.js app with SSR capabilities and secure JWT authentication. Let me know if you'd like code for any specific endpoint!