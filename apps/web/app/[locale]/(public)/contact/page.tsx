import { Suspense } from "react";
import { ContactPageClient } from "@/components/contact/contact-page-client";
import { PageContentSkeleton } from "@/components/ui/page-content-skeleton";
import { isValidLocale } from "@/lib/i18n/routes";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  return (
    <Suspense fallback={<PageContentSkeleton />}>
      <ContactPageClient />
    </Suspense>
  );
}
