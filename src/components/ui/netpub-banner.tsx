'use client';

import { useEffect, useState, useRef } from 'react';
import { shouldShowAds, shouldShowEmptyContainers, shouldShowDebugInfo, getMaxRetries } from '@/lib/ad-config';
import { useAdVisibility } from '@/hooks/use-ad-visibility';

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

  // Use the new ad visibility hook
  const containerRef = useRef<HTMLDivElement>(null);
  const adVisibility = useAdVisibility({
    elementRef: containerRef,
    slot,
    autoStart: true
  });

  useEffect(() => {
    setIsClient(true);

    // Simplified script checking - main logic now handled by useAdVisibility hook
    const checkScript = () => {
      const script = document.getElementById('831b33a650047ee11a992b11fdadd8f3');
      const scriptExists = !!script;
      const netpubLoaded = !!(window as any).netpubLoaded;
      const netpubObject = typeof (window as any).netpub !== 'undefined';

      const isScriptReady = scriptExists && netpubLoaded && netpubObject;
      setScriptLoaded(isScriptReady);

      // Enhanced debug information
      const debug = [
        `Script exists: ${scriptExists}`,
        `NetPub loaded: ${netpubLoaded}`,
        `NetPub object: ${netpubObject}`,
        `Slot: ${slot}`,
        `Visibility: ${adVisibility.isVisible}`,
        `Has content: ${adVisibility.hasContent}`,
        `Is loading: ${adVisibility.isLoading}`,
        `Is blocked: ${adVisibility.isBlocked}`
      ].join(' | ');

      setDebugInfo(debug);

      if (shouldShowDebugInfo()) {
        console.log(`[NetpubBanner Slot ${slot}] ${debug}`);
      }
    };

    // Check immediately and after delays
    checkScript();
    const timer1 = setTimeout(checkScript, 1000);
    const timer2 = setTimeout(checkScript, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [slot, adVisibility]);

  // Don't render during SSR to avoid hydration mismatches
  if (!isClient) {
    return null;
  }

  // Don't render if ads are disabled globally
  if (!shouldShowAds()) {
    return null;
  }

  // Don't render if ad visibility hook determines it shouldn't be visible
  // This includes cases where content is empty, blocked, or failed to load
  if (!adVisibility.isVisible && !adVisibility.isLoading) {
    return null;
  }

  const bannerClass = `adv-831b33a650047ee11a992b11fdadd8f3`;
  const bannerId = containerId || `netpub-banner-slot-${slot}`;

  // Check if we should show fallback content (only in development when enabled)
  const showFallback = shouldShowEmptyContainers() && !scriptLoaded && adVisibility.isBlocked;

  // Build the ins element attributes
  const insAttributes: Record<string, string | number | React.CSSProperties> = {
    className: bannerClass,
    'data-sizes-desktop': desktopSizes,
    'data-sizes-mobile': mobileSizes,
    'data-slot': slot.toString(),
    style: {
      display: 'block',
      textAlign: 'center',
      minHeight: adVisibility.hasContent ? 'auto' : (adVisibility.isLoading ? '50px' : '0'),
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
      ref={containerRef}
      id={bannerId}
      className={`netpub-banner-container ${className}`}
      data-slot={slot}
      data-desktop-sizes={desktopSizes}
      data-mobile-sizes={mobileSizes}
      data-ad-hidden={!adVisibility.isVisible ? 'true' : 'false'}
      data-ad-blocked={adVisibility.isBlocked ? 'true' : 'false'}
      data-ad-loading={adVisibility.isLoading ? 'true' : 'false'}
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
          <div>Is Visible: {adVisibility.isVisible ? '✅' : '❌'}</div>
          <div>Has Content: {adVisibility.hasContent ? '✅' : '❌'}</div>
          <div>Is Loading: {adVisibility.isLoading ? '✅' : '❌'}</div>
          <div>Is Blocked: {adVisibility.isBlocked ? '✅' : '❌'}</div>
          <div>Content Type: {adVisibility.contentInfo?.contentType || 'unknown'}</div>
          <div>Content Size: {adVisibility.contentInfo ? `${adVisibility.contentInfo.contentSize.width}x${adVisibility.contentInfo.contentSize.height}` : 'unknown'}</div>
          <div className="font-mono text-xs break-all mt-1">{debugInfo}</div>
          <div className="font-mono text-xs break-all mt-1">{adVisibility.debugInfo}</div>
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
