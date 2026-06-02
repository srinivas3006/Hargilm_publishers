# API Integration Guide for Backend Developers

## Environment Setup

Frontend uses this environment variable:

```env
NEXT_PUBLIC_API_URL=https://api.harglim.com
```

Or for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## API Request Pattern

All API requests from frontend follow this pattern:

```ts
// lib/api.ts example
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetcher(path: string, options?: RequestInit) {
  const token = localStorage.getItem("token"); // or from auth-store

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API Error");
  }

  return res.json();
}
```

---

## CRITICAL: Authentication Header Format

**Backend must accept this format:**

```
Authorization: Bearer {jwt_token}
```

Frontend sends JWT token in Authorization header for all authenticated requests.

---

## Page-by-Page API Integration Points

### 1. HOME PAGE (`/`)

**Frontend Code Location:** `app/page.tsx`

**API Calls Needed:**

```ts
// In useEffect or getServerSideProps
const featuredBooks = await fetch("/api/books?featured=true&limit=6");
const bestsellerBooks = await fetch("/api/books?bestseller=true&limit=6");
const newReleaseBooks = await fetch("/api/books?newRelease=true&limit=6");
```

**Backend Response Expected:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Book Title",
      "slug": "book-slug",
      "author": { "_id": "...", "name": "Author Name" },
      "category": { "_id": "...", "name": "Category" },
      "description": "...",
      "coverImage": "https://...",
      "price": 499,
      "discountPrice": 399,
      "format": "Paperback",
      "rating": 4.5,
      "totalReviews": 128,
      "totalSales": 1500,
      "isBestseller": true,
      "isNewRelease": false,
      "isFeatured": true
    }
  ]
}
```

**Frontend Implementation Tip:**
Replace mock array `mockFeaturedBooks` with API call in useEffect

---

### 2. BOOKS LIST PAGE (`/books`)

**Frontend Code Location:** `app/books/page.tsx`

**API Calls Needed:**

```ts
// Query parameters from URL state
const page = searchParams.get("page") || 1;
const category = searchParams.get("category");
const format = searchParams.get("format");
const sort = searchParams.get("sort") || "newest";

const response = await fetch(
  `/api/books?page=${page}&limit=12&category=${category}&format=${format}&sort=${sort}`,
);
```

**Query Parameters Backend Should Support:**

- `page` (number, default: 1)
- `limit` (number, default: 12)
- `category` (string, optional - filter by category slug)
- `format` (string, optional - "Paperback", "Hardcover", "Ebook", "Audiobook")
- `sort` (string, default: "newest" - options: newest, rating, price, bestseller, sales)
- `priceMin` (number, optional)
- `priceMax` (number, optional)
- `search` (string, optional)

**Response Format:**

```json
{
  "success": true,
  "data": [
    /* array of books */
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 13,
    "limit": 12
  }
}
```

---

### 3. BOOK DETAIL PAGE (`/books/[slug]`)

**Frontend Code Location:** `app/books/[slug]/page.tsx`

**API Call:**

```ts
const params = useParams();
const book = await fetch(`/api/books/${params.slug}`);
const relatedBooks = await fetch(`/api/books/${params.slug}/related?limit=4`);
const reviews = await fetch(`/api/books/${params.slug}/reviews?page=1&limit=5`);
```

**Backend Implementation Notes:**

- Route: `GET /api/books/:slug` (NOT by ID, by slug)
- Should return complete book object with author object
- Related books should be same category
- Reviews should be paginated

---

### 4. LOGIN PAGE (`/(auth)/login`)

**Frontend Code Location:** `app/(auth)/login/page.tsx`

**API Call:**

```ts
const handleLogin = async (email: string, password: string) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (result.success) {
    // Store token and user in Zustand store
    useAuthStore.setState({
      user: result.data.user,
      token: result.data.token,
      isAuthenticated: true,
    });

    // Also save to localStorage for persistence
    localStorage.setItem("token", result.data.token);
  }
};
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Expected:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "reader",
      "profileImage": "url",
      "emailVerified": true,
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Critical:** Token must be a valid JWT

---

### 5. REGISTER PAGE (`/(auth)/register`)

**Frontend Code Location:** `app/(auth)/register/page.tsx`

**API Call:**

```ts
const handleRegister = async (formData: RegisterFormData) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
};
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "reader" // or "author"
}
```

**Response Expected:** Same as login (user + token)

---

### 6. CART & CHECKOUT FLOW

#### Cart Page (`/checkout/cart`)

**Frontend Code Location:** `app/checkout/cart/page.tsx`

**Important:** Cart is 100% client-side using Zustand store. NO API CALL to get cart items.

Cart data is stored in `store/cart-store.ts`:

```ts
interface CartItem {
  book: Book;
  quantity: number;
}
```

Calculations are done client-side:

- Subtotal: Sum of (price \* quantity) for each item
- Tax: 5% of subtotal
- Shipping: Free if subtotal > ₹499, else ₹40
- Total: Subtotal + Tax + Shipping

#### Checkout Page (`/checkout/checkout`)

**Frontend Code Location:** `app/checkout/checkout/page.tsx`

**API Call (Order Creation):**

```ts
const handleSubmit = async (formData: CheckoutFormData) => {
  const cartItems = useCartStore((state) => state.items);

  const orderPayload = {
    items: cartItems.map((item) => ({
      bookId: item.book._id,
      quantity: item.quantity,
      price: item.book.discountPrice || item.book.price,
    })),
    subtotal: useCartStore((state) => state.getSubtotal()),
    tax: useCartStore((state) => state.getTax()),
    shippingCharge: useCartStore((state) => state.getShipping()),
    totalAmount: useCartStore((state) => state.getTotal()),
    shippingAddress: formData.shippingAddress,
    paymentMethod: formData.paymentMethod,
  };

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });
};
```

**Request Body:**

```json
{
  "items": [
    {
      "bookId": "book_id",
      "quantity": 1,
      "price": 399
    }
  ],
  "subtotal": 399,
  "tax": 19.95,
  "shippingCharge": 0,
  "totalAmount": 418.95,
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "card" // or "upi", "cod", "netbanking"
}
```

**Response Expected:**

```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderNumber": "ORD-2024-001",
    "user": "user_id",
    "items": [
      /* order items */
    ],
    "subtotal": 399,
    "tax": 19.95,
    "shippingCharge": 0,
    "totalAmount": 418.95,
    "paymentMethod": "card",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "shippingAddress": {
      /* address */
    },
    "createdAt": "2024-01-15",
    "updatedAt": "2024-01-15"
  }
}
```

**After Success:**

```ts
// Clear cart in Zustand
useCartStore.setState({ items: [] });

// Redirect to success page
router.push("/checkout/success");
```

---

### 7. DASHBOARD PAGES

#### Dashboard Overview (`/dashboard`)

**Frontend Code Location:** `app/dashboard/page.tsx`

**API Calls:**

```ts
// Must be authenticated (includes auth token)
const user = await fetch("/api/users/me", {
  headers: { Authorization: `Bearer ${token}` },
});

const stats = await fetch("/api/users/:id/stats", {
  headers: { Authorization: `Bearer ${token}` },
});

const recentOrders = await fetch(
  "/api/users/:id/orders?limit=3&sort=-createdAt",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

**Response for User Stats:**

```json
{
  "success": true,
  "data": {
    "totalOrders": 12,
    "totalWishlistItems": 8,
    "booksOwned": 24,
    "totalSpent": 4560
  }
}
```

---

#### My Orders (`/dashboard/orders`)

**Frontend Code Location:** `app/dashboard/orders/page.tsx`

**API Call:**

```ts
// With pagination and optional status filter
const orders = await fetch(`/api/users/:id/orders?page=1&limit=10&status=all`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional: "all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled")
- `sort` (string, optional: "-createdAt" for newest first)

**Response:**

```json
{
  "success": true,
  "data": [
    /* array of orders */
  ],
  "pagination": { "total": 12, "page": 1, "pages": 2, "limit": 10 }
}
```

---

#### Wishlist (`/dashboard/wishlist`)

**Frontend Code Location:** `app/dashboard/wishlist/page.tsx`

**API Calls:**

```ts
// Get wishlist
const wishlist = await fetch("/api/users/:id/wishlist?page=1&limit=12", {
  headers: { Authorization: `Bearer ${token}` },
});

// Add to wishlist
const addToWishlist = await fetch("/api/users/:id/wishlist", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({ bookId: "book_id" }),
});

// Remove from wishlist
const removeFromWishlist = await fetch(`/api/users/:id/wishlist/:bookId`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
});
```

---

#### Profile (`/dashboard/profile`)

**Frontend Code Location:** `app/dashboard/profile/page.tsx`

**API Calls:**

```ts
// Get profile
const profile = await fetch('/api/users/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Update profile
const updateProfile = await fetch('/api/users/:id', {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    name: 'Updated Name',
    bio: 'Updated bio',
    profileImage: 'image_url',
    socialLinks: { twitter: 'handle', ... }
  })
});
```

---

### 8. AUTHOR PAGES

#### Author Dashboard (`/author`)

**Frontend Code Location:** `app/author/page.tsx`

**API Calls:**

```ts
// Requires author role
const stats = await fetch("/api/authors/:id/stats", {
  headers: { Authorization: `Bearer ${token}` },
});

const books = await fetch("/api/authors/:id/books?sort=-createdAt&limit=5", {
  headers: { Authorization: `Bearer ${token}` },
});

const publishRequests = await fetch(
  "/api/authors/:id/publish-requests?limit=5",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

**Response for Author Stats:**

```json
{
  "success": true,
  "data": {
    "totalBooks": 5,
    "totalSales": 1500,
    "totalEarnings": 125000,
    "pendingRoyalties": 25000,
    "publishingRequests": 2
  }
}
```

---

#### Submit Manuscript (`/author/manuscripts/new`)

**Frontend Code Location:** `app/author/manuscripts/new/page.tsx`

**API Calls:**

```ts
// First, get publishing packages
const packages = await fetch("/api/publish-packages");

// Then, submit manuscript (multipart form data)
const formData = new FormData();
formData.append("file", manuscriptFile);
formData.append("bookTitle", "My Novel");
formData.append("synopsis", "...");
formData.append("genre", "fiction");
formData.append("wordCount", 80000);
formData.append("targetAudience", "young adults");
formData.append("manuscriptType", "fiction");
formData.append("packageSelected", "standard");

const response = await fetch("/api/publish-requests", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "pub_req_id",
    "requestNumber": "PUB-2024-001",
    "status": "pending",
    "createdAt": "2024-01-15"
  }
}
```

---

### 9. ADMIN PAGES

#### Admin Dashboard (`/admin`)

**Frontend Code Location:** `app/admin/page.tsx`

**API Calls:** (All require admin role)

```ts
const stats = await fetch("/api/admin/stats", {
  headers: { Authorization: `Bearer ${token}` },
});

const orders = await fetch("/api/admin/orders?limit=5&sort=-createdAt", {
  headers: { Authorization: `Bearer ${token}` },
});

const publishRequests = await fetch(
  "/api/admin/publish-requests?status=pending&limit=5",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

---

#### Admin Orders (`/admin/orders`)

**Frontend Code Location:** `app/admin/orders/page.tsx`

**API Call to Update Order Status:**

```ts
const updateOrderStatus = await fetch(`/api/admin/orders/:orderId/status`, {
  method: "PUT",
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({ status: "shipped" }),
});
```

**Allowed Status Values:**

- "pending"
- "confirmed"
- "processing"
- "printing"
- "shipped"
- "delivered"
- "cancelled"

---

## CORS & Security

**Frontend is running on:** `http://localhost:3000` (dev) or `https://harglim.com` (prod)

**Backend should allow CORS from:**

- `http://localhost:3000` (dev)
- `https://harglim.com` (prod)
- `https://www.harglim.com` (prod)

---

## Error Response Format

Frontend expects errors in this format:

```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

If error occurs, frontend shows:

- Toast notification with error message
- Form field validation errors (422 status)
- Redirect to login if 401
- Generic error if 500

---

## Token Management

**Frontend Implementation:**

```ts
// Save token after login
localStorage.setItem('token', response.data.token);

// Include token in all authenticated requests
const token = localStorage.getItem('token');
headers: { 'Authorization': `Bearer ${token}` }

// Clear token on logout
localStorage.removeItem('token');
```

**Backend should:**

- Verify JWT token signature
- Check token expiry
- Return 401 if token is invalid/expired
- Support refresh token endpoint (optional but recommended)

---

## Rate Limiting Recommendations

To prevent abuse, backend should implement:

- Login attempts: 5 per minute per IP
- API calls: 100 per minute per user
- File upload: 50MB max, 10 files per day per user

---

## Search Implementation

**Frontend Search Page:** `app/search/page.tsx`

**API Endpoint:**

```
GET /api/search?q=keyword&page=1&limit=12
```

**Backend should search across:**

- Book titles
- Book descriptions
- Author names
- Category names
- Book tags

**Response:** Same as `/api/books` list format with pagination

---

## Tracking & Analytics

Frontend sends tracking info to `/api/analytics` (optional):

```ts
// Page views, user actions, etc.
fetch("/api/analytics", {
  method: "POST",
  body: JSON.stringify({
    event: "page_view",
    page: "/books",
    userId: "user_id",
    timestamp: new Date(),
  }),
});
```

---

## File Upload Handling

**For Manuscript Upload:**

- Backend should accept `multipart/form-data`
- Store file on S3 or similar CDN
- Return file URL in response
- Limit: 50MB per file
- Allowed formats: PDF

---

## Email Notifications (Optional but Recommended)

Backend should send emails to users on these events:

1. Account registration → Verification email
2. Order confirmation → Order details + order number
3. Order shipped → Tracking link
4. Order delivered → Delivery confirmation
5. Publishing request status change → Status update email
6. Royalty payout → Payment details

---

## Database Indexing

For performance, backend should add indexes on:

- `books.slug` (unique)
- `books.categoryId`
- `books.isFeatured`
- `books.isBestseller`
- `users.email` (unique)
- `orders.userId`
- `orders.createdAt`
- `publishRequests.authorId`
- `publishRequests.status`

---

## Summary

Frontend is ready for API integration. Backend should:

1. ✅ Follow endpoint specifications exactly
2. ✅ Return data in exact format specified
3. ✅ Implement JWT authentication
4. ✅ Support CORS from frontend domain
5. ✅ Use proper HTTP status codes
6. ✅ Include pagination in list responses
7. ✅ Validate input and return 422 for validation errors
8. ✅ Add role-based access control for admin/author endpoints

Once backend is live, update `NEXT_PUBLIC_API_URL` in `.env.local` and all frontend pages will automatically work.
