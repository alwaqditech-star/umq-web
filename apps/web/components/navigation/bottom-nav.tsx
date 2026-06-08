"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Home, LayoutGrid, Mail, Rocket, User } from "lucide-react";
import { FastNavLink } from "@/components/navigation/fast-nav-link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { publicNavLinks } from "@/lib/public-nav";
import { useSectionEnabled } from "@/providers/site-config-provider";
import type { Locale } from "@/stores/ui-store";
import { floatingNavShellClassName } from "@/components/navigation/floating-nav-shared";
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
  const blogEnabled = useSectionEnabled("blog");

  const enabledPaths = new Set(
    publicNavLinks
      .filter(
        (l) => !l.sectionKey || (l.sectionKey === "blog" ? blogEnabled : true),
      )
      .map((l) => l.path),
  );

  const items = bottomNavItems.filter((item) => enabledPaths.has(item.path));

  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="bottom-nav-safe fixed inset-x-0 bottom-0 z-50 px-4 pb-4 lg:hidden"
      aria-label={locale === "ar" ? "التنقل السفلي" : "Bottom navigation"}
    >
      <div
        className={cn(
          floatingNavShellClassName(),
          "mx-auto max-w-lg justify-between",
        )}
      >
        {items.map(({ key, path, icon: Icon, matchPrefix }) => {
          const href = localePath(locale, path);
          const active =
            pathname === href ||
            (matchPrefix && pathname.startsWith(`${href}/`));

          return (
            <FastNavLink
              key={key}
              href={href}
              matchPrefix={matchPrefix}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-foreground"
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
              <motion.span
                className="relative z-10"
                whileTap={{ scale: 0.88 }}
                animate={active ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                <Icon
                  className={cn(
                    "h-[1.15rem] w-[1.15rem]",
                    active && "text-foreground",
                  )}
                  strokeWidth={active ? 2.25 : 1.75}
                  aria-hidden
                />
              </motion.span>
            </FastNavLink>
          );
        })}
      </div>
    </motion.nav>
  );
}
