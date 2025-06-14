/**
 * Ad Visibility Management Hook
 * 
 * Manages the visibility state of advertisement containers based on
 * content detection, intersection observation, and mutation observation.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  detectAdContent, 
  waitForAdContent, 
  type AdContentInfo 
} from '@/lib/ad-content-detector';
import { 
  getContentCheckInterval,
  getMaxContentWaitTime,
  shouldUseIntersectionObserver,
  shouldUseMutationObserver,
  shouldShowDebugInfo
} from '@/lib/ad-config';

export interface AdVisibilityState {
  isVisible: boolean;
  hasContent: boolean;
  isLoading: boolean;
  isBlocked: boolean;
  contentInfo: AdContentInfo | null;
  debugInfo: string;
}

export interface UseAdVisibilityOptions {
  /** Element reference to monitor */
  elementRef: React.RefObject<HTMLElement>;
  /** Slot identifier for debugging */
  slot: string | number;
  /** Whether to start checking immediately */
  autoStart?: boolean;
  /** Custom timeout for content detection */
  timeout?: number;
}

/**
 * Hook for managing ad visibility based on content detection
 */
export function useAdVisibility({
  elementRef,
  slot,
  autoStart = true,
  timeout
}: UseAdVisibilityOptions): AdVisibilityState {
  const [state, setState] = useState<AdVisibilityState>({
    isVisible: false,
    hasContent: false,
    isLoading: true,
    isBlocked: false,
    contentInfo: null,
    debugInfo: 'Initializing...'
  });

  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMonitoringRef = useRef(false);

  /**
   * Update state with new content information
   */
  const updateState = useCallback((contentInfo: AdContentInfo, debugMessage?: string) => {
    setState(prevState => ({
      ...prevState,
      hasContent: contentInfo.hasContent,
      isLoading: contentInfo.isLoading,
      isBlocked: contentInfo.isBlocked,
      isVisible: contentInfo.hasContent && !contentInfo.isBlocked,
      contentInfo,
      debugInfo: debugMessage || `Content: ${contentInfo.hasContent}, Loading: ${contentInfo.isLoading}, Blocked: ${contentInfo.isBlocked}`
    }));

    if (shouldShowDebugInfo()) {
      console.log(`[AdVisibility Slot ${slot}] ${debugMessage || 'State updated'}`, contentInfo);
    }
  }, [slot]);

  /**
   * Check ad content and update state
   */
  const checkAdContent = useCallback(() => {
    if (!elementRef.current) {
      return;
    }

    const adElement = elementRef.current.querySelector('.adv-831b33a650047ee11a992b11fdadd8f3');
    if (!adElement) {
      updateState({
        hasContent: false,
        contentType: 'none',
        contentSize: { width: 0, height: 0 },
        isEmpty: true,
        isBlocked: false,
        isLoading: true,
        lastChecked: Date.now()
      }, 'Ad element not found');
      return;
    }

    const contentInfo = detectAdContent(adElement);
    updateState(contentInfo, `Content check completed`);
  }, [elementRef, updateState]);

  /**
   * Setup intersection observer for performance optimization
   */
  const setupIntersectionObserver = useCallback(() => {
    if (!shouldUseIntersectionObserver() || !elementRef.current) {
      return;
    }

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isMonitoringRef.current) {
            // Element is visible, start monitoring
            isMonitoringRef.current = true;
            checkAdContent();
            
            // Start periodic checks
            const interval = getContentCheckInterval();
            checkIntervalRef.current = setInterval(checkAdContent, interval);
            
            if (shouldShowDebugInfo()) {
              console.log(`[AdVisibility Slot ${slot}] Started monitoring (element in view)`);
            }
          } else if (!entry.isIntersecting && isMonitoringRef.current) {
            // Element is not visible, reduce monitoring frequency
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
              checkIntervalRef.current = null;
            }
            
            if (shouldShowDebugInfo()) {
              console.log(`[AdVisibility Slot ${slot}] Reduced monitoring (element out of view)`);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    intersectionObserverRef.current.observe(elementRef.current);
  }, [elementRef, slot, checkAdContent]);

  /**
   * Setup mutation observer to detect content changes
   */
  const setupMutationObserver = useCallback(() => {
    if (!shouldUseMutationObserver() || !elementRef.current) {
      return;
    }

    mutationObserverRef.current = new MutationObserver((mutations) => {
      let shouldCheck = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
        } else if (mutation.type === 'attributes' && 
                   (mutation.attributeName === 'style' || 
                    mutation.attributeName === 'class')) {
          shouldCheck = true;
        }
      });

      if (shouldCheck) {
        setTimeout(checkAdContent, 100); // Small delay to allow DOM to settle
      }
    });

    mutationObserverRef.current.observe(elementRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }, [elementRef, checkAdContent]);

  /**
   * Start monitoring ad content
   */
  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current) {
      return;
    }

    setupIntersectionObserver();
    setupMutationObserver();

    // Initial content check
    checkAdContent();

    // Setup timeout to stop loading state
    const maxWaitTime = timeout || getMaxContentWaitTime();
    setTimeout(() => {
      if (state.isLoading && !state.hasContent) {
        updateState({
          hasContent: false,
          contentType: 'none',
          contentSize: { width: 0, height: 0 },
          isEmpty: true,
          isBlocked: false,
          isLoading: false,
          lastChecked: Date.now()
        }, 'Timeout reached, stopping loading state');
      }
    }, maxWaitTime);

    if (shouldShowDebugInfo()) {
      console.log(`[AdVisibility Slot ${slot}] Started monitoring`);
    }
  }, [setupIntersectionObserver, setupMutationObserver, checkAdContent, timeout, state.isLoading, state.hasContent, updateState, slot]);

  /**
   * Stop monitoring and cleanup
   */
  const stopMonitoring = useCallback(() => {
    isMonitoringRef.current = false;

    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
      intersectionObserverRef.current = null;
    }

    if (mutationObserverRef.current) {
      mutationObserverRef.current.disconnect();
      mutationObserverRef.current = null;
    }

    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }

    if (shouldShowDebugInfo()) {
      console.log(`[AdVisibility Slot ${slot}] Stopped monitoring`);
    }
  }, [slot]);

  // Auto-start monitoring when component mounts
  useEffect(() => {
    if (autoStart && elementRef.current) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [autoStart, elementRef, startMonitoring, stopMonitoring]);

  // Listen for NetPub events
  useEffect(() => {
    const handleNetpubLoaded = () => {
      setTimeout(checkAdContent, 500);
    };

    const handleNetpubFailed = () => {
      updateState({
        hasContent: false,
        contentType: 'none',
        contentSize: { width: 0, height: 0 },
        isEmpty: true,
        isBlocked: true,
        isLoading: false,
        lastChecked: Date.now()
      }, 'NetPub script failed to load');
    };

    window.addEventListener('netpubLoaded', handleNetpubLoaded);
    window.addEventListener('netpubLoadFailed', handleNetpubFailed);
    window.addEventListener('netpubObjectMissing', handleNetpubFailed);

    return () => {
      window.removeEventListener('netpubLoaded', handleNetpubLoaded);
      window.removeEventListener('netpubLoadFailed', handleNetpubFailed);
      window.removeEventListener('netpubObjectMissing', handleNetpubFailed);
    };
  }, [checkAdContent, updateState]);

  return state;
}
