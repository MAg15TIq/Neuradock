'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface DiagnosticStatus {
  scriptLoaded: boolean;
  netpubObject: boolean;
  adContainers: number;
  gdprScript: boolean;
  verificationMeta: boolean;
  adsTextFile: boolean;
  errors: string[];
  warnings: string[];
}

export default function NetpubDiagnosticsPage() {
  const [status, setStatus] = useState<DiagnosticStatus>({
    scriptLoaded: false,
    netpubObject: false,
    adContainers: 0,
    gdprScript: false,
    verificationMeta: false,
    adsTextFile: false,
    errors: [],
    warnings: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check NetPub script - look for robust loader scripts
      const robustScript = document.getElementById('netpub-robust-loader');
      const netpubScripts = document.querySelectorAll('script[id*="netpub-robust"]');
      const scriptLoaded = !!robustScript || netpubScripts.length > 0 || !!(window as any).netpubScriptLoaded;

      // Check NetPub object - comprehensive check
      const netpubObject = !!(window as any).netpub ||
                          !!(window as any).NetPub ||
                          !!(window as any).__npEngineRun_831b33a650047ee11a992b11fdadd8f3 ||
                          !!(window as any).netpubScriptLoaded;

      // Check for script loading failure
      if ((window as any).netpubLoadFailed) {
        errors.push('NetPub script failed to load from all attempted URLs');
      }

      // Check if script is currently loading
      if ((window as any).netpubScriptLoading) {
        warnings.push('NetPub script is currently loading...');
      }

      // Count ad containers
      const adContainers = document.querySelectorAll('.adv-831b33a650047ee11a992b11fdadd8f3').length;

      // Check GDPR script
      const gdprScript = !!document.getElementById('gdpr-compliance-script');

      // Check verification meta tag
      const verificationMeta = !!document.querySelector('meta[name="netpub_831b33a650047ee11a992b11fdadd8f3"]');

      // Check ads.txt file
      let adsTextFile = false;
      try {
        const response = await fetch('/ads.txt', { method: 'HEAD' });
        adsTextFile = response.ok;
        if (!adsTextFile) {
          warnings.push('ads.txt file may not be accessible');
        }
      } catch (e) {
        warnings.push('Could not verify ads.txt file accessibility');
      }

      // Enhanced diagnostic checks
      if (!scriptLoaded && !robustScript) {
        errors.push('NetPub robust loader script not found in DOM');
      }

      if (!netpubObject && scriptLoaded) {
        warnings.push('NetPub script loaded but object not available - may still be initializing');
      }

      if (adContainers === 0) {
        warnings.push('No ad containers found on this page');
      }

      if (!verificationMeta) {
        errors.push('NetPub verification meta tag missing from page head');
      }

      // Check if script is currently loading
      if ((window as any).netpubScriptLoading) {
        warnings.push('NetPub script is currently loading - please wait...');
      }

      // Provide helpful information
      if (!scriptLoaded && !netpubObject) {
        warnings.push('NetPub system appears to be initializing. This is normal on first page load.');
      }

      // Debug information
      const debugInfo = {
        robustScriptFound: !!robustScript,
        netpubScriptsCount: netpubScripts.length,
        globalFlags: {
          netpubScriptLoaded: (window as any).netpubScriptLoaded,
          netpubScriptLoading: (window as any).netpubScriptLoading,
          netpubLoadFailed: (window as any).netpubLoadFailed,
          retryCount: (window as any).netpubRetryCount
        }
      };

      console.log('[NetPub Diagnostics] Debug Info:', debugInfo);
      setDebugInfo(debugInfo);

      setStatus({
        scriptLoaded,
        netpubObject,
        adContainers,
        gdprScript,
        verificationMeta,
        adsTextFile,
        errors,
        warnings
      });

    } catch (error) {
      errors.push(`Diagnostic error: ${error}`);
      setStatus(prev => ({ ...prev, errors }));
    }

    setIsLoading(false);
    setLastChecked(new Date());
  };

  const retryNetpubLoad = () => {
    if (typeof (window as any).retryNetpubRobust === 'function') {
      (window as any).retryNetpubRobust();
      setTimeout(runDiagnostics, 2000);
    } else if (typeof (window as any).retryNetpubLoad === 'function') {
      (window as any).retryNetpubLoad();
      setTimeout(runDiagnostics, 2000);
    } else {
      alert('No retry function available. Please refresh the page.');
    }
  };

  useEffect(() => {
    // Initial check after a delay to allow scripts to load
    const timer = setTimeout(() => {
      runDiagnostics();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={condition ? "default" : "destructive"} className="ml-2">
        {condition ? (
          <><CheckCircle className="h-3 w-3 mr-1" />{trueText}</>
        ) : (
          <><XCircle className="h-3 w-3 mr-1" />{falseText}</>
        )}
      </Badge>
    );
  };

  const getCountBadge = (count: number, label: string) => {
    const variant = count > 0 ? "default" : "secondary";
    return (
      <Badge variant={variant} className="ml-2">
        {count} {label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">NetPub Diagnostics</h1>
            <p className="text-muted-foreground">Real-time monitoring of NetPub ad system status</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={runDiagnostics} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Checking...' : 'Refresh'}
            </Button>
            <Button onClick={retryNetpubLoad} variant="outline" disabled={isLoading}>
              🔄 Retry NetPub
            </Button>
          </div>
        </div>
        
        {lastChecked && (
          <p className="text-sm text-muted-foreground mt-2">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Core Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Core Status
          </CardTitle>
          <CardDescription>Essential components for NetPub ad system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>NetPub Script</span>
            {getStatusBadge(status.scriptLoaded, "Loaded", "Not Loaded")}
          </div>
          <div className="flex items-center justify-between">
            <span>NetPub Object</span>
            {getStatusBadge(status.netpubObject, "Available", "Missing")}
          </div>
          <div className="flex items-center justify-between">
            <span>Ad Containers</span>
            {getCountBadge(status.adContainers, "Found")}
          </div>
          <div className="flex items-center justify-between">
            <span>GDPR Script</span>
            {getStatusBadge(status.gdprScript, "Loaded", "Missing")}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>NetPub account and file configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Verification Meta</span>
            {getStatusBadge(status.verificationMeta, "Present", "Missing")}
          </div>
          <div className="flex items-center justify-between">
            <span>ads.txt File</span>
            {getStatusBadge(status.adsTextFile, "Accessible", "Check Required")}
            <Button variant="outline" size="sm" asChild>
              <Link href="/ads.txt" target="_blank" className="ml-2">
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      {status.errors.length > 0 && (
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {status.errors.map((error, index) => (
                <li key={index} className="text-red-600 text-sm">
                  • {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {status.warnings.length > 0 && (
        <Card className="mb-6 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-600 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {status.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-600 text-sm">
                  • {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Debug Information */}
      {debugInfo && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>Technical details for troubleshooting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Robust Script Found:</strong> {debugInfo.robustScriptFound ? '✅ Yes' : '❌ No'}</div>
              <div><strong>NetPub Scripts Count:</strong> {debugInfo.netpubScriptsCount}</div>
              <div><strong>Script Loaded Flag:</strong> {debugInfo.globalFlags.netpubScriptLoaded ? '✅ True' : '❌ False'}</div>
              <div><strong>Script Loading Flag:</strong> {debugInfo.globalFlags.netpubScriptLoading ? '⏳ True' : '❌ False'}</div>
              <div><strong>Load Failed Flag:</strong> {debugInfo.globalFlags.netpubLoadFailed ? '❌ True' : '✅ False'}</div>
              <div><strong>Retry Count:</strong> {debugInfo.globalFlags.retryCount || 0}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Ad Container */}
      <Card>
        <CardHeader>
          <CardTitle>Test Ad Container</CardTitle>
          <CardDescription>Live test of ad container rendering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4">Test Ad Slot</p>
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
                border: '1px solid #ccc',
                margin: '0 auto'
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
