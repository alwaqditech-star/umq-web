/** Registry keys for homepage / global section visibility */
export const HOME_SECTION_KEYS = [
  "hero",
  "services",
  "projects",
  "blog",
  "testimonials",
  "partners",
  "team",
  "statistics",
  "faq",
  "contact_cta",
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export const HOME_SECTION_DEFAULTS: Record<
  HomeSectionKey,
  { labelAr: string; labelEn: string; sortOrder: number }
> = {
  hero: { labelAr: "الواجهة الرئيسية", labelEn: "Hero", sortOrder: 0 },
  partners: { labelAr: "الشركاء", labelEn: "Partners", sortOrder: 10 },
  statistics: { labelAr: "الإحصائيات", labelEn: "Statistics", sortOrder: 20 },
  projects: { labelAr: "المشاريع", labelEn: "Projects", sortOrder: 30 },
  services: { labelAr: "الخدمات", labelEn: "Services", sortOrder: 40 },
  blog: { labelAr: "المدونة", labelEn: "Blog", sortOrder: 50 },
  testimonials: {
    labelAr: "آراء العملاء",
    labelEn: "Testimonials",
    sortOrder: 60,
  },
  team: { labelAr: "الفريق", labelEn: "Team", sortOrder: 70 },
  faq: { labelAr: "الأسئلة الشائعة", labelEn: "FAQ", sortOrder: 80 },
  contact_cta: {
    labelAr: "دعوة للتواصل",
    labelEn: "Contact CTA",
    sortOrder: 90,
  },
};

export const HOME_SECTION_ENABLED_DEFAULT: Record<HomeSectionKey, boolean> = {
  hero: true,
  partners: true,
  statistics: true,
  projects: true,
  services: false,
  blog: false,
  testimonials: false,
  team: false,
  faq: false,
  contact_cta: false,
};

export function isHomeSectionKey(key: string): key is HomeSectionKey {
  return (HOME_SECTION_KEYS as readonly string[]).includes(key);
}
