"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface PageBackButtonProps {
  className?: string;
  iconOnly?: boolean;
  ariaLabel?: string;
  titleText?: string;
}

export function PageBackButton({
  className,
  iconOnly = false,
  ariaLabel = "Go to previous page",
  titleText = "Go back"
}: PageBackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        iconOnly
          ? "inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/35 bg-accent-soft text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
          : "inline-flex items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary",
        className
      )}
      aria-label={ariaLabel}
      title={titleText}
    >
      <ArrowLeft size={14} />
      {iconOnly ? null : "Back"}
    </button>
  );
}
