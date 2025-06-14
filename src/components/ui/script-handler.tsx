'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export interface ScriptHandlerProps {
  /** Script source URL */
  src?: string;
  /** Inline script content */
  children?: string;
  /** Script loading strategy */
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
  /** Script ID for deduplication */
  id?: string;
  /** Callback when script loads */
  onLoad?: () => void;
  /** Callback when script errors */
  onError?: (error: Error) => void;
  /** Whether to execute on server-side (for inline scripts) */
  executeOnServer?: boolean;
  /** Additional script attributes */
  [key: string]: unknown;
}

/**
 * Enhanced Script component that handles both external scripts and inline scripts
 * with proper SSR support and client-side execution
 */
export function ScriptHandler({
  src,
  children,
  strategy = 'afterInteractive',
  id,
  onLoad,
  onError,
  executeOnServer = false,
  ...props
}: ScriptHandlerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // For external scripts, use Next.js Script component
  if (src) {
    return (
      <Script
        src={src}
        strategy={strategy}
        id={id}
        onLoad={() => {
          console.log(`[ScriptHandler] External script loaded: ${src}`);
          onLoad?.();
        }}
        onError={(error) => {
          console.error(`[ScriptHandler] External script error: ${src}`, error);
          onError?.(error);
        }}
        {...props}
      />
    );
  }

  // For inline scripts
  if (children) {
    // Server-side execution (if enabled)
    if (executeOnServer && typeof window === 'undefined') {
      try {
        // Only execute safe, non-DOM scripts on server
        if (!children.includes('document') && !children.includes('window')) {
          eval(children);
        }
      } catch (error) {
        console.warn('Server-side script execution failed:', error);
      }
    }

    // Client-side execution
    if (isClient) {
      return (
        <Script
          id={id || `inline-script-${Math.random().toString(36).substr(2, 9)}`}
          strategy={strategy}
          onLoad={() => {
            console.log(`[ScriptHandler] Inline script loaded: ${id || 'unnamed'}`);
            onLoad?.();
          }}
          onError={(error) => {
            console.error(`[ScriptHandler] Inline script error: ${id || 'unnamed'}`, error);
            onError?.(error);
          }}
          {...props}
        >
          {children}
        </Script>
      );
    }

    // Return null during SSR for client-only scripts
    return null;
  }

  return null;
}

/**
 * Hook for dynamically loading scripts
 */
export function useScript(src: string, options?: {
  strategy?: ScriptHandlerProps['strategy'];
  onLoad?: () => void;
  onError?: (error: Error) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!src) return;

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
      setLoaded(true);
      options?.onLoad?.();
    };

    script.onerror = () => {
      const error = new Error(`Failed to load script: ${src}`);
      setError(error);
      options?.onError?.(error);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [src, options]);

  return { loaded, error };
}

/**
 * Component for handling critical inline scripts that need to run before hydration
 */
export function CriticalInlineScript({ 
  children, 
  id 
}: { 
  children: string; 
  id?: string; 
}) {
  // This will be rendered during SSR and executed immediately
  return (
    <script
      id={id}
      dangerouslySetInnerHTML={{ __html: children }}
      suppressHydrationWarning
    />
  );
}

/**
 * Component for handling theme scripts that need to run before paint
 */
export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('neuradock-theme') || 'system';
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const effectiveTheme = theme === 'system' ? systemTheme : theme;
        
        if (effectiveTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.warn('Theme script error:', e);
      }
    })();
  `;

  return (
    <CriticalInlineScript id="theme-script">
      {themeScript}
    </CriticalInlineScript>
  );
}
