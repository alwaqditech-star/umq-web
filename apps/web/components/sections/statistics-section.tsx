"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { MeshBackground } from "@/components/design/mesh-background";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { Locale } from "@/stores/ui-store";

const stats = (locale: Locale) =>
  locale === "ar"
    ? [
        { value: "50+", label: "مشروع منجز" },
        { value: "15+", label: "قطاع" },
        { value: "99%", label: "رضا العملاء" },
        { value: "24/7", label: "دعم تشغيلي" },
      ]
    : [
        { value: "50+", label: "Projects delivered" },
        { value: "15+", label: "Industries" },
        { value: "99%", label: "Client satisfaction" },
        { value: "24/7", label: "Operations support" },
      ];

export function StatisticsSection({ locale }: { locale: Locale }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -5% 0px" });
  const reduceMotion = useReducedMotion();
  const items = stats(locale);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <MeshBackground variant="subtle" animated />
      <motion.div
        ref={ref}
        variants={reduceMotion ? undefined : staggerContainer}
        initial={reduceMotion ? false : "hidden"}
        animate={inView ? "visible" : "hidden"}
        className="container-umq relative"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="surface-premium rounded-2xl p-8 text-center transition-shadow duration-300 hover:shadow-md"
            >
              <p className="text-3xl font-bold text-gradient sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
