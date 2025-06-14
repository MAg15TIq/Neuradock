'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Minus, RotateCcw } from 'lucide-react';

export interface OverlayAdProps {
  /** Ad slot number */
  slot: string | number;
  /** Desktop banner sizes */
  desktopSizes: string;
  /** Mobile banner sizes */
  mobileSizes: string;
  /** Overlay position */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' | 'center-left' | 'center-right';
  /** Animation type */
  animation?: 'slide-in-right' | 'slide-in-bottom' | 'fade-in' | 'none';
  /** Whether the ad can be closed */
  closable?: boolean;
  /** Whether the ad can be minimized */
  minimizable?: boolean;
  /** Auto-show delay in milliseconds */
  autoShowDelay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Custom container ID */
  containerId?: string;
  /** Whether to show on mobile */
  showOnMobile?: boolean;
  /** Z-index override */
  zIndex?: number;
}

/**
 * Overlay Ad Component
 * 
 * Displays Netpub ads as overlays that don't disrupt page layout.
 * Includes controls for closing, minimizing, and repositioning.
 */
export function OverlayAd({
  slot,
  desktopSizes,
  mobileSizes,
  position = 'bottom-right',
  animation = 'slide-in-right',
  closable = true,
  minimizable = true,
  autoShowDelay = 2000,
  className = '',
  containerId,
  showOnMobile = true,
  zIndex = 50
}: OverlayAdProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [netpubLoaded, setNetpubLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Check if client-side and detect mobile
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Monitor NetPub script loading
  useEffect(() => {
    if (!isClient) return;

    const checkNetpubStatus = () => {
      const scriptLoaded = (window as any).netpubScriptLoaded;
      const loadFailed = (window as any).netpubLoadFailed;

      setNetpubLoaded(scriptLoaded);
      setShowFallback(loadFailed || (!scriptLoaded && Date.now() > (window as any).netpubStartTime + 10000));
    };

    // Set start time for fallback detection
    if (!(window as any).netpubStartTime) {
      (window as any).netpubStartTime = Date.now();
    }

    // Check immediately and then periodically
    checkNetpubStatus();
    const interval = setInterval(checkNetpubStatus, 1000);

    // Listen for NetPub events
    const handleNetpubLoaded = () => {
      setNetpubLoaded(true);
      setShowFallback(false);
    };

    const handleNetpubFailed = () => {
      setNetpubLoaded(false);
      setShowFallback(true);
    };

    window.addEventListener('netpubLoaded', handleNetpubLoaded);
    window.addEventListener('netpubLoadFailed', handleNetpubFailed);

    return () => {
      clearInterval(interval);
      window.removeEventListener('netpubLoaded', handleNetpubLoaded);
      window.removeEventListener('netpubLoadFailed', handleNetpubFailed);
    };
  }, [isClient]);

  // Auto-show with delay
  useEffect(() => {
    if (!isClient || isClosed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, autoShowDelay);

    return () => clearTimeout(timer);
  }, [isClient, autoShowDelay, isClosed]);

  // Callback handlers (defined after all hooks)
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsClosed(true), 300);
  }, []);

  const handleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  const handleRestore = useCallback(() => {
    setIsMinimized(false);
    setIsVisible(true);
  }, []);

  // Early returns after all hooks have been called
  // Don't render if closed
  if (isClosed) {
    return null;
  }

  // Don't render on mobile if not allowed (only after client-side hydration)
  if (isClient && isMobile && !showOnMobile) {
    return null;
  }

  // Don't render during SSR to prevent hydration mismatches
  if (!isClient) {
    return null;
  }

  const bannerId = containerId || `overlay-ad-slot-${slot}`;
  const bannerClass = 'adv-831b33a650047ee11a992b11fdadd8f3';

  // Get position classes
  const getPositionClasses = () => {
    const baseClasses = 'overlay-ad-container';
    const positionClass = `overlay-ad-${position}`;
    const visibilityClass = isVisible ? 'visible' : 'hidden';
    const animationClass = animation !== 'none' && isVisible ? `overlay-ad-${animation}` : '';

    return cn(baseClasses, positionClass, visibilityClass, animationClass, className);
  };

  // Get current sizes based on device (for future use)
  // const currentSizes = isMobile ? mobileSizes : desktopSizes;

  return (
    <div
      id={bannerId}
      className={getPositionClasses()}
      style={{ zIndex }}
      data-slot={slot}
      data-position={position}
      role="complementary"
      aria-label="Advertisement"
    >
      <div className={cn('overlay-ad-content', isMinimized && 'minimized')}>
        {/* Ad Controls */}
        {(closable || minimizable) && (
          <div className="overlay-ad-controls">
            {minimizable && (
              <button
                onClick={isMinimized ? handleRestore : handleMinimize}
                className="overlay-ad-control-btn"
                title={isMinimized ? 'Restore ad' : 'Minimize ad'}
                aria-label={isMinimized ? 'Restore ad' : 'Minimize ad'}
              >
                {isMinimized ? <RotateCcw size={12} /> : <Minus size={12} />}
              </button>
            )}
            {closable && (
              <button
                onClick={handleClose}
                className="overlay-ad-control-btn"
                title="Close ad"
                aria-label="Close ad"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Ad Content */}
        {!isMinimized && (
          <>
            {showFallback ? (
              // Fallback content when NetPub fails to load
              <div
                className="flex items-center justify-center bg-muted/30 border border-border rounded p-4"
                style={{
                  width: isMobile ? '300px' : '300px',
                  height: isMobile ? '250px' : '250px',
                  minWidth: '200px',
                  minHeight: '150px'
                }}
              >
                <div className="text-center text-muted-foreground">
                  <div className="text-sm font-medium mb-1">Advertisement</div>
                  <div className="text-xs">Slot {slot}</div>
                  {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs mt-2 text-yellow-600">
                      NetPub script failed to load
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Normal NetPub ad
              <ins
                className={cn(bannerClass, 'overlay-ad-banner')}
                data-sizes-desktop={desktopSizes}
                data-sizes-mobile={mobileSizes}
                data-slot={slot.toString()}
                style={{
                  display: 'block',
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
              />
            )}
          </>
        )}

        {/* Minimized State */}
        {isMinimized && (
          <div 
            className="w-12 h-12 flex items-center justify-center text-xs text-muted-foreground cursor-pointer"
            onClick={handleRestore}
            title="Click to restore ad"
          >
            Ad
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Predefined Overlay Ad Components for specific slots
 */

/** Slot 3 - 300x600 Half Page Overlay */
export function OverlaySlot3Ad({
  position = 'center-right',
  ...props
}: Omit<OverlayAdProps, 'slot' | 'desktopSizes' | 'mobileSizes'>) {
  return (
    <OverlayAd
      slot={3}
      desktopSizes="300x600"
      mobileSizes="300x250"
      position={position}
      {...props}
    />
  );
}

/** Slot 4 - Fixed Leaderboard Overlay */
export function OverlaySlot4Ad({
  position = 'top-center',
  ...props
}: Omit<OverlayAdProps, 'slot' | 'desktopSizes' | 'mobileSizes'>) {
  return (
    <OverlayAd
      slot={4}
      desktopSizes="728x90,970x90"
      mobileSizes="320x50,360x50"
      position={position}
      {...props}
    />
  );
}

/** Slot 5 - Notification Overlay */
export function OverlaySlot5Ad({
  position = 'bottom-center',
  ...props
}: Omit<OverlayAdProps, 'slot' | 'desktopSizes' | 'mobileSizes'>) {
  return (
    <OverlayAd
      slot={5}
      desktopSizes="150x0"
      mobileSizes="150x0"
      position={position}
      closable={true}
      minimizable={false}
      {...props}
    />
  );
}

/**
 * Universal Overlay Ad Manager
 * 
 * Manages multiple overlay ads and their positioning to prevent conflicts
 */
export function OverlayAdManager({
  children,
  maxAds = 3,
  className
}: {
  children: React.ReactNode;
  maxAds?: number;
  className?: string;
}) {
  // maxAds could be used for future ad limiting functionality
  return (
    <div className={cn('overlay-ad-manager', className)} data-max-ads={maxAds}>
      {children}
    </div>
  );
}
