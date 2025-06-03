# Script Handling in Next.js

This document explains how to properly handle scripts in our Next.js application, addressing the common issue where inline scripts don't execute during server-side rendering.

## Overview

Next.js doesn't execute inline scripts in the `<head>` section during SSR for security and performance reasons. Our solution provides:

1. **ScriptHandler Component**: Enhanced wrapper around Next.js Script component
2. **ScriptManager**: Context-based script management with dependency handling
3. **Critical Script Support**: Scripts that need to run before hydration
4. **SSR-Compatible Inline Scripts**: Safe execution of inline scripts

## Components

### ScriptHandler

Enhanced Script component that handles both external and inline scripts.

```tsx
import { ScriptHandler } from '@/components/ui/script-handler';

// External script
<ScriptHandler
  src="https://example.com/script.js"
  strategy="afterInteractive"
  onLoad={() => console.log('Script loaded')}
/>

// Inline script
<ScriptHandler strategy="afterInteractive">
  {`console.log('Inline script executed');`}
</ScriptHandler>

// Critical script (runs before hydration)
<ScriptHandler 
  strategy="beforeInteractive"
  executeOnServer={true}
>
  {`window.__CRITICAL_DATA__ = { timestamp: Date.now() };`}
</ScriptHandler>
```

### ScriptManager

Context-based script management with dependency handling.

```tsx
import { useScriptManager, useExternalScript, useInlineScript } from '@/components/ui/script-manager';

function MyComponent() {
  // Load external script with dependency management
  const chartScript = useExternalScript(
    'chartjs',
    'https://cdn.jsdelivr.net/npm/chart.js'
  );

  // Execute inline script after dependency loads
  useInlineScript(
    'chart-init',
    `console.log('Chart.js ready:', typeof Chart !== 'undefined');`,
    { dependencies: ['chartjs'] }
  );

  return <div>Chart Status: {chartScript.loaded ? 'Ready' : 'Loading'}</div>;
}
```

## Loading Strategies

### beforeInteractive
- Loads before page becomes interactive
- Use for critical scripts that affect initial render
- Executes during SSR if `executeOnServer={true}`

### afterInteractive (default)
- Loads after page becomes interactive
- Best for most scripts
- Doesn't block page interaction

### lazyOnload
- Loads during browser idle time
- Use for non-critical scripts
- Analytics, tracking scripts

### worker
- Loads in a web worker (experimental)
- Use for heavy computations

## Best Practices

### 1. Critical Scripts
For scripts that must run before React hydration:

```tsx
import { CriticalInlineScript } from '@/components/ui/script-handler';

// In layout.tsx head section
<head>
  <CriticalInlineScript id="theme-script">
    {`
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
    `}
  </CriticalInlineScript>
</head>
```

### 2. Third-party Integrations
For external services like analytics:

```tsx
function GoogleAnalytics() {
  const { loadScript } = useScriptManager();

  useEffect(() => {
    loadScript('gtag', 'https://www.googletagmanager.com/gtag/js?id=GA_ID', {
      onLoad: () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args) { dataLayer.push(args); }
        gtag('js', new Date());
        gtag('config', 'GA_ID');
      }
    });
  }, []);

  return null;
}
```

### 3. Library Dependencies
For scripts that depend on other libraries:

```tsx
function ChartComponent() {
  // Load Chart.js first
  const chartScript = useExternalScript('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js');
  
  // Then load chart configuration
  useInlineScript(
    'chart-config',
    `
      const ctx = document.getElementById('myChart');
      new Chart(ctx, { /* config */ });
    `,
    { 
      dependencies: ['chartjs'],
      onExecute: () => console.log('Chart initialized')
    }
  );

  return <canvas id="myChart" />;
}
```

### 4. Conditional Loading
Load scripts only when needed:

```tsx
function ConditionalWidget() {
  const [showWidget, setShowWidget] = useState(false);
  
  const widgetScript = useExternalScript(
    'widget',
    'https://example.com/widget.js',
    { 
      onLoad: () => console.log('Widget ready') 
    }
  );

  // Script loads only when showWidget becomes true
  useEffect(() => {
    if (showWidget && !widgetScript.loaded) {
      // Hook will handle loading
    }
  }, [showWidget]);

  return (
    <div>
      <button onClick={() => setShowWidget(true)}>
        Load Widget
      </button>
      {showWidget && widgetScript.loaded && <div id="widget-container" />}
    </div>
  );
}
```

## Error Handling

All script components support error handling:

```tsx
<ScriptHandler
  src="https://example.com/script.js"
  onError={(error) => {
    console.error('Script failed to load:', error);
    // Handle fallback or retry logic
  }}
/>
```

## Performance Considerations

1. **Use appropriate loading strategies**
2. **Minimize critical scripts**
3. **Load scripts conditionally when possible**
4. **Use dependency management to avoid loading unnecessary scripts**
5. **Implement error boundaries for script failures**

## Migration from Inline Scripts

### Before (problematic)
```html
<head>
  <script>
    // This won't execute during SSR
    window.myGlobal = 'value';
  </script>
</head>
```

### After (working)
```tsx
// In layout.tsx
<head>
  <CriticalInlineScript id="globals">
    {`window.myGlobal = 'value';`}
  </CriticalInlineScript>
</head>

// Or in component
<ScriptHandler strategy="beforeInteractive" executeOnServer={true}>
  {`window.myGlobal = 'value';`}
</ScriptHandler>
```

## Verification File

The verification file `Netpub_confirm=831b33a650047ee11a992b11fdadd8f3_232c7b7723dc94b3a1e3e0dab2fabde6` has been created in the `public` folder and will be accessible at:

```
https://yourdomain.com/Netpub_confirm=831b33a650047ee11a992b11fdadd8f3_232c7b7723dc94b3a1e3e0dab2fabde6
```

This file is automatically served by Next.js from the public directory.
