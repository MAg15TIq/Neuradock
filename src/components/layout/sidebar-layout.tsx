'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarAdBanner } from '@/components/ui/ad-banner';

export interface SidebarLayoutProps {
  /** Main content */
  children: React.ReactNode;
  /** Sidebar content (optional) */
  sidebar?: React.ReactNode;
  /** Whether to show ad banner in sidebar */
  showAds?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the main content */
  contentClassName?: string;
  /** Additional CSS classes for the sidebar */
  sidebarClassName?: string;
  /** Sidebar position */
  sidebarPosition?: 'left' | 'right';
  /** Whether sidebar should be sticky */
  stickySidebar?: boolean;
}

/**
 * Layout component with optional sidebar and ad banner integration
 * 
 * Provides a responsive layout with main content and sidebar,
 * including automatic ad banner placement when enabled.
 */
export function SidebarLayout({
  children,
  sidebar,
  showAds = true,
  className,
  contentClassName,
  sidebarClassName,
  sidebarPosition = 'right',
  stickySidebar = true
}: SidebarLayoutProps) {
  const hasSidebar = sidebar || showAds;

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'grid gap-8',
        hasSidebar 
          ? 'lg:grid-cols-4' 
          : 'lg:grid-cols-1',
        'grid-cols-1'
      )}>
        {/* Left Sidebar */}
        {hasSidebar && sidebarPosition === 'left' && (
          <aside className={cn(
            'lg:col-span-1',
            'order-2 lg:order-1',
            stickySidebar && 'lg:sticky lg:top-4 lg:self-start',
            sidebarClassName
          )}>
            <div className="space-y-6">
              {sidebar}
              {showAds && (
                <div className="hidden lg:block">
                  <SidebarAdBanner />
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={cn(
          hasSidebar ? 'lg:col-span-3' : 'lg:col-span-1',
          'order-1',
          sidebarPosition === 'left' && hasSidebar && 'lg:order-2',
          contentClassName
        )}>
          {children}
        </main>

        {/* Right Sidebar */}
        {hasSidebar && sidebarPosition === 'right' && (
          <aside className={cn(
            'lg:col-span-1',
            'order-2',
            stickySidebar && 'lg:sticky lg:top-4 lg:self-start',
            sidebarClassName
          )}>
            <div className="space-y-6">
              {sidebar}
              {showAds && (
                <div className="hidden lg:block">
                  <SidebarAdBanner />
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/**
 * Article Layout - Specialized layout for article pages
 */
export function ArticleLayout({
  children,
  tableOfContents,
  relatedContent,
  showAds = true,
  className,
  ...props
}: SidebarLayoutProps & {
  tableOfContents?: React.ReactNode;
  relatedContent?: React.ReactNode;
}) {
  const sidebarContent = (
    <div className="space-y-6">
      {tableOfContents && (
        <div className="hidden lg:block">
          {tableOfContents}
        </div>
      )}
      {relatedContent}
    </div>
  );

  return (
    <SidebarLayout
      sidebar={sidebarContent}
      showAds={showAds}
      className={className}
      {...props}
    >
      {children}
    </SidebarLayout>
  );
}

/**
 * Category Layout - Specialized layout for category pages
 */
export function CategoryLayout({
  children,
  categoryInfo,
  filters,
  showAds = true,
  className,
  ...props
}: SidebarLayoutProps & {
  categoryInfo?: React.ReactNode;
  filters?: React.ReactNode;
}) {
  const sidebarContent = (
    <div className="space-y-6">
      {categoryInfo}
      {filters}
    </div>
  );

  return (
    <SidebarLayout
      sidebar={sidebarContent}
      showAds={showAds}
      className={className}
      {...props}
    >
      {children}
    </SidebarLayout>
  );
}

/**
 * Search Layout - Specialized layout for search pages
 */
export function SearchLayout({
  children,
  searchFilters,
  searchStats,
  showAds = true,
  className,
  ...props
}: SidebarLayoutProps & {
  searchFilters?: React.ReactNode;
  searchStats?: React.ReactNode;
}) {
  const sidebarContent = (
    <div className="space-y-6">
      {searchFilters}
      {searchStats}
    </div>
  );

  return (
    <SidebarLayout
      sidebar={sidebarContent}
      showAds={showAds}
      className={className}
      {...props}
    >
      {children}
    </SidebarLayout>
  );
}
