"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  Phone,
  Send,
  User,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/use-locale";
import { apiFetch, ApiError, isApiConnectionError } from "@/lib/api";
import { isValidInternationalPhone, normalizePhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

const fieldClassName =
  "h-12 w-full rounded-2xl border border-transparent bg-muted/45 px-4 text-sm text-foreground placeholder:text-foreground-muted/55 transition-colors focus:border-accent/25 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/10";

function ContactFormField({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        {label}
        {Icon ? (
          <Icon className="h-3.5 w-3.5 text-foreground-muted/70" aria-hidden />
        ) : null}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-600 ltr-isolate"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ContactPageClient() {
  const locale = useLocale();
  const dict = getDictionary(locale);
  const c = dict.contact;

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  const MESSAGE_MIN = 10;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPhoneError(null);
    setMessageError(null);
    const form = new FormData(e.currentTarget);
    const phoneRaw = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!phoneRaw) {
      setPhoneError(c.phoneRequired);
      setLoading(false);
      return;
    }

    const phone = normalizePhone(phoneRaw);
    if (!isValidInternationalPhone(phone)) {
      setPhoneError(c.phoneInvalid);
      setLoading(false);
      return;
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
          phone,
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

  return (
    <div className="flex justify-center px-4 pb-14 pt-8 sm:pb-20 sm:pt-12">
      <div className="w-full max-w-md">
        <header className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted/50 text-foreground">
            <Mail className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} aria-hidden />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {c.title}
          </h1>
          <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-foreground-muted sm:text-[0.9375rem]">
            {c.subtitle}
          </p>
        </header>

        <div className="mt-8 rounded-3xl bg-muted/30 px-5 py-7 sm:mt-10 sm:px-6 sm:py-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-lg font-bold text-foreground">
                  {c.successTitle}
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">
                  {c.successMessage}
                </p>
                <Button
                  variant="secondary"
                  className="mt-6 rounded-full"
                  onClick={() => setSent(false)}
                >
                  {c.sendAnother}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center">
                  <h2 className="text-base font-bold text-foreground sm:text-lg">
                    {c.formTitle}
                  </h2>
                  <p className="mt-1 text-xs text-foreground-muted sm:text-sm">
                    {c.formSubtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <ContactFormField id="contact-name" label={c.name} icon={User}>
                    <input
                      id="contact-name"
                      name="name"
                      required
                      placeholder={c.namePlaceholder}
                      className={fieldClassName}
                    />
                  </ContactFormField>

                  <ContactFormField
                    id="contact-email"
                    label={c.emailLabel}
                    icon={Mail}
                  >
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      dir="ltr"
                      placeholder={c.emailPlaceholder}
                      className={cn(fieldClassName, "text-start")}
                    />
                  </ContactFormField>

                  <ContactFormField
                    id="contact-phone"
                    label={c.phoneLabel}
                    icon={Phone}
                    error={phoneError ?? undefined}
                  >
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      dir="ltr"
                      placeholder={c.phonePlaceholder}
                      className={cn(fieldClassName, "text-start")}
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
                      rows={4}
                      placeholder={c.messagePlaceholder}
                      className={cn(
                        fieldClassName,
                        "min-h-[7.5rem] resize-none py-3",
                      )}
                    />
                  </ContactFormField>

                  {error ? (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    size="lg"
                    className="mt-1 rounded-full"
                  >
                    <Send className="h-4 w-4" />
                    {c.submit}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
