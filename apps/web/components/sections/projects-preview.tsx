"use client";

import { FadeUp } from "@/components/motion/fade-up";
import { ProjectImageCarousel } from "@/components/projects/project-image-carousel";
import { AnimatedActionLink } from "@/components/ui/animated-action-link";
import { AnimatedTechPill } from "@/components/ui/animated-tech-pill";
import type { Project } from "@/lib/api/types";
import { localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

function FeaturedProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const title = localized(locale, project, "titleAr", "titleEn");
  const summary = localized(locale, project, "summaryAr", "summaryEn");
  const detailHref = localePath(locale, `/projects/${project.slug}`);
  const contactHref = localePath(locale, "/contact");

  return (
    <article className="group">
      <div className="overflow-hidden rounded-[1.75rem] bg-muted/20 shadow-[0_8px_30px_rgb(15_36_77_/_0.06)] ring-1 ring-border/40 transition-shadow duration-300 group-hover:shadow-[0_12px_40px_rgb(15_36_77_/_0.1)]">
        <ProjectImageCarousel
          project={project}
          alt={title}
          variant="card"
          intervalMs={5000}
          className="rounded-none border-0 shadow-none ring-0"
        />
      </div>

      <div className="mt-5 px-0.5 sm:mt-6">
        {project.category ? (
          <p className="text-xs font-medium text-foreground-muted/80">
            {project.category}
          </p>
        ) : null}
        <h3 className="mt-1 text-lg font-bold leading-snug text-foreground sm:text-xl">
          {title}
        </h3>
        {summary ? (
          <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted sm:text-[0.9375rem]">
            {summary}
          </p>
        ) : null}

        {project.technologies.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <AnimatedTechPill key={tech} label={tech} index={i} />
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-start gap-3">
          <AnimatedActionLink href={detailHref} variant="primary" index={0}>
            {locale === "ar" ? "عرض المشروع" : "View project"}
          </AnimatedActionLink>
          <AnimatedActionLink href={contactHref} variant="secondary" index={1}>
            {locale === "ar" ? "مزيد من التفاصيل" : "More details"}
          </AnimatedActionLink>
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
    featured.length > 0 ? featured.slice(0, 4) : projects.slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="px-4 pb-16 pt-4 sm:pb-24 sm:pt-6">
      <div className="mx-auto max-w-xl">
        <FadeUp>
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            {locale === "ar" ? "أعمال مميزة" : "Featured work"}
          </h2>
        </FadeUp>

        <div className="mt-10 space-y-14 sm:mt-12 sm:space-y-16">
          {display.map((project) => (
            <FadeUp key={project.id}>
              <FeaturedProjectCard project={project} locale={locale} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
