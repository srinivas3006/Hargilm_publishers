"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Copy, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart-store";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") || `ORD-${Date.now().toString().slice(-6)}`;
  const paymentId = searchParams?.get("paymentId") || "PAY-CONFIRMED";
  const [copied, setCopied] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-background min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-8">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold">Order Confirmed!</h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully
          and will be processed shortly.
        </p>

        <div className="mt-10 max-w-md mx-auto bg-card border border-border rounded-2xl p-6 text-left shadow-sm">
          <h3 className="font-semibold text-lg border-b pb-4 mb-4">Order Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Tracking ID</p>
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border/50">
                <span className="font-mono font-medium">{orderId}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(orderId)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Reference</p>
              <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border/50">
                <span className="font-mono font-medium">{paymentId}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(paymentId)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto flex items-center gap-2">
              <Package className="h-4 w-4" />
              Track Order
            </Button>
          </Link>
          <Link href="/books">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
