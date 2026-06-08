"use client";

import { ProjectImageCarousel } from "@/components/projects/project-image-carousel";
import type { Project } from "@/lib/api/types";

export function ProjectDetailGallery({
  project,
  alt,
}: {
  project: Pick<Project, "imageUrls" | "coverImageUrl">;
  alt: string;
}) {
  return (
    <ProjectImageCarousel
      project={project}
      alt={alt}
      variant="hero"
      intervalMs={5000}
      className="max-w-4xl rounded-2xl border border-border/60 shadow-lg"
    />
  );
}
