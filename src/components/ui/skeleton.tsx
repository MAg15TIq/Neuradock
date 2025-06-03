"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

// Text skeleton variants
export function SkeletonText({ 
  lines = 1, 
  className,
  ...props 
}: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

// Avatar skeleton
export function SkeletonAvatar({ 
  size = "default",
  className,
  ...props 
}: SkeletonProps & { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Skeleton
      className={cn(
        "rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

// Button skeleton
export function SkeletonButton({ 
  size = "default",
  className,
  ...props 
}: SkeletonProps & { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-20",
    default: "h-10 w-24",
    lg: "h-12 w-28"
  };

  return (
    <Skeleton
      className={cn(
        "rounded-md",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

// Card skeleton
export function SkeletonCard({ 
  hasImage = true,
  hasAvatar = true,
  textLines = 3,
  className,
  ...props 
}: SkeletonProps & { 
  hasImage?: boolean;
  hasAvatar?: boolean;
  textLines?: number;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)} {...props}>
      {hasImage && (
        <Skeleton className="h-48 w-full rounded-lg" />
      )}
      
      <div className="space-y-3">
        {hasAvatar && (
          <div className="flex items-center space-x-3">
            <SkeletonAvatar />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <SkeletonText lines={textLines} />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <SkeletonButton size="sm" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Article card skeleton
export function SkeletonArticleCard({ 
  featured = false,
  className,
  ...props 
}: SkeletonProps & { featured?: boolean }) {
  return (
    <div 
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        featured && "md:col-span-2 lg:col-span-2",
        className
      )} 
      {...props}
    >
      <Skeleton className={cn(
        "w-full",
        featured ? "h-64" : "h-48"
      )} />
      
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className={cn(
            "h-6",
            featured ? "w-full" : "w-5/6"
          )} />
          <SkeletonText lines={featured ? 3 : 2} />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <SkeletonAvatar size="sm" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

// List item skeleton
export function SkeletonListItem({ 
  hasImage = false,
  className,
  ...props 
}: SkeletonProps & { hasImage?: boolean }) {
  return (
    <div className={cn("flex items-center space-x-4 p-4", className)} {...props}>
      {hasImage && (
        <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
      )}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}

// Navigation skeleton
export function SkeletonNavigation({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("flex items-center justify-between p-4", className)} {...props}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-6 w-24" />
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-16" />
        ))}
      </div>
      
      <div className="flex items-center space-x-3">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

// Table skeleton
export function SkeletonTable({ 
  rows = 5,
  columns = 4,
  className,
  ...props 
}: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Header */}
      <div className="flex space-x-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={cn(
                "h-4 flex-1",
                colIndex === 0 && "w-1/4",
                colIndex === columns - 1 && "w-1/6"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Page skeleton
export function SkeletonPage({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-8 p-6", className)} {...props}>
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <SkeletonText lines={2} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
