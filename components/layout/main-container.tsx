"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isHiddenRoute = 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register');

  return (
    <main className={cn("min-h-screen flex flex-col", !isHiddenRoute && "pt-16")}>
      {children}
    </main>
  );
}
