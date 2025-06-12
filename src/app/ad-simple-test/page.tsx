'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdSimpleTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Simple Ad Test Page
          </h1>
          <p className="text-muted-foreground">
            This page tests the basic Netpub ad implementation with raw HTML to ensure the script is working.
          </p>
        </div>

        {/* Instructions */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">How to Test:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open browser developer tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Look for "Netpub script loaded successfully" message</li>
            <li>Check if ads appear in the containers below</li>
            <li>Wait 5-10 seconds for ads to load</li>
          </ol>
        </div>

        {/* Test Ads */}
        <div className="space-y-8">
          {/* Slot 1 - 120x600 */}
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Slot 1 - 120x600 Banner</h3>
            <div className="flex justify-center">
              <ins 
                className="adv-831b33a650047ee11a992b11fdadd8f3" 
                data-sizes-desktop="120x600" 
                data-sizes-mobile="120x600" 
                data-slot="1"
                style={{
                  display: 'block',
                  width: '120px',
                  height: '600px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>

          {/* Slot 2 - 300x250 */}
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Slot 2 - 300x250 Banner</h3>
            <div className="flex justify-center">
              <ins 
                className="adv-831b33a650047ee11a992b11fdadd8f3" 
                data-sizes-desktop="300x250" 
                data-sizes-mobile="300x250" 
                data-slot="2"
                style={{
                  display: 'block',
                  width: '300px',
                  height: '250px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>

          {/* Slot 3 - 300x600 */}
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Slot 3 - 300x600 Banner</h3>
            <div className="flex justify-center">
              <ins 
                className="adv-831b33a650047ee11a992b11fdadd8f3" 
                data-sizes-desktop="300x600" 
                data-sizes-mobile="300x250" 
                data-slot="3"
                style={{
                  display: 'block',
                  width: '300px',
                  height: '600px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>

          {/* Slot 4 - 728x90 */}
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Slot 4 - 728x90 Banner</h3>
            <div className="flex justify-center">
              <ins 
                className="adv-831b33a650047ee11a992b11fdadd8f3" 
                data-sizes-desktop="728x90" 
                data-sizes-mobile="320x50" 
                data-slot="4"
                data-fixed="1"
                style={{
                  display: 'block',
                  width: '728px',
                  height: '90px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>

          {/* Slot 5 - Notification */}
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Slot 5 - Notification Banner</h3>
            <div className="flex justify-center">
              <ins 
                className="adv-831b33a650047ee11a992b11fdadd8f3" 
                data-sizes-desktop="300x600" 
                data-sizes-mobile="300x250" 
                data-slot="5"
                data-notification="1"
                style={{
                  display: 'block',
                  width: '300px',
                  height: '600px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>

          {/* Slot 6 - Multi-size */}
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Slot 6 - Multi-size Banner</h3>
            <div className="flex justify-center">
              <ins 
                className="adv-831b33a650047ee11a992b11fdadd8f3" 
                data-sizes-desktop="360x100,320x100,300x50" 
                data-sizes-mobile="320x100,300x50" 
                data-slot="6"
                style={{
                  display: 'block',
                  width: '360px',
                  height: '100px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
          <div className="space-y-2 text-sm font-mono">
            <div>Publisher ID: 831b33a650047ee11a992b11fdadd8f3</div>
            <div>Script URL: https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js</div>
            <div>GDPR Script: https://fstatic.netpub.media/extra/cmp/cmp-gdpr.js</div>
            <div>Total Slots: 6</div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Troubleshooting</h3>
          <div className="space-y-2 text-sm">
            <p><strong>If no ads show:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Check browser console for errors</li>
              <li>Disable ad blockers</li>
              <li>Wait 5-10 seconds for ads to load</li>
              <li>Try refreshing the page</li>
              <li>Test from different geographic locations</li>
              <li>Verify your Netpub account has active campaigns</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex space-x-4">
          <Button asChild>
            <Link href="/ad-debug">
              View Debug Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/ad-test">
              View Component Test
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
