"use client";

import Image from "next/image";
import Link from "next/link";
import brandLogoImage from "@/assets/brand-logo.png";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import type { Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_WIDTH = 782;
export const BRAND_LOGO_HEIGHT = 313;

const sizeClasses = {
  sm: "h-8 sm:h-9",
  md: "h-9 sm:h-11",
  lg: "h-12 sm:h-14",
  hero: "h-20 w-auto sm:h-24 lg:h-28",
} as const;

export function BrandLogo({
  locale,
  size = "md",
  variant = "default",
  linked = true,
  priority = false,
  className,
}: {
  locale: Locale;
  size?: keyof typeof sizeClasses;
  variant?: "default" | "onDark";
  linked?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const image = (
    <Image
      src={brandLogoImage}
      alt={dict.brandFull}
      width={BRAND_LOGO_WIDTH}
      height={BRAND_LOGO_HEIGHT}
      priority={priority}
      className={cn(
        "w-auto max-w-full object-contain object-start",
        sizeClasses[size],
        variant === "onDark" && "brightness-0 invert",
        className,
      )}
    />
  );

  if (!linked) {
    return image;
  }

  return (
    <Link
      href={localePath(locale, "")}
      className="inline-flex shrink-0 transition-opacity hover:opacity-90"
    >
      {image}
    </Link>
  );
}

/** خلفية بيضاء ثابتة — يبقي الشعار الملوّن واضحاً على الخلفيات الداكنة */
export function BrandLogoPlate({
  locale,
  size = "md",
  linked = true,
  className,
  plateClassName,
}: {
  locale: Locale;
  size?: keyof typeof sizeClasses;
  linked?: boolean;
  className?: string;
  plateClassName?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-xl bg-white px-3 py-2 shadow-sm",
        plateClassName,
      )}
    >
      <BrandLogo
        locale={locale}
        size={size}
        linked={linked}
        className={className}
      />
    </div>
  );
}
