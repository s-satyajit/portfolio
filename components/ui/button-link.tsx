import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
}

const variantClasses: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  primary:
    "bg-accent text-surface hover:bg-cyan-300 border border-accent shadow-glow focus-visible:outline-accent",
  secondary:
    "border border-border bg-surface-card text-text-primary hover:border-accent/60 hover:bg-surface-elevated",
  ghost: "text-text-secondary hover:text-text-primary"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external = false
}: ButtonLinkProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition",
    variantClasses[variant],
    className
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
