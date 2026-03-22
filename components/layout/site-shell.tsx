import { ReactNode } from "react";

import { FloatingAssistant } from "@/components/ai/floating-assistant";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-md bg-surface-card px-3 py-2 text-sm text-text-primary focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingAssistant />
    </div>
  );
}
