"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Moon, Sun } from "lucide-react";
import { BrandLogoPlate } from "@/components/brand/brand-logo";
import { FastNavLink } from "@/components/navigation/fast-nav-link";
import {
  floatingNavShellClassName,
  NavDivider,
} from "@/components/navigation/floating-nav-shared";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useSectionEnabled } from "@/providers/site-config-provider";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const desktopNavItems = [
  { key: "home", path: "", sectionKey: null, exact: true },
  { key: "about", path: "/about", sectionKey: null, exact: false },
  { key: "services", path: "/services", sectionKey: null, exact: false },
  { key: "projects", path: "/projects", sectionKey: null, exact: false },
  { key: "blog", path: "/blog", sectionKey: "blog" as const, exact: false },
] as const;

function NavLink({
  href,
  active,
  children,
  className,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FastNavLink
      href={href}
      className={cn(
        "relative shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-foreground-muted hover:text-foreground",
        className,
      )}
    >
      {active ? (
        <motion.span
          layoutId="top-nav-active"
          className="absolute inset-0 rounded-full bg-muted/35"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      ) : null}
      <span className="relative z-10">{children}</span>
    </FastNavLink>
  );
}

export function TopFloatingNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const blogEnabled = useSectionEnabled("blog");
  const { theme, toggleTheme } = useUiStore();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchPath =
    pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  const homeHref = localePath(locale, "");
  const contactHref = localePath(locale, "/contact");
  const contactActive =
    pathname === contactHref || pathname.startsWith(`${contactHref}/`);

  const visibleNavItems = desktopNavItems.filter(
    (item) =>
      !item.sectionKey || (item.sectionKey === "blog" ? blogEnabled : true),
  );

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
          "pointer-events-auto w-full max-w-7xl px-3 py-2 sm:px-5",
        )}
      >
        <div className="relative flex w-full items-center justify-between gap-6">
          {/* Logo — corner (start in RTL = right) */}
          <FastNavLink
            href={homeHref}
            matchPrefix={false}
            className="flex shrink-0 items-center transition-opacity hover:opacity-90"
            aria-label={dict.nav.home}
          >
            <BrandLogoPlate
              locale={locale}
              size="md"
              linked={false}
              plateClassName="px-2 py-1.5"
            />
          </FastNavLink>

          {/* Nav links — centered */}
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-0.5"
            role="menubar"
          >
            {visibleNavItems.map(({ key, path, exact }) => {
              const href = localePath(locale, path);
              const active = exact
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
              const label = dict.nav[key as keyof typeof dict.nav];

              return (
                <NavLink key={key} href={href} active={active}>
                  {label}
                </NavLink>
              );
            })}

            <FastNavLink
              href={contactHref}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                contactActive
                  ? "text-foreground"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              {contactActive ? (
                <motion.span
                  layoutId="top-nav-active"
                  className="absolute inset-0 rounded-full bg-muted/35"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              ) : null}
              <span className="relative z-10">{dict.nav.contact}</span>
              <Mail
                className="relative z-10 h-3.5 w-3.5 opacity-70"
                strokeWidth={1.75}
                aria-hidden
              />
            </FastNavLink>
          </div>

          {/* Utilities — opposite corner (end in RTL = left) */}
          <div className="flex shrink-0 items-center gap-0.5">
            <Link
              href={switchPath}
              className="flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full px-2.5 text-xs font-semibold tracking-wide text-foreground-muted transition-colors hover:bg-muted/25 hover:text-foreground"
            >
              {otherLocale === "ar" ? "EN" : "AR"}
            </Link>

            <NavDivider />

            <motion.button
              type="button"
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-muted/25 hover:text-foreground"
              aria-label={locale === "ar" ? "تبديل المظهر" : "Toggle theme"}
            >
              {theme === "light" ? (
                <Moon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.75} />
              ) : (
                <Sun className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.75} />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
