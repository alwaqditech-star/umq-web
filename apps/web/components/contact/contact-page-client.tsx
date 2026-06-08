"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";
import { useSiteConfig } from "@/providers/site-config-provider";
import { apiFetch, ApiError, isApiConnectionError } from "@/lib/api";
import {
  emailActionHref,
  isExternalHref,
  phoneActionHref,
} from "@/lib/contact-links";
import { isValidInternationalPhone, normalizePhone } from "@/lib/phone";
import { staggerContainer, staggerItem } from "@/lib/animations";
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

function ContactFormField({
  id,
  label,
  icon,
  error,
  delay = 0,
  children,
}: {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
  delay?: number;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={staggerItem}
      custom={delay}
      className="group flex flex-col gap-2"
    >
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors group-focus-within:text-foreground"
      >
        {label}
        {icon ? (
          <motion.span
            className="inline-flex"
            whileHover={reduceMotion ? undefined : { rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.4 }}
          >
            {icon}
          </motion.span>
        ) : null}
      </label>
      <div className="relative transition-transform duration-300 focus-within:scale-[1.01]">
        {children}
      </div>
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-red-600 ltr-isolate"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

const fieldClassName =
  "w-full rounded-2xl border border-transparent bg-muted/35 px-4 text-sm text-foreground shadow-[inset_0_1px_2px_rgb(15_36_77_/_0.04)] placeholder:text-foreground-muted/55 transition-all duration-300 focus:border-accent/30 focus:bg-surface focus:shadow-[0_0_0_3px_rgb(72_134_149_/_0.12)] focus:outline-none";

const channelItemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function ContactPageClient({
  faqItems = [],
}: {
  faqItems?: { q: string; a: string }[];
}) {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const { contact: settings } = useSiteConfig();
  const c = dict.contact;
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const address = locale === "ar" ? settings.addressAr : settings.addressEn;
  const emailHref = emailActionHref(settings.email);
  const phoneHref = phoneActionHref(settings.phone);
  const whatsappHref = `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`;

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  const MESSAGE_MIN = 10;
  const slideX = locale === "ar" ? -6 : 6;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPhoneError(null);
    setMessageError(null);
    const form = new FormData(e.currentTarget);
    const phoneRaw = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    let phone = "";

    if (phoneRaw) {
      phone = normalizePhone(phoneRaw);
      if (!isValidInternationalPhone(phone)) {
        setPhoneError(c.phoneInvalid);
        setLoading(false);
        return;
      }
    }

    if (message.length < MESSAGE_MIN) {
      setMessageError(c.messageTooShort);
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/contacts", {
        method: "POST",
        body: JSON.stringify({
          name: String(form.get("name")),
          email: String(form.get("email")),
          phone: phone || undefined,
          subject: c.defaultSubject,
          message,
        }),
      });
      setSent(true);
    } catch (err) {
      if (isApiConnectionError(err)) {
        setError(c.errorApiOffline);
      } else if (err instanceof ApiError && err.status === 400) {
        setError(
          err.message.toLowerCase().includes("message")
            ? c.messageTooShort
            : err.message,
        );
      } else {
        setError(c.errorSend);
      }
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      href: whatsappHref,
      label: locale === "ar" ? "واتساب" : "WhatsApp",
      icon: WhatsAppIcon,
      className: "hover:bg-[#25D366]/15 hover:text-[#128C7E] hover:border-[#25D366]/30",
    },
    {
      href: emailHref,
      label: locale === "ar" ? "بريد" : "Email",
      icon: Mail,
      className: "hover:bg-accent/15 hover:text-accent hover:border-accent/30",
      external: true,
    },
    {
      href: phoneHref,
      label: locale === "ar" ? "اتصال" : "Call",
      icon: Phone,
      className: "hover:bg-accent/15 hover:text-accent hover:border-accent/30",
      external: isExternalHref(phoneHref),
    },
    ...(settings.xUrl
      ? [
          {
            href: settings.xUrl,
            label: "X",
            icon: XIcon,
            className:
              "hover:bg-foreground/10 hover:text-foreground hover:border-foreground/20",
            external: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <section className="relative overflow-hidden pb-2 pt-4 sm:pt-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 start-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute top-10 end-0 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />
        </div>

        <div className="container-umq relative text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="section-kicker"
          >
            {c.kicker}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            <span className="text-gradient">{c.title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mx-auto mt-4 max-w-xl text-base text-foreground-muted sm:text-lg"
          >
            {c.subtitle}
          </motion.p>
        </div>
      </section>

      <div className="container-umq pb-14 sm:pb-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Form — أولوية على الموبايل */}
          <FadeUp className="order-1 lg:order-2 lg:col-span-7">
            <motion.div
              className="relative"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-accent/20 via-transparent to-primary/10 opacity-60" />
              <Card
                padding="lg"
                className="relative overflow-hidden rounded-3xl border-border/60 bg-surface/95 shadow-lg backdrop-blur-sm"
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                      className="flex flex-col items-center py-14 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 16,
                          delay: 0.08,
                        }}
                        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-accent/15 text-accent"
                      >
                        <motion.span
                          className="absolute inset-0 rounded-full border-2 border-accent/30"
                          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <CheckCircle2 className="relative h-11 w-11" />
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-7 text-2xl font-bold text-foreground"
                      >
                        {c.successTitle}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28 }}
                        className="mt-3 max-w-md text-foreground-muted"
                      >
                        {c.successMessage}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.36 }}
                      >
                        <Button
                          variant="secondary"
                          className="mt-8"
                          onClick={() => setSent(false)}
                        >
                          {c.sendAnother}
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          animate={
                            reduceMotion
                              ? undefined
                              : { rotate: [0, 8, -8, 0] }
                          }
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent"
                        >
                          <Sparkles className="h-5 w-5" aria-hidden />
                        </motion.div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                            {c.formTitle}
                          </h2>
                          <p className="mt-1 text-sm text-foreground-muted">
                            {c.formSubtitle}
                          </p>
                        </div>
                      </div>

                      <motion.form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        <ContactFormField
                          id="contact-name"
                          label={c.name}
                          icon={
                            <User
                              className="h-4 w-4 text-foreground-muted/70"
                              aria-hidden
                            />
                          }
                        >
                          <input
                            id="contact-name"
                            name="name"
                            required
                            placeholder={c.namePlaceholder}
                            className={cn(fieldClassName, "h-12")}
                          />
                        </ContactFormField>

                        <ContactFormField
                          id="contact-email"
                          label={c.emailLabel}
                          icon={
                            <Mail
                              className="h-4 w-4 text-foreground-muted/70"
                              aria-hidden
                            />
                          }
                        >
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            dir="ltr"
                            placeholder={c.emailPlaceholder}
                            className={cn(fieldClassName, "h-12 text-start")}
                          />
                        </ContactFormField>

                        <ContactFormField
                          id="contact-phone"
                          label={c.phoneLabel}
                          error={phoneError ?? undefined}
                        >
                          <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            inputMode="tel"
                            dir="ltr"
                            placeholder={c.phonePlaceholder}
                            className={cn(fieldClassName, "h-12 text-start")}
                          />
                        </ContactFormField>

                        <ContactFormField
                          id="contact-message"
                          label={c.message}
                          error={messageError ?? undefined}
                        >
                          <textarea
                            id="contact-message"
                            name="message"
                            required
                            minLength={MESSAGE_MIN}
                            rows={5}
                            placeholder={c.messagePlaceholder}
                            className={cn(
                              fieldClassName,
                              "min-h-[140px] resize-y py-3",
                            )}
                          />
                        </ContactFormField>

                        <AnimatePresence>
                          {error ? (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-sm text-red-600"
                              role="alert"
                            >
                              {error}
                            </motion.p>
                          ) : null}
                        </AnimatePresence>

                        <motion.div variants={staggerItem}>
                          <motion.div
                            whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              loading={loading}
                              fullWidth
                              size="lg"
                              className="group relative mt-1 overflow-hidden rounded-2xl bg-primary text-light shadow-md hover:bg-secondary"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                                {c.submit}
                              </span>
                              {!loading && !reduceMotion ? (
                                <motion.span
                                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                                  animate={{ x: ["-100%", "200%"] }}
                                  transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    repeatDelay: 1.5,
                                    ease: "easeInOut",
                                  }}
                                />
                              ) : null}
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </FadeUp>

          {/* قنوات التواصل — شريط جانبي ثابت */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="lg:sticky lg:top-24 lg:space-y-6">
              <FadeUp delay={0.05}>
                <Card
                  padding="lg"
                  className="card-elevated overflow-hidden rounded-3xl border-border/60"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {c.channelsTitle}
                  </p>

                  <motion.div
                    className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.06, delayChildren: 0.1 },
                      },
                    }}
                  >
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <motion.a
                          key={action.label}
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          variants={channelItemVariants}
                          whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
                          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-muted/20 px-3 py-4 text-center text-xs font-medium text-foreground-muted transition-colors",
                            action.className,
                          )}
                        >
                          <Icon className="h-5 w-5" aria-hidden />
                          {action.label}
                        </motion.a>
                      );
                    })}
                  </motion.div>

                  <ul className="mt-6 space-y-1 divide-y divide-border/60">
                    {[
                      {
                        icon: Mail,
                        href: emailHref,
                        value: settings.email,
                        external: true,
                      },
                      {
                        icon: Phone,
                        href: phoneHref,
                        value: settings.phone,
                        external: isExternalHref(phoneHref),
                      },
                    ].map(({ icon: Icon, href, value, external }, i) => (
                      <motion.li
                        key={href}
                        initial={{ opacity: 0, x: slideX }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                      >
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="group flex items-center gap-4 rounded-2xl py-3.5 transition-colors hover:bg-muted/25"
                        >
                          <motion.div
                            whileHover={reduceMotion ? undefined : { rotate: 6, scale: 1.05 }}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent"
                          >
                            <Icon className="h-5 w-5" aria-hidden />
                          </motion.div>
                          <span className="font-medium ltr-isolate break-words text-foreground group-hover:text-accent">
                            {value}
                          </span>
                        </a>
                      </motion.li>
                    ))}
                    <motion.li
                      initial={{ opacity: 0, x: slideX }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex items-start gap-4 py-3.5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                        <MapPin className="h-5 w-5" aria-hidden />
                      </div>
                      <span className="font-medium text-foreground">{address}</span>
                    </motion.li>
                  </ul>
                </Card>
              </FadeUp>

              <FadeUp delay={0.15}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card
                    padding="md"
                    className="card-elevated overflow-hidden rounded-3xl border-border/60 p-0"
                  >
                    {settings.mapEmbedUrl ? (
                      <div className="relative">
                        <iframe
                          title={address}
                          src={settings.mapEmbedUrl}
                          className="h-52 w-full border-0 sm:h-56"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                        {settings.mapUrl ? (
                          <a
                            href={settings.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-surface"
                          >
                            {locale === "ar"
                              ? "الفتح في خرائط Google"
                              : "Open in Google Maps"}
                          </a>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-muted/15 text-sm text-foreground-muted">
                        {address}
                      </div>
                    )}
                  </Card>
                </motion.div>
              </FadeUp>
            </div>
          </div>
        </div>

        {faqItems.length > 0 && (
          <FadeUp className="mt-20">
            <h2 className="text-2xl font-bold">
              {locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
            </h2>
            <motion.div
              className="mt-6 space-y-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {faqItems.map((item, i) => (
                <motion.div key={item.q} variants={staggerItem}>
                  <Card padding="md" className="overflow-hidden rounded-2xl">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 text-start"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span className="font-medium">{item.q}</span>
                      <motion.span
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      >
                        <ChevronDown className="h-5 w-5 shrink-0 text-foreground-muted" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3 text-sm text-foreground-muted">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </FadeUp>
        )}
      </div>
    </>
  );
}
