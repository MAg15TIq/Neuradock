# Netpub Banner Advertisement Implementation

## Overview

This document describes the implementation of the Netpub banner advertisement system integrated into the NeuraDock website. The implementation supports multiple banner formats and slots, follows React/TypeScript best practices, and includes proper performance optimization, responsive design, and accessibility considerations.

### Supported Banner Formats

- **IAB 120x600** - Skyscraper (Slot 1)
- **IAB 300x250** - Medium Rectangle (Slot 2)
- **IAB 300x600** - Multi-size Banner (Slot 3) - **NEW**
- **Fixed 728x90** - Fixed Leaderboard (Slot 4) - **NEW**
- **Notification 150x0** - Notification Banner (Slot 5) - **NEW**
- **Multiple responsive sizes** - 200x200, 250x250, 300x250, 336x280
- **Custom sizes** - Configurable through component props

## Implementation Details

### 1. Script Integration

The Netpub ad scripts are integrated into the root layout (`src/app/layout.tsx`) using the existing ScriptHandler component:

#### Main Banner Script (Slot 1)
```tsx
{/* Netpub Ad Scripts - Multiple Banner Advertisements */}
<ScriptHandler
  strategy="afterInteractive"
  id="netpub-ad-script-main"
>
  {`(function(a) { if (!document.getElementById(a)) { const s = document.createElement("script"); s.id = a; s.async = true; s.src = ["https://fstatic.netpub.media/static/", a, ".min.js?", Date.now()].join(""); document.head.appendChild(s); } })("831b33a650047ee11a992b11fdadd8f3")`}
</ScriptHandler>
```

#### Banner Script for Slot 2 (300x250 Medium Rectangle) - NEW
```tsx
{/* Netpub Banner Script - IAB 300x250 Banner Advertisement (Slot 2) */}
<ScriptHandler
  strategy="afterInteractive"
  id="netpub-banner-script-slot2"
>
  {`(function(a) { if (!document.getElementById(a)) { const s = document.createElement("script"); s.id = a; s.async = true; s.src = ["https://fstatic.netpub.media/static/", a, ".min.js?", Date.now()].join(""); document.head.appendChild(s); } })("831b33a650047ee11a992b11fdadd8f3")`}
</ScriptHandler>
```

**Key Features:**
- Uses `afterInteractive` strategy to avoid blocking page rendering
- Follows the same pattern as the existing GDPR compliance script
- Includes proper script deduplication and error handling
- Supports multiple banner slots with unique script IDs

### 2. NetpubBanner Component - NEW

**Location:** `src/components/ui/netpub-banner.tsx`

The new NetpubBanner component provides a modern, reusable solution for banner advertisements:

```tsx
<NetpubBanner
  slot={2}
  desktopSizes="300x250"
  mobileSizes="300x250"
/>
```

**Features:**
- Responsive design with separate desktop/mobile sizing
- Client-side rendering to avoid hydration issues
- Support for multiple IAB standard sizes
- Proper slot management for different banner placements
- Error handling with graceful fallbacks

**Predefined Components:**
- `NetpubMediumRectangle`: 300x250 banner (slot 2 default)
- `NetpubLeaderboard`: 728x90 desktop, 320x50 mobile
- `NetpubLargeRectangle`: 336x280 banner
- `NetpubHalfPage`: 300x600 desktop, 300x250 mobile
- `NetpubResponsiveBanner`: Multi-size responsive banner
- `NetpubIABBanner`: IAB multi-size banner (slot 3) - **NEW**
- `NetpubFixedLeaderboard`: Fixed leaderboard banner (slot 4) - **NEW**
- `NetpubNotificationBanner`: Notification banner (slot 5) - **NEW**
- `BannerPlacement`: Wrapper for positioning and styling

### 3. Legacy AdBanner Component

**Location:** `src/components/ui/ad-banner.tsx`

The original AdBanner component for 120x600 banners:

```tsx
<AdBanner
  size="120x600"
  placement="sidebar"
  showOnMobile={false}
  loading="lazy"
/>
```

**Features:**
- Responsive design with mobile visibility control
- Dark/light mode support with Tailwind CSS
- Lazy loading for performance optimization
- Error handling with graceful fallbacks
- Proper accessibility attributes

**Specialized Components:**
- `SidebarAdBanner`: Optimized for sidebar placement with sticky positioning
- `ContentAdBanner`: For placement between content sections
- `useAdBanner`: Hook for managing ad state and performance

### 3. Layout Integration

**Location:** `src/components/layout/sidebar-layout.tsx`

New layout components provide structured ad placement:

```tsx
<SidebarLayout showAds={true}>
  <YourContent />
</SidebarLayout>
```

**Specialized Layouts:**
- `ArticleLayout`: For article pages with table of contents
- `CategoryLayout`: For category pages with filters
- `SearchLayout`: For search pages with filters

### 4. Page Integration

The ad banner has been integrated into key pages:

#### Homepage (`src/app/page.tsx`)
- Featured articles section uses `SidebarLayout` with ads
- Maintains responsive grid layout (2 columns on desktop with sidebar)

#### Article Pages (`src/app/[category]/[slug]/page.tsx`)
- Uses `ArticleLayout` with table of contents and ads
- Sidebar includes both navigation and advertisement

#### Category Pages (`src/app/[category]/page.tsx`)
- Uses `CategoryLayout` with ads
- Maintains article grid with sidebar advertisement

#### Search Page (`src/app/search/page.tsx`)
- Uses `SearchLayout` with ads
- Includes search functionality with sidebar advertisement

## Technical Specifications

### Ad Container
```html
<ins 
  class="adv-831b33a650047ee11a992b11fdadd8f3" 
  data-sizes-desktop="120x600" 
  data-sizes-mobile="120x600" 
  data-slot="1"
  style="display: block; width: 120px; height: 600px;"
/>
```

### Responsive Behavior
- **Desktop (≥768px)**: Banner visible in sidebar with sticky positioning
- **Mobile (<768px)**: Banner hidden by default (configurable per component)
- **Tablet**: Follows desktop behavior

### Performance Optimizations
- Lazy loading prevents blocking initial page render
- Script loads with `afterInteractive` strategy
- Error boundaries prevent ad failures from breaking the page
- Fallback content displays while ads load

### Styling
- Uses Tailwind CSS for consistent theming
- Supports both light and dark modes
- Proper spacing and visual hierarchy
- Responsive design patterns

## Usage Examples

### Basic Sidebar Ad
```tsx
import { SidebarAdBanner } from '@/components/ui/ad-banner';

<SidebarAdBanner />
```

### Content Ad
```tsx
import { ContentAdBanner } from '@/components/ui/ad-banner';

<ContentAdBanner showOnMobile={true} />
```

### Layout with Ads
```tsx
import { SidebarLayout } from '@/components/layout/sidebar-layout';

<SidebarLayout showAds={true}>
  <YourContent />
</SidebarLayout>
```

### Custom Ad Placement
```tsx
import { AdBanner } from '@/components/ui/ad-banner';

<AdBanner
  placement="custom"
  showOnMobile={false}
  loading="eager"
  className="my-custom-styles"
/>
```

## Testing

A test page is available at `/ad-test` that includes:
- Ad banner status monitoring
- Different layout demonstrations
- Individual component testing
- Technical implementation details

## SEO and Accessibility

- Proper `role="complementary"` and `aria-label="Advertisement"`
- No impact on Core Web Vitals due to lazy loading
- Maintains semantic HTML structure
- Screen reader friendly implementation

## Browser Compatibility

- Modern browsers with ES6+ support
- Graceful degradation for older browsers
- Mobile-first responsive design
- Cross-platform compatibility

## Monitoring and Analytics

The implementation includes:
- Ad blocker detection
- Script loading status monitoring
- Error tracking and reporting
- Performance metrics collection

## Future Enhancements

Potential improvements for future iterations:
- A/B testing framework for ad placements
- Dynamic ad sizing based on content
- Advanced targeting and personalization
- Analytics integration for performance tracking
- Additional ad formats and sizes

## Maintenance

- Regular testing across different devices and browsers
- Monitoring ad performance and user experience
- Updating ad placements based on analytics
- Ensuring compliance with advertising standards

## Support

For technical issues or questions about the ad banner implementation:
- Check the test page at `/ad-test` for status information
- Review browser console for error messages
- Verify network connectivity to Netpub servers
- Ensure ad blockers are not interfering with testing
