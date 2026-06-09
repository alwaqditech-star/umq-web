"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/public/page-header";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { ProjectImageCarousel } from "@/components/projects/project-image-carousel";
import { AnimatedActionLink } from "@/components/ui/animated-action-link";
import { AnimatedTechPill } from "@/components/ui/animated-tech-pill";
import type { Project } from "@/lib/api/types";
import { getDictionary, localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

function ProjectCard({
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
      <div className="overflow-hidden rounded-[1.75rem] bg-muted/20 shadow-[0_8px_30px_rgb(15_36_77_/_0.06)] ring-1 ring-border/40">
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
        <h2 className="mt-1 text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {title}
        </h2>
        {summary ? (
          <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted sm:text-[0.9375rem]">
            {summary}
          </p>
        ) : null}

        {project.technologies.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((tech, i) => (
              <AnimatedTechPill key={tech} label={tech} index={i} />
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-start gap-3">
          <AnimatedActionLink href={detailHref} variant="primary" index={0}>
            {locale === "ar" ? "عرض المشروع" : "View project"}
          </AnimatedActionLink>
          <AnimatedActionLink href={contactHref} variant="secondary" index={1}>
            {locale === "ar" ? "اطلب عرض سعر" : "Request a quote"}
          </AnimatedActionLink>
        </div>
      </div>
    </article>
  );
}

export function ProjectsPageClient({
  locale,
  projects,
}: {
  locale: Locale;
  projects: Project[];
}) {
  const p = getDictionary(locale).pages;
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(projects.map((pr) => pr.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const filtered =
    category === "all"
      ? projects
      : projects.filter((pr) => pr.category === category);

  return (
    <>
      <PageHeader
        kicker={p.projectsKicker}
        title={p.projectsTitle}
        description={p.projectsDesc}
      />
      <div className="container-umq py-14 sm:py-20">
        {categories.length > 1 ? (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  category === cat
                    ? "bg-primary text-light"
                    : "border border-border/70 bg-surface text-foreground-muted hover:text-foreground",
                )}
              >
                {cat === "all" ? (locale === "ar" ? "الكل" : "All") : cat}
              </button>
            ))}
          </div>
        ) : null}

        <StaggerList className="mx-auto grid max-w-2xl gap-14 sm:gap-16 lg:max-w-none lg:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
          {filtered.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} locale={locale} />
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </>
  );
}
