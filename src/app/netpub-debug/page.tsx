'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import '@/types/netpub';

interface NetpubStatus {
  scriptLoaded: boolean;
  scriptLoading: boolean;
  loadFailed: boolean;
  retryCount: number;
  hasNetpub: boolean;
  hasNetPub: boolean;
  hasEngine: boolean;
  scripts: Array<{
    id: string;
    src: string;
    loaded: string;
  }>;
}

export default function NetpubDebugPage() {
  const [status, setStatus] = useState<NetpubStatus | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkStatus = () => {
    if (typeof window !== 'undefined' && window.netpubDiagnostics) {
      const newStatus = window.netpubDiagnostics();
      setStatus(newStatus);
      setLastUpdate(new Date());
    }
  };

  const retryLoad = () => {
    if (typeof window !== 'undefined' && window.retryNetpubLoad) {
      addEvent('Manual retry initiated');
      window.retryNetpubLoad();
      setTimeout(checkStatus, 1000);
    }
  };

  const addEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [`${timestamp}: ${message}`, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    // Initial check
    setTimeout(checkStatus, 1000);

    // Set up event listeners
    const handleNetpubLoaded = (event: any) => {
      addEvent(`NetPub loaded successfully${event.detail?.fallback ? ' (fallback)' : ''}`);
      checkStatus();
    };

    const handleNetpubFailed = (event: any) => {
      addEvent(`NetPub failed: ${event.detail?.error || 'Unknown error'}`);
      checkStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('netpubLoaded', handleNetpubLoaded);
      window.addEventListener('netpubLoadFailed', handleNetpubFailed);

      // Regular status checks
      const interval = setInterval(checkStatus, 3000);

      return () => {
        window.removeEventListener('netpubLoaded', handleNetpubLoaded);
        window.removeEventListener('netpubLoadFailed', handleNetpubFailed);
        clearInterval(interval);
      };
    }
  }, []);

  const getStatusBadge = () => {
    if (!status) return <Badge variant="secondary">Loading...</Badge>;
    
    if (status.scriptLoaded) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Loaded</Badge>;
    } else if (status.loadFailed) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
    } else if (status.scriptLoading) {
      return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Loading...</Badge>;
    } else {
      return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NetPub Debug Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor NetPub script loading status and troubleshoot issues
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Script Status
              {getStatusBadge()}
            </CardTitle>
            <CardDescription>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Script Loaded:</span>
                  <span className={`ml-2 ${status.scriptLoaded ? 'text-green-600' : 'text-red-600'}`}>
                    {status.scriptLoaded ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Script Loading:</span>
                  <span className={`ml-2 ${status.scriptLoading ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {status.scriptLoading ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Load Failed:</span>
                  <span className={`ml-2 ${status.loadFailed ? 'text-red-600' : 'text-green-600'}`}>
                    {status.loadFailed ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Retry Count:</span>
                  <span className="ml-2">{status.retryCount}</span>
                </div>
                <div>
                  <span className="font-medium">NetPub Object:</span>
                  <span className={`ml-2 ${status.hasNetpub ? 'text-green-600' : 'text-red-600'}`}>
                    {status.hasNetpub ? 'Found' : 'Not Found'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Engine Loaded:</span>
                  <span className={`ml-2 ${status.hasEngine ? 'text-green-600' : 'text-red-600'}`}>
                    {status.hasEngine ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={checkStatus} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
              <Button onClick={retryLoad} variant="default" size="sm">
                Retry Load
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Event Log */}
        <Card>
          <CardHeader>
            <CardTitle>Event Log</CardTitle>
            <CardDescription>Recent NetPub events and messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <div key={index} className="text-sm p-2 bg-muted rounded text-muted-foreground">
                    {event}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No events yet...</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Script Details */}
        {status && status.scripts.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Loaded Scripts</CardTitle>
              <CardDescription>NetPub scripts currently in the DOM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {status.scripts.map((script, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">{script.id}</div>
                    <div className="text-xs text-muted-foreground truncate">{script.src}</div>
                    <div className="text-xs">Status: {script.loaded}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Console Commands */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Console Commands</CardTitle>
            <CardDescription>Useful commands for debugging in browser console</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono bg-muted p-4 rounded-lg">
              <div><span className="text-blue-600">window.netpubDiagnostics()</span> - Get detailed status</div>
              <div><span className="text-blue-600">window.retryNetpubLoad()</span> - Retry loading script</div>
              <div><span className="text-blue-600">window.netpubScriptLoaded</span> - Check if script loaded</div>
              <div><span className="text-blue-600">window.netpub</span> - Access NetPub object (if available)</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
