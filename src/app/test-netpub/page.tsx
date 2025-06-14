'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface NetPubStatus {
  scriptLoaded: boolean;
  scriptLoading: boolean;
  netpubObject: boolean;
  scriptElement: boolean;
  fallbackElement: boolean;
  events: string[];
  errors: string[];
}

export default function TestNetPubPage() {
  const [status, setStatus] = useState<NetPubStatus>({
    scriptLoaded: false,
    scriptLoading: false,
    netpubObject: false,
    scriptElement: false,
    fallbackElement: false,
    events: [],
    errors: []
  });

  const checkStatus = () => {
    const newStatus: NetPubStatus = {
      scriptLoaded: !!(window as any).netpubScriptLoaded,
      scriptLoading: !!(window as any).netpubScriptLoading,
      netpubObject: typeof (window as any).netpub !== 'undefined',
      scriptElement: !!document.getElementById('831b33a650047ee11a992b11fdadd8f3'),
      fallbackElement: !!document.getElementById('831b33a650047ee11a992b11fdadd8f3-fallback'),
      events: status.events,
      errors: status.errors
    };
    
    setStatus(newStatus);
  };

  const addEvent = (event: string) => {
    setStatus(prev => ({
      ...prev,
      events: [...prev.events.slice(-9), `${new Date().toLocaleTimeString()}: ${event}`]
    }));
  };

  const addError = (error: string) => {
    setStatus(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-4), `${new Date().toLocaleTimeString()}: ${error}`]
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

  useEffect(() => {
    // Initial check
    checkStatus();

    // Set up event listeners
    const handleNetpubLoaded = (event: any) => {
      addEvent(`NetPub loaded successfully${event.detail?.fallback ? ' (fallback)' : ''}`);
      checkStatus();
    };

    const handleNetpubFailed = (event: any) => {
      addError(`NetPub failed to load: ${event.detail?.error || 'Unknown error'}`);
      checkStatus();
    };

    window.addEventListener('netpubLoaded', handleNetpubLoaded);
    window.addEventListener('netpubLoadFailed', handleNetpubFailed);

    // Regular status checks
    const interval = setInterval(checkStatus, 2000);

    return () => {
      window.removeEventListener('netpubLoaded', handleNetpubLoaded);
      window.removeEventListener('netpubLoadFailed', handleNetpubFailed);
      clearInterval(interval);
    };
  }, []);

  const StatusIcon = ({ condition }: { condition: boolean }) => {
    return condition ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">NetPub Script Test</h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring of NetPub script loading and functionality
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Script Status</span>
              <div className="flex space-x-2">
                <Button onClick={checkStatus} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={retryLoad} variant="default" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Load
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>Script Loaded</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={status.scriptLoaded} />
                  <Badge variant={status.scriptLoaded ? "default" : "destructive"}>
                    {status.scriptLoaded ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>Script Loading</span>
                <div className="flex items-center space-x-2">
                  <AlertCircle className={`h-5 w-5 ${status.scriptLoading ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <Badge variant={status.scriptLoading ? "secondary" : "outline"}>
                    {status.scriptLoading ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>NetPub Object</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={status.netpubObject} />
                  <Badge variant={status.netpubObject ? "default" : "destructive"}>
                    {status.netpubObject ? "Available" : "Missing"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>Script Element</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={status.scriptElement} />
                  <Badge variant={status.scriptElement ? "default" : "destructive"}>
                    {status.scriptElement ? "Present" : "Missing"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>Fallback Element</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={status.fallbackElement} />
                  <Badge variant={status.fallbackElement ? "secondary" : "outline"}>
                    {status.fallbackElement ? "Present" : "Not Used"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {status.events.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest NetPub script events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {status.events.map((event, index) => (
                  <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    {event}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {status.errors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Errors</CardTitle>
              <CardDescription>NetPub script errors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {status.errors.map((error, index) => (
                  <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    {error}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Ad Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Test Ad Slots</CardTitle>
            <CardDescription>NetPub ad containers for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Slot 3 (300x600)</h4>
                <div 
                  id="netpub-slot-3" 
                  className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500"
                  style={{ width: '300px', height: '600px' }}
                >
                  NetPub Slot 3
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Slot 4 (728x90)</h4>
                <div 
                  id="netpub-slot-4" 
                  className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500"
                  style={{ width: '728px', height: '90px' }}
                >
                  NetPub Slot 4
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Slot 5 (Notification)</h4>
                <div 
                  id="netpub-slot-5" 
                  className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500"
                  style={{ width: '100%', height: '50px' }}
                >
                  NetPub Slot 5 (Notification)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
