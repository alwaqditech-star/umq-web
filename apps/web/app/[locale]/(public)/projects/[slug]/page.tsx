import { api } from "@/lib/api";
import { FadeUp } from "@/components/motion/fade-up";
import { BackLink } from "@/components/navigation/back-link";
import { ProjectDetailGallery } from "@/components/projects/project-detail-gallery";
import { ProjectTechnologies } from "@/components/projects/project-technologies";
import { Badge } from "@/components/ui/badge";
import { localized } from "@/lib/i18n/dictionaries";
import { isValidLocale, localePath } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";
import type { Locale } from "@/stores/ui-store";

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  let project;
  try {
    project = await api.projects.getBySlug!(slug);
  } catch {
    notFound();
  }

  const title = localized(locale, project, "titleAr", "titleEn");

  return (
    <article className="container-umq py-12 sm:py-16">
      <FadeUp>
        <BackLink
          locale={locale}
          href={localePath(locale, "/projects")}
          label={locale === "ar" ? "العودة للمشاريع" : "Back to projects"}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <ProjectDetailGallery project={project} alt={title} />

            <h1 className="mt-8 text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground-muted">
              {localized(locale, project, "summaryAr", "summaryEn")}
            </p>

            {(project.contentAr || project.contentEn) && (
              <div
                className="prose prose-neutral mt-10 max-w-3xl dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html:
                    locale === "ar"
                      ? (project.contentAr ?? "")
                      : (project.contentEn ?? project.contentAr ?? ""),
                }}
              />
            )}
          </div>

          <aside className="space-y-6 rounded-2xl border border-border bg-surface/50 p-6 lg:sticky lg:top-24">
            {project.category && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  {locale === "ar" ? "التصنيف" : "Category"}
                </p>
                <Badge className="mt-2">{project.category}</Badge>
              </div>
            )}

            {project.clientName && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  {locale === "ar" ? "العميل" : "Client"}
                </p>
                <p className="mt-2 font-medium">{project.clientName}</p>
              </div>
            )}

            {project.technologies?.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  {locale === "ar" ? "التقنيات" : "Technologies"}
                </p>
                <ProjectTechnologies technologies={project.technologies} />
              </div>
            )}
          </aside>
        </div>
      </FadeUp>
    </article>
  );
}
