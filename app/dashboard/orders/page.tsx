"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Filter,
  XCircle,
  CreditCard,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  Search,
  ExternalLink,
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
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";
import toast from "react-hot-toast";

const getStatusBadge = (status: string) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "DELIVERED":
    case "COMPLETED":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Delivered</Badge>;
    case "SHIPPED":
    case "IN TRANSIT":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">In Transit</Badge>;
    case "PROCESSING":
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Processing</Badge>;
    case "CANCELLED":
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Cancelled</Badge>;
    default:
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending Verification</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "DELIVERED":
    case "COMPLETED":
      return CheckCircle2;
    case "SHIPPED":
    case "IN TRANSIT":
      return Truck;
    case "PROCESSING":
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
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get(`/users/${userId}/orders`);
      const ordersData = data?.data || data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.delete(`/orders/${orderId}`);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleDownloadInvoice = async (order: any) => {
    const userId = user?._id || user?.id;
    const orderId = order._id || order.id;
    setDownloadingInvoiceId(orderId);

    try {
      // 1. Fetch user invoice list
      const { data } = await api.get(`/users/${userId}/invoices`);
      const invoices = data?.data || data || [];
      const matchingInvoice = Array.isArray(invoices)
        ? invoices.find((inv: any) => (inv.order?._id || inv.order) === orderId || inv.payment === order.payment)
        : null;

      const invoiceId = matchingInvoice?._id || matchingInvoice?.id;
      if (invoiceId) {
        window.open(`${api.defaults.baseURL}/users/${userId}/invoices/${invoiceId}/download`, "_blank");
        toast.success("Downloading invoice document...");
      } else {
        toast.error("Invoice document will be generated once payment verification completes.");
      }
    } catch (err: any) {
      toast.error("Invoice document is currently unavailable for pending payments.");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const orderNum = (order.orderNumber || order._id || order.id || "").toLowerCase();
    const utrNum = (order.utr || "").toLowerCase();
    const status = (order.status || order.orderStatus || "").toUpperCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = orderNum.includes(query) || utrNum.includes(query);
    const matchesStatus = statusFilter === "all" || status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
          My Orders & Order History
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track shipments, view detailed invoice cost breakdown, and manage your book orders.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border border-border/80 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID (e.g. HM-BB9D161B) or UTR..."
                className="pl-9 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-card">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">In Transit / Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      {error ? (
        <ErrorState
          title="Could not load orders"
          message="We encountered an issue fetching your orders. Please try again."
          onRetry={fetchOrders}
        />
      ) : loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="border border-dashed border-border/80">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
              <Package className="h-10 w-10" />
            </div>
            <h3 className="font-bold text-lg text-foreground">No Orders Found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mt-1 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "No orders match your filter criteria. Try clearing search filters."
                : "You haven't placed any orders yet. Explore our curated book collection!"}
            </p>
            <Button asChild className="shadow-md font-medium">
              <Link href="/books">Explore Catalog</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const status = order.status || order.orderStatus || "PENDING";
            const id = order.orderNumber || order._id || order.id;
            const StatusIcon = getStatusIcon(status);
            const isExpanded = expandedOrder === id;

            const subtotal = order.subtotal ?? (order.totalPrice ? order.totalPrice - (order.shippingPrice || 0) : 0);
            const tax = order.tax ?? 0;
            const shippingPrice = order.shippingPrice ?? 50;
            const totalPrice = order.totalPrice ?? (subtotal + tax + shippingPrice);

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card className="border border-border/80 hover:border-primary/40 transition-colors shadow-sm overflow-hidden">
                  {/* Order Summary Header */}
                  <CardHeader className="p-4 sm:p-6 pb-4 bg-muted/20 border-b border-border/60">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <StatusIcon className="h-5.5 w-5.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-base text-foreground">{id}</span>
                            {getStatusBadge(status)}
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) : "Recent"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                        {/* Payment Status Pill */}
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-muted-foreground">Total Price</p>
                          <p className="text-lg font-bold text-foreground">₹{totalPrice.toLocaleString()}</p>
                        </div>

                        <Badge
                          variant="outline"
                          className={
                            order.isPaid
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-medium"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/30 font-medium"
                          }
                        >
                          {order.isPaid ? "Paid" : "Payment Pending Verification"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 space-y-4">
                    {/* Order Items Horizontal Preview */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {order.items?.map((item: any, i: number) => {
                          const bookTitle = item.book?.title || "Book Item";
                          const coverImage = item.book?.coverImage || "https://placehold.co/100x150/png?text=Book";

                          return (
                            <div key={item._id || i} className="relative group">
                              <img
                                src={coverImage}
                                alt={bookTitle}
                                className="h-14 w-10 object-cover rounded-md border shadow-xs"
                              />
                              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {item.quantity}
                              </span>
                            </div>
                          );
                        })}
                        <div className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {order.items?.length || 0}
                          </span>{" "}
                          item{(order.items?.length || 0) > 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* Expand Details Toggle */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedOrder(isExpanded ? null : id)}
                        className="gap-1.5 text-xs text-primary hover:text-primary font-medium shrink-0"
                      >
                        <span>{isExpanded ? "Hide Details" : "View Full Details"}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Expanded Details Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-border/60 space-y-6"
                        >
                          {/* 1. Itemized Book List */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                              Order Items ({order.items?.length || 0})
                            </h4>
                            <div className="space-y-2.5">
                              {order.items?.map((item: any, i: number) => {
                                const bookTitle = item.book?.title || "Book Title";
                                const coverImage = item.book?.coverImage || "https://placehold.co/120x180/png?text=Book";
                                const price = item.price || item.book?.price || 0;

                                return (
                                  <div
                                    key={item._id || i}
                                    className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/30 border border-border/60"
                                  >
                                    <img
                                      src={coverImage}
                                      alt={bookTitle}
                                      className="h-16 w-11 object-cover rounded-md border"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-sm text-foreground truncate">{bookTitle}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        Qty: <span className="font-medium text-foreground">{item.quantity}</span> × ₹{price}
                                      </p>
                                    </div>
                                    <p className="font-bold text-sm text-foreground">
                                      ₹{(price * item.quantity).toLocaleString()}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. Useful Grid: Delivery Address & Payment / Cost Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Shipping Address */}
                            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                <span>Shipping Address</span>
                              </div>
                              {order.shippingAddress ? (
                                <div className="text-xs text-foreground space-y-0.5 leading-relaxed">
                                  <p className="font-bold text-sm text-foreground">
                                    {order.shippingAddress.fullName || order.shippingAddress.name || "Valued Reader"}
                                  </p>
                                  <p>{order.shippingAddress.addressLine1 || order.shippingAddress.address}</p>
                                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                  <p>
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.postalCode || order.shippingAddress.pincode}
                                  </p>
                                  <p className="text-muted-foreground font-medium">
                                    {order.shippingAddress.country || "India"}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">No shipping address recorded.</p>
                              )}
                            </div>

                            {/* Payment & Cost Summary */}
                            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                                  Payment & Invoice Summary
                                </span>
                                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                  {order.paymentMethod || "UPI"}
                                </Badge>
                              </div>

                              {/* UTR Information */}
                              {order.utr && (
                                <div className="p-2 rounded bg-muted/50 text-xs flex items-center justify-between">
                                  <span className="text-muted-foreground">UTR Reference:</span>
                                  <span className="font-mono font-semibold text-foreground">{order.utr}</span>
                                </div>
                              )}

                              {/* Price breakdown */}
                              <div className="space-y-1.5 text-xs border-t border-border/60 pt-2">
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Subtotal</span>
                                  <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Tax (GST)</span>
                                  <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Shipping Fee</span>
                                  <span>{shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm text-foreground border-t border-border/60 pt-1.5">
                                  <span>Grand Total</span>
                                  <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Tracking Updates Timeline */}
                          {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                                <Truck className="h-3.5 w-3.5 text-primary" />
                                <span>Shipment Tracking Updates</span>
                              </h4>
                              <div className="space-y-2.5 pl-2 border-l-2 border-primary/30">
                                {order.trackingUpdates.map((update: any, stepIdx: number) => (
                                  <div key={update._id || stepIdx} className="relative pl-4 space-y-0.5">
                                    <div className="absolute -left-[13px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-bold text-foreground">{update.status}</span>
                                      <span className="text-[11px] text-muted-foreground">
                                        {new Date(update.timestamp || update.createdAt).toLocaleString("en-IN", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{update.description}</p>
                                    {update.location && (
                                      <p className="text-[11px] text-muted-foreground font-medium">Location: {update.location}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadInvoice(order)}
                                disabled={downloadingInvoiceId === id}
                                className="gap-2 text-xs font-medium"
                              >
                                <Download className="h-3.5 w-3.5 text-primary" />
                                <span>
                                  {downloadingInvoiceId === id ? "Downloading..." : "Download Invoice"}
                                </span>
                              </Button>

                              <Link href={`/track-order?orderNumber=${encodeURIComponent(id)}`}>
                                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                                  <span>Public Tracking Page</span>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            </div>

                            {status === "PENDING" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelOrder(id)}
                                className="gap-1.5 text-xs font-medium"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Cancel Order</span>
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
