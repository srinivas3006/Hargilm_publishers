"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, BookOpen, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";
import api, { bootstrapUserContext } from "@/lib/api";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { AccountLinkDialog } from "@/components/auth/account-link-dialog";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const login = useAuthStore((state) => state.login);
  const setAuthStatus = useAuthStore((state) => state.setAuthStatus);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error boundary modal state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "link_required" | "user_inactive" | null;
    email?: string;
  }>({
    isOpen: false,
    type: null,
    email: undefined,
  });

  const handleRouteByCapabilities = (context?: any) => {
    if (redirectUrl) {
      router.replace(redirectUrl);
      return;
    }

    const caps = context?.capabilities;
    if (caps?.canAdminister) {
      router.replace("/admin");
    } else if (caps?.canAccessAuthorDashboard) {
      router.replace("/author");
    } else {
      router.replace("/dashboard");
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setAuthStatus("authenticating");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      const authData = data.data || data;
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

      toast.success(`Welcome back, ${user.name || "Reader"}!`, {
        duration: 2000,
        position: "top-center",
      });

      setAuthStatus("authenticated");
      setTimeout(() => {
        handleRouteByCapabilities(context);
      }, 300);
    } catch (error: any) {
      setAuthStatus("error");
      const status = error.response?.status;
      const errorCode = error.response?.data?.error;
      const errorMessage = error.response?.data?.message;

      if (status === 403 && errorCode === "USER_INACTIVE") {
        setDialogState({
          isOpen: true,
          type: "user_inactive",
        });
      } else {
        toast.error(errorMessage || "Invalid email or password. Please try again.");
      }
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
            setEmail(targetEmail);
          }
        }}
      />

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto relative">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

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
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Access your library, author workspace, and publishing dashboard
            </p>
          </div>

          <div className="space-y-6">
            {/* 1-Click Direct Google Login */}
            <div className="space-y-2">
              <GoogleLoginButton
                label="Sign in with Google"
                disabled={isLoading}
                onSuccess={() => {
                  setTimeout(() => {
                    handleRouteByCapabilities(useAuthStore.getState().userContext);
                  }, 300);
                }}
                onAccountLinkRequired={(emailAddress) => {
                  setDialogState({
                    isOpen: true,
                    type: "link_required",
                    email: emailAddress || email,
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
                Or sign in with email
              </span>
            </div>

            {/* Manual Email Login Form */}
            <form onSubmit={handleManualSubmit} className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-11 bg-card/50 border-border/80 focus:bg-card"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
                    Remember me for 30 days
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In with Password"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border/60">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Create Account</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Hero Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-20 flex flex-col justify-between p-12 text-primary-foreground h-full w-full">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
              Secured Auth Matrix
            </span>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-2">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-serif font-bold leading-tight">
              Empowering Authors, Inspiring Readers
            </h2>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Step into a premium literary ecosystem. Seamlessly publish your manuscripts, track royalties, and explore curated world-class publications.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-primary-foreground/60 border-t border-white/10 pt-4">
            <span>© 2026 Harglim Publishers</span>
            <span>Google & Password Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading Login Page...</p>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
