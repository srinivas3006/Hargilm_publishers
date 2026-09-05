"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Users,
  BookOpen,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>({
    totalSales: 0,
    totalRevenue: 0,
    activeUsers: 0,
    totalBooks: 0,
    topBooks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [ordersRes, booksRes, usersRes] = await Promise.allSettled([
          api.get("/admin/orders"),
          api.get("/books?limit=100"),
          api.get("/admin/users")
        ]);

        const ordersList = ordersRes.status === "fulfilled" ? (ordersRes.value.data?.data || ordersRes.value.data || []) : [];
        const booksList = booksRes.status === "fulfilled" ? (booksRes.value.data?.data?.books || booksRes.value.data?.data || booksRes.value.data || []) : [];
        const usersList = usersRes.status === "fulfilled" ? (usersRes.value.data?.data || usersRes.value.data || []) : [];

        const ordersArr = Array.isArray(ordersList) ? ordersList : [];
        const booksArr = Array.isArray(booksList) ? booksList : [];
        const usersArr = Array.isArray(usersList) ? usersList : [];

        const totalSales = ordersArr.length;
        const totalRevenue = ordersArr
          .filter((o: any) => o.status?.toUpperCase() !== "CANCELLED")
          .reduce((sum: number, o: any) => sum + (o.totalPrice ?? o.totalAmount ?? o.amount ?? (o.subtotal ? o.subtotal + (o.tax || 0) + (o.shippingPrice || 50) : 0)), 0);

        const topBooks = [...booksArr]
          .sort((a: any, b: any) => (b.totalSales || 0) - (a.totalSales || 0))
          .slice(0, 5);

        setData({
          totalSales,
          totalRevenue,
          activeUsers: usersArr.length,
          totalBooks: booksArr.length,
          topBooks,
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const dynamicStats = [
    {
      label: "Total Platform Sales",
      value: data.totalSales.toString(),
      icon: ShoppingCart,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Total Platform Revenue",
      value: `₹${data.totalRevenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Platform Users",
      value: data.activeUsers.toString(),
      icon: Users,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Published Books",
      value: data.totalBooks.toString(),
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

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
        <h1 className="text-2xl font-bold lg:text-3xl">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track overall platform sales, revenue, and catalog performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dynamicStats.map((stat, index) => (
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

      {/* Top Performing Books */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Top Performing Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.topBooks.length > 0 ? (
            <div className="space-y-4">
              {data.topBooks.map((book: any, index: number) => (
                <motion.div
                  key={book._id || book.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {book.totalSales || 0} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">
                      ₹{((book.price || 0) * (book.totalSales || 0)).toLocaleString("en-IN")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No book sales recorded yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
