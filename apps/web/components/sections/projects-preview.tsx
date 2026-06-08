"use client";

import Image from "next/image";
import Link from "next/link";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/sections/section-header";
import type { Project } from "@/lib/api/types";
import { localized, getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { isProxiedMediaUrl, resolveMediaUrl } from "@/lib/media-url";
import type { Locale } from "@/stores/ui-store";

export function ProjectsPreview({
  locale,
  projects,
}: {
  locale: Locale;
  projects: Project[];
}) {
  const dict = getDictionary(locale);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="section-alt border-y border-border/50 py-20 sm:py-24">
      <div className="container-umq">
        <SectionHeader
          locale={locale}
          kicker={locale === "ar" ? "أعمالنا" : "Portfolio"}
          title={dict.sections.projects}
          description={
            locale === "ar" ? "أعمال نفخر بها." : "Work we're proud of."
          }
          href={localePath(locale, "/projects")}
          linkLabel={dict.cta.viewAll}
        />
        <StaggerList className="mt-10 grid gap-6 lg:grid-cols-3">
          {featured.map((project) => {
            const coverSrc = resolveMediaUrl(project.coverImageUrl);
            return (
              <StaggerItem key={project.id}>
                <Card hover elevated className="h-full overflow-hidden p-0">
                  <Link href={localePath(locale, `/projects/${project.slug}`)}>
                    <div className="relative aspect-[16/10] bg-accent/10">
                      {coverSrc ? (
                        <Image
                          src={coverSrc}
                          alt={localized(locale, project, "titleAr", "titleEn")}
                          fill
                          className="object-cover"
                          sizes="(max-width:1024px) 100vw, 33vw"
                          unoptimized={isProxiedMediaUrl(coverSrc)}
                        />
                      ) : null}
                    </div>
                    <div className="p-6">
                      <Badge variant="accent">{project.category}</Badge>
                      <h3 className="mt-4 text-xl font-semibold">
                        {localized(locale, project, "titleAr", "titleEn")}
                      </h3>
                      <p className="mt-2 text-sm text-foreground-muted line-clamp-2">
                        {localized(locale, project, "summaryAr", "summaryEn")}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((t) => (
                          <Badge key={t} variant="default">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </div>
    </section>
  );
}
