"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const router = useRouter();
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
      // 1. Create reader account (Server forces role=reader automatically)
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
      await bootstrapUserContext(token);
      setAuthStatus("authenticated");

      setTimeout(() => {
        router.replace("/dashboard");
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
      {/* Security Dialog */}
      <AccountLinkDialog
        isOpen={dialogState.isOpen}
        type={dialogState.type}
        email={dialogState.email}
        onClose={() => setDialogState({ isOpen: false, type: null })}
        onSwitchToPasswordLogin={(emailAddress) => {
          router.push(`/login${emailAddress ? `?email=${encodeURIComponent(emailAddress)}` : ""}`);
        }}
      />

      {/* Left side - Hero Feature Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-slate-950 via-primary/95 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-20 flex flex-col justify-between p-12 text-primary-foreground h-full w-full">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
              Join the Literary Network
            </span>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>

            <h2 className="text-3xl font-serif font-bold leading-tight">
              Start Reading & Publishing in Minutes
            </h2>

            <div className="space-y-3 text-sm text-primary-foreground/85">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant 1-Click Direct Google Sign Up</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Personalized Reader Library & Wishlist</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Submit Author Applications & Royalty Dashboard</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-primary-foreground/60 border-t border-white/10 pt-4">
            <span>© 2026 Harglim Publishers</span>
            <span>Reader & Author Portal</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

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
              Join thousands of readers, reviewers, and aspiring authors
            </p>
          </div>

          <div className="space-y-6">
            {/* Direct Google Sign Up Button */}
            <div className="space-y-2">
              <GoogleLoginButton
                label="Sign up with Google"
                disabled={isLoading}
                onSuccess={() => {
                  setTimeout(() => {
                    router.replace("/dashboard");
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
                Or sign up with email
              </span>
            </div>

            {/* Manual Account Registration Form */}
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
                    placeholder="John Doe"
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
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

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-medium">
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
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
