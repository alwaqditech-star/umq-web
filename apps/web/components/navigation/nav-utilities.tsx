"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { NavDivider } from "@/components/navigation/floating-nav-shared";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function NavUtilities({
  locale,
  className,
  showDivider = true,
  compact = false,
}: {
  locale: Locale;
  className?: string;
  showDivider?: boolean;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useUiStore();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchPath =
    pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  const btn = compact ? "h-8 w-8 min-w-8" : "h-10 w-10 min-w-10";
  const icon = compact ? "h-3.5 w-3.5" : "h-[1.1rem] w-[1.1rem]";

  return (
    <div className={cn("flex shrink-0 items-center gap-0", className)}>
      {showDivider ? (
        <span
          className={cn(
            "mx-0.5 w-px shrink-0 bg-border/80",
            compact ? "h-5" : "h-7",
          )}
          aria-hidden
        />
      ) : null}
      <Link
        href={switchPath}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide text-foreground-muted transition-colors hover:bg-muted/25 hover:text-foreground",
          btn,
          compact ? "px-1.5 text-[10px]" : "px-2.5 text-xs",
        )}
      >
        {otherLocale === "ar" ? "EN" : "AR"}
      </Link>
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-muted/25 hover:text-foreground",
          btn,
        )}
        aria-label={locale === "ar" ? "تبديل المظهر" : "Toggle theme"}
      >
        {theme === "light" ? (
          <Moon className={icon} strokeWidth={1.75} />
        ) : (
          <Sun className={icon} strokeWidth={1.75} />
        )}
      </motion.button>
    </div>
  );
}
