"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Hidden by default, visible on focus
        "sr-only focus:not-sr-only",
        // Positioning and styling when focused
        "focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "focus:px-4 focus:py-2",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:rounded-md focus:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-all duration-200",
        className
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            // Focus the target element if it's focusable
            if (target instanceof HTMLElement) {
              target.focus();
            }
          }
        }
      }}
    >
      {children}
    </a>
  );
}

interface SkipLinksProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export function SkipLinks({ 
  links = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#navigation", label: "Skip to navigation" },
    { href: "#footer", label: "Skip to footer" }
  ],
  className 
}: SkipLinksProps) {
  return (
    <div className={cn("sr-only focus-within:not-sr-only", className)}>
      {links.map((link, index) => (
        <SkipLink key={index} href={link.href}>
          {link.label}
        </SkipLink>
      ))}
    </div>
  );
}

// Hook for managing focus
export function useFocusManagement() {
  const focusRef = React.useRef<HTMLElement>(null);

  const focusElement = React.useCallback((element?: HTMLElement | null) => {
    if (element) {
      element.focus();
    } else if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  const trapFocus = React.useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    
    // Focus first element
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  return {
    focusRef,
    focusElement,
    trapFocus,
  };
}

// Keyboard shortcuts hook
export function useKeyboardShortcuts() {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchButton = document.querySelector('[data-search-trigger]') as HTMLElement;
        if (searchButton) {
          searchButton.click();
        }
      }

      // Escape to close modals/overlays
      if (e.key === "Escape") {
        const closeButton = document.querySelector('[data-close-modal]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }

      // Alt + H for home
      if (e.altKey && e.key === "h") {
        e.preventDefault();
        window.location.href = "/";
      }

      // Alt + M for main content
      if (e.altKey && e.key === "m") {
        e.preventDefault();
        const mainContent = document.querySelector("#main-content") as HTMLElement;
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
