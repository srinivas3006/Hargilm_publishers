'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Mail, Twitter, Instagram, Linkedin, Facebook, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/books/book-card';
import type { Author, Book } from '@/types';

const mockAuthor: Author = {
  _id: 'a1',
  name: 'Priya Sharma',
  email: 'priya@example.com',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  bio: `Priya Sharma is an award-winning author known for her evocative storytelling and deeply emotional narratives that touch the heart. Born and raised in Mumbai, she discovered her love for writing at the age of ten and has never looked back.

Her debut novel "The Forgotten Path" became an instant bestseller and won the prestigious Sahitya Akademi Award. Since then, she has authored five more novels, each exploring different facets of human relationships and emotions.

When not writing, Priya enjoys traveling, reading classical literature, and spending time with her two cats. She currently lives in Pune with her family and is working on her next novel.`,
  bookCount: 5,
  socialLinks: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    website: 'https://example.com',
  },
};

const mockBooks: Book[] = [
  {
    _id: '1',
    title: 'The Midnight Library',
    slug: 'the-midnight-library',
    author: mockAuthor,
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
  },
  {
    _id: '8',
    title: 'The Forgotten Path',
    slug: 'the-forgotten-path',
    author: mockAuthor,
    category: { _id: 'c1', name: 'Fiction', slug: 'fiction', bookCount: 50, isActive: true },
    description: 'Her award-winning debut novel exploring love, loss, and second chances.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    price: 450,
    format: 'Paperback',
    publicationStatus: 'published',
    rating: 4.7,
    totalReviews: 342,
    totalSales: 3200,
    isBestseller: true,
  },
  {
    _id: '9',
    title: 'Echoes of Yesterday',
    slug: 'echoes-of-yesterday',
    author: mockAuthor,
    category: { _id: 'c1', name: 'Fiction', slug: 'fiction', bookCount: 50, isActive: true },
    description: 'A haunting tale of memories and the ties that bind us.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    price: 399,
    discountPrice: 299,
    format: 'Ebook',
    publicationStatus: 'published',
    rating: 4.4,
    totalReviews: 156,
    totalSales: 980,
  },
];

const socialIcons: Record<string, React.ElementType> = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  website: Globe,
};

export default function AuthorDetailPage() {
  const params = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthor(mockAuthor);
      setBooks(mockBooks);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-40 h-40 bg-muted rounded-full" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-muted rounded w-48" />
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Author not found</h1>
          <Link href="/authors">
            <Button>Browse Authors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/authors" className="hover:text-foreground">Authors</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{author.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8 mb-12"
        >
          <div className="flex-shrink-0">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <Image
                src={author.profileImage || '/images/placeholder-avatar.jpg'}
                alt={author.name}
                fill
                className="object-cover rounded-full ring-4 ring-muted"
              />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              {author.name}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <BookOpen className="h-5 w-5" />
                {author.bookCount} Published Books
              </div>
            </div>
            <div className="prose prose-sm max-w-none text-muted-foreground mb-6">
              {author.bio?.split('\n\n').map((para, idx) => (
                <p key={idx} className="mb-3">{para}</p>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {author.socialLinks && Object.entries(author.socialLinks).map(([platform, url]) => {
                const Icon = socialIcons[platform] || Globe;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="capitalize">{platform}</span>
                  </a>
                );
              })}
              <a
                href={`mailto:${author.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                Contact
              </a>
            </div>
          </div>
        </motion.div>

        {/* Author's Books */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Books by {author.name}
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
