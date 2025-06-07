'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ScriptState {
  loaded: boolean;
  error: Error | null;
}

interface ScriptManagerContextType {
  scripts: Record<string, ScriptState>;
  loadScript: (id: string, src: string, options?: LoadScriptOptions) => Promise<void>;
  executeInlineScript: (id: string, code: string, options?: ExecuteScriptOptions) => void;
  isScriptLoaded: (id: string) => boolean;
}

interface LoadScriptOptions {
  async?: boolean;
  defer?: boolean;
  crossOrigin?: string;
  integrity?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface ExecuteScriptOptions {
  executeOnServer?: boolean;
  dependencies?: string[];
  onExecute?: () => void;
  onError?: (error: Error) => void;
}

const ScriptManagerContext = createContext<ScriptManagerContextType | null>(null);

export function ScriptManagerProvider({ children }: { children: ReactNode }) {
  const [scripts, setScripts] = useState<Record<string, ScriptState>>({});

  const loadScript = async (id: string, src: string, options: LoadScriptOptions = {}) => {
    // Check if script is already loaded
    if (scripts[id]?.loaded) {
      return;
    }

    // Check if script element already exists
    const existingScript = document.querySelector(`script[data-script-id="${id}"]`);
    if (existingScript) {
      setScripts(prev => ({
        ...prev,
        [id]: { loaded: true, error: null }
      }));
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = options.async ?? true;
      script.defer = options.defer ?? false;
      script.setAttribute('data-script-id', id);

      if (options.crossOrigin) {
        script.crossOrigin = options.crossOrigin;
      }

      if (options.integrity) {
        script.integrity = options.integrity;
      }

      script.onload = () => {
        setScripts(prev => ({
          ...prev,
          [id]: { loaded: true, error: null }
        }));
        options.onLoad?.();
        resolve();
      };

      script.onerror = () => {
        const error = new Error(`Failed to load script: ${src}`);
        setScripts(prev => ({
          ...prev,
          [id]: { loaded: false, error }
        }));
        options.onError?.(error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  };

  const executeInlineScript = (id: string, code: string, options: ExecuteScriptOptions = {}) => {
    try {
      // Check dependencies
      if (options.dependencies) {
        const unloadedDeps = options.dependencies.filter(dep => !scripts[dep]?.loaded);
        if (unloadedDeps.length > 0) {
          console.warn(`Script ${id} has unloaded dependencies:`, unloadedDeps);
          return;
        }
      }

      // Server-side execution (limited)
      if (options.executeOnServer && typeof window === 'undefined') {
        // Only execute safe scripts on server
        if (!code.includes('document') && !code.includes('window') && !code.includes('localStorage')) {
          eval(code);
        }
      }

      // Client-side execution
      if (typeof window !== 'undefined') {
        eval(code);
        setScripts(prev => ({
          ...prev,
          [id]: { loaded: true, error: null }
        }));
        options.onExecute?.();
      }
    } catch (error) {
      const scriptError = error instanceof Error ? error : new Error('Script execution failed');
      setScripts(prev => ({
        ...prev,
        [id]: { loaded: false, error: scriptError }
      }));
      options.onError?.(scriptError);
    }
  };

  const isScriptLoaded = (id: string) => {
    return scripts[id]?.loaded ?? false;
  };

  const contextValue: ScriptManagerContextType = {
    scripts,
    loadScript,
    executeInlineScript,
    isScriptLoaded
  };

  return (
    <ScriptManagerContext.Provider value={contextValue}>
      {children}
    </ScriptManagerContext.Provider>
  );
}

export function useScriptManager() {
  const context = useContext(ScriptManagerContext);
  if (!context) {
    throw new Error('useScriptManager must be used within a ScriptManagerProvider');
  }
  return context;
}

/**
 * Hook for loading external scripts with dependency management
 */
export function useExternalScript(
  id: string, 
  src: string, 
  options?: LoadScriptOptions & { dependencies?: string[] }
) {
  const { loadScript, isScriptLoaded, scripts } = useScriptManager();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isScriptLoaded(id)) return;

    // Check dependencies
    if (options?.dependencies) {
      const unloadedDeps = options.dependencies.filter(dep => !isScriptLoaded(dep));
      if (unloadedDeps.length > 0) {
        return; // Wait for dependencies
      }
    }

    setLoading(true);
    loadScript(id, src, {
      ...options,
      onLoad: () => {
        setLoading(false);
        options?.onLoad?.();
      },
      onError: (error) => {
        setLoading(false);
        options?.onError?.(error);
      }
    });
  }, [id, src, options, loadScript, isScriptLoaded]);

  return {
    loaded: isScriptLoaded(id),
    loading,
    error: scripts[id]?.error || null
  };
}

/**
 * Hook for executing inline scripts with dependency management
 */
export function useInlineScript(
  id: string,
  code: string,
  options?: ExecuteScriptOptions
) {
  const { executeInlineScript, isScriptLoaded, scripts } = useScriptManager();

  useEffect(() => {
    if (isScriptLoaded(id)) return;

    executeInlineScript(id, code, options);
  }, [id, code, options, executeInlineScript, isScriptLoaded]);

  return {
    executed: isScriptLoaded(id),
    error: scripts[id]?.error || null
  };
}
