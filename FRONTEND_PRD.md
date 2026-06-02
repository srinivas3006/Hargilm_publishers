# Harglim Publishers - Frontend PRD for Backend Development

## PROJECT OVERVIEW

**Project Name:** Harglim Publishers Publishing Platform  
**Version:** 1.0  
**Tech Stack (Frontend):** Next.js 16, TypeScript, Tailwind CSS, Zustand (state management), Framer Motion (animations)  
**Platform:** Web Application (Desktop/Mobile)  
**Purpose:** A publishing platform where authors can publish books and readers can discover and purchase books

---

## USER ROLES & AUTHENTICATION

### User Roles

1. **Visitor** - Unauthenticated user
   - Can browse books, categories, authors
   - Can search books
   - Cannot purchase or add to wishlist
   - Cannot submit manuscripts

2. **Reader** - Authenticated user (customer)
   - Can browse books, categories, authors, search
   - Can purchase books
   - Can add books to wishlist
   - Can view order history
   - Can view personal library
   - Can track orders
   - Cannot publish books or submit manuscripts

3. **Author** - Authenticated author
   - Can do everything a Reader can do
   - Can submit manuscripts for publishing
   - Can view publishing request status
   - Can view book analytics and sales
   - Can view royalty payments
   - Can manage their published books

4. **Admin** - Platform administrator
   - Can do everything
   - Can manage all users
   - Can manage all books
   - Can manage orders
   - Can review and approve publishing requests
   - Can view platform-wide analytics
   - Can manage categories

### Authentication Flow

- **Login/Register:**
  - Email + Password registration
  - Email + Password login
  - Backend returns JWT token and user object
  - Frontend stores token in Zustand store with localStorage persistence
  - Token sent in `Authorization: Bearer {token}` header for all authenticated requests

---

## PAGE STRUCTURE & REQUIREMENTS

### 1. PUBLIC PAGES

#### 1.1 HOME PAGE (`/`)

- **Route:** `/`
- **Access:** Public (no auth required)
- **Data Needed:**
  - Featured books (4-6 books with `isFeatured: true`)
  - Bestseller books (4-6 books with `isBestseller: true`)
  - New release books (4-6 books with `isNewRelease: true`)
  - Testimonials (hardcoded)
  - Platform stats (500+ books, 200+ authors, 25+ countries, 15+ awards)

**API Endpoints:**

```
GET /api/books?featured=true&limit=6
GET /api/books?bestseller=true&limit=6
GET /api/books?newRelease=true&limit=6
```

#### 1.2 BOOKS PAGE (`/books`)

- **Route:** `/books`
- **Access:** Public
- **Features:**
  - List all published books
  - Pagination (12 books per page)
  - Filter by category, format, price range
  - Sort by: newest, rating, price, bestseller, sales
  - Search by title/author

**API Endpoints:**

```
GET /api/books?page=1&limit=12&category=fiction&format=Paperback&sort=newest
GET /api/books?search=keyword&page=1&limit=12
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "book_id",
      "title": "The Midnight Library",
      "slug": "the-midnight-library",
      "author": { "_id": "...", "name": "Priya Sharma", "email": "..." },
      "category": { "_id": "...", "name": "Fiction", "slug": "fiction" },
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
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 13,
    "limit": 12
  }
}
```

#### 1.3 BOOK DETAIL PAGE (`/books/[slug]`)

- **Route:** `/books/[slug]`
- **Access:** Public
- **Data Needed:**
  - Full book details
  - Related/similar books (3-4 books in same category)
  - Reviews/ratings (with pagination)
  - Author details

**API Endpoints:**

```
GET /api/books/:slug
GET /api/books/:slug/related?limit=4
GET /api/books/:slug/reviews?page=1&limit=5
```

**Features:**

- Add to cart (client-side with Zustand)
- Add to wishlist (if authenticated)
- Quick buy (add to cart + redirect to checkout)
- View sample PDF (if available)
- Share book
- View author profile

#### 1.4 CATEGORIES PAGE (`/categories`)

- **Route:** `/categories`
- **Access:** Public
- **Data Needed:**
  - All active categories with images
  - Book count per category

**API Endpoints:**

```
GET /api/categories?isActive=true&limit=100
```

#### 1.5 CATEGORY DETAIL PAGE (`/categories/[slug]`)

- **Route:** `/categories/[slug]`
- **Access:** Public
- **Features:**
  - Show all books in category (paginated)
  - Show category description
  - Filter and sort options

**API Endpoints:**

```
GET /api/categories/:slug
GET /api/books?category=:slug&page=1&limit=12
```

#### 1.6 AUTHORS PAGE (`/authors`)

- **Route:** `/authors`
- **Access:** Public
- **Data Needed:**
  - List of all authors with profiles
  - Book count per author

**API Endpoints:**

```
GET /api/authors?page=1&limit=12
```

#### 1.7 AUTHOR DETAIL PAGE (`/authors/[id]`)

- **Route:** `/authors/[id]`
- **Access:** Public
- **Data Needed:**
  - Author profile info
  - All books by author
  - Author social links

**API Endpoints:**

```
GET /api/authors/:id
GET /api/authors/:id/books?page=1&limit=12
```

#### 1.8 SEARCH PAGE (`/search`)

- **Route:** `/search`
- **Access:** Public
- **Features:**
  - Search by: title, author, keywords
  - Show matching books in grid
  - Query parameter: `?q=keyword`

**API Endpoints:**

```
GET /api/search?q=keyword&page=1&limit=12
```

#### 1.9 ABOUT PAGE (`/about`)

- **Route:** `/about`
- **Access:** Public
- **Data:** Hardcoded content (no API needed)

#### 1.10 CONTACT PAGE (`/contact`)

- **Route:** `/contact`
- **Access:** Public
- **Features:**
  - Contact form submission

**API Endpoints:**

```
POST /api/contact
Body: { name, email, subject, message }
```

#### 1.11 PUBLISH PAGE (`/publish`)

- **Route:** `/publish`
- **Access:** Public (shows publish packages)
- **Data:** Hardcoded publishing packages (no API)

---

### 2. AUTHENTICATION PAGES

#### 2.1 LOGIN PAGE (`/(auth)/login`)

- **Route:** `/(auth)/login`
- **Access:** Public (redirects to dashboard if already logged in)
- **Features:**
  - Email + Password login
  - Remember me option (localStorage)
  - Demo login button

**API Endpoints:**

```
POST /api/auth/login
Body: { email, password }
Response: { success: true, data: { user, token } }
```

#### 2.2 REGISTER PAGE (`/(auth)/register`)

- **Route:** `/(auth)/register`
- **Access:** Public (redirects to dashboard if already logged in)
- **Features:**
  - Email + Password registration
  - Name field
  - Terms acceptance
  - Optional role selection (reader/author)

**API Endpoints:**

```
POST /api/auth/register
Body: { name, email, password, role }
Response: { success: true, data: { user, token } }
```

---

### 3. CHECKOUT PAGES

#### 3.1 CART PAGE (`/checkout/cart`)

- **Route:** `/checkout/cart`
- **Access:** Public (but requires items in Zustand store)
- **State:** Zustand `useCartStore`
  - items: CartItem[]
  - addItem(book, quantity)
  - removeItem(bookId)
  - updateQuantity(bookId, quantity)
  - getSubtotal()
  - getTax() - 5% GST
  - getShipping() - Free above ₹499, else ₹40
  - getTotal()
  - clearCart()

**Features:**

- Display cart items with quantity controls
- Calculate subtotal, tax, shipping, total
- Show free shipping threshold
- Continue shopping button
- Proceed to checkout button
- Empty cart state with link to browse books

#### 3.2 CHECKOUT PAGE (`/checkout/checkout`)

- **Route:** `/checkout/checkout`
- **Access:** Requires items in cart
- **Redirect:** If no items, redirect to `/checkout/cart`
- **Form Data Needed:**
  ```ts
  {
    fullName: string,
    email: string,
    phone: string,
    addressLine1: string,
    addressLine2?: string,
    city: string,
    state: string,
    pincode: string,
    paymentMethod: 'card' | 'upi' | 'cod',
    deliveryNotes?: string
  }
  ```

**API Endpoints:**

```
POST /api/orders
Body: {
  items: [{ bookId, quantity, price }],
  subtotal: number,
  tax: number,
  shippingCharge: number,
  totalAmount: number,
  shippingAddress: Address,
  paymentMethod: 'card' | 'upi' | 'cod'
}
Headers: { Authorization: "Bearer {token}" }
Response: { success: true, data: { order, orderNumber, transactionId? } }
```

**Features:**

- Billing address form
- Shipping address form
- Payment method selection (Card, UPI, COD)
- Order summary sidebar
- Form validation
- Disable submit if validation fails

#### 3.3 CHECKOUT SUCCESS PAGE (`/checkout/success`)

- **Route:** `/checkout/success`
- **Access:** Public (shown after successful order)
- **Data:** Hardcoded thank you message
- **Buttons:**
  - View Orders → `/dashboard/orders`
  - Continue Shopping → `/books`

---

### 4. DASHBOARD PAGES (Protected - Requires Auth)

All dashboard pages require authentication and redirect to `/login` if not authenticated.

#### 4.1 DASHBOARD LAYOUT (`/dashboard/layout.tsx`)

- **Sidebar Navigation:**
  - Overview (`/dashboard`)
  - My Orders (`/dashboard/orders`)
  - Wishlist (`/dashboard/wishlist`)
  - My Library (`/dashboard/library`)
  - Payment History (`/dashboard/payments`)
  - Profile (`/dashboard/profile`)
  - Settings (`/dashboard/settings`)

#### 4.2 DASHBOARD OVERVIEW (`/dashboard`)

- **Route:** `/dashboard`
- **Access:** All authenticated users
- **Data Needed:**
  - Total Orders
  - Total Wishlist Items
  - Books Owned
  - Total Spent (amount)
  - Recent Orders (last 3)
  - Recommended Books

**API Endpoints:**

```
GET /api/users/me
GET /api/users/:id/orders?limit=3&sort=-createdAt
GET /api/users/:id/stats
GET /api/books?recommended=true&limit=3
```

#### 4.3 MY ORDERS PAGE (`/dashboard/orders`)

- **Route:** `/dashboard/orders`
- **Access:** All authenticated users
- **Data Needed:**
  - User's orders with pagination
  - Order status filters (All, Pending, Confirmed, Processing, Shipped, Delivered)
  - Order details expandable

**API Endpoints:**

```
GET /api/users/:id/orders?page=1&limit=10&status=all
GET /api/orders/:orderId (for detail)
GET /api/orders/:orderId/track (for tracking info)
```

**Order Display:**

- Order number
- Order date
- Status badge
- Total amount
- Items count
- Tracking link (if shipped)
- Cancel button (if pending/confirmed)
- Download invoice button

#### 4.4 WISHLIST PAGE (`/dashboard/wishlist`)

- **Route:** `/dashboard/wishlist`
- **Access:** Authenticated readers/authors
- **Data Needed:**
  - User's wishlist items
  - Grid and list view toggle

**API Endpoints:**

```
GET /api/users/:id/wishlist?page=1&limit=12
POST /api/users/:id/wishlist (add item)
DELETE /api/users/:id/wishlist/:bookId (remove item)
```

**Features:**

- View as grid or list
- Add to cart from wishlist
- Remove from wishlist
- Sort by date added, price
- Filter by category

#### 4.5 MY LIBRARY PAGE (`/dashboard/library`)

- **Route:** `/dashboard/library`
- **Access:** Authenticated readers/authors
- **Data Needed:**
  - User's purchased books
  - Download links for ebooks

**API Endpoints:**

```
GET /api/users/:id/library?page=1&limit=12
GET /api/users/:id/library/:bookId/download (for ebooks)
```

**Features:**

- Show purchased books
- Read/Download button (if ebook)
- Download invoice
- Leave review button

#### 4.6 PAYMENT HISTORY PAGE (`/dashboard/payments`)

- **Route:** `/dashboard/payments`
- **Access:** Authenticated users
- **Data Needed:**
  - Transaction history
  - Payment method, amount, status, date

**API Endpoints:**

```
GET /api/users/:id/transactions?page=1&limit=20
GET /api/users/:id/transactions/:transactionId/receipt
```

#### 4.7 PROFILE PAGE (`/dashboard/profile`)

- **Route:** `/dashboard/profile`
- **Access:** Authenticated users
- **Data Needed:**
  - User's profile information
  - Editable fields: name, bio, profile image, social links

**API Endpoints:**

```
GET /api/users/me
PUT /api/users/:id
Body: { name, bio, profileImage, socialLinks }
```

#### 4.8 SETTINGS PAGE (`/dashboard/settings`)

- **Route:** `/dashboard/settings`
- **Access:** Authenticated users
- **Features:**
  - Change password
  - Update email preferences
  - Delete account option

**API Endpoints:**

```
POST /api/auth/change-password
Body: { oldPassword, newPassword }

PUT /api/users/:id/preferences
Body: { emailNotifications, newsletter }

DELETE /api/users/:id
```

---

### 5. AUTHOR PAGES (Protected - Role: author)

#### 5.1 AUTHOR DASHBOARD (`/author`)

- **Route:** `/author`
- **Access:** Authenticated authors only
- **Data Needed:**
  - Author Stats: Total books, total sales, total earnings, pending royalties, publishing requests
  - Recent books with sales data
  - Recent publishing requests

**API Endpoints:**

```
GET /api/authors/:id/stats
GET /api/authors/:id/books?sort=-createdAt&limit=5
GET /api/authors/:id/publish-requests?limit=5
```

**Stats Cards:**

- Published Books count
- Total Earnings (₹)
- Total Views
- Average Rating

#### 5.2 AUTHOR BOOKS PAGE (`/author/books`)

- **Route:** `/author/books`
- **Access:** Authenticated authors only
- **Data Needed:**
  - Author's published books with sales metrics
  - Paginated list

**API Endpoints:**

```
GET /api/authors/:id/books?page=1&limit=10&sort=-sales
```

**Display:**

- Book cover, title, author
- Sales count
- Revenue (₹)
- Rating
- Edit/View button
- Analytics button

#### 5.3 AUTHOR MANUSCRIPTS PAGE (`/author/manuscripts`)

- **Route:** `/author/manuscripts`
- **Access:** Authenticated authors only
- **Data Needed:**
  - Author's publishing requests (submitted manuscripts)
  - Status filters

**API Endpoints:**

```
GET /api/authors/:id/publish-requests?page=1&limit=10
```

**Display:**

- Manuscript title
- Status badge (Draft, Pending, Reviewing, Approved, Rejected, Published)
- Progress indicator
- Submission date
- View/Edit button
- Admin feedback (if rejected)

#### 5.4 SUBMIT NEW MANUSCRIPT PAGE (`/author/manuscripts/new`)

- **Route:** `/author/manuscripts/new`
- **Access:** Authenticated authors only
- **Form Fields:**
  - Book title
  - Manuscript file upload (PDF)
  - Synopsis/Description
  - Genre/Category
  - Word count
  - Target audience
  - Manuscript type (fiction/non-fiction/poetry/children)
  - Publishing package selection (basic/standard/premium/custom)
  - Terms acceptance

**API Endpoints:**

```
POST /api/publish-requests
Body: FormData with file + metadata
Response: { success: true, data: { publishRequest, requestNumber } }

GET /api/publish-packages
Response: { success: true, data: [{ name, price, features }] }
```

#### 5.5 AUTHOR ROYALTIES PAGE (`/author/royalties`)

- **Route:** `/author/royalties`
- **Access:** Authenticated authors only
- **Data Needed:**
  - Royalty balance
  - Monthly royalty breakdown
  - Payout history

**API Endpoints:**

```
GET /api/authors/:id/royalties
GET /api/authors/:id/royalties/history?page=1&limit=12
```

#### 5.6 AUTHOR ANALYTICS PAGE (`/author/analytics`)

- **Route:** `/author/analytics`
- **Access:** Authenticated authors only
- **Data Needed:**
  - Book performance charts
  - Sales over time
  - Top performing books
  - Reader demographics

**API Endpoints:**

```
GET /api/authors/:id/analytics
GET /api/books/:id/analytics
```

---

### 6. ADMIN PAGES (Protected - Role: admin)

#### 6.1 ADMIN DASHBOARD (`/admin`)

- **Route:** `/admin`
- **Access:** Authenticated admins only
- **Data Needed:**
  - Platform Stats: Total users, books, orders, revenue
  - Pending publishing requests count
  - Recent orders
  - Recent users

**API Endpoints:**

```
GET /api/admin/stats
GET /api/admin/orders?limit=5&sort=-createdAt
GET /api/admin/users?limit=5&sort=-createdAt
GET /api/admin/publish-requests?status=pending&limit=5
```

#### 6.2 ADMIN ORDERS PAGE (`/admin/orders`)

- **Route:** `/admin/orders`
- **Access:** Authenticated admins only
- **Data Needed:**
  - All orders with filtering and sorting
  - Order status management

**API Endpoints:**

```
GET /api/admin/orders?page=1&limit=20&status=all
PUT /api/admin/orders/:id/status
Body: { status: "confirmed" | "processing" | "printed" | "shipped" | "delivered" | "cancelled" }
```

#### 6.3 ADMIN BOOKS PAGE (`/admin/books`)

- **Route:** `/admin/books`
- **Access:** Authenticated admins only
- **Data Needed:**
  - All books with CRUD operations

**API Endpoints:**

```
GET /api/admin/books?page=1&limit=20
POST /api/admin/books (create)
PUT /api/admin/books/:id (update)
DELETE /api/admin/books/:id (delete)
GET /api/admin/books/:id
```

#### 6.4 ADMIN USERS PAGE (`/admin/users`)

- **Route:** `/admin/users`
- **Access:** Authenticated admins only
- **Data Needed:**
  - All users with role/status management

**API Endpoints:**

```
GET /api/admin/users?page=1&limit=20
PUT /api/admin/users/:id
Body: { isActive, role }
GET /api/admin/users/:id
```

---

## COMPLETE API ENDPOINTS REFERENCE

### Authentication

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh-token
GET /api/auth/me
POST /api/auth/change-password
```

### Books

```
GET /api/books (list with filters, pagination)
GET /api/books/:slug (single book detail)
GET /api/books/:slug/related (related books)
GET /api/books/:slug/reviews (book reviews)
GET /api/books/:id/analytics (for authors/admins)
```

### Categories

```
GET /api/categories (list all)
GET /api/categories/:slug (single category)
```

### Authors

```
GET /api/authors (list)
GET /api/authors/:id (author profile)
GET /api/authors/:id/books (author's books)
GET /api/authors/:id/stats (for author dashboard)
GET /api/authors/:id/royalties
GET /api/authors/:id/royalties/history
GET /api/authors/:id/analytics
```

### Users

```
GET /api/users/me (current user)
GET /api/users/:id
PUT /api/users/:id (update profile)
DELETE /api/users/:id
GET /api/users/:id/orders
GET /api/users/:id/wishlist
POST /api/users/:id/wishlist
DELETE /api/users/:id/wishlist/:bookId
GET /api/users/:id/library
GET /api/users/:id/library/:bookId/download
GET /api/users/:id/transactions
GET /api/users/:id/preferences
PUT /api/users/:id/preferences
GET /api/users/:id/stats
```

### Orders

```
POST /api/orders (create order from cart)
GET /api/orders (user's orders with auth)
GET /api/orders/:id (order detail)
PUT /api/orders/:id/status (admin only)
GET /api/orders/:id/track (tracking info)
DELETE /api/orders/:id (cancel order)
GET /api/orders/:id/invoice (download invoice)
```

### Publishing Requests

```
POST /api/publish-requests (submit manuscript)
GET /api/publish-requests (for author dashboard)
GET /api/authors/:id/publish-requests
GET /api/publish-packages
GET /api/admin/publish-requests (for admin review)
PUT /api/admin/publish-requests/:id/status
Body: { status: "approved" | "rejected" | "revision_requested", adminNotes?, revisionFeedback? }
```

### Search

```
GET /api/search?q=keyword&page=1&limit=12
```

### Admin Routes (all require admin role)

```
GET /api/admin/stats
GET /api/admin/orders
GET /api/admin/users
GET /api/admin/books
PUT /api/admin/books/:id
DELETE /api/admin/books/:id
```

### Contact

```
POST /api/contact
Body: { name, email, subject, message }
```

---

## DATA MODELS & RESPONSE FORMAT

### Standard API Response Format

```json
{
  "success": boolean,
  "data": T,
  "message": string (optional),
  "error": string (optional),
  "pagination": {
    "total": number,
    "page": number,
    "pages": number,
    "limit": number
  }
}
```

### User Model

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "reader" | "author" | "admin" | "visitor",
  "profileImage": "url",
  "bio": "Author bio",
  "emailVerified": true,
  "isActive": true,
  "socialLinks": {
    "website": "url",
    "twitter": "handle",
    "linkedin": "handle",
    "instagram": "handle",
    "facebook": "handle"
  },
  "purchasedBooks": [
    { "book": "book_id", "purchaseDate": "2024-01-15", "transactionId": "txn_id", "amount": 399, "orderId": "order_id" }
  ],
  "wishlist": ["book_id_1", "book_id_2"],
  "createdAt": "2024-01-01",
  "updatedAt": "2024-01-15"
}
```

### Book Model

```json
{
  "_id": "book_id",
  "title": "The Midnight Library",
  "slug": "the-midnight-library",
  "author": { "_id": "author_id", "name": "Priya Sharma", "email": "author@email.com" },
  "category": { "_id": "cat_id", "name": "Fiction", "slug": "fiction" },
  "description": "Long description",
  "shortDescription": "Short description",
  "coverImage": "url",
  "galleryImages": ["url1", "url2"],
  "samplePdf": "url",
  "price": 499,
  "discountPrice": 399,
  "format": "Paperback" | "Hardcover" | "Ebook" | "Audiobook",
  "isbn10": "1234567890",
  "isbn13": "978-1234567890",
  "pages": 304,
  "language": "English",
  "edition": "First Edition",
  "publisher": "Harglim Publishers",
  "publishedDate": "2024-01-15",
  "publicationStatus": "published" | "draft" | "out-of-stock",
  "previewContent": "First few pages",
  "isBestseller": true,
  "isNewRelease": false,
  "isFeatured": true,
  "rating": 4.5,
  "totalReviews": 128,
  "totalSales": 1500,
  "purchaseLinks": {
    "amazon": "url",
    "flipkart": "url",
    "kindle": "url",
    "googlePlay": "url",
    "kobo": "url"
  },
  "tags": ["fiction", "bestseller"],
  "createdAt": "2024-01-15",
  "updatedAt": "2024-01-15"
}
```

### Order Model

```json
{
  "_id": "order_id",
  "orderNumber": "ORD-2024-001",
  "user": "user_id",
  "items": [
    {
      "book": "book_id",
      "quantity": 1,
      "price": 399,
      "discount": 0
    }
  ],
  "subtotal": 399,
  "tax": 19.95,
  "shippingCharge": 0,
  "discount": 0,
  "totalAmount": 418.95,
  "paymentMethod": "card" | "upi" | "netbanking" | "cod",
  "paymentStatus": "completed" | "pending" | "failed" | "refunded",
  "transactionId": "txn_123456",
  "upiTransactionRef": "ref_123456",
  "orderStatus": "pending" | "confirmed" | "processing" | "printing" | "shipped" | "delivered" | "cancelled",
  "trackingId": "TRACK123",
  "courierService": "delhivery" | "bluedart" | "dtdc",
  "trackingUrl": "url",
  "shippingAddress": {
    "fullName": "John Doe",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "9876543210",
    "email": "john@example.com"
  },
  "estimatedDelivery": "2024-01-20",
  "deliveredAt": "2024-01-19",
  "cancelledAt": null,
  "cancellationReason": null,
  "notes": "Leave at door",
  "createdAt": "2024-01-15",
  "updatedAt": "2024-01-15"
}
```

### Publishing Request Model

```json
{
  "_id": "pub_req_id",
  "requestNumber": "PUB-2024-001",
  "author": "author_id",
  "bookTitle": "My First Novel",
  "manuscriptUrl": "s3://bucket/manuscript.pdf",
  "manuscriptOriginalName": "manuscript.pdf",
  "manuscriptFileSize": 2097152,
  "synopsis": "A gripping tale...",
  "genre": "Fiction",
  "wordCount": 80000,
  "targetAudience": "Young Adults",
  "manuscriptType": "fiction" | "non-fiction" | "poetry" | "children",
  "packageSelected": "standard",
  "packagePrice": 15000,
  "packageDetails": {
    "editing": true,
    "coverDesign": true,
    "formatting": true,
    "isbn": true,
    "distribution": false,
    "marketing": false
  },
  "status": "pending" | "reviewing" | "approved" | "rejected" | "revision_requested" | "published",
  "adminNotes": "Review in progress",
  "revisionFeedback": "Please revise chapter 3",
  "plagiarismScore": 2.5,
  "copyrightChecked": true,
  "reviewedBy": "admin_id",
  "reviewedAt": "2024-01-15",
  "paymentStatus": "paid" | "pending" | "refunded",
  "paymentTransactionId": "txn_123456",
  "paymentDate": "2024-01-15",
  "contractSigned": true,
  "contractUrl": "s3://bucket/contract.pdf",
  "contractSignedAt": "2024-01-15",
  "publishedBookId": "book_id",
  "publishedAt": "2024-02-15",
  "createdAt": "2024-01-15",
  "updatedAt": "2024-01-15"
}
```

---

## USER FLOWS & WORKFLOWS

### 1. Visitor to Buyer Flow

1. Visitor explores home page
2. Browse books → Filter/Search
3. Click on book → View details
4. Add to cart (client-side)
5. Proceed to checkout → Redirect to login
6. Login/Register
7. Fill shipping address
8. Select payment method
9. Place order
10. Order success page
11. Order appears in dashboard

### 2. Author Publishing Flow

1. Author logs in
2. Go to Author Dashboard → Submit Manuscript
3. Fill manuscript form + upload file
4. Select publishing package
5. Accept terms
6. Submit
7. Receive confirmation + request number
8. Admin reviews manuscript
9. Admin approves or requests revisions
10. Author revises if needed
11. Once approved, book is published
12. Book appears on platform
13. Author can track sales/royalties

### 3. Admin Management Flow

1. Admin logs in to `/admin`
2. View platform stats
3. Manage orders (update status)
4. Manage users (activate/deactivate)
5. Review publishing requests (approve/reject)
6. Manage books (edit/delete)

### 4. Reader Dashboard Flow

1. Reader logs in
2. View orders in `/dashboard/orders`
3. Track orders
4. Download invoices
5. Manage wishlist
6. View purchased library
7. Update profile settings

---

## KEY VALIDATIONS & BUSINESS LOGIC

### Cart & Checkout

- Cart stored in Zustand (client-side)
- Shipping: Free if subtotal > ₹499, else ₹40
- Tax: 5% GST on subtotal
- Minimum order: 1 book (configurable)
- Cart persists in localStorage
- Clear cart after successful order placement

### Publishing Requests

- Only authenticated authors can submit
- Manuscript file size limit: 50MB (configurable)
- Plagiarism check: Auto-score calculation
- Package selection mandatory
- Terms must be accepted
- Admin review required before publishing

### Orders

- User must be authenticated to place order
- Order cannot be placed if cart is empty
- Payment methods: Card, UPI, COD, Netbanking
- Order status workflow: pending → confirmed → processing → printing → shipped → delivered
- Orders can be cancelled only if status is pending/confirmed
- Email confirmation sent after order placement

### Wishlist

- Only authenticated users can add to wishlist
- Each book can be added once per user
- Wishlist is per-user
- Can add/remove wishlist items independently

### Reviews & Ratings

- Only users who purchased the book can review
- Rating: 1-5 stars
- Reviews are moderated before display (optional)

---

## FRONTEND STATE MANAGEMENT

### Zustand Stores

#### 1. Auth Store (`store/auth-store.ts`)

```ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(user, token);
  logout();
  setUser(user);
  setLoading(bool);
}
```

#### 2. Cart Store (`store/cart-store.ts`)

```ts
interface CartState {
  items: CartItem[];
  addItem(book, quantity);
  removeItem(bookId);
  updateQuantity(bookId, quantity);
  clearCart();
  getTotal();
  getSubtotal();
  getTax();
  getShipping();
  itemCount();
}
```

---

## ERROR HANDLING

### Common API Errors

```json
{
  "success": false,
  "error": "Invalid email or password",
  "message": "Authentication failed"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `422` - Validation Error
- `500` - Server Error

### Client-side Error Handling

- Toast notifications for errors
- Form validation errors inline
- Redirect to login on 401
- Redirect to 404 on 404
- Retry mechanism for failed requests

---

## FRONTEND BUILD & DEPLOYMENT

- **Build Command:** `npm run build`
- **Dev Command:** `npm run dev`
- **Start Command:** `npm run start`
- **Environment Variables:** `.env.local`
  ```
  NEXT_PUBLIC_API_URL=https://api.harglim.com
  ```

---

## PERFORMANCE & SEO

- Next.js 16 App Router for file-based routing
- Server-side rendering for public pages
- Image optimization with Next.js Image component
- Metadata for SEO
- Analytics tracking (Vercel Analytics)

---

## BROWSER COMPATIBILITY

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## ACCESSIBILITY

- WCAG 2.1 AA compliant
- Keyboard navigation support
- ARIA labels and roles
- Semantic HTML
- Form labels and error messages

---

## TESTING REQUIREMENTS

### Unit Tests

- Cart store logic
- Auth store logic
- Utility functions

### Integration Tests

- Auth flow (login/register)
- Checkout flow
- Order creation

### E2E Tests

- Complete user journeys
- Admin workflows
- Author publishing flow

---

## FUTURE ENHANCEMENTS

1. Reviews & ratings system with moderation
2. Author to Author collaboration
3. Advanced analytics dashboard
4. Email marketing integration
5. Social sharing optimization
6. Mobile app (React Native)
7. Payment gateway integration (Razorpay, Stripe)
8. Refund/return management
9. Subscription model for unlimited reads
10. Recommendation engine (ML-based)

---

## CONCLUSION

This PRD provides comprehensive specifications for backend API development to fully support the Harglim Publishers frontend. All API endpoints, data models, and user flows are defined to ensure seamless integration between frontend and backend systems.

Backend development should follow these specifications exactly for optimal frontend-backend alignment.
