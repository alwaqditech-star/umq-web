"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";

export function ContactCtaSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="border-t border-border/30 py-20 sm:py-24">
      <div className="container-umq text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {locale === "ar"
            ? "لنبني شيئاً عظيماً"
            : "Let's build something great"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground-muted">
          {locale === "ar"
            ? "فريق عُمْق جاهز لمناقشة مشروعك القادم."
            : "The UMQ team is ready to discuss your next initiative."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={localePath(locale, "/contact")}>
            <Button size="lg" className="rounded-full">
              {dict.cta.contactUs}
              <Arrow className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
