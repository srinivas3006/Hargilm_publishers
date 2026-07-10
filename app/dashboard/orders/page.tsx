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

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";

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
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrders = async () => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get(`/users/${userId}/orders`);
      const ordersData = data.data || data;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const id = order.orderNumber || order._id || order.id || "";
    const status = order.orderStatus || order.status || "";
    const matchesSearch = id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || status === statusFilter;
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
      {error ? (
        <ErrorState
          title="Could not load orders"
          message="We encountered an issue fetching your orders. Please try again."
          onRetry={fetchOrders}
        />
      ) : loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const status = order.orderStatus || order.status || "";
          const id = order.orderNumber || order._id || order.id;
          const StatusIcon = getStatusIcon(status);
          const isExpanded = expandedOrder === id;

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
                        <p className="font-semibold">{id}</p>
                        <p className="text-sm text-muted-foreground">
                          Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                      <span className="font-semibold">₹{order.totalAmount || order.total}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Order Items Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.items?.map((item: any) => (
                      <img
                        key={item.book?._id || item.id}
                        src={item.book?.coverImage || item.cover}
                        alt={item.book?.title || item.title}
                        className="h-16 w-12 rounded object-cover"
                      />
                    ))}
                    <span className="self-center text-sm text-muted-foreground">
                      {order.items?.length} item{order.items?.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Expand/Collapse Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedOrder(isExpanded ? null : id)}
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
                          {order.items?.map((item: any) => (
                            <div
                              key={item.book?._id || item.id}
                              className="flex items-center gap-4 rounded-lg border p-3"
                            >
                              <img
                                src={item.book?.coverImage || item.cover}
                                alt={item.book?.title || item.title}
                                className="h-20 w-14 rounded object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.book?.title || item.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  by {typeof item.book?.author === 'object' ? item.book.author.name : item.author}
                                </p>
                                <p className="text-sm">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">₹{item.price}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
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
                      )}

                      {/* Order Timeline */}
                      {order.timeline && (
                        <div>
                          <h4 className="font-semibold mb-3">Order Timeline</h4>
                          <div className="space-y-3">
                            {order.timeline.map((step: any, stepIndex: number) => (
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
                      )}

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
      )}
    </div>
  );
}
