"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, BookOpen, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import api, { bootstrapUserContext } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { AccountLinkDialog } from "@/components/auth/account-link-dialog";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const login = useAuthStore((state) => state.login);
  const setAuthStatus = useAuthStore((state) => state.setAuthStatus);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Security & conflict modal dialog
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "link_required" | "user_inactive" | null;
    email?: string;
  }>({
    isOpen: false,
    type: null,
    email: undefined,
  });

  const handleRouteAfterAuth = (context?: any) => {
    if (redirectUrl) {
      router.replace(redirectUrl);
      return;
    }

    const caps = context?.capabilities;
    const userRole = useAuthStore.getState().user?.role;
    if (caps?.canAdminister || userRole === "admin") {
      router.replace("/admin");
    } else if (caps?.canAccessAuthorDashboard || userRole === "author") {
      router.replace("/author");
    } else {
      router.replace("/dashboard");
    }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please enter your full name and email address.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match. Please check and try again.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    setAuthStatus("authenticating");

    try {
      // 1. Create reader account
      await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Account created! Signing you in...", {
        duration: 2000,
        position: "top-center",
      });

      // 2. Auto-login immediately after creation
      const { data: loginRes } = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const authData = loginRes.data || loginRes;
      const { user, token, refreshToken, refreshTokenExpiresAt } = authData;

      login(
        {
          _id: user._id || user.id,
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profilePicture || user.profileImage,
          emailVerified: true,
          isActive: true,
        },
        token,
        refreshToken,
        refreshTokenExpiresAt
      );

      setAuthStatus("context-loading");
      const context = await bootstrapUserContext(token);
      setAuthStatus("authenticated");

      setTimeout(() => {
        handleRouteAfterAuth(context);
      }, 300);
    } catch (error: any) {
      setAuthStatus("error");
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Account Link & Security Dialog */}
      <AccountLinkDialog
        isOpen={dialogState.isOpen}
        type={dialogState.type}
        email={dialogState.email}
        onClose={() => setDialogState({ isOpen: false, type: null })}
        onSwitchToPasswordLogin={(targetEmail) => {
          if (targetEmail) {
            setFormData((prev) => ({ ...prev, email: targetEmail }));
          }
        }}
      />

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto relative">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="absolute top-4 left-4 md:top-8 md:left-8 gap-2 hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md my-auto py-8 z-10"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.webp"
                  alt="Harglim"
                  width={36}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <span className="text-2xl font-serif font-bold text-foreground tracking-tight">
                Harglim Publishers
              </span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Join thousands of readers and authors on Harglim Publishers
            </p>
          </div>

          <div className="space-y-6">
            {/* 1-Click Direct Google Signup */}
            <div className="space-y-2">
              <GoogleLoginButton
                label="Sign up with Google"
                disabled={isLoading}
                onSuccess={() => {
                  setTimeout(() => {
                    handleRouteAfterAuth(useAuthStore.getState().userContext);
                  }, 300);
                }}
                onAccountLinkRequired={(emailAddress) => {
                  setDialogState({
                    isOpen: true,
                    type: "link_required",
                    email: emailAddress || formData.email,
                  });
                }}
                onUserInactive={() => {
                  setDialogState({
                    isOpen: true,
                    type: "user_inactive",
                  });
                }}
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-border w-full" />
              <span className="bg-background px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
                Or register with email
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleManualRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 h-11 bg-card/50 border-border/80 focus:bg-card"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-11 bg-card/50 border-border/80 focus:bg-card"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-11 bg-card/50 border-border/80 focus:bg-card"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrengthIndicator password={formData.password} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 h-11 bg-card/50 border-border/80 focus:bg-card"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer select-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Sign In</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Register Page...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
