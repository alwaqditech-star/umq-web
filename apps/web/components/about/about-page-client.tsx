"use client";

import { Globe, Mail } from "lucide-react";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { BrandLogo } from "@/components/brand/brand-logo";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionReveal } from "@/components/motion/section-reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";
import { emailActionHref } from "@/lib/contact-links";
import { useSiteConfig } from "@/providers/site-config-provider";
import type { Locale } from "@/stores/ui-store";
import { AnimatedTechPill } from "@/components/ui/animated-tech-pill";
import { getAchievementStats } from "@/lib/achievements-stats";
import { cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const CONTENT = {
  ar: {
    tagline: "حلول تقنية المعلومات",
    intro: [
      "عُمْق شركة سعودية لحلول تقنية المعلومات، تأسست لتقديم حلول تقنية مبتكرة تلبي احتياجات السوق السعودي. نجمع بين الخبرة المحلية وأفضل الممارسات العالمية.",
      "نختص في بناء المنصات الرقمية، تطبيقات الويب والجوال، والحلول المؤسسية — من الفكرة إلى الإنتاج بمعايير أمان وأداء عالية.",
    ],
    achievementsTitle: "إنجازاتنا",
    servicesTitle: "خدماتنا",
    services: [
      {
        title: "تطوير وتصميم الويب",
        body: "مواقع وتطبيقات ويب حديثة، سريعة، ومتجاوبة باستخدام React و Next.js.",
      },
      {
        title: "تطبيقات الجوال",
        body: "تطبيقات iOS و Android و PWA بتجربة مستخدم سلسة وأداء عالٍ.",
      },
      {
        title: "حلول SaaS والتجارة الإلكترونية",
        body: "منصات اشتراك، متاجر إلكترونية، ولوحات تحكم قابلة للتوسع.",
      },
      {
        title: "تصميم UI/UX",
        body: "واجهات عصرية، أنظمة تصميم، ونماذج أولية تفاعلية (Figma).",
      },
      {
        title: "DevOps والاستضافة السحابية",
        body: "نشر آمن، CI/CD، مراقبة، واستضافة على Vercel و AWS.",
      },
      {
        title: "الذكاء الاصطناعي والأتمتة",
        body: "دمج نماذج AI، chatbots، وأتمتة سير العمل لرفع الكفاءة.",
      },
    ],
    techTitle: "تقنياتنا",
    techGroups: [
      {
        title: "واجهات أمامية",
        body: "نبني تجارب ويب تفاعلية بأحدث أدوات Frontend.",
        tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        title: "خوادم وواجهات برمجية",
        body: "بنية API قوية وآمنة للتطبيقات المؤسسية.",
        tags: ["NestJS", "Node.js", "REST API", "GraphQL", "JWT"],
      },
      {
        title: "قواعد البيانات",
        body: "قواعد بيانات علائقية وNoSQL موثوقة للأنظمة المؤسسية وعالية الأداء.",
        tags: ["MySQL", "PostgreSQL", "MongoDB", "MariaDB", "SQL Server"],
      },
      {
        title: "DevOps وأدوات التطوير",
        body: "سير عمل احترافي من التطوير إلى الإنتاج.",
        tags: ["Docker", "GitHub Actions", "AWS", "Kubernetes", "Turborepo"],
      },
    ],
    email: "Email",
    linkedin: "LinkedIn",
  },
  en: {
    tagline: "Information Technology Solutions",
    intro: [
      "UMQ is a Saudi IT solutions company built to deliver innovative technology for the Saudi market. We combine local expertise with global best practices.",
      "We specialize in digital platforms, web and mobile apps, and enterprise solutions — from idea to production with strong security and performance.",
    ],
    achievementsTitle: "Our achievements",
    servicesTitle: "Our services",
    services: [
      {
        title: "Web development & design",
        body: "Modern, fast, responsive websites and apps with React and Next.js.",
      },
      {
        title: "Mobile applications",
        body: "iOS, Android, and PWA apps with smooth UX and high performance.",
      },
      {
        title: "SaaS & e-commerce",
        body: "Subscription platforms, online stores, and scalable admin dashboards.",
      },
      {
        title: "UI/UX design",
        body: "Modern interfaces, design systems, and interactive Figma prototypes.",
      },
      {
        title: "DevOps & cloud hosting",
        body: "Secure deployment, CI/CD, monitoring, and hosting on Vercel and AWS.",
      },
      {
        title: "AI & automation",
        body: "AI model integration, chatbots, and workflow automation for efficiency.",
      },
    ],
    techTitle: "Our technologies",
    techGroups: [
      {
        title: "Frontend",
        body: "Interactive web experiences with modern frontend tooling.",
        tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        title: "Backend & APIs",
        body: "Robust, secure API architecture for enterprise applications.",
        tags: ["NestJS", "Node.js", "REST API", "GraphQL", "JWT"],
      },
      {
        title: "Databases",
        body: "Reliable relational and NoSQL databases for enterprise-grade systems.",
        tags: ["MySQL", "PostgreSQL", "MongoDB", "MariaDB", "SQL Server"],
      },
      {
        title: "DevOps & tooling",
        body: "Professional workflow from development to production.",
        tags: ["Docker", "GitHub Actions", "AWS", "Kubernetes", "Turborepo"],
      },
    ],
    email: "Email",
    linkedin: "LinkedIn",
  },
} as const;

function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SectionReveal>
      <h2
        className={cn(
          "text-center text-2xl font-bold text-foreground sm:text-[1.75rem] lg:text-start",
          className,
        )}
      >
        {children}
      </h2>
    </SectionReveal>
  );
}

function IdentityBlock({ locale }: { locale: Locale }) {
  const { contact } = useSiteConfig();
  const address = locale === "ar" ? contact.addressAr : contact.addressEn;
  const alignEnd = locale === "ar";

  return (
    <div
      className={cn(
        "flex flex-col",
        alignEnd
          ? "items-center text-center lg:items-end lg:text-end"
          : "items-center text-center lg:items-start lg:text-start",
      )}
    >
      <BrandLogo
        locale={locale}
        size="hero"
        linked={false}
        className="h-[4.5rem] w-auto sm:h-24"
      />
      <p
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 text-sm text-foreground-muted",
          alignEnd ? "lg:justify-end" : "lg:justify-start",
        )}
      >
        <Globe className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        {address}
      </p>
    </div>
  );
}

function SocialPills({
  socials,
  centered = false,
}: {
  socials: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  centered?: boolean;
}) {
  return (
    <StaggerList
      className={cn(
        "flex flex-wrap gap-2",
        centered ? "justify-center" : "justify-center lg:justify-start",
      )}
    >
      {socials.map(({ href, label, icon: Icon }) => (
        <StaggerItem key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:border-foreground/25 hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </a>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}

function BrandHeader({
  locale,
  tagline,
  socials,
  centered = false,
}: {
  locale: Locale;
  tagline: string;
  socials: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  centered?: boolean;
}) {
  const dict = getDictionary(locale);

  return (
    <FadeUp
      className={cn(centered ? "text-center" : "text-center lg:text-start")}
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {dict.brand}
      </h1>
      <p className="mt-2 text-base text-foreground-muted sm:text-lg">
        {tagline}
      </p>
      <div className="mt-5">
        <SocialPills socials={socials} centered={centered} />
      </div>
    </FadeUp>
  );
}

export function AboutPageClient() {
  const locale = useLocale();
  const { contact } = useSiteConfig();
  const copy = CONTENT[locale];

  const socials = [
    {
      href: emailActionHref(contact.email),
      label: copy.email,
      icon: Mail,
    },
    ...(contact.xUrl
      ? [{ href: contact.xUrl, label: "X", icon: XIcon }]
      : []),
    ...(contact.linkedinUrl
      ? [
          {
            href: contact.linkedinUrl,
            label: copy.linkedin,
            icon: LinkedInIcon,
          },
        ]
      : []),
  ];

  return (
    <div className="px-4 pb-16 pt-6 sm:pb-20 sm:pt-10">
      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-16">
        {/* الشعار ثابت — المحتوى فقط يتحرك عند التمرير */}
        <aside className="mb-8 lg:sticky lg:top-24 lg:z-10 lg:mb-0 lg:self-start">
          <IdentityBlock locale={locale} />
        </aside>

        <div className="min-w-0 space-y-14 sm:space-y-16">
          <BrandHeader
            locale={locale}
            tagline={copy.tagline}
            socials={socials}
            centered={false}
          />

          <FadeUp>
            <div className="about-rkiza-card px-5 py-5 sm:px-6 sm:py-6">
              <div className="space-y-4">
                {copy.intro.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="text-sm leading-[1.9] text-foreground-muted sm:text-[0.9375rem]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </FadeUp>

          <section>
            <SectionTitle>{copy.achievementsTitle}</SectionTitle>

            <StaggerList className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-10 sm:gap-x-10 sm:gap-y-12">
              {getAchievementStats(locale).map((stat) => (
                <StaggerItem key={stat.title}>
                  <div className="text-center lg:text-start">
                    <p className="text-sm font-bold leading-snug text-foreground sm:text-base">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-[1.75rem] font-bold leading-none text-foreground sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-2.5 text-xs leading-relaxed text-foreground-muted sm:text-sm">
                      {stat.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          </section>

          <section>
            <SectionTitle>{copy.servicesTitle}</SectionTitle>

            <FadeUp className="mt-8 sm:mt-10">
              <div className="about-rkiza-card px-5 py-5 sm:px-6 sm:py-6">
                {copy.services.map((service) => (
                  <div key={service.title} className="about-rkiza-row">
                    <h3 className="text-base font-bold text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {service.body}
                    </p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </section>

          <section>
            <SectionTitle>{copy.techTitle}</SectionTitle>

            <FadeUp className="mt-8 sm:mt-10">
              <div className="about-rkiza-card px-5 py-5 sm:px-6 sm:py-6">
                {copy.techGroups.map((group) => (
                  <div key={group.title} className="about-rkiza-row">
                    <h3 className="text-base font-bold text-foreground">
                      {group.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {group.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.tags.map((tag, tagIndex) => (
                        <AnimatedTechPill
                          key={tag}
                          label={tag}
                          index={tagIndex}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </section>
        </div>
      </div>
    </div>
  );
}
