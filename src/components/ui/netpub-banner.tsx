'use client';

import { useEffect, useState } from 'react';
import { shouldShowAds, shouldShowEmptyContainers, shouldShowDebugInfo, getMaxRetries } from '@/lib/ad-config';

export interface NetpubBannerProps {
  /** Banner slot number (1, 2, 3, etc.) */
  slot: string | number;
  /** Desktop banner sizes (IAB standard formats) */
  desktopSizes?: string;
  /** Mobile banner sizes (IAB standard formats) */
  mobileSizes?: string;
  /** Additional CSS classes */
  className?: string;
  /** Banner container ID for targeting */
  containerId?: string;
  /** Fixed banner attribute (for slot 4) */
  fixed?: boolean;
  /** Notification banner attribute (for slot 5) */
  notification?: boolean;
}

/**
 * Netpub Banner Component
 * 
 * Displays Netpub advertisement banners with responsive sizing.
 * Requires the Netpub script to be loaded in the layout.
 * 
 * Common IAB Standard Sizes:
 * - 728x90 (Leaderboard)
 * - 300x250 (Medium Rectangle)
 * - 336x280 (Large Rectangle)
 * - 320x50 (Mobile Banner)
 * - 300x600 (Half Page)
 * - 970x250 (Billboard)
 */
export function NetpubBanner({
  slot,
  desktopSizes = "200x200,250x250,300x250,336x280",
  mobileSizes = "200x200,250x250,300x250,336x280",
  className = "",
  containerId,
  fixed = false,
  notification = false
}: NetpubBannerProps) {
  const [isClient, setIsClient] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [hasAdContent, setHasAdContent] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Enhanced script checking with ad content detection
    const checkScript = () => {
      const script = document.getElementById('831b33a650047ee11a992b11fdadd8f3');
      const scriptExists = !!script;
      const netpubLoaded = !!(window as any).netpubLoaded;
      const netpubFailed = !!(window as any).netpubLoadFailed;
      const netpubObject = typeof (window as any).netpub !== 'undefined';
      const retryCount = (window as any).netpubRetryCount || 0;

      const isScriptReady = scriptExists && netpubLoaded && netpubObject;
      setScriptLoaded(isScriptReady);

      // Check if ad content is actually loaded
      const bannerId = containerId || `netpub-banner-slot-${slot}`;
      const adContainer = document.getElementById(bannerId);
      const adElement = adContainer?.querySelector('.adv-831b33a650047ee11a992b11fdadd8f3');

      let hasContent = false;
      if (adElement) {
        // Check if ad has actual content (not just the empty ins tag)
        const hasChildren = adElement.children.length > 0;
        const hasInnerHTML = adElement.innerHTML.trim().length > 0;
        const hasIframe = adElement.querySelector('iframe') !== null;
        const hasScript = adElement.querySelector('script') !== null;

        hasContent = hasChildren || hasInnerHTML || hasIframe || hasScript;
      }

      setHasAdContent(hasContent);

      // Only render if script is ready AND we have content, OR if we're still loading
      const maxRetries = getMaxRetries();
      const stillLoading = !netpubFailed && retryCount < maxRetries;
      const shouldShow = (isScriptReady && hasContent) || (stillLoading && shouldShowEmptyContainers());
      setShouldRender(shouldShow);

      // Enhanced debug information
      const debug = [
        `Script exists: ${scriptExists}`,
        `NetPub loaded: ${netpubLoaded}`,
        `NetPub failed: ${netpubFailed}`,
        `NetPub object: ${netpubObject}`,
        `Retry count: ${retryCount}`,
        `Has content: ${hasContent}`,
        `Should render: ${shouldShow}`,
        `Slot: ${slot}`
      ].join(' | ');

      setDebugInfo(debug);
      console.log(`[NetpubBanner Slot ${slot}] ${debug}`);
    };

    // Check immediately and after delays
    checkScript();
    const timer1 = setTimeout(checkScript, 1000);
    const timer2 = setTimeout(checkScript, 3000);
    const timer3 = setTimeout(checkScript, 5000);
    const timer4 = setTimeout(checkScript, 10000); // Additional check for slower loading ads

    // Listen for NetPub events
    const handleNetpubLoaded = () => {
      console.log(`[NetpubBanner Slot ${slot}] NetPub loaded event received`);
      setTimeout(checkScript, 500);
    };

    const handleNetpubFailed = () => {
      console.log(`[NetpubBanner Slot ${slot}] NetPub failed event received`);
      setTimeout(checkScript, 500);
    };

    window.addEventListener('netpubLoaded', handleNetpubLoaded);
    window.addEventListener('netpubLoadFailed', handleNetpubFailed);
    window.addEventListener('netpubObjectMissing', handleNetpubFailed);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      window.removeEventListener('netpubLoaded', handleNetpubLoaded);
      window.removeEventListener('netpubLoadFailed', handleNetpubFailed);
      window.removeEventListener('netpubObjectMissing', handleNetpubFailed);
    };
  }, [slot, desktopSizes, mobileSizes]);

  // Don't render during SSR to avoid hydration mismatches
  if (!isClient) {
    return null;
  }

  // Don't render if ads are disabled globally
  if (!shouldShowAds()) {
    return null;
  }

  // Don't render if we shouldn't show the container
  if (!shouldRender) {
    return null;
  }

  const bannerClass = `adv-831b33a650047ee11a992b11fdadd8f3`;
  const bannerId = containerId || `netpub-banner-slot-${slot}`;

  // Check if we should show fallback content (only in development when enabled)
  const showFallback = shouldShowEmptyContainers() && !scriptLoaded && (window as any).netpubLoadFailed;

  // Build the ins element attributes
  const insAttributes: Record<string, string | number | React.CSSProperties> = {
    className: bannerClass,
    'data-sizes-desktop': desktopSizes,
    'data-sizes-mobile': mobileSizes,
    'data-slot': slot.toString(),
    style: {
      display: 'block',
      textAlign: 'center',
      minHeight: hasAdContent ? 'auto' : '50px',
      maxWidth: '100%',
      backgroundColor: 'transparent', // Always transparent in production
      border: 'none', // No borders in production
      position: 'relative',
      zIndex: 1
    }
  };

  // Add special attributes for fixed and notification banners
  if (fixed) {
    insAttributes['data-fixed'] = '1';
  }

  if (notification) {
    insAttributes['data-notification'] = '1';
  }

  return (
    <div
      id={bannerId}
      className={`netpub-banner-container ${className}`}
      data-slot={slot}
      data-desktop-sizes={desktopSizes}
      data-mobile-sizes={mobileSizes}
    >
      {showFallback ? (
        // Fallback content when ads fail to load
        <div
          className="ad-fallback-content"
          style={{
            minHeight: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            color: '#6c757d',
            fontSize: '14px'
          }}
        >
          {process.env.NODE_ENV === 'development' ? (
            <div className="text-center">
              <div>Ad Slot {slot}</div>
              <div className="text-xs mt-1">Script failed to load</div>
            </div>
          ) : (
            <div>Advertisement</div>
          )}
        </div>
      ) : (
        <ins {...insAttributes} />
      )}

      {shouldShowDebugInfo() && (
        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded">
          <div>Slot {slot} Debug Info:</div>
          <div>Desktop: {desktopSizes}</div>
          <div>Mobile: {mobileSizes}</div>
          <div>Script Loaded: {scriptLoaded ? '✅' : '❌'}</div>
          <div>Has Content: {hasAdContent ? '✅' : '❌'}</div>
          <div>Should Render: {shouldRender ? '✅' : '❌'}</div>
          <div>Failed: {(window as any).netpubLoadFailed ? '✅' : '❌'}</div>
          <div>Retry: {(window as any).netpubRetryCount || 0}</div>
          <div className="font-mono text-xs break-all mt-1">{debugInfo}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Predefined banner components for common use cases
 */

/** 300x250 Medium Rectangle Banner */
export function NetpubMediumRectangle({ 
  slot = 2, 
  className = "",
  ...props 
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="300x250"
      mobileSizes="300x250"
      className={`medium-rectangle ${className}`}
      {...props}
    />
  );
}

/** 728x90 Leaderboard Banner */
export function NetpubLeaderboard({ 
  slot = 1, 
  className = "",
  ...props 
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="728x90"
      mobileSizes="320x50"
      className={`leaderboard ${className}`}
      {...props}
    />
  );
}

/** 336x280 Large Rectangle Banner */
export function NetpubLargeRectangle({ 
  slot = 3, 
  className = "",
  ...props 
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="336x280"
      mobileSizes="300x250"
      className={`large-rectangle ${className}`}
      {...props}
    />
  );
}

/** 300x600 Half Page Banner */
export function NetpubHalfPage({ 
  slot = 4, 
  className = "",
  ...props 
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="300x600"
      mobileSizes="300x250"
      className={`half-page ${className}`}
      {...props}
    />
  );
}

/** Responsive Multi-Size Banner (matches your provided script) */
export function NetpubResponsiveBanner({
  slot = 2,
  className = "",
  ...props
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="200x200,250x250,300x250,336x280"
      mobileSizes="200x200,250x250,300x250,336x280"
      className={`responsive-banner ${className}`}
      {...props}
    />
  );
}

/** IAB Multi-Size Banner for Slot 3 (300x600 primary) */
export function NetpubIABBanner({
  slot = 3,
  className = "",
  ...props
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="120x600,160x600,200x200,250x250,300x250,300x600,336x280"
      mobileSizes="160x600,200x200,250x250,300x250,300x600,336x280"
      className={`iab-banner ${className}`}
      {...props}
    />
  );
}

/** Fixed Leaderboard Banner for Slot 4 (728x90 fixed) */
export function NetpubFixedLeaderboard({
  slot = 4,
  className = "",
  ...props
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes' | 'fixed'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="468x60,678x60,728x90,970x90"
      mobileSizes="300x50,320x100,320x50,360x100,360x50"
      fixed={true}
      className={`fixed-leaderboard ${className}`}
      {...props}
    />
  );
}

/** Notification Banner for Slot 5 (150x0 notification style) */
export function NetpubNotificationBanner({
  slot = 5,
  className = "",
  ...props
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes' | 'notification'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="120x600,160x600,300x600,336x280"
      mobileSizes="120x600,160x600,300x600,336x280"
      notification={true}
      className={`notification-banner ${className}`}
      {...props}
    />
  );
}

/** IAB 360x100 Banner for Slot 6 (Multi-size responsive banner) */
export function NetpubSlot6Banner({
  slot = 6,
  className = "",
  ...props
}: Omit<NetpubBannerProps, 'desktopSizes' | 'mobileSizes'>) {
  return (
    <NetpubBanner
      slot={slot}
      desktopSizes="300x50,320x100,320x50,360x100,360x50"
      mobileSizes="300x50,320x100,320x50,360x100,360x50"
      className={`slot6-banner ${className}`}
      {...props}
    />
  );
}

/**
 * Banner placement wrapper with styling
 */
export function BannerPlacement({ 
  children, 
  position = "center",
  margin = "my-8",
  className = ""
}: {
  children: React.ReactNode;
  position?: "left" | "center" | "right";
  margin?: string;
  className?: string;
}) {
  const positionClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <div className={`banner-placement ${margin} ${positionClasses[position]} ${className}`}>
      {children}
    </div>
  );
}
