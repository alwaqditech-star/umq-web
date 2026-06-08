"use client";

import { cn } from "@/lib/utils";

export function NavDivider() {
  return (
    <span
      className="mx-0.5 h-7 w-px shrink-0 bg-border/80"
      aria-hidden
    />
  );
}

export function floatingNavShellClassName(className?: string) {
  return cn(
    "flex items-center gap-0.5",
    "rounded-full border border-border/70 bg-surface/95 px-2 py-2",
    "shadow-[0_8px_32px_rgb(15_36_77_/_0.12)] backdrop-blur-xl",
    "[data-theme='dark']:shadow-[0_8px_32px_rgb(0_0_0_/_0.45)]",
    className,
  );
}
