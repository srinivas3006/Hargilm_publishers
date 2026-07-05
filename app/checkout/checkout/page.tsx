"use client";

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, QrCode, CheckCircle2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { AnimatePresence, motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const defaultAddress = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
  email: '',
};

export default function CheckoutStepPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const tax = useCartStore((state) => state.getTax());
  const shipping = useCartStore((state) => state.getShipping());
  const total = useCartStore((state) => state.getTotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [address, setAddress] = useState(defaultAddress);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('upi');
  const [submitting, setSubmitting] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiStatus, setUpiStatus] = useState<'waiting' | 'success'>('waiting');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [currentOrderNumber, setCurrentOrderNumber] = useState('');
  const [utr, setUtr] = useState('');

  useEffect(() => {
    if (!items.length) {
      router.push('/checkout/cart');
    }
  }, [items.length, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.pincode || !address.phone || !address.email) {
      return;
    }

    // Since the client wants ONLY UPI payments, we'll force it here
    if (paymentMethod !== 'upi') {
       toast.error("Only UPI payments are supported currently.");
       return;
    }

    processOrder();
  };

  const processOrder = async () => {
    setSubmitting(true);
    try {
      // Map cart items for backend
      const formattedItems = items.map(item => ({
        bookId: item.book._id,
        quantity: item.quantity
      }));

      const payload = {
        items: formattedItems,
        shippingAddress: {
          fullName: address.fullName,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          postalCode: address.pincode,
          country: address.state, // Or 'India'
        }
      };

      const { data } = await api.post('/orders/checkout', payload);
      
      if (data.status === 'success') {
        const { order, payment } = data.data;
        setCurrentOrderId(order._id);
        setCurrentOrderNumber(order.orderNumber);
        setQrCodeDataUrl(payment.qrCodeDataUrl);
        setShowUpiModal(true);
      }
    } catch (error: any) {
       toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyUtr = async () => {
    if (!utr.trim()) {
      toast.error("Please enter the UTR / Transaction ID");
      return;
    }

    try {
      setUpiStatus('success'); // show loading state visually
      await api.put(`/orders/${currentOrderId}/verify-payment`, { utr });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowUpiModal(false);
      router.push(`/checkout/success?orderId=${currentOrderNumber}&paymentId=UPI`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify payment");
      setUpiStatus('waiting');
    }
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Checkout</p>
          <h1 className="text-3xl font-bold">Complete Your Order</h1>
          <p className="text-muted-foreground mt-2">Enter shipping details, select payment, and confirm your purchase.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <p className="text-sm text-muted-foreground mt-1">Where should we deliver your books?</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: 'fullName', label: 'Full Name', type: 'text' },
                { name: 'email', label: 'Email Address', type: 'email' },
              ].map((field) => (
                <label key={field.name} className="space-y-2">
                  <span className="text-sm font-medium">{field.label}</span>
                  <input
                    type={field.type}
                    value={(address as any)[field.name]}
                    onChange={(event) => setAddress({ ...address, [field.name]: event.target.value })}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary/80"
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: 'addressLine1', label: 'Address Line 1' },
                { name: 'addressLine2', label: 'Address Line 2 (optional)' },
              ].map((field) => (
                <label key={field.name} className="space-y-2">
                  <span className="text-sm font-medium">{field.label}</span>
                  <input
                    type="text"
                    value={(address as any)[field.name]}
                    onChange={(event) => setAddress({ ...address, [field.name]: event.target.value })}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary/80"
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { name: 'city', label: 'City' },
                { name: 'state', label: 'State' },
                { name: 'pincode', label: 'Pincode' },
              ].map((field) => (
                <label key={field.name} className="space-y-2">
                  <span className="text-sm font-medium">{field.label}</span>
                  <input
                    type="text"
                    value={(address as any)[field.name]}
                    onChange={(event) => setAddress({ ...address, [field.name]: event.target.value })}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary/80"
                  />
                </label>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">Phone</span>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(event) => setAddress({ ...address, phone: event.target.value })}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary/80"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">Delivery Notes</span>
                <input
                  type="text"
                  value={address.addressLine2}
                  onChange={(event) => setAddress({ ...address, addressLine2: event.target.value })}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary/80"
                />
              </label>
            </div>

            <div className="space-y-4 rounded-3xl border border-border bg-background p-4">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  { value: 'upi', label: 'UPI' },
                ] as const).map((method) => (
                  <button
                    type="button"
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`rounded-2xl border p-4 text-left transition border-primary bg-primary/10`}
                  >
                    <p className="font-semibold">{method.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay via Google Pay, PhonePe, Paytm QR Code
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Once submitted, your order will appear in the dashboard.</p>
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </section>

          <aside className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Order Summary</p>
                <p className="text-sm text-muted-foreground">Review your purchase before confirming.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Order Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-4">
              <p className="text-sm font-medium">Items</p>
              <div className="mt-3 space-y-3">
                {items.map((item) => (
                  <div key={item.book._id} className="flex items-center justify-between gap-3">
                    <span className="truncate">{item.book.title}</span>
                    <span>×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </form>
      </div>

      {/* UPI Modal Simulation */}
      <AnimatePresence>
        {showUpiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-2xl text-center"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => {
                  setShowUpiModal(false);
                  setUpiStatus('waiting');
                }}
                disabled={upiStatus === 'success'}
              >
                <X className="h-4 w-4" />
              </Button>

              {upiStatus === 'waiting' ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-4">
                    <QrCode className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Scan to Pay</h3>
                  <p className="text-muted-foreground mb-6">
                    Amount: <span className="font-bold text-foreground">₹{total.toFixed(2)}</span>
                  </p>
                  
                  <div className="aspect-square bg-white w-48 mx-auto rounded-xl border-2 border-dashed border-border flex items-center justify-center mb-6 overflow-hidden">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="h-24 w-24 text-muted-foreground/30" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Open your UPI app (GPay, PhonePe, Paytm) and scan this QR code to complete the payment.
                  </p>

                  <div className="space-y-4 mb-6">
                     <input
                      type="text"
                      placeholder="Enter UTR / Transaction ID"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary/80"
                     />
                  </div>

                  <Button className="w-full" onClick={handleVerifyUtr}>
                    Verify Payment
                  </Button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8"
                >
                  <div className="mx-auto w-20 h-20 bg-green-500/10 text-green-500 flex items-center justify-center rounded-full mb-6">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                  <p className="text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to confirmation...
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
