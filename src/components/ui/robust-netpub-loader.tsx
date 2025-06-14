'use client';

import { useEffect, useState } from 'react';
import { ScriptHandler } from './script-handler';

export interface NetpubLoaderProps {
  publisherId?: string;
  enableFallback?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Robust NetPub Script Loader
 * 
 * Handles NetPub script loading with fallback mechanisms and error recovery.
 * Provides graceful degradation when ad scripts fail to load.
 */
export function RobustNetpubLoader({
  publisherId = "831b33a650047ee11a992b11fdadd8f3",
  enableFallback = true,
  maxRetries = 2,
  retryDelay = 3000,
  timeout = 10000
}: NetpubLoaderProps) {
  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'failed' | 'fallback'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Initialize global state
    if (typeof window !== 'undefined') {
      (window as any).netpubStartTime = Date.now();
      (window as any).netpubScriptLoaded = false;
      (window as any).netpubLoadFailed = false;
      (window as any).netpubRetryCount = 0;
    }
  }, []);

  const scriptContent = `
    (function() {
      console.log('[NetPub Robust] Initializing robust NetPub loader...');
      
      const publisherId = "${publisherId}";
      const maxRetries = ${maxRetries};
      const retryDelay = ${retryDelay};
      const timeout = ${timeout};
      const enableFallback = ${enableFallback};
      
      // Prevent multiple executions
      if (window.netpubRobustLoaderActive) {
        console.log('[NetPub Robust] Loader already active');
        return;
      }
      window.netpubRobustLoaderActive = true;
      
      // Initialize state
      window.netpubScriptLoaded = false;
      window.netpubLoadFailed = false;
      window.netpubRetryCount = 0;
      window.netpubStartTime = Date.now();
      
      // Simplified script URLs with better fallbacks
      const scriptUrls = [
        "https://fstatic.netpub.media/static/" + publisherId + ".min.js",
        "https://fstatic.netpub.media/static/" + publisherId + ".js",
        "https://cdn.netpub.media/static/" + publisherId + ".min.js"
      ];
      
      let currentAttempt = 0;
      let currentUrlIndex = 0;
      
      function cleanupScripts() {
        const existingScripts = document.querySelectorAll('script[id*="netpub-robust"]');
        existingScripts.forEach(script => script.remove());
      }
      
      function reportSuccess() {
        console.log('[NetPub Robust] ✅ Script loaded successfully');
        window.netpubScriptLoaded = true;
        window.netpubLoadFailed = false;
        
        window.dispatchEvent(new CustomEvent('netpubLoaded', {
          detail: { publisherId, timestamp: Date.now(), robust: true }
        }));
      }
      
      function reportFailure() {
        console.warn('[NetPub Robust] ❌ All loading attempts failed');
        window.netpubScriptLoaded = false;
        window.netpubLoadFailed = true;
        
        if (enableFallback) {
          console.log('[NetPub Robust] Enabling fallback mode');
          window.dispatchEvent(new CustomEvent('netpubLoadFailed', {
            detail: { publisherId, fallbackEnabled: true, timestamp: Date.now() }
          }));
        }
      }
      
      function attemptLoad() {
        if (currentAttempt >= maxRetries || currentUrlIndex >= scriptUrls.length) {
          reportFailure();
          return;
        }
        
        const url = scriptUrls[currentUrlIndex] + "?t=" + Date.now();
        console.log('[NetPub Robust] Attempt ' + (currentAttempt + 1) + '/' + maxRetries + ', URL: ' + url);
        
        cleanupScripts();
        
        const script = document.createElement('script');
        script.id = 'netpub-robust-' + currentAttempt + '-' + currentUrlIndex;
        script.src = url;
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        const timeoutId = setTimeout(() => {
          console.warn('[NetPub Robust] Timeout for: ' + url);
          script.remove();
          nextAttempt();
        }, timeout);
        
        script.onload = function() {
          clearTimeout(timeoutId);
          
          // Wait for script to initialize
          setTimeout(() => {
            const hasNetpub = typeof window.netpub !== 'undefined' || 
                             typeof window.NetPub !== 'undefined' ||
                             typeof window.__npEngineRun_831b33a650047ee11a992b11fdadd8f3 !== 'undefined';
            
            if (hasNetpub) {
              reportSuccess();
            } else {
              console.warn('[NetPub Robust] Script loaded but NetPub objects not found');
              nextAttempt();
            }
          }, 1000);
        };
        
        script.onerror = function() {
          clearTimeout(timeoutId);
          console.warn('[NetPub Robust] Failed to load: ' + url);
          script.remove();
          nextAttempt();
        };
        
        try {
          document.head.appendChild(script);
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('[NetPub Robust] Error appending script:', error);
          nextAttempt();
        }
      }
      
      function nextAttempt() {
        currentUrlIndex++;
        if (currentUrlIndex >= scriptUrls.length) {
          currentUrlIndex = 0;
          currentAttempt++;
          window.netpubRetryCount = currentAttempt;
          
          if (currentAttempt < maxRetries) {
            console.log('[NetPub Robust] Retrying in ' + retryDelay + 'ms...');
            setTimeout(attemptLoad, retryDelay);
          } else {
            reportFailure();
          }
        } else {
          attemptLoad();
        }
      }
      
      // Start loading process
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attemptLoad);
      } else {
        setTimeout(attemptLoad, 100);
      }
      
      // Manual retry function
      window.retryNetpubRobust = function() {
        console.log('[NetPub Robust] Manual retry initiated');
        currentAttempt = 0;
        currentUrlIndex = 0;
        window.netpubRetryCount = 0;
        window.netpubScriptLoaded = false;
        window.netpubLoadFailed = false;
        attemptLoad();
      };
      
    })();
  `;

  return (
    <ScriptHandler
      strategy="afterInteractive"
      id="netpub-robust-loader"
    >
      {scriptContent}
    </ScriptHandler>
  );
}

/**
 * NetPub Status Monitor
 * 
 * Monitors NetPub loading status and provides debugging information
 */
export function NetpubStatusMonitor() {
  const [status, setStatus] = useState({
    loaded: false,
    failed: false,
    retryCount: 0,
    startTime: 0
  });

  useEffect(() => {
    const updateStatus = () => {
      if (typeof window !== 'undefined') {
        setStatus({
          loaded: (window as any).netpubScriptLoaded || false,
          failed: (window as any).netpubLoadFailed || false,
          retryCount: (window as any).netpubRetryCount || 0,
          startTime: (window as any).netpubStartTime || 0
        });
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    const handleNetpubLoaded = () => updateStatus();
    const handleNetpubFailed = () => updateStatus();

    window.addEventListener('netpubLoaded', handleNetpubLoaded);
    window.addEventListener('netpubLoadFailed', handleNetpubFailed);

    return () => {
      clearInterval(interval);
      window.removeEventListener('netpubLoaded', handleNetpubLoaded);
      window.removeEventListener('netpubLoadFailed', handleNetpubFailed);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const elapsed = status.startTime ? Math.round((Date.now() - status.startTime) / 1000) : 0;

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-[100] font-mono">
      <div>NetPub: {status.loaded ? '✅' : status.failed ? '❌' : '⏳'}</div>
      <div>Retries: {status.retryCount}</div>
      <div>Time: {elapsed}s</div>
    </div>
  );
}

/**
 * NetPub Fallback Provider
 * 
 * Provides fallback ad content when NetPub fails to load
 */
export function NetpubFallbackProvider({ children }: { children: React.ReactNode }) {
  const [fallbackActive, setFallbackActive] = useState(false);

  useEffect(() => {
    const handleNetpubFailed = () => {
      setFallbackActive(true);
    };

    const handleNetpubLoaded = () => {
      setFallbackActive(false);
    };

    window.addEventListener('netpubLoadFailed', handleNetpubFailed);
    window.addEventListener('netpubLoaded', handleNetpubLoaded);

    return () => {
      window.removeEventListener('netpubLoadFailed', handleNetpubFailed);
      window.removeEventListener('netpubLoaded', handleNetpubLoaded);
    };
  }, []);

  return (
    <>
      {children}
      {fallbackActive && (
        <div className="fixed top-4 right-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded p-3 text-sm z-[100]">
          <div className="font-medium text-yellow-800 dark:text-yellow-200">
            Ad System Notice
          </div>
          <div className="text-yellow-700 dark:text-yellow-300">
            Using fallback ad display
          </div>
        </div>
      )}
    </>
  );
}
