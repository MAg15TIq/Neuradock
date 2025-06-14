'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ContentAd,
  MobileAd,
  ArticleTopAd,
  ArticleBottomAd,
  BetweenContentAd
} from '@/components/ui/universal-ad-system';
import {
  NetpubMediumRectangle,
  NetpubLeaderboard,
  NetpubLargeRectangle,
  NetpubSlot6Banner
} from '@/components/ui/netpub-banner';
import { AdLayoutWrapper } from '@/components/layout/ad-layout-wrapper';
import { NetpubDiagnostics } from '@/components/ui/netpub-diagnostics';
import { ArrowLeft, RefreshCw, Monitor, Smartphone, Tablet } from 'lucide-react';

interface AdTestStatus {
  scriptLoaded: boolean;
  netpubObject: boolean;
  adsVisible: number;
  errors: string[];
}

export default function AdSystemTestPage() {
  const [, setTestStatus] = useState<AdTestStatus>({
    scriptLoaded: false,
    netpubObject: false,
    adsVisible: 0,
    errors: []
  });
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const checkAdStatus = () => {
      const errors: string[] = [];
      
      // Check if NetPub script is loaded
      const script = document.getElementById('831b33a650047ee11a992b11fdadd8f3');
      const scriptLoaded = !!script;
      
      if (!scriptLoaded) {
        errors.push('NetPub script not found in DOM');
      }

      // Check if NetPub object exists
      const netpubObject = !!(window as any).netpub || !!(window as any).netpubLoaded;
      
      if (!netpubObject) {
        errors.push('NetPub object not available on window');
      }

      // Count visible ad containers
      const adContainers = document.querySelectorAll('.adv-831b33a650047ee11a992b11fdadd8f3');
      const adsVisible = adContainers.length;

      setTestStatus({
        scriptLoaded,
        netpubObject,
        adsVisible,
        errors
      });
    };

    // Check immediately and after delays
    checkAdStatus();
    const timer1 = setTimeout(checkAdStatus, 2000);
    const timer2 = setTimeout(checkAdStatus, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [refreshKey]);

  const refreshTest = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getDeviceClasses = () => {
    switch (deviceView) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-7xl mx-auto';
    }
  };

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
              <h1 className="text-3xl font-bold text-foreground">Ad System Test Page</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive testing for NetPub advertising implementation
              </p>
            </div>
            <Button onClick={refreshTest} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Test
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced NetPub Diagnostics */}
        <div className="mb-8">
          <NetpubDiagnostics />
        </div>

        {/* Device View Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Device View Testing</CardTitle>
            <CardDescription>
              Test ad responsiveness across different device sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'outline'}
                onClick={() => setDeviceView('desktop')}
                size="sm"
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={deviceView === 'tablet' ? 'default' : 'outline'}
                onClick={() => setDeviceView('tablet')}
                size="sm"
              >
                <Tablet className="h-4 w-4 mr-2" />
                Tablet
              </Button>
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'outline'}
                onClick={() => setDeviceView('mobile')}
                size="sm"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ad Testing Area */}
        <div className={getDeviceClasses()}>
          <AdLayoutWrapper
            showHeaderAd={true}
            showFooterAd={true}
            showSidebarAd={true}
            showMobileAds={true}
            pageType="static"
            sidebarContent={
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Sidebar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This sidebar contains test content along with the sidebar ad placement.
                  </p>
                </CardContent>
              </Card>
            }
          >
            {/* Universal Ad System Tests */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Universal Ad System Tests</CardTitle>
                  <CardDescription>
                    Testing the new universal ad placement system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Article Top Ad */}
                  <div>
                    <h4 className="font-semibold mb-2">Article Top Ad</h4>
                    <ArticleTopAd slot={2} />
                  </div>

                  <Separator />

                  {/* Content Ad */}
                  <div>
                    <h4 className="font-semibold mb-2">Content Ad</h4>
                    <ContentAd slot={2} />
                  </div>

                  <Separator />

                  {/* Between Content Ad */}
                  <div>
                    <h4 className="font-semibold mb-2">Between Content Ad</h4>
                    <BetweenContentAd slot={3} />
                  </div>

                  <Separator />

                  {/* Mobile Ad */}
                  <div>
                    <h4 className="font-semibold mb-2">Mobile Ad (Mobile Only)</h4>
                    <MobileAd slot={6} />
                  </div>

                  <Separator />

                  {/* Article Bottom Ad */}
                  <div>
                    <h4 className="font-semibold mb-2">Article Bottom Ad</h4>
                    <ArticleBottomAd slot={3} />
                  </div>
                </CardContent>
              </Card>

              {/* Individual Banner Tests */}
              <Card>
                <CardHeader>
                  <CardTitle>Individual Banner Component Tests</CardTitle>
                  <CardDescription>
                    Testing specific NetPub banner components
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Medium Rectangle (300x250)</h4>
                      <NetpubMediumRectangle slot={2} />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Large Rectangle (336x280)</h4>
                      <NetpubLargeRectangle slot={3} />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Leaderboard (728x90)</h4>
                    <NetpubLeaderboard slot={1} />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Slot 6 Banner (360x100)</h4>
                    <NetpubSlot6Banner slot={6} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </AdLayoutWrapper>
        </div>
      </div>
    </div>
  );
}
