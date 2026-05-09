// User types
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'visitor' | 'reader' | 'author' | 'admin';
  profileImage?: string;
  bio?: string;
  emailVerified: boolean;
  isActive: boolean;
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  purchasedBooks?: PurchasedBook[];
  wishlist?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchasedBook {
  book: string | Book;
  purchaseDate: string;
  transactionId: string;
  amount: number;
  orderId: string;
}

// Book types
export interface Book {
  _id: string;
  title: string;
  slug: string;
  author: Author | string;
  category: Category | string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  galleryImages?: string[];
  samplePdf?: string;
  price: number;
  discountPrice?: number;
  format: 'Paperback' | 'Hardcover' | 'Ebook' | 'Audiobook';
  isbn10?: string;
  isbn13?: string;
  pages?: number;
  language?: string;
  edition?: string;
  publisher?: string;
  publishedDate?: string;
  publicationStatus: 'draft' | 'published' | 'out-of-stock';
  previewContent?: string;
  isBestseller?: boolean;
  isNewRelease?: boolean;
  isFeatured?: boolean;
  rating: number;
  totalReviews: number;
  totalSales: number;
  purchaseLinks?: {
    amazon?: string;
    flipkart?: string;
    kindle?: string;
    googlePlay?: string;
    kobo?: string;
  };
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
  slug?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  bookCount?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  bookCount: number;
  isActive: boolean;
  order?: number;
}

// Order types
export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCharge: number;
  discount?: number;
  totalAmount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  upiTransactionRef?: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'printing' | 'shipped' | 'delivered' | 'cancelled';
  trackingId?: string;
  courierService?: 'india_post' | 'speed_post' | 'dtdc' | 'bluedart' | 'delhivery' | 'xpressbees';
  trackingUrl?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  book: Book | string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
}

// Publishing types
export interface PublishRequest {
  _id: string;
  requestNumber: string;
  author: Author | string;
  bookTitle: string;
  manuscriptUrl: string;
  manuscriptOriginalName?: string;
  manuscriptFileSize?: number;
  synopsis: string;
  genre?: string;
  wordCount?: number;
  targetAudience?: string;
  manuscriptType?: 'fiction' | 'non-fiction' | 'poetry' | 'children';
  packageSelected: 'basic' | 'standard' | 'premium' | 'custom';
  packagePrice?: number;
  packageDetails?: {
    editing: boolean;
    coverDesign: boolean;
    formatting: boolean;
    isbn: boolean;
    distribution: boolean;
    marketing: boolean;
  };
  status: 'draft' | 'pending' | 'reviewing' | 'approved' | 'rejected' | 'revision_requested' | 'published';
  adminNotes?: string;
  revisionFeedback?: string;
  plagiarismScore?: number;
  copyrightChecked?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentTransactionId?: string;
  paymentDate?: string;
  contractSigned?: boolean;
  contractUrl?: string;
  contractSignedAt?: string;
  publishedBookId?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// Cart types
export interface CartItem {
  book: Book;
  quantity: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  totalOrders: number;
  totalRevenue: number;
  pendingRequests: number;
  recentOrders: Order[];
  recentUsers: User[];
  monthlySales: { _id: { month: number; year: number }; total: number; count: number }[];
}

export interface AuthorStats {
  totalBooks: number;
  totalSales: number;
  totalEarnings: number;
  pendingRoyalties: number;
  publishingRequests: number;
}
