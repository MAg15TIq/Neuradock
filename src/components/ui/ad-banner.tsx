'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface AdBannerProps {
  /** Placement identifier for analytics */
  placement?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show on mobile devices */
  showOnMobile?: boolean;
  /** Loading strategy */
  loading?: 'eager' | 'lazy';
}

/**
 * Netpub IAB 120x600 Banner Advertisement Component
 * 
 * Displays responsive banner ads with proper dark/light mode support
 * and performance optimization.
 */
export function AdBanner({
  placement = 'sidebar',
  className,
  showOnMobile = false,
  loading = 'lazy'
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Show banner after component mounts (for lazy loading)
    if (loading === 'lazy') {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [loading]);

  // Handle ad loading errors
  const handleAdError = () => {
    setHasError(true);
    console.warn('Ad banner failed to load');
  };

  // Don't render if there's an error or if hidden on mobile
  if (hasError) return null;
  if (!showOnMobile && typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <div
      className={cn(
        'ad-banner-container',
        'flex justify-center items-start',
        'w-full max-w-[120px] mx-auto',
        'transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        !showOnMobile && 'hidden md:block',
        className
      )}
      data-placement={placement}
      role="complementary"
      aria-label="Advertisement"
    >
      {isVisible && (
        <div
          className={cn(
            'ad-banner-wrapper',
            'relative overflow-hidden',
            'bg-gray-50 dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-sm',
            'transition-colors duration-200'
          )}
          style={{
            width: '120px',
            height: '600px',
            minHeight: '600px'
          }}
        >
          {/* Netpub Ad Container */}
          <ins
            className="adv-831b33a650047ee11a992b11fdadd8f3"
            data-sizes-desktop="120x600"
            data-sizes-mobile="120x600"
            data-slot="1"
            style={{
              display: 'block',
              width: '120px',
              height: '600px'
            }}
            onError={handleAdError}
          />
          
          {/* Fallback content while ad loads */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'bg-gradient-to-br from-gray-100 to-gray-200',
              'dark:from-gray-700 dark:to-gray-800',
              'text-gray-400 dark:text-gray-500',
              'text-xs text-center p-4',
              'transition-opacity duration-300'
            )}
            style={{
              zIndex: -1
            }}
          >
            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="text-xs">Advertisement</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sidebar Ad Banner - Optimized for sidebar placement
 */
export function SidebarAdBanner({
  className,
  ...props
}: Omit<AdBannerProps, 'placement'>) {
  return (
    <div className={cn('sticky top-4', className)}>
      <AdBanner
        placement="sidebar"
        loading="lazy"
        showOnMobile={false}
        {...props}
      />
    </div>
  );
}

/**
 * Content Ad Banner - For placement between content sections
 */
export function ContentAdBanner({
  className,
  ...props
}: Omit<AdBannerProps, 'placement'>) {
  return (
    <div className={cn('my-8 flex justify-center', className)}>
      <AdBanner
        placement="content"
        loading="lazy"
        showOnMobile={true}
        {...props}
      />
    </div>
  );
}

/**
 * Hook for managing ad banner visibility and performance
 */
export function useAdBanner() {
  const [adsBlocked, setAdsBlocked] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    // Check if ads are blocked
    const checkAdBlocker = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-10000px';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setAdsBlocked(true);
        }
        document.body.removeChild(testAd);
      }, 100);
    };

    // Check if Netpub script is loaded
    const checkAdScript = () => {
      const script = document.getElementById('831b33a650047ee11a992b11fdadd8f3');
      if (script) {
        setAdsLoaded(true);
      }
    };

    checkAdBlocker();
    checkAdScript();

    // Listen for script load events
    const handleScriptLoad = () => setAdsLoaded(true);
    window.addEventListener('load', handleScriptLoad);

    return () => {
      window.removeEventListener('load', handleScriptLoad);
    };
  }, []);

  return {
    adsBlocked,
    adsLoaded,
    shouldShowAds: !adsBlocked && adsLoaded
  };
}
