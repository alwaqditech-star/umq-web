"use client";

import { Suspense } from "react";
import { Footer } from "@/components/layouts/footer";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { MobileTopBar } from "@/components/navigation/mobile-top-bar";
import { TopFloatingNav } from "@/components/navigation/top-floating-nav";
import { NavigationProgress } from "@/components/navigation/navigation-progress";
import { PageTransition } from "@/components/navigation/page-transition";
import { useUiStore, type Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function PublicLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const navPending = useUiStore((s) => s.navPending);

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <MobileTopBar locale={locale} />
      <TopFloatingNav locale={locale} />
      <main
        className={cn(
          "flex-1 pt-14 pb-24 transition-opacity duration-200 lg:pb-0 lg:pt-16",
          navPending && "pointer-events-none opacity-60",
        )}
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer locale={locale} />
      <BottomNav locale={locale} />
    </div>
  );
}
