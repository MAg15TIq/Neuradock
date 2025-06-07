'use client';

import {
  NetpubIABBanner,
  NetpubFixedLeaderboard,
  NetpubNotificationBanner,
  NetpubSlot6Banner,
  BannerPlacement
} from '@/components/ui/netpub-banner';

/**
 * Example usage of the new Netpub banner slots (3, 4, 5, 6)
 *
 * This demonstrates how to use the newly added banner components
 * for slots 3, 4, 5, and 6 with their specific configurations.
 */
export function NewBannerSlotsExample() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold mb-6">New Netpub Banner Slots (3, 4, 5, 6)</h2>
      
      {/* Slot 3: IAB 300x600 Banner */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Slot 3: IAB Multi-Size Banner (300x600 primary)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Supports multiple IAB standard sizes: 120x600, 160x600, 200x200, 250x250, 300x250, 300x600, 336x280
        </p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <NetpubIABBanner slot={3} className="bg-gray-50 dark:bg-gray-800 p-2" />
        </div>
      </section>

      {/* Slot 4: Fixed Leaderboard Banner */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Slot 4: Fixed Leaderboard Banner (728x90)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Desktop: 468x60, 678x60, 728x90, 970x90 | Mobile: 300x50, 320x100, 320x50, 360x100, 360x50
        </p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <NetpubFixedLeaderboard slot={4} className="bg-gray-50 dark:bg-gray-800 p-2" />
        </div>
      </section>

      {/* Slot 5: Notification Banner */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Slot 5: Notification Banner (150x0 style)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Notification style banner: 120x600, 160x600, 300x600, 336x280
        </p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <NetpubNotificationBanner slot={5} className="bg-gray-50 dark:bg-gray-800 p-2" />
        </div>
      </section>

      {/* Slot 6: IAB 360x100 Banner */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Slot 6: IAB 360x100 Multi-Size Banner</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Responsive banner sizes: 300x50, 320x100, 320x50, 360x100, 360x50
        </p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <NetpubSlot6Banner slot={6} className="bg-gray-50 dark:bg-gray-800 p-2" />
        </div>
      </section>

      {/* Usage in content with BannerPlacement */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Content Integration Examples</h3>
        
        <article className="prose dark:prose-invert max-w-none">
          <h4>Sample Article Content</h4>
          <p>
            This is sample article content to demonstrate how the new banner slots
            can be integrated into content areas using the BannerPlacement wrapper.
          </p>

          {/* IAB Banner in content */}
          <BannerPlacement position="center" margin="my-6">
            <NetpubIABBanner slot={3} />
          </BannerPlacement>

          <p>
            More article content continues here. The banner above is placed using
            the BannerPlacement wrapper for consistent positioning.
          </p>

          {/* Fixed Leaderboard Banner */}
          <BannerPlacement position="center" margin="my-8">
            <NetpubFixedLeaderboard slot={4} />
          </BannerPlacement>

          <p>
            Additional content can follow the leaderboard banner. The fixed attribute
            ensures proper rendering for this banner type.
          </p>

          {/* Notification Banner */}
          <BannerPlacement position="right" margin="my-4">
            <NetpubNotificationBanner slot={5} />
          </BannerPlacement>

          <p>
            The notification banner can be positioned differently and has special
            notification attributes for proper display.
          </p>

          {/* Slot 6 Banner */}
          <BannerPlacement position="center" margin="my-6">
            <NetpubSlot6Banner slot={6} />
          </BannerPlacement>

          <p>
            The Slot 6 banner provides responsive multi-size support with IAB standard
            dimensions optimized for both desktop and mobile viewing.
          </p>
        </article>
      </section>

      {/* Technical Implementation Notes */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Technical Implementation</h3>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Key Features:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>All scripts are loaded in the root layout with proper deduplication</li>
            <li>Each slot has its own script handler with unique IDs</li>
            <li>Components support responsive sizing for desktop and mobile</li>
            <li>Fixed and notification attributes are automatically applied</li>
            <li>Client-side rendering prevents hydration mismatches</li>
            <li>Error handling and graceful fallbacks included</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

/**
 * Quick usage examples for copy-paste
 */
export function QuickUsageExamples() {
  return (
    <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold">Quick Usage Examples</h3>
      
      <div className="space-y-2 text-sm font-mono">
        <div>
          <span className="text-gray-600 dark:text-gray-400">{/* Slot 3 - IAB Banner */}</span>
          <br />
          <span>&lt;NetpubIABBanner slot={3} /&gt;</span>
        </div>

        <div>
          <span className="text-gray-600 dark:text-gray-400">{/* Slot 4 - Fixed Leaderboard */}</span>
          <br />
          <span>&lt;NetpubFixedLeaderboard slot={4} /&gt;</span>
        </div>

        <div>
          <span className="text-gray-600 dark:text-gray-400">{/* Slot 5 - Notification Banner */}</span>
          <br />
          <span>&lt;NetpubNotificationBanner slot={5} /&gt;</span>
        </div>

        <div>
          <span className="text-gray-600 dark:text-gray-400">{/* Slot 6 - IAB 360x100 Banner */}</span>
          <br />
          <span>&lt;NetpubSlot6Banner slot={6} /&gt;</span>
        </div>

        <div>
          <span className="text-gray-600 dark:text-gray-400">{/* With placement wrapper */}</span>
          <br />
          <span>&lt;BannerPlacement position="center"&gt;</span>
          <br />
          <span>&nbsp;&nbsp;&lt;NetpubIABBanner slot={3} /&gt;</span>
          <br />
          <span>&lt;/BannerPlacement&gt;</span>
        </div>
      </div>
    </div>
  );
}
