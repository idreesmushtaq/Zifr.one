import React, { createContext, useContext, useState, useEffect } from 'react';

// Three.js global instance manager to prevent multiple imports
class ThreeInstanceManager {
  private static instance: ThreeInstanceManager;
  private threeLoaded: boolean = false;
  private threeInstance: any = null;
  private loadPromise: Promise<any> | null = null;

  static getInstance(): ThreeInstanceManager {
    if (!ThreeInstanceManager.instance) {
      ThreeInstanceManager.instance = new ThreeInstanceManager();
    }
    return ThreeInstanceManager.instance;
  }

  async getThree(): Promise<any> {
    if (this.threeLoaded && this.threeInstance) {
      return this.threeInstance;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.loadThreeJS();
    return this.loadPromise;
  }

  private async loadThreeJS(): Promise<any> {
    try {
      // Check if Three.js is already loaded globally
      if (typeof window !== 'undefined' && (window as any).THREE) {
        this.threeInstance = (window as any).THREE;
        this.threeLoaded = true;
        return this.threeInstance;
      }

      // Dynamic import to prevent multiple instances
      const THREE = await import('three');
      
      // Set global reference to prevent multiple loads
      if (typeof window !== 'undefined') {
        (window as any).THREE = THREE;
      }
      
      this.threeInstance = THREE;
      this.threeLoaded = true;
      
      console.log('Three.js loaded successfully');
      return THREE;
    } catch (error) {
      console.error('Failed to load Three.js:', error);
      throw error;
    }
  }

  isLoaded(): boolean {
    return this.threeLoaded;
  }

  reset(): void {
    this.threeLoaded = false;
    this.threeInstance = null;
    this.loadPromise = null;
  }
}

// Three.js context to prevent multiple instances
interface ThreeContextType {
  isThreeReady: boolean;
  hasError: boolean;
  setError: (error: boolean) => void;
  getThreeInstance: () => Promise<any>;
}

const ThreeContext = createContext<ThreeContextType>({
  isThreeReady: false,
  hasError: false,
  setError: () => {},
  getThreeInstance: async () => null,
});

export const useThree = () => useContext(ThreeContext);

// Enhanced error boundary for Three.js
class ThreeGlobalErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: boolean) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onError: (error: boolean) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Only log Three.js related errors to reduce noise
    if (error.message?.toLowerCase().includes('three') || 
        error.stack?.toLowerCase().includes('three') ||
        error.message?.toLowerCase().includes('webgl')) {
      console.error('Three.js Global Error:', error);
    } else {
      console.error('Component Error:', error.message);
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced error logging with context
    const isThreeError = error.message?.toLowerCase().includes('three') || 
                        error.stack?.toLowerCase().includes('three') ||
                        error.message?.toLowerCase().includes('webgl') ||
                        error.message?.toLowerCase().includes('businessnumber');

    if (isThreeError) {
      console.error('Three.js Error Details:', { 
        error: error.message, 
        componentStack: errorInfo.componentStack,
        errorBoundary: 'ThreeGlobalErrorBoundary'
      });
    }

    this.props.onError(true);

    // Reset Three.js instance on critical errors
    if (isThreeError) {
      try {
        ThreeInstanceManager.getInstance().reset();
      } catch (resetError) {
        console.warn('Failed to reset Three.js instance:', resetError);
      }
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.state.hasError && !prevState.hasError) {
      this.props.onError(true);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/10" />
      );
    }

    return this.props.children;
  }
}

export function ThreeProvider({ children }: { children: React.ReactNode }) {
  const [isThreeReady, setIsThreeReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const threeManager = ThreeInstanceManager.getInstance();

  useEffect(() => {
    let initTimer: NodeJS.Timeout;
    let mounted = true;
    
    const initializeThree = async () => {
      try {
        // Check if WebGL is supported
        if (typeof window !== 'undefined') {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          
          if (!gl) {
            console.warn('WebGL not supported, Three.js disabled');
            setHasError(true);
            return;
          }
        }

        // Pre-load Three.js instance
        await threeManager.getThree();
        
        // Delay ready state to prevent conflicts
        if (mounted) {
          initTimer = setTimeout(() => {
            if (mounted && !hasError) {
              setIsThreeReady(true);
            }
          }, 300);
        }
      } catch (error) {
        console.error('Three.js initialization error:', error);
        if (mounted) {
          setHasError(true);
        }
      }
    };

    // Global error handler for Three.js and related errors
    const handleGlobalError = (event: ErrorEvent) => {
      const errorMessage = event.message?.toLowerCase() || '';
      const isRelevantError = errorMessage.includes('three') || 
                             errorMessage.includes('webgl') || 
                             errorMessage.includes('shader') ||
                             errorMessage.includes('businessnumber') ||
                             errorMessage.includes('whatsapp');

      if (isRelevantError) {
        console.error('Global Three.js/App Error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
        
        if (mounted) {
          setHasError(true);
        }
      }
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message?.toLowerCase() || '';
      const isRelevantError = reason.includes('three') || 
                             reason.includes('webgl') ||
                             reason.includes('businessnumber');

      if (isRelevantError) {
        console.error('Unhandled Promise Rejection (Three.js related):', event.reason);
        if (mounted) {
          setHasError(true);
        }
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Initialize Three.js if not already errored
    if (!hasError) {
      initializeThree();
    }

    return () => {
      mounted = false;
      if (initTimer) clearTimeout(initTimer);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [hasError, threeManager]);

  const getThreeInstance = async () => {
    try {
      return await threeManager.getThree();
    } catch (error) {
      console.error('Failed to get Three.js instance:', error);
      setHasError(true);
      return null;
    }
  };

  const contextValue: ThreeContextType = {
    isThreeReady: isThreeReady && !hasError,
    hasError,
    setError: setHasError,
    getThreeInstance,
  };

  return (
    <ThreeContext.Provider value={contextValue}>
      <ThreeGlobalErrorBoundary onError={setHasError}>
        {children}
      </ThreeGlobalErrorBoundary>
    </ThreeContext.Provider>
  );
}

// Enhanced Three.js component wrapper with better error handling
export function withThreeErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return React.forwardRef<any, P>((props, ref) => {
    const { isThreeReady, hasError } = useThree();
    
    if (hasError || !isThreeReady) {
      return fallback || (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/10" />
      );
    }

    try {
      return <Component {...props} ref={ref} />;
    } catch (error) {
      console.error('Component render error:', error);
      return fallback || (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 to-primary/10" />
      );
    }
  });
}

// Safe Three.js loader hook with enhanced error handling
export function useSafeThree() {
  const { isThreeReady, hasError, getThreeInstance } = useThree();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isThreeReady && !hasError) {
      timer = setTimeout(() => setMounted(true), 150);
    } else if (hasError) {
      setMounted(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isThreeReady, hasError]);

  return {
    shouldRender: mounted && isThreeReady && !hasError,
    isLoading: !mounted && isThreeReady && !hasError,
    hasError,
    getThreeInstance: hasError ? async () => null : getThreeInstance,
  };
}

// Utility to check if Three.js is available
export function isThreeAvailable(): boolean {
  try {
    return ThreeInstanceManager.getInstance().isLoaded() || 
           (typeof window !== 'undefined' && !!(window as any).THREE);
  } catch {
    return false;
  }
}

// Cleanup function for Three.js resources
export function cleanupThreeResources(): void {
  try {
    ThreeInstanceManager.getInstance().reset();
    if (typeof window !== 'undefined' && (window as any).THREE) {
      delete (window as any).THREE;
    }
  } catch (error) {
    console.warn('Error cleaning up Three.js resources:', error);
  }
}