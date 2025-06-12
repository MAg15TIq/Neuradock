'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { HeaderAd, FooterAd, SidebarAd, MobileAd } from '@/components/ui/universal-ad-system';

export interface AdLayoutWrapperProps {
  /** Main content */
  children: React.ReactNode;
  /** Whether to show header ad */
  showHeaderAd?: boolean;
  /** Whether to show footer ad */
  showFooterAd?: boolean;
  /** Whether to show sidebar ad */
  showSidebarAd?: boolean;
  /** Whether to show mobile ads */
  showMobileAds?: boolean;
  /** Custom sidebar content */
  sidebarContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Page type for ad optimization */
  pageType?: 'homepage' | 'article' | 'category' | 'search' | 'static';
  /** Whether to use full width layout (no sidebar) */
  fullWidth?: boolean;
}

/**
 * Global Ad Layout Wrapper
 * 
 * Wraps page content with strategic ad placements including header,
 * footer, sidebar, and mobile ads. Provides consistent ad experience
 * across all pages.
 */
export function AdLayoutWrapper({
  children,
  showHeaderAd = true,
  showFooterAd = true,
  showSidebarAd = true,
  showMobileAds = true,
  sidebarContent,
  className,
  pageType = 'static',
  fullWidth = false
}: AdLayoutWrapperProps) {
  const hasSidebar = !fullWidth && (showSidebarAd || sidebarContent);

  return (
    <div className={cn('ad-layout-wrapper min-h-screen', className)}>
      {/* Header Ad */}
      {showHeaderAd && (
        <div className="header-ad-container bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <HeaderAd slot={1} />
          </div>
        </div>
      )}

      {/* Mobile Ad - Top */}
      {showMobileAds && (
        <div className="mobile-ad-top lg:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <MobileAd slot={6} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="main-content-area flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            'grid gap-8 py-8',
            hasSidebar ? 'lg:grid-cols-4' : 'lg:grid-cols-1',
            'grid-cols-1'
          )}>
            {/* Main Content */}
            <main className={cn(
              hasSidebar ? 'lg:col-span-3' : 'lg:col-span-1',
              'order-1'
            )}>
              {children}
            </main>

            {/* Sidebar */}
            {hasSidebar && (
              <aside className="lg:col-span-1 order-2 lg:sticky lg:top-4 lg:self-start">
                <div className="space-y-6">
                  {/* Custom Sidebar Content */}
                  {sidebarContent}
                  
                  {/* Sidebar Ad */}
                  {showSidebarAd && (
                    <div className="sidebar-ad-container">
                      <SidebarAd slot={3} />
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Ad - Bottom */}
      {showMobileAds && (
        <div className="mobile-ad-bottom lg:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <MobileAd slot={5} />
          </div>
        </div>
      )}

      {/* Footer Ad */}
      {showFooterAd && (
        <div className="footer-ad-container bg-muted/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <FooterAd slot={4} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Specialized layout components for different page types
 */

export function HomepageAdLayout({ 
  children, 
  className,
  ...props 
}: Omit<AdLayoutWrapperProps, 'pageType'>) {
  return (
    <AdLayoutWrapper
      pageType="homepage"
      showHeaderAd={true}
      showFooterAd={true}
      showSidebarAd={true}
      showMobileAds={true}
      className={className}
      {...props}
    >
      {children}
    </AdLayoutWrapper>
  );
}

export function ArticleAdLayout({ 
  children, 
  className,
  sidebarContent,
  ...props 
}: Omit<AdLayoutWrapperProps, 'pageType'>) {
  return (
    <AdLayoutWrapper
      pageType="article"
      showHeaderAd={false} // Articles usually don't need header ads
      showFooterAd={true}
      showSidebarAd={true}
      showMobileAds={true}
      sidebarContent={sidebarContent}
      className={className}
      {...props}
    >
      {children}
    </AdLayoutWrapper>
  );
}

export function CategoryAdLayout({ 
  children, 
  className,
  sidebarContent,
  ...props 
}: Omit<AdLayoutWrapperProps, 'pageType'>) {
  return (
    <AdLayoutWrapper
      pageType="category"
      showHeaderAd={true}
      showFooterAd={true}
      showSidebarAd={true}
      showMobileAds={true}
      sidebarContent={sidebarContent}
      className={className}
      {...props}
    >
      {children}
    </AdLayoutWrapper>
  );
}

export function SearchAdLayout({ 
  children, 
  className,
  sidebarContent,
  ...props 
}: Omit<AdLayoutWrapperProps, 'pageType'>) {
  return (
    <AdLayoutWrapper
      pageType="search"
      showHeaderAd={true}
      showFooterAd={true}
      showSidebarAd={true}
      showMobileAds={true}
      sidebarContent={sidebarContent}
      className={className}
      {...props}
    >
      {children}
    </AdLayoutWrapper>
  );
}

export function StaticPageAdLayout({ 
  children, 
  className,
  ...props 
}: Omit<AdLayoutWrapperProps, 'pageType'>) {
  return (
    <AdLayoutWrapper
      pageType="static"
      showHeaderAd={false}
      showFooterAd={true}
      showSidebarAd={false}
      showMobileAds={true}
      fullWidth={true}
      className={className}
      {...props}
    >
      {children}
    </AdLayoutWrapper>
  );
}

/**
 * Hook for managing ad layout state
 */
export function useAdLayout(pageType: AdLayoutWrapperProps['pageType'] = 'static') {
  const getDefaultAdSettings = () => {
    switch (pageType) {
      case 'homepage':
        return {
          showHeaderAd: true,
          showFooterAd: true,
          showSidebarAd: true,
          showMobileAds: true,
          fullWidth: false
        };
      case 'article':
        return {
          showHeaderAd: false,
          showFooterAd: true,
          showSidebarAd: true,
          showMobileAds: true,
          fullWidth: false
        };
      case 'category':
      case 'search':
        return {
          showHeaderAd: true,
          showFooterAd: true,
          showSidebarAd: true,
          showMobileAds: true,
          fullWidth: false
        };
      case 'static':
        return {
          showHeaderAd: false,
          showFooterAd: true,
          showSidebarAd: false,
          showMobileAds: true,
          fullWidth: true
        };
      default:
        return {
          showHeaderAd: true,
          showFooterAd: true,
          showSidebarAd: true,
          showMobileAds: true,
          fullWidth: false
        };
    }
  };

  return getDefaultAdSettings();
}
