"use client";

import Image from "next/image";
import { PageHeader } from "@/components/public/page-header";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import { AnimatedActionLink } from "@/components/ui/animated-action-link";
import type { BlogPost } from "@/lib/api/types";
import { getDictionary, localized } from "@/lib/i18n/dictionaries";
import { localePath } from "@/lib/i18n/routes";
import { resolveMediaUrl } from "@/lib/media-url";
import type { Locale } from "@/stores/ui-store";

function BlogCard({
  post,
  locale,
  index,
}: {
  post: BlogPost;
  locale: Locale;
  index: number;
}) {
  const title = localized(locale, post, "titleAr", "titleEn");
  const excerpt = localized(locale, post, "excerptAr", "excerptEn");
  const coverSrc = resolveMediaUrl(post.coverImageUrl);
  const href = localePath(locale, `/blog/${post.slug}`);

  return (
    <article className="group">
      <div className="overflow-hidden rounded-[1.75rem] bg-muted/20 shadow-[0_8px_30px_rgb(15_36_77_/_0.06)] ring-1 ring-border/40">
        <div className="relative aspect-[16/10] bg-accent/10">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          ) : null}
        </div>
      </div>

      <div className="mt-5 px-0.5 sm:mt-6">
        {post.category ? (
          <p className="text-xs font-medium text-foreground-muted/80">
            {post.category}
          </p>
        ) : null}
        <h2 className="mt-1 text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {title}
        </h2>
        {excerpt ? (
          <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted line-clamp-3 sm:text-[0.9375rem]">
            {excerpt}
          </p>
        ) : null}

        <div className="mt-5 flex justify-start">
          <AnimatedActionLink href={href} variant="primary" index={index}>
            {locale === "ar" ? "اقرأ المزيد" : "Read more"}
          </AnimatedActionLink>
        </div>
      </div>
    </article>
  );
}

export function BlogPageClient({
  locale,
  posts,
}: {
  locale: Locale;
  posts: BlogPost[];
}) {
  const p = getDictionary(locale).pages;

  return (
    <>
      <PageHeader
        kicker={p.blogKicker}
        title={p.blogTitle}
        description={p.blogDesc}
      />
      <div className="container-umq py-14 sm:py-20">
        {posts.length === 0 ? (
          <p className="text-center text-foreground-muted">
            {locale === "ar"
              ? "لا توجد مقالات منشورة بعد."
              : "No published articles yet."}
          </p>
        ) : (
          <StaggerList className="mx-auto grid max-w-2xl gap-14 sm:gap-16 lg:max-w-none lg:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
            {posts.map((post, index) => (
              <StaggerItem key={post.id}>
                <BlogCard post={post} locale={locale} index={index} />
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </div>
    </>
  );
}
