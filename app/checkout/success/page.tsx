import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
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
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/dashboard/orders">
            <Button size="lg">View Orders</Button>
          </Link>
          <Link href="/books">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-2"
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
