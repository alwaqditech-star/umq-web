"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import type { Service } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import { serviceGradientMap, serviceIconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Locale } from "@/stores/ui-store";

function circularOffset(index: number, active: number, length: number) {
  let diff = index - active;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

function ServiceCarouselCard({
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
  const Icon = serviceIconMap[service.icon] ?? Layers;
  const gradient =
    serviceGradientMap[service.icon] ?? "from-accent via-primary to-accent";

  return (
    <motion.div
      layout
      animate={{
        x: offset * 200,
        scale: active ? 1 : 0.78,
        rotateY: offset * -18,
        zIndex: active ? 20 : 10 - Math.abs(offset),
        opacity: Math.abs(offset) > 2 ? 0 : active ? 1 : 0.55,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={cn(
        "absolute start-1/2 top-0 w-[min(88vw,300px)] -translate-x-1/2 sm:w-[320px]",
        "pointer-events-none",
        active && "pointer-events-auto",
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className={cn(
          "overflow-hidden rounded-3xl border bg-surface shadow-2xl transition-shadow duration-300",
          active
            ? "border-accent/25 shadow-accent/10"
            : "border-border/60 shadow-lg",
        )}
      >
        <div
          className={cn(
            "relative flex h-44 items-center justify-center bg-gradient-to-br sm:h-52",
            gradient,
          )}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-md sm:h-28 sm:w-28">
            <Icon className="h-12 w-12 text-white drop-shadow-md sm:h-14 sm:w-14" />
          </div>
        </div>
        <div className="px-6 py-5 text-center">
          <h3 className="text-lg font-bold sm:text-xl">
            {localized(locale, service, "titleAr", "titleEn")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted line-clamp-2">
            {localized(locale, service, "summaryAr", "summaryEn")}
          </p>
        </div>
      </div>
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

  return (
    <div
      className="relative mx-auto max-w-5xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative ring hint */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/20 sm:h-[400px] sm:w-[400px]"
        aria-hidden
      />

      <div
        className="relative mx-auto h-[380px] max-w-full sm:h-[420px]"
        style={{ perspective: "1400px" }}
      >
        <AnimatePresence mode="popLayout">
          {services.map((service, i) => {
            const offset = circularOffset(i, active, len);
            if (Math.abs(offset) > 2) return null;
            return (
              <ServiceCarouselCard
                key={service.id}
                service={service}
                locale={locale}
                active={offset === 0}
                offset={offset}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {len > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(locale === "ar" ? 1 : -1)}
            className="absolute start-0 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-border bg-surface/90 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:flex"
            aria-label={locale === "ar" ? "التالي" : "Previous"}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(locale === "ar" ? -1 : 1)}
            className="absolute end-0 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-border bg-surface/90 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:flex"
            aria-label={locale === "ar" ? "السابق" : "Next"}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-2 flex justify-center gap-2">
            {services.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active
                    ? "w-6 bg-accent"
                    : "w-2 bg-foreground-muted/30 hover:bg-foreground-muted/50",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
