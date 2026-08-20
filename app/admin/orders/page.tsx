"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { ErrorState } from "@/components/ui/error-state";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Printer,
  Truck,
  Eye,
  ExternalLink,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

const getPaymentBadge = (isPaid: boolean, paymentStatus?: string) => {
  const ps = (paymentStatus || "").toUpperCase();
  if (isPaid || ps === "VERIFIED" || ps === "SUCCESS") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 font-semibold text-xs">
        Verified
      </Badge>
    );
  }
  if (ps === "REJECTED" || ps === "FAILED") {
    return (
      <Badge className="bg-rose-500/10 text-rose-700 border-rose-500/30 font-semibold text-xs">
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 font-semibold text-xs animate-pulse">
      Pending
    </Badge>
  );
};

const getOrderStatusBadge = (status: string) => {
  const s = (status || "").toUpperCase();
  switch (s) {
    case "DELIVERED":
    case "COMPLETED":
      return <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-xs">Completed</Badge>;
    case "SHIPPED":
    case "IN TRANSIT":
      return <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20 text-xs">Shipped</Badge>;
    case "PROCESSING":
      return <Badge className="bg-purple-500/10 text-purple-700 border-purple-500/20 text-xs">Processing / Printed</Badge>;
    case "CANCELLED":
      return <Badge className="bg-rose-500/10 text-rose-700 border-rose-500/20 text-xs">Cancelled</Badge>;
    default:
      return <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 text-xs">Pending</Badge>;
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Tracking Modal State
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<any>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [isSubmittingTracking, setIsSubmittingTracking] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const params: any = { limit: 100 };
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const { data } = await api.get("/admin/orders", { params }).catch(() =>
        api.get("/orders", { params })
      );
      const ordersData = data?.data?.orders || (Array.isArray(data?.data) ? data.data : []) || (Array.isArray(data) ? data : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery]);

  // Action 1: Approve Payment
  const handleApprovePayment = async (orderId: string, paymentId?: string) => {
    try {
      const targetId = paymentId || orderId;
      await api.post(`/admin/operations/payments/${targetId}/approve`, {
        reason: "Admin payment approved from orders view",
      }).catch(() =>
        api.put(`/admin/orders/${orderId}/status`, {
          status: "Processing",
          paymentStatus: "VERIFIED",
          isPaid: true,
        })
      ).catch(() =>
        api.patch(`/admin/orders/${orderId}`, {
          isPaid: true,
          paymentStatus: "VERIFIED",
          status: "PROCESSING",
        })
      );

      toast.success("Payment approved & verified successfully! ✅");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve payment.");
    }
  };

  // Action 2: Reject Payment
  const handleRejectPayment = async (orderId: string, paymentId?: string) => {
    const reason = prompt("Enter reason for payment rejection (optional):", "UTR reference mismatch");
    if (reason === null) return;

    try {
      const targetId = paymentId || orderId;
      await api.post(`/admin/operations/payments/${targetId}/reject`, {
        reason,
      }).catch(() =>
        api.put(`/admin/orders/${orderId}/status`, {
          status: "Cancelled",
          paymentStatus: "REJECTED",
          reason,
        })
      ).catch(() =>
        api.patch(`/admin/orders/${orderId}`, {
          isPaid: false,
          paymentStatus: "REJECTED",
          adminNotes: reason,
        })
      );

      toast.error("Payment marked as REJECTED.");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject payment.");
    }
  };

  // Action 3: Mark as Printed / Processing
  const handleMarkAsPrinted = async (orderId: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status: "Processing",
        reason: "Marked as Printed / Processing",
      }).catch(() =>
        api.patch(`/admin/orders/${orderId}`, {
          status: "PROCESSING",
          orderStatus: "PROCESSING",
        })
      );

      toast.success("Order status updated to Processing / Printed 🖨️");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update order status.");
    }
  };

  // Action 4: Submit Tracking ID & Mark Shipped
  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForTracking || !trackingNumberInput.trim()) {
      toast.error("Please enter a tracking number.");
      return;
    }

    setIsSubmittingTracking(true);
    const orderId = selectedOrderForTracking._id || selectedOrderForTracking.id;

    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status: "Shipped",
        trackingNumber: trackingNumberInput,
      }).catch(() =>
        api.patch(`/admin/orders/${orderId}`, {
          trackingNumber: trackingNumberInput,
          status: "SHIPPED",
          orderStatus: "SHIPPED",
        })
      );

      toast.success("Tracking number saved & status set to Shipped! 🚚");
      setTrackingModalOpen(false);
      setTrackingNumberInput("");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save tracking number.");
    } finally {
      setIsSubmittingTracking(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderNum = (order.orderNumber || order._id || order.id || "").toLowerCase();
    const utrNum = (order.utr || "").toLowerCase();
    const customer = (order.shippingAddress?.fullName || order.user?.name || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = orderNum.includes(query) || utrNum.includes(query) || customer.includes(query);
    const matchesStatus = statusFilter === "all" || (order.status || order.orderStatus || "").toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#0F3D3E]">
          Orders & Payment Verification
        </h1>
        <p className="text-sm text-[#5C6E6E] mt-1 font-sans">
          Verify UTR numbers, manage print processing, and add shipment tracking codes.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <Card className="bg-white border border-[#E2E6DF] shadow-xs rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C6E6E]" />
              <Input
                placeholder="Search by Order ID, UTR reference, or Customer Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-[#E2E6DF]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-52 bg-white border-[#E2E6DF]">
                <Filter className="mr-2 h-4 w-4 text-[#5C6E6E]" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing / Printing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      {error ? (
        <ErrorState
          title="Could not load orders"
          message="We encountered an issue fetching orders. Please try again."
          onRetry={fetchOrders}
        />
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F3D3E]" />
        </div>
      ) : (
        <Card className="bg-white border border-[#E2E6DF] shadow-xs rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F8F9F7]">
                  <TableRow>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Order ID</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Customer & Contact</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">UTR Reference</TableHead>
                    <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Total Amount</TableHead>
                    <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Payment</TableHead>
                    <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Order Status</TableHead>
                    <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-[#0F3D3E]">Action Buttons</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: any, index: number) => {
                    const id = order.orderNumber || order._id || order.id;
                    const isPaid = Boolean(order.isPaid || order.paymentStatus === "VERIFIED");
                    const paymentStatus = order.paymentStatus || (order.utr ? "VERIFICATION_PENDING" : "PENDING");
                    const orderStatus = order.status || order.orderStatus || "PENDING";
                    const totalPrice = order.totalPrice ?? order.totalAmount ?? order.amount ?? 0;

                    return (
                      <TableRow key={id} className="hover:bg-[#F8F9F7]/60 text-xs">
                        {/* Order ID */}
                        <TableCell className="font-mono font-bold text-[#0F3D3E]">
                          {id}
                        </TableCell>

                        {/* Customer & Contact */}
                        <TableCell>
                          <p className="font-serif font-bold text-[#0F3D3E]">
                            {order.shippingAddress?.fullName || order.user?.name || "Customer"}
                          </p>
                          <p className="text-[#5C6E6E] text-[11px] font-sans">
                            {order.user?.email || order.shippingAddress?.email || "N/A"}
                          </p>
                        </TableCell>

                        {/* UTR Number */}
                        <TableCell>
                          {order.utr ? (
                            <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300">
                              {order.utr}
                            </span>
                          ) : (
                            <span className="text-[#5C6E6E] italic text-[11px]">No UTR yet</span>
                          )}
                        </TableCell>

                        {/* Total Amount */}
                        <TableCell className="text-right font-serif font-bold text-[#0F3D3E]">
                          ₹{totalPrice.toLocaleString()}
                        </TableCell>

                        {/* Payment Status */}
                        <TableCell className="text-center">
                          {getPaymentBadge(isPaid, paymentStatus)}
                        </TableCell>

                        {/* Order Status */}
                        <TableCell className="text-center">
                          {getOrderStatusBadge(orderStatus)}
                        </TableCell>

                        {/* Action Buttons (Strictly matching prompt) */}
                        <TableCell className="text-center">
                          <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {/* 👉 Approve Payment */}
                            {!isPaid && (
                              <Button
                                size="sm"
                                onClick={() => handleApprovePayment(id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5 rounded-lg gap-1 font-semibold"
                                title="Approve UTR Payment"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Approve</span>
                              </Button>
                            )}

                            {/* 👉 Reject Payment */}
                            {!isPaid && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectPayment(id)}
                                className="text-[11px] h-7 px-2.5 rounded-lg gap-1 font-semibold"
                                title="Reject Payment"
                              >
                                <XCircle className="h-3 w-3" />
                                <span>Reject</span>
                              </Button>
                            )}

                            {/* 👉 Mark as Printed */}
                            {orderStatus !== "SHIPPED" && orderStatus !== "DELIVERED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsPrinted(id)}
                                className="border-[#0F3D3E]/30 text-[#0F3D3E] hover:bg-[#F0F2ED] text-[11px] h-7 px-2.5 rounded-lg gap-1 font-semibold"
                                title="Mark as Printed"
                              >
                                <Printer className="h-3 w-3" />
                                <span>Mark Printed</span>
                              </Button>
                            )}

                            {/* 👉 Add Tracking ID */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrderForTracking(order);
                                setTrackingNumberInput(order.trackingNumber || "");
                                setTrackingModalOpen(true);
                              }}
                              className="border-[#D4AF37] text-[#0F3D3E] hover:bg-[#D4AF37]/10 text-[11px] h-7 px-2.5 rounded-lg gap-1 font-semibold"
                              title="Add Tracking ID"
                            >
                              <Truck className="h-3 w-3 text-[#D4AF37]" />
                              <span>Tracking ID</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-xs">
                        No orders found matching search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Tracking ID Dialog */}
      <Dialog open={trackingModalOpen} onOpenChange={setTrackingModalOpen}>
        <DialogContent className="bg-white border-[#E2E6DF] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif font-bold text-lg text-[#0F3D3E]">
              Add Shipment Tracking ID
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5C6E6E]">
              Enter courier tracking reference code for order{" "}
              <strong className="font-mono text-[#0F3D3E]">
                {selectedOrderForTracking?.orderNumber || selectedOrderForTracking?._id}
              </strong>
              . This will set status to SHIPPED.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTracking} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                Tracking / Airwaybill Number (AWB)
              </label>
              <Input
                placeholder="e.g. AWB987654321IN"
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                className="font-mono text-sm border-[#E2E6DF] rounded-xl h-11"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTrackingModalOpen(false)}
                className="border-[#E2E6DF]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingTracking}
                className="bg-[#0F3D3E] text-white hover:bg-[#174C4D]"
              >
                {isSubmittingTracking ? "Saving..." : "Save Tracking & Mark Shipped"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
