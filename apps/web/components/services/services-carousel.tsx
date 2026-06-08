"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import type { Service } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import { serviceIconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Locale } from "@/stores/ui-store";

const DESKTOP_SPREAD = 220;

function circularOffset(index: number, active: number, length: number) {
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

function ServiceCardFace({
  service,
  locale,
  compact,
}: {
  service: Service;
  locale: Locale;
  compact?: boolean;
}) {
  const Icon = serviceIconMap[service.icon] ?? Layers;

  return (
    <div className="overflow-hidden rounded-3xl border border-accent/25 bg-surface shadow-lg">
      <div
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent",
          compact ? "h-36" : "h-44 sm:h-48",
        )}
      >
        <div className="absolute inset-0 bg-primary/10" />
        <div
          className={cn(
            "relative flex items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm",
            compact ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24",
          )}
        >
          <Icon
            className={cn("text-white", compact ? "h-8 w-8" : "h-10 w-10 sm:h-11 sm:w-11")}
          />
        </div>
      </div>
      <div
        className="px-5 py-4 text-center sm:px-6 sm:py-5"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <h3 className="text-base font-bold text-foreground sm:text-xl">
          {localized(locale, service, "titleAr", "titleEn")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground-muted line-clamp-2">
          {localized(locale, service, "summaryAr", "summaryEn")}
        </p>
      </div>
    </div>
  );
}

function CarouselDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mt-5 flex justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1}`}
          onClick={() => onSelect(i)}
          className={cn(
            "h-2 rounded-full transition-all",
            i === active
              ? "w-6 bg-accent"
              : "w-2 bg-muted/50 hover:bg-accent/50",
          )}
        />
      ))}
    </div>
  );
}

function CarouselArrows({
  onPrev,
  onNext,
  locale,
  className,
}: {
  onPrev: () => void;
  onNext: () => void;
  locale: Locale;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <button
        type="button"
        onClick={onPrev}
        className="rounded-full border border-border bg-surface p-2.5 shadow-sm transition-colors hover:border-accent hover:text-accent"
        aria-label={locale === "ar" ? "السابق" : "Previous"}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="rounded-full border border-border bg-surface p-2.5 shadow-sm transition-colors hover:border-accent hover:text-accent"
        aria-label={locale === "ar" ? "التالي" : "Next"}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function DesktopCarouselCard({
  service,
  locale,
  active,
  offset,
}: {
  service: Service;
  locale: Locale;
  active: boolean;
  offset: number;
}) {
  return (
    <motion.div
      animate={{
        x: offset * DESKTOP_SPREAD,
        scale: active ? 1 : 0.82,
        rotateY: offset * -14,
        zIndex: active ? 20 : 10 - Math.abs(offset),
        opacity: Math.abs(offset) > 2 ? 0 : active ? 1 : 0.5,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={cn(
        "absolute top-0 w-[300px]",
        "pointer-events-none",
        active && "pointer-events-auto",
      )}
      style={{
        left: "50%",
        marginLeft: -150,
        transformStyle: "preserve-3d",
      }}
    >
      <ServiceCardFace service={service} locale={locale} />
    </motion.div>
  );
}

export function ServicesCarousel({
  services,
  locale,
}: {
  services: Service[];
  locale: Locale;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = services.length;

  const go = useCallback(
    (delta: number) => {
      if (len <= 1) return;
      setActive((i) => (i + delta + len) % len);
    },
    [len],
  );

  useEffect(() => {
    if (len <= 1 || paused) return;
    const timer = setInterval(() => go(1), 4500);
    return () => clearInterval(timer);
  }, [len, paused, go]);

  if (len === 0) return null;

  const current = services[active]!;

  return (
    <div
      className="w-full overflow-x-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mobile: single centered card — no 3D spread (fixes RTL overflow) */}
      <div className="px-4 sm:hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: locale === "ar" ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: locale === "ar" ? 24 : -24 }}
            transition={{ duration: 0.35 }}
            className="mx-auto w-full max-w-sm"
          >
            <ServiceCardFace service={current} locale={locale} compact />
          </motion.div>
        </AnimatePresence>

        {len > 1 && (
          <>
            <CarouselArrows
              onPrev={() => go(-1)}
              onNext={() => go(1)}
              locale={locale}
              className="mt-5"
            />
            <CarouselDots count={len} active={active} onSelect={setActive} />
          </>
        )}
      </div>

      {/* Desktop: 3D carousel */}
      <div className="relative mx-auto hidden max-w-4xl px-4 sm:block">
        <div dir="ltr" className="relative">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/25"
            aria-hidden
          />

          <div
            className="relative mx-auto h-[400px]"
            style={{ perspective: "1200px" }}
          >
            {services.map((service, i) => {
              const offset = circularOffset(i, active, len);
              if (Math.abs(offset) > 2) return null;
              return (
                <DesktopCarouselCard
                  key={service.id}
                  service={service}
                  locale={locale}
                  active={offset === 0}
                  offset={offset}
                />
              );
            })}
          </div>

          {len > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-border bg-surface/95 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                aria-label={locale === "ar" ? "السابق" : "Previous"}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-border bg-surface/95 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
                aria-label={locale === "ar" ? "التالي" : "Next"}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {len > 1 && (
          <CarouselDots count={len} active={active} onSelect={setActive} />
        )}
      </div>
    </div>
  );
}
