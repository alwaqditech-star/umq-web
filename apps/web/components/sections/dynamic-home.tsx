"use client";

import { useMemo } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesPreview } from "@/components/sections/services-preview";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { BlogPreviewSection } from "@/components/sections/blog-preview";
import { PartnersSection } from "@/components/sections/partners-section";
import { TeamSection } from "@/components/sections/team-section";
import { StatisticsSection } from "@/components/sections/statistics-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { SectionReveal } from "@/components/motion/section-reveal";
import { useSiteConfig } from "@/providers/site-config-provider";
import type { BlogPost, Project, Service, Testimonial } from "@/lib/api/types";
import type { Locale } from "@/stores/ui-store";
import type { HomeSectionConfig } from "@/lib/site-config.defaults";

/** إنجازاتنا دائماً قبل أعمال مميزة حتى لو ترتيب قاعدة البيانات مختلف */
function orderHomeBodyKeys(sections: HomeSectionConfig[]): string[] {
  const keys = [...sections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => s.key)
    .filter((key) => key !== "hero");

  const statsIdx = keys.indexOf("statistics");
  const projectsIdx = keys.indexOf("projects");
  if (statsIdx !== -1 && projectsIdx !== -1 && statsIdx > projectsIdx) {
    const reordered = keys.filter((k) => k !== "statistics");
    reordered.splice(projectsIdx, 0, "statistics");
    return reordered;
  }
  return keys;
}

export function DynamicHomeHero({
  locale,
  heroContent,
}: {
  locale: Locale;
  heroContent?: Record<string, string> | null;
}) {
  const { enabledKeys } = useSiteConfig();
  if (!enabledKeys.has("hero")) return null;
  return <HeroSection locale={locale} content={heroContent} />;
}

export function DynamicHomeBody({
  locale,
  services,
  projects,
  testimonials,
  posts,
  partners,
  team,
}: {
  locale: Locale;
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  posts: BlogPost[];
  partners: { id: string; nameAr: string; nameEn: string; url: string }[];
  team: {
    id: string;
    nameAr: string;
    nameEn: string;
    roleAr: string;
    roleEn: string;
    bioAr: string;
    bioEn: string;
  }[];
}) {
  const { sections } = useSiteConfig();

  const orderedKeys = useMemo(() => orderHomeBodyKeys(sections), [sections]);

  const renderSection = (key: string) => {
    switch (key) {
      case "partners":
        return <PartnersSection locale={locale} partners={partners} />;
      case "statistics":
        return <StatisticsSection locale={locale} />;
      case "projects":
        return <ProjectsPreview locale={locale} projects={projects} />;
      case "services":
        return <ServicesPreview locale={locale} services={services} />;
      case "blog":
        return <BlogPreviewSection locale={locale} posts={posts} />;
      case "testimonials":
        return (
          <TestimonialsSection locale={locale} testimonials={testimonials} />
        );
      case "team":
        return <TeamSection locale={locale} members={team} />;
      case "contact_cta":
        return <ContactCtaSection locale={locale} />;
      default:
        return null;
    }
  };

  return (
    <>
      {orderedKeys.map((key) => {
        const node = renderSection(key);
        if (!node) return null;
        return <SectionReveal key={key}>{node}</SectionReveal>;
      })}
    </>
  );
}
