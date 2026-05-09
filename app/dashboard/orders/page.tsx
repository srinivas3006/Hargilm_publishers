"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Filter,
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

const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 1299,
    paymentMethod: "UPI",
    items: [
      {
        id: 1,
        title: "The Art of Programming",
        author: "John Smith",
        quantity: 1,
        price: 499,
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop",
      },
      {
        id: 2,
        title: "Business Strategy 101",
        author: "Sarah Johnson",
        quantity: 2,
        price: 400,
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop",
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    timeline: [
      { status: "Order Placed", date: "Jan 15, 2024 10:30 AM", completed: true },
      { status: "Payment Confirmed", date: "Jan 15, 2024 10:35 AM", completed: true },
      { status: "Processing", date: "Jan 15, 2024 02:00 PM", completed: true },
      { status: "Shipped", date: "Jan 16, 2024 09:00 AM", completed: true },
      { status: "Delivered", date: "Jan 18, 2024 03:30 PM", completed: true },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "In Transit",
    total: 799,
    paymentMethod: "UPI",
    items: [
      {
        id: 3,
        title: "Creative Writing Masterclass",
        author: "Michael Brown",
        quantity: 1,
        price: 799,
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=150&fit=crop",
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    timeline: [
      { status: "Order Placed", date: "Jan 20, 2024 11:00 AM", completed: true },
      { status: "Payment Confirmed", date: "Jan 20, 2024 11:05 AM", completed: true },
      { status: "Processing", date: "Jan 20, 2024 03:00 PM", completed: true },
      { status: "Shipped", date: "Jan 21, 2024 10:00 AM", completed: true },
      { status: "Out for Delivery", date: "Expected Jan 23", completed: false },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "Processing",
    total: 549,
    paymentMethod: "UPI",
    items: [
      {
        id: 4,
        title: "Finance for Beginners",
        author: "Emily Davis",
        quantity: 1,
        price: 549,
        cover: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=100&h=150&fit=crop",
      },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "456 Park Avenue",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    timeline: [
      { status: "Order Placed", date: "Jan 22, 2024 04:00 PM", completed: true },
      { status: "Payment Confirmed", date: "Jan 22, 2024 04:05 PM", completed: true },
      { status: "Processing", date: "In Progress", completed: false },
      { status: "Shipped", date: "Pending", completed: false },
      { status: "Delivered", date: "Pending", completed: false },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-500/10 text-emerald-600";
    case "In Transit":
      return "bg-blue-500/10 text-blue-600";
    case "Processing":
      return "bg-amber-500/10 text-amber-600";
    case "Cancelled":
      return "bg-red-500/10 text-red-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Delivered":
      return CheckCircle;
    case "In Transit":
      return Truck;
    case "Processing":
      return Clock;
    default:
      return Package;
  }
};

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">My Orders</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage your book orders
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by order ID..."
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
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const StatusIcon = getStatusIcon(order.status);
          const isExpanded = expandedOrder === order.id;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="p-4 pb-0">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <StatusIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Placed on {order.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <span className="font-semibold">₹{order.total}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Order Items Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.items.map((item) => (
                      <img
                        key={item.id}
                        src={item.cover}
                        alt={item.title}
                        className="h-16 w-12 rounded object-cover"
                      />
                    ))}
                    <span className="self-center text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Expand/Collapse Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full justify-center gap-2"
                  >
                    {isExpanded ? (
                      <>
                        Hide Details <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View Details <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-6"
                    >
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 rounded-lg border p-3"
                            >
                              <img
                                src={item.cover}
                                alt={item.title}
                                className="h-20 w-14 rounded object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  by {item.author}
                                </p>
                                <p className="text-sm">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">₹{item.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <div className="rounded-lg border p-3 text-sm">
                          <p className="font-medium">{order.shippingAddress.name}</p>
                          <p className="text-muted-foreground">
                            {order.shippingAddress.address}
                          </p>
                          <p className="text-muted-foreground">
                            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                            {order.shippingAddress.pincode}
                          </p>
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div>
                        <h4 className="font-semibold mb-3">Order Timeline</h4>
                        <div className="space-y-3">
                          {order.timeline.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`h-3 w-3 rounded-full ${
                                    step.completed ? "bg-primary" : "bg-muted"
                                  }`}
                                />
                                {stepIndex < order.timeline.length - 1 && (
                                  <div
                                    className={`w-0.5 flex-1 ${
                                      step.completed ? "bg-primary" : "bg-muted"
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="pb-4">
                                <p
                                  className={`font-medium ${
                                    !step.completed && "text-muted-foreground"
                                  }`}
                                >
                                  {step.status}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {step.date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download Invoice
                        </Button>
                        {order.status === "Delivered" && (
                          <Button size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Write Review
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No orders found</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't placed any orders yet"}
              </p>
              <Button asChild className="mt-4">
                <Link href="/books">Browse Books</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
