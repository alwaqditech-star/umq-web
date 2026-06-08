"use client";

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
  const { enabledKeys } = useSiteConfig();
  const show = (key: string) => enabledKeys.has(key);

  return (
    <>
      {show("services") && (
        <SectionReveal>
          <ServicesPreview locale={locale} services={services} />
        </SectionReveal>
      )}
      {show("projects") && (
        <SectionReveal>
          <ProjectsPreview locale={locale} projects={projects} />
        </SectionReveal>
      )}
      {show("statistics") && (
        <SectionReveal>
          <StatisticsSection locale={locale} />
        </SectionReveal>
      )}
      {show("blog") && (
        <SectionReveal>
          <BlogPreviewSection locale={locale} posts={posts} />
        </SectionReveal>
      )}
      {show("testimonials") && (
        <SectionReveal>
          <TestimonialsSection locale={locale} testimonials={testimonials} />
        </SectionReveal>
      )}
      {show("partners") && (
        <SectionReveal>
          <PartnersSection locale={locale} partners={partners} />
        </SectionReveal>
      )}
      {show("team") && (
        <SectionReveal>
          <TeamSection locale={locale} members={team} />
        </SectionReveal>
      )}
      {show("contact_cta") && (
        <SectionReveal>
          <ContactCtaSection locale={locale} />
        </SectionReveal>
      )}
    </>
  );
}
