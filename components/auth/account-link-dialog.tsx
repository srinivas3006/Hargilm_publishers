"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Lock, ShieldAlert, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountLinkDialogProps {
  isOpen: boolean;
  type: "link_required" | "user_inactive" | null;
  email?: string;
  onClose: () => void;
  onSwitchToPasswordLogin?: (email?: string) => void;
}

export function AccountLinkDialog({
  isOpen,
  type,
  email,
  onClose,
  onSwitchToPasswordLogin,
}: AccountLinkDialogProps) {
  if (!isOpen || !type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md p-6 overflow-hidden border bg-card rounded-2xl shadow-xl border-border/80"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {type === "link_required" ? (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  Existing Account Found
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  An HM account already exists for{" "}
                  {email ? (
                    <strong className="text-foreground font-semibold">{email}</strong>
                  ) : (
                    "this email address"
                  )}
                  .
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Account Security Boundary</span>
                </div>
                <p className="leading-relaxed opacity-90">
                  Google identity is not linked to this existing account yet. Please sign in using your existing HM email & password to access your dashboard.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    onClose();
                    if (onSwitchToPasswordLogin) {
                      onSwitchToPasswordLogin(email);
                    }
                  }}
                  className="w-full gap-2 shadow-sm font-medium"
                >
                  <span>Sign In with Password</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button onClick={onClose} variant="ghost" className="w-full text-muted-foreground">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <ShieldAlert className="h-6 w-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  Account Inactive
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your HM user account is currently inactive or suspended. Access to services has been temporarily restricted.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    window.location.href = "mailto:support@harglimpublishers.com";
                  }}
                  variant="destructive"
                  className="w-full"
                >
                  Contact Support
                </Button>
                <Button onClick={onClose} variant="outline" className="w-full">
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
