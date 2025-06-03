import * as React from "react"
import Link from "next/link"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkeletonArticleCard } from "@/components/ui/skeleton"
import { OptimizedImage } from "@/components/ui/optimized-image"

interface ArticleCardProps {
  title: string
  description: string
  slug: string
  category: string
  date: string
  readTime?: string
  author?: string
  image?: string
  featured?: boolean
  className?: string
}

export function ArticleCard({
  title,
  description,
  slug,
  category,
  date,
  readTime,
  author,
  image,
  featured = false,
  className,
}: ArticleCardProps) {
  return (
    <Card 
      hover 
      interactive 
      className={cn(
        "group overflow-hidden",
        featured && "md:col-span-2 lg:col-span-2",
        className
      )}
    >
      {image && (
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={image}
            alt={title}
            width={400}
            height={192}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={featured}
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {category}
            </span>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
          {readTime && (
            <>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </>
          )}
          {author && (
            <>
              <span>•</span>
              <User className="h-4 w-4" />
              <span>{author}</span>
            </>
          )}
        </div>
        
        <CardTitle className={cn(
          "line-clamp-2 group-hover:text-primary transition-colors",
          featured ? "text-2xl" : "text-xl"
        )}>
          {title}
        </CardTitle>
        
        <CardDescription className={cn(
          "line-clamp-3",
          featured ? "text-base" : "text-sm"
        )}>
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Button
          variant="ghost"
          className="group/btn p-0 h-auto font-medium text-primary hover:text-primary-hover"
          asChild
        >
          <Link href={`/${category}/${slug}`} className="flex items-center">
            Read more
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function ArticleCardSkeleton({ featured = false }: { featured?: boolean }) {
  return <SkeletonArticleCard featured={featured} />;
}
