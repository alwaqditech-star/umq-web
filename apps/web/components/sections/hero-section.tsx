"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      ? "نصنع تجارب رقمية استثنائية تحقق النتائج. شريكك الموثوق لحلول تقنية مبتكرة في المملكة العربية السعودية."
      : "We craft exceptional digital experiences that deliver results. Your trusted partner for innovative technology in Saudi Arabia.");

  const primaryHref = content?.ctaHref ?? "/projects";
  const primaryLabel =
    content?.ctaLabel ??
    (locale === "ar" ? "شاهد أعمالنا" : "View our work");
  const secondaryHref = content?.ctaSecondaryHref ?? "/contact";
  const secondaryLabel =
    content?.ctaSecondaryLabel ??
    (locale === "ar" ? "احصل على عرض سعر" : "Get a quote");

  return (
    <section className="border-b border-border/40 py-24 sm:py-32 lg:py-40">
      <div className="container-umq">
        <motion.div
          variants={reduceMotion ? undefined : heroContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            variants={reduceMotion ? undefined : heroItem}
            className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={reduceMotion ? undefined : heroItem}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg"
          >
            {subheadline}
          </motion.p>

          <motion.div
            variants={reduceMotion ? undefined : heroItem}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href={localePath(locale, primaryHref)}>
              <Button size="lg" className="min-w-[10rem] rounded-full">
                {primaryLabel}
                <Arrow className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={localePath(locale, secondaryHref)}>
              <Button
                variant="secondary"
                size="lg"
                className="min-w-[10rem] rounded-full"
              >
                {secondaryLabel}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
