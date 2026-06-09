"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { Locale } from "@/stores/ui-store";

const stats = (locale: Locale) =>
  locale === "ar"
    ? [
        { value: "97K+", label: "مستخدم نشط" },
        { value: "60+", label: "مشروع مكتمل" },
        { value: "99%", label: "رضا العملاء" },
        { value: "24/7", label: "دعم فني" },
      ]
    : [
        { value: "97K+", label: "Active users" },
        { value: "60+", label: "Projects delivered" },
        { value: "99%", label: "Client satisfaction" },
        { value: "24/7", label: "Technical support" },
      ];

export function StatisticsSection({ locale }: { locale: Locale }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -5% 0px" });
  const reduceMotion = useReducedMotion();
  const items = stats(locale);

  return (
    <section className="px-4 py-14 sm:py-20">
      <motion.div
        ref={ref}
        variants={reduceMotion ? undefined : staggerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={inView ? "visible" : "hidden"}
        className="mx-auto max-w-lg"
      >
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          {locale === "ar" ? "إنجازاتنا" : "Our achievements"}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-12 sm:gap-x-10 sm:gap-y-12">
          {items.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="text-center"
            >
              <p className="text-[1.75rem] font-bold leading-none text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2.5 text-sm leading-snug text-foreground-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
