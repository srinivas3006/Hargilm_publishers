"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";



const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "bg-emerald-500/10 text-emerald-600";
    case "PROCESSING":
      return "bg-amber-500/10 text-amber-600";
    case "SHIPPED":
      return "bg-blue-500/10 text-blue-600";
    case "CANCELLED":
      return "bg-red-500/10 text-red-600";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return CheckCircle;
    case "PROCESSING":
      return Package;
    case "SHIPPED":
      return Truck;
    case "CANCELLED":
      return XCircle;
    case "PENDING":
      return Package;
    default:
      return Package;
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [booksMap, setBooksMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const [ordersRes, booksRes] = await Promise.allSettled([
        api.get("/admin/orders"),
        api.get("/books?limit=100")
      ]);

      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value.data?.data || ordersRes.value.data || []);
      }

      if (booksRes.status === "fulfilled") {
        const booksList = booksRes.value.data?.data?.books || booksRes.value.data?.data || booksRes.value.data || [];
        if (Array.isArray(booksList)) {
          const map: Record<string, string> = {};
          booksList.forEach((b: any) => {
            if (b._id) map[b._id] = b.title;
            if (b.id) map[b.id] = b.title;
          });
          setBooksMap(map);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOrderAmount = (o: any) => {
    if (!o) return 0;
    if (typeof o.totalPrice === 'number' && o.totalPrice > 0) return o.totalPrice;
    if (typeof o.totalAmount === 'number' && o.totalAmount > 0) return o.totalAmount;
    if (typeof o.amount === 'number' && o.amount > 0) return o.amount;

    // Fallback calculation: subtotal (or sum of items) + tax + shipping
    const itemsSum = Array.isArray(o.items)
      ? o.items.reduce((sum: number, item: any) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
      : 0;

    const subtotal = typeof o.subtotal === 'number' && o.subtotal > 0 ? o.subtotal : itemsSum;
    if (subtotal <= 0) return 0;

    const tax = typeof o.tax === 'number' ? o.tax : (subtotal * 0.05);
    const shipping = typeof o.shippingPrice === 'number' ? o.shippingPrice : (typeof o.shippingFee === 'number' ? o.shippingFee : 50);

    return Math.round((subtotal + tax + shipping) * 100) / 100;
  };

  const filteredOrders = orders.filter((order: any) => {
    const orderId = order.orderNumber || order.id || order._id || "";
    const customer = order.customerName || order.user?.name || "Guest";
    const matchesSearch =
      orderId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status?.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o: any) => o.status?.toUpperCase() !== "CANCELLED")
    .reduce((sum: number, o: any) => sum + getOrderAmount(o), 0);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const upperStatus = newStatus.toUpperCase();
      await api
        .put(`/admin/orders/${id}/status`, { status: upperStatus })
        .catch(() => api.put(`/orders/${id}`, { status: upperStatus }))
        .catch(() => api.put(`/admin/orders/${id}`, { status: upperStatus }));

      setOrders(
        orders.map((o: any) => ((o.id || o._id) === id ? { ...o, status: upperStatus } : o))
      );
      toast.success(`Order status updated to ${upperStatus}`);
    } catch (err) {
      console.error("Failed to update order status:", err);
      toast.error("Failed to update order status");
    }
  };

  const handleExportOrders = () => {
    if (!orders.length) {
      toast.error("No orders to export");
      return;
    }

    const headers = ["Order ID", "Customer Name", "Email", "Total Amount", "Status", "Date"];
    const csvRows = [headers.join(",")];

    orders.forEach((order: any) => {
      const orderId = order.orderNumber || order.id || order._id;
      const customer = order.customerName || order.user?.name || "Guest";
      const email = order.email || order.user?.email || "-";
      const amount = getOrderAmount(order);
      const date = new Date(order.createdAt || order.date).toLocaleDateString();

      const row = [
        `"${orderId}"`,
        `"${customer}"`,
        `"${email}"`,
        amount,
        `"${order.status}"`,
        `"${date}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Orders exported successfully!");
  };

  const handleDownloadInvoice = (order: any) => {
    const orderId = order.orderNumber || order.id || order._id;
    const customer = order.customerName || order.user?.name || "Guest";
    const email = order.email || order.user?.email || "-";
    const amount = getOrderAmount(order);
    const date = new Date(order.createdAt || order.date).toLocaleDateString();

    const invoiceText = `
INVOICE
-----------------------------
Order ID: ${orderId}
Date: ${date}

Billed To:
Name: ${customer}
Email: ${email}

-----------------------------
Total Amount: ₹${amount.toLocaleString()}
Payment Method: ${order.paymentMethod || "UPI"}
Status: ${order.status}
-----------------------------
Thank you for shopping with Hargilm Publishers!
    `.trim();

    const blob = new Blob([invoiceText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Invoice_${orderId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Invoice downloaded for order ${orderId}`);
  };

  if (error) {
    return (
      <ErrorState
        title="Could not load orders"
        message="We encountered an issue fetching the orders list. Please try again."
        onRetry={fetchOrders}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track customer orders
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExportOrders}>
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
                <SelectItem value="PENDING">Pending</SelectItem>
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
                {filteredOrders.map((order: any, index: number) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <motion.tr
                      key={order.id || order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b"
                    >
                      <TableCell className="font-medium">{order.orderNumber || order.id || order._id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName || order.user?.name || "Guest"}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.email || order.user?.email || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{order.items?.length || order.items || 0}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{(getOrderAmount(order)).toLocaleString()}
                      </TableCell>
                      <TableCell>{order.paymentMethod || "UPI"}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt || order.date).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {order.status?.toUpperCase() === "PENDING" && (
                              <DropdownMenuItem
                                onClick={() => updateStatus(order.id || order._id, "Processing")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                                Approve Payment (Process)
                              </DropdownMenuItem>
                            )}
                            {order.status?.toUpperCase() === "PROCESSING" && (
                              <DropdownMenuItem
                                onClick={() => updateStatus(order.id || order._id, "Shipped")}
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Mark as Shipped
                              </DropdownMenuItem>
                            )}
                            {order.status?.toUpperCase() === "SHIPPED" && (
                              <DropdownMenuItem
                                onClick={() => updateStatus(order.id || order._id, "Completed")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Completed
                              </DropdownMenuItem>
                            )}
                            {order.status?.toUpperCase() !== "CANCELLED" &&
                              order.status?.toUpperCase() !== "COMPLETED" && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => updateStatus(order.id || order._id, "Cancelled")}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              )}
                            <DropdownMenuItem onClick={() => handleDownloadInvoice(order)}>
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

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription className="sr-only">Detailed view of the selected order including items, customer info, and total amount.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium">{selectedOrder.orderNumber || selectedOrder.id || selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.shippingAddress?.fullName || selectedOrder.customerName || selectedOrder.user?.name || "Guest"}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.email || selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method & Status</p>
                  <p className="font-medium">{selectedOrder.paymentMethod || "UPI"} • {selectedOrder.status}</p>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="text-sm bg-muted/30 p-4 rounded-md space-y-1">
                    <p className="font-semibold text-foreground">
                      {selectedOrder.shippingAddress.fullName || selectedOrder.customerName || selectedOrder.user?.name}
                    </p>
                    <p>
                      {selectedOrder.shippingAddress.addressLine1 || selectedOrder.shippingAddress.address}
                      {selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ""}
                    </p>
                    <p>
                      {[
                        selectedOrder.shippingAddress.city,
                        selectedOrder.shippingAddress.state,
                        selectedOrder.shippingAddress.postalCode || selectedOrder.shippingAddress.pincode,
                        selectedOrder.shippingAddress.country
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Ordered Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book Title</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, i: number) => {
                        const bookId = typeof item.book === 'string' ? item.book : item.book?._id;
                        const bookTitle = item.bookTitle || item.book?.title || (bookId && booksMap[bookId]) || "Book (" + (bookId?.substring(0, 8) || (i + 1)) + ")";
                        const price = item.price || 0;
                        const qty = item.quantity || 1;
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              <p className="font-medium text-foreground">{bookTitle}</p>
                            </TableCell>
                            <TableCell className="text-right">₹{price}</TableCell>
                            <TableCell className="text-center">{qty}</TableCell>
                            <TableCell className="text-right font-medium">₹{(price * qty).toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{selectedOrder.subtotal ?? (selectedOrder.items?.reduce((s: number, item: any) => s + (item.price * item.quantity), 0) || 0)}</span>
                </div>
                {selectedOrder.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (5%)</span>
                    <span>₹{selectedOrder.tax}</span>
                  </div>
                )}
                {selectedOrder.shippingPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span>₹{selectedOrder.shippingPrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2 text-foreground">
                  <span>Total Amount</span>
                  <span className="text-emerald-600">₹{getOrderAmount(selectedOrder).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
