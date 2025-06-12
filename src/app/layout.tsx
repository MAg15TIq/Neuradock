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

        {/* Netpub Ad Script - Enhanced with robust error handling and multiple strategies */}
        <ScriptHandler
          strategy="afterInteractive"
          id="netpub-ad-script-main"
        >
          {`(function() {
            // Prevent multiple executions
            if (window.netpubScriptAttempted) {
              console.log("[NetPub] Script loading already attempted");
              return;
            }
            window.netpubScriptAttempted = true;

            const publisherId = "831b33a650047ee11a992b11fdadd8f3";

            // Initialize global state
            window.netpubLoaded = false;
            window.netpubLoadFailed = false;
            window.netpubRetryCount = 0;
            window.netpubMaxRetries = 3;

            // Enhanced script URLs with different CDNs and protocols
            const scriptUrls = [
              "https://fstatic.netpub.media/static/" + publisherId + ".min.js",
              "https://fstatic.netpub.media/static/" + publisherId + ".js",
              "https://netpub.media/static/" + publisherId + ".min.js",
              "https://netpub.media/static/" + publisherId + ".js",
              "https://cdn.netpub.media/static/" + publisherId + ".min.js",
              "https://static.netpub.media/" + publisherId + ".min.js"
            ];

            let currentUrlIndex = 0;
            let loadAttempts = 0;

            // Network connectivity check
            function checkNetworkConnectivity() {
              return navigator.onLine &&
                     (!window.navigator.connection ||
                      window.navigator.connection.effectiveType !== 'slow-2g');
            }

            // Exponential backoff delay calculation
            function getRetryDelay(attempt) {
              return Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10 seconds
            }

            // Enhanced script loading with better error handling
            function loadScript() {
              if (currentUrlIndex >= scriptUrls.length) {
                if (window.netpubRetryCount < window.netpubMaxRetries) {
                  window.netpubRetryCount++;
                  currentUrlIndex = 0;
                  const delay = getRetryDelay(window.netpubRetryCount);
                  console.warn("[NetPub] All URLs failed, retrying in " + delay + "ms (attempt " + window.netpubRetryCount + "/" + window.netpubMaxRetries + ")");
                  setTimeout(loadScript, delay);
                  return;
                }

                console.error("[NetPub] All script URLs failed after " + window.netpubMaxRetries + " retry cycles");
                window.netpubLoadFailed = true;
                window.netpubLoaded = false;

                // Dispatch custom event for error handling
                window.dispatchEvent(new CustomEvent('netpubLoadFailed', {
                  detail: { attempts: loadAttempts, lastError: 'All URLs exhausted' }
                }));
                return;
              }

              // Check network connectivity before attempting load
              if (!checkNetworkConnectivity()) {
                console.warn("[NetPub] Network connectivity issues detected, delaying load");
                setTimeout(loadScript, 2000);
                return;
              }

              loadAttempts++;
              const currentUrl = scriptUrls[currentUrlIndex];
              console.log("[NetPub] Attempting to load script from:", currentUrl, "(attempt " + loadAttempts + ")");

              // Remove any existing script with same ID
              const existingScript = document.getElementById(publisherId);
              if (existingScript) {
                existingScript.remove();
              }

              const script = document.createElement("script");
              script.id = publisherId;
              script.async = true;
              script.defer = true;
              script.crossOrigin = "anonymous";
              script.src = currentUrl + "?v=" + Date.now() + "&retry=" + window.netpubRetryCount;

              // Enhanced success handler
              script.onload = function() {
                console.log("[NetPub] Script loaded successfully from:", currentUrl);
                window.netpubLoaded = true;
                window.netpubLoadFailed = false;

                // Verify NetPub object availability with multiple checks
                let checkCount = 0;
                const maxChecks = 10;

                function verifyNetpubObject() {
                  checkCount++;

                  if (typeof window.netpub !== 'undefined' && window.netpub) {
                    console.log("[NetPub] Object verified and available");
                    window.dispatchEvent(new CustomEvent('netpubLoaded', {
                      detail: { url: currentUrl, attempts: loadAttempts }
                    }));
                    return;
                  }

                  if (checkCount < maxChecks) {
                    setTimeout(verifyNetpubObject, 200);
                  } else {
                    console.warn("[NetPub] Script loaded but object not available after " + maxChecks + " checks");
                    window.dispatchEvent(new CustomEvent('netpubObjectMissing', {
                      detail: { url: currentUrl }
                    }));
                  }
                }

                // Start verification after a short delay
                setTimeout(verifyNetpubObject, 100);
              };

              // Enhanced error handler
              script.onerror = function(error) {
                console.warn("[NetPub] Failed to load script from:", currentUrl, error);
                script.remove();
                currentUrlIndex++;

                // Progressive delay between URL attempts
                const delay = Math.min(500 * (currentUrlIndex + 1), 2000);
                setTimeout(loadScript, delay);
              };

              // Timeout handler for hanging requests
              const timeoutId = setTimeout(() => {
                if (!window.netpubLoaded) {
                  console.warn("[NetPub] Script loading timeout for:", currentUrl);
                  script.remove();
                  currentUrlIndex++;
                  loadScript();
                }
              }, 15000); // 15 second timeout

              script.onload = function() {
                clearTimeout(timeoutId);
                script.onload(); // Call the original onload
              };

              // Append script to head
              document.head.appendChild(script);
            }

            // Start loading with initial delay to ensure DOM is ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', () => {
                setTimeout(loadScript, 100);
              });
            } else {
              setTimeout(loadScript, 100);
            }

            // Add global error recovery function
            window.retryNetpubLoad = function() {
              console.log("[NetPub] Manual retry initiated");
              window.netpubScriptAttempted = false;
              window.netpubRetryCount = 0;
              currentUrlIndex = 0;
              loadScript();
            };

          })();`}
        </ScriptHandler>
      </body>
    </html>
  );
}
