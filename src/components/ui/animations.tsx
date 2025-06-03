"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  duration?: number
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 500,
}: FadeInProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const directionClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

interface StaggeredFadeInProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function StaggeredFadeIn({
  children,
  className,
  staggerDelay = 100,
  direction = "up",
}: StaggeredFadeInProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          delay={index * staggerDelay}
          direction={direction}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  )
}

interface ScaleOnHoverProps {
  children: React.ReactNode
  className?: string
  scale?: number
}

export function ScaleOnHover({
  children,
  className,
  scale = 1.05,
}: ScaleOnHoverProps) {
  return (
    <div
      className={cn(
        "transition-transform duration-200 ease-out hover:scale-105",
        className
      )}
      style={{ "--tw-scale-x": scale, "--tw-scale-y": scale } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

interface FloatingProps {
  children: React.ReactNode
  className?: string
  intensity?: "subtle" | "normal" | "strong"
}

export function Floating({
  children,
  className,
  intensity = "normal",
}: FloatingProps) {
  const intensityClasses = {
    subtle: "hover:-translate-y-1",
    normal: "hover:-translate-y-2",
    strong: "hover:-translate-y-4",
  }

  return (
    <div
      className={cn(
        "transition-transform duration-300 ease-out",
        intensityClasses[intensity],
        className
      )}
    >
      {children}
    </div>
  )
}

interface PulseProps {
  children: React.ReactNode
  className?: string
  color?: "primary" | "success" | "warning" | "destructive"
}

export function Pulse({
  children,
  className,
  color = "primary",
}: PulseProps) {
  const colorClasses = {
    primary: "shadow-primary/25",
    success: "shadow-success/25",
    warning: "shadow-warning/25",
    destructive: "shadow-destructive/25",
  }

  return (
    <div
      className={cn(
        "animate-pulse shadow-lg",
        colorClasses[color],
        className
      )}
    >
      {children}
    </div>
  )
}

interface ShineEffectProps {
  children: React.ReactNode
  className?: string
}

export function ShineEffect({
  children,
  className,
}: ShineEffectProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden group",
        className
      )}
    >
      {children}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}
