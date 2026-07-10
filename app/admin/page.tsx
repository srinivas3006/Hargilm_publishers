"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  ArrowRight,
  Eye,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statsConfig = [
  {
    label: "Total Books",
    id: "totalBooks",
    trend: "up",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/admin/books",
  },
  {
    label: "Total Users",
    id: "totalUsers",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/admin/users",
  },
  {
    label: "Total Orders",
    id: "totalOrders",
    trend: "up",
    icon: ShoppingBag,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/admin/orders",
  },
  {
    label: "Revenue",
    id: "totalRevenue",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/admin/analytics",
  },
];



const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-500/10 text-emerald-600";
    case "Processing":
      return "bg-amber-500/10 text-amber-600";
    case "Shipped":
      return "bg-blue-500/10 text-blue-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      // Trying to fetch stats and analytics
      const [statsRes, analyticsRes] = await Promise.all([
        api.get("/admin/stats").catch(() => ({ data: {} })),
        api.get("/admin/analytics").catch(() => ({ data: {} })),
      ]);
      const stats = statsRes.data?.data || statsRes.data;
      const analytics = analyticsRes.data?.data || analyticsRes.data;
      setDashboardData({ ...stats, ...analytics });
    } catch (err) {
      console.error("Failed to fetch admin dashboard data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <ErrorState
        title="Could not load admin dashboard"
        message="We encountered an issue fetching your dashboard data. Please try again."
        onRetry={fetchDashboardData}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  const {
    totalBooks = 0,
    totalUsers = 0,
    totalOrders = 0,
    totalRevenue = 0,
    recentOrders = [],
    pendingManuscripts = [],
    topBooks = [],
  } = dashboardData || {};

  const stats = statsConfig.map((config) => {
    let value = "0";
    if (config.id === "totalBooks") value = totalBooks.toString();
    if (config.id === "totalUsers") value = totalUsers.toString();
    if (config.id === "totalOrders") value = totalOrders.toString();
    if (config.id === "totalRevenue") value = `₹${totalRevenue.toLocaleString()}`;
    return { ...config, value, change: "+0" };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your publishing platform
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
            <Link href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id || order._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{order.orderNumber || order.id || order._id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName || order.user?.name || "Guest"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.totalAmount || order.amount || 0}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No recent orders.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Manuscripts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Manuscripts
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/manuscripts" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingManuscripts.length > 0 ? (
                pendingManuscripts.slice(0, 5).map((manuscript: any) => (
                  <div
                    key={manuscript.id || manuscript._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{manuscript.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {manuscript.authorName || manuscript.author?.name || "Unknown Author"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{manuscript.category || "Uncategorized"}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(manuscript.submittedDate || manuscript.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No pending manuscripts.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Books */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Top Performing Books</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/books" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {topBooks.length > 0 ? (
              topBooks.slice(0, 3).map((book: any, index: number) => (
                <motion.div
                  key={book.id || book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {book.sales || 0} sales
                    </span>
                  </div>
                  <h4 className="font-semibold">{book.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {book.authorName || book.author?.name || "Unknown Author"}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    {(book.views || 0).toLocaleString()} views
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-3 text-sm text-muted-foreground py-4 text-center">
                No top performing books data available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
