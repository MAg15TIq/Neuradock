/**
 * Advanced Ad Content Detection Utility
 * 
 * Provides sophisticated methods for detecting whether ad containers
 * have actual advertisement content loaded.
 */

import { getMinContentSize } from './ad-config';

export interface AdContentInfo {
  hasContent: boolean;
  contentType: 'iframe' | 'script' | 'image' | 'html' | 'none';
  contentSize: { width: number; height: number };
  isEmpty: boolean;
  isBlocked: boolean;
  isLoading: boolean;
  lastChecked: number;
}

/**
 * Comprehensive ad content detection
 */
export function detectAdContent(element: Element): AdContentInfo {
  const now = Date.now();
  const minSize = getMinContentSize();
  
  // Get element dimensions
  const rect = element.getBoundingClientRect();
  const contentSize = {
    width: rect.width,
    height: rect.height
  };
  
  // Check for various types of content
  const hasIframe = element.querySelector('iframe') !== null;
  const hasScript = element.querySelector('script') !== null;
  const hasImage = element.querySelector('img') !== null;
  const hasCanvas = element.querySelector('canvas') !== null;
  const hasVideo = element.querySelector('video') !== null;
  
  // Check for meaningful HTML content
  const innerHTML = element.innerHTML.trim();
  const hasHtmlContent = innerHTML.length > 50 && 
    !innerHTML.includes('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP') && // 1x1 tracking pixel
    !innerHTML.match(/^\s*<(br|hr|div|span)\s*\/?\s*>\s*$/i); // Empty tags
  
  // Check for text content
  const textContent = element.textContent?.trim() || '';
  const hasTextContent = textContent.length > 10 && 
    !textContent.match(/^(advertisement|ad|loading|error)$/i);
  
  // Determine content type
  let contentType: AdContentInfo['contentType'] = 'none';
  if (hasIframe) contentType = 'iframe';
  else if (hasScript) contentType = 'script';
  else if (hasImage || hasCanvas || hasVideo) contentType = 'image';
  else if (hasHtmlContent || hasTextContent) contentType = 'html';
  
  // Check if content meets minimum size requirements
  const meetsMinSize = contentSize.width * contentSize.height >= minSize;
  
  // Determine if has actual content
  const hasContent = (hasIframe || hasScript || hasImage || hasCanvas || 
    hasVideo || hasHtmlContent || hasTextContent) && meetsMinSize;
  
  // Check if element appears to be blocked
  const isBlocked = checkIfBlocked(element);
  
  // Check if still loading
  const isLoading = checkIfLoading(element);
  
  // Determine if empty
  const isEmpty = !hasContent && !isLoading;
  
  return {
    hasContent,
    contentType,
    contentSize,
    isEmpty,
    isBlocked,
    isLoading,
    lastChecked: now
  };
}

/**
 * Check if ad appears to be blocked by ad blockers
 */
function checkIfBlocked(element: Element): boolean {
  // Check for common ad blocker indicators
  const style = window.getComputedStyle(element);
  
  // Hidden by CSS
  if (style.display === 'none' || style.visibility === 'hidden' || 
      style.opacity === '0' || style.height === '0px' || style.width === '0px') {
    return true;
  }
  
  // Check for ad blocker classes
  const blockedClasses = ['adsbygoogle', 'adsense', 'advertisement'];
  const className = element.className.toLowerCase();
  if (blockedClasses.some(cls => className.includes(cls))) {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return true;
    }
  }
  
  // Check parent elements for blocking
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') {
      return true;
    }
    parent = parent.parentElement;
  }
  
  return false;
}

/**
 * Check if ad is still in loading state
 */
function checkIfLoading(element: Element): boolean {
  // Check for loading indicators
  const loadingTexts = ['loading', 'advertisement', 'ad'];
  const textContent = element.textContent?.toLowerCase() || '';
  
  if (loadingTexts.some(text => textContent.includes(text))) {
    return true;
  }
  
  // Check for empty iframe that might still be loading
  const iframe = element.querySelector('iframe');
  if (iframe && !iframe.src && !iframe.srcdoc) {
    return true;
  }
  
  // Check for script tags without content
  const scripts = element.querySelectorAll('script');
  if (scripts.length > 0) {
    const hasContentScript = Array.from(scripts).some(script => 
      script.innerHTML.trim().length > 0 || script.src
    );
    if (!hasContentScript) {
      return true;
    }
  }
  
  return false;
}

/**
 * Batch check multiple ad elements
 */
export function detectMultipleAdContent(elements: Element[]): Map<Element, AdContentInfo> {
  const results = new Map<Element, AdContentInfo>();
  
  elements.forEach(element => {
    results.set(element, detectAdContent(element));
  });
  
  return results;
}

/**
 * Check if any ads in the page have content
 */
export function hasAnyAdContent(): boolean {
  const adElements = document.querySelectorAll('.adv-831b33a650047ee11a992b11fdadd8f3');
  
  for (const element of adElements) {
    const info = detectAdContent(element);
    if (info.hasContent) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get summary of all ad content on page
 */
export function getAdContentSummary(): {
  total: number;
  withContent: number;
  empty: number;
  blocked: number;
  loading: number;
} {
  const adElements = document.querySelectorAll('.adv-831b33a650047ee11a992b11fdadd8f3');
  const summary = {
    total: adElements.length,
    withContent: 0,
    empty: 0,
    blocked: 0,
    loading: 0
  };
  
  adElements.forEach(element => {
    const info = detectAdContent(element);
    if (info.hasContent) summary.withContent++;
    if (info.isEmpty) summary.empty++;
    if (info.isBlocked) summary.blocked++;
    if (info.isLoading) summary.loading++;
  });
  
  return summary;
}

/**
 * Wait for ad content to load with timeout
 */
export function waitForAdContent(
  element: Element, 
  timeout: number = 30000
): Promise<AdContentInfo> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkContent = () => {
      const info = detectAdContent(element);
      
      if (info.hasContent || info.isBlocked) {
        resolve(info);
        return;
      }
      
      if (Date.now() - startTime >= timeout) {
        resolve(info);
        return;
      }
      
      setTimeout(checkContent, 1000);
    };
    
    checkContent();
  });
}
