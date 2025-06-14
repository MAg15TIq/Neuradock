// NetPub global type declarations

declare global {
  interface Window {
    // NetPub script loading state
    netpubScriptLoaded?: boolean;
    netpubScriptLoading?: boolean;
    netpubLoadFailed?: boolean;
    netpubRetryCount?: number;

    // NetPub objects
    netpub?: any;
    NetPub?: any;

    // NetPub engine flag
    __npEngineRun_831b33a650047ee11a992b11fdadd8f3?: boolean;

    // NetPub utility functions
    retryNetpubLoad?: () => void;
    netpubDiagnostics?: () => {
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
    };
  }

  // NetPub custom events
  interface WindowEventMap {
    netpubLoaded: CustomEvent<{
      publisherId: string;
      timestamp: number;
      url?: string;
      urlIndex?: number;
      retryCount?: number;
      hasNetpub?: boolean;
      hasEngine?: boolean;
      fallback?: boolean;
    }>;
    netpubLoadFailed: CustomEvent<{
      publisherId: string;
      error: string;
      retryCount: number;
      urlsTried: number;
      lastAttempt: string;
    }>;
  }
}

export {};
