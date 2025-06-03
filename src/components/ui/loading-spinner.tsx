import * as React from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string
}

export function LoadingSpinner({
  className,
  size,
  variant,
  text,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      <Loader2 className={cn(spinnerVariants({ size, variant }))} />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  children: React.ReactNode
}

export function LoadingOverlay({
  isLoading,
  text = "Loading...",
  children,
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner text={text} size="lg" />
        </div>
      )}
    </div>
  )
}

export function LoadingPage({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner text={text} size="xl" />
    </div>
  )
}
