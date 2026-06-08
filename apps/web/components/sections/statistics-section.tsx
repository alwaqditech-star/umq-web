"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { Locale } from "@/stores/ui-store";

const stats = (locale: Locale) =>
  locale === "ar"
    ? [
        { value: "60+", label: "مشروع مكتمل" },
        { value: "97K+", label: "مستخدم نشط" },
        { value: "99%", label: "رضا العملاء" },
        { value: "24/7", label: "دعم فني" },
      ]
    : [
        { value: "60+", label: "Projects delivered" },
        { value: "97K+", label: "Active users" },
        { value: "99%", label: "Client satisfaction" },
        { value: "24/7", label: "Technical support" },
      ];

export function StatisticsSection({ locale }: { locale: Locale }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -5% 0px" });
  const reduceMotion = useReducedMotion();
  const items = stats(locale);

  return (
    <section className="py-16 sm:py-20">
      <motion.div
        ref={ref}
        variants={reduceMotion ? undefined : staggerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={inView ? "visible" : "hidden"}
        className="container-umq"
      >
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          {locale === "ar" ? "إنجازاتنا" : "Our achievements"}
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-8">
          {items.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="text-center"
            >
              <p className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-foreground-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
