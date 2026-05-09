'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Book, Author } from '@/types';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact' | 'horizontal';
  showActions?: boolean;
}

export function BookCard({ book, variant = 'default', showActions = true }: BookCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book);
    toast.success(`"${book.title}" added to cart!`);
  };

  const authorName = typeof book.author === 'object' ? (book.author as Author).name : 'Unknown Author';
  const price = book.discountPrice || book.price;
  const hasDiscount = book.discountPrice && book.discountPrice < book.price;
  const discountPercent = hasDiscount
    ? Math.round(((book.price - book.discountPrice!) / book.price) * 100)
    : 0;

  if (variant === 'horizontal') {
    return (
      <Link href={`/books/${book.slug}`}>
        <motion.div
          whileHover={{ y: -2 }}
          className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
        >
          <div className="relative w-24 h-36 flex-shrink-0">
            <Image
              src={book.coverImage || '/images/placeholder-book.jpg'}
              alt={book.title}
              fill
              className="object-cover rounded-md"
              sizes="96px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{book.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{authorName}</p>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3 w-3',
                    i < Math.round(book.rating) ? 'fill-secondary text-secondary' : 'text-muted'
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">({book.totalReviews})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">₹{price.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{book.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/books/${book.slug}`}>
        <motion.div whileHover={{ y: -4 }} className="group">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
            <Image
              src={book.coverImage || '/images/placeholder-book.jpg'}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground">{authorName}</p>
          <p className="text-sm font-semibold text-primary mt-1">₹{price.toLocaleString()}</p>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/books/${book.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all"
      >
        {/* Cover Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={book.coverImage || '/images/placeholder-book.jpg'}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {book.isBestseller && (
              <Badge variant="default" className="bg-secondary text-secondary-foreground">
                Bestseller
              </Badge>
            )}
            {book.isNewRelease && (
              <Badge variant="default" className="bg-primary">
                New Release
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">-{discountPercent}%</Badge>
            )}
          </div>

          {/* Quick Actions */}
          {showActions && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Add to cart</span>
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
              <Button size="icon" variant="secondary" className="h-10 w-10">
                <Eye className="h-5 w-5" />
                <span className="sr-only">Quick view</span>
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{authorName}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < Math.round(book.rating) ? 'fill-secondary text-secondary' : 'text-muted'
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({book.totalReviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">₹{price.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{book.price.toLocaleString()}
                </span>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {book.format}
            </Badge>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
