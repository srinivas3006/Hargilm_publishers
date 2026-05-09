"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const earnings = [
  {
    id: 1,
    month: "January 2024",
    books: 5,
    sales: 156,
    grossRevenue: 62400,
    royalty: 18720,
    status: "Pending",
  },
  {
    id: 2,
    month: "December 2023",
    books: 5,
    sales: 189,
    grossRevenue: 75600,
    royalty: 22680,
    status: "Paid",
  },
  {
    id: 3,
    month: "November 2023",
    books: 4,
    sales: 145,
    grossRevenue: 58000,
    royalty: 17400,
    status: "Paid",
  },
  {
    id: 4,
    month: "October 2023",
    books: 4,
    sales: 178,
    grossRevenue: 71200,
    royalty: 21360,
    status: "Paid",
  },
  {
    id: 5,
    month: "September 2023",
    books: 4,
    sales: 134,
    grossRevenue: 53600,
    royalty: 16080,
    status: "Paid",
  },
];

const payouts = [
  {
    id: 1,
    date: "2024-01-05",
    amount: 22680,
    method: "Bank Transfer",
    reference: "PAY-2024-001",
    status: "Completed",
  },
  {
    id: 2,
    date: "2023-12-05",
    amount: 17400,
    method: "Bank Transfer",
    reference: "PAY-2023-012",
    status: "Completed",
  },
  {
    id: 3,
    date: "2023-11-05",
    amount: 21360,
    method: "Bank Transfer",
    reference: "PAY-2023-011",
    status: "Completed",
  },
  {
    id: 4,
    date: "2023-10-05",
    amount: 16080,
    method: "Bank Transfer",
    reference: "PAY-2023-010",
    status: "Completed",
  },
];

const bookEarnings = [
  {
    id: 1,
    title: "The Art of Programming",
    sales: 56,
    revenue: 27944,
    royalty: 8383,
    royaltyRate: 30,
  },
  {
    id: 2,
    title: "Business Strategy 101",
    sales: 42,
    revenue: 16758,
    royalty: 5027,
    royaltyRate: 30,
  },
  {
    id: 3,
    title: "Creative Writing Masterclass",
    sales: 38,
    revenue: 13262,
    royalty: 3979,
    royaltyRate: 30,
  },
  {
    id: 4,
    title: "Finance for Everyone",
    sales: 12,
    revenue: 6588,
    royalty: 1976,
    royaltyRate: 30,
  },
  {
    id: 5,
    title: "Marketing Essentials",
    sales: 8,
    revenue: 3592,
    royalty: 1078,
    royaltyRate: 30,
  },
];

export default function RoyaltiesPage() {
  const [periodFilter, setPeriodFilter] = useState("all");

  const totalEarnings = earnings.reduce((sum, e) => sum + e.royalty, 0);
  const pendingPayout = earnings
    .filter((e) => e.status === "Pending")
    .reduce((sum, e) => sum + e.royalty, 0);
  const totalPaid = payouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Royalties</h1>
          <p className="text-muted-foreground mt-1">
            Track your earnings and payout history
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹{totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹{pendingPayout.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Payout</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <ArrowUpRight className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹{totalPaid.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">30%</p>
                  <p className="text-sm text-muted-foreground">Royalty Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Book-wise Earnings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>This Month&apos;s Earnings by Book</CardTitle>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Your Royalty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookEarnings.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell className="text-right">{book.sales}</TableCell>
                    <TableCell className="text-right">
                      ₹{book.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{book.royaltyRate}%</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      ₹{book.royalty.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    {bookEarnings.reduce((sum, b) => sum + b.sales, 0)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₹{bookEarnings.reduce((sum, b) => sum + b.revenue, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600">
                    ₹{bookEarnings.reduce((sum, b) => sum + b.royalty, 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Books</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Gross Revenue</TableHead>
                  <TableHead className="text-right">Your Royalty</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.map((earning) => (
                  <TableRow key={earning.id}>
                    <TableCell className="font-medium">{earning.month}</TableCell>
                    <TableCell className="text-right">{earning.books}</TableCell>
                    <TableCell className="text-right">{earning.sales}</TableCell>
                    <TableCell className="text-right">
                      ₹{earning.grossRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      ₹{earning.royalty.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={
                          earning.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                        }
                      >
                        {earning.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      {new Date(payout.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{payout.reference}</TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{payout.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-emerald-500/10 text-emerald-600">
                        {payout.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
