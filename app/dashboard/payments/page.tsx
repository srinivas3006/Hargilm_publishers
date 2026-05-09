"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const payments = [
  {
    id: "PAY-2024-001",
    orderId: "ORD-2024-001",
    date: "2024-01-15",
    amount: 1299,
    method: "UPI",
    status: "Completed",
    transactionId: "UPI123456789",
  },
  {
    id: "PAY-2024-002",
    orderId: "ORD-2024-002",
    date: "2024-01-20",
    amount: 799,
    method: "UPI",
    status: "Completed",
    transactionId: "UPI987654321",
  },
  {
    id: "PAY-2024-003",
    orderId: "ORD-2024-003",
    date: "2024-01-22",
    amount: 549,
    method: "UPI",
    status: "Pending",
    transactionId: "UPI456789123",
  },
  {
    id: "PAY-2024-004",
    orderId: "ORD-2024-004",
    date: "2024-01-10",
    amount: 999,
    method: "UPI",
    status: "Failed",
    transactionId: "UPI789123456",
  },
  {
    id: "PAY-2024-005",
    orderId: "ORD-2024-005",
    date: "2024-01-05",
    amount: 1499,
    method: "UPI",
    status: "Completed",
    transactionId: "UPI321654987",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-500/10 text-emerald-600";
    case "Pending":
      return "bg-amber-500/10 text-amber-600";
    case "Failed":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return CheckCircle;
    case "Pending":
      return Clock;
    case "Failed":
      return XCircle;
    default:
      return CreditCard;
  }
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSpent = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Payment History</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your payment transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <IndianRupee className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
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
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
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
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{payments.length}</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by payment ID, order ID, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.orderId}</TableCell>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${getStatusColor(payment.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No transactions found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
