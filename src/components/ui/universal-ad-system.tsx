'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  NetpubBanner, 
  NetpubMediumRectangle, 
  NetpubLeaderboard,
  NetpubLargeRectangle,
  NetpubHalfPage,
  NetpubIABBanner,
  NetpubFixedLeaderboard,
  NetpubSlot6Banner,
  BannerPlacement
} from './netpub-banner';

export interface UniversalAdProps {
  /** Ad placement strategy */
  placement?: 'header' | 'footer' | 'sidebar' | 'content' | 'mobile' | 'between-content' | 'article-top' | 'article-bottom';
  /** Banner size/type */
  size?: 'leaderboard' | 'medium-rectangle' | 'large-rectangle' | 'half-page' | 'skyscraper' | 'mobile-banner' | 'slot6' | 'auto';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show on mobile devices */
  showOnMobile?: boolean;
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Custom slot number */
  slot?: number;
  /** Margin/spacing around the ad */
  margin?: 'none' | 'small' | 'medium' | 'large';
  /** Position within placement */
  position?: 'left' | 'center' | 'right';
}

/**
 * Universal Ad System Component
 * 
 * Intelligent ad placement system that automatically selects the best
 * banner type based on placement, device, and context.
 */
export function UniversalAd({
  placement = 'content',
  size = 'auto',
  className,
  showOnMobile = true,
  loading = 'lazy',
  slot,
  margin = 'medium',
  position = 'center'
}: UniversalAdProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Show banner after component mounts (for lazy loading)
    if (loading === 'lazy') {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkMobile);
      };
    } else {
      setIsVisible(true);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [loading]);

  // Auto-select banner type based on placement, device, and size
  const getBannerComponent = () => {
    // Mobile-specific logic
    if (isMobile && showOnMobile) {
      if (placement === 'header' || placement === 'footer') {
        return <NetpubSlot6Banner slot={slot || 6} className={className} />;
      }
      if (placement === 'content' || placement === 'between-content') {
        return <NetpubMediumRectangle slot={slot || 2} className={className} />;
      }
      return <NetpubSlot6Banner slot={slot || 6} className={className} />;
    }

    // Desktop logic - size override
    if (size !== 'auto') {
      switch (size) {
        case 'leaderboard':
          return <NetpubLeaderboard slot={slot || 1} className={className} />;
        case 'medium-rectangle':
          return <NetpubMediumRectangle slot={slot || 2} className={className} />;
        case 'large-rectangle':
          return <NetpubLargeRectangle slot={slot || 3} className={className} />;
        case 'half-page':
          return <NetpubHalfPage slot={slot || 4} className={className} />;
        case 'skyscraper':
          return <NetpubIABBanner slot={slot || 3} className={className} />;
        case 'mobile-banner':
          return <NetpubSlot6Banner slot={slot || 6} className={className} />;
        case 'slot6':
          return <NetpubSlot6Banner slot={slot || 6} className={className} />;
        default:
          return <NetpubMediumRectangle slot={slot || 2} className={className} />;
      }
    }

    // Auto-select based on placement
    switch (placement) {
      case 'header':
        return <NetpubLeaderboard slot={slot || 1} className={className} />;
      case 'footer':
        return <NetpubFixedLeaderboard slot={slot || 4} className={className} />;
      case 'sidebar':
        return <NetpubIABBanner slot={slot || 3} className={className} />;
      case 'content':
      case 'between-content':
      case 'article-top':
      case 'article-bottom':
        return <NetpubMediumRectangle slot={slot || 2} className={className} />;
      case 'mobile':
        return <NetpubSlot6Banner slot={slot || 6} className={className} />;
      default:
        return <NetpubMediumRectangle slot={slot || 2} className={className} />;
    }
  };

  // Get margin classes
  const getMarginClasses = () => {
    switch (margin) {
      case 'none': return '';
      case 'small': return 'my-4';
      case 'medium': return 'my-6';
      case 'large': return 'my-8';
      default: return 'my-6';
    }
  };

  // Don't render if mobile and not allowed
  if (isMobile && !showOnMobile) {
    return null;
  }

  return (
    <div
      className={cn(
        'universal-ad-container',
        getMarginClasses(),
        className
      )}
      data-placement={placement}
      data-size={size}
      role="complementary"
      aria-label="Advertisement"
    >
      {isVisible && (
        <BannerPlacement position={position} margin="my-0">
          {getBannerComponent()}
        </BannerPlacement>
      )}
    </div>
  );
}

/**
 * Predefined ad components for common placements
 */

export function HeaderAd({ className, ...props }: Omit<UniversalAdProps, 'placement'>) {
  return (
    <UniversalAd
      placement="header"
      size="leaderboard"
      showOnMobile={true}
      margin="small"
      className={className}
      {...props}
    />
  );
}

export function FooterAd({ className, ...props }: Omit<UniversalAdProps, 'placement'>) {
  return (
    <UniversalAd
      placement="footer"
      size="leaderboard"
      showOnMobile={true}
      margin="medium"
      className={className}
      {...props}
    />
  );
}

export function SidebarAd({ className, ...props }: Omit<UniversalAdProps, 'placement'>) {
  return (
    <UniversalAd
      placement="sidebar"
      size="skyscraper"
      showOnMobile={false}
      margin="none"
      className={className}
      {...props}
    />
  );
}

export function ContentAd({ className, ...props }: Omit<UniversalAdProps, 'placement'>) {
  return (
    <UniversalAd
      placement="content"
      size="medium-rectangle"
      showOnMobile={true}
      margin="medium"
      className={className}
      {...props}
    />
  );
}

export function MobileAd({ className, ...props }: Omit<UniversalAdProps, 'placement' | 'showOnMobile'>) {
  return (
    <div className="lg:hidden">
      <UniversalAd
        placement="mobile"
        size="mobile-banner"
        showOnMobile={true}
        margin="small"
        className={className}
        {...props}
      />
    </div>
  );
}

export function ArticleTopAd({ className, ...props }: Omit<UniversalAdProps, 'placement'>) {
  return (
    <UniversalAd
      placement="article-top"
      size="medium-rectangle"
      showOnMobile={true}
      margin="large"
      className={className}
      {...props}
    />
  );
}

export function ArticleBottomAd({ className, ...props }: Omit<UniversalAdProps, 'placement'>) {
  return (
    <UniversalAd
      placement="article-bottom"
      size="large-rectangle"
      showOnMobile={true}
      margin="large"
      className={className}
      {...props}
    />
  );
}

export function BetweenContentAd({ className, ...props }: Omit<UniversalAdProps, 'placement'>) {
  return (
    <UniversalAd
      placement="between-content"
      size="medium-rectangle"
      showOnMobile={true}
      margin="large"
      className={className}
      {...props}
    />
  );
}
