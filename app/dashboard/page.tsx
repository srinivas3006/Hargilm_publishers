"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  BookOpen,
  TrendingUp,
  Package,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { useState, useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import api from "@/lib/api";

const stats = [
  {
    label: "Total Orders",
    value: "12",
    icon: ShoppingBag,
    trend: "+2 this month",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Wishlist Items",
    value: "8",
    icon: Heart,
    trend: "3 on sale",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    label: "Books Owned",
    value: "24",
    icon: BookOpen,
    trend: "+5 this year",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Total Spent",
    value: "₹4,560",
    icon: TrendingUp,
    trend: "Avg ₹380/order",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const recentOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    items: 2,
    total: 599,
    status: "Delivered",
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    items: 1,
    total: 299,
    status: "In Transit",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    items: 3,
    total: 897,
    status: "Processing",
  },
];

const recommendedBooks = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Smith",
    price: 499,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Business Strategy 101",
    author: "Sarah Johnson",
    price: 399,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Creative Writing",
    author: "Michael Brown",
    price: 349,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-500/10 text-emerald-600";
    case "In Transit":
      return "bg-blue-500/10 text-blue-600";
    case "Processing":
      return "bg-amber-500/10 text-amber-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dynamicStats, setDynamicStats] = useState(stats);
  const [dynamicOrders, setDynamicOrders] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    setLoading(true);
    setError(false);
    try {
      const [statsRes, ordersRes, recsRes] = await Promise.all([
        api.get(`/users/${userId}/stats`),
        api.get(`/users/${userId}/orders?limit=3&sort=-createdAt`),
        api.get(`/books?limit=3`)
      ]);
      
      const statsData = statsRes.data?.data || statsRes.data;
      if (statsData) {
        setDynamicStats([
          { ...stats[0], value: statsData.totalOrders?.toString() || "0" },
          { ...stats[1], value: statsData.totalWishlistItems?.toString() || "0" },
          { ...stats[2], value: statsData.booksOwned?.toString() || "0" },
          { ...stats[3], value: `₹${statsData.totalSpent?.toLocaleString() || "0"}` },
        ]);
      }
      
      const ordersData = ordersRes.data?.data || ordersRes.data;
      if (ordersData) {
        setDynamicOrders(Array.isArray(ordersData) ? ordersData : []);
      }

      const recsData = recsRes.data?.data?.books || recsRes.data?.data || recsRes.data;
      if (recsData) {
        setRecs(Array.isArray(recsData) ? recsData : []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (error) {
    return (
      <div className="space-y-8">
        <ErrorState 
          title="Unable to load dashboard"
          message="We couldn't fetch your account details. Please try again."
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] || "Reader"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your account
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
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <div className="mt-4">
                  <p className="font-medium">{stat.label}</p>
                  <p className="text-sm text-muted-foreground">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dynamicOrders.map((order: any) => (
                <div
                  key={order.id || order._id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{order.orderNumber || order.id}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.totalAmount || order.total}</p>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(order.orderStatus || order.status)}
                    >
                      {order.orderStatus || order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Books */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recommended for You</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/books" className="gap-1">
                Browse All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recs.length > 0 ? (
                recs.map((book) => (
                  <Link
                    key={book._id || book.id}
                    href={`/books/${book.slug || book.id}`}
                    className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <img
                      src={book.coverImage || book.cover}
                      alt={book.title}
                      className="h-16 w-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{book.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {typeof book.author === 'object' ? book.author?.name : book.author}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">₹{book.discountPrice || book.price}</p>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recommendations yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
