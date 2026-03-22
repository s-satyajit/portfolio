"use client";

import { ReactNode, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface ScrollSyncedSidebarProps {
  children: ReactNode;
  className?: string;
}

const DESKTOP_BREAKPOINT = 1280;

export function ScrollSyncedSidebar({ children, className }: ScrollSyncedSidebarProps) {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const isHoveringRef = useRef(false);
  const lastWindowScrollYRef = useRef(0);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const clampScroll = (next: number) => {
      const maxScroll = Math.max(0, sidebar.scrollHeight - sidebar.clientHeight);
      return Math.min(maxScroll, Math.max(0, next));
    };

    const onMouseEnter = () => {
      isHoveringRef.current = true;
    };

    const onMouseLeave = () => {
      isHoveringRef.current = false;
    };

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) return;
      const maxScroll = sidebar.scrollHeight - sidebar.clientHeight;
      if (maxScroll <= 0) return;

      const { scrollTop } = sidebar;
      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;
      const canScrollDown = scrollTop < maxScroll;
      const canScrollUp = scrollTop > 0;

      if ((scrollingDown && canScrollDown) || (scrollingUp && canScrollUp)) {
        sidebar.scrollTop = clampScroll(scrollTop + event.deltaY);
        event.preventDefault();
      }
    };

    const onWindowScroll = () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        lastWindowScrollYRef.current = window.scrollY;
        return;
      }

      const deltaY = window.scrollY - lastWindowScrollYRef.current;
      lastWindowScrollYRef.current = window.scrollY;

      if (Math.abs(deltaY) < 0.5 || isHoveringRef.current) return;

      const maxScroll = sidebar.scrollHeight - sidebar.clientHeight;
      if (maxScroll <= 0) return;

      sidebar.scrollTop = clampScroll(sidebar.scrollTop + deltaY);
    };

    lastWindowScrollYRef.current = window.scrollY;

    sidebar.addEventListener("mouseenter", onMouseEnter);
    sidebar.addEventListener("mouseleave", onMouseLeave);
    sidebar.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onWindowScroll, { passive: true });

    return () => {
      sidebar.removeEventListener("mouseenter", onMouseEnter);
      sidebar.removeEventListener("mouseleave", onMouseLeave);
      sidebar.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, []);

  return (
    <aside ref={sidebarRef} className={cn(className)}>
      {children}
    </aside>
  );
}
