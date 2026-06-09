"use client";

import { cn } from "@/lib/utils";

export function AnimatedTechPill({
  label,
  index = 0,
  className,
}: {
  label: string;
  index?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tech-pill relative inline-flex overflow-hidden rounded-full border border-border/70 bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm",
        className,
      )}
    >
      <span
        className="tech-pill-shimmer pointer-events-none"
        style={{ animationDelay: `${(index % 6) * 0.55}s` }}
        aria-hidden
      />
      <span className="relative z-10">{label}</span>
    </span>
  );
}
