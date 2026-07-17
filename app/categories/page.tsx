'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { Category } from '@/types';
import api from '@/lib/api';
export default function CategoriesPage() {
  const [categories, setCategories] = useState<(Category & { image: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(false);
        const { data } = await api.get('/categories');
        const items = data.data?.categories || data.data || data || [];
        setCategories(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError(true);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
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
        ) : error ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">Oops!</h2>
            <p className="text-muted-foreground">Failed to load categories. Please try again later.</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">No Categories Found</h2>
            <p className="text-muted-foreground">We couldn't find any categories at the moment.</p>
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
                <Link href={`/categories/${category.slug || category._id}`}>
                  <div className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-xl transition-all">
                    <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                      <Image
                        src={category.image || '/images/placeholder-category.jpg'}
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
                            {category.bookCount || 0} Books
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
