"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const PROGRESS_EPSILON = 0.001;

export function ScrollProgressBar() {
  const pathname = usePathname();
  const frameRef = useRef<number | null>(null);
  const lastProgressRef = useRef(-1);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(media.matches);
    syncPreference();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncPreference);
      return () => media.removeEventListener("change", syncPreference);
    }

    media.addListener(syncPreference);
    return () => media.removeListener(syncPreference);
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const maxScroll = Math.max(0, scrollHeight - window.innerHeight);

      if (maxScroll <= 0) {
        lastProgressRef.current = 0;
        setProgress(0);
        return;
      }

      const nextProgress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
      if (Math.abs(nextProgress - lastProgressRef.current) < PROGRESS_EPSILON) {
        return;
      }

      lastProgressRef.current = nextProgress;
      setProgress(nextProgress);
    };

    const scheduleMeasure = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        calculateProgress();
      });
    };

    lastProgressRef.current = -1;
    scheduleMeasure();

    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-16 z-40 h-[3px]">
      <div
        className={cn(
          "h-full bg-accent transition-[width,opacity] ease-out",
          reduceMotion ? "duration-0" : "duration-150",
          progress > 0 ? "opacity-100" : "opacity-0"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
