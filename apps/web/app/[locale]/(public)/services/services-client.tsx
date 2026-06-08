"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { ServicesCarousel } from "@/components/services/services-carousel";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import type { Service } from "@/lib/api/types";
import { getDictionary, localized } from "@/lib/i18n/dictionaries";
import { serviceGradientMap, serviceIconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Locale } from "@/stores/ui-store";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80";

export function ServicesPageClient({
  locale,
  services,
}: {
  locale: Locale;
  services: Service[];
}) {
  const p = getDictionary(locale).pages;

  return (
    <>
      {/* Hero with blurred office background — inspired by mobile mock */}
      <section className="relative overflow-hidden border-b border-border/80">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover opacity-25 blur-[2px] dark:opacity-15"
            sizes="100vw"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface/85 to-surface" />
        </div>

        <div className="container-umq relative py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="section-kicker">{p.servicesKicker}</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">{p.servicesTitle}</span>
            </h1>
            <p className="mt-5 text-lg text-foreground-muted sm:text-xl">
              {p.servicesDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3D carousel */}
      <section className="container-umq py-12 sm:py-16">
        <p className="mb-8 text-center text-sm text-foreground-muted">
          {locale === "ar"
            ? "اسحب أو انتظر — البطاقات تتقلب تلقائياً"
            : "Swipe or wait — cards rotate automatically"}
        </p>
        <ServicesCarousel services={services} locale={locale} />
      </section>

      {/* Full services grid */}
      <section className="border-t border-border/60 bg-surface/30 py-14 sm:py-20">
        <div className="container-umq">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            {locale === "ar" ? "جميع خدماتنا" : "All our services"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-foreground-muted">
            {locale === "ar"
              ? "حلول تقنية متكاملة تغطي التطوير والتصميم والتسويق والأمن."
              : "End-to-end technology: development, design, marketing, and security."}
          </p>

          <StaggerList className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIconMap[service.icon] ?? Layers;
              const gradient =
                serviceGradientMap[service.icon] ??
                "from-accent/80 to-primary/80";

              return (
                <StaggerItem key={service.id}>
                  <article
                    className={cn(
                      "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface",
                      "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-28 items-center justify-center bg-gradient-to-br",
                        gradient,
                      )}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold">
                        {localized(locale, service, "titleAr", "titleEn")}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-muted">
                        {localized(locale, service, "summaryAr", "summaryEn")}
                      </p>
                      {service.featured && (
                        <span className="mt-4 inline-flex w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                          {locale === "ar" ? "خدمة مميزة" : "Featured"}
                        </span>
                      )}
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerList>
        </div>
      </section>
    </>
  );
}
