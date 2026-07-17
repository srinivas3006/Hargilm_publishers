export interface Book {
  _id: string;
  title: string;
  slug: string;
  author: { _id: string; name: string; email?: string } | string | any;
  category: { _id: string; name: string; slug: string } | string | any;
  description: string;
  coverImage: string;
  price: number;
  discountPrice?: number;
  format: string;
  rating?: number;
  totalReviews?: number;
  totalSales?: number;
  isBestseller?: boolean;
  isNewRelease?: boolean;
  isFeatured?: boolean;
  stock?: number;
  isbn?: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  galleryImages?: string[];
  shortDescription?: string;
  publishedDate?: string;
  isbn10?: string;
  isbn13?: string;
  edition?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Author {
  _id: string;
  name: string;
  email: string;
  role?: string;
  bio?: string;
  profileImage?: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  totalSales?: number;
  revenue?: number;
  bookCount?: number;
  socialLinks?: Record<string, string>;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  bookCount?: number;
}

export interface Review {
  _id: string;
  book: string | Book;
  user: { _id: string; name: string; profileImage?: string };
  rating: number;
  comment: string;
  isApproved?: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  user: string | any;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: any;
  createdAt: string;
}
