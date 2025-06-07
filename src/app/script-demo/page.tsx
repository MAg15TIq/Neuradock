'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Code, Zap } from "lucide-react";
import { 
  DirectScriptExample, 
  ChartJSExample, 
  InlineScriptExample,
  ThirdPartyWidgetExample,
  ConditionalScriptExample 
} from "@/components/examples/script-examples";

export default function ScriptDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Code className="h-10 w-10 text-blue-600" />
            Script Handling Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore advanced script management and SSR-compatible inline script execution
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                SSR Compatible
              </CardTitle>
              <CardDescription>
                Scripts execute properly during server-side rendering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Implemented</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Dependency Management
              </CardTitle>
              <CardDescription>
                Load scripts in the correct order with dependency tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Implemented</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Error Handling
              </CardTitle>
              <CardDescription>
                Robust error handling and fallback mechanisms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Implemented</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Script Handling Examples */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Live Examples</h2>
            <p className="text-muted-foreground mb-8">
              These examples demonstrate different script loading strategies and use cases. 
              Open your browser's developer console to see the script execution logs.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Direct Script Handler</CardTitle>
              <CardDescription>
                Basic usage of ScriptHandler component for external and inline scripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DirectScriptExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. External Library with Dependencies</CardTitle>
              <CardDescription>
                Loading Chart.js library and initializing charts with dependency management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartJSExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Inline Script Execution</CardTitle>
              <CardDescription>
                Executing inline scripts with SSR support and error handling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InlineScriptExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Third-party Widget Integration</CardTitle>
              <CardDescription>
                Example of integrating third-party widgets with proper script loading sequence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThirdPartyWidgetExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Conditional Script Loading</CardTitle>
              <CardDescription>
                Loading scripts only when needed to improve performance and reduce bundle size
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConditionalScriptExample />
            </CardContent>
          </Card>
        </div>

        {/* Implementation Guide */}
        <div className="mt-16 p-6 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Implementation Guide</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Key Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SSR-compatible inline script execution</li>
                <li>• Dependency management for script loading</li>
                <li>• Multiple loading strategies (beforeInteractive, afterInteractive, lazyOnload)</li>
                <li>• Error handling and fallback mechanisms</li>
                <li>• Context-based script management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Use Cases:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Analytics and tracking scripts</li>
                <li>• Third-party widget integration</li>
                <li>• External library loading</li>
                <li>• Critical scripts that need early execution</li>
                <li>• Conditional script loading for performance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Learn More</h3>
          <p className="text-muted-foreground mb-6">
            Check out our comprehensive documentation for detailed implementation guides
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <a href="/docs/SCRIPT_HANDLING.md" target="_blank">
                View Documentation
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://nextjs.org/docs/app/api-reference/components/script" target="_blank">
                Next.js Script Docs
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
