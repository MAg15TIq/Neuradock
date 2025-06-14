'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, RefreshCw, Info } from 'lucide-react';

export default function NetPubSimpleTestPage() {
  const [status, setStatus] = useState({
    scriptLoaded: false,
    scriptLoading: false,
    loadFailed: false,
    netpubObject: false,
    scriptElement: false,
    fallbackElement: false,
    retryCount: 0,
    lastUpdate: new Date().toLocaleTimeString()
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkStatus = () => {
    if (typeof window === 'undefined') return;

    // Check script loading status
    const scriptLoaded = !!(window as any).netpubScriptLoaded;
    const scriptLoading = !!(window as any).netpubScriptLoading;
    const loadFailed = !!(window as any).netpubLoadFailed;
    const retryCount = (window as any).netpubRetryCount || 0;

    // Check for NetPub objects
    const netpubObject = !!(window as any).netpub || !!(window as any).NetPub;

    // Check for script elements in DOM
    const scriptElements = document.querySelectorAll('script[id*="netpub"]');
    const scriptElement = scriptElements.length > 0;

    // Check for fallback element
    const fallbackElement = !!document.getElementById('netpub-fallback');

    setStatus({
      scriptLoaded,
      scriptLoading,
      loadFailed,
      netpubObject,
      scriptElement,
      fallbackElement,
      retryCount,
      lastUpdate: new Date().toLocaleTimeString()
    });

    console.log('[NetPub Simple Test] Status:', {
      scriptLoaded,
      scriptLoading,
      loadFailed,
      netpubObject,
      scriptElement,
      fallbackElement,
      retryCount,
      scriptElementsFound: scriptElements.length
    });
  };

  const retryLoad = () => {
    if (typeof (window as any).retryNetpubLoad === 'function') {
      console.log('[NetPub Simple Test] Initiating manual retry...');
      (window as any).retryNetpubLoad();
      setTimeout(checkStatus, 1000);
    } else {
      console.error('[NetPub Simple Test] Retry function not available');
    }
  };

  const runDiagnostics = () => {
    if (typeof (window as any).netpubDiagnostics === 'function') {
      const diagnostics = (window as any).netpubDiagnostics();
      console.log('[NetPub Simple Test] Full diagnostics:', diagnostics);
    } else {
      console.error('[NetPub Simple Test] Diagnostics function not available');
    }
  };

  useEffect(() => {
    if (!isClient) return;

    // Initial status check
    checkStatus();

    // Set up event listeners for NetPub events
    const handleNetPubLoaded = (event: any) => {
      console.log('[NetPub Simple Test] NetPub loaded event:', event.detail);
      setTimeout(checkStatus, 500);
    };

    const handleNetPubFailed = (event: any) => {
      console.error('[NetPub Simple Test] NetPub failed event:', event.detail);
      setTimeout(checkStatus, 500);
    };

    window.addEventListener('netpubLoaded', handleNetPubLoaded);
    window.addEventListener('netpubLoadFailed', handleNetPubFailed);

    // Periodic status updates
    const interval = setInterval(checkStatus, 3000);

    return () => {
      window.removeEventListener('netpubLoaded', handleNetPubLoaded);
      window.removeEventListener('netpubLoadFailed', handleNetPubFailed);
      clearInterval(interval);
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>NetPub Simple Test</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const StatusIndicator = ({ condition, label }: { condition: boolean; label: string }) => (
    <div className="flex items-center gap-2 p-2 rounded border">
      {condition ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500" />
      )}
      <span className="text-sm font-medium">
        {label}: {condition ? 'Yes' : 'No'}
      </span>
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6" />
            NetPub Simple Test
          </CardTitle>
          <CardDescription>
            Simplified NetPub script testing and diagnostics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatusIndicator condition={status.scriptLoaded} label="Script Loaded" />
            <StatusIndicator condition={status.netpubObject} label="NetPub Object" />
            <StatusIndicator condition={status.scriptElement} label="Script Element" />
            <StatusIndicator condition={status.fallbackElement} label="Fallback Element" />
            <StatusIndicator condition={!status.loadFailed} label="Load Success" />
            <StatusIndicator condition={!status.scriptLoading} label="Load Complete" />
          </div>

          {/* Retry Count */}
          {status.retryCount > 0 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Retry Count: {status.retryCount}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={checkStatus} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            <Button onClick={retryLoad} variant="outline" size="sm">
              Retry Load
            </Button>
            <Button onClick={runDiagnostics} variant="outline" size="sm">
              Run Diagnostics
            </Button>
          </div>

          {/* Last Update */}
          <div className="text-xs text-muted-foreground">
            Last updated: {status.lastUpdate}
          </div>
        </CardContent>
      </Card>

      {/* Test Ad Container */}
      <Card>
        <CardHeader>
          <CardTitle>Test Ad Container (Slot 3)</CardTitle>
          <CardDescription>
            NetPub ad container for testing - should display ad when script loads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="adv-831b33a650047ee11a992b11fdadd8f3 border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center min-h-[250px] flex items-center justify-center"
            data-slot="3"
            data-sizes="300x250,336x280"
          >
            <p className="text-muted-foreground">
              {status.scriptLoaded 
                ? "Ad should appear here" 
                : "Waiting for NetPub script to load..."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
