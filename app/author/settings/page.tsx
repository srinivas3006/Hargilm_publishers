"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";
import { Save, User, CreditCard, Bell } from "lucide-react";

export default function AuthorSettingsPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Passionate author and storyteller.",
  });

  const [paymentData, setPaymentData] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (user) {
      setUser({ ...user, name: profileData.name, email: profileData.email });
    }
    
    toast.success("Profile updated successfully");
    setLoading(false);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Payment details saved securely");
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your author profile and royalty payout preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                activeTab === "profile" 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              Public Profile
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                activeTab === "payment" 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Payout Details
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                activeTab === "notifications" 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
          </nav>
        </aside>

        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="max-w-md rounded-2xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="max-w-md rounded-2xl"
                  />
                  <p className="text-xs text-muted-foreground">This email is used for login and important communications.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Author Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full max-w-md min-h-[120px] rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary/80"
                  />
                  <p className="text-xs text-muted-foreground">This will be displayed on your published books.</p>
                </div>

                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? "Saving..." : "Save Profile"}
                  {!loading && <Save className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Royalty Payouts</h2>
              <p className="text-sm text-muted-foreground mb-6">Where should we send your book earnings?</p>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="e.g. HDFC Bank, SBI"
                    value={paymentData.bankName}
                    onChange={(e) => setPaymentData({ ...paymentData, bankName: e.target.value })}
                    className="max-w-md rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="password"
                    placeholder="••••••••••••"
                    value={paymentData.accountNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                    className="max-w-md rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    placeholder="e.g. HDFC0001234"
                    value={paymentData.ifscCode}
                    onChange={(e) => setPaymentData({ ...paymentData, ifscCode: e.target.value })}
                    className="max-w-md rounded-2xl uppercase"
                  />
                </div>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm uppercase">OR</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@okhdfcbank"
                    value={paymentData.upiId}
                    onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
                    className="max-w-md rounded-2xl"
                  />
                  <p className="text-xs text-muted-foreground">For faster royalty transfers.</p>
                </div>

                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? "Saving..." : "Save Payment Details"}
                  {!loading && <Save className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Email Notifications</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-2xl">
                  <div>
                    <h3 className="font-medium">Manuscript Updates</h3>
                    <p className="text-sm text-muted-foreground">Get notified when an admin reviews your draft.</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-all"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-2xl">
                  <div>
                    <h3 className="font-medium">Royalty Reports</h3>
                    <p className="text-sm text-muted-foreground">Receive a monthly summary of your earnings.</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-all"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-2xl">
                  <div>
                    <h3 className="font-medium">Marketing & Tips</h3>
                    <p className="text-sm text-muted-foreground">Tips to help you sell more books.</p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-muted border border-border relative cursor-pointer">
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
