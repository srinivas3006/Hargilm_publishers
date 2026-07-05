"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, Star, Grid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import type { Book } from "@/types";
import toast from "react-hot-toast";

const wishlistItems = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Smith",
    price: 499,
    originalPrice: 699,
    rating: 4.5,
    reviews: 128,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
    inStock: true,
    category: "Technology",
  },
  {
    id: 2,
    title: "Business Strategy 101",
    author: "Sarah Johnson",
    price: 399,
    originalPrice: 599,
    rating: 4.2,
    reviews: 95,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop",
    inStock: true,
    category: "Business",
  },
  {
    id: 3,
    title: "Creative Writing Masterclass",
    author: "Michael Brown",
    price: 349,
    originalPrice: 449,
    rating: 4.8,
    reviews: 234,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop",
    inStock: false,
    category: "Literature",
  },
  {
    id: 4,
    title: "Finance for Beginners",
    author: "Emily Davis",
    price: 549,
    originalPrice: null,
    rating: 4.0,
    reviews: 67,
    cover: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=200&h=300&fit=crop",
    inStock: true,
    category: "Finance",
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addItem } = useCartStore();

  const removeFromWishlist = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (item: typeof wishlistItems[0]) => {
    if (!item.inStock) {
      toast.error("Item is out of stock");
      return;
    }
    const bookToAdd = {
      _id: item.id.toString(),
      title: item.title,
      author: { name: item.author },
      price: item.price,
      coverImage: item.cover,
      format: "Paperback",
    } as unknown as Book;
    addItem(bookToAdd, 1);
    toast.success("Added to cart");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {items.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-4"
          }
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {viewMode === "grid" ? (
                <Card className="overflow-hidden group">
                  <div className="relative aspect-[2/3]">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="secondary">Out of Stock</Badge>
                      </div>
                    )}
                    {item.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-destructive">
                        {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background text-destructive"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {item.category}
                    </Badge>
                    <Link href={`/books/${item.id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.author}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({item.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-lg font-bold">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      className="w-full mt-3 gap-2"
                      disabled={!item.inStock}
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex gap-4 p-4">
                    <div className="relative w-20 h-28 flex-shrink-0">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="h-full w-full object-cover rounded"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded">
                          <span className="text-xs font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            {item.category}
                          </Badge>
                          <Link href={`/books/${item.id}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.author}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({item.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="gap-2"
                          disabled={!item.inStock}
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-center">
              Save books you&apos;re interested in for later
            </p>
            <Button asChild className="mt-4">
              <Link href="/books">Browse Books</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
