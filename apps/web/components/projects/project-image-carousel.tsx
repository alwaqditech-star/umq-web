"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { getProjectImages, isProxiedMediaUrl } from "@/lib/media-url";
import type { Project } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function isUnoptimized(src: string) {
  return isProxiedMediaUrl(src) || src.startsWith("http");
}

export function ProjectImageCarousel({
  project,
  alt,
  variant = "card",
  intervalMs = 4500,
  className,
}: {
  project: Pick<Project, "imageUrls" | "coverImageUrl">;
  alt: string;
  variant?: "card" | "hero";
  intervalMs?: number;
  className?: string;
}) {
  const images = getProjectImages(project);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (delta: number) => {
      if (images.length <= 1) return;
      setIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    setIndex(0);
  }, [images.join("|")]);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs, paused]);

  const aspect =
    variant === "hero" ? "aspect-[16/9]" : "aspect-[16/10]";
  const objectFit = variant === "hero" ? "object-contain" : "object-cover";

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/15",
          aspect,
          className,
        )}
      >
        <Images className="h-10 w-10 text-accent/30" aria-hidden />
      </div>
    );
  }

  const current = images[index]!;

  return (
    <div
      className={cn("group relative overflow-hidden bg-surface", aspect, className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt={alt}
          fill
          className={cn(
            objectFit,
            "transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
            variant === "card" && i === index && "group-hover:scale-105",
          )}
          style={{ transitionProperty: "opacity, transform" }}
          sizes={
            variant === "hero"
              ? "(max-width:1024px) 100vw, 896px"
              : "(max-width:768px) 100vw, 50vw"
          }
          unoptimized={isUnoptimized(src)}
        />
      ))}

      {variant === "card" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}

      {images.length > 1 && (
        <>
          <div className="absolute bottom-3 start-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
              />
            ))}
          </div>

          <span className="absolute end-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {index + 1}/{images.length}
          </span>

          {variant === "hero" && (
            <>
              <button
                type="button"
                className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  go(-1);
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  go(1);
                }}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
