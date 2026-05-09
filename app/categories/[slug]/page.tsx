'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';
import { BookCard } from '@/components/books/book-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Book, Category } from '@/types';

const mockCategory: Category & { image: string } = {
  _id: 'c1',
  name: 'Fiction',
  slug: 'fiction',
  description: 'Explore imaginative stories and novels that transport you to other worlds. From literary classics to contemporary bestsellers, fiction offers endless possibilities for the imagination.',
  image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop',
  bookCount: 156,
  isActive: true,
};

const mockBooks: Book[] = [
  {
    _id: '1',
    title: 'The Midnight Library',
    slug: 'the-midnight-library',
    author: { _id: 'a1', name: 'Priya Sharma', email: '', bookCount: 5 },
    category: mockCategory,
    description: 'A dazzling novel about all the choices that go into a life well lived.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    price: 499,
    discountPrice: 399,
    format: 'Paperback',
    publicationStatus: 'published',
    rating: 4.5,
    totalReviews: 128,
    totalSales: 1500,
    isBestseller: true,
  },
  {
    _id: '3',
    title: 'Whispers of the Heart',
    slug: 'whispers-of-the-heart',
    author: { _id: 'a3', name: 'Anjali Nair', email: '', bookCount: 7 },
    category: mockCategory,
    description: 'A beautiful love story set in the hills of Kerala.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    price: 450,
    discountPrice: 350,
    format: 'Paperback',
    publicationStatus: 'published',
    rating: 4.8,
    totalReviews: 256,
    totalSales: 2100,
    isBestseller: true,
  },
  {
    _id: '5',
    title: 'Chronicles of the Lost Kingdom',
    slug: 'chronicles-lost-kingdom',
    author: { _id: 'a5', name: 'Arjun Reddy', email: '', bookCount: 2 },
    category: mockCategory,
    description: 'An epic fantasy adventure in a mystical world.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop',
    price: 549,
    format: 'Hardcover',
    publicationStatus: 'published',
    rating: 4.4,
    totalReviews: 112,
    totalSales: 920,
    isNewRelease: true,
  },
  {
    _id: '7',
    title: 'The Silent Echo',
    slug: 'the-silent-echo',
    author: { _id: 'a7', name: 'Meera Krishnan', email: '', bookCount: 4 },
    category: mockCategory,
    description: 'A gripping tale of mystery and redemption.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    price: 399,
    format: 'Paperback',
    publicationStatus: 'published',
    rating: 4.3,
    totalReviews: 98,
    totalSales: 720,
  },
];

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<typeof mockCategory | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategory(mockCategory);
      setBooks(mockBooks);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="h-64 bg-muted animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category not found</h1>
          <Link href="/categories">
            <button className="text-primary hover:underline">Browse Categories</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${category.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-white">Categories</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
            {category.name}
          </h1>
          <p className="text-white/80 max-w-2xl">{category.description}</p>
          <div className="flex items-center gap-2 text-white/70 mt-3">
            <BookOpen className="h-4 w-4" />
            {category.bookCount} Books
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {books.length} books in {category.name}
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="bestseller">Bestsellers</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
