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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    label: "Total Views",
    value: "45,231",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Total Sales",
    value: "702",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Conversion Rate",
    value: "1.55%",
    change: "-0.3%",
    trend: "down",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Unique Visitors",
    value: "12,845",
    change: "+15.8%",
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
    conversion: 1.87,
    rating: 4.5,
    trend: "up",
  },
  {
    title: "Business Strategy 101",
    views: 9800,
    sales: 189,
    conversion: 1.93,
    rating: 4.2,
    trend: "up",
  },
  {
    title: "Creative Writing Masterclass",
    views: 7200,
    sales: 156,
    conversion: 2.17,
    rating: 4.8,
    trend: "up",
  },
  {
    title: "Finance for Everyone",
    views: 4500,
    sales: 78,
    conversion: 1.73,
    rating: 4.0,
    trend: "down",
  },
  {
    title: "Marketing Essentials",
    views: 2100,
    sales: 45,
    conversion: 2.14,
    rating: 4.3,
    trend: "up",
  },
];

const topRegions = [
  { name: "Maharashtra", sales: 245, percentage: 35 },
  { name: "Delhi", sales: 168, percentage: 24 },
  { name: "Karnataka", sales: 112, percentage: 16 },
  { name: "Tamil Nadu", sales: 98, percentage: 14 },
  { name: "Others", sales: 79, percentage: 11 },
];

const readerDemographics = [
  { age: "18-24", percentage: 22 },
  { age: "25-34", percentage: 38 },
  { age: "35-44", percentage: 25 },
  { age: "45-54", percentage: 10 },
  { age: "55+", percentage: 5 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your book performance and reader insights
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
        {/* Book Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Book Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookPerformance.map((book, index) => (
                <motion.div
                  key={book.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium truncate flex-1">{book.title}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Views</p>
                      <p className="font-semibold">
                        {book.views.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sales</p>
                      <p className="font-semibold">{book.sales}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conv. Rate</p>
                      <p className="font-semibold text-emerald-600">
                        {book.conversion}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Regions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRegions.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{region.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {region.sales} sales ({region.percentage}%)
                    </span>
                  </div>
                  <Progress value={region.percentage} className="h-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reader Demographics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Reader Age Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {readerDemographics.map((demo, index) => (
                <motion.div
                  key={demo.age}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{demo.age} years</span>
                    <span className="text-sm font-semibold">{demo.percentage}%</span>
                  </div>
                  <Progress value={demo.percentage} className="h-3" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-500/10 p-4">
                <p className="font-medium text-emerald-700">Top Performer</p>
                <p className="text-sm text-muted-foreground mt-1">
                  &quot;Creative Writing Masterclass&quot; has the highest conversion
                  rate at 2.17%
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-4">
                <p className="font-medium text-blue-700">Growing Audience</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your reader base has grown 15.8% in the last 30 days
                </p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-4">
                <p className="font-medium text-amber-700">Peak Hours</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Most purchases happen between 7 PM - 10 PM IST
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4">
                <p className="font-medium text-primary">Popular Category</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Technology books account for 42% of your total sales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
