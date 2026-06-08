/**
 * Client-safe site config defaults (no server-only or node:crypto imports).
 */

export interface HomeSectionConfig {
  key: string;
  labelAr: string;
  labelEn: string;
  sortOrder: number;
}

export interface ContactInfoSettings {
  email: string;
  phone: string;
  whatsapp: string;
  xUrl?: string;
  addressAr: string;
  addressEn: string;
  hoursAr: string;
  hoursEn: string;
  mapUrl?: string;
  mapEmbedUrl?: string;
}

const MAKKAH_MAP_QUERY = "مكة المكرمة، المملكة العربية السعودية";

const SECTION_DEFAULTS: Record<
  string,
  { labelAr: string; labelEn: string; sortOrder: number }
> = {
  hero: { labelAr: "الواجهة الرئيسية", labelEn: "Hero", sortOrder: 0 },
  services: { labelAr: "الخدمات", labelEn: "Services", sortOrder: 10 },
  projects: { labelAr: "المشاريع", labelEn: "Projects", sortOrder: 20 },
  blog: { labelAr: "المدونة", labelEn: "Blog", sortOrder: 30 },
  testimonials: {
    labelAr: "آراء العملاء",
    labelEn: "Testimonials",
    sortOrder: 40,
  },
  partners: { labelAr: "الشركاء", labelEn: "Partners", sortOrder: 50 },
  team: { labelAr: "الفريق", labelEn: "Team", sortOrder: 60 },
  statistics: { labelAr: "الإحصائيات", labelEn: "Statistics", sortOrder: 70 },
  faq: { labelAr: "الأسئلة الشائعة", labelEn: "FAQ", sortOrder: 80 },
  contact_cta: {
    labelAr: "دعوة للتواصل",
    labelEn: "Contact CTA",
    sortOrder: 90,
  },
};

const SECTION_KEYS = Object.keys(SECTION_DEFAULTS);

export const DEFAULT_HOME_SECTIONS: HomeSectionConfig[] = SECTION_KEYS.map(
  (key) => ({
    key,
    ...SECTION_DEFAULTS[key]!,
  }),
);

export const DEFAULT_CONTACT: ContactInfoSettings = {
  email: "umqTech2026@gmail.com",
  phone: "+966 55 991 8514",
  whatsapp: "+966559918514",
  xUrl: "https://x.com/UMQTech",
  addressAr: "مكة المكرمة، المملكة العربية السعودية",
  addressEn: "Makkah, Saudi Arabia",
  hoursAr: "الأحد – الخميس، 9 ص – 6 م",
  hoursEn: "Sun – Thu, 9 AM – 6 PM",
  mapUrl: "https://maps.app.goo.gl/oGQYRNwz2bF2ZtXC7",
  mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(MAKKAH_MAP_QUERY)}&hl=ar&z=16&output=embed`,
};

/** عناوين/خرائط قديمة في قاعدة البيانات تُستبدل بموقع مكة الافتراضي */
const LEGACY_LOCATION_RE =
  /جدة|jeddah|الرياض|riyadh|العليا|olaya|kingdom\s*cent/i;

function usesLegacyLocation(contact: Partial<ContactInfoSettings>): boolean {
  const haystack = [
    contact.addressAr,
    contact.addressEn,
    contact.mapUrl,
    contact.mapEmbedUrl,
  ]
    .filter(Boolean)
    .join(" ");
  return LEGACY_LOCATION_RE.test(haystack);
}

function resolveLocationFields(
  contact: Partial<ContactInfoSettings>,
): Pick<
  ContactInfoSettings,
  "addressAr" | "addressEn" | "mapUrl" | "mapEmbedUrl"
> {
  if (usesLegacyLocation(contact)) {
    return {
      addressAr: DEFAULT_CONTACT.addressAr,
      addressEn: DEFAULT_CONTACT.addressEn,
      mapUrl: DEFAULT_CONTACT.mapUrl,
      mapEmbedUrl: DEFAULT_CONTACT.mapEmbedUrl,
    };
  }

  return {
    addressAr: contact.addressAr ?? DEFAULT_CONTACT.addressAr,
    addressEn: contact.addressEn ?? DEFAULT_CONTACT.addressEn,
    mapUrl: contact.mapUrl ?? DEFAULT_CONTACT.mapUrl,
    mapEmbedUrl: contact.mapEmbedUrl ?? DEFAULT_CONTACT.mapEmbedUrl,
  };
}

export function parseContactFromPublicSettings(
  data: Record<string, unknown>,
): ContactInfoSettings {
  const contact = (data["contact.info"] ?? {}) as Partial<ContactInfoSettings>;
  const location = resolveLocationFields(contact);

  return {
    email: contact.email ?? DEFAULT_CONTACT.email,
    phone: contact.phone ?? DEFAULT_CONTACT.phone,
    whatsapp: contact.whatsapp ?? DEFAULT_CONTACT.whatsapp,
    xUrl: contact.xUrl ?? DEFAULT_CONTACT.xUrl,
    ...location,
    hoursAr: contact.hoursAr ?? DEFAULT_CONTACT.hoursAr,
    hoursEn: contact.hoursEn ?? DEFAULT_CONTACT.hoursEn,
  };
}
