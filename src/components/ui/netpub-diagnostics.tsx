'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Globe, Shield, Code } from 'lucide-react';
import { ClientTimeDisplay } from '@/components/ui/client-date-display';

interface NetpubDiagnostics {
  scriptLoaded: boolean;
  scriptFailed: boolean;
  netpubObject: boolean;
  adContainers: number;
  gdprScript: boolean;
  verificationMeta: boolean;
  adsTextFile: boolean;
  errors: string[];
  warnings: string[];
  scriptUrls: string[];
  lastChecked: Date;
  netpubRetryCount?: number;
  isOnline?: boolean;
  adBlockerDetected?: boolean;
  adsTextStatus?: string;
}

export function NetpubDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<NetpubDiagnostics>({
    scriptLoaded: false,
    scriptFailed: false,
    netpubObject: false,
    adContainers: 0,
    gdprScript: false,
    verificationMeta: false,
    adsTextFile: false,
    errors: [],
    warnings: [],
    scriptUrls: [],
    lastChecked: new Date()
  });

  const [isChecking, setIsChecking] = useState(false);

  const runDiagnostics = async () => {
    setIsChecking(true);
    const errors: string[] = [];
    const warnings: string[] = [];
    const scriptUrls: string[] = [];

    try {
      // Enhanced NetPub script status checking
      const scriptLoaded = !!(window as any).netpubLoaded;
      const scriptFailed = !!(window as any).netpubLoadFailed;
      const netpubRetryCount = (window as any).netpubRetryCount || 0;
      const netpubMaxRetries = (window as any).netpubMaxRetries || 3;

      // Check if NetPub object exists
      const netpubObject = typeof (window as any).netpub !== 'undefined';

      // Check for NetPub script element
      const scriptElement = document.getElementById('831b33a650047ee11a992b11fdadd8f3');
      if (scriptElement) {
        const src = (scriptElement as HTMLScriptElement).src;
        if (src) scriptUrls.push(src);
      }

      // Count ad containers
      const adContainers = document.querySelectorAll('.adv-831b33a650047ee11a992b11fdadd8f3').length;

      // Check GDPR script
      const gdprScript = !!document.getElementById('gdpr-compliance-script');

      // Check verification meta tag
      const verificationMeta = !!document.querySelector('meta[name="netpub_831b33a650047ee11a992b11fdadd8f3"]');

      // Enhanced ads.txt file check
      let adsTextFile = false;
      let adsTextStatus = '';
      try {
        const response = await fetch('/ads.txt', { method: 'HEAD' });
        adsTextFile = response.ok;
        adsTextStatus = response.status.toString();
        if (!adsTextFile) {
          warnings.push(`ads.txt file returned status ${response.status}`);
        }
      } catch (e) {
        warnings.push('Could not verify ads.txt file accessibility: ' + (e as Error).message);
      }

      // Network connectivity check
      const isOnline = navigator.onLine;
      if (!isOnline) {
        errors.push('No internet connection detected');
      }

      // Enhanced error and warning generation
      if (scriptFailed) {
        errors.push(`NetPub script failed to load after ${netpubRetryCount}/${netpubMaxRetries} retry cycles`);
      }

      if (!scriptLoaded && !scriptFailed) {
        if (netpubRetryCount > 0) {
          warnings.push(`NetPub script loading in progress (retry ${netpubRetryCount}/${netpubMaxRetries})`);
        } else {
          warnings.push('NetPub script has not started loading yet');
        }
      }

      if (scriptLoaded && !netpubObject) {
        errors.push('NetPub script loaded but object not available - possible script corruption or blocking');
      }

      if (!gdprScript) {
        warnings.push('GDPR compliance script not found - may affect EU users');
      }

      if (!verificationMeta) {
        errors.push('NetPub verification meta tag not found - required for ad serving');
      }

      if (adContainers === 0) {
        warnings.push('No ad containers found on current page - ads will not display');
      } else if (adContainers > 10) {
        warnings.push(`High number of ad containers (${adContainers}) may impact performance`);
      }

      // Check for ad blockers
      const adBlockerDetected = !!(window as any).adBlockDetected ||
                               document.querySelectorAll('[style*="display: none"]').length > adContainers;
      if (adBlockerDetected) {
        warnings.push('Possible ad blocker detected');
      }

      // Performance warnings
      if (typeof window.performance !== 'undefined') {
        const loadTime = window.performance.now();
        if (loadTime > 5000) {
          warnings.push(`Page load time is high (${Math.round(loadTime)}ms) - may affect ad loading`);
        }
      }

      setDiagnostics({
        scriptLoaded,
        scriptFailed,
        netpubObject,
        adContainers,
        gdprScript,
        verificationMeta,
        adsTextFile,
        errors,
        warnings,
        scriptUrls,
        lastChecked: new Date(),
        // Additional diagnostic info
        netpubRetryCount,
        isOnline,
        adBlockerDetected,
        adsTextStatus
      });

    } catch (error) {
      errors.push(`Diagnostic error: ${error}`);
      setDiagnostics(prev => ({ ...prev, errors, lastChecked: new Date() }));
    }

    setIsChecking(false);
  };

  // Manual retry function
  const retryNetpubLoad = () => {
    if (typeof (window as any).retryNetpubLoad === 'function') {
      console.log('[NetPub Diagnostics] Initiating manual retry');
      (window as any).retryNetpubLoad();
      setTimeout(runDiagnostics, 1000);
    } else {
      console.warn('[NetPub Diagnostics] Retry function not available');
    }
  };

  useEffect(() => {
    runDiagnostics();

    // Run diagnostics every 3 seconds for more responsive updates
    const interval = setInterval(runDiagnostics, 3000);

    // Listen for NetPub events
    const handleNetpubLoaded = () => {
      console.log('[NetPub Diagnostics] NetPub loaded event received');
      setTimeout(runDiagnostics, 500);
    };

    const handleNetpubFailed = () => {
      console.log('[NetPub Diagnostics] NetPub failed event received');
      setTimeout(runDiagnostics, 500);
    };

    const handleNetpubObjectMissing = () => {
      console.log('[NetPub Diagnostics] NetPub object missing event received');
      setTimeout(runDiagnostics, 500);
    };

    window.addEventListener('netpubLoaded', handleNetpubLoaded);
    window.addEventListener('netpubLoadFailed', handleNetpubFailed);
    window.addEventListener('netpubObjectMissing', handleNetpubObjectMissing);

    return () => {
      clearInterval(interval);
      window.removeEventListener('netpubLoaded', handleNetpubLoaded);
      window.removeEventListener('netpubLoadFailed', handleNetpubFailed);
      window.removeEventListener('netpubObjectMissing', handleNetpubObjectMissing);
    };
  }, []);

  const getStatusIcon = (condition: boolean, isWarning = false) => {
    if (condition) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return isWarning ? 
      <AlertCircle className="h-5 w-5 text-yellow-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={condition ? "default" : "destructive"}>
        {condition ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>NetPub Diagnostics</span>
            </CardTitle>
            <CardDescription>
              Real-time monitoring of NetPub ad system status
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={runDiagnostics}
              disabled={isChecking}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {(diagnostics.scriptFailed || (!diagnostics.scriptLoaded && !diagnostics.netpubObject)) && (
              <Button
                onClick={retryNetpubLoad}
                disabled={isChecking}
                variant="default"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Load
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Core Status */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Core Status</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">NetPub Script</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(diagnostics.scriptLoaded)}
                {getStatusBadge(diagnostics.scriptLoaded, "Loaded", "Not Loaded")}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">NetPub Object</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(diagnostics.netpubObject)}
                {getStatusBadge(diagnostics.netpubObject, "Available", "Missing")}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Ad Containers</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(diagnostics.adContainers > 0, true)}
                <Badge variant={diagnostics.adContainers > 0 ? "default" : "secondary"}>
                  {diagnostics.adContainers} Found
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">GDPR Script</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(diagnostics.gdprScript, true)}
                {getStatusBadge(diagnostics.gdprScript, "Loaded", "Missing")}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Status */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Configuration</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Verification Meta</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(diagnostics.verificationMeta)}
                {getStatusBadge(diagnostics.verificationMeta, "Present", "Missing")}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">ads.txt File</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(diagnostics.adsTextFile, true)}
                {getStatusBadge(diagnostics.adsTextFile, "Accessible", "Check Required")}
              </div>
            </div>
          </div>
        </div>

        {/* Script URLs */}
        {diagnostics.scriptUrls.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Script URLs</h4>
            <div className="space-y-2">
              {diagnostics.scriptUrls.map((url, index) => (
                <div key={index} className="p-2 bg-muted rounded text-sm font-mono break-all">
                  {url}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Errors */}
        {diagnostics.errors.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-red-600 flex items-center space-x-2">
              <XCircle className="h-4 w-4" />
              <span>Errors</span>
            </h4>
            <div className="space-y-2">
              {diagnostics.errors.map((error, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {diagnostics.warnings.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-yellow-600 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Warnings</span>
            </h4>
            <div className="space-y-2">
              {diagnostics.warnings.map((warning, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Checked */}
        <div className="text-xs text-muted-foreground text-center">
          Last checked: <ClientTimeDisplay date={diagnostics.lastChecked} />
        </div>
      </CardContent>
    </Card>
  );
}
