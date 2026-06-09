"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Home,
  LayoutGrid,
  Mail,
  Rocket,
  User,
  type LucideIcon,
} from "lucide-react";
import { FastNavLink } from "@/components/navigation/fast-nav-link";
import {
  floatingNavShellClassName,
  NavDivider,
} from "@/components/navigation/floating-nav-shared";
import { NavUtilities } from "@/components/navigation/nav-utilities";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const desktopNavItems = [
  { key: "home", path: "", icon: Home, exact: true },
  { key: "about", path: "/about", icon: User, exact: false },
  { key: "services", path: "/services", icon: LayoutGrid, exact: false },
  { key: "projects", path: "/projects", icon: Rocket, exact: false },
  { key: "blog", path: "/blog", icon: BookOpen, exact: false },
  { key: "contact", path: "/contact", icon: Mail, exact: false },
] as const;

function NavLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <FastNavLink
      href={href}
      className={cn(
        "relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-foreground-muted hover:text-foreground",
      )}
    >
      {active ? (
        <motion.span
          layoutId="top-nav-active"
          className="absolute inset-0 rounded-full bg-muted/35"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      ) : null}
      <Icon
        className={cn(
          "relative z-10 h-3.5 w-3.5 shrink-0",
          active ? "opacity-90" : "opacity-60",
        )}
        strokeWidth={1.75}
        aria-hidden
      />
      <span className="relative z-10">{children}</span>
    </FastNavLink>
  );
}

export function TopFloatingNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden justify-center px-4 pt-4 lg:flex"
      aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}
    >
      <div
        className={cn(
          floatingNavShellClassName(),
          "pointer-events-auto justify-center px-2 py-1.5 sm:px-3",
        )}
      >
        <div className="flex items-center gap-0.5">
          <div className="flex items-center gap-0.5" role="menubar">
            {desktopNavItems.map(({ key, path, icon, exact }) => {
              const href = localePath(locale, path);
              const active = exact
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
              const label = dict.nav[key as keyof typeof dict.nav];

              return (
                <NavLink key={key} href={href} active={active} icon={icon}>
                  {label}
                </NavLink>
              );
            })}
          </div>

          <NavDivider />
          <NavUtilities locale={locale} showDivider={false} />
        </div>
      </div>
    </motion.nav>
  );
}
