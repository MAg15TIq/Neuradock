/**
 * Ad Configuration
 * 
 * Central configuration for ad display behavior
 */

export interface AdConfig {
  /** Whether to show ads at all */
  enabled: boolean;
  /** Whether to show empty containers in development */
  showEmptyInDev: boolean;
  /** Whether to show debug information */
  showDebugInfo: boolean;
  /** Timeout before hiding empty containers (ms) */
  hideEmptyTimeout: number;
  /** Maximum retry attempts before hiding container */
  maxRetries: number;
  /** Interval for content detection checks (ms) */
  contentCheckInterval: number;
  /** Maximum time to wait for ad content before hiding (ms) */
  maxContentWaitTime: number;
  /** Whether to use intersection observer for visibility detection */
  useIntersectionObserver: boolean;
  /** Whether to use mutation observer for content changes */
  useMutationObserver: boolean;
  /** Minimum ad content size to consider valid (pixels) */
  minContentSize: number;
}

export const adConfig: AdConfig = {
  // Enable ads in production, configurable in development
  enabled: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_SHOW_ADS === 'true',

  // Never show empty containers in production
  showEmptyInDev: process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_EMPTY_ADS === 'true',

  // Show debug info only in development
  showDebugInfo: process.env.NODE_ENV === 'development',

  // Hide empty containers after 10 seconds
  hideEmptyTimeout: 10000,

  // Hide after 3 failed retry attempts
  maxRetries: 3,

  // Check for content every 2 seconds
  contentCheckInterval: 2000,

  // Maximum time to wait for ad content (30 seconds)
  maxContentWaitTime: 30000,

  // Use intersection observer for better performance
  useIntersectionObserver: true,

  // Use mutation observer to detect content changes
  useMutationObserver: true,

  // Minimum 10x10 pixels to consider valid content
  minContentSize: 100
};

/**
 * Check if ads should be displayed
 */
export function shouldShowAds(): boolean {
  return adConfig.enabled;
}

/**
 * Check if empty containers should be shown
 */
export function shouldShowEmptyContainers(): boolean {
  return adConfig.showEmptyInDev;
}

/**
 * Check if debug information should be shown
 */
export function shouldShowDebugInfo(): boolean {
  return adConfig.showDebugInfo;
}

/**
 * Get the timeout for hiding empty containers
 */
export function getHideEmptyTimeout(): number {
  return adConfig.hideEmptyTimeout;
}

/**
 * Get maximum retry attempts
 */
export function getMaxRetries(): number {
  return adConfig.maxRetries;
}

/**
 * Get content check interval
 */
export function getContentCheckInterval(): number {
  return adConfig.contentCheckInterval;
}

/**
 * Get maximum content wait time
 */
export function getMaxContentWaitTime(): number {
  return adConfig.maxContentWaitTime;
}

/**
 * Check if intersection observer should be used
 */
export function shouldUseIntersectionObserver(): boolean {
  return adConfig.useIntersectionObserver;
}

/**
 * Check if mutation observer should be used
 */
export function shouldUseMutationObserver(): boolean {
  return adConfig.useMutationObserver;
}

/**
 * Get minimum content size for validation
 */
export function getMinContentSize(): number {
  return adConfig.minContentSize;
}
