"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";

// Hook for detecting touch gestures
export function useTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  threshold = 50,
  pinchThreshold = 0.1,
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
  pinchThreshold?: number;
}) {
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);
  const touchEnd = React.useRef<{ x: number; y: number } | null>(null);
  const initialDistance = React.useRef<number>(0);
  const currentDistance = React.useRef<number>(0);

  const getDistance = (touch1: Touch, touch2: Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      touchEnd.current = null;
      touchStart.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches[0], e.touches[1]);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && onPinch) {
      currentDistance.current = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance.current / initialDistance.current;
      
      if (Math.abs(scale - 1) > pinchThreshold) {
        onPinch(scale);
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart.current) return;

    touchEnd.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          onSwipeUp?.();
        } else {
          onSwipeDown?.();
        }
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

// Pull to refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isPulling, setIsPulling] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const startY = React.useRef<number>(0);

  const handleTouchStart = React.useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return;

    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [disabled, isRefreshing]);

  const handleTouchMove = React.useCallback((e: TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);

    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
    }
  }, [isPulling, disabled, isRefreshing, threshold]);

  const handleTouchEnd = React.useCallback(async () => {
    if (!isPulling || disabled || isRefreshing) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  }, [isPulling, disabled, isRefreshing, pullDistance, threshold, onRefresh]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const refreshProgress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div ref={containerRef} className={cn("relative overflow-auto", className)}>
      {/* Pull to refresh indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-10",
          "bg-background/90 backdrop-blur-sm border-b",
          isPulling || isRefreshing ? "opacity-100" : "opacity-0"
        )}
        style={{
          height: Math.max(pullDistance, isRefreshing ? 60 : 0),
          transform: `translateY(${isPulling ? 0 : -60}px)`,
        }}
      >
        <div className="flex items-center space-x-2 text-muted-foreground">
          <RefreshCw
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isRefreshing && "animate-spin",
              shouldTrigger && !isRefreshing && "text-primary"
            )}
            style={{
              transform: `rotate(${refreshProgress * 180}deg)`,
            }}
          />
          <span className="text-sm font-medium">
            {isRefreshing
              ? "Refreshing..."
              : shouldTrigger
              ? "Release to refresh"
              : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${isPulling ? pullDistance : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Swipe navigation component
interface SwipeNavigationProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
  className?: string;
  showIndicators?: boolean;
  disabled?: boolean;
}

export function SwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  children,
  className,
  showIndicators = true,
  disabled = false,
}: SwipeNavigationProps) {
  const [swipeDirection, setSwipeDirection] = React.useState<'left' | 'right' | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures({
    onSwipeLeft: () => {
      if (!disabled && onSwipeLeft) {
        setSwipeDirection('left');
        onSwipeLeft();
        setTimeout(() => setSwipeDirection(null), 300);
      }
    },
    onSwipeRight: () => {
      if (!disabled && onSwipeRight) {
        setSwipeDirection('right');
        onSwipeRight();
        setTimeout(() => setSwipeDirection(null), 300);
      }
    },
  });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Swipe indicators */}
      {showIndicators && (
        <>
          <div
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-300",
              "bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg",
              swipeDirection === 'right' ? "opacity-100 scale-110" : "opacity-0 scale-90"
            )}
          >
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          
          <div
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-300",
              "bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg",
              swipeDirection === 'left' ? "opacity-100 scale-110" : "opacity-0 scale-90"
            )}
          >
            <ArrowLeft className="h-5 w-5 text-primary" />
          </div>
        </>
      )}

      {children}
    </div>
  );
}

// Pinch to zoom image component
interface PinchToZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  maxZoom?: number;
  minZoom?: number;
}

export function PinchToZoomImage({
  src,
  alt,
  className,
  maxZoom = 3,
  minZoom = 1,
}: PinchToZoomImageProps) {
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const lastPanPoint = React.useRef({ x: 0, y: 0 });

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures({
    onPinch: (newScale) => {
      const clampedScale = Math.max(minZoom, Math.min(maxZoom, newScale));
      setScale(clampedScale);

      // Reset position if zooming out to minimum
      if (clampedScale === minZoom) {
        setPosition({ x: 0, y: 0 });
      }
    },
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const deltaX = e.clientX - lastPanPoint.current.x;
      const deltaY = e.clientY - lastPanPoint.current.y;

      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      lastPanPoint.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchmove', onTouchMove);
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted rounded-lg cursor-grab active:cursor-grabbing",
        isDragging && "cursor-grabbing",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        className="object-contain transition-transform duration-200"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
        }}
        draggable={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Zoom indicator */}
      {scale > 1 && (
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
}
