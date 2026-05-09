"use client";

import Link from "next/link";
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

const stats = [
  {
    label: "Total Books",
    value: "1,245",
    change: "+12",
    trend: "up",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/admin/books",
  },
  {
    label: "Total Users",
    value: "8,432",
    change: "+156",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/admin/users",
  },
  {
    label: "Total Orders",
    value: "3,892",
    change: "+89",
    trend: "up",
    icon: ShoppingBag,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/admin/orders",
  },
  {
    label: "Revenue",
    value: "₹15,42,800",
    change: "+8.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/admin/analytics",
  },
];

const recentOrders = [
  {
    id: "ORD-2024-1234",
    customer: "Rahul Sharma",
    amount: 1299,
    status: "Completed",
    date: "2 hours ago",
  },
  {
    id: "ORD-2024-1233",
    customer: "Priya Patel",
    amount: 799,
    status: "Processing",
    date: "4 hours ago",
  },
  {
    id: "ORD-2024-1232",
    customer: "Amit Kumar",
    amount: 549,
    status: "Shipped",
    date: "6 hours ago",
  },
  {
    id: "ORD-2024-1231",
    customer: "Sneha Reddy",
    amount: 1899,
    status: "Completed",
    date: "8 hours ago",
  },
  {
    id: "ORD-2024-1230",
    customer: "Vikram Singh",
    amount: 699,
    status: "Processing",
    date: "12 hours ago",
  },
];

const pendingManuscripts = [
  {
    id: 1,
    title: "The Future of AI",
    author: "Dr. Arun Mehta",
    submittedDate: "Jan 20, 2024",
    category: "Technology",
  },
  {
    id: 2,
    title: "Leadership Lessons",
    author: "Sunita Kapoor",
    submittedDate: "Jan 18, 2024",
    category: "Business",
  },
  {
    id: 3,
    title: "Modern Poetry",
    author: "Rajesh Nair",
    submittedDate: "Jan 15, 2024",
    category: "Literature",
  },
];

const topBooks = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Smith",
    sales: 234,
    views: 12500,
  },
  {
    id: 2,
    title: "Business Strategy 101",
    author: "Sarah Johnson",
    sales: 189,
    views: 9800,
  },
  {
    id: 3,
    title: "Creative Writing",
    author: "Michael Brown",
    sales: 156,
    views: 7200,
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
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.amount}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
              {pendingManuscripts.map((manuscript) => (
                <div
                  key={manuscript.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{manuscript.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {manuscript.author}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{manuscript.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {manuscript.submittedDate}
                      </span>
                    </div>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
              ))}
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
            {topBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {book.sales} sales
                  </span>
                </div>
                <h4 className="font-semibold">{book.title}</h4>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {book.views.toLocaleString()} views
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
