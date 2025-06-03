"use client";

import * as React from "react";
import { Loader2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingOverlayProps {
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
  onRetry?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: "overlay" | "inline" | "card";
  size?: "sm" | "md" | "lg";
}

export function LoadingOverlay({
  isLoading = false,
  error = null,
  success = null,
  onRetry,
  className,
  children,
  variant = "overlay",
  size = "md"
}: LoadingOverlayProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );

  const ErrorContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <AlertCircle className={cn("text-destructive", sizeClasses[size])} />
      <div className="space-y-2">
        <p className="text-sm font-medium text-destructive">Something went wrong</p>
        <p className="text-xs text-muted-foreground">{error}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      )}
    </div>
  );

  const SuccessContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <CheckCircle className={cn("text-green-600", sizeClasses[size])} />
      <p className="text-sm font-medium text-green-600">{success}</p>
    </div>
  );

  if (variant === "overlay") {
    return (
      <div className={cn("relative", className)}>
        {children}
        {(isLoading || error || success) && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            {isLoading && <LoadingContent />}
            {error && <ErrorContent />}
            {success && <SuccessContent />}
          </div>
        )}
      </div>
    );
  }

  if (variant === "card") {
    if (isLoading || error || success) {
      return (
        <Card className={className}>
          <CardContent className="p-8">
            {isLoading && <LoadingContent />}
            {error && <ErrorContent />}
            {success && <SuccessContent />}
          </CardContent>
        </Card>
      );
    }
    return <>{children}</>;
  }

  // Inline variant
  if (isLoading || error || success) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        {isLoading && <LoadingContent />}
        {error && <ErrorContent />}
        {success && <SuccessContent />}
      </div>
    );
  }

  return <>{children}</>;
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
}

export function ProgressBar({
  progress,
  className,
  showPercentage = false,
  color = "primary"
}: ProgressBarProps) {
  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    destructive: "bg-destructive"
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-muted-foreground text-center">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface PulseLoaderProps {
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PulseLoader({ count = 3, size = "md", className }: PulseLoaderProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  };

  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-primary rounded-full animate-pulse",
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: "1s"
          }}
        />
      ))}
    </div>
  );
}

interface SkeletonPulseProps {
  className?: string;
  children?: React.ReactNode;
}

export function SkeletonPulse({ className, children }: SkeletonPulseProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {children}
    </div>
  );
}

interface LoadingStateProps {
  state: "idle" | "loading" | "success" | "error";
  loadingText?: string;
  successText?: string;
  errorText?: string;
  onRetry?: () => void;
  className?: string;
}

export function LoadingState({
  state,
  loadingText = "Loading...",
  successText = "Success!",
  errorText = "Something went wrong",
  onRetry,
  className
}: LoadingStateProps) {
  if (state === "idle") return null;

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 p-8", className)}>
      {state === "loading" && (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </>
      )}

      {state === "success" && (
        <>
          <CheckCircle className="h-8 w-8 text-green-600" />
          <p className="text-sm font-medium text-green-600">{successText}</p>
        </>
      )}

      {state === "error" && (
        <>
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-destructive">{errorText}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
