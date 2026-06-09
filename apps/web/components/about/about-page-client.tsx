"use client";

import { Globe, Mail } from "lucide-react";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";
import { emailActionHref } from "@/lib/contact-links";
import { useSiteConfig } from "@/providers/site-config-provider";
import type { Locale } from "@/stores/ui-store";
import { AnimatedTechPill } from "@/components/ui/animated-tech-pill";
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
    achievementsPeriod: "2026 — الحاضر",
    achievementsCompany: "عُمْق لتقنية المعلومات",
    achievementsLead: "قيادة الابتكار في المملكة العربية السعودية",
    achievementsItems: [
      "تم تسليم أكثر من 60 مشروعاً بنجاح في مختلف القطاعات.",
      "بناء منصات تخدم أكثر من 97 ألف مستخدم نشط.",
      "تحقيق نسبة رضا عملاء تتجاوز 99% مع دعم فني على مدار الساعة.",
    ],
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
    achievementsPeriod: "2026 — Present",
    achievementsCompany: "UMQ Information Technology",
    achievementsLead: "Leading innovation in Saudi Arabia",
    achievementsItems: [
      "Successfully delivered 60+ projects across multiple industries.",
      "Built platforms serving 97K+ active users.",
      "Achieved 99%+ client satisfaction with 24/7 technical support.",
    ],
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

function IdentitySidebar({ locale }: { locale: Locale }) {
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
    <div
      className={cn(
        "flex flex-wrap gap-2",
        centered ? "justify-center" : "justify-center lg:justify-start",
      )}
    >
      {socials.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 px-3 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {label}
        </a>
      ))}
    </div>
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
    <header className={cn(centered ? "text-center" : "text-center lg:text-start")}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {dict.brand}
      </h1>
      <p className="mt-1 text-base text-foreground-muted sm:text-lg">{tagline}</p>
      <div className="mt-5">
        <SocialPills socials={socials} centered={centered} />
      </div>
    </header>
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
        <aside className="mb-8 lg:sticky lg:top-24 lg:mb-0 lg:self-start">
          <IdentitySidebar locale={locale} />
        </aside>

        <div className="min-w-0">
          <BrandHeader
            locale={locale}
            tagline={copy.tagline}
            socials={socials}
            centered={false}
          />

          <div className="mx-auto mt-10 max-w-2xl space-y-5 text-center text-sm leading-relaxed text-foreground-muted sm:mt-12 sm:text-[0.9375rem] lg:mx-0 lg:max-w-none lg:text-start">
              {copy.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <section className="mt-16 sm:mt-20">
              <h2 className="text-center text-2xl font-bold text-foreground sm:text-[1.75rem] lg:text-start">
                {copy.achievementsTitle}
              </h2>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-10">
                <p className="shrink-0 text-center text-sm font-medium text-foreground-muted sm:w-28 sm:text-start">
                  {copy.achievementsPeriod}
                </p>
                <article className="flex-1 text-center sm:text-start">
                  <h3 className="text-base font-bold text-foreground">
                    {copy.achievementsCompany}
                  </h3>
                  <p className="mt-1 text-sm text-foreground-muted">
                    {copy.achievementsLead}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {copy.achievementsItems.map((item) => (
                      <li
                        key={item.slice(0, 28)}
                        className="text-sm leading-relaxed text-foreground-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>

            <section className="mt-16 space-y-16 sm:mt-20">
              <div>
                <h2 className="text-center text-2xl font-bold text-foreground sm:text-[1.75rem] lg:text-start">
                  {copy.servicesTitle}
                </h2>
                <div className="mt-6 space-y-6">
                  {copy.services.map((service) => (
                    <div key={service.title} className="text-center lg:text-start">
                      <h3 className="text-base font-bold text-foreground">
                        {service.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                        {service.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-center text-2xl font-bold text-foreground sm:text-[1.75rem] lg:text-start">
                  {copy.techTitle}
                </h2>
                <div className="mt-6 space-y-8">
                  {copy.techGroups.map((group) => (
                    <div key={group.title} className="text-center lg:text-start">
                      <h3 className="text-base font-bold text-foreground">
                        {group.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                        {group.body}
                      </p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                      {group.tags.map((tag, index) => (
                        <AnimatedTechPill key={tag} label={tag} index={index} />
                      ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
}
