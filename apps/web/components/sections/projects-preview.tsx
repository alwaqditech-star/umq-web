"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { ProjectImageCarousel } from "@/components/projects/project-image-carousel";
import type { Project } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

function FeaturedProjectRow({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const title = localized(locale, project, "titleAr", "titleEn");
  const summary = localized(locale, project, "summaryAr", "summaryEn");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const detailHref = localePath(locale, `/projects/${project.slug}`);

  return (
    <article className="border-b border-border/30 pb-14 last:border-0 last:pb-0">
      <div className="overflow-hidden rounded-3xl border border-border/40 bg-surface">
        <ProjectImageCarousel
          project={project}
          alt={title}
          variant="hero"
          intervalMs={5000}
          className="rounded-none border-0 shadow-none"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
        {summary ? (
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground-muted">
            {summary}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-5">
          <Link
            href={detailHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
          >
            <ExternalLink className="h-4 w-4" />
            {locale === "ar" ? "عرض المشروع" : "View project"}
          </Link>
          <Link
            href={detailHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent"
          >
            {locale === "ar" ? "مزيد من التفاصيل" : "More details"}
            <Arrow className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProjectsPreview({
  locale,
  projects,
}: {
  locale: Locale;
  projects: Project[];
}) {
  const featured = projects.filter((p) => p.featured);
  const display =
    featured.length > 0
      ? featured.slice(0, 4)
      : projects.slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="container-umq">
        <FadeUp>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            {locale === "ar" ? "أعمال مميزة" : "Featured work"}
          </h2>
        </FadeUp>

        <div className="mx-auto mt-12 max-w-3xl space-y-14">
          {display.map((project) => (
            <FadeUp key={project.id}>
              <FeaturedProjectRow project={project} locale={locale} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
