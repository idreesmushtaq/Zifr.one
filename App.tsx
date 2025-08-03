import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner@2.0.3';
import Header from './components/Header';
import Footer from './components/Footer';
import { ScrollToTop } from './components/AnimatedElements';
import { ThreeProvider } from './components/ThreeProvider';
import { PageLoadingShimmer } from './components/ShimmerComponents';

// Lazy load all page components for better performance
const Home = React.lazy(() => import('./components/pages/Home'));
const About = React.lazy(() => import('./components/pages/About'));
const Services = React.lazy(() => import('./components/pages/Services'));
const Contact = React.lazy(() => import('./components/pages/Contact'));

// Enhanced loading component with layout preservation
function PageLoader() {
  return (
    <div className="min-h-screen">
      <PageLoadingShimmer />
    </div>
  );
}

// Layout wrapper to prevent layout shift
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Ensure layout is properly mounted before showing content
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <PageLoader />;
  }

  return <>{children}</>;
}

// Component-specific error boundary
class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName?: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; componentName?: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.componentName || 'Unknown Component';
    console.error(`Component Error in ${componentName}:`, error);
    console.error('Error Info:', errorInfo);
    
    // Report to error tracking service in production
    if (import.meta.env.PROD) {
      try {
        // You can integrate with error tracking services here
        console.error('Production error reported:', { 
          component: componentName,
          error: error.message,
          stack: error.stack,
          errorInfo 
        });
      } catch (reportingError) {
        console.warn('Failed to report error:', reportingError);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white">⚠</span>
            </div>
            <h3 className="text-lg text-foreground mb-2">Component Error</h3>
            <p className="text-muted-foreground text-sm mb-4">
              This section is temporarily unavailable. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="gradient-button px-4 py-2 text-sm rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced error boundary for the entire app
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
    
    // Report to error tracking service in production
    if (import.meta.env.PROD) {
      try {
        // You can integrate with error tracking services here
        console.error('Production app error reported:', { error, errorInfo });
      } catch (reportingError) {
        console.warn('Failed to report app error:', reportingError);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">⚠</span>
            </div>
            <h1 className="text-2xl font-medium text-foreground mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="gradient-button w-full px-6 py-3 rounded-lg"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Go to Homepage
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error Details (Development Mode)
                </summary>
                <pre className="mt-2 text-xs text-destructive bg-muted p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.error.stack && '\n\nStack Trace:\n' + this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route component wrapper with enhanced error handling
function RouteWrapper({ 
  component: Component, 
  componentName 
}: { 
  component: React.LazyExoticComponent<() => JSX.Element>;
  componentName: string;
}) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ComponentErrorBoundary componentName={componentName}>
        <LayoutWrapper>
          <Component />
        </LayoutWrapper>
      </ComponentErrorBoundary>
    </Suspense>
  );
}

export default function App() {
  const [appMounted, setAppMounted] = React.useState(false);

  React.useEffect(() => {
    // Ensure the entire app is properly mounted
    const mountTimer = setTimeout(() => {
      setAppMounted(true);
    }, 50);

    // Remove initial loading screen if it exists
    const removeInitialLoader = () => {
      try {
        const initialLoader = document.getElementById('initial-loading');
        if (initialLoader) {
          initialLoader.style.opacity = '0';
          setTimeout(() => {
            try {
              initialLoader.remove();
            } catch (error) {
              console.warn('Failed to remove initial loader:', error);
            }
          }, 300);
        }
      } catch (error) {
        console.warn('Error removing initial loader:', error);
      }
    };

    const readyTimer = setTimeout(removeInitialLoader, 1000);

    // Global error handler for unhandled errors
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(readyTimer);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!appMounted) {
    return (
      <div className="min-h-screen bg-background">
        <PageLoader />
      </div>
    );
  }

  return (
    <AppErrorBoundary>
      <ThreeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-background">
            {/* Header with error boundary */}
            <ComponentErrorBoundary componentName="Header">
              <Suspense fallback={
                <div className="h-16 bg-card/80 backdrop-blur-sm border-b border-border">
                  <div className="loading-shimmer-line h-full" />
                </div>
              }>
                <Header />
              </Suspense>
            </ComponentErrorBoundary>

            {/* Main content with lazy loaded pages */}
            <main className="flex-1">
              <Routes>
                <Route 
                  path="/" 
                  element={<RouteWrapper component={Home} componentName="Home" />} 
                />
                <Route 
                  path="/about" 
                  element={<RouteWrapper component={About} componentName="About" />} 
                />
                <Route 
                  path="/services" 
                  element={<RouteWrapper component={Services} componentName="Services" />} 
                />
                <Route 
                  path="/contact" 
                  element={<RouteWrapper component={Contact} componentName="Contact" />} 
                />
                {/* 404 Route */}
                <Route 
                  path="*" 
                  element={
                    <ComponentErrorBoundary componentName="404Page">
                      <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="text-center p-8">
                          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
                          <p className="text-muted-foreground mb-6">Page not found</p>
                          <button
                            onClick={() => window.location.href = '/'}
                            className="gradient-button px-6 py-3 rounded-lg"
                          >
                            Go Home
                          </button>
                        </div>
                      </div>
                    </ComponentErrorBoundary>
                  } 
                />
              </Routes>
            </main>

            {/* Footer with error boundary */}
            <ComponentErrorBoundary componentName="Footer">
              <Suspense fallback={
                <div className="h-32 bg-white border-t border-border">
                  <div className="loading-shimmer-line h-full" />
                </div>
              }>
                <Footer />
              </Suspense>
            </ComponentErrorBoundary>

            {/* Scroll to top component */}
            <ComponentErrorBoundary componentName="ScrollToTop">
              <ScrollToTop />
            </ComponentErrorBoundary>

            {/* Toast notifications */}
            <Toaster 
              position="top-right"
              richColors
              closeButton
              theme="light"
              duration={4000}
              visibleToasts={3}
            />
          </div>
        </Router>
      </ThreeProvider>
    </AppErrorBoundary>
  );
}