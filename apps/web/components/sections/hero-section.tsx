"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
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
    <section className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16 sm:py-20 lg:min-h-[calc(100vh-10rem)]">
      <motion.div
        variants={reduceMotion ? undefined : heroContainer}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
      >
        <motion.div variants={reduceMotion ? undefined : heroItem}>
          <BrandLogo
            locale={locale}
            size="hero"
            linked={false}
            priority
            className="mx-auto object-center"
          />
        </motion.div>

        <motion.p
          variants={reduceMotion ? undefined : heroItem}
          className="mt-6 max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg"
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
    </section>
  );
}
