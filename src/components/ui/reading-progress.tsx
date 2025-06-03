"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ReadingProgressProps {
  className?: string
  color?: "primary" | "success" | "warning" | "info"
  height?: number
  showPercentage?: boolean
}

export function ReadingProgress({
  className,
  color = "primary",
  height = 3,
  showPercentage = false,
}: ReadingProgressProps) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener("scroll", updateProgress)
    updateProgress() // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    info: "bg-info",
  }

  return (
    <>
      {/* Progress Bar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 bg-border transition-all duration-150",
          className
        )}
        style={{ height: `${height}px`, width: "100%" }}
      >
        <div
          className={cn(
            "h-full transition-all duration-150 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage Indicator (optional) */}
      {showPercentage && (
        <div className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border rounded-full px-3 py-1 text-xs font-medium text-foreground shadow-lg">
          {Math.round(progress)}%
        </div>
      )}
    </>
  )
}

interface TableOfContentsProps {
  className?: string
  headings: { id: string; text: string; level: number }[]
}

export function TableOfContents({
  className,
  headings,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%" }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (headings.length === 0) return null

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="font-semibold text-sm text-foreground mb-3">
        Table of Contents
      </h3>
      <nav className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <button
            key={id}
            onClick={() => scrollToHeading(id)}
            className={cn(
              "block w-full text-left text-sm transition-colors hover:text-primary",
              level === 2 && "pl-0",
              level === 3 && "pl-4",
              level === 4 && "pl-8",
              activeId === id
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            {text}
          </button>
        ))}
      </nav>
    </div>
  )
}

interface EstimatedReadTimeProps {
  content: string
  className?: string
  wordsPerMinute?: number
}

export function EstimatedReadTime({
  content,
  className,
  wordsPerMinute = 200,
}: EstimatedReadTimeProps) {
  const readTime = React.useMemo(() => {
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }, [content, wordsPerMinute])

  return (
    <span className={cn("text-sm text-muted-foreground", className)}>
      {readTime} min read
    </span>
  )
}

interface ScrollToTopProps {
  className?: string
  showAfter?: number
}

export function ScrollToTop({
  className,
  showAfter = 400,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > showAfter)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [showAfter])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary-hover transition-all duration-200 hover:scale-110",
        className
      )}
      aria-label="Scroll to top"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}
