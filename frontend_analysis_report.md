# Frontend Project Analysis & API Report

I have conducted a deep scan of the entire frontend codebase to evaluate data integrity, user flows, and backend API integration.

## 1. Data Integrity (Mock vs Real Data)
**Status: ✅ Fully Connected (No Mock Data)**

A comprehensive search across all `.ts` and `.tsx` files for "mock", "dummy", and hardcoded static arrays confirms that the frontend team has completely removed mock implementations. 
- The only reference found was a comment `// Mock data removed` inside `app/books/[slug]/page.tsx`, proving the transition to live data is complete.
- Every major page and component relies dynamically on the Axios `api` instance (`lib/api.ts`) to fetch data from the backend.

---

## 2. Platform Navigation & User Flow Map

The frontend routing strictly follows a role-based architecture, accurately separating public access from authenticated dashboard views.

### Public Flow (Visitors)
- `/` - Home page (Fetches featured, bestseller, and new release books)
- `/books` - All books listing with filters and pagination
- `/books/[slug]` - Individual book details with related books & reviews
- `/categories` & `/categories/[slug]` - Book discovery by genre
- `/authors` & `/authors/[id]` - Author directory and profiles
- `/search` - Global search query page
- `/track-order` - Public order tracking via Order Number

### Authentication Flow
- `/(auth)/login` - Standard email/password login flow
- `/(auth)/register` - User registration

### Reader Dashboard Flow (Authenticated)
- `/dashboard` - Overview statistics and recent activity
- `/dashboard/orders` - Order history & status
- `/dashboard/library` - Digital library (purchased ebooks)
- `/dashboard/wishlist` - Saved books management
- `/dashboard/profile` - User settings and profile updates
- `/dashboard/become-author` - Application flow to upgrade role to Author

### Author Dashboard Flow (Role: Author)
- `/author` - Author analytics and quick stats
- `/author/royalties` - Earnings and payout history
- `/author/manuscripts/new` - Flow to upload documents and submit publishing requests

### Admin Dashboard Flow (Role: Admin)
- `/admin` - Platform-wide statistics and revenue
- `/admin/orders` - Order management and status updates
- `/admin/users` - User role management and banning
- `/admin/books` - Centralized catalog management (CRUD operations)
- `/admin/manuscripts` & `/admin/author-applications` - Approval pipelines

### Checkout Flow
- `/checkout/cart` - Client-side state managed via Zustand `cart-store.ts`
- `/checkout/checkout` - Secure order creation and UPI payment intent flow
- `/checkout/success` - Post-payment verification and confirmation

---

## 3. Comprehensive API Integration Inventory

The frontend is currently firing over 30 distinct API endpoints. Here is the mapped inventory based on codebase analysis:

### Authentication & Users
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Authenticates user, expects JWT token in response |
| `/auth/register` | POST | Creates new user account |
| `/users/:id` | GET | Fetches profile details |
| `/users/:id` | PUT | Updates user profile (FormData) |
| `/users/:id/stats` | GET | Dashboard overview numbers |

### Books & Catalog
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/books` | GET | Main catalog query (supports `?featured=true`, `?category=`, etc) |
| `/books/:slug` | GET | Single book detail view |
| `/books/:slug/related` | GET | Suggestions grid |
| `/books/:slug/reviews` | GET | Paginated reviews |
| `/categories` | GET | List all categories |
| `/search` | GET | Search catalog via `?q=query` |

### E-commerce (Orders & Wishlist)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/orders` | POST | Final checkout submission (matches recent backend specs) |
| `/orders/:id/verify-payment` | PUT | Validates UTR against order |
| `/orders/:id` | DELETE | Cancels pending/processing orders |
| `/users/:id/orders` | GET | Lists user's purchase history |
| `/orders/track/:orderNumber` | GET | Public tracking status |
| `/users/:id/wishlist` | GET | Fetches saved books |
| `/users/:id/wishlist/:bookId`| DELETE| Removes item from wishlist |
| `/users/:id/library` | GET | Fetches purchased digital copies |

### Authors & Publishing
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/authors` | GET | Author directory list |
| `/authors/:id/books` | GET | Books by specific author |
| `/authors/:id/stats` | GET | Author dashboard metrics |
| `/authors/:id/royalties/history`| GET | Earnings breakdown |
| `/publish-packages` | GET | Pricing tiers for publishing |
| `/uploads/document` | POST | Manuscript file upload (FormData) |
| `/publish/request` | POST | Final manuscript submission |

### Admin Operations
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/admin/stats` | GET | Platform-wide totals |
| `/admin/orders` | GET | Master order list |
| `/admin/orders/:id/status` | PUT | Update order progress |
| `/admin/users` | GET | Master user list |
| `/admin/users/:id/status` | PUT | Disable/enable users |
| `/admin/users/:id/role` | PUT | Elevate user permissions |
| `/admin/books` | GET | Master catalog view |
| `/admin/books/:id` | PUT/DELETE| Modify or remove books |
| `/admin/publish-requests` | GET | Pending manuscripts |
| `/admin/author-applications`| GET | Pending author upgrades |

> [!TIP]
> The frontend is remarkably accurate and deeply connected. The data flow strictly relies on the backend, meaning if the backend API returns correct formatting as defined above, the frontend will render perfectly without hardcoded fallbacks.
