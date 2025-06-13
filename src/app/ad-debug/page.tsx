'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  NetpubMediumRectangle,
  NetpubIABBanner,
  NetpubFixedLeaderboard,
  NetpubNotificationBanner,
  NetpubSlot6Banner
} from '@/components/ui/netpub-banner';
import { AdBanner, useAdBanner } from '@/components/ui/ad-banner';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ScriptStatus {
  id: string;
  loaded: boolean;
  exists: boolean;
  src?: string;
}

export default function AdDebugPage() {
  const [scriptStatuses, setScriptStatuses] = useState<ScriptStatus[]>([]);
  const [netpubGlobal, setNetpubGlobal] = useState<any>(null);
  const [adElements, setAdElements] = useState<Element[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { adsBlocked } = useAdBanner();

  const checkScripts = () => {
    const scripts = [
      'netpub-ad-script-main',
      'netpub-banner-script-slot2',
      'netpub-banner-script-slot3',
      'netpub-banner-script-slot4',
      'netpub-banner-script-slot5',
      'netpub-banner-script-slot6',
      'gdpr-compliance-script'
    ];

    const statuses = scripts.map(id => {
      const element = document.getElementById(id);
      const scriptElement = element as HTMLScriptElement;
      return {
        id,
        loaded: !!element,
        exists: !!element,
        src: scriptElement?.src || 'inline script'
      };
    });

    // Check for the actual Netpub script
    const netpubScript = document.getElementById('831b33a650047ee11a992b11fdadd8f3');
    if (netpubScript) {
      statuses.push({
        id: '831b33a650047ee11a992b11fdadd8f3',
        loaded: true,
        exists: true,
        src: (netpubScript as HTMLScriptElement).src
      });
    }

    setScriptStatuses(statuses);
    setNetpubGlobal((window as any).netpub || null);

    // Check for ad elements
    const adElements = Array.from(document.querySelectorAll('.adv-831b33a650047ee11a992b11fdadd8f3'));
    setAdElements(adElements);
  };

  useEffect(() => {
    checkScripts();
    const interval = setInterval(checkScripts, 2000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
    checkScripts();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Ad Debug Dashboard
            </h1>
          </div>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Scripts Loaded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scriptStatuses.filter(s => s.loaded).length}/{scriptStatuses.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ad Elements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adElements.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ads Blocked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adsBlocked ? (
                  <span className="text-red-500">Yes</span>
                ) : (
                  <span className="text-green-500">No</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Netpub Global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {netpubGlobal ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Script Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Script Loading Status</CardTitle>
            <CardDescription>Status of all Netpub and GDPR scripts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scriptStatuses.map((script) => (
                <div key={script.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{script.id}</div>
                    <div className="text-sm text-muted-foreground">{script.src}</div>
                  </div>
                  <Badge variant={script.loaded ? "default" : "destructive"}>
                    {script.loaded ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Loaded</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Failed</>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ad Elements Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ad Elements on Page</CardTitle>
            <CardDescription>All .adv-831b33a650047ee11a992b11fdadd8f3 elements found</CardDescription>
          </CardHeader>
          <CardContent>
            {adElements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <p>No ad elements found on the page</p>
              </div>
            ) : (
              <div className="space-y-3">
                {adElements.map((element, index) => {
                  const slot = element.getAttribute('data-slot');
                  const desktopSizes = element.getAttribute('data-sizes-desktop');
                  const mobileSizes = element.getAttribute('data-sizes-mobile');
                  const hasContent = element.innerHTML.trim().length > 0;
                  
                  return (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Slot {slot}</div>
                        <Badge variant={hasContent ? "default" : "secondary"}>
                          {hasContent ? "Has Content" : "Empty"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Desktop: {desktopSizes}</div>
                        <div>Mobile: {mobileSizes}</div>
                        <div>Content Length: {element.innerHTML.length} chars</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test All Ad Slots */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test All Ad Slots</CardTitle>
            <CardDescription>Visual test of all 6 ad slots with debug information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Slot 1 - Legacy AdBanner */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Slot 1 - Legacy AdBanner (120x600)</h4>
                <AdBanner showOnMobile={true} />
              </div>

              {/* Slot 2 - Medium Rectangle */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Slot 2 - Medium Rectangle (300x250)</h4>
                <NetpubMediumRectangle slot={2} />
              </div>

              {/* Slot 3 - IAB Banner */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Slot 3 - IAB Banner (300x600)</h4>
                <NetpubIABBanner slot={3} />
              </div>

              {/* Slot 4 - Fixed Leaderboard */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Slot 4 - Fixed Leaderboard (728x90)</h4>
                <NetpubFixedLeaderboard slot={4} />
              </div>

              {/* Slot 5 - Notification Banner */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Slot 5 - Notification Banner</h4>
                <NetpubNotificationBanner slot={5} />
              </div>

              {/* Slot 6 - Multi-size Banner */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Slot 6 - Multi-size Banner</h4>
                <NetpubSlot6Banner slot={6} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Guide</CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                <h4 className="font-medium mb-2">If scripts are not loading:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Check browser console for script errors</li>
                  <li>Verify network connectivity to fstatic.netpub.media</li>
                  <li>Check if ad blockers are interfering</li>
                  <li>Ensure ScriptHandler components are working</li>
                </ul>
              </div>
              
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-medium mb-2">If ad elements exist but no ads show:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Wait 5-10 seconds for ads to load</li>
                  <li>Check if your account has active campaigns</li>
                  <li>Verify the publisher ID (831b33a650047ee11a992b11fdadd8f3)</li>
                  <li>Test from different geographic locations</li>
                </ul>
              </div>
              
              <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                <h4 className="font-medium mb-2">Best practices:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Allow 24-48 hours for new ad placements to activate</li>
                  <li>Test from different devices and browsers</li>
                  <li>Monitor browser console for any JavaScript errors</li>
                  <li>Contact Netpub support if issues persist</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
