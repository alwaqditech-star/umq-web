"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { usePathname } from "next/navigation";
import { FastNavLink } from "@/components/navigation/fast-nav-link";
import { Moon, Sun } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { publicNavLinks } from "@/lib/public-nav";
import { useSectionEnabled } from "@/providers/site-config-provider";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function Navbar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const blogEnabled = useSectionEnabled("blog");
  const pathname = usePathname();
  const navLinks = publicNavLinks.filter(
    (l) => !l.sectionKey || (l.sectionKey === "blog" ? blogEnabled : true),
  );
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useUiStore();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchPath =
    pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-surface transition-shadow duration-300",
        scrolled
          ? "border-border/80 shadow-sm"
          : "border-border/50 shadow-none",
      )}
    >
      <div className="container-umq flex h-[4.5rem] items-center gap-6 sm:h-20 sm:gap-8">
        {/* الشعار — مثل Hwzn على يمين الهيدر في RTL */}
        <BrandLogo
          locale={locale}
          size="md"
          priority
          className="max-w-[7.5rem] shrink-0 sm:max-w-[9.5rem]"
        />

        {/* روابط التنقل — الوسط */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map(({ key, path }) => {
            const href = localePath(locale, path);
            const active =
              pathname === href || (path !== "" && pathname.startsWith(href));
            return (
              <FastNavLink
                key={key}
                href={href}
                matchPrefix={path !== ""}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "font-semibold text-foreground"
                    : "text-foreground-muted hover:text-foreground",
                )}
              >
                {dict.nav[key as keyof typeof dict.nav]}
              </FastNavLink>
            );
          })}
        </nav>

        {/* تواصل + لغة + ثيم */}
        <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden rounded-lg p-2 text-foreground-muted transition-colors hover:bg-muted/30 hover:text-foreground sm:inline-flex"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          <span
            className="hidden h-6 w-px bg-border/80 sm:block"
            aria-hidden
          />

          <FastNavLink
            href={localePath(locale, "/contact")}
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-light shadow-sm transition-all hover:bg-accent/90 hover:shadow-md sm:inline-flex"
          >
            {dict.cta.contactUs}
          </FastNavLink>

          <span
            className="hidden h-6 w-px bg-border/80 sm:block"
            aria-hidden
          />

          <Link
            href={switchPath}
            className="rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground sm:px-4 sm:text-sm"
          >
            {otherLocale === "ar" ? "English" : "العربية"}
          </Link>
        </div>
      </div>
    </header>
  );
}
