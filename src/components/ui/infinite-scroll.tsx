"use client";

import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  error?: string | null;
  threshold?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
  initialLoad?: boolean;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  isLoading,
  error,
  threshold = 100,
  className,
  loadingComponent,
  errorComponent,
  endMessage,
  initialLoad = true,
}: InfiniteScrollProps<T>) {
  const [hasLoadedInitially, setHasLoadedInitially] = React.useState(!initialLoad);
  const observerRef = React.useRef<HTMLDivElement>(null);
  const isLoadingRef = React.useRef(isLoading);

  // Update loading ref
  React.useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // Initial load
  React.useEffect(() => {
    if (initialLoad && !hasLoadedInitially && !isLoading) {
      setHasLoadedInitially(true);
      loadMore();
    }
  }, [initialLoad, hasLoadedInitially, isLoading, loadMore]);

  // Intersection Observer for infinite scroll
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          hasMore &&
          !isLoadingRef.current &&
          hasLoadedInitially
        ) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, threshold, loadMore, hasLoadedInitially]);

  const handleRetry = () => {
    if (!isLoading) {
      loadMore();
    }
  };

  const defaultLoadingComponent = (
    <div className="flex justify-center py-8">
      <LoadingSpinner text="Loading more..." />
    </div>
  );

  const defaultErrorComponent = (
    <div className="flex flex-col items-center py-8 space-y-4">
      <p className="text-muted-foreground">Failed to load more items</p>
      <Button variant="outline" onClick={handleRetry} disabled={isLoading}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-8">
      <p className="text-muted-foreground">You've reached the end!</p>
    </div>
  );

  return (
    <div className={className}>
      {/* Render items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}

      {/* Loading state */}
      {isLoading && (loadingComponent || defaultLoadingComponent)}

      {/* Error state */}
      {error && !isLoading && (errorComponent || defaultErrorComponent)}

      {/* End message */}
      {!hasMore && !isLoading && !error && items.length > 0 && (
        endMessage || defaultEndMessage
      )}

      {/* Observer target */}
      {hasMore && !error && <div ref={observerRef} className="h-1" />}
    </div>
  );
}

// Hook for managing infinite scroll state
export function useInfiniteScroll<T>(
  fetchFunction: (page: number) => Promise<{ items: T[]; hasMore: boolean }>,
  initialPage = 1
) {
  const [items, setItems] = React.useState<T[]>([]);
  const [page, setPage] = React.useState(initialPage);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadMore = React.useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page);
      
      setItems(prev => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, page, isLoading, hasMore]);

  const reset = React.useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setIsLoading(false);
    setError(null);
  }, [initialPage]);

  const refresh = React.useCallback(async () => {
    reset();
    // Load first page after reset
    setTimeout(() => {
      loadMore();
    }, 0);
  }, [reset, loadMore]);

  return {
    items,
    hasMore,
    isLoading,
    error,
    loadMore,
    reset,
    refresh,
  };
}

// Virtualized infinite scroll for large lists
interface VirtualizedInfiniteScrollProps<T> extends InfiniteScrollProps<T> {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function VirtualizedInfiniteScroll<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
}: VirtualizedInfiniteScrollProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight }}
      className="overflow-auto"
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
