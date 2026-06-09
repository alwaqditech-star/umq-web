"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function AnimatedActionLink({
  href,
  variant = "primary",
  index = 0,
  className,
  children,
  external,
}: {
  href: string;
  variant?: "primary" | "secondary";
  index?: number;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const classes = cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold",
    variant === "primary"
      ? "bg-primary text-light"
      : "border border-border/80 bg-surface text-foreground",
    className,
  );

  const content = (
    <>
      <span
        className="tech-pill-shimmer pointer-events-none"
        style={{ animationDelay: `${(index % 6) * 0.55}s` }}
        aria-hidden
      />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
