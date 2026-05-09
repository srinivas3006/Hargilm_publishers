'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Author } from '@/types';

const mockAuthors: Author[] = [
  {
    _id: 'a1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    bio: 'Award-winning author known for evocative storytelling and deeply emotional narratives that touch the heart.',
    bookCount: 5,
    socialLinks: {
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    _id: 'a2',
    name: 'Rahul Mehta',
    email: 'rahul@example.com',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    bio: 'Technology enthusiast and author who brings complex tech concepts to life through compelling fiction.',
    bookCount: 3,
    socialLinks: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    _id: 'a3',
    name: 'Anjali Nair',
    email: 'anjali@example.com',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    bio: 'Bestselling romance author whose books have touched millions of hearts around the world.',
    bookCount: 7,
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
    },
  },
  {
    _id: 'a4',
    name: 'Dr. Vikram Singh',
    email: 'vikram@example.com',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    bio: 'Psychologist and wellness expert helping readers transform their lives through mindfulness.',
    bookCount: 4,
  },
  {
    _id: 'a5',
    name: 'Arjun Reddy',
    email: 'arjun@example.com',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    bio: 'Fantasy writer creating immersive worlds filled with magic, adventure, and unforgettable characters.',
    bookCount: 2,
  },
  {
    _id: 'a6',
    name: 'Sneha Kapoor',
    email: 'sneha@example.com',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    bio: 'Business strategist and entrepreneur sharing insights on building successful ventures.',
    bookCount: 6,
  },
  {
    _id: 'a7',
    name: 'Meera Krishnan',
    email: 'meera@example.com',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
    bio: 'Literary fiction author exploring themes of identity, culture, and human connection.',
    bookCount: 4,
  },
  {
    _id: 'a8',
    name: 'Karthik Iyer',
    email: 'karthik@example.com',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop',
    bio: 'Mystery and thriller writer keeping readers on the edge of their seats with every page.',
    bookCount: 8,
  },
];

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthors(mockAuthors);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Authors</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Meet the talented writers behind our amazing collection of books.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4" />
                <div className="h-5 bg-muted rounded w-24 mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No authors found matching your search.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredAuthors.map((author) => (
              <motion.div key={author._id} variants={fadeInUp}>
                <Link href={`/authors/${author._id}`}>
                  <div className="group text-center p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all">
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      <Image
                        src={author.profileImage || '/images/placeholder-avatar.jpg'}
                        alt={author.name}
                        fill
                        className="object-cover rounded-full ring-4 ring-muted group-hover:ring-primary/30 transition-all"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {author.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                      <BookOpen className="h-4 w-4" />
                      {author.bookCount} Books
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{author.bio}</p>
                    {author.socialLinks && Object.keys(author.socialLinks).length > 0 && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Social links available</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
