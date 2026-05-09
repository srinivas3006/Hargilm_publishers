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

const stats = [
  {
    label: "Published Books",
    value: "5",
    icon: BookOpen,
    trend: "+1 this year",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Total Earnings",
    value: "₹1,24,500",
    icon: DollarSign,
    trend: "+15% this month",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Total Views",
    value: "45.2K",
    icon: Eye,
    trend: "+2.1K this week",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Avg. Rating",
    value: "4.6",
    icon: Star,
    trend: "Based on 892 reviews",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const recentBooks = [
  {
    id: 1,
    title: "The Art of Programming",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop",
    sales: 234,
    revenue: 46800,
    rating: 4.5,
  },
  {
    id: 2,
    title: "Business Strategy 101",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop",
    sales: 189,
    revenue: 37800,
    rating: 4.2,
  },
  {
    id: 3,
    title: "Creative Writing",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=150&fit=crop",
    sales: 156,
    revenue: 31200,
    rating: 4.8,
  },
];

const manuscripts = [
  {
    id: 1,
    title: "The Future of AI",
    status: "Under Review",
    progress: 75,
    submittedDate: "2024-01-10",
  },
  {
    id: 2,
    title: "Leadership Lessons",
    status: "In Editing",
    progress: 45,
    submittedDate: "2024-01-05",
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
        {stats.map((stat, index) => (
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
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <img
                    src={book.cover}
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
                      ₹{book.revenue.toLocaleString()}
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
              {manuscripts.map((manuscript) => (
                <div
                  key={manuscript.id}
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
                      <span className="font-medium">{manuscript.progress}%</span>
                    </div>
                    <Progress value={manuscript.progress} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Submitted on {new Date(manuscript.submittedDate).toLocaleDateString()}
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
              <p className="text-2xl font-bold mt-1">₹18,500</p>
              <div className="flex items-center gap-1 text-sm text-emerald-600 mt-1">
                <TrendingUp className="h-3.5 w-3.5" />
                +12% from last month
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Pending Payout</p>
              <p className="text-2xl font-bold mt-1">₹8,200</p>
              <p className="text-sm text-muted-foreground mt-1">
                Next payout: Jan 30
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Total Withdrawn</p>
              <p className="text-2xl font-bold mt-1">₹97,800</p>
              <p className="text-sm text-muted-foreground mt-1">
                8 withdrawals
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
