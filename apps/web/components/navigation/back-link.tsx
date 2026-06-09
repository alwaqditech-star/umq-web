"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/stores/ui-store";

export function BackLink({
  locale,
  href,
  label,
  className,
}: {
  locale: Locale;
  href: string;
  label: string;
  className?: string;
}) {
  const isAr = locale === "ar";

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full",
        "border border-border/70 bg-surface/95 px-4 py-2.5 text-sm font-semibold text-foreground",
        "shadow-[0_2px_12px_rgb(15_36_77_/_0.06)] backdrop-blur-sm",
        "transition-colors hover:border-border hover:bg-surface",
        className,
      )}
    >
      <span className="tech-pill-shimmer pointer-events-none" aria-hidden />
      {isAr ? (
        <>
          <span className="relative z-10">{label}</span>
          <ArrowRight
            className="relative z-10 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </>
      ) : (
        <>
          <ArrowLeft
            className="relative z-10 h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5"
            aria-hidden
          />
          <span className="relative z-10">{label}</span>
        </>
      )}
    </Link>
  );
}
