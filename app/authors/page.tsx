'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ErrorState } from '@/components/ui/error-state';
import type { Author } from '@/types';
import api from '@/lib/api';



export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAuthors = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get('/authors');
      const items = data.data?.authors || data.data || data || [];
      setAuthors(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Failed to fetch authors:", err);
      setError(true);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
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
        ) : error ? (
          <ErrorState 
            title="Failed to load authors"
            message="We couldn't fetch the list of authors at this moment. Please try again."
            onRetry={fetchAuthors}
          />
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
