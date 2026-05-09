'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { Category } from '@/types';

const mockCategories: (Category & { image: string })[] = [
  {
    _id: 'c1',
    name: 'Fiction',
    slug: 'fiction',
    description: 'Explore imaginative stories and novels that transport you to other worlds.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    bookCount: 156,
    isActive: true,
  },
  {
    _id: 'c2',
    name: 'Non-Fiction',
    slug: 'non-fiction',
    description: 'Discover real stories, biographies, and educational content.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
    bookCount: 89,
    isActive: true,
  },
  {
    _id: 'c3',
    name: 'Romance',
    slug: 'romance',
    description: 'Fall in love with heartwarming tales of romance and passion.',
    image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&h=400&fit=crop',
    bookCount: 124,
    isActive: true,
  },
  {
    _id: 'c4',
    name: 'Mystery & Thriller',
    slug: 'mystery-thriller',
    description: 'Unravel secrets and solve crimes with gripping mysteries.',
    image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=600&h=400&fit=crop',
    bookCount: 78,
    isActive: true,
  },
  {
    _id: 'c5',
    name: 'Self-Help',
    slug: 'self-help',
    description: 'Transform your life with practical advice and personal growth.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
    bookCount: 92,
    isActive: true,
  },
  {
    _id: 'c6',
    name: 'Business',
    slug: 'business',
    description: 'Learn strategies for success in business and entrepreneurship.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    bookCount: 67,
    isActive: true,
  },
  {
    _id: 'c7',
    name: 'Science & Technology',
    slug: 'science-technology',
    description: 'Explore the wonders of science and latest tech innovations.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    bookCount: 54,
    isActive: true,
  },
  {
    _id: 'c8',
    name: 'Children',
    slug: 'children',
    description: 'Delightful books for young readers and curious minds.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    bookCount: 112,
    isActive: true,
  },
  {
    _id: 'c9',
    name: 'Poetry',
    slug: 'poetry',
    description: 'Beautiful verses and poetic expressions for the soul.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
    bookCount: 45,
    isActive: true,
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<typeof mockCategories>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Browse Categories
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Explore our diverse collection of books across various genres and find your next favorite read.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/2] bg-muted rounded-lg mb-3" />
                <div className="h-5 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category._id} variants={fadeInUp}>
                <Link href={`/categories/${category.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl transition-all">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-2xl font-serif font-bold mb-2">{category.name}</h2>
                        <p className="text-sm text-white/80 line-clamp-2 mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4" />
                            {category.bookCount} Books
                          </div>
                          <span className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                            Explore <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
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
