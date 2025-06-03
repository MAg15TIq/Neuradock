"use client"

import * as React from "react"
import { Share2, Twitter, Facebook, Linkedin, Link2, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SocialShareProps {
  url: string
  title: string
  description?: string
  className?: string
  variant?: "button" | "inline" | "floating"
}

export function SocialShare({
  url,
  title,
  description = "",
  className,
  variant = "button",
}: SocialShareProps) {
  const [copied, setCopied] = React.useState(false)

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareData.title}&url=${shareData.url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
    email: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`,
    whatsapp: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer")
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="text-sm font-medium text-muted-foreground">Share:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openShare("twitter")}
            className="hover:text-blue-500"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openShare("facebook")}
            className="hover:text-blue-600"
          >
            <Facebook className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openShare("linkedin")}
            className="hover:text-blue-700"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={copyToClipboard}
            className="hover:text-green-600"
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (variant === "floating") {
    return (
      <div className={cn("fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2", className)}>
        <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openShare("twitter")}
              className="hover:text-blue-500"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openShare("facebook")}
              className="hover:text-blue-600"
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openShare("linkedin")}
              className="hover:text-blue-700"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={copyToClipboard}
              className="hover:text-green-600"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default button variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => openShare("twitter")}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShare("facebook")}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShare("linkedin")}>
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShare("whatsapp")}>
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShare("email")}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Link2 className="h-4 w-4 mr-2" />
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ShareButtonProps {
  platform: "twitter" | "facebook" | "linkedin" | "email" | "whatsapp"
  url: string
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function ShareButton({
  platform,
  url,
  title,
  description = "",
  className,
  children,
}: ShareButtonProps) {
  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareData.title}&url=${shareData.url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
    email: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`,
    whatsapp: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
  }

  const icons = {
    twitter: Twitter,
    facebook: Facebook,
    linkedin: Linkedin,
    email: Mail,
    whatsapp: MessageCircle,
  }

  const colors = {
    twitter: "hover:text-info",
    facebook: "hover:text-primary",
    linkedin: "hover:text-primary",
    email: "hover:text-muted-foreground",
    whatsapp: "hover:text-success",
  }

  const Icon = icons[platform]

  const handleShare = () => {
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={cn(colors[platform], className)}
    >
      <Icon className="h-4 w-4 mr-2" />
      {children || platform.charAt(0).toUpperCase() + platform.slice(1)}
    </Button>
  )
}
