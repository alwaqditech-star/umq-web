"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { ProjectImageCarousel } from "@/components/projects/project-image-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/api/types";
import { getDictionary, localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { getProjectImages } from "@/lib/media-url";
import type { Locale } from "@/stores/ui-store";

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
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "primary" : "secondary"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat === "all" ? (locale === "ar" ? "الكل" : "All") : cat}
            </Button>
          ))}
        </div>

        <StaggerList className="grid gap-8 lg:grid-cols-2">
          {filtered.map((project) => {
            const title = localized(locale, project, "titleAr", "titleEn");
            const imageCount = getProjectImages(project).length;

            return (
              <StaggerItem key={project.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl">
                  <Link
                    href={localePath(locale, `/projects/${project.slug}`)}
                    className="relative block overflow-hidden"
                  >
                    <ProjectImageCarousel
                      project={project}
                      alt={title}
                      variant="card"
                      intervalMs={4000}
                      className="transition-transform duration-500"
                    />
                    {project.featured && (
                      <span className="absolute start-3 top-3 z-10 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        {locale === "ar" ? "مميز" : "Featured"}
                      </span>
                    )}
                    {imageCount > 1 && (
                      <span className="absolute end-3 bottom-10 z-10 rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                        {imageCount} {locale === "ar" ? "صور" : "photos"}
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {project.category && (
                          <Badge variant="accent" className="mb-3">
                            {project.category}
                          </Badge>
                        )}
                        <h2 className="text-xl font-bold leading-snug transition-colors group-hover:text-accent sm:text-2xl">
                          <Link
                            href={localePath(locale, `/projects/${project.slug}`)}
                          >
                            {title}
                          </Link>
                        </h2>
                      </div>
                      <Link
                        href={localePath(locale, `/projects/${project.slug}`)}
                        className="shrink-0 rounded-full border border-border p-2 text-foreground-muted transition-colors hover:border-accent hover:text-accent"
                        aria-label={title}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted line-clamp-3">
                      {localized(locale, project, "summaryAr", "summaryEn")}
                    </p>

                    {project.clientName && (
                      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-foreground-muted/80">
                        {locale === "ar" ? "العميل" : "Client"} ·{" "}
                        {project.clientName}
                      </p>
                    )}

                    {project.technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="default" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </div>
    </>
  );
}
