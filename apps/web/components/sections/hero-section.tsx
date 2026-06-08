"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeshBackground } from "@/components/design/mesh-background";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { heroContainer, heroItem } from "@/lib/animations";
import type { Locale } from "@/stores/ui-store";

export function HeroSection({
  locale,
  content,
}: {
  locale: Locale;
  content?: Record<string, string> | null;
}) {
  const dict = getDictionary(locale);
  const reduceMotion = useReducedMotion();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const headline = content?.headline ?? dict.brandFull;
  const subheadline =
    content?.subheadline ??
    (locale === "ar"
      ? "نبني منصات ومنتجات رقمية بمعايير عالمية — من الاستراتيجية إلى التشغيل."
      : "We build digital platforms and products to global standards — from strategy to operations.");
  const ctaHref = content?.ctaHref ?? "/contact";
  const ctaLabel = content?.ctaLabel ?? dict.cta.getStarted;

  const stats = [
    {
      value: locale === "ar" ? "+50" : "50+",
      label: locale === "ar" ? "مشروع" : "Projects",
    },
    {
      value: locale === "ar" ? "15+" : "15+",
      label: locale === "ar" ? "قطاع" : "Sectors",
    },
    {
      value: locale === "ar" ? "24/7" : "24/7",
      label: locale === "ar" ? "دعم" : "Support",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28 lg:py-36">
      <MeshBackground variant="hero" animated />

      <div className="container-umq relative">
        <motion.div
          variants={reduceMotion ? undefined : heroContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={reduceMotion ? undefined : heroItem}
            className="section-kicker inline-flex"
          >
            {dict.tagline}
          </motion.span>

          <motion.h1
            variants={reduceMotion ? undefined : heroItem}
            className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            <span className="text-gradient">{headline}</span>
          </motion.h1>

          <motion.p
            variants={reduceMotion ? undefined : heroItem}
            className="mt-6 text-lg text-foreground-muted sm:text-xl"
          >
            {subheadline}
          </motion.p>

          <motion.div
            variants={reduceMotion ? undefined : heroItem}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href={localePath(locale, ctaHref)}>
              <Button size="lg" className="border-glow">
                {ctaLabel}
                <Arrow className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={localePath(locale, "/services")}>
              <Button variant="secondary" size="lg">
                {dict.cta.learnMore}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={reduceMotion ? undefined : heroItem}
            className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 rounded-2xl border border-border/80 bg-surface/80 p-6 shadow-md backdrop-blur-sm sm:gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: reduceMotion ? 0 : 0.55 + i * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-gradient sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-foreground-muted sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="footer-gradient-top absolute inset-x-0 bottom-0 h-px origin-center opacity-50"
        aria-hidden
      />
    </section>
  );
}
