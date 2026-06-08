"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { ProjectImageCarousel } from "@/components/projects/project-image-carousel";
import type { Project } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

export function ProjectsPreview({
  locale,
  projects,
}: {
  locale: Locale;
  projects: Project[];
}) {
  const featured =
    projects.find((p) => p.featured) ?? projects[0] ?? null;

  if (!featured) return null;

  const title = localized(locale, featured, "titleAr", "titleEn");
  const summary = localized(locale, featured, "summaryAr", "summaryEn");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="border-t border-border/30 py-16 sm:py-24">
      <div className="container-umq">
        <FadeUp>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            {locale === "ar" ? "أعمال مميزة" : "Featured work"}
          </h2>
        </FadeUp>

        <FadeUp className="mx-auto mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-border/50 bg-surface shadow-sm">
            <ProjectImageCarousel
              project={featured}
              alt={title}
              variant="hero"
              intervalMs={5000}
              className="rounded-none border-0 shadow-none"
            />
          </div>

          <div className="mt-8 text-center sm:text-start">
            <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
            {summary && (
              <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                {summary}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              <Link
                href={localePath(locale, `/projects/${featured.slug}`)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
              >
                <ExternalLink className="h-4 w-4" />
                {locale === "ar" ? "عرض المشروع" : "View project"}
              </Link>
              <Link
                href={localePath(locale, `/projects/${featured.slug}`)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent"
              >
                {locale === "ar" ? "مزيد من التفاصيل" : "More details"}
                <Arrow className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
