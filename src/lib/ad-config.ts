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
  maxRetries: 3
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
