'use client';

import React, { useEffect, useState } from 'react';
import { OverlayAd, OverlaySlot3Ad, OverlaySlot4Ad, OverlaySlot5Ad, OverlayAdManager } from './overlay-ad-system';

/**
 * Global Overlay Ad Provider
 * 
 * Replaces all inline Netpub ads with overlay versions.
 * Should be placed in the root layout to provide ads across all pages.
 */
export function GlobalOverlayAdProvider({
  children,
  enableSlot3 = true,
  enableSlot4 = true,
  enableSlot5 = true,
  slot3Position = 'center-right',
  slot4Position = 'top-center',
  slot5Position = 'bottom-center',
  showOnMobile = true,
  autoShowDelay = 3000
}: {
  children: React.ReactNode;
  enableSlot3?: boolean;
  enableSlot4?: boolean;
  enableSlot5?: boolean;
  slot3Position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right';
  slot4Position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  slot5Position?: 'top-center' | 'bottom-center' | 'bottom-left' | 'bottom-right';
  showOnMobile?: boolean;
  autoShowDelay?: number;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* Hide inline ads */}
      <InlineAdHider />

      {/* Overlay Ad Manager */}
      <OverlayAdManager maxAds={3}>
        {/* Slot 3 - 300x600 Half Page (Sidebar replacement) */}
        {enableSlot3 && (
          <OverlaySlot3Ad
            position={slot3Position}
            autoShowDelay={autoShowDelay}
            showOnMobile={showOnMobile}
            animation="slide-in-right"
            closable={true}
            minimizable={true}
          />
        )}

        {/* Slot 4 - Fixed Leaderboard (Header replacement) */}
        {enableSlot4 && (
          <OverlaySlot4Ad
            position={slot4Position}
            autoShowDelay={autoShowDelay + 1000}
            showOnMobile={showOnMobile}
            animation="slide-in-bottom"
            closable={true}
            minimizable={true}
          />
        )}

        {/* Slot 5 - Notification Banner */}
        {enableSlot5 && (
          <OverlaySlot5Ad
            position={slot5Position}
            autoShowDelay={autoShowDelay + 2000}
            showOnMobile={showOnMobile}
            animation="fade-in"
            closable={true}
            minimizable={false}
          />
        )}
      </OverlayAdManager>
    </>
  );
}

/**
 * Page-specific overlay ad configurations
 */

/** Homepage Overlay Ads */
export function HomepageOverlayAds() {
  return (
    <OverlayAdManager>
      <OverlaySlot3Ad
        position="center-right"
        autoShowDelay={2000}
        animation="slide-in-right"
      />
      <OverlaySlot4Ad
        position="top-center"
        autoShowDelay={3000}
        animation="slide-in-bottom"
      />
    </OverlayAdManager>
  );
}

/** Article Page Overlay Ads */
export function ArticleOverlayAds() {
  return (
    <OverlayAdManager>
      <OverlaySlot3Ad
        position="center-right"
        autoShowDelay={4000}
        animation="slide-in-right"
      />
      <OverlaySlot5Ad
        position="bottom-center"
        autoShowDelay={6000}
        animation="fade-in"
      />
    </OverlayAdManager>
  );
}

/** Category Page Overlay Ads */
export function CategoryOverlayAds() {
  return (
    <OverlayAdManager>
      <OverlaySlot3Ad
        position="center-right"
        autoShowDelay={3000}
        animation="slide-in-right"
      />
      <OverlaySlot4Ad
        position="bottom-center"
        autoShowDelay={5000}
        animation="slide-in-bottom"
      />
    </OverlayAdManager>
  );
}

/**
 * Overlay Ad Replacement Components
 * 
 * These components replace the existing inline ad components
 * but render as overlays instead of inline elements.
 */

/** Replaces HeaderAd */
export function OverlayHeaderAd({
  slot = 4,
  position = 'top-center',
  ...props
}: {
  slot?: number;
  position?: 'top-left' | 'top-right' | 'top-center';
  autoShowDelay?: number;
  showOnMobile?: boolean;
}) {
  return (
    <OverlayAd
      slot={slot}
      desktopSizes="728x90,970x90"
      mobileSizes="320x50,360x50"
      position={position}
      animation="slide-in-bottom"
      closable={true}
      minimizable={true}
      {...props}
    />
  );
}

/** Replaces SidebarAd */
export function OverlaySidebarAd({
  slot = 3,
  position = 'center-right',
  ...props
}: {
  slot?: number;
  position?: 'center-left' | 'center-right' | 'top-right' | 'bottom-right';
  autoShowDelay?: number;
  showOnMobile?: boolean;
}) {
  return (
    <OverlayAd
      slot={slot}
      desktopSizes="300x600"
      mobileSizes="300x250"
      position={position}
      animation="slide-in-right"
      closable={true}
      minimizable={true}
      {...props}
    />
  );
}

/** Replaces FooterAd */
export function OverlayFooterAd({
  slot = 4,
  position = 'bottom-center',
  ...props
}: {
  slot?: number;
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  autoShowDelay?: number;
  showOnMobile?: boolean;
}) {
  return (
    <OverlayAd
      slot={slot}
      desktopSizes="728x90,970x90"
      mobileSizes="320x50,360x50"
      position={position}
      animation="slide-in-bottom"
      closable={true}
      minimizable={true}
      {...props}
    />
  );
}

/** Replaces ContentAd */
export function OverlayContentAd({
  slot = 2,
  position = 'bottom-right',
  ...props
}: {
  slot?: number;
  position?: 'top-right' | 'bottom-right' | 'center-right';
  autoShowDelay?: number;
  showOnMobile?: boolean;
}) {
  return (
    <OverlayAd
      slot={slot}
      desktopSizes="300x250,336x280"
      mobileSizes="300x250"
      position={position}
      animation="fade-in"
      closable={true}
      minimizable={true}
      {...props}
    />
  );
}

/** Replaces MobileAd */
export function OverlayMobileAd({
  slot = 6,
  position = 'bottom-center',
  ...props
}: {
  slot?: number;
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center';
  autoShowDelay?: number;
}) {
  return (
    <OverlayAd
      slot={slot}
      desktopSizes="360x100,320x100"
      mobileSizes="320x50,360x50"
      position={position}
      animation="slide-in-bottom"
      closable={true}
      minimizable={true}
      showOnMobile={true}
      {...props}
    />
  );
}

/**
 * Utility function to remove inline ads and replace with overlays
 */
export function useOverlayAdReplacement() {
  useEffect(() => {
    // Remove any existing inline ad containers that might interfere
    const removeInlineAds = () => {
      const inlineAdSelectors = [
        '.universal-ad-container',
        '.netpub-banner-container',
        '.banner-placement',
        '.ad-banner-wrapper',
        '.sidebar-ad-container',
        '.header-ad-container',
        '.footer-ad-container',
        '.content-ad-container'
      ];

      inlineAdSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Only hide, don't remove completely to preserve any necessary functionality
          (element as HTMLElement).style.display = 'none';
          (element as HTMLElement).style.visibility = 'hidden';
          (element as HTMLElement).style.height = '0';
          (element as HTMLElement).style.overflow = 'hidden';
        });
      });
    };

    // Run after a short delay to ensure DOM is ready
    const timer = setTimeout(removeInlineAds, 1000);

    // Also run on route changes
    const observer = new MutationObserver(() => {
      removeInlineAds();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}

/**
 * CSS injection to hide inline ads globally
 */
export function InlineAdHider() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'overlay-ad-hider';
    style.textContent = `
      /* Hide all inline ad containers when overlay ads are active */
      .universal-ad-container,
      .netpub-banner-container,
      .banner-placement,
      .ad-banner-wrapper,
      .sidebar-ad-container,
      .header-ad-container,
      .footer-ad-container,
      .content-ad-container {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Restore original layout spacing */
      .main-content-area {
        width: 100% !important;
      }

      /* Ensure sidebar doesn't have ad spacing */
      .sidebar-ad-container + * {
        margin-top: 0 !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('overlay-ad-hider');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return null;
}
