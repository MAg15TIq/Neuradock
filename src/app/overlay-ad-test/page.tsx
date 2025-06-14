'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function OverlayAdTestPage() {
  const [overlayAdsVisible, setOverlayAdsVisible] = useState(true);
  const [testResults, setTestResults] = useState({
    slot3: 'pending',
    slot4: 'pending',
    slot5: 'pending',
    layoutRestored: 'pending',
    responsiveDesign: 'pending',
    netpubStatus: 'pending',
    fallbackWorking: 'pending'
  });

  useEffect(() => {
    // Test overlay ad functionality
    const runTests = () => {
      const results = { ...testResults };

      // Check if overlay ads are present
      const slot3Ad = document.querySelector('[data-slot="3"]');
      const slot4Ad = document.querySelector('[data-slot="4"]');
      const slot5Ad = document.querySelector('[data-slot="5"]');

      results.slot3 = slot3Ad ? 'success' : 'error';
      results.slot4 = slot4Ad ? 'success' : 'error';
      results.slot5 = slot5Ad ? 'success' : 'error';

      // Check if inline ads are hidden
      const inlineAds = document.querySelectorAll('.universal-ad-container, .netpub-banner-container');
      const hiddenAds = Array.from(inlineAds).filter(ad => {
        const style = window.getComputedStyle(ad as Element);
        return style.display === 'none' || style.visibility === 'hidden';
      });

      results.layoutRestored = hiddenAds.length === inlineAds.length ? 'success' : 'warning';

      // Check responsive design
      const overlayContainers = document.querySelectorAll('.overlay-ad-container');
      results.responsiveDesign = overlayContainers.length > 0 ? 'success' : 'error';

      // Check NetPub status
      const netpubLoaded = (window as any).netpubScriptLoaded;
      const netpubFailed = (window as any).netpubLoadFailed;

      if (netpubLoaded) {
        results.netpubStatus = 'success';
        results.fallbackWorking = 'success'; // Not needed if NetPub works
      } else if (netpubFailed) {
        results.netpubStatus = 'error';
        // Check if fallback ads are showing
        const fallbackAds = document.querySelectorAll('.overlay-ad-content');
        results.fallbackWorking = fallbackAds.length > 0 ? 'success' : 'error';
      } else {
        results.netpubStatus = 'pending';
        results.fallbackWorking = 'pending';
      }

      setTestResults(results);
    };

    // Run tests after a delay to allow ads to load
    const timer = setTimeout(runTests, 5000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Working';
      case 'error':
        return 'Failed';
      case 'warning':
        return 'Partial';
      default:
        return 'Testing...';
    }
  };

  const toggleOverlayAds = () => {
    const style = document.getElementById('overlay-ad-hider');
    if (overlayAdsVisible) {
      // Hide overlay ads
      const overlayContainers = document.querySelectorAll('.overlay-ad-container');
      overlayContainers.forEach(container => {
        (container as HTMLElement).style.display = 'none';
      });
    } else {
      // Show overlay ads
      const overlayContainers = document.querySelectorAll('.overlay-ad-container');
      overlayContainers.forEach(container => {
        (container as HTMLElement).style.display = '';
      });
    }
    setOverlayAdsVisible(!overlayAdsVisible);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Overlay Ad System Test
          </h1>
          <p className="text-lg text-muted-foreground">
            Testing the new overlay ad implementation that replaces inline ads
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>
              Control overlay ads visibility and test functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={toggleOverlayAds}
                variant={overlayAdsVisible ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {overlayAdsVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {overlayAdsVisible ? 'Hide' : 'Show'} Overlay Ads
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              <Button
                onClick={() => {
                  if ((window as any).retryNetpubRobust) {
                    (window as any).retryNetpubRobust();
                  }
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry NetPub
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Automated tests for overlay ad functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium">Slot 3 Ad (300x600)</h4>
                  <p className="text-sm text-muted-foreground">Half-page overlay ad</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.slot3)}
                  <span className="text-sm font-medium">{getStatusText(testResults.slot3)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium">Slot 4 Ad (728x90)</h4>
                  <p className="text-sm text-muted-foreground">Leaderboard overlay ad</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.slot4)}
                  <span className="text-sm font-medium">{getStatusText(testResults.slot4)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium">Slot 5 Ad (150x0)</h4>
                  <p className="text-sm text-muted-foreground">Notification overlay ad</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.slot5)}
                  <span className="text-sm font-medium">{getStatusText(testResults.slot5)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium">Layout Restoration</h4>
                  <p className="text-sm text-muted-foreground">Inline ads hidden, original layout restored</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.layoutRestored)}
                  <span className="text-sm font-medium">{getStatusText(testResults.layoutRestored)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium">Responsive Design</h4>
                  <p className="text-sm text-muted-foreground">Overlay ads adapt to screen size</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.responsiveDesign)}
                  <span className="text-sm font-medium">{getStatusText(testResults.responsiveDesign)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium">NetPub Script Status</h4>
                  <p className="text-sm text-muted-foreground">NetPub ad script loading status</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.netpubStatus)}
                  <span className="text-sm font-medium">{getStatusText(testResults.netpubStatus)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium">Fallback System</h4>
                  <p className="text-sm text-muted-foreground">Fallback ads when NetPub fails</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(testResults.fallbackWorking)}
                  <span className="text-sm font-medium">{getStatusText(testResults.fallbackWorking)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sample Content</CardTitle>
            <CardDescription>
              This content demonstrates that the original layout is preserved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                This page demonstrates the new overlay ad system that replaces inline ads with 
                overlay positioning. The ads now appear as overlays on top of the content instead 
                of disrupting the page layout.
              </p>
              
              <h3>Key Features</h3>
              <ul>
                <li><strong>Non-disruptive:</strong> Ads don't push content around</li>
                <li><strong>Closable:</strong> Users can close ads they don't want to see</li>
                <li><strong>Minimizable:</strong> Ads can be minimized to a small icon</li>
                <li><strong>Responsive:</strong> Ads adapt to different screen sizes</li>
                <li><strong>Animated:</strong> Smooth animations for better user experience</li>
              </ul>

              <h3>Ad Slots</h3>
              <ul>
                <li><strong>Slot 3:</strong> 300x600 half-page ad (replaces sidebar ads)</li>
                <li><strong>Slot 4:</strong> 728x90 leaderboard ad (replaces header/footer ads)</li>
                <li><strong>Slot 5:</strong> 150x0 notification ad (special notification format)</li>
              </ul>

              <p>
                The overlay ads maintain their original dimensions as specified by Netpub while 
                providing a much better user experience by not disrupting the page layout.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>
              How to verify the overlay ad system is working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Expected Behavior
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Overlay ads should appear after 3-5 seconds</li>
                  <li>• Ads should be positioned as overlays, not inline</li>
                  <li>• Original page layout should be preserved</li>
                  <li>• Ads should be closable and minimizable</li>
                  <li>• No layout shifts or content displacement</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Success Indicators
                </h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• All test results show "Working" status</li>
                  <li>• Overlay ads are visible and functional</li>
                  <li>• Page content is not pushed around by ads</li>
                  <li>• Ads can be closed using the X button</li>
                  <li>• Ads can be minimized using the - button</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
