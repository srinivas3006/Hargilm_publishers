"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, BookOpen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      const { user, token } = data.data || data; // fallback in case data is not nested

      login(
        {
          _id: user._id || user.id,
          id: user._id || user.id, // map backend id to frontend id
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
          emailVerified: true,
          isActive: true,
        },
        token
      );
      
      toast.success("Welcome back! Redirecting to your dashboard.", {
        duration: 2000,
        position: "top-center",
      });

      setTimeout(() => {
        if (user.role === "admin") router.replace("/admin");
        else if (user.role === "author") router.replace("/author");
        else router.replace("/dashboard");
      }, 300);
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md my-auto py-4"
        >
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/logo.webp"
                alt="Harglim"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-serif font-bold text-foreground">
                Harglim
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-primary relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-primary-foreground p-12">
          <BookOpen className="h-16 w-16 mb-6" />
          <h2 className="text-3xl font-serif font-bold mb-4 text-center">
            Your Gateway to Amazing Books
          </h2>
          <p className="text-center text-primary-foreground/80 max-w-md">
            Discover thousands of books from talented authors worldwide. Read,
            review, and connect with the literary community.
          </p>
        </div>
      </div>
    </div>
  );
}
