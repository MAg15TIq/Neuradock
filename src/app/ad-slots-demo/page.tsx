'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  NetpubBanner,
  NetpubMediumRectangle,
  NetpubLeaderboard,
  NetpubLargeRectangle,
  NetpubHalfPage,
  NetpubIABBanner,
  NetpubFixedLeaderboard,
  NetpubNotificationBanner,
  NetpubSlot6Banner
} from '@/components/ui/netpub-banner';
import { ArrowLeft } from 'lucide-react';

export default function AdSlotsDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-foreground">All 6 NetPub Ad Slots Demo</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive demonstration of all 6 NetPub advertising slots
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Slot 1 - Leaderboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Slot 1 - Leaderboard Banner</span>
              <Badge variant="outline">728x90 / 320x50</Badge>
            </CardTitle>
            <CardDescription>
              Header/Footer leaderboard banner - responsive desktop and mobile sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetpubLeaderboard slot={1} />
          </CardContent>
        </Card>

        {/* Slot 2 - Medium Rectangle */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Slot 2 - Medium Rectangle</span>
              <Badge variant="outline">300x250</Badge>
            </CardTitle>
            <CardDescription>
              Standard content banner - most common ad format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetpubMediumRectangle slot={2} />
          </CardContent>
        </Card>

        {/* Slot 3 - IAB Multi-Size Banner */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Slot 3 - IAB Multi-Size Banner</span>
              <Badge variant="outline">Multiple Sizes</Badge>
            </CardTitle>
            <CardDescription>
              Sidebar/content banner with multiple IAB standard sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetpubIABBanner slot={3} />
          </CardContent>
        </Card>

        {/* Slot 4 - Fixed Leaderboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Slot 4 - Fixed Leaderboard</span>
              <Badge variant="outline">728x90 Fixed</Badge>
            </CardTitle>
            <CardDescription>
              Fixed position leaderboard with enhanced targeting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetpubFixedLeaderboard slot={4} />
          </CardContent>
        </Card>

        {/* Slot 5 - Notification Banner */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Slot 5 - Notification Banner</span>
              <Badge variant="outline">Multi-Size Notification</Badge>
            </CardTitle>
            <CardDescription>
              Special notification-style banner for announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetpubNotificationBanner slot={5} />
          </CardContent>
        </Card>

        {/* Slot 6 - Mobile Optimized Banner */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Slot 6 - Mobile Optimized Banner</span>
              <Badge variant="outline">360x100 / 320x50</Badge>
            </CardTitle>
            <CardDescription>
              Mobile-first banner optimized for smaller screens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetpubSlot6Banner slot={6} />
          </CardContent>
        </Card>

        {/* Additional Demonstrations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Additional Banner Variations</CardTitle>
            <CardDescription>
              Other predefined banner components for different use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Large Rectangle (336x280)</h4>
              <NetpubLargeRectangle slot={3} />
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Half Page Banner (300x600)</h4>
              <NetpubHalfPage slot={4} />
            </div>
          </CardContent>
        </Card>

        {/* Custom Banner Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Custom Banner Configuration</CardTitle>
            <CardDescription>
              Example of custom banner with specific sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetpubBanner
              slot={2}
              desktopSizes="300x250,336x280"
              mobileSizes="300x250,320x50"
              className="border border-dashed border-gray-300 p-4 rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Integration Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Guide</CardTitle>
            <CardDescription>
              How to use these ad slots in your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Quick Usage:</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`import { NetpubLeaderboard, NetpubMediumRectangle } from '@/components/ui/netpub-banner';

// Header banner
<NetpubLeaderboard slot={1} />

// Content banner
<NetpubMediumRectangle slot={2} />

// Sidebar banner
<NetpubIABBanner slot={3} />`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold">Available Slots:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Slot 1:</strong> Header/Footer leaderboard (728x90)</li>
                  <li><strong>Slot 2:</strong> Content medium rectangle (300x250)</li>
                  <li><strong>Slot 3:</strong> Sidebar multi-size banner</li>
                  <li><strong>Slot 4:</strong> Fixed leaderboard with enhanced features</li>
                  <li><strong>Slot 5:</strong> Notification banner for special content</li>
                  <li><strong>Slot 6:</strong> Mobile-optimized banner (360x100)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
