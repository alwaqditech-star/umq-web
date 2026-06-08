"use client";

import { FadeUp } from "@/components/motion/fade-up";
import { localized } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/stores/ui-store";

export function PartnersSection({
  locale,
  partners,
}: {
  locale: Locale;
  partners: { id: string; nameAr: string; nameEn: string; url: string }[];
}) {
  if (partners.length === 0) return null;

  return (
    <section className="border-b border-border/30 py-14 sm:py-16">
      <div className="container-umq">
        <FadeUp className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
            {locale === "ar" ? "يثقون بنا" : "Trusted by"}
          </p>
        </FadeUp>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {partners.map((p) => {
            const name = localized(locale, p, "nameAr", "nameEn");
            const inner = (
              <span className="text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground sm:text-base">
                {name}
              </span>
            );
            return (
              <li key={p.id}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
