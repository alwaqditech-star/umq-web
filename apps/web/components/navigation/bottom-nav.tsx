"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Home, LayoutGrid, Mail, Rocket, User } from "lucide-react";
import { FastNavLink } from "@/components/navigation/fast-nav-link";
import { NavUtilities } from "@/components/navigation/nav-utilities";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  { key: "home", path: "", icon: Home, matchPrefix: false },
  { key: "about", path: "/about", icon: User, matchPrefix: true },
  { key: "services", path: "/services", icon: LayoutGrid, matchPrefix: true },
  { key: "projects", path: "/projects", icon: Rocket, matchPrefix: true },
  { key: "blog", path: "/blog", icon: BookOpen, matchPrefix: true },
  { key: "contact", path: "/contact", icon: Mail, matchPrefix: true },
] as const;

export function BottomNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="bottom-nav-safe fixed inset-x-0 bottom-0 z-50 flex justify-center px-8 pb-3 lg:hidden"
      aria-label={locale === "ar" ? "التنقل السفلي" : "Bottom navigation"}
    >
      <div
        className={cn(
          "flex w-fit items-center gap-0.5",
          "rounded-full border border-border/70 bg-surface/95 px-1.5 py-1",
          "shadow-[0_4px_20px_rgb(15_36_77_/_0.1)] backdrop-blur-xl",
          "[data-theme='dark']:shadow-[0_4px_20px_rgb(0_0_0_/_0.35)]",
        )}
      >
        <div className="flex items-center gap-0">
          {bottomNavItems.map(({ key, path, icon: Icon, matchPrefix }) => {
            const href = localePath(locale, path);
            const active =
              pathname === href ||
              (matchPrefix && pathname.startsWith(`${href}/`));

            return (
              <FastNavLink
                key={key}
                href={href}
                matchPrefix={matchPrefix}
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-foreground"
                aria-label={dict.nav[key as keyof typeof dict.nav]}
              >
                {active ? (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-full bg-muted/35"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                ) : null}
                <Icon
                  className={cn(
                    "relative z-10 h-4 w-4",
                    active && "text-foreground",
                  )}
                  strokeWidth={active ? 2.25 : 1.75}
                  aria-hidden
                />
              </FastNavLink>
            );
          })}
        </div>

        <NavUtilities locale={locale} compact />
      </div>
    </motion.nav>
  );
}
