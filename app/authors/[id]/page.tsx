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

// TODO: Fetch from API
const mockAuthor: Author | null = null;
const mockBooks: Book[] = [];

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
