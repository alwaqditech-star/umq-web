"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { BrandLogoPlate } from "@/components/brand/brand-logo";
import { FastNavLink } from "@/components/navigation/fast-nav-link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { useUiStore, type Locale } from "@/stores/ui-store";

export function MobileTopBar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const { theme, toggleTheme } = useUiStore();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchPath =
    pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;
  const homeHref = localePath(locale, "");

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-surface/98 backdrop-blur-lg lg:hidden"
    >
      <div className="flex h-14 items-center justify-between px-4">
        <FastNavLink
          href={homeHref}
          matchPrefix={false}
          className="shrink-0 transition-opacity hover:opacity-90"
          aria-label={dict.nav.home}
        >
          <BrandLogoPlate
            locale={locale}
            size="sm"
            linked={false}
            plateClassName="rounded-lg px-2 py-1 shadow-none"
          />
        </FastNavLink>

        <div className="flex items-center gap-1">
          <Link
            href={switchPath}
            className="flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-semibold tracking-wide text-foreground-muted transition-colors hover:bg-muted/25 hover:text-foreground"
          >
            {otherLocale === "ar" ? "EN" : "AR"}
          </Link>

          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-muted/25 hover:text-foreground"
            aria-label={locale === "ar" ? "تبديل المظهر" : "Toggle theme"}
          >
            {theme === "light" ? (
              <Moon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.75} />
            ) : (
              <Sun className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.75} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
