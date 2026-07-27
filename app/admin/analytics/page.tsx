"use client";

import { motion } from "framer-motion";
import {
  Eye,
  ShoppingCart,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  Star,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const stats = [
  {
    label: "Total Platform Views",
    value: "245,231",
    change: "+15.5%",
    trend: "up",
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Total Platform Sales",
    value: "14,702",
    change: "+12.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Overall Conversion Rate",
    value: "3.55%",
    change: "+0.3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Active Users",
    value: "82,845",
    change: "+25.8%",
    trend: "up",
    icon: Users,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const bookPerformance = [
  {
    title: "The Art of Programming",
    views: 12500,
    sales: 234,
    revenue: "₹1,17,000",
    trend: "up",
  },
  {
    title: "Business Strategy 101",
    views: 9800,
    sales: 189,
    revenue: "₹94,500",
    trend: "up",
  },
  {
    title: "Creative Writing Masterclass",
    views: 7200,
    sales: 156,
    revenue: "₹78,000",
    trend: "up",
  },
  {
    title: "Finance for Everyone",
    views: 4500,
    sales: 78,
    revenue: "₹39,000",
    trend: "down",
  },
  {
    title: "Marketing Essentials",
    views: 2100,
    sales: 45,
    revenue: "₹22,500",
    trend: "up",
  },
];

const topRegions = [
  { name: "Maharashtra", sales: 2450, percentage: 35 },
  { name: "Delhi", sales: 1680, percentage: 24 },
  { name: "Karnataka", sales: 1120, percentage: 16 },
  { name: "Tamil Nadu", sales: 980, percentage: 14 },
  { name: "Others", sales: 790, percentage: 11 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track overall platform performance, sales, and user insights
          </p>
        </div>
        <Select defaultValue="30">
          <SelectTrigger className="w-40">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
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
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    <TrendingUp
                      className={`h-4 w-4 ${
                        stat.trend === "down" ? "rotate-180" : ""
                      }`}
                    />
                    {stat.change}
                  </div>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Top Performing Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookPerformance.map((book, index) => (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {book.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {book.sales}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">{book.revenue}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sales by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topRegions.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{region.name}</span>
                    <span className="text-muted-foreground">
                      {region.sales} sales ({region.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${region.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
