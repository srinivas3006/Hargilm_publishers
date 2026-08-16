"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export function PasswordStrengthIndicator({ password = "" }: PasswordStrengthIndicatorProps) {
  const analysis = useMemo(() => {
    const minLength = password.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMixCases = /[a-z]/.test(password) && /[A-Z]/.test(password);

    let score = 0;
    if (password.length > 0) score += 1;
    if (minLength) score += 1;
    if (hasNumberOrSymbol) score += 1;
    if (hasMixCases) score += 1;

    let label = "Weak";
    let colorClass = "bg-rose-500";

    if (score === 2) {
      label = "Fair";
      colorClass = "bg-amber-500";
    } else if (score === 3) {
      label = "Good";
      colorClass = "bg-blue-500";
    } else if (score === 4) {
      label = "Strong";
      colorClass = "bg-emerald-500";
    }

    return {
      score,
      label,
      colorClass,
      minLength,
      hasNumberOrSymbol,
      hasMixCases,
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2 text-xs">
      {/* Strength Bar */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1 grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-muted">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-full transition-all duration-300 ${
                step <= analysis.score ? analysis.colorClass : "bg-transparent"
              }`}
            />
          ))}
        </div>
        <span className="font-semibold shrink-0 text-muted-foreground w-12 text-right">
          {analysis.label}
        </span>
      </div>

      {/* Criteria check items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-muted-foreground pt-0.5">
        <div className="flex items-center gap-1">
          {analysis.minLength ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <X className="h-3 w-3 text-muted-foreground/60" />
          )}
          <span className={analysis.minLength ? "text-foreground font-medium" : ""}>
            At least 8 characters
          </span>
        </div>

        <div className="flex items-center gap-1">
          {analysis.hasMixCases ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <X className="h-3 w-3 text-muted-foreground/60" />
          )}
          <span className={analysis.hasMixCases ? "text-foreground font-medium" : ""}>
            Upper & lowercase letters
          </span>
        </div>

        <div className="flex items-center gap-1 sm:col-span-2">
          {analysis.hasNumberOrSymbol ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <X className="h-3 w-3 text-muted-foreground/60" />
          )}
          <span className={analysis.hasNumberOrSymbol ? "text-foreground font-medium" : ""}>
            Contains number or special symbol
          </span>
        </div>
      </div>
    </div>
  );
}
