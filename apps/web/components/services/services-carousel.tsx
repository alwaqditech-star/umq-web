"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import type { Service } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import { serviceIconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Locale } from "@/stores/ui-store";

const CARD_WIDTH = 320;
const CARD_HALF = CARD_WIDTH / 2;
const SPREAD = 220;

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

  return (
    <motion.div
      animate={{
        x: offset * SPREAD,
        scale: active ? 1 : 0.82,
        rotateY: offset * -14,
        zIndex: active ? 20 : 10 - Math.abs(offset),
        opacity: Math.abs(offset) > 2 ? 0 : active ? 1 : 0.5,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={cn(
        "absolute top-0 w-[min(88vw,320px)]",
        "pointer-events-none",
        active && "pointer-events-auto",
      )}
      style={{
        left: "50%",
        marginLeft: -CARD_HALF,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={cn(
          "overflow-hidden rounded-3xl border bg-surface shadow-xl transition-shadow duration-300",
          active
            ? "border-accent/30 shadow-accent/15"
            : "border-border/70",
        )}
      >
        <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent sm:h-48">
          <div className="absolute inset-0 bg-primary/10" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm sm:h-24 sm:w-24">
            <Icon className="h-10 w-10 text-white sm:h-11 sm:w-11" />
          </div>
        </div>
        <div className="px-6 py-5 text-center" dir={locale === "ar" ? "rtl" : "ltr"}>
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
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
      className="relative mx-auto w-full max-w-4xl px-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* LTR stage keeps carousel physically centered in RTL pages */}
      <div dir="ltr" className="relative">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/25 sm:h-[380px] sm:w-[380px]"
          aria-hidden
        />

        <div
          className="relative mx-auto h-[380px] sm:h-[400px]"
          style={{ perspective: "1200px" }}
        >
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
        </div>

        {len > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-border bg-surface/95 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:left-2"
              aria-label={locale === "ar" ? "السابق" : "Previous"}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-border bg-surface/95 p-2.5 shadow-md backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:right-2"
              aria-label={locale === "ar" ? "التالي" : "Next"}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {len > 1 && (
        <div className="mt-4 flex justify-center gap-2">
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
                  : "w-2 bg-muted/50 hover:bg-accent/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
