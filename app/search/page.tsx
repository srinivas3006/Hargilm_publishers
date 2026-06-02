"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { BookCard } from '@/components/books/book-card';
import type { Book } from '@/types';

const mockBooks: Book[] = [
  {
    _id: '1',
    title: 'The Midnight Library',
    slug: 'the-midnight-library',
    author: { _id: 'a1', name: 'Priya Sharma', email: '', bookCount: 5 },
    category: { _id: 'c1', name: 'Fiction', slug: 'fiction', bookCount: 50, isActive: true },
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
    isNewRelease: false,
    isFeatured: true,
  },
  {
    _id: '2',
    title: 'Digital Dreams',
    slug: 'digital-dreams',
    author: { _id: 'a2', name: 'Rahul Mehta', email: '', bookCount: 3 },
    category: { _id: 'c2', name: 'Technology', slug: 'technology', bookCount: 30, isActive: true },
    description: 'A thrilling journey through the world of artificial intelligence.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    price: 599,
    format: 'Hardcover',
    publicationStatus: 'published',
    rating: 4.2,
    totalReviews: 89,
    totalSales: 850,
    isNewRelease: true,
    isFeatured: true,
  },
  {
    _id: '3',
    title: 'Whispers of the Heart',
    slug: 'whispers-of-the-heart',
    author: { _id: 'a3', name: 'Anjali Nair', email: '', bookCount: 7 },
    category: { _id: 'c3', name: 'Romance', slug: 'romance', bookCount: 45, isActive: true },
    description: 'A beautiful love story set in the hills of Kerala.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    price: 450,
    discountPrice: 350,
    format: 'Paperback',
    publicationStatus: 'published',
    rating: 4.8,
    totalReviews: 256,
    totalSales: 2100,
    isFeatured: true,
  },
  {
    _id: '4',
    title: 'The Art of Mindfulness',
    slug: 'art-of-mindfulness',
    author: { _id: 'a4', name: 'Dr. Vikram Singh', email: '', bookCount: 4 },
    category: { _id: 'c4', name: 'Self-Help', slug: 'self-help', bookCount: 35, isActive: true },
    description: 'Transform your life with ancient wisdom and modern science.',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    price: 399,
    format: 'Ebook',
    publicationStatus: 'published',
    rating: 4.6,
    totalReviews: 178,
    totalSales: 1200,
    isFeatured: true,
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = useMemo(
    () =>
      mockBooks.filter((book) =>
        [book.title, book.description, (typeof book.author === 'object' ? book.author.name : '')]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Search Books</h1>
              <p className="text-muted-foreground mt-2">
                Find books by title, author, or keyword.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search for a book or author..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-6">
            {query.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-muted p-10 text-center text-muted-foreground">
                Start typing to search our catalog, or browse all books.
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-muted p-10 text-center text-muted-foreground">
                No books match "{query}". Try a different keyword.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {results.map((book) => (
                  <BookCard key={book._id} book={book} variant="compact" />
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 text-right">
            <Link href="/books">
              <span className="text-sm font-medium text-primary hover:text-primary/80">
                Browse all books
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
