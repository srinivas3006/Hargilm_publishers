"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const ordersData = [
  {
    id: "ORD-2024-1234",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    items: 3,
    amount: 1299,
    paymentMethod: "UPI",
    date: "2024-01-20",
    status: "Completed",
  },
  {
    id: "ORD-2024-1233",
    customer: "Priya Patel",
    email: "priya@example.com",
    items: 1,
    amount: 799,
    paymentMethod: "UPI",
    date: "2024-01-20",
    status: "Processing",
  },
  {
    id: "ORD-2024-1232",
    customer: "Amit Kumar",
    email: "amit@example.com",
    items: 2,
    amount: 549,
    paymentMethod: "UPI",
    date: "2024-01-19",
    status: "Shipped",
  },
  {
    id: "ORD-2024-1231",
    customer: "Sneha Reddy",
    email: "sneha@example.com",
    items: 4,
    amount: 1899,
    paymentMethod: "UPI",
    date: "2024-01-19",
    status: "Completed",
  },
  {
    id: "ORD-2024-1230",
    customer: "Vikram Singh",
    email: "vikram@example.com",
    items: 1,
    amount: 699,
    paymentMethod: "UPI",
    date: "2024-01-18",
    status: "Cancelled",
  },
  {
    id: "ORD-2024-1229",
    customer: "Ananya Gupta",
    email: "ananya@example.com",
    items: 2,
    amount: 899,
    paymentMethod: "UPI",
    date: "2024-01-18",
    status: "Processing",
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
    case "Cancelled":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return CheckCircle;
    case "Processing":
      return Package;
    case "Shipped":
      return Truck;
    case "Cancelled":
      return XCircle;
    default:
      return Package;
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ordersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amount, 0);

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track customer orders
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Orders
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {orders.filter((o) => o.status === "Processing").length}
            </p>
            <p className="text-sm text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {orders.filter((o) => o.status === "Shipped").length}
            </p>
            <p className="text-sm text-muted-foreground">Shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-emerald-600">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b"
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{order.items}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{order.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${getStatusColor(order.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {order.status === "Processing" && (
                              <DropdownMenuItem
                                onClick={() => updateStatus(order.id, "Shipped")}
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Mark as Shipped
                              </DropdownMenuItem>
                            )}
                            {order.status === "Shipped" && (
                              <DropdownMenuItem
                                onClick={() => updateStatus(order.id, "Completed")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Completed
                              </DropdownMenuItem>
                            )}
                            {order.status !== "Cancelled" &&
                              order.status !== "Completed" && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => updateStatus(order.id, "Cancelled")}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
