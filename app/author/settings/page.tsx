"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { User, CreditCard, Save, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AuthorSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

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
          const imgUrl = authObj.profileImage || authObj.profilePicture || user?.profileImage || "";
          setProfileForm((prev) => ({
            ...prev,
            name: authObj.name || prev.name,
            bio: authObj.bio || "",
            profileImage: imgUrl,
          }));
          setImagePreview(imgUrl);

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

  // Handle local image file selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Generate base64 data preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setImagePreview(resultStr);
        setProfileForm((prev) => ({ ...prev, profileImage: resultStr }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authorId = user?._id || user?.id;
      let finalImage = profileForm.profileImage || imagePreview;

      // 1. Upload image file if selected
      if (imageFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("image", imageFile);

          const uploadRes = await api.post("/uploads/image", uploadFormData, {
            headers: { "Content-Type": undefined },
          }).catch(() => api.post("/uploads/publishing-image", uploadFormData, {
            headers: { "Content-Type": undefined },
          })).catch(() => api.post("/authors/me/uploads/image", uploadFormData, {
            headers: { "Content-Type": undefined },
          }));

          const uploadedUrl = uploadRes?.data?.data?.url || uploadRes?.data?.url;
          if (uploadedUrl) {
            finalImage = uploadedUrl;
          }
        } catch (imgErr) {
          console.warn("Failed to upload author profile image:", imgErr);
        }
      }

      const payload = {
        name: profileForm.name,
        bio: profileForm.bio,
        profileImage: finalImage,
      };

      await api.put(`/authors/${authorId}`, payload).catch(() =>
        api.put(`/users/${authorId}`, payload)
      );

      if (user) {
        setUser({
          ...user,
          name: profileForm.name,
          profileImage: finalImage,
        });
      }

      toast.success("Author profile & photo updated successfully! 👤");
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
          Update your public author biography, upload profile image, and bank details for royalty payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* 1. Author Profile Form */}
        <Card className="bg-white border border-[#E2E6DF] shadow-xs rounded-2xl overflow-hidden">
          <CardHeader className="p-6 bg-[#F8F9F7] border-b border-[#E2E6DF]">
            <CardTitle className="font-serif font-bold text-lg text-[#0F3D3E] flex items-center gap-2">
              <User className="h-5 w-5 text-[#D4AF37]" />
              <span>Public Author Profile & Photo Upload</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Photo Upload & Preview Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-[#F8F9F7] border border-[#E2E6DF]">
                <div className="relative group">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm bg-white flex items-center justify-center">
                    {imagePreview || profileForm.profileImage ? (
                      <Image
                        src={imagePreview || profileForm.profileImage}
                        alt="Author Preview"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-serif font-bold text-[#0F3D3E]">
                        {profileForm.name?.slice(0, 2)?.toUpperCase() || "AU"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                    Author Profile Image Upload
                  </Label>
                  <p className="text-xs text-[#5C6E6E]">
                    Upload a high-resolution portrait (JPG, PNG, WebP) to display on your public author page.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-1 justify-center sm:justify-start">
                    <label className="inline-flex items-center gap-2 bg-[#0F3D3E] hover:bg-[#174C4D] text-[#D4AF37] border border-[#D4AF37]/50 font-serif font-bold text-xs px-4 h-9 rounded-xl cursor-pointer shadow-xs transition-colors">
                      <Camera className="h-4 w-4" />
                      <span>{imageFile ? "Change Image" : "Upload New Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    {imageFile && (
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        ✓ {imageFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

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
                  Or Enter Direct Profile Image URL
                </Label>
                <Input
                  id="profileImage"
                  placeholder="https://example.com/photo.jpg"
                  value={profileForm.profileImage}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, profileImage: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="bg-[#F8F9F7] border-[#E2E6DF] rounded-xl text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#0F3D3E] hover:bg-[#174C4D] text-[#D4AF37] border border-[#D4AF37]/50 font-serif font-bold text-xs h-11 px-6 rounded-xl gap-2 shadow-xs"
              >
                <Save className="h-4 w-4 text-[#D4AF37]" />
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
                className="bg-[#0F3D3E] hover:bg-[#174C4D] text-[#D4AF37] border border-[#D4AF37]/50 font-serif font-bold text-xs h-11 px-6 rounded-xl gap-2 shadow-xs"
              >
                <Save className="h-4 w-4 text-[#D4AF37]" />
                <span>Save Payment Details</span>
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
