"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  DollarSign,
  Star,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await api.get("/books", { params: { author: user._id || user.id } });
        const fetchedBooks = data?.data || data || [];
        setBooks(Array.isArray(fetchedBooks) ? fetchedBooks : []);
      } catch (err) {
        console.error("Failed to fetch author analytics:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [user]);

  const totalSales = books.reduce((sum, book) => sum + (book.totalSales || 0), 0);
  const totalRevenue = books.reduce((sum, book) => sum + ((book.totalSales || 0) * (book.price || 0)), 0);
  const avgRating = books.length > 0
    ? books.reduce((sum, book) => sum + (book.rating || 0), 0) / books.length
    : 0;

  const stats = [
    {
      label: "Total Books",
      value: books.length.toString(),
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Sales",
      value: totalSales.toString(),
      icon: ShoppingCart,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Avg. Rating",
      value: avgRating.toFixed(1),
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  const bookPerformance = [...books].sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0));

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your book sales and reader ratings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Book Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Book Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookPerformance.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No published books yet. Performance will appear here once you have sales.
            </p>
          ) : (
            <div className="space-y-4">
              {bookPerformance.map((book, index) => (
                <motion.div
                  key={book._id || book.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium truncate flex-1">{book.title}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{(book.rating || 0).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">
                        ({book.totalReviews || 0})
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sales</p>
                      <p className="font-semibold">{book.totalSales || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold text-emerald-600">
                        ₹{((book.totalSales || 0) * (book.price || 0)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
