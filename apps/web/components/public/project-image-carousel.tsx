"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { getMediaSrcCandidates, resolveMediaUrl } from "@/lib/media-url";
import type { Locale } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

function normalizeCarouselSrc(raw: string): string {
  return resolveMediaUrl(raw) ?? raw;
}

function MediaImage({
  rawSrc,
  alt,
  className,
  onFailed,
}: {
  rawSrc: string;
  alt: string;
  className?: string;
  onFailed: () => void;
}) {
  const candidates = useMemo(() => getMediaSrcCandidates(rawSrc), [rawSrc]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [rawSrc]);

  useEffect(() => {
    if (candidates.length === 0) onFailed();
  }, [candidates.length, onFailed]);

  const src = candidates[candidateIndex];
  if (!src) return null;

  const handleError = () => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex((i) => i + 1);
      return;
    }
    onFailed();
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element -- gallery uses API media with fallbacks
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
    />
  );
}

export function ProjectImageCarousel({
  images,
  alt,
  className,
  aspectClassName = "aspect-[16/10]",
  sizes: _sizes = "(max-width:768px) 100vw, 50vw",
  autoPlay = true,
  showThumbnails = false,
  locale = "ar",
}: {
  images: string[];
  alt: string;
  className?: string;
  aspectClassName?: string;
  sizes?: string;
  autoPlay?: boolean;
  showThumbnails?: boolean;
  locale?: Locale;
}) {
  const resolved = useMemo(
    () =>
      images
        .map(normalizeCarouselSrc)
        .filter((url): url is string => Boolean(url?.trim())),
    [images],
  );

  const [failed, setFailed] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const visible = resolved.filter((src) => !failed.has(src));
  const count = visible.length;
  const currentSrc = visible[index];

  const markFailed = useCallback((src: string) => {
    setFailed((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      setIndex((next + count) % count);
    },
    [count],
  );

  useEffect(() => {
    setFailed(new Set());
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (index >= count && count > 0) {
      setIndex(0);
    }
  }, [count, index]);

  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [autoPlay, count]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start == null || end == null || count <= 1) return;

    const delta = end - start;
    if (Math.abs(delta) < 40) return;

    const rtl = locale === "ar";
    const swipeNext = rtl ? delta > 0 : delta < 0;
    goTo(index + (swipeNext ? 1 : -1));
  };

  const PrevIcon = locale === "ar" ? ChevronRight : ChevronLeft;
  const NextIcon = locale === "ar" ? ChevronLeft : ChevronRight;

  if (count === 0) {
    return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/15 text-foreground-muted",
          aspectClassName,
          className,
        )}
      >
        <ImageOff className="h-10 w-10 opacity-40" aria-hidden />
        <p className="px-4 text-center text-xs">
          {locale === "ar"
            ? "لا توجد صور متاحة — أعد رفع الصور من لوحة التحكم"
            : "No images available — re-upload from admin"}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "group relative overflow-hidden bg-muted/20",
          aspectClassName,
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentSrc ? (
          <MediaImage
            key={`${currentSrc}-${index}`}
            rawSrc={currentSrc}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            onFailed={() => markFailed(currentSrc)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-foreground-muted">
            <ImageOff className="h-10 w-10 opacity-40" aria-hidden />
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              className="absolute start-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background hover:shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(index - 1);
              }}
              aria-label={locale === "ar" ? "الصورة السابقة" : "Previous image"}
            >
              <PrevIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="absolute end-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-background hover:shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(index + 1);
              }}
              aria-label={locale === "ar" ? "الصورة التالية" : "Next image"}
            >
              <NextIcon className="h-4 w-4" />
            </button>

            <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                {visible.map((src, i) => (
                  <button
                    key={`dot-${src}`}
                    type="button"
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index
                        ? "w-4 bg-accent"
                        : "w-1.5 bg-foreground/30 hover:bg-foreground/50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIndex(i);
                    }}
                    aria-label={
                      locale === "ar" ? `صورة ${i + 1}` : `Image ${i + 1}`
                    }
                  />
                ))}
              </div>
              <span className="rounded-full bg-background/85 px-2 py-0.5 text-[11px] font-medium text-foreground-muted shadow-sm backdrop-blur-sm">
                {index + 1}/{count}
              </span>
            </div>
          </>
        )}
      </div>

      {showThumbnails && count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {visible.map((src, i) => (
            <button
              key={`thumb-${src}`}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-muted/20 transition-all",
                i === index
                  ? "border-accent shadow-md"
                  : "border-transparent opacity-65 hover:opacity-100",
              )}
              aria-label={
                locale === "ar" ? `عرض صورة ${i + 1}` : `Show image ${i + 1}`
              }
            >
              <MediaImage
                rawSrc={src}
                alt=""
                className="h-full w-full object-cover"
                onFailed={() => markFailed(src)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
