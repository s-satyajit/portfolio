import Image from "next/image";

import { cn } from "@/lib/utils";
import { Project } from "@/types/project";

interface ProjectCoverMediaProps {
  project: Pick<
    Project,
    "title" | "images" | "laptopImage" | "mobileImage" | "mockupAlt" | "mockupMobileSide"
  >;
  className?: string;
  sizes?: string;
  imageClassName?: string;
  priority?: boolean;
  mockupImageFit?: "cover" | "contain";
}

export function ProjectCoverMedia({
  project,
  className,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  imageClassName,
  priority,
  mockupImageFit = "cover"
}: ProjectCoverMediaProps) {
  const desktopImage = project.laptopImage || project.images[0];
  const mobileImage = project.mobileImage;
  const imageFitClass = mockupImageFit === "contain" ? "object-contain object-center" : "object-cover object-top";

  if (!desktopImage) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-surface", className)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,255,0.09),transparent_38%),radial-gradient(circle_at_80%_100%,rgba(56,189,248,0.08),transparent_42%)]" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-surface", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,255,0.09),transparent_38%),radial-gradient(circle_at_80%_100%,rgba(56,189,248,0.08),transparent_42%)]" />

      <div
        className={cn(
          "absolute left-3 right-3 top-4 bottom-3 rounded-xl border border-white/10 bg-[#0a111d] p-2",
          imageClassName
        )}
      >
        <div className="mb-2 flex items-center gap-1 px-1">
          <span className="h-1.5 w-1.5 rounded-full bg-red-300/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/60" />
          <span className="ml-1 h-1.5 flex-1 rounded-full bg-white/8" />
        </div>

        <div className="relative h-full overflow-hidden rounded-lg border border-white/10">
          <Image
            src={desktopImage}
            alt={project.mockupAlt || `${project.title} desktop preview`}
            fill
            sizes={sizes}
            className={imageFitClass}
            priority={priority}
          />
        </div>
      </div>

      {mobileImage ? (
        <div
          className={cn(
            "absolute bottom-3 z-[2] w-[28%] min-w-[72px] max-w-[130px]",
            project.mockupMobileSide === "left" ? "left-4" : "right-4"
          )}
        >
          <div className="rounded-[1.4rem] border border-white/15 bg-[#050913] p-1">
            <div className="mx-auto mb-1 h-1 w-7 rounded-full bg-white/20" />
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.1rem] border border-white/10">
              <Image
                src={mobileImage}
                alt={project.mockupAlt || `${project.title} mobile preview`}
                fill
                sizes="140px"
                className={imageFitClass}
                priority={priority}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
