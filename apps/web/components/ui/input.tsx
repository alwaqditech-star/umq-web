"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, hint, id, type, inputMode, dir, ...props },
    ref,
  ) => {
    const inputId = id ?? label?.replace(/\s/g, "-").toLowerCase();
    const forceLtr =
      type === "tel" ||
      type === "email" ||
      type === "url" ||
      inputMode === "tel";

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          inputMode={inputMode}
          dir={forceLtr ? "ltr" : dir}
          className={cn(
            "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground",
            forceLtr && "text-start",
            "placeholder:text-foreground-muted/70",
            "transition-colors duration-200",
            "hover:border-accent/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className={cn("text-xs text-red-600", forceLtr && "ltr-isolate")}
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className={cn(
              "text-xs text-foreground-muted",
              forceLtr && "ltr-isolate",
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
