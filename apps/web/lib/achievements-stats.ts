import type { Locale } from "@/stores/ui-store";

export type AchievementStat = {
  title: string;
  value: string;
  description: string;
};

export function getAchievementStats(locale: Locale): AchievementStat[] {
  return locale === "ar"
    ? [
        {
          title: "الخبراء والتقنيين",
          value: "+ 20",
          description:
            "فريق متخصص يجمع بين الخبرة والكفاءة في تقديم الحلول",
        },
        {
          title: "القطاعات",
          value: "+ 15",
          description:
            "تغطية واسعة لقطاعات الأعمال والخدمات المختلفة",
        },
        {
          title: "نسبة رضا العملاء",
          value: "%98",
          description: "ثقة عالية نتيجة تجارب ومشاريع ناجحة",
        },
        {
          title: "سنوات الخبرة",
          value: "+ 5",
          description:
            "خبرة عملية مدعومة بنتائج واضحة وإنجازات ملموسة",
        },
      ]
    : [
        {
          title: "Experts & technicians",
          value: "+ 20",
          description:
            "A specialized team combining experience and efficiency in delivering solutions",
        },
        {
          title: "Sectors",
          value: "+ 15",
          description:
            "Broad coverage across diverse business and service sectors",
        },
        {
          title: "Client satisfaction",
          value: "98%",
          description:
            "High trust built through successful experiences and projects",
        },
        {
          title: "Years of experience",
          value: "+ 5",
          description:
            "Practical experience backed by clear results and tangible achievements",
        },
      ];
}

export function getAchievementsSectionTitle(locale: Locale): string {
  return locale === "ar" ? "إنجازاتنا" : "Our achievements";
}
