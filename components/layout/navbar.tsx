"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  Search,
  LogOut,
  Settings,
  LayoutDashboard,
  PenTool,
} from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.webp";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { useHydration } from "@/hooks/useHydration";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/categories", label: "Categories" },
  { href: "/authors", label: "Authors" },
  { href: "/publish", label: "Publish with Us" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const rawItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const itemCount = (isAuthenticated && user) ? rawItemCount : 0;
  const isHydrated = useHydration();

  // Hide Navbar only on admin and auth routes
  const isHiddenRoute = 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "author":
        return "/author";
      default:
        return "/dashboard";
    }
  };

  const handleLogout = () => {
    useCartStore.getState().clearCart();
    logout();
    window.location.href = "/";
  };

  if (isHiddenRoute) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-2xl shadow-sm border-b border-primary/10"
          : "bg-background/40 backdrop-blur-sm border-b border-transparent",
      )}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left bg-gold-gradient z-50"
        style={{ scaleX }}
      />
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src={logo}
              alt="Harglim Publishers"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-serif text-2xl font-bold text-gold-gradient">
              Harglim Publishers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Link href="/search">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>

            {/* Cart */}
            <Link href={isAuthenticated ? "/checkout/cart" : "/login"}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {isAuthenticated && user && isHydrated && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border border-[#E2E6DF] shadow-md bg-white">
                  <div className="px-3 py-2 bg-[#F8F9F7] rounded-xl mb-1 border border-[#E2E6DF]">
                    <p className="text-sm font-serif font-bold text-[#0F3D3E] truncate">{user.name}</p>
                    <p className="text-xs text-[#5C6E6E] truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="my-1 bg-[#E2E6DF]" />
                  <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer focus:bg-[#F0F2ED] text-xs font-medium text-[#0F3D3E]">
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2.5"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#0F3D3E]" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "author" && (
                    <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer focus:bg-[#F0F2ED] text-xs font-medium text-[#0F3D3E]">
                      <Link
                        href="/author/manuscripts/new"
                        className="flex items-center gap-2.5"
                      >
                        <PenTool className="h-4 w-4 text-[#D4AF37]" />
                        Submit Manuscript
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer focus:bg-[#F0F2ED] text-xs font-medium text-[#0F3D3E]">
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center gap-2.5"
                    >
                      <ShoppingCart className="h-4 w-4 text-[#0F3D3E]" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer focus:bg-[#F0F2ED] text-xs font-medium text-[#0F3D3E]">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5"
                    >
                      <User className="h-4 w-4 text-[#0F3D3E]" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-[#E2E6DF]" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 text-xs font-medium gap-2"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col border-r shadow-2xl">
                <SheetHeader className="text-left border-b pb-4 mb-2">
                  <SheetTitle className="font-serif text-2xl font-bold text-gold-gradient">
                    Harglim Publishers
                  </SheetTitle>
                  <SheetDescription className="sr-only">Mobile Navigation Menu</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto space-y-1 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-3 py-3 text-base font-medium rounded-md transition-all",
                        pathname === link.href
                          ? "text-primary bg-primary/10 border-l-4 border-primary pl-2"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted hover:pl-4",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-border mt-auto space-y-3 pb-6">
                    <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" className="block" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
