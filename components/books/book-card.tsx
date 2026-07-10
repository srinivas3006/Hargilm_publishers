"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Book, Author } from "@/types";
import { useCartStore } from "@/store/cart-store";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  variant?: "default" | "compact" | "horizontal";
  showActions?: boolean;
}

export function BookCard({
  book,
  variant = "default",
  showActions = true,
}: BookCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book);
    toast.success(`"${book.title}" added to cart!`);
  };

  const authorName =
    typeof book.author === "object"
      ? (book.author as Author)?.name || "Unknown Author"
      : book.author || "Unknown Author";
  const price = book.discountPrice || book.price;
  const hasDiscount = book.discountPrice && book.discountPrice < book.price;
  const discountPercent = hasDiscount
    ? Math.round(((book.price - book.discountPrice!) / book.price) * 100)
    : 0;

  if (variant === "horizontal") {
    return (
      <Link href={`/books/${book.slug || book._id}`}>
        <motion.div
          whileHover={{ y: -2 }}
          className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
        >
          <div className="relative w-24 h-36 flex-shrink-0">
            <Image
              src={book.coverImage || "/images/placeholder-book.jpg"}
              alt={book.title}
              fill
              className="object-cover rounded-md"
              sizes="96px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{authorName}</p>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.round(book.rating)
                      ? "fill-secondary text-secondary"
                      : "text-muted",
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({book.totalReviews})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">
                ₹{price.toLocaleString()}
              </span>
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

  if (variant === "compact") {
    return (
      <Link href={`/books/${book.slug || book._id}`}>
        <motion.div whileHover={{ y: -4 }} className="group">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
            <Image
              src={book.coverImage || "/images/placeholder-book.jpg"}
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
          <p className="text-sm font-semibold text-primary mt-1">
            ₹{price.toLocaleString()}
          </p>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/books/${book.slug || book._id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500"
      >
        {/* Cover Image */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <Image
            src={book.coverImage || "/images/placeholder-book.jpg"}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {book.isBestseller && (
              <Badge
                variant="default"
                className="bg-secondary text-secondary-foreground font-semibold shadow-lg"
              >
                ⭐ Bestseller
              </Badge>
            )}
            {book.isNewRelease && (
              <Badge
                variant="default"
                className="bg-primary font-semibold shadow-lg"
              >
                ✨ New
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="font-semibold shadow-lg">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          {showActions && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button
                size="icon"
                className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Add to cart</span>
              </Button>
              <Button
                size="icon"
                className="h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground text-primary shadow-lg transition-transform hover:scale-110"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
              <Button
                size="icon"
                className="h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground text-primary shadow-lg transition-transform hover:scale-110"
              >
                <Eye className="h-5 w-5" />
                <span className="sr-only">Quick view</span>
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 bg-gradient-to-b from-card to-card/50">
          <h3 className="font-serif font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 font-medium">
            {authorName}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(book.rating)
                    ? "fill-primary text-primary"
                    : "text-muted",
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1 font-medium">
              ({book.totalReviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                ₹{price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{book.price.toLocaleString()}
                </span>
              )}
            </div>
            <Badge variant="outline" className="text-xs font-semibold">
              {book.format}
            </Badge>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
