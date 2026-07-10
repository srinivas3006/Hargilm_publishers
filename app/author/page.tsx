"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  DollarSign,
  Eye,
  TrendingUp,
  FileText,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";

const stats = [
  {
    label: "Published Books",
    value: "0",
    icon: BookOpen,
    trend: "Start your journey",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Total Earnings",
    value: "₹0",
    icon: DollarSign,
    trend: "Publish to earn",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Total Views",
    value: "0",
    icon: Eye,
    trend: "Grow your audience",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Avg. Rating",
    value: "-",
    icon: Star,
    trend: "No reviews yet",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Under Review":
      return "bg-amber-500/10 text-amber-600";
    case "In Editing":
      return "bg-blue-500/10 text-blue-600";
    case "Approved":
      return "bg-emerald-500/10 text-emerald-600";
    case "Published":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function AuthorDashboard() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboardData = async () => {
    if (!user?._id && !user?.id) return;
    const authorId = user._id || user.id;
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get(`/authors/${authorId}/stats`);
      const resData = data.data || data;
      setDashboardData(resData);
    } catch (err) {
      console.error("Failed to fetch author dashboard data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (error) {
    return (
      <ErrorState
        title="Could not load dashboard"
        message="We encountered an issue fetching your author dashboard data. Please try again."
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
    publishedBooks = 0,
    totalEarnings = 0,
    totalViews = 0,
    avgRating = 0,
    recentBooks = [],
    manuscripts = [],
    thisMonthEarnings = 0,
    pendingPayout = 0,
    totalWithdrawals = 0,
  } = dashboardData || {};

  const dynamicStats = [
    { ...stats[0], value: publishedBooks.toString() },
    { ...stats[1], value: `₹${totalEarnings.toLocaleString()}` },
    { ...stats[2], value: totalViews.toString() },
    { ...stats[3], value: avgRating ? avgRating.toFixed(1) : "-" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Author Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s your publishing overview
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/author/manuscripts/new">
            <FileText className="h-4 w-4" />
            Submit New Manuscript
          </Link>
        </Button>
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

      {recentBooks.length === 0 && manuscripts.length === 0 ? (
        <Card className="mt-8 border-dashed bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Publish Your First Book</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven't published any books or submitted any manuscripts yet. 
              Start your publishing journey today by submitting a new manuscript for review!
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/author/manuscripts/new">
                <FileText className="h-4 w-4" />
                Submit New Manuscript
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
      <>
        <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Books Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Book Performance</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/author/books" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBooks.map((book: any) => (
                <div
                  key={book._id || book.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <img
                    src={book.coverImage || book.cover}
                    alt={book.title}
                    className="h-16 w-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{book.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{book.sales} sales</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {book.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">
                      ₹{(book.revenue || book.sales * book.price || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manuscript Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Manuscript Status</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/author/manuscripts" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {manuscripts.map((manuscript: any) => (
                <div
                  key={manuscript._id || manuscript.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{manuscript.title}</h4>
                    <Badge className={getStatusColor(manuscript.status)}>
                      {manuscript.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{manuscript.progress || 0}%</span>
                    </div>
                    <Progress value={manuscript.progress || 0} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Submitted on {new Date(manuscript.createdAt || manuscript.submittedDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Earnings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold mt-1">₹{thisMonthEarnings.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                {thisMonthEarnings > 0 ? "Keep it up!" : "No earnings yet"}
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Pending Payout</p>
              <p className="text-2xl font-bold mt-1">₹{pendingPayout.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingPayout > 0 ? "Processing..." : "-"}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Total Withdrawn</p>
              <p className="text-2xl font-bold mt-1">₹{totalWithdrawals.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Lifetime earnings transferred
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}
