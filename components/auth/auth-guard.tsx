"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export function AuthGuard({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        // Redirect to login and save the original destination
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (requiredRole && user?.role !== requiredRole) {
        // Redirect to their default dashboard or home if wrong role
        if (user?.role === 'author') {
          router.push('/author');
        } else if (user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [mounted, isAuthenticated, isLoading, router, pathname, requiredRole, user]);

  // Show a generic full-screen loader while checking auth state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Verifying session...</p>
        </div>
      </div>
    );
  }

  // Prevent flashing of protected content before redirect
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null; 
  }

  return <>{children}</>;
}
