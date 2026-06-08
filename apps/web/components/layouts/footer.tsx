"use client";

import { usePathname } from "next/navigation";
import { BrandLogoPlate } from "@/components/brand/brand-logo";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FastNavLink } from "@/components/navigation/fast-nav-link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import {
  emailActionHref,
  isExternalHref,
  phoneActionHref,
} from "@/lib/contact-links";
import { publicNavLinks } from "@/lib/public-nav";
import {
  useSectionEnabled,
  useSiteConfig,
} from "@/providers/site-config-provider";
import type { Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FooterColumn({
  title,
  children,
  delay = 0,
  hideTitle = false,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
  hideTitle?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3
        className={cn(
          "text-base font-bold tracking-wide text-accent-soft text-center sm:text-start",
          hideTitle && "sr-only",
        )}
      >
        {title}
      </h3>
      <div className={hideTitle ? undefined : "mt-5"}>{children}</div>
    </motion.div>
  );
}

const footerLinkClassName =
  "group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-light/15 bg-light/[0.07] px-4 py-2.5 text-sm font-medium text-light/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/20 hover:text-white hover:shadow-[0_6px_20px_rgb(72_134_149_/_0.28)] active:translate-y-0 active:scale-[0.98] sm:justify-start sm:px-3.5 sm:py-2";

function FooterNavItem({
  href,
  children,
  matchPrefix = true,
}: {
  href: string;
  children: React.ReactNode;
  matchPrefix?: boolean;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const active =
    pathname === href || (matchPrefix && pathname.startsWith(`${href}/`));

  return (
    <li className="w-full">
      <FastNavLink
        href={href}
        matchPrefix={matchPrefix}
        className={cn(
          footerLinkClassName,
          active &&
            "border-accent/50 bg-accent/25 text-white shadow-[0_4px_16px_rgb(72_134_149_/_0.22)]",
        )}
      >
        <motion.span
          className="relative z-10"
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
        >
          {children}
        </motion.span>
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 opacity-0 transition-opacity duration-200 group-hover:from-accent/10 group-hover:to-accent/5 group-hover:opacity-100"
          aria-hidden
        />
      </FastNavLink>
    </li>
  );
}

function ContactRow({
  icon: Icon,
  href,
  children,
  external = false,
}: {
  icon: typeof Mail;
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group flex flex-col items-center gap-2.5 rounded-xl border border-transparent px-3 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-light/10 hover:bg-light/[0.06] sm:flex-row sm:items-start sm:gap-3 sm:px-0 sm:py-2 sm:text-start sm:hover:translate-y-0"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/25 text-accent-soft shadow-sm transition-all duration-200 group-hover:bg-accent/35 group-hover:text-white group-hover:shadow-[0_4px_14px_rgb(72_134_149_/_0.3)]">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="text-sm font-medium leading-relaxed text-light/85 group-hover:text-white ltr-isolate sm:pt-2">
        {children}
      </span>
    </motion.a>
  );
}

function FloatingWhatsApp({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      className="fixed bottom-24 start-4 z-40 hidden items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgb(37_211_102_/_0.35)] transition-shadow hover:shadow-[0_10px_28px_rgb(37_211_102_/_0.45)] lg:bottom-8 lg:flex"
      aria-label={label}
    >
      <MessageCircle className="relative h-5 w-5" />
      <span className="relative">{label}</span>
    </motion.a>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const f = dict.footer;
  const { contact } = useSiteConfig();
  const blogEnabled = useSectionEnabled("blog");
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();

  const address = locale === "ar" ? contact.addressAr : contact.addressEn;
  const whatsappHref = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;
  const emailHref = emailActionHref(contact.email);
  const phoneHref = phoneActionHref(contact.phone);

  const quickLinks = publicNavLinks.filter(
    (l) =>
      l.key !== "home" &&
      (!l.sectionKey || (l.sectionKey === "blog" ? blogEnabled : true)),
  );

  const socials = [
    {
      href: whatsappHref,
      label: locale === "ar" ? "واتساب" : "WhatsApp",
      icon: WhatsAppIcon,
    },
    ...(contact.xUrl
      ? [{ href: contact.xUrl, label: "X", icon: XIcon }]
      : []),
  ];

  return (
    <>
      <FloatingWhatsApp
        href={whatsappHref}
        label={locale === "ar" ? "تواصل معنا" : "Chat with us"}
      />

      <footer className="relative mt-auto bg-primary-deep text-light pb-24 lg:pb-0">
        <div className="footer-gradient-top h-px w-full opacity-80" aria-hidden />

        <div className="container-umq py-14 sm:py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {/* العلامة + الوصف + السوشال */}
            <FooterColumn title={dict.brand} delay={0} hideTitle>
              <div className="flex flex-col items-center sm:items-start">
                <BrandLogoPlate
                  locale={locale}
                  size="lg"
                  className="object-center sm:object-start"
                />
                <p className="mt-5 max-w-xs text-center text-sm leading-relaxed text-light/80 sm:text-start">
                  {f.description}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:justify-start">
                {socials.map(({ href, label, icon: Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={reduceMotion ? undefined : { y: -3, scale: 1.08 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-light/20 bg-light/[0.08] text-light/85 shadow-sm transition-all duration-200 hover:border-accent/50 hover:bg-accent/20 hover:text-white hover:shadow-[0_6px_18px_rgb(72_134_149_/_0.28)]"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
                </div>
              </div>
            </FooterColumn>

            {/* روابط سريعة */}
            <FooterColumn title={f.quickLinks} delay={0.08}>
              <ul className="mx-auto grid w-full max-w-sm grid-cols-2 gap-2.5 sm:mx-0 sm:block sm:max-w-none sm:space-y-2">
                {quickLinks.map(({ key, path }) => (
                  <FooterNavItem
                    key={key}
                    href={localePath(locale, path)}
                    matchPrefix={path !== ""}
                  >
                    {dict.nav[key]}
                  </FooterNavItem>
                ))}
              </ul>
            </FooterColumn>

            {/* تواصل */}
            <FooterColumn
              title={f.contactTitle}
              delay={0.16}
            >
              <div className="mx-auto max-w-xs space-y-1 sm:mx-0 sm:max-w-none">
                <ContactRow icon={Mail} href={emailHref} external>
                  {contact.email}
                </ContactRow>
                <ContactRow
                  icon={Phone}
                  href={phoneHref}
                  external={isExternalHref(phoneHref)}
                >
                  {contact.phone}
                </ContactRow>
                <div className="flex flex-col items-center gap-2.5 rounded-xl border border-transparent px-3 py-3 text-center sm:flex-row sm:items-start sm:gap-3 sm:border-0 sm:px-0 sm:py-2 sm:text-start">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/25 text-accent-soft shadow-sm">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-light/85 sm:pt-2">
                    {address}
                  </span>
                </div>
              </div>
            </FooterColumn>
          </div>

          <motion.div
            className="mt-12 border-t border-light/10 pt-7 text-center"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-sm text-light/60">
              © {year} {dict.brandFull}. {f.rights}
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
