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
import { ThemeScript, ScriptHandler } from "@/components/ui/script-handler";

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
        <meta name="netpub_831b33a650047ee11a992b11fdadd8f3" content="831b33a650047ee11a992b11fdadd8f3_232c7b7723dc94b3a1e3e0dab2fabde6" />
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

        {/* GDPR Compliance Script - Required for EU data protection compliance */}
        <ScriptHandler
          src="https://fstatic.netpub.media/extra/cmp/cmp-gdpr.js"
          strategy="beforeInteractive"
          defer
          id="gdpr-compliance-script"
        />
      </body>
    </html>
  );
}
