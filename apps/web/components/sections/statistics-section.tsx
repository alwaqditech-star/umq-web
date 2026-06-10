"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  getAchievementsSectionTitle,
  getAchievementStats,
} from "@/lib/achievements-stats";
import type { Locale } from "@/stores/ui-store";

export function StatisticsSection({ locale }: { locale: Locale }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -5% 0px" });
  const reduceMotion = useReducedMotion();
  const items = getAchievementStats(locale);

  return (
    <section className="px-4 py-14 sm:py-20">
      <motion.div
        ref={ref}
        variants={reduceMotion ? undefined : staggerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={inView ? "visible" : "hidden"}
        className="mx-auto max-w-3xl"
      >
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          {getAchievementsSectionTitle(locale)}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-12 sm:gap-x-10 sm:gap-y-14">
          {items.map((stat) => (
            <motion.div
              key={stat.title}
              variants={staggerItem}
              className="text-center"
            >
              <p className="text-sm font-bold leading-snug text-foreground sm:text-base">
                {stat.title}
              </p>
              <p className="mt-2 text-[1.75rem] font-bold leading-none text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-foreground-muted sm:text-sm">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
