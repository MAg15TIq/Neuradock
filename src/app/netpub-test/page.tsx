'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface NetPubStatus {
  scriptLoaded: boolean;
  scriptLoading: boolean;
  loadFailed: boolean;
  retryCount: number;
  netpubObject: boolean;
  lastEvent: string;
  networkOnline: boolean;
  events: string[];
  errors: string[];
}

export default function NetPubTestPage() {
  const [status, setStatus] = useState<NetPubStatus>({
    scriptLoaded: false,
    scriptLoading: false,
    loadFailed: false,
    retryCount: 0,
    netpubObject: false,
    lastEvent: 'Initializing...',
    networkOnline: navigator?.onLine ?? true,
    events: [],
    errors: []
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateStatus = () => {
    if (typeof window === 'undefined') return;

    const newStatus: NetPubStatus = {
      scriptLoaded: !!(window as any).netpubScriptLoaded,
      scriptLoading: !!(window as any).netpubScriptLoading,
      loadFailed: !!(window as any).netpubLoadFailed,
      retryCount: (window as any).netpubRetryCount || 0,
      netpubObject: !!(window as any).netpub || !!(window as any).NetPub,
      lastEvent: status.lastEvent,
      networkOnline: navigator.onLine,
      events: status.events,
      errors: status.errors
    };

    setStatus(newStatus);
  };

  const addEvent = (event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setStatus(prev => ({
      ...prev,
      lastEvent: event,
      events: [...prev.events.slice(-9), `${timestamp}: ${event}`]
    }));
  };

  const addError = (error: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setStatus(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-4), `${timestamp}: ${error}`]
    }));
  };

  const retryLoad = () => {
    if (typeof (window as any).retryNetpubLoad === 'function') {
      addEvent('Manual retry initiated');
      (window as any).retryNetpubLoad();
    } else {
      addError('Retry function not available');
    }
  };

  const runDiagnostics = () => {
    if (typeof (window as any).netpubDiagnostics === 'function') {
      const diagnostics = (window as any).netpubDiagnostics();
      addEvent(`Diagnostics: Scripts found: ${diagnostics.scripts.length}, NetPub object: ${diagnostics.hasNetpub}`);
      console.log('[NetPub Test] Full diagnostics:', diagnostics);
    } else {
      addError('Diagnostics function not available');
    }
  };

  useEffect(() => {
    if (!isClient) return;

    // Initial status check
    updateStatus();

    // Set up event listeners
    const handleNetPubLoaded = (event: any) => {
      addEvent(`NetPub loaded successfully (URL index: ${event.detail?.urlIndex || 'unknown'})`);
      updateStatus();
    };

    const handleNetPubFailed = (event: any) => {
      addError(`NetPub loading failed: ${event.detail?.error || 'Unknown error'}`);
      updateStatus();
    };

    const handleOnline = () => {
      addEvent('Network connection restored');
      updateStatus();
    };

    const handleOffline = () => {
      addEvent('Network connection lost');
      updateStatus();
    };

    window.addEventListener('netpubLoaded', handleNetPubLoaded);
    window.addEventListener('netpubLoadFailed', handleNetPubFailed);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic status updates
    const interval = setInterval(updateStatus, 2000);

    return () => {
      window.removeEventListener('netpubLoaded', handleNetPubLoaded);
      window.removeEventListener('netpubLoadFailed', handleNetPubFailed);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>NetPub Script Test</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            NetPub Script Test
            {status.networkOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
          </CardTitle>
          <CardDescription>
            Real-time monitoring of NetPub script loading and functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              {status.scriptLoaded ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : status.loadFailed ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />
              )}
              <span className="text-sm font-medium">
                Script: {status.scriptLoaded ? 'Loaded' : status.loadFailed ? 'Failed' : 'Loading'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {status.netpubObject ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium">
                Object: {status.netpubObject ? 'Available' : 'Missing'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={status.retryCount > 0 ? 'destructive' : 'secondary'}>
                Retries: {status.retryCount}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={status.networkOnline ? 'default' : 'destructive'}>
                Network: {status.networkOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={retryLoad} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Load
            </Button>
            <Button onClick={updateStatus} variant="outline" size="sm">
              Refresh Status
            </Button>
            <Button onClick={runDiagnostics} variant="outline" size="sm">
              Run Diagnostics
            </Button>
          </div>

          {/* Last Event */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Last Event:</p>
            <p className="text-sm text-muted-foreground">{status.lastEvent}</p>
          </div>

          {/* Recent Events */}
          {status.events.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Events:</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {status.events.map((event, index) => (
                  <p key={index} className="text-xs text-muted-foreground font-mono">
                    {event}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {status.errors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-red-600">Recent Errors:</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {status.errors.map((error, index) => (
                  <p key={index} className="text-xs text-red-600 font-mono">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Ad Container */}
      <Card>
        <CardHeader>
          <CardTitle>Test Ad Container</CardTitle>
          <CardDescription>
            This container should display an ad once NetPub script loads successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="adv-831b33a650047ee11a992b11fdadd8f3 border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center"
            data-slot="3"
            data-sizes="300x250,336x280"
          >
            <p className="text-muted-foreground">Ad will appear here when NetPub loads</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
