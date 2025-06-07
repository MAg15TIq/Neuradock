'use client';

import { ScriptHandler } from '@/components/ui/script-handler';
import { useExternalScript, useInlineScript, useScriptManager } from '@/components/ui/script-manager';
import { useEffect, useState } from 'react';

/**
 * Example: Loading Google Analytics
 */
export function GoogleAnalyticsExample() {
  const { loadScript } = useScriptManager();

  useEffect(() => {
    // Load Google Analytics
    loadScript('gtag', 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID', {
      async: true,
      onLoad: () => {
        // Initialize Google Analytics after script loads
        (window as unknown as { dataLayer: unknown[] }).dataLayer = (window as unknown as { dataLayer: unknown[] }).dataLayer || [];
        function gtag(...args: unknown[]) {
          (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
      }
    });
  }, [loadScript]);

  return null;
}

/**
 * Example: Loading external library with dependency
 */
export function ChartJSExample() {
  const chartScript = useExternalScript(
    'chartjs',
    'https://cdn.jsdelivr.net/npm/chart.js',
    {
      onLoad: () => console.log('Chart.js loaded'),
      onError: (error) => console.error('Failed to load Chart.js:', error)
    }
  );

  const { executeInlineScript } = useScriptManager();

  useEffect(() => {
    if (chartScript.loaded) {
      // Execute chart initialization after Chart.js loads
      executeInlineScript('chart-init', `
        console.log('Chart.js is ready:', typeof Chart !== 'undefined');
        // Initialize your charts here
      `, {
        dependencies: ['chartjs'],
        onExecute: () => console.log('Chart initialization complete')
      });
    }
  }, [chartScript.loaded, executeInlineScript]);

  return (
    <div>
      <p>Chart.js Status: {chartScript.loading ? 'Loading...' : chartScript.loaded ? 'Loaded' : 'Not loaded'}</p>
      {chartScript.error && <p>Error: {chartScript.error.message}</p>}
    </div>
  );
}

/**
 * Example: Inline script with SSR support
 */
export function InlineScriptExample() {
  const inlineScript = useInlineScript(
    'user-preferences',
    `
      // This script will run on both server and client
      const userPrefs = {
        theme: 'dark',
        language: 'en'
      };
      console.log('User preferences initialized:', userPrefs);
    `,
    {
      executeOnServer: true,
      onExecute: () => console.log('Inline script executed'),
      onError: (error) => console.error('Inline script error:', error)
    }
  );

  return (
    <div>
      <p>Inline Script Status: {inlineScript.executed ? 'Executed' : 'Not executed'}</p>
      {inlineScript.error && <p>Error: {inlineScript.error.message}</p>}
    </div>
  );
}

/**
 * Example: Using ScriptHandler component directly
 */
export function DirectScriptExample() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  return (
    <div>
      <h3>Direct Script Handler Examples</h3>
      
      {/* External script */}
      <ScriptHandler
        src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
          console.log('Lodash loaded');
        }}
        onError={(error) => console.error('Lodash failed to load:', error)}
      />

      {/* Inline script */}
      <ScriptHandler strategy="afterInteractive">
        {`
          console.log('Inline script executed via ScriptHandler');
          window.customFunction = function() {
            return 'Hello from custom function!';
          };
        `}
      </ScriptHandler>

      <p>Lodash Status: {scriptLoaded ? 'Loaded' : 'Loading...'}</p>
    </div>
  );
}

/**
 * Example: Critical script that needs to run before hydration
 */
export function CriticalScriptExample() {
  return (
    <ScriptHandler
      strategy="beforeInteractive"
      executeOnServer={true}
    >
      {`
        // Critical script that runs before React hydration
        window.__CRITICAL_DATA__ = {
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        };
        console.log('Critical script executed');
      `}
    </ScriptHandler>
  );
}

/**
 * Example: Third-party widget integration
 */
export function ThirdPartyWidgetExample() {
  const { loadScript, executeInlineScript } = useScriptManager();
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    // Load third-party widget script
    loadScript('widget-sdk', 'https://example.com/widget-sdk.js', {
      onLoad: () => {
        // Initialize widget after SDK loads
        executeInlineScript('widget-init', `
          if (window.WidgetSDK) {
            window.WidgetSDK.init({
              apiKey: 'your-api-key',
              container: '#widget-container'
            });
          }
        `, {
          dependencies: ['widget-sdk'],
          onExecute: () => setWidgetReady(true)
        });
      }
    });
  }, [loadScript, executeInlineScript]);

  return (
    <div>
      <h3>Third-party Widget</h3>
      <div id="widget-container">
        {widgetReady ? 'Widget loaded!' : 'Loading widget...'}
      </div>
    </div>
  );
}

/**
 * Example: Conditional script loading
 */
export function ConditionalScriptExample() {
  const [shouldLoadScript, setShouldLoadScript] = useState(false);
  
  const conditionalScript = useExternalScript(
    'conditional-lib',
    'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js',
    {
      onLoad: () => console.log('Moment.js loaded conditionally')
    }
  );

  // Only load script when condition is met
  useEffect(() => {
    if (shouldLoadScript && !conditionalScript.loaded && !conditionalScript.loading) {
      // Script will be loaded by the hook
    }
  }, [shouldLoadScript, conditionalScript]);

  return (
    <div>
      <h3>Conditional Script Loading</h3>
      <button onClick={() => setShouldLoadScript(true)}>
        Load Moment.js
      </button>
      <p>Status: {conditionalScript.loading ? 'Loading...' : conditionalScript.loaded ? 'Loaded' : 'Not loaded'}</p>
    </div>
  );
}
