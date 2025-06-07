'use client';

import { useState } from 'react';
import {
  NetpubBanner,
  NetpubMediumRectangle,
  NetpubLeaderboard,
  NetpubLargeRectangle,
  NetpubHalfPage,
  NetpubResponsiveBanner,
  NetpubSlot6Banner,
  BannerPlacement
} from '@/components/ui/netpub-banner';

/**
 * Example: Basic banner usage
 */
export function BasicBannerExample() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Banner Examples</h3>
      
      {/* Custom banner with specific sizes */}
      <div>
        <h4 className="text-md font-medium mb-2">Custom 300x250 Banner</h4>
        <NetpubBanner 
          slot={2}
          desktopSizes="300x250"
          mobileSizes="300x250"
          className="border border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Predefined medium rectangle */}
      <div>
        <h4 className="text-md font-medium mb-2">Medium Rectangle (Predefined)</h4>
        <NetpubMediumRectangle slot={2} />
      </div>
    </div>
  );
}

/**
 * Example: Different banner sizes
 */
export function BannerSizesExample() {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Different Banner Sizes</h3>
      
      {/* Leaderboard banner */}
      <div>
        <h4 className="text-md font-medium mb-2">Leaderboard (728x90 desktop, 320x50 mobile)</h4>
        <NetpubLeaderboard slot={1} className="bg-gray-50 dark:bg-gray-800 p-2" />
      </div>

      {/* Medium rectangle */}
      <div>
        <h4 className="text-md font-medium mb-2">Medium Rectangle (300x250)</h4>
        <NetpubMediumRectangle slot={2} className="bg-gray-50 dark:bg-gray-800 p-2" />
      </div>

      {/* Large rectangle */}
      <div>
        <h4 className="text-md font-medium mb-2">Large Rectangle (336x280)</h4>
        <NetpubLargeRectangle slot={3} className="bg-gray-50 dark:bg-gray-800 p-2" />
      </div>

      {/* Half page (desktop only) */}
      <div className="hidden md:block">
        <h4 className="text-md font-medium mb-2">Half Page (300x600 desktop, 300x250 mobile)</h4>
        <NetpubHalfPage slot={4} className="bg-gray-50 dark:bg-gray-800 p-2" />
      </div>

      {/* Slot 6 Banner */}
      <div>
        <h4 className="text-md font-medium mb-2">Slot 6 Banner (360x100 multi-size)</h4>
        <NetpubSlot6Banner slot={6} className="bg-gray-50 dark:bg-gray-800 p-2" />
      </div>
    </div>
  );
}

/**
 * Example: Responsive banner with multiple sizes
 */
export function ResponsiveBannerExample() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Responsive Banner Example</h3>
      
      <div>
        <h4 className="text-md font-medium mb-2">
          Multi-size Responsive Banner (200x200, 250x250, 300x250, 336x280)
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This banner adapts to different screen sizes and allows the ad network to choose the best size.
        </p>
        <NetpubResponsiveBanner 
          slot={2} 
          className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"
        />
      </div>
    </div>
  );
}

/**
 * Example: Banner placement with styling
 */
export function BannerPlacementExample() {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Banner Placement Examples</h3>
      
      {/* Center placement */}
      <div>
        <h4 className="text-md font-medium mb-2">Center Placement</h4>
        <BannerPlacement position="center" margin="my-6">
          <NetpubMediumRectangle slot={2} />
        </BannerPlacement>
      </div>

      {/* Left placement */}
      <div>
        <h4 className="text-md font-medium mb-2">Left Placement</h4>
        <BannerPlacement position="left" margin="my-4">
          <NetpubMediumRectangle slot={2} />
        </BannerPlacement>
      </div>

      {/* Right placement */}
      <div>
        <h4 className="text-md font-medium mb-2">Right Placement</h4>
        <BannerPlacement position="right" margin="my-4">
          <NetpubMediumRectangle slot={2} />
        </BannerPlacement>
      </div>
    </div>
  );
}

/**
 * Example: Article content integration
 */
export function ArticleIntegrationExample() {
  return (
    <article className="max-w-4xl mx-auto prose dark:prose-invert">
      <h1>Sample Article Title</h1>
      
      <p>
        This is the introduction paragraph of the article. It provides context and 
        introduces the main topic that will be discussed in detail.
      </p>

      {/* Banner after introduction */}
      <BannerPlacement position="center" margin="my-8">
        <NetpubMediumRectangle slot={2} />
      </BannerPlacement>

      <h2>Main Content Section</h2>
      
      <p>
        This is the main content of the article. Here we dive deeper into the topic
        and provide valuable information to the reader.
      </p>

      <p>
        Additional paragraphs continue the discussion and provide more insights
        into the subject matter.
      </p>

      {/* Banner in middle of content */}
      <BannerPlacement position="center" margin="my-6">
        <NetpubResponsiveBanner slot={3} />
      </BannerPlacement>

      <h2>Conclusion</h2>
      
      <p>
        The conclusion summarizes the key points and provides final thoughts
        on the topic discussed in the article.
      </p>
    </article>
  );
}

/**
 * Example: Sidebar integration
 */
export function SidebarIntegrationExample() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main content */}
      <div className="lg:col-span-3">
        <h2 className="text-2xl font-bold mb-4">Main Content Area</h2>
        <p className="mb-4">
          This is the main content area where articles, posts, or other primary
          content would be displayed.
        </p>
        <p>
          The sidebar on the right contains related information and advertisements
          that complement the main content.
        </p>
      </div>

      {/* Sidebar with banner */}
      <aside className="lg:col-span-1">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Related Articles</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-blue-600 hover:underline">Article 1</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Article 2</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Article 3</a></li>
            </ul>
          </div>

          {/* Sidebar banner */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Advertisement</h4>
            <NetpubMediumRectangle slot={2} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-blue-600 hover:underline">Technology</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Finance</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Education</a></li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

/**
 * Example: Interactive banner testing
 */
export function InteractiveBannerExample() {
  const [selectedSlot, setSelectedSlot] = useState(2);
  const [selectedSize, setSelectedSize] = useState('medium');

  const sizeOptions = {
    medium: { component: NetpubMediumRectangle, label: 'Medium Rectangle (300x250)' },
    large: { component: NetpubLargeRectangle, label: 'Large Rectangle (336x280)' },
    leaderboard: { component: NetpubLeaderboard, label: 'Leaderboard (728x90)' },
    responsive: { component: NetpubResponsiveBanner, label: 'Responsive Multi-size' }
  };

  const SelectedComponent = sizeOptions[selectedSize as keyof typeof sizeOptions].component;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Interactive Banner Testing</h3>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">Banner Slot:</label>
          <select 
            value={selectedSlot} 
            onChange={(e) => setSelectedSlot(Number(e.target.value))}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value={1}>Slot 1</option>
            <option value={2}>Slot 2</option>
            <option value={3}>Slot 3</option>
            <option value={4}>Slot 4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Banner Size:</label>
          <select 
            value={selectedSize} 
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            {Object.entries(sizeOptions).map(([key, option]) => (
              <option key={key} value={key}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Banner display */}
      <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Current: {sizeOptions[selectedSize as keyof typeof sizeOptions].label} - Slot {selectedSlot}
        </p>
        <SelectedComponent slot={selectedSlot} />
      </div>
    </div>
  );
}

/**
 * Main example component that showcases all banner examples
 */
export function NetpubBannerExamples() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-4">Netpub Banner Examples</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This page demonstrates various ways to implement and use Netpub banner advertisements
          in your React components.
        </p>
      </div>

      <BasicBannerExample />
      <BannerSizesExample />
      <ResponsiveBannerExample />
      <BannerPlacementExample />
      <ArticleIntegrationExample />
      <SidebarIntegrationExample />
      <InteractiveBannerExample />
    </div>
  );
}
