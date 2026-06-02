# Backend Implementation Checklist

Use this checklist to track backend API implementation aligned with frontend requirements.

---

## PHASE 1: AUTHENTICATION & CORE SETUP

### Setup

- [ ] Initialize backend project (Node.js/Express, Python/Django, etc.)
- [ ] Setup MongoDB or PostgreSQL database
- [ ] Configure JWT token generation and verification
- [ ] Setup CORS for frontend domain
- [ ] Create `.env` file with API configurations
- [ ] Setup error handling middleware
- [ ] Setup request validation middleware
- [ ] Create standard API response format middleware

### Auth Endpoints

- [ ] `POST /api/auth/login` - Login with email & password
- [ ] `POST /api/auth/register` - Register new user
- [ ] `POST /api/auth/logout` - Logout user (clear token)
- [ ] `GET /api/auth/me` - Get current logged-in user
- [ ] `POST /api/auth/change-password` - Change password
- [ ] `POST /api/auth/refresh-token` - Refresh JWT token (optional)

### User Endpoints

- [ ] `GET /api/users/:id` - Get user profile
- [ ] `PUT /api/users/:id` - Update user profile
- [ ] `DELETE /api/users/:id` - Delete user account
- [ ] `GET /api/users/me` - Get current user (with auth)

---

## PHASE 2: BOOKS & CATEGORIES

### Book Endpoints

- [ ] `GET /api/books` - List books with filters, pagination, sorting
  - [ ] Support query params: `page`, `limit`, `category`, `format`, `sort`, `featured`, `bestseller`, `newRelease`
  - [ ] Return paginated response with `pagination` object
- [ ] `GET /api/books/:slug` - Get single book by slug (NOT by ID)
  - [ ] Return full book details with author object populated
- [ ] `GET /api/books/:slug/related` - Get related books (same category)
  - [ ] Limit parameter support
- [ ] `GET /api/books/:slug/reviews` - Get book reviews
  - [ ] Pagination support

### Category Endpoints

- [ ] `GET /api/categories` - List all active categories
- [ ] `GET /api/categories/:slug` - Get single category

### Author Endpoints

- [ ] `GET /api/authors` - List authors with pagination
- [ ] `GET /api/authors/:id` - Get author profile
- [ ] `GET /api/authors/:id/books` - Get author's published books
  - [ ] Pagination support

### Search Endpoint

- [ ] `GET /api/search` - Search books by keyword
  - [ ] Search across: title, description, author name, tags
  - [ ] Return paginated results

---

## PHASE 3: ORDERS & CHECKOUT

### Order Endpoints

- [ ] `POST /api/orders` - Create new order (requires auth)
  - [ ] Validate cart items
  - [ ] Verify prices match current book prices
  - [ ] Create order with status "pending"
  - [ ] Return order with orderNumber
- [ ] `GET /api/users/:id/orders` - Get user's orders (auth required)
  - [ ] Pagination and status filter support
- [ ] `GET /api/orders/:id` - Get order details (auth required)
- [ ] `PUT /api/orders/:id/status` - Update order status (admin only)
  - [ ] Validate status transitions
  - [ ] Send email notification on status change
- [ ] `DELETE /api/orders/:id` - Cancel order (auth required)
  - [ ] Only allow cancel if status is pending/confirmed
- [ ] `GET /api/orders/:id/track` - Get tracking information

---

## PHASE 4: WISHLIST & LIBRARY

### Wishlist Endpoints

- [ ] `GET /api/users/:id/wishlist` - Get user's wishlist (auth required)
  - [ ] Pagination support
- [ ] `POST /api/users/:id/wishlist` - Add book to wishlist (auth required)
  - [ ] Body: `{ bookId }`
- [ ] `DELETE /api/users/:id/wishlist/:bookId` - Remove from wishlist (auth required)

### Library Endpoints

- [ ] `GET /api/users/:id/library` - Get user's purchased books (auth required)
  - [ ] Pagination support
  - [ ] Show download link for ebooks
- [ ] `GET /api/users/:id/library/:bookId/download` - Download ebook (auth required)

---

## PHASE 5: DASHBOARD & USER STATS

### User Dashboard Endpoints

- [ ] `GET /api/users/:id/stats` - Get user statistics
  - [ ] Return: `{ totalOrders, totalWishlistItems, booksOwned, totalSpent }`
- [ ] `GET /api/users/:id/transactions` - Get payment history (auth required)
  - [ ] Pagination support
- [ ] `GET /api/users/:id/preferences` - Get user preferences (auth required)
- [ ] `PUT /api/users/:id/preferences` - Update preferences (auth required)

---

## PHASE 6: PUBLISHING & MANUSCRIPT SUBMISSION

### Publishing Package Endpoints

- [ ] `GET /api/publish-packages` - Get all publishing packages

### Publish Request Endpoints

- [ ] `POST /api/publish-requests` - Submit new manuscript (auth required, author only)
  - [ ] Accept multipart form data with file upload
  - [ ] Store file on S3/CDN
  - [ ] Return requestNumber in response
  - [ ] Set initial status as "draft" or "pending"
- [ ] `GET /api/authors/:id/publish-requests` - Get author's manuscripts (auth required)
  - [ ] Pagination support
- [ ] `GET /api/admin/publish-requests` - Get all manuscripts for review (admin only)
  - [ ] Status filter support (pending, reviewing, etc.)
  - [ ] Pagination

---

## PHASE 7: ADMIN DASHBOARD

### Admin Stats & Management

- [ ] `GET /api/admin/stats` - Get platform statistics
  - [ ] Return: `{ totalUsers, totalBooks, totalOrders, totalRevenue, pendingRequests }`
- [ ] `GET /api/admin/orders` - List all orders (admin only)
  - [ ] Pagination and filtering
- [ ] `GET /api/admin/users` - List all users (admin only)
  - [ ] Pagination and filtering
- [ ] `GET /api/admin/books` - List all books (admin only)
  - [ ] Pagination and CRUD operations

### Admin Book Management

- [ ] `POST /api/admin/books` - Create book (admin only)
- [ ] `PUT /api/admin/books/:id` - Update book (admin only)
- [ ] `DELETE /api/admin/books/:id` - Delete book (admin only)

### Admin User Management

- [ ] `PUT /api/admin/users/:id` - Update user role/status (admin only)

### Admin Publishing Request Review

- [ ] `PUT /api/admin/publish-requests/:id/status` - Approve/Reject manuscript (admin only)
  - [ ] Body: `{ status, adminNotes, revisionFeedback }`
  - [ ] Statuses: approved, rejected, revision_requested
  - [ ] Send email notification to author

---

## PHASE 8: AUTHOR-SPECIFIC FEATURES

### Author Stats & Royalties

- [ ] `GET /api/authors/:id/stats` - Get author statistics (auth required, author role)
  - [ ] Return: `{ totalBooks, totalSales, totalEarnings, pendingRoyalties, publishingRequests }`
- [ ] `GET /api/authors/:id/royalties` - Get royalty information
- [ ] `GET /api/authors/:id/royalties/history` - Get royalty payment history
- [ ] `GET /api/books/:id/analytics` - Get book-specific analytics (author only)

---

## PHASE 9: MISCELLANEOUS

### Contact Form

- [ ] `POST /api/contact` - Handle contact form submissions
  - [ ] Body: `{ name, email, subject, message }`
  - [ ] Send email to admin

### Email Notifications (Background Jobs)

- [ ] Send welcome email on registration
- [ ] Send order confirmation email
- [ ] Send order status update emails
- [ ] Send publishing request status emails
- [ ] Send password reset emails

---

## DATA MODELS TO CREATE

- [ ] User model with role-based access
- [ ] Book model with all fields
- [ ] Category model
- [ ] Order model with order items
- [ ] PublishRequest model
- [ ] Review/Rating model (optional)
- [ ] Transaction/Payment model
- [ ] Address model

---

## DATABASE INDEXES TO CREATE

- [ ] `books.slug` (unique)
- [ ] `books.categoryId`
- [ ] `books.isFeatured`
- [ ] `books.isBestseller`
- [ ] `books.isNewRelease`
- [ ] `users.email` (unique)
- [ ] `orders.userId`
- [ ] `orders.createdAt`
- [ ] `publishRequests.authorId`
- [ ] `publishRequests.status`

---

## VALIDATION & BUSINESS LOGIC

- [ ] Email validation and uniqueness check on registration
- [ ] Password hashing (bcrypt or similar)
- [ ] JWT token expiry (recommend 24 hours)
- [ ] Order validation (verify prices, check stock)
- [ ] Shipping calculation (free if >₹499, else ₹40)
- [ ] Tax calculation (5% GST)
- [ ] Manuscript file size limit (50MB max)
- [ ] Plagiarism check (optional, can be 3rd party service)
- [ ] Order status workflow validation

---

## ERROR HANDLING

- [ ] Return 400 for bad requests
- [ ] Return 401 for unauthorized (invalid token)
- [ ] Return 403 for forbidden (insufficient permissions)
- [ ] Return 404 for not found
- [ ] Return 409 for conflicts (duplicate email)
- [ ] Return 422 for validation errors (include field-level errors)
- [ ] Return 500 for server errors
- [ ] Include error message in all error responses

---

## SECURITY CHECKLIST

- [ ] Implement JWT authentication
- [ ] Add role-based access control (RBAC)
- [ ] Validate all inputs
- [ ] Sanitize user inputs to prevent injection
- [ ] Rate limiting (5 login attempts per minute per IP)
- [ ] CORS configuration for frontend domain
- [ ] HTTPS only in production
- [ ] Secure password storage (bcrypt)
- [ ] Refresh token rotation (optional but recommended)
- [ ] SQL injection prevention (use parameterized queries)

---

## TESTING

- [ ] Unit tests for models
- [ ] Integration tests for API endpoints
- [ ] Test authentication flow
- [ ] Test authorization (role-based access)
- [ ] Test order creation and status updates
- [ ] Test manuscript submission
- [ ] Test error scenarios

---

## DEPLOYMENT

- [ ] Setup production database
- [ ] Setup environment variables in production
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Setup logging and monitoring
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Setup database backups
- [ ] Load testing
- [ ] Performance optimization

---

## DOCUMENTATION

- [ ] Document all API endpoints with examples
- [ ] Document error codes and responses
- [ ] Document authentication flow
- [ ] Document role-based access control
- [ ] Document database schema
- [ ] Create API postman collection

---

## RECOMMENDED PRIORITY ORDER

1. **Week 1:** Phase 1 (Auth) + Phase 2 (Books/Categories)
2. **Week 2:** Phase 3 (Orders) + Phase 4 (Wishlist/Library)
3. **Week 3:** Phase 5 (Dashboard) + Phase 6 (Publishing)
4. **Week 4:** Phase 7 (Admin) + Phase 8 (Author features)
5. **Week 5:** Phase 9 (Misc) + Testing + Deployment

---

## QUICK START

### Minimal Setup for Frontend Testing (Day 1)

To get frontend working immediately with mock API, implement only:

1. `POST /api/auth/login` & `POST /api/auth/register`
2. `GET /api/books` & `GET /api/books/:slug`
3. `POST /api/orders`

This allows testing of:

- Login/Register flow
- Browse books
- Checkout flow

Then add remaining endpoints incrementally.

---

## FRONTEND ENVIRONMENT VARIABLE

Once backend is ready, frontend needs:

```env
NEXT_PUBLIC_API_URL=https://api.yourbackend.com
```

Update and redeploy frontend.

---

## NOTES FOR BACKEND TEAM

1. **Frontend is READY** - All pages and components are built and waiting for API data
2. **Mock data removed gradually** - Replace mock arrays with API calls as endpoints are completed
3. **No Breaking Changes** - Follow exact data formats specified in this document
4. **Pagination Required** - All list endpoints must support pagination
5. **Auth Required** - Include `Authorization: Bearer {token}` in requests header as shown
6. **Error Format** - Use exact error response format specified
7. **CORS Important** - Configure CORS before testing from frontend
8. **TypeScript Types** - Frontend uses TypeScript, match data types exactly

Good luck! 🚀
