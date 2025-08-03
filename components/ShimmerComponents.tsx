import React from 'react';

// Loading Shimmer Skeleton
export function LoadingSkeleton({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={`loading-shimmer ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i} 
          className={`loading-shimmer-line ${
            i === 0 ? 'long' : i === lines - 1 ? 'short' : 'medium'
          }`} 
        />
      ))}
    </div>
  );
}

// Card Shimmer Wrapper
export function ShimmerCard({ 
  children, 
  className = '',
  variant = 'default'
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: 'default' | 'glow' | 'pulse';
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'glow':
        return 'shimmer-glow';
      case 'pulse':
        return 'shimmer-pulse';
      default:
        return 'shimmer-card';
    }
  };

  return (
    <div className={`${getVariantClass()} ${className}`}>
      {children}
    </div>
  );
}

// Text Shimmer Effect
export function ShimmerText({ 
  children, 
  className = '',
  enabled = true
}: { 
  children: React.ReactNode; 
  className?: string;
  enabled?: boolean;
}) {
  return (
    <span className={`${enabled ? 'shimmer-text' : ''} ${className}`}>
      {children}
    </span>
  );
}

// Button with Shimmer Effect
export function ShimmerButton({ 
  children, 
  className = '',
  variant = 'default',
  ...props
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: 'default' | 'shimmer';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className={`${variant === 'shimmer' ? 'shimmer-button' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Icon with Shimmer Glow
export function ShimmerIcon({ 
  children, 
  className = '',
  enabled = true
}: { 
  children: React.ReactNode; 
  className?: string;
  enabled?: boolean;
}) {
  return (
    <div className={`${enabled ? 'shimmer-icon' : ''} ${className}`}>
      {children}
    </div>
  );
}

// Wave Background Shimmer
export function ShimmerWave({ 
  className = '',
  intensity = 'normal'
}: { 
  className?: string;
  intensity?: 'light' | 'normal' | 'strong';
}) {
  const intensityClass = {
    light: 'opacity-20',
    normal: 'opacity-40',
    strong: 'opacity-60'
  };

  return (
    <div className={`shimmer-wave ${intensityClass[intensity]} ${className}`} />
  );
}

// Hover Shimmer Wrapper
export function HoverShimmer({ 
  children, 
  className = ''
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`hover-shimmer ${className}`}>
      {children}
    </div>
  );
}

// Full Page Loading Shimmer
export function PageLoadingShimmer() {
  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header Shimmer */}
      <div className="flex justify-between items-center mb-8">
        <div className="loading-shimmer-line" style={{ width: '200px', height: '40px' }} />
        <div className="flex space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="loading-shimmer-line" 
              style={{ width: '80px', height: '20px' }} 
            />
          ))}
        </div>
      </div>

      {/* Hero Section Shimmer */}
      <div className="text-center mb-16">
        <div className="loading-shimmer-line mx-auto mb-4" style={{ width: '600px', height: '60px' }} />
        <div className="loading-shimmer-line mx-auto mb-8" style={{ width: '400px', height: '24px' }} />
        <div className="flex justify-center space-x-4">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className="loading-shimmer-line" 
              style={{ width: '120px', height: '48px' }} 
            />
          ))}
        </div>
      </div>

      {/* Content Cards Shimmer */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card p-6 rounded-lg border border-border">
            <div className="loading-shimmer-line mb-4" style={{ width: '60px', height: '60px' }} />
            <div className="loading-shimmer-line mb-4" style={{ width: '80%', height: '28px' }} />
            <LoadingSkeleton lines={3} className="mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center space-x-2">
                  <div className="loading-shimmer-line" style={{ width: '16px', height: '16px' }} />
                  <div className="loading-shimmer-line flex-1" style={{ height: '16px' }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shimmer Overlay for Loading States
export function ShimmerOverlay({ 
  isLoading, 
  children 
}: { 
  isLoading: boolean; 
  children: React.ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-card/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="loading-shimmer max-w-md w-full p-4">
            <LoadingSkeleton lines={5} />
          </div>
        </div>
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Animated Statistics with Shimmer
export function ShimmerStats({ 
  stats,
  isLoading = false
}: { 
  stats: { value: string; label: string }[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {stats.map((_, index) => (
          <div key={index} className="text-center">
            <div className="loading-shimmer-line mx-auto mb-2" style={{ width: '60px', height: '32px' }} />
            <div className="loading-shimmer-line mx-auto" style={{ width: '80px', height: '16px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <ShimmerText className="text-2xl md:text-3xl font-bold text-primary mb-1">
            {stat.value}
          </ShimmerText>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}