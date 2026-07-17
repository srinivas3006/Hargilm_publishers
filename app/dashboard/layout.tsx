"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  BookOpen,
  PenTool,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { AuthGuard } from "@/components/auth/auth-guard";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/library", label: "My Library", icon: BookOpen },
  { href: "/dashboard/payments", label: "Payment History", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AuthGuard>
    <div className="flex bg-muted/30 min-h-[calc(100vh-4rem)]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform bg-card border-r transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-end p-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              
              {user?.role === "reader" && (
                <li className="pt-4 mt-4 border-t border-border/50">
                  <Link
                    href="/dashboard/become-author"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === "/dashboard/become-author"
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <PenTool className="h-5 w-5" />
                    Become an Author
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Dashboard</span>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
    </AuthGuard>
  );
}
