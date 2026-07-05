'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  BookOpen,
  Calendar,
  FileText,
  Globe,
  Truck,
  Shield,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookCard } from '@/components/books/book-card';
import { useCartStore } from '@/store/cart-store';
import type { Book, Author } from '@/types';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

// Mock data removed

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        const [bookRes, relatedRes, reviewsRes] = await Promise.all([
          api.get(`/books/${params.slug}`),
          api.get(`/books/${params.slug}/related?limit=4`),
          api.get(`/books/${params.slug}/reviews?page=1&limit=5`)
        ]);
        
        if (bookRes.data.status === 'success') {
          setBook(bookRes.data.data as Book);
        } else {
          setBook(null);
        }
        
        if (relatedRes.data.status === 'success') {
          setRelatedBooks(relatedRes.data.data || []);
        }
        
        if (reviewsRes.data.status === 'success') {
          setReviews(reviewsRes.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch book data", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <div className="aspect-[2/3] bg-muted rounded-lg" />
              </div>
              <div className="lg:w-2/3 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Book not found</h1>
          <Link href="/books">
            <Button>Browse Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  const author = book.author as Author;
  const category = typeof book.category === 'object' ? book.category : null;
  const price = book.discountPrice || book.price;
  const hasDiscount = book.discountPrice && book.discountPrice < book.price;
  const discountPercent = hasDiscount
    ? Math.round(((book.price - book.discountPrice!) / book.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(book, quantity);
    toast.success(`Added ${quantity} ${quantity > 1 ? 'copies' : 'copy'} to cart!`);
  };

  const handleBuyNow = () => {
    addItem(book, quantity);
    window.location.href = '/checkout/cart';
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/books" className="hover:text-foreground">Books</Link>
            <ChevronRight className="h-4 w-4" />
            {category && (
              <>
                <Link href={`/categories/${category.slug}`} className="hover:text-foreground">
                  {category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground truncate">{book.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-2/5"
          >
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-4 shadow-lg">
                <Image
                  src={book.galleryImages?.[selectedImage] || book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
                {book.isBestseller && (
                  <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                    Bestseller
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge variant="destructive" className="absolute top-4 right-4">
                    -{discountPercent}% OFF
                  </Badge>
                )}
              </div>
              {book.galleryImages && book.galleryImages.length > 1 && (
                <div className="flex gap-2">
                  {book.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        'relative w-20 h-28 rounded-md overflow-hidden border-2 transition-colors',
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      )}
                    >
                      <Image src={img} alt={`${book.title} - ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-3/5"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              {book.title}
            </h1>

            <Link
              href={`/authors/${author._id}`}
              className="text-lg text-primary hover:underline mb-4 inline-block"
            >
              by {author.name}
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < Math.round(book.rating)
                        ? 'fill-secondary text-secondary'
                        : 'text-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{book.rating}</span>
              <span className="text-muted-foreground">({book.totalReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">₹{price.toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{book.price.toLocaleString()}
                  </span>
                  <Badge variant="destructive">Save ₹{(book.price - price).toLocaleString()}</Badge>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground mb-6">{book.shortDescription}</p>

            {/* Book Info */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Format</p>
                  <p className="font-medium">{book.format}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pages</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-medium">{book.language}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="font-medium">
                    {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="secondary" className="flex-1" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                Free shipping on ₹499+
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                Secure payment
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({book.totalReviews})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {book.description.split('\n\n').map((para, idx) => (
                    <p key={idx} className="mb-4">{para}</p>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'ISBN-10', value: book.isbn10 },
                    { label: 'ISBN-13', value: book.isbn13 },
                    { label: 'Publisher', value: book.publisher },
                    { label: 'Edition', value: book.edition },
                    { label: 'Pages', value: book.pages },
                    { label: 'Language', value: book.language },
                  ].map(
                    (item) =>
                      item.value && (
                        <div key={item.label}>
                          <dt className="text-sm text-muted-foreground">{item.label}</dt>
                          <dd className="font-medium">{item.value}</dd>
                        </div>
                      )
                  )}
                </dl>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-4 w-4',
                                  i < review.rating
                                    ? 'fill-secondary text-secondary'
                                    : 'text-muted'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <button className="text-sm text-primary mt-2">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Related Books */}
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relatedBook) => (
              <BookCard key={relatedBook._id} book={relatedBook} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
