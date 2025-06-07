'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdBanner, SidebarAdBanner, ContentAdBanner, useAdBanner } from '@/components/ui/ad-banner';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AdTestPage() {
  const { adsBlocked, adsLoaded, shouldShowAds } = useAdBanner();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Netpub Ad Banner Test
          </h1>
          <p className="text-xl text-muted-foreground">
            Testing the IAB 120x600 banner advertisement integration
          </p>
        </div>

        {/* Ad Status */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Ad Banner Status</span>
              </CardTitle>
              <CardDescription>
                Current status of the Netpub ad banner system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  {adsBlocked ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <span className={adsBlocked ? 'text-red-600' : 'text-green-600'}>
                    {adsBlocked ? 'Ads Blocked' : 'Ads Allowed'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {adsLoaded ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={adsLoaded ? 'text-green-600' : 'text-red-600'}>
                    {adsLoaded ? 'Script Loaded' : 'Script Not Loaded'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {shouldShowAds ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={shouldShowAds ? 'text-green-600' : 'text-red-600'}>
                    {shouldShowAds ? 'Should Show Ads' : 'Should Not Show Ads'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Layouts */}
        <div className="space-y-12">
          {/* Sidebar Layout Test */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Sidebar Layout with Ad Banner
            </h2>
            <SidebarLayout showAds={true}>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Main Content Area</CardTitle>
                    <CardDescription>
                      This is the main content area with a sidebar ad banner
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      The ad banner should appear in the right sidebar on desktop devices.
                      On mobile devices, the ad banner is hidden to maintain good user experience.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sample Article Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none">
                      <p>
                        This is sample article content to demonstrate how the ad banner
                        integrates with the layout. The banner should be sticky and
                        positioned appropriately in the sidebar.
                      </p>
                      <p>
                        The Netpub IAB 120x600 banner is designed to be non-intrusive
                        while still being visible to users. It includes proper fallback
                        content and error handling.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SidebarLayout>
          </section>

          {/* Individual Banner Tests */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Individual Banner Components
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Standard Ad Banner */}
              <Card>
                <CardHeader>
                  <CardTitle>Standard Ad Banner</CardTitle>
                  <CardDescription>Basic ad banner component</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <AdBanner showOnMobile={true} />
                </CardContent>
              </Card>

              {/* Sidebar Ad Banner */}
              <Card>
                <CardHeader>
                  <CardTitle>Sidebar Ad Banner</CardTitle>
                  <CardDescription>Sticky sidebar version</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="relative">
                    <SidebarAdBanner />
                  </div>
                </CardContent>
              </Card>

              {/* Content Ad Banner */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Ad Banner</CardTitle>
                  <CardDescription>For content placement</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentAdBanner />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Details */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Technical Implementation
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Implementation Details</CardTitle>
                <CardDescription>
                  How the Netpub ad banner is integrated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Script Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      The Netpub script is loaded using the ScriptHandler component with 
                      'afterInteractive' strategy for optimal performance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Ad Container</h4>
                    <p className="text-sm text-muted-foreground">
                      Uses the exact Netpub ad container with proper data attributes:
                      data-sizes-desktop="120x600" and data-sizes-mobile="120x600"
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Responsive Design</h4>
                    <p className="text-sm text-muted-foreground">
                      The banner is hidden on mobile devices by default but can be shown
                      when needed. It includes proper dark/light mode support.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Lazy loading is implemented to prevent blocking page rendering.
                      Error handling ensures graceful fallbacks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
