import Image from "next/image";

import { MockupMobileSide } from "@/types/device-mockup";
import { cn } from "@/lib/utils";

interface DeviceMockupShowcaseProps {
  laptopImage: string;
  mobileImage: string;
  alt: string;
  title?: string;
  caption?: string;
  laptopAlt?: string;
  mobileAlt?: string;
  mobileSide?: MockupMobileSide;
  className?: string;
}

export function DeviceMockupShowcase({
  laptopImage,
  mobileImage,
  alt,
  title,
  caption,
  laptopAlt,
  mobileAlt,
  mobileSide = "right",
  className
}: DeviceMockupShowcaseProps) {
  return (
    <section className={cn("not-prose my-8", className)}>
      {title ? (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">{title}</p>
      ) : null}

      <figure className="relative overflow-hidden rounded-3xl border border-border bg-surface-card/90 px-4 py-6 shadow-[0_28px_60px_-40px_rgba(0,0,0,0.95)] sm:px-6 sm:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(45,212,255,0.08),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(56,189,248,0.06),transparent_40%)]" />

        <div className="relative mx-auto w-full max-w-5xl">
          <div className={cn("relative", mobileSide === "left" ? "sm:pl-20 lg:pl-24" : "sm:pr-20 lg:pr-24")}>
            <div className="rounded-[1.4rem] border border-white/10 bg-[#0a111d] p-2 shadow-[0_32px_60px_-42px_rgba(0,0,0,0.95),0_0_0_1px_rgba(45,212,255,0.18)] sm:p-3">
              <div className="mb-2 flex items-center gap-1.5 px-1 sm:mb-3 sm:px-2">
                <span className="h-2 w-2 rounded-full bg-red-300/60" />
                <span className="h-2 w-2 rounded-full bg-amber-300/60" />
                <span className="h-2 w-2 rounded-full bg-emerald-300/60" />
                <span className="ml-2 h-2.5 flex-1 rounded-full bg-white/8" />
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-black/60">
                <Image
                  src={laptopImage}
                  alt={laptopAlt || `${alt} desktop preview`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 80vw, 980px"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className="mx-auto h-2.5 w-1/2 rounded-b-[999px] bg-gradient-to-b from-slate-200/25 to-slate-600/35" />

            <div
              className={cn(
                "mx-auto mt-4 w-[140px] sm:absolute sm:bottom-5 sm:mt-0 sm:w-[26%] sm:min-w-[150px] sm:max-w-[215px]",
                mobileSide === "left" ? "sm:left-0 lg:-left-1" : "sm:right-0 lg:-right-1"
              )}
            >
              <div className="rounded-[2rem] border border-white/15 bg-[#050913] p-1.5 shadow-[0_30px_50px_-35px_rgba(0,0,0,0.98),0_0_0_1px_rgba(45,212,255,0.18)]">
                <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-white/20" />
                <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.55rem] border border-white/10 bg-black/65">
                  <Image
                    src={mobileImage}
                    alt={mobileAlt || `${alt} mobile preview`}
                    fill
                    sizes="(max-width: 640px) 140px, 220px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {caption ? (
          <figcaption className="relative mt-5 text-center text-sm text-text-secondary">{caption}</figcaption>
        ) : null}
      </figure>
    </section>
  );
}
