"use client";

import { useKeyboardShortcuts } from "@/components/ui/skip-link";

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  useKeyboardShortcuts();
  return <>{children}</>;
}
