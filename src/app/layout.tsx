import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ui/theme-toggle";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SkipLinks } from "@/components/ui/skip-link";
import { KeyboardShortcutsProvider } from "@/components/ui/keyboard-shortcuts-provider";
import { ScriptManagerProvider } from "@/components/ui/script-manager";
import { ThemeScript } from "@/components/ui/script-handler";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NeuraDock - Knowledge Hub",
  description: "Your comprehensive source for insights on Finance, Technology, Education, and Business",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLinks />
        <ScriptManagerProvider>
          <ThemeProvider defaultTheme="system" storageKey="neuradock-theme">
            <KeyboardShortcutsProvider>
              <ErrorBoundary>
                <Navigation />
                <main id="main-content" className="min-h-screen" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
              </ErrorBoundary>
            </KeyboardShortcutsProvider>
          </ThemeProvider>
        </ScriptManagerProvider>
      </body>
    </html>
  );
}
