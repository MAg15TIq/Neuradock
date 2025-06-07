'use client';

import { NetpubSlot6Banner, BannerPlacement } from '@/components/ui/netpub-banner';

/**
 * Example usage of Netpub Slot 6 Banner
 * 
 * This demonstrates the new IAB 360x100 multi-size banner
 * with responsive sizing for both desktop and mobile.
 */
export function Slot6BannerExample() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold mb-6">Netpub Slot 6 Banner Example</h2>
      
      {/* Basic Usage */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Simple implementation of the Slot 6 banner with default settings.
        </p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <NetpubSlot6Banner slot={6} />
        </div>
      </section>

      {/* With Custom Styling */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">With Custom Styling</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Banner with custom CSS classes for enhanced visual presentation.
        </p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <NetpubSlot6Banner 
            slot={6} 
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm" 
          />
        </div>
      </section>

      {/* In Content with BannerPlacement */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Content Integration</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Using BannerPlacement wrapper for consistent positioning within content.
        </p>
        
        <article className="prose dark:prose-invert max-w-none">
          <h4>Sample Article Content</h4>
          <p>
            This is sample content to demonstrate how the Slot 6 banner integrates
            seamlessly within article content using the BannerPlacement component.
          </p>

          <BannerPlacement position="center" margin="my-6">
            <NetpubSlot6Banner slot={6} />
          </BannerPlacement>

          <p>
            The banner above is centered and has proper spacing. The responsive
            design ensures optimal display across all device sizes.
          </p>
        </article>
      </section>

      {/* Technical Specifications */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Technical Specifications</h3>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Slot 6 Banner Details:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Slot Number:</strong> 6</li>
            <li><strong>Desktop Sizes:</strong> 300x50, 320x100, 320x50, 360x100, 360x50</li>
            <li><strong>Mobile Sizes:</strong> 300x50, 320x100, 320x50, 360x100, 360x50</li>
            <li><strong>Script ID:</strong> 831b33a650047ee11a992b11fdadd8f3</li>
            <li><strong>Responsive:</strong> Yes, adapts to screen size</li>
            <li><strong>IAB Compliant:</strong> Yes, follows IAB standard formats</li>
          </ul>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Code Examples</h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`// Basic usage
<NetpubSlot6Banner slot={6} />

// With custom styling
<NetpubSlot6Banner 
  slot={6} 
  className="bg-gray-50 p-4 rounded-lg" 
/>

// With placement wrapper
<BannerPlacement position="center" margin="my-6">
  <NetpubSlot6Banner slot={6} />
</BannerPlacement>`}
          </pre>
        </div>
      </section>

      {/* Implementation Notes */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Implementation Notes</h3>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Important:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>The Netpub script is automatically loaded in the root layout</li>
            <li>No additional script loading is required in individual components</li>
            <li>The banner uses client-side rendering to prevent hydration issues</li>
            <li>All banner sizes are IAB standard compliant</li>
            <li>The component supports both light and dark themes</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

/**
 * Quick reference component for developers
 */
export function Slot6QuickReference() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Slot 6 Quick Reference</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium mb-2">Component Import:</h4>
          <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            import {`{ NetpubSlot6Banner }`} from '@/components/ui/netpub-banner'
          </code>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Basic Usage:</h4>
          <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
            &lt;NetpubSlot6Banner slot={`{6}`} /&gt;
          </code>
        </div>
      </div>
    </div>
  );
}
