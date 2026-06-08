"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

export function ProjectImageCarousel({
  images,
  alt,
  className,
  aspectClassName = "aspect-[16/10]",
  sizes = "(max-width:768px) 100vw, 50vw",
  autoPlay = true,
}: {
  images: string[];
  alt: string;
  className?: string;
  aspectClassName?: string;
  sizes?: string;
  autoPlay?: boolean;
}) {
  const resolved = images
    .map((url) => resolveMediaUrl(url) ?? url)
    .filter(Boolean);

  const [index, setIndex] = useState(0);
  const count = resolved.length;

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      setIndex((next + count) % count);
    },
    [count],
  );

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [autoPlay, count, images]);

  if (count === 0) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/15",
          aspectClassName,
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn("group relative overflow-hidden", aspectClassName, className)}
    >
      {resolved.map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt={i === index ? alt : ""}
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          sizes={sizes}
          priority={i === 0}
          unoptimized={src.startsWith("http")}
        />
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            className="absolute start-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goTo(index - 1);
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="absolute end-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goTo(index + 1);
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
            {resolved.map((src, i) => (
              <button
                key={`dot-${src}-${i}`}
                type="button"
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
