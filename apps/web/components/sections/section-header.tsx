"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { heroContainer, heroItem } from "@/lib/animations";
import type { Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function SectionHeader({
  locale,
  kicker,
  title,
  description,
  href,
  linkLabel,
  className,
}: {
  locale: Locale;
  kicker: string;
  title: string;
  description?: string;
  href: string;
  linkLabel: string;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -5% 0px" });
  const reduceMotion = useReducedMotion();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const slideFrom = locale === "ar" ? -24 : 24;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end",
        className,
      )}
    >
      <motion.div
        variants={reduceMotion ? undefined : heroContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={inView ? "visible" : "hidden"}
        className="max-w-2xl"
      >
        <motion.span
          variants={reduceMotion ? undefined : heroItem}
          className="section-kicker inline-flex"
        >
          {kicker}
        </motion.span>
        <motion.h2
          variants={reduceMotion ? undefined : heroItem}
          className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          <span className="text-gradient">{title}</span>
        </motion.h2>
        {description ? (
          <motion.p
            variants={reduceMotion ? undefined : heroItem}
            className="mt-3 text-base text-foreground-muted sm:text-lg"
          >
            {description}
          </motion.p>
        ) : null}
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: slideFrom }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full sm:w-auto"
      >
        <Link href={href} className="group inline-flex w-full sm:w-auto">
          <motion.span
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition-colors duration-200 group-hover:border-accent/55 group-hover:bg-accent/20 group-hover:text-accent group-hover:shadow-[0_8px_24px_rgb(72_134_149_/_0.2)] sm:w-auto"
          >
            {linkLabel}
            <Arrow
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              aria-hidden
            />
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}
