"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  DollarSign,
  Eye,
  FileText,
  Clock,
  ArrowRight,
  Star,
  Sparkles,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const statsTemplate = [
  {
    label: "Published Books",
    value: "0",
    icon: BookOpen,
    trend: "Active published catalog",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Gross Sales Revenue",
    value: "₹0",
    icon: DollarSign,
    trend: "Total book sales",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Accrued Royalty",
    value: "₹0",
    icon: Eye,
    trend: "Royalty generated",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Eligible Unsettled",
    value: "₹0",
    icon: Star,
    trend: "Ready for settlement",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "UNDER_REVIEW":
    case "SUBMITTED":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "IN_EDITING":
    case "CHANGES_REQUESTED":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "APPROVED":
    case "PUBLISHED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function AuthorDashboard() {
  const { user, userContext } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accessRequired, setAccessRequired] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setAccessRequired(false);
    try {
      // 1. Authoritative Backend Endpoint for Author Dashboard
      const { data } = await api.get("/authors/me/dashboard").catch(() => {
        const authorId = user?._id || user?.id;
        return api.get(`/authors/${authorId}/stats`);
      });

      const resData = data?.data || data;
      setDashboardData(resData);
    } catch (err: any) {
      const status = err.response?.status;
      const errorCode = err.response?.data?.error;

      if (status === 403 && errorCode === "AUTHOR_DASHBOARD_ACCESS_REQUIRED") {
        setAccessRequired(true);
      } else {
        console.warn("Author dashboard fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  // Handle Paywall when Author lacks active paid entitlement
  if (accessRequired || (userContext && !userContext.capabilities.canAccessAuthorDashboard && user?.role === "author")) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <div className="p-8 rounded-2xl bg-card border border-amber-500/30 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Author Analytics Dashboard Locked</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your author publishing rights are 100% active and free! To view real-time sales metrics, time-series analytics, and royalty settlements, please activate your author dashboard access plan.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="gap-2 shadow-md">
              <Link href="/dashboard/purchase-access">
                <Sparkles className="h-4 w-4" />
                <span>Upgrade Dashboard Access</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/author/books">
                <span>Manage My Books (Free)</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    publishedBooks = 0,
    grossBookRevenue = 0,
    accruedKnown = 0,
    eligibleUnsettled = 0,
    settledPendingPayment = 0,
    paidLifetime = 0,
    recentBooks = [],
    manuscripts = [],
  } = dashboardData || {};

  const dynamicStats = [
    { ...statsTemplate[0], value: publishedBooks.toString() },
    { ...statsTemplate[1], value: `₹${grossBookRevenue.toLocaleString()}` },
    { ...statsTemplate[2], value: `₹${accruedKnown.toLocaleString()}` },
    { ...statsTemplate[3], value: `₹${eligibleUnsettled.toLocaleString()}` },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Author Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {user?.name || "Author"}! Here is your publishing & royalty overview
          </p>
        </div>
        <Button asChild className="gap-2 shadow-sm">
          <Link href="/author/books/new">
            <FileText className="h-4 w-4" />
            Create Book Draft
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dynamicStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="border border-border/80 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-sm text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Earnings & Settlement Status */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base font-bold">Royalty Accounting Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/40 p-4 border border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Eligible Unsettled</p>
              <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">₹{eligibleUnsettled.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Ready for settlement batch</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 border border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Bank Payout</p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">₹{settledPendingPayment.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Approved, waiting for payout</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 border border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lifetime Paid Out</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">₹{paidLifetime.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Total transferred to bank</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books & Manuscript Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Book Performance</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/author/books" className="gap-1 text-xs">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {recentBooks.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground space-y-2">
                <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>No published books performance data yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBooks.map((book: any) => (
                  <div
                    key={book._id || book.id}
                    className="flex items-center gap-4 rounded-xl border border-border/60 p-3 bg-card"
                  >
                    <img
                      src={book.coverImage || "/placeholder-book.webp"}
                      alt={book.title}
                      className="h-14 w-10 rounded object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.unitsSold || 0} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        ₹{(book.grossRevenue || 0).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
            <CardTitle className="text-base font-bold">Recent Manuscripts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/author/books" className="gap-1 text-xs">
                Manage Books <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {manuscripts.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground space-y-2">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>No manuscript submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {manuscripts.map((item: any) => (
                  <div key={item._id || item.id} className="rounded-xl border border-border/60 p-3.5 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
