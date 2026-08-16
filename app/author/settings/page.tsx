"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { User, CreditCard, Save, Upload, Building, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AuthorSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Author Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    profileImage: user?.profileImage || "",
  });

  // Payment Details Form
  const [paymentForm, setPaymentForm] = useState({
    accountHolderName: user?.name || "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  useEffect(() => {
    // Fetch profile & payment details
    const fetchSettings = async () => {
      if (!user?._id && !user?.id) return;
      try {
        const authorId = user._id || user.id;
        const res = await api.get(`/authors/${authorId}`).catch(() => null);
        if (res?.data) {
          const authObj = res.data.data || res.data;
          setProfileForm((prev) => ({
            ...prev,
            name: authObj.name || prev.name,
            bio: authObj.bio || "",
            profileImage: authObj.profileImage || prev.profileImage,
          }));

          if (authObj.paymentDetails) {
            setPaymentForm({
              accountHolderName: authObj.paymentDetails.accountHolderName || authObj.name || "",
              bankName: authObj.paymentDetails.bankName || "",
              accountNumber: authObj.paymentDetails.accountNumber || "",
              ifscCode: authObj.paymentDetails.ifscCode || "",
              upiId: authObj.paymentDetails.upiId || "",
            });
          }
        }
      } catch (e) {
        console.error("Failed to load author settings:", e);
      }
    };
    fetchSettings();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authorId = user?._id || user?.id;
      const payload = {
        name: profileForm.name,
        bio: profileForm.bio,
        profileImage: profileForm.profileImage,
      };

      await api.put(`/authors/${authorId}`, payload).catch(() =>
        api.put(`/users/${authorId}`, payload)
      );

      if (user) {
        setUser({
          ...user,
          name: profileForm.name,
          profileImage: profileForm.profileImage,
        });
      }

      toast.success("Profile details updated! Reflects on public author page. 👤");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authorId = user?._id || user?.id;
      const payload = {
        paymentDetails: paymentForm,
      };

      await api.put(`/authors/${authorId}/payment-details`, payload).catch(() =>
        api.put(`/authors/${authorId}`, payload)
      );

      toast.success("Payment & payout details saved securely! 💳");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save payment details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-[#0F3D3E] font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E2E6DF] pb-5">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F3D3E]">
          Profile & Payment Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6E6E] mt-0.5">
          Update your public author biography and bank details for royalty payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* 1. Author Profile Form */}
        <Card className="bg-white border border-[#E2E6DF] shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-6 bg-[#F8F9F7] border-b border-[#E2E6DF]">
            <CardTitle className="font-serif font-bold text-lg text-[#0F3D3E] flex items-center gap-2">
              <User className="h-5 w-5 text-[#D4AF37]" />
              <span>Public Author Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={profileForm.email}
                    disabled
                    className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Author Bio & Introduction (Public)
                </Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Share a brief introduction about yourself and your published works..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profileImage" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  Profile Image URL / Photo Link
                </Label>
                <Input
                  id="profileImage"
                  placeholder="https://example.com/photo.jpg"
                  value={profileForm.profileImage}
                  onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#0F3D3E] hover:bg-[#174C4D] text-[#D4AF37] border border-[#D4AF37]/50 font-serif font-bold text-xs h-11 px-6 rounded-xl gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 2. Simple Payment & Bank Details Form */}
        <Card className="bg-white border border-[#E2E6DF] shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-6 bg-[#F8F9F7] border-b border-[#E2E6DF]">
            <CardTitle className="font-serif font-bold text-lg text-[#0F3D3E] flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#D4AF37]" />
              <span>Royalty Payout & Bank Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSavePayment} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="accountHolderName" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                    Account Holder Name *
                  </Label>
                  <Input
                    id="accountHolderName"
                    placeholder="Name as per bank account"
                    value={paymentForm.accountHolderName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, accountHolderName: e.target.value })}
                    className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bankName" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                    Bank Name *
                  </Label>
                  <Input
                    id="bankName"
                    placeholder="e.g. HDFC Bank, SBI, ICICI"
                    value={paymentForm.bankName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                    className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="accountNumber" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                    Account Number *
                  </Label>
                  <Input
                    id="accountNumber"
                    type="password"
                    placeholder="Enter bank account number"
                    value={paymentForm.accountNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                    className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ifscCode" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                    IFSC Code *
                  </Label>
                  <Input
                    id="ifscCode"
                    placeholder="e.g. HDFC0001234"
                    value={paymentForm.ifscCode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, ifscCode: e.target.value.toUpperCase() })}
                    className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs font-mono font-bold uppercase"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="upiId" className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                  UPI ID (Optional Direct Transfer)
                </Label>
                <Input
                  id="upiId"
                  placeholder="e.g. authorname@upi"
                  value={paymentForm.upiId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#0F3D3E] hover:bg-[#174C4D] text-[#D4AF37] border border-[#D4AF37]/50 font-serif font-bold text-xs h-11 px-6 rounded-xl gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Payment Details</span>
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
