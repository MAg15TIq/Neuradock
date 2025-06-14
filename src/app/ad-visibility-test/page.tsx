'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  NetpubMediumRectangle,
  NetpubLeaderboard,
  NetpubLargeRectangle,
  NetpubSlot6Banner
} from '@/components/ui/netpub-banner';
import {
  ContentAd,
  HeaderAd,
  FooterAd,
  SidebarAd,
  MobileAd
} from '@/components/ui/universal-ad-system';
import { getAdContentSummary, hasAnyAdContent } from '@/lib/ad-content-detector';
import { ArrowLeft, RefreshCw, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdVisibilityTestPage() {
  const [adSummary, setAdSummary] = useState({
    total: 0,
    withContent: 0,
    empty: 0,
    blocked: 0,
    loading: 0
  });
  const [hasContent, setHasContent] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const updateAdSummary = () => {
    const summary = getAdContentSummary();
    const contentExists = hasAnyAdContent();
    
    setAdSummary(summary);
    setHasContent(contentExists);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    // Initial check
    setTimeout(updateAdSummary, 1000);

    // Periodic updates
    const interval = setInterval(updateAdSummary, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, total: number) => {
    if (total === 0) return 'secondary';
    const percentage = (value / total) * 100;
    if (percentage === 0) return 'secondary';
    if (percentage < 50) return 'destructive';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold">Ad Visibility Test</h1>
            </div>
            <Button onClick={updateAdSummary} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Ad Visibility Status
            </CardTitle>
            <CardDescription>
              Real-time monitoring of advertisement container visibility and content detection.
              Last updated: {lastUpdate.toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{adSummary.total}</div>
                <div className="text-sm text-muted-foreground">Total Ads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{adSummary.withContent}</div>
                <div className="text-sm text-muted-foreground">With Content</div>
                <Badge variant={getStatusColor(adSummary.withContent, adSummary.total)} className="mt-1">
                  {adSummary.total > 0 ? Math.round((adSummary.withContent / adSummary.total) * 100) : 0}%
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-500">{adSummary.empty}</div>
                <div className="text-sm text-muted-foreground">Empty</div>
                <Badge variant={getStatusColor(adSummary.empty, adSummary.total)} className="mt-1">
                  {adSummary.total > 0 ? Math.round((adSummary.empty / adSummary.total) * 100) : 0}%
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{adSummary.blocked}</div>
                <div className="text-sm text-muted-foreground">Blocked</div>
                <Badge variant={getStatusColor(adSummary.blocked, adSummary.total)} className="mt-1">
                  {adSummary.total > 0 ? Math.round((adSummary.blocked / adSummary.total) * 100) : 0}%
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{adSummary.loading}</div>
                <div className="text-sm text-muted-foreground">Loading</div>
                <Badge variant={getStatusColor(adSummary.loading, adSummary.total)} className="mt-1">
                  {adSummary.total > 0 ? Math.round((adSummary.loading / adSummary.total) * 100) : 0}%
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-center space-x-4">
              {hasContent ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Ads are loading successfully</span>
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span className="font-medium">No ad content detected</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Ad Placements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Ad Test */}
            <Card>
              <CardHeader>
                <CardTitle>Header Ad (Leaderboard)</CardTitle>
                <CardDescription>728x90 banner typically shown at the top of pages</CardDescription>
              </CardHeader>
              <CardContent>
                <HeaderAd slot={1} />
              </CardContent>
            </Card>

            {/* Content Ad Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Content Ads</CardTitle>
                <CardDescription>Medium rectangle ads placed within content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Content Ad #1</h4>
                  <ContentAd slot={2} />
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Content Ad #2</h4>
                  <NetpubMediumRectangle slot={3} />
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Large Rectangle Ad</h4>
                  <NetpubLargeRectangle slot={4} />
                </div>
              </CardContent>
            </Card>

            {/* Mobile Ad Test */}
            <Card className="lg:hidden">
              <CardHeader>
                <CardTitle>Mobile Ad</CardTitle>
                <CardDescription>Mobile-optimized banner (visible only on mobile)</CardDescription>
              </CardHeader>
              <CardContent>
                <MobileAd slot={6} />
              </CardContent>
            </Card>

            {/* Footer Ad Test */}
            <Card>
              <CardHeader>
                <CardTitle>Footer Ad</CardTitle>
                <CardDescription>Fixed leaderboard typically shown at the bottom</CardDescription>
              </CardHeader>
              <CardContent>
                <FooterAd slot={5} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sidebar Ad</CardTitle>
                <CardDescription>Skyscraper ad for sidebar placement</CardDescription>
              </CardHeader>
              <CardContent>
                <SidebarAd slot={7} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Expected Behavior:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Empty ad containers should be completely hidden</li>
                  <li>No placeholder boxes or empty spaces should be visible</li>
                  <li>Only ads with actual content should display</li>
                  <li>Blocked ads should not leave gaps in the layout</li>
                  <li>Loading states should timeout after 30 seconds</li>
                </ul>
                
                <Separator className="my-3" />
                
                <p><strong>Test Scenarios:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Normal ad loading</li>
                  <li>Ad blocker enabled</li>
                  <li>Network connectivity issues</li>
                  <li>Script loading failures</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
