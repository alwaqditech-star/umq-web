"use client";

import { AnimatedTechPill } from "@/components/ui/animated-tech-pill";

export function ProjectTechnologies({
  technologies,
}: {
  technologies: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech, i) => (
        <AnimatedTechPill key={tech} label={tech} index={i} />
      ))}
    </div>
  );
}
