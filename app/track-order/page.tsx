"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Mock order data for demo
  // TODO: Fetch from API
  const mockOrders: { [key: string]: any } = {};

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const order = mockOrders[orderNumber.toUpperCase()];
      if (order) {
        setTrackedOrder(order);
      } else {
        setTrackedOrder({
          error: "Order not found. Please check your order number.",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
        return <CheckCircle className="h-6 w-6 text-primary" />;
      case "Processing":
        return <Package className="h-6 w-6 text-primary" />;
      case "Shipped":
        return <Truck className="h-6 w-6 text-primary" />;
      case "In Transit":
        return <Truck className="h-6 w-6 text-secondary" />;
      case "Delivered":
        return <CheckCircle className="h-6 w-6 text-secondary" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-secondary/10 border-secondary/30";
      case "in-transit":
        return "bg-primary/10 border-primary/30";
      case "processing":
        return "bg-yellow-100/10 border-yellow-400/30";
      default:
        return "bg-muted/30 border-border";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "in-transit":
        return "In Transit";
      case "processing":
        return "Processing";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-primary/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Track Your Order
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Enter your order number to get real-time updates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Track Order Form */}
      <section className="py-20 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-card rounded-2xl border border-border p-8 shadow-lg"
          >
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Order Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., HG123456"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !orderNumber}
                    className="bg-primary hover:bg-primary/90 text-white px-8"
                  >
                    {isLoading ? "Tracking..." : "Track"}
                  </Button>
                </div>
              </div>
            </form>


          </motion.div>

          {/* Order Details */}
          {trackedOrder && !trackedOrder.error && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mt-12 space-y-8"
            >
              {/* Order Header */}
              <div
                className={`rounded-2xl border-2 p-8 ${getStatusColor(trackedOrder.status)}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Order {trackedOrder.orderNumber}
                    </h2>
                    <p className="text-muted-foreground">
                      Ordered on{" "}
                      {new Date(trackedOrder.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground mb-1">
                      {getStatusText(trackedOrder.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expected:{" "}
                      {new Date(
                        trackedOrder.expectedDelivery,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {trackedOrder.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-foreground">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border flex justify-between">
                  <span className="font-bold text-foreground">Total:</span>
                  <span className="text-2xl font-bold text-secondary">
                    {trackedOrder.totalPrice}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Shipping Address
                </h3>
                <p className="text-muted-foreground">
                  {trackedOrder.shippingAddress}
                </p>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Tracking History
                </h3>
                <div className="space-y-4">
                  {trackedOrder.trackingUpdates.map(
                    (update: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {getStatusIcon(update.status)}
                          {idx < trackedOrder.trackingUpdates.length - 1 && (
                            <div className="w-1 h-12 bg-border my-2" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">
                              {update.status}
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(update.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {update.description}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {trackedOrder?.error && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mt-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900/50 rounded-xl p-6 flex gap-4"
            >
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">
                  Order Not Found
                </h3>
                <p className="text-red-800 dark:text-red-200 mb-4">
                  {trackedOrder.error}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Please check the order number on your confirmation email. If
                  you still can't find your order,{" "}
                  <Link
                    href="/contact"
                    className="underline font-semibold hover:no-underline"
                  >
                    contact our support team.
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Need Help?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find your order number? Check your confirmation email or
              contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Contact Support
                </Button>
              </Link>
              <Link href="/faq">
                <Button size="lg" variant="outline">
                  View FAQ
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
